import React from 'react';
import { Compass, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAccountClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="premium-footer" id="site-footer">
      <div className="landing-container">
        <div className="footer-inner-grid">
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="footer-brand-badge">
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--color-brand-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Compass size={18} />
              </div>
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--color-ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                SUPER<span style={{ color: 'var(--color-brand-dark)' }}>CONSCIOUSNESS</span>
              </span>
            </div>

            <p style={{ fontSize: '15px', color: 'var(--color-ink-dim)', lineHeight: 1.65, maxWidth: '380px', margin: 0 }}>
              Integrated Educational Consultancy and Student Guidance Platform.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                width: 'fit-content',
              }}
            >
              <ShieldCheck size={15} color="#38bdf8" /> Verified Student Guidance System
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="footer-col-header">Platform</h4>
            <ul className="footer-links-vertical">
              <li>
                <span className="footer-link-action" onClick={() => scrollTo('home')}>
                  Home
                </span>
              </li>
              <li>
                <span className="footer-link-action" onClick={() => handleAccountClick('entrance')} id="footer-entrance-exams-link">
                  Entrance Exams
                </span>
              </li>
              <li>
                <span className="footer-link-action" onClick={() => scrollTo('services')}>
                  Services
                </span>
              </li>
              <li>
                <span className="footer-link-action" onClick={() => scrollTo('about')}>
                  About
                </span>
              </li>
              <li>
                <span className="footer-link-action" onClick={() => scrollTo('how-it-works')}>
                  How It Works
                </span>
              </li>
              <li>
                <span className="footer-link-action" onClick={() => scrollTo('resources')}>
                  Resources
                </span>
              </li>
              <li>
                <span className="footer-link-action" onClick={() => scrollTo('contact')}>
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="footer-col-header">Account</h4>
            <ul className="footer-links-vertical">
              <li>
                <span
                  className="footer-link-action"
                  onClick={() => handleAccountClick('login')}
                  id="footer-login-link"
                >
                  Login
                </span>
              </li>
              <li>
                <span
                  className="footer-link-action"
                  onClick={() => handleAccountClick('register')}
                  id="footer-register-link"
                >
                  Register
                </span>
              </li>
            </ul>
          </div>

          {/* Advisory & Contact */}
          <div id="contact">
            <h4 className="footer-col-header">Contact & Advisory</h4>
            <ul className="footer-links-vertical" style={{ gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--color-ink-dim)' }}>
                <Mail size={16} color="var(--color-brand-bright)" />
                <a href="mailto:guidance@superconsciousness.edu" style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  guidance@superconsciousness.edu
                </a>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#999999' }}>
                <Clock size={16} color="var(--color-brand-bright)" />
                <span>Advisory Hours: Mon – Fri, 9:00 AM – 6:00 PM</span>
              </li>
              <li style={{ fontSize: '13px', color: '#888888', lineHeight: 1.5 }}>
                Structured student intakes and profiles are reviewed directly through the verified counsellor advisory portal.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-legal-bar">
          <div>
            © 2026 Superconsciousness. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', color: '#888888', fontSize: '14px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Student Data Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
