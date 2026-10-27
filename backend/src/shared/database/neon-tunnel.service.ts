import net from 'net';
import tls from 'tls';
import dns from 'dns';
import { logger } from '../utils/logger';

const SSL_REQUEST = Buffer.from([0, 0, 0, 8, 0x04, 0xd2, 0x16, 0x2f]);
const FALLBACK_IPS = ['52.14.39.200', '77.112.100.143', '52.95.251.153'];
const TUNNEL_PORT = 54322;
const TUNNEL_HOST = '127.0.0.1';

let isTunnelInitialized = false;
let activeTunnelUrl = '';
let resolvedIp = FALLBACK_IPS[0];
let serverInstance: net.Server | null = null;

/**
 * Resolves the target Neon host using public DNS servers (8.8.8.8, 1.1.1.1)
 * to bypass local carrier / Wi-Fi DNS resolvers that refuse *.neon.tech domains.
 */
function updateTargetIp(hostname: string) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
    dns.resolve4(hostname, (err, ips) => {
      if (!err && ips && ips.length > 0) {
        resolvedIp = ips[0];
        logger.debug(`[NeonTunnel] Resolved ${hostname} -> ${resolvedIp}`);
      } else if (err) {
        logger.warn(`[NeonTunnel] DNS resolve4 warning for ${hostname}, using fallback IP: ${resolvedIp}`);
      }
    });
  } catch (e) {
    logger.warn(`[NeonTunnel] Could not set custom DNS servers, using fallback IP: ${resolvedIp}`);
  }
}

/**
 * Initializes a transparent local TLS proxy tunnel for Neon Cloud PostgreSQL.
 * Translates local unencrypted connections on 127.0.0.1:54322 to Neon's TLS pooler
 * with proper SNI header, bypassing local DNS blocks completely.
 */
export function getOrCreateNeonTunnel(): string {
  const originalUrl = process.env.DATABASE_URL || '';

  // If already initialized or not a Neon cloud URL, return existing or original URL
  if (isTunnelInitialized && activeTunnelUrl) {
    return activeTunnelUrl;
  }

  if (!originalUrl || !originalUrl.includes('neon.tech')) {
    return originalUrl;
  }

  try {
    // Parse the DATABASE_URL
    const parsed = new URL(originalUrl);
    const remoteHostname = parsed.hostname;
    const remotePort = parseInt(parsed.port || '5432', 10);

    // Initial IP resolution using public DNS
    updateTargetIp(remoteHostname);

    // Periodically refresh IP every 10 minutes
    setInterval(() => updateTargetIp(remoteHostname), 10 * 60 * 1000).unref();

    if (!serverInstance) {
      serverInstance = net.createServer((clientSocket) => {
        // Pause incoming client data until the remote TLS bridge is established
        clientSocket.pause();

        let remoteTcp: net.Socket | null = null;
        let remoteTls: tls.TLSSocket | null = null;

        const destroyAll = () => {
          if (remoteTls) {
            remoteTls.destroy();
            remoteTls = null;
          }
          if (remoteTcp) {
            remoteTcp.destroy();
            remoteTcp = null;
          }
          clientSocket.destroy();
        };

        clientSocket.on('error', destroyAll);
        clientSocket.on('close', destroyAll);

        // Connect to remote Neon endpoint via direct IP
        remoteTcp = net.createConnection({ host: resolvedIp, port: remotePort }, () => {
          if (!remoteTcp) return;

          // Send PostgreSQL SSLRequest (8 bytes)
          remoteTcp.write(SSL_REQUEST);

          // Neon must respond with 1 byte 'S' (SSL OK)
          remoteTcp.once('data', (sslResponse) => {
            if (sslResponse.toString() !== 'S') {
              logger.error('[NeonTunnel] Neon rejected SSLRequest handshake');
              destroyAll();
              return;
            }

            // Upgrade connection to TLS with the required Neon SNI servername
            remoteTls = tls.connect(
              {
                socket: remoteTcp!,
                servername: remoteHostname,
                rejectUnauthorized: false,
              },
              () => {
                if (!remoteTls) return;
                // Pipe local client socket to remote TLS socket bi-directionally
                clientSocket.pipe(remoteTls);
                remoteTls.pipe(clientSocket);
                // Resume client data stream once pipe is attached
                clientSocket.resume();
              }
            );

            remoteTls.on('error', destroyAll);
            remoteTls.on('close', destroyAll);
          });
        });

        remoteTcp.on('error', destroyAll);
        remoteTcp.on('close', destroyAll);
      });

      serverInstance.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          logger.info(`[NeonTunnel] Port ${TUNNEL_PORT} already in use; reusing existing tunnel listener.`);
        } else {
          logger.error('[NeonTunnel] Server error:', err);
        }
      });

      // Bind to local loopback
      serverInstance.listen(TUNNEL_PORT, TUNNEL_HOST, () => {
        logger.info(`[NeonTunnel] Active transparent bridge listening on ${TUNNEL_HOST}:${TUNNEL_PORT} -> ${remoteHostname}`);
      });
      serverInstance.unref();
    }

    // Construct local loopback database URL with sslmode=disable
    parsed.hostname = TUNNEL_HOST;
    parsed.port = TUNNEL_PORT.toString();
    parsed.searchParams.set('sslmode', 'disable');

    activeTunnelUrl = parsed.toString();
    process.env.DATABASE_URL = activeTunnelUrl;
    isTunnelInitialized = true;

    logger.info(`[NeonTunnel] Database URL routed locally through transparent tunnel to ${remoteHostname}`);
    return activeTunnelUrl;
  } catch (error) {
    logger.error('[NeonTunnel] Failed to initialize tunnel, falling back to original URL', error);
    return originalUrl;
  }
}
