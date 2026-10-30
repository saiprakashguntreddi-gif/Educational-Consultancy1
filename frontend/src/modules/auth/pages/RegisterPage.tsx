import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { apiClient } from '../../../shared/services/api-client';
import { API_ENDPOINTS } from '../../../config/api.config';
import {
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Mail,
  RotateCw,
} from 'lucide-react';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToDashboard?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onSuccess,
  onNavigateToLogin,
  onNavigateToDashboard,
}) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredInfo, setRegisteredInfo] = useState<{ name: string; email: string } | null>(null);

  // Email OTP Verification State
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Ensure clean empty fields on load (prevent browser autofill)
  useEffect(() => {
    setPassword('');
    setConfirmPassword('');
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSendOtp = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setOtpError('Please enter a valid email address first.');
      return;
    }

    setOtpError(null);
    setOtpSuccessMsg(null);
    setIsSendingOtp(true);

    try {
      const response: any = await apiClient.post(API_ENDPOINTS.AUTH.SEND_EMAIL_OTP, {
        email: trimmed,
      });

      if (response && response.success) {
        setOtpSent(true);
        setOtpSuccessMsg(response.message || `Verification code sent to ${trimmed}!`);
        if (response.data?.otp) {
          setDevOtpHint(response.data.otp);
        }
        setResendCountdown(30);
      } else {
        setOtpError(response?.error || response?.message || 'Failed to send verification code.');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Unable to send OTP. Please check your network or try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      const response: any = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      });

      if (response && response.success) {
        setIsEmailVerified(true);
        setOtpSent(false);
        setOtpSuccessMsg('Email verified successfully!');
        setOtpError(null);
      } else {
        setOtpError(response?.error || response?.message || 'Invalid verification code.');
      }
    } catch (err: any) {
      setOtpError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Password requirement checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordDirty = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEmailVerified) {
      setError('Please verify your email address with the OTP code before registering.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!hasUpper) {
      setError('Password must contain at least one uppercase letter (A-Z).');
      return;
    }

    if (!hasLower) {
      setError('Password must contain at least one lowercase letter (a-z).');
      return;
    }

    if (!hasNumber) {
      setError('Password must contain at least one number (0-9).');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(email.trim().toLowerCase(), password, fullName.trim());
      setRegisteredInfo({
        name: fullName.trim() || 'Student',
        email: email.trim().toLowerCase(),
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        background: 'linear-gradient(180deg, #F5F5F5 0%, #FAFAFA 100%)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 16px 40px -8px rgba(16, 42, 67, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #E5E7EB',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-light)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            marginBottom: '1rem',
          }}>
            <UserPlus size={24} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#172D53', marginBottom: '0.4rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Get started with Global Consultancy guidance platform
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--status-rejected-bg)',
            border: '1px solid var(--status-rejected-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.8rem 1rem',
            color: 'var(--status-rejected-text)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Hidden inputs to capture aggressive browser autofill */}
          <input type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
          <input type="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" />
          <div className="form-group">
            <label className="form-label">Full Name <span className="required">*</span></label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Email Address <span className="required">*</span>
              </label>
              {isEmailVerified && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    border: '1px solid #86EFAC',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={12} color="#16A34A" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="student@example.com"
                  value={email}
                  disabled={isEmailVerified}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (isEmailVerified) {
                      setIsEmailVerified(false);
                      setOtpSent(false);
                    }
                    if (otpError) setOtpError(null);
                  }}
                  style={{
                    width: '100%',
                    paddingRight: isEmailVerified ? '2.5rem' : '0.9rem',
                    borderColor: isEmailVerified ? '#22C55E' : undefined,
                    backgroundColor: isEmailVerified ? '#F0FDF4' : '#FFFFFF',
                    transition: 'all 0.2s ease',
                  }}
                />
                {isEmailVerified && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>

              {!isEmailVerified ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !email.trim()}
                  style={{
                    backgroundColor: email.trim() ? '#FF9800' : '#E2E8F0',
                    color: email.trim() ? '#FFFFFF' : '#94A3B8',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 1.15rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: email.trim() && !isSendingOtp ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: email.trim() ? '0 2px 8px rgba(255, 152, 0, 0.3)' : 'none',
                  }}
                  title="Click to send verification code to this email"
                >
                  {isSendingOtp ? (
                    <span>Sending...</span>
                  ) : otpSent ? (
                    <>
                      <RotateCw size={13} />
                      <span>Resend</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={14} />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsEmailVerified(false);
                    setOtpSent(false);
                    setOtpCode('');
                    setOtpSuccessMsg(null);
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0 0.85rem',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#64748B',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                  title="Click if you need to change your email address"
                >
                  Change
                </button>
              )}
            </div>

            {/* Error message banner if sending failed or email conflict */}
            {!otpSent && otpError && (
              <div
                style={{
                  marginTop: '0.65rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '8px',
                  color: '#991B1B',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={15} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{otpError}</span>
                </div>
                {otpError.toLowerCase().includes('already exists') && (
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563EB',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      textDecoration: 'underline',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            )}

            {/* OTP Input Card (Active when OTP sent and not yet verified) */}
            {otpSent && !isEmailVerified && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '1rem',
                  backgroundColor: '#FFFBEB',
                  border: '1.5px solid #FCD34D',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#92400E' }}>
                    <Mail size={14} />
                    <span>Enter 6-Digit OTP Code:</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#B45309' }}>
                    Valid for 10 mins
                  </span>
                </div>

                <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.76rem', color: '#78350F', lineHeight: 1.4 }}>
                  We sent a 6-digit verification code to <strong>{email}</strong>.
                </p>

                {otpSuccessMsg && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      marginBottom: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <CheckCircle2 size={13} color="#16A34A" />
                    <span>{otpSuccessMsg}</span>
                  </div>
                )}

                {/* Dev Mode Helper */}
                {devOtpHint && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#15803D',
                      backgroundColor: '#DCFCE7',
                      border: '1px solid #86EFAC',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      marginBottom: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Demo/Dev Code: <strong>{devOtpHint}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpCode(devOtpHint);
                        setOtpError(null);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#16A34A',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        textDecoration: 'underline',
                      }}
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                {otpError && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#DC2626',
                      backgroundColor: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '6px',
                      marginBottom: '0.65rem',
                    }}
                  >
                    {otpError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtpCode(val);
                      if (otpError) setOtpError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerifyOtp();
                      }
                    }}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '0.45rem',
                      padding: '0.55rem',
                      borderRadius: '8px',
                      border: '1.5px solid #F59E0B',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      color: '#172D53',
                      fontFamily: 'monospace',
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifyingOtp || otpCode.trim().length !== 6}
                    style={{
                      backgroundColor: otpCode.trim().length === 6 ? '#16A34A' : '#94A3B8',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0 1.25rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: otpCode.trim().length === 6 && !isVerifyingOtp ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      boxShadow: otpCode.trim().length === 6 ? '0 2px 8px rgba(22, 163, 74, 0.3)' : 'none',
                    }}
                  >
                    {isVerifyingOtp ? 'Verifying...' : 'Submit OTP'}
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem', fontSize: '0.74rem' }}>
                  <span style={{ color: '#78350F' }}>
                    Didn't receive email? Check spam or
                  </span>
                  <button
                    type="button"
                    disabled={resendCountdown > 0 || isSendingOtp}
                    onClick={handleSendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCountdown > 0 ? '#9CA3AF' : '#EA580C',
                      fontWeight: 700,
                      cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                  >
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}

            {/* Verified Confirmation Badge */}
            {isEmailVerified && (
              <div
                style={{
                  marginTop: '0.45rem',
                  padding: '0.45rem 0.75rem',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #86EFAC',
                  borderRadius: '8px',
                  color: '#15803D',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <CheckCircle2 size={15} color="#16A34A" />
                <span>Email verified successfully! You can now complete your registration.</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="new_registration_password"
                autoComplete="new-password"
                className="form-input"
                placeholder="e.g. Student123!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Requirements Guidance */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.35rem 0.75rem',
              marginTop: '0.55rem',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              padding: '0.45rem 0.65rem',
              background: '#F9FAFB',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
            }}>
              <span style={{ color: isPasswordDirty && hasMinLength ? '#15803D' : '#64748B', fontWeight: isPasswordDirty && hasMinLength ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {isPasswordDirty && hasMinLength ? '✓' : '•'} 8+ characters
              </span>
              <span style={{ color: isPasswordDirty && hasUpper ? '#15803D' : '#64748B', fontWeight: isPasswordDirty && hasUpper ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {isPasswordDirty && hasUpper ? '✓' : '•'} 1 uppercase (A-Z)
              </span>
              <span style={{ color: isPasswordDirty && hasLower ? '#15803D' : '#64748B', fontWeight: isPasswordDirty && hasLower ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {isPasswordDirty && hasLower ? '✓' : '•'} 1 lowercase (a-z)
              </span>
              <span style={{ color: isPasswordDirty && hasNumber ? '#15803D' : '#64748B', fontWeight: isPasswordDirty && hasNumber ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {isPasswordDirty && hasNumber ? '✓' : '•'} 1 number (0-9)
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                name="new_registration_password_confirm"
                autoComplete="new-password"
                className="form-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.8rem', background: '#FF9800', color: '#FFFFFF', fontWeight: 700 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            style={{ background: 'none', border: 'none', color: '#FF9800', cursor: 'pointer', fontWeight: 700 }}
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Registration Success Modal Popup */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(11, 24, 48, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 25px 60px -10px rgba(11, 24, 48, 0.45), 0 10px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E5E7EB',
              position: 'relative',
            }}
          >
            {/* Animated Celebration Icon */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'rgba(25, 135, 84, 0.12)',
                border: '2px solid rgba(25, 135, 84, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#198754',
                marginBottom: '1.25rem',
                boxShadow: '0 8px 24px rgba(25, 135, 84, 0.2)',
              }}
            >
              <CheckCircle2 size={42} strokeWidth={2.5} />
            </div>

            <h3
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#172D53',
                marginBottom: '0.6rem',
                letterSpacing: '-0.02em',
              }}
            >
              Account Registered Successfully!
            </h3>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#626B78',
                lineHeight: 1.6,
                margin: '0 0 1.5rem',
              }}
            >
              Welcome to <strong style={{ color: '#172D53' }}>Global Consultancy</strong>
              {registeredInfo?.name ? <>, <strong style={{ color: '#FF9800' }}>{registeredInfo.name}</strong></> : ''}!
              Your account has been created and verified.
            </p>

            {/* Account Info Box */}
            <div
              style={{
                background: '#F5F5F5',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                marginBottom: '1.75rem',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.86rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#626B78', fontWeight: 600 }}>Registered Email:</span>
                <span style={{ color: '#172D53', fontWeight: 700 }}>{registeredInfo?.email || email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#626B78', fontWeight: 600 }}>Account Status:</span>
                <span style={{ color: '#198754', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Active & Verified
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onSuccess();
                }}
                className="btn btn-primary"
                id="btn-register-continue-intake"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: '#FF9800',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F57C00')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FF9800')}
              >
                <span>Continue to Student Intake</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onNavigateToDashboard) {
                    onNavigateToDashboard();
                  } else {
                    onSuccess();
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  color: '#172D53',
                  border: '1.5px solid #E5E7EB',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#172D53';
                  e.currentTarget.style.background = '#F5F5F5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                Go to Student Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
