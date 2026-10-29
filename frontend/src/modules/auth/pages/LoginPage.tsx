import React, { useState } from 'react';
import { useAuth, User } from '../../../shared/context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onSuccess: (loggedInUser?: User) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
}) => {
  const { login, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email.trim().toLowerCase(), password);
      onSuccess(loggedInUser);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
        background: 'linear-gradient(180deg, #FAF7F2 0%, #F4EFEA 100%)',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          background: '#FFFDFB',
          borderRadius: '20px',
          boxShadow: '0 16px 40px -8px rgba(16, 42, 67, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          border: '1px solid #E8E2D8',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(18, 157, 185, 0.15) 0%, rgba(64, 199, 229, 0.22) 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#129DB9',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(18, 157, 185, 0.16)',
            }}
          >
            <LogIn size={26} />
          </div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#102A43',
              marginBottom: '0.4rem',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome Back
          </h2>
          <p style={{ color: '#486581', fontSize: '0.92rem', margin: 0 }}>
            Sign in to access your student guidance portal
          </p>
        </div>

        {/* Informative helper when user is already logged in */}
        {user && (
          <div
            style={{
              background: '#EEF8FA',
              border: '1px solid #B8E4EC',
              borderRadius: '12px',
              padding: '1.15rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                color: '#084F5E',
                fontWeight: 700,
                fontSize: '0.92rem',
                marginBottom: '0.35rem',
              }}
            >
              <CheckCircle2 size={17} color="#129DB9" />
              <span>Already Signed In</span>
            </div>
            <p style={{ margin: '0 0 1rem', color: '#102A43', fontSize: '0.88rem', wordBreak: 'break-all' }}>
              Logged in as <strong>{user.email}</strong> ({user.role})
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSuccess(user)}
                style={{ flex: 1, padding: '0.55rem 0.9rem', fontSize: '0.88rem' }}
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => logout()}
                style={{ flex: 1, padding: '0.55rem 0.9rem', fontSize: '0.88rem', background: '#FFFFFF' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
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
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label
              className="form-label"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#102A43',
                marginBottom: '0.45rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Email Address <span className="required" style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.95rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                color: '#0F172A',
                background: '#FFFFFF',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label
                className="form-label"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#102A43',
                  marginBottom: 0,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Password <span className="required" style={{ color: '#DC2626' }}>*</span>
              </label>
              {onNavigateToForgotPassword && (
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#129DB9',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.85rem 0.75rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.95rem',
                  color: '#0F172A',
                  background: '#FFFFFF',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '10px',
              fontSize: '0.98rem',
              fontWeight: 700,
              background: '#129DB9',
              color: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(18, 157, 185, 0.35)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: '#64748B' }}>
          Don't have an account?{' '}
          <button
            onClick={onNavigateToRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#129DB9',
              cursor: 'pointer',
              fontWeight: 700,
              padding: 0,
            }}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
};
