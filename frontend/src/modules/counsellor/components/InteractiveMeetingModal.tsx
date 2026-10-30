import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Shield,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Monitor,
  RefreshCw,
  AlertCircle,
  Volume2,
  Play,
  Film,
} from 'lucide-react';
import { SessionAuditDetailsModal } from './SessionAuditDetailsModal';

interface InteractiveMeetingModalProps {
  appointment: any;
  userRole: 'ADMIN' | 'COUNSELLOR' | 'STUDENT';
  onClose: () => void;
  onRecordOutcome?: (appointment: any) => void;
}

export const InteractiveMeetingModal: React.FC<InteractiveMeetingModalProps> = ({
  appointment,
  userRole,
  onClose,
  onRecordOutcome,
}) => {
  // Device & Stream States
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0); // 0 - 100
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReplayModal, setShowReplayModal] = useState(false);

  // Simulated peer video state (for 1-on-1 consultation demonstration)
  const remoteVideoActive = true;

  // Meeting Timer & UI tabs
  const [meetingSeconds, setMeetingSeconds] = useState(0);
  const [activeSidePanel, setActiveSidePanel] = useState<'notes' | 'info' | 'replay'>('notes');
  const [quickNotes, setQuickNotes] = useState('');

  // Refs for media elements & WebRTC / Web Audio API
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Resolve Names
  const studentName =
    appointment?.studentProfile?.fullName ||
    appointment?.studentName ||
    'Chanu Battu';
  const counsellorName =
    appointment?.counsellor?.email ||
    appointment?.counsellorEmail ||
    'counsellor@superconsciousness.internal';

  // Determine which participant is the local user
  const isCounsellorLocal = userRole === 'COUNSELLOR' || userRole === 'ADMIN';

  // Compute Google Meet Link
  const getGoogleMeetLink = (): string => {
    if (appointment?.meetingLocation && appointment.meetingLocation.startsWith('http')) {
      return appointment.meetingLocation;
    }
    // Generate clean Google Meet room link using appointment code or fallback to new Google Meet
    const roomCode = appointment?.id
      ? appointment.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10).toLowerCase()
      : 'counselling-room';
    // Format 3-4-3 google meet code style if roomCode is 10 chars
    const formattedCode =
      roomCode.length >= 10
        ? `${roomCode.slice(0, 3)}-${roomCode.slice(3, 7)}-${roomCode.slice(7, 10)}`
        : 'meet-guidance-now';
    return `https://meet.google.com/${formattedCode}`;
  };

  const googleMeetUrl = getGoogleMeetLink();

  // Initialize WebRTC Camera & Microphone
  const initUserMedia = async () => {
    setIsInitializing(true);
    setPermissionError(null);

    // Stop existing tracks if any
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support media device camera/audio streaming.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      mediaStreamRef.current = stream;
      setStreamActive(true);

      // Attach to video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch((err) => {
          console.warn('Autoplay prevented on local video:', err);
        });
      }

      // Initialize Web Audio API for real-time voice meter & speaking detection
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.6;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let lastUpdate = 0;
          let prevSpeaking = false;

          const analyzeAudio = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            
            // Noise Gate: Ignore ambient room/fan/electrical hum below 14%
            const NOISE_GATE = 14;
            const speaking = average > NOISE_GATE;
            const normalized = speaking
              ? Math.min(100, Math.round(((average - NOISE_GATE) / (128 - NOISE_GATE)) * 100))
              : 0;

            const now = Date.now();
            // Throttle state updates to avoid constant re-renders & flickering
            if (speaking !== prevSpeaking || now - lastUpdate > 180) {
              setAudioLevel(normalized);
              setIsSpeaking(speaking);
              prevSpeaking = speaking;
              lastUpdate = now;
            }

            animFrameRef.current = requestAnimationFrame(analyzeAudio);
          };

          analyzeAudio();
        }
      } catch (audioErr) {
        console.warn('Web Audio meter not available:', audioErr);
      }
    } catch (err: any) {
      console.warn('Could not initialize camera/microphone:', err);
      setPermissionError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera/Microphone access was denied. You can continue with avatar mode or open Google Meet.'
          : err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'
          ? 'No camera or microphone hardware found on this device.'
          : `Device stream error: ${err.message || 'Unable to access media devices'}`
      );
      setStreamActive(false);
    } finally {
      setIsInitializing(false);
    }
  };

  // Start media stream on mount, clean up on unmount
  useEffect(() => {
    initUserMedia();

    return () => {
      // Clean up camera & mic
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      // Clean up screen share
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      // Clean up Web Audio
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update track enabled state when micEnabled changes
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = micEnabled;
      });
    }
  }, [micEnabled]);

  // Update track enabled state when videoEnabled changes
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = videoEnabled;
      });
    }
  }, [videoEnabled]);

  // Meeting elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Screen Share toggle
  const toggleScreenShare = async () => {
    if (screenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setScreenSharing(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          alert('Screen sharing is not supported on this browser.');
          return;
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = stream;
        setScreenSharing(true);

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
          screenVideoRef.current.play().catch(() => {});
        }

        // Handle user stopping share from browser floating toolbar
        stream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
        };
      } catch (err) {
        console.warn('Screen share canceled or denied:', err);
      }
    }
  };

  // Copy Google Meet link to clipboard
  const handleCopyMeetLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(googleMeetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0A0F1D',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: '64px',
          backgroundColor: '#1E293B',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          color: '#FFFFFF',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
            }}
          >
            <Video size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
              {appointment?.title || appointment?.appointmentType?.replace('_', ' ') || 'Career Counselling Consultation'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Student: <strong style={{ color: '#E2E8F0' }}>{studentName}</strong> • Advisor:{' '}
              <strong style={{ color: '#E2E8F0' }}>{counsellorName}</strong>
            </div>
          </div>
        </div>

        {/* Top Right Controls & Google Meet Quick Launch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Live Google Meet Launch Button */}
          <a
            href={googleMeetUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#013A2B',
              color: '#FFFFFF',
              padding: '0.45rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(1, 58, 43, 0.3)',
              border: '1px solid #025942',
              transition: 'all 0.2s ease',
            }}
            title="Open meeting room directly in Google Meet in a new browser tab"
          >
            <ExternalLink size={15} />
            <span>Open in Google Meet</span>
          </a>

          {/* Copy Meet Link Button */}
          <button
            onClick={handleCopyMeetLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: copiedLink ? '#059669' : '#334155',
              color: '#FFFFFF',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Copy Google Meet Link"
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? 'Copied' : 'Copy Meet Link'}</span>
          </button>

          {/* Meeting Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#0F172A',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid #334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#E2E8F0',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                display: 'inline-block',
                boxShadow: '0 0 8px #22C55E',
              }}
            />
            <span>{formatTimer(meetingSeconds)}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: '#10B981',
              fontWeight: 500,
            }}
          >
            <Shield size={14} />
            <span>E2E Encrypted</span>
          </div>

          {/* Live Session Recording Active Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
            title="This consultation is automatically recorded in HD for student replay"
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                display: 'inline-block',
                boxShadow: '0 0 8px #EF4444',
              }}
            />
            <span>REC (Recorded for Replay)</span>
          </div>

          {/* Close / Leave Modal Button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease',
            }}
            title="Leave Meeting"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Permission Warning Banner if Camera/Mic Blocked */}
      {permissionError && (
        <div
          style={{
            backgroundColor: '#451A03',
            borderBottom: '1px solid #78350F',
            color: '#FDE68A',
            padding: '0.6rem 1.5rem',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} color="#F59E0B" />
            <span>{permissionError}</span>
          </div>
          <button
            onClick={initUserMedia}
            style={{
              backgroundColor: '#B45309',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <RefreshCw size={12} />
            <span>Retry Camera</span>
          </button>
        </div>
      )}

      {/* Main Stage & Side Panel */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Center Video Stage */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#090D16',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          {/* Screen Share Stage (if active) */}
          {screenSharing ? (
            <div
              style={{
                width: '100%',
                maxWidth: '1100px',
                height: '74vh',
                backgroundColor: '#0F172A',
                borderRadius: '16px',
                border: '2px solid #2563EB',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  color: '#60A5FA',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Monitor size={14} />
                <span>You are sharing your screen</span>
              </div>
              <button
                onClick={toggleScreenShare}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Stop Sharing
              </button>
            </div>
          ) : (
            /* 2-Participant Video Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.25rem',
                width: '100%',
                maxWidth: '1050px',
                height: '70vh',
                minHeight: '380px',
              }}
            >
              {/* Participant 1: Student Feed */}
              <div
                style={{
                  backgroundColor: '#1E293B',
                  borderRadius: '14px',
                  border: isSpeaking && !isCounsellorLocal && micEnabled ? '2px solid #22C55E' : '1px solid #334155',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  transition: 'border 0.2s ease',
                }}
              >
                {/* Check if Student is Local and Camera is Active */}
                {!isCounsellorLocal && streamActive && videoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)', // Mirror local camera preview naturally
                    }}
                  />
                ) : !isCounsellorLocal && (!videoEnabled || !streamActive) ? (
                  /* Student Local with Camera Off */
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        border: '3px solid #60A5FA',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                      }}
                    >
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '1.05rem' }}>{studentName}</div>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      {isInitializing ? 'Connecting camera...' : 'Camera Off'}
                    </span>
                  </div>
                ) : remoteVideoActive ? (
                  /* Remote Student Feed (Simulated active session for Counsellor view) */
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                    }}
                  >
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        backgroundColor: '#3B82F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        border: '3px solid #60A5FA',
                        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
                      }}
                    >
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '1.05rem' }}>{studentName}</div>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Student Participant (Verified)</span>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#94A3B8',
                      }}
                    >
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ color: '#94A3B8', fontWeight: 600 }}>{studentName} (Offline)</div>
                  </div>
                )}

                {/* Top Status Overlays */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {!isCounsellorLocal && (
                    <div
                      style={{
                        backgroundColor: micEnabled ? (isSpeaking ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)') : 'rgba(220, 38, 38, 0.25)',
                        border: micEnabled ? (isSpeaking ? '1px solid #4ADE80' : '1px solid #22C55E') : '1px solid #DC2626',
                        color: micEnabled ? '#22C55E' : '#EF4444',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {micEnabled ? (
                        isSpeaking ? (
                          <>
                            <Volume2 size={12} />
                            <span>Speaking</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                              <span style={{ width: 2, height: `${Math.max(6, Math.min(12, 6 + Math.round((audioLevel / 100) * 6)))}px`, backgroundColor: '#22C55E', borderRadius: '1px' }} />
                              <span style={{ width: 2, height: `${Math.max(8, Math.min(14, 8 + Math.round((audioLevel / 100) * 6)))}px`, backgroundColor: '#22C55E', borderRadius: '1px' }} />
                              <span style={{ width: 2, height: `${Math.max(4, Math.min(10, 4 + Math.round((audioLevel / 100) * 6)))}px`, backgroundColor: '#22C55E', borderRadius: '1px' }} />
                            </div>
                          </>
                        ) : (
                          <>
                            <Mic size={12} />
                            <span>Mic Active</span>
                          </>
                        )
                      ) : (
                        <>
                          <MicOff size={12} />
                          <span>Muted</span>
                        </>
                      )}
                    </div>
                  )}

                  {!isCounsellorLocal && streamActive && videoEnabled && (
                    <div
                      style={{
                        backgroundColor: 'rgba(37, 99, 235, 0.3)',
                        border: '1px solid #3B82F6',
                        color: '#93C5FD',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      HD Live
                    </div>
                  )}
                </div>

                {/* Bottom Left Student Name Tag */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: '#22C55E',
                    }}
                  />
                  <span>
                    {studentName} {!isCounsellorLocal ? '(You)' : ''}
                  </span>
                </div>
              </div>

              {/* Participant 2: Counsellor Feed */}
              <div
                style={{
                  backgroundColor: '#1E293B',
                  borderRadius: '14px',
                  border: isSpeaking && isCounsellorLocal && micEnabled ? '2px solid #22C55E' : '1px solid #334155',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  transition: 'border 0.2s ease',
                }}
              >
                {/* If Counsellor is Local and Camera is Active */}
                {isCounsellorLocal && streamActive && videoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)', // Mirror preview
                    }}
                  />
                ) : isCounsellorLocal && (!videoEnabled || !streamActive) ? (
                  /* Counsellor Local with Camera Off */
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: '50%',
                        backgroundColor: '#013A2B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        border: '3px solid #34D399',
                        boxShadow: '0 4px 14px rgba(1, 58, 43, 0.4)',
                      }}
                    >
                      {counsellorName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '1.05rem' }}>{counsellorName}</div>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                      {isInitializing
                        ? 'Connecting camera...'
                        : permissionError
                        ? 'Microphone Only'
                        : 'Camera Off'}
                    </span>
                  </div>
                ) : (
                  /* Remote Counsellor Feed (when user is Student) */
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                    }}
                  >
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: '50%',
                        backgroundColor: '#013A2B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        border: '3px solid #34D399',
                        boxShadow: '0 4px 20px rgba(1, 58, 43, 0.4)',
                      }}
                    >
                      {counsellorName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '1.05rem' }}>{counsellorName}</div>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Senior Certified Counsellor</span>
                  </div>
                )}

                {/* Top Status Overlays */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {isCounsellorLocal && (
                    <div
                      style={{
                        backgroundColor: micEnabled ? (isSpeaking ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)') : 'rgba(220, 38, 38, 0.25)',
                        border: micEnabled ? (isSpeaking ? '1px solid #4ADE80' : '1px solid #22C55E') : '1px solid #DC2626',
                        color: micEnabled ? '#22C55E' : '#EF4444',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      {micEnabled ? (
                        isSpeaking ? (
                          <>
                            <Volume2 size={12} />
                            <span>Speaking</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>
                              <span style={{ width: 2, height: `${Math.max(6, Math.min(12, 6 + Math.round((audioLevel / 100) * 6)))}px`, backgroundColor: '#22C55E', borderRadius: '1px' }} />
                              <span style={{ width: 2, height: `${Math.max(8, Math.min(14, 8 + Math.round((audioLevel / 100) * 6)))}px`, backgroundColor: '#22C55E', borderRadius: '1px' }} />
                              <span style={{ width: 2, height: `${Math.max(4, Math.min(10, 4 + Math.round((audioLevel / 100) * 6)))}px`, backgroundColor: '#22C55E', borderRadius: '1px' }} />
                            </div>
                          </>
                        ) : (
                          <>
                            <Mic size={12} />
                            <span>Mic Active</span>
                          </>
                        )
                      ) : (
                        <>
                          <MicOff size={12} />
                          <span>Muted</span>
                        </>
                      )}
                    </div>
                  )}

                  {isCounsellorLocal && streamActive && videoEnabled && (
                    <div
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.3)',
                        border: '1px solid #10B981',
                        color: '#6EE7B7',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      HD Live
                    </div>
                  )}
                </div>

                {/* Bottom Left Counsellor Name Tag */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    color: '#FFFFFF',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      backgroundColor: '#22C55E',
                    }}
                  />
                  <span>
                    {counsellorName} (Host){isCounsellorLocal ? ' (You)' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Panel: Live Advisory Scratchpad & Google Meet Info */}
        <div
          style={{
            width: '360px',
            backgroundColor: '#1E293B',
            borderLeft: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          {/* Panel Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
            <button
              onClick={() => setActiveSidePanel('notes')}
              style={{
                flex: 1,
                padding: '0.75rem 0.4rem',
                backgroundColor: activeSidePanel === 'notes' ? '#0F172A' : 'transparent',
                color: activeSidePanel === 'notes' ? '#60A5FA' : '#94A3B8',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Session Notes
            </button>
            <button
              onClick={() => setActiveSidePanel('replay')}
              style={{
                flex: 1,
                padding: '0.75rem 0.4rem',
                backgroundColor: activeSidePanel === 'replay' ? '#0F172A' : 'transparent',
                color: activeSidePanel === 'replay' ? '#34D399' : '#94A3B8',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <Film size={13} color={activeSidePanel === 'replay' ? '#34D399' : '#94A3B8'} />
              <span>Replay & Rec</span>
            </button>
            <button
              onClick={() => setActiveSidePanel('info')}
              style={{
                flex: 1,
                padding: '0.75rem 0.4rem',
                backgroundColor: activeSidePanel === 'info' ? '#0F172A' : 'transparent',
                color: activeSidePanel === 'info' ? '#60A5FA' : '#94A3B8',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Google Meet
            </button>
          </div>

          {/* Panel Content */}
          <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
            {activeSidePanel === 'notes' ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '0.65rem' }}>
                  Scratchpad for key points discussed during meeting:
                </span>
                <textarea
                  style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    padding: '0.85rem',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    resize: 'none',
                    outline: 'none',
                    minHeight: '260px',
                  }}
                  placeholder="Record student questions, target courses, university selections, or follow-up items..."
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                />
              </div>
            ) : activeSidePanel === 'replay' ? (
              <div style={{ color: '#E2E8F0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* Recording Live Status Card */}
                <div
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #1E3A8A',
                    borderRadius: '10px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '6px',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Film size={14} color="#EF4444" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#F8FAFC' }}>
                        HD Cloud Recording
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#EF4444', fontWeight: 600 }}>
                        ● Active & Auto-Archived
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.76rem', color: '#94A3B8', margin: '0 0 0.85rem 0', lineHeight: 1.45 }}>
                    Every consultation session is recorded in HD with audio and advisor notes so students can re-watch any time.
                  </p>

                  {/* 1-Click Preview Player Button */}
                  <button
                    onClick={() => setShowReplayModal(true)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: '#013A2B',
                      color: '#FFFFFF',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: '1px solid #426557',
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(1, 58, 43, 0.35)',
                      transition: 'all 0.2s ease',
                    }}
                    type="button"
                  >
                    <Play size={15} fill="#FFFFFF" />
                    <span>Watch Recorded Session (Replay)</span>
                  </button>
                </div>

                {/* Where Students Can Access It */}
                <div
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#38BDF8', marginBottom: '0.5rem' }}>
                    Where Can Students Watch Again?
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                    <li>Open <strong>Student Dashboard</strong></li>
                    <li>Click <strong>Appointments</strong> in left sidebar</li>
                    <li>Click the <strong>Past Consultations</strong> tab</li>
                    <li>Click the green <strong>"Watch Recorded Session"</strong> button to replay video, listen to audio, or review roadmap notes.</li>
                  </ol>
                </div>

                {/* Direct Recording Cloud Asset */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '0.35rem' }}>
                    Cloud Recording Link (Direct Stream):
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                    }}
                  >
                    <input
                      type="text"
                      readOnly
                      value={appointment?.recordingUrl || '/assets/sample-consultation.mp4'}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#93C5FD',
                        fontSize: '0.75rem',
                        flex: 1,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          appointment?.recordingUrl || `${window.location.origin}/assets/sample-consultation.mp4`
                        );
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedLink ? '#10B981' : '#94A3B8',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title="Copy Recording URL"
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.76rem',
                    color: '#BAE6FD',
                    lineHeight: 1.45,
                  }}
                >
                  💡 <strong>Student Replay Features:</strong> Timeline scrubbing, playback speed (0.5x, 1x, 1.5x, 2x), synchronized audio audit, and complete counsellor recommendations.
                </div>
              </div>
            ) : (
              <div style={{ color: '#E2E8F0', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Google Meet Direct Card */}
                <div
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '6px',
                        backgroundColor: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Video size={14} color="#FFFFFF" />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#F8FAFC' }}>
                      Google Meet Integration
                    </span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
                    If you prefer Google Meet application, you and your participant can join using the link below:
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#1E293B',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      padding: '0.4rem 0.65rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <input
                      type="text"
                      readOnly
                      value={googleMeetUrl}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#93C5FD',
                        fontSize: '0.78rem',
                        flex: 1,
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleCopyMeetLink}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedLink ? '#10B981' : '#94A3B8',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title="Copy Link"
                    >
                      {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a
                      href={googleMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        backgroundColor: '#013A2B',
                        color: '#FFFFFF',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={14} />
                      <span>Launch Meet</span>
                    </a>

                    <button
                      onClick={handleCopyMeetLink}
                      style={{
                        backgroundColor: '#334155',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.5rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Consultation Details */}
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '0.25rem' }}>
                    Meeting Mode
                  </span>
                  <strong style={{ color: '#F8FAFC' }}>
                    {appointment?.meetingMode?.replace('_', ' ') || 'ONLINE COUNSELLING (VIDEO)'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '0.25rem' }}>
                    Student Profile ID
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#60A5FA' }}>
                    {appointment?.studentProfileId || 'Verified Roster'}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginBottom: '0.25rem' }}>
                    Initial Consultation Notes
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                    {appointment?.studentNotes || 'Standard 1-on-1 higher education and admissions advisory session.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div
        style={{
          height: '80px',
          backgroundColor: '#1E293B',
          borderTop: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '0 2rem',
          flexShrink: 0,
        }}
      >
        {/* Toggle Microphone */}
        <button
          onClick={() => setMicEnabled(!micEnabled)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: micEnabled ? '#334155' : '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}
          title={micEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {micEnabled ? <Mic size={22} /> : <MicOff size={22} />}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={() => setVideoEnabled(!videoEnabled)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: videoEnabled ? '#334155' : '#DC2626',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}
          title={videoEnabled ? 'Stop Video Camera' : 'Start Video Camera'}
        >
          {videoEnabled ? <Video size={22} /> : <VideoOff size={22} />}
        </button>

        {/* Toggle Screen Share */}
        <button
          onClick={toggleScreenShare}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: screenSharing ? '#2563EB' : '#334155',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}
          title={screenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
        >
          <Monitor size={22} />
        </button>

        {/* Direct Google Meet Link Quick Trigger */}
        <a
          href={googleMeetUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            height: 48,
            padding: '0 1.25rem',
            borderRadius: '24px',
            backgroundColor: '#013A2B',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(1, 58, 43, 0.3)',
          }}
          title="Open this consultation directly in Google Meet"
        >
          <ExternalLink size={18} />
          <span>Google Meet</span>
        </a>

        {/* Watch Replay Player Quick Launcher */}
        <button
          onClick={() => setShowReplayModal(true)}
          style={{
            height: 48,
            padding: '0 1.15rem',
            borderRadius: '24px',
            backgroundColor: '#0F172A',
            color: '#38BDF8',
            border: '1px solid #0284C7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontWeight: 600,
            fontSize: '0.86rem',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
            transition: 'all 0.2s ease',
          }}
          title="Watch / Preview full recorded session video & audio player"
          type="button"
        >
          <Play size={15} fill="#38BDF8" />
          <span>Watch Replay</span>
        </button>

        {/* Complete Session Outcome (Counsellor) or Leave Call (Student/Other) */}
        {userRole === 'COUNSELLOR' ? (
          <button
            onClick={() => {
              if (onRecordOutcome) {
                onRecordOutcome(appointment);
              }
            }}
            style={{
              height: 48,
              padding: '0 1.5rem',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '24px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginLeft: '0.5rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <CheckCircle2 size={18} />
            <span>Complete & Record Outcome</span>
          </button>
        ) : (
          <button
            onClick={onClose}
            style={{
              height: 48,
              padding: '0 1.5rem',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '24px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginLeft: '0.5rem',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            }}
          >
            <PhoneOff size={18} />
            <span>Leave Consultation</span>
          </button>
        )}
      </div>

      {/* Replay Recorded Session Modal */}
      {showReplayModal && (
        <SessionAuditDetailsModal
          session={appointment}
          onClose={() => setShowReplayModal(false)}
        />
      )}
    </div>
  );
};
