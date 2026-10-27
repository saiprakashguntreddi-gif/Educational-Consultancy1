import { PrismaClient } from '@prisma/client';
import '../../config/env';
import { getOrCreateNeonTunnel } from './neon-tunnel.service';

/**
 * Singleton Prisma Service Client
 * Ensures a single database connection pool is shared across all modules
 */
class PrismaService {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      const dbUrl = getOrCreateNeonTunnel();
      PrismaService.instance = new PrismaClient({
        datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    }
    return PrismaService.instance;
  }
}

export const prisma = PrismaService.getInstance();

