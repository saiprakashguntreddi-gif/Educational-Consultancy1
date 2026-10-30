import React, { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { UserPlus, AlertCircle, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

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

  // Password requirement checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label className="form-label">Email Address <span className="required">*</span></label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
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
              <span style={{ color: hasMinLength ? '#198754' : undefined, fontWeight: hasMinLength ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {hasMinLength ? '✓' : '•'} 8+ characters
              </span>
              <span style={{ color: hasUpper ? '#198754' : undefined, fontWeight: hasUpper ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {hasUpper ? '✓' : '•'} 1 uppercase (A-Z)
              </span>
              <span style={{ color: hasLower ? '#198754' : undefined, fontWeight: hasLower ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {hasLower ? '✓' : '•'} 1 lowercase (a-z)
              </span>
              <span style={{ color: hasNumber ? '#198754' : undefined, fontWeight: hasNumber ? 600 : 400, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {hasNumber ? '✓' : '•'} 1 number (0-9)
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password <span className="required">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
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
