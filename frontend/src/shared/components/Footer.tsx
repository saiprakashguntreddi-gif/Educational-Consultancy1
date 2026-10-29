import React, { useState, useEffect } from 'react';
import {
  Compass,
  Home,
  Layers,
  Users,
  Settings,
  Phone,
  UserCheck,
  UserPlus,
  Mail,
  Clock,
  ShieldCheck,
  X,
  FileText,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'protection' | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLegalModal(null);
      }
    };
    if (activeLegalModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeLegalModal]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  const handleAccountClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="premium-footer" id="site-footer">
        {/* Ambient background waves & glowing dot matrices */}
        <svg
          className="footer-ambient-graphic"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="waveGradLeft" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#FF9800" stopOpacity="0.48" />
              <stop offset="60%" stopColor="#F57C00" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0B1830" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveGradLeftInner" x1="0%" y1="100%" x2="40%" y2="20%">
              <stop offset="0%" stopColor="#FF9800" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0B1830" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveGradRight" x1="100%" y1="100%" x2="55%" y2="0%">
              <stop offset="0%" stopColor="#FF9800" stopOpacity="0.48" />
              <stop offset="60%" stopColor="#F57C00" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0B1830" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="waveGradRightInner" x1="100%" y1="75%" x2="70%" y2="10%">
              <stop offset="0%" stopColor="#FF9800" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0B1830" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left organic flowing wave curves */}
          <path
            d="M-40,280 C60,190 150,140 240,180 C330,220 380,265 470,280 L-40,280 Z"
            fill="url(#waveGradLeft)"
          />
          <path
            d="M-20,280 C50,225 110,185 180,215 C240,245 280,270 340,280 L-20,280 Z"
            fill="url(#waveGradLeftInner)"
          />

          {/* Right organic flowing wave curves */}
          <path
            d="M1480,280 C1380,165 1270,125 1160,175 C1060,220 1000,265 920,280 L1480,280 Z"
            fill="url(#waveGradRight)"
          />
          <path
            d="M1480,280 C1390,195 1310,165 1220,210 C1160,240 1120,268 1040,280 L1480,280 Z"
            fill="url(#waveGradRightInner)"
          />

          {/* Top-Left 6x6 Cyan Dot Grid */}
          <g fill="#FF9800" opacity="0.36">
            {[0, 1, 2, 3, 4, 5].map((r) =>
              [0, 1, 2, 3, 4, 5].map((c) => (
                <circle key={`tl-${r}-${c}`} cx={28 + c * 10} cy={28 + r * 10} r="1.5" />
              ))
            )}
          </g>

          {/* Bottom-Right 6x6 Cyan Dot Grid */}
          <g fill="#FF9800" opacity="0.36">
            {[0, 1, 2, 3, 4, 5].map((r) =>
              [0, 1, 2, 3, 4, 5].map((c) => (
                <circle key={`br-${r}-${c}`} cx={1370 + c * 10} cy={200 + r * 10} r="1.5" />
              ))
            )}
          </g>
        </svg>

        <div className="landing-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="footer-inner-grid">
            {/* 1. Brand Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="footer-brand-badge" onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#172D53',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    overflow: 'hidden',
                    padding: '2px',
                  }}
                >
                  <img
                    src="/assets/global-logo-full.png"
                    alt="Global Consciousness Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#172D53',
                    letterSpacing: '-0.02em',
                  }}
                >
                  GLOBAL<span style={{ color: '#FF9800' }}>CONSCIOUSNESS</span>
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.76)', lineHeight: 1.55, maxWidth: '340px', margin: 0 }}>
                Integrated Educational Consultancy and Student Guidance Platform.
              </p>

              <div className="footer-verified-badge">
                <ShieldCheck size={14} color="#FF9800" />
                <span>Verified Student Guidance System</span>
              </div>
            </div>

            {/* 2. Platform Column */}
            <div>
              <div className="footer-header-group">
                <h4 className="footer-col-header">Platform</h4>
                <div className="footer-header-accent-bar" />
              </div>
              <ul className="footer-links-vertical">
                <li>
                  <div className="footer-link-row" onClick={() => scrollTo('home')} id="footer-home-link">
                    <Home size={15} className="footer-link-cyan-icon" />
                    <span>Home</span>
                  </div>
                </li>
                <li>
                  <div className="footer-link-row" onClick={() => scrollTo('services')} id="footer-services-link">
                    <Layers size={15} className="footer-link-cyan-icon" />
                    <span>Services</span>
                  </div>
                </li>
                <li>
                  <div className="footer-link-row" onClick={() => scrollTo('about')} id="footer-about-link">
                    <Users size={15} className="footer-link-cyan-icon" />
                    <span>About</span>
                  </div>
                </li>
                <li>
                  <div className="footer-link-row" onClick={() => scrollTo('how-it-works')} id="footer-how-it-works-link">
                    <Settings size={15} className="footer-link-cyan-icon" />
                    <span>How It Works</span>
                  </div>
                </li>
                <li>
                  <div className="footer-link-row" onClick={() => scrollTo('contact')} id="footer-contact-link">
                    <Phone size={15} className="footer-link-cyan-icon" />
                    <span>Contact</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 3. Account Column */}
            <div>
              <div className="footer-header-group">
                <h4 className="footer-col-header">Account</h4>
                <div className="footer-header-accent-bar" />
              </div>
              <ul className="footer-links-vertical">
                <li>
                  <div
                    className="footer-link-row"
                    onClick={() => handleAccountClick('login')}
                    id="footer-login-link"
                  >
                    <UserCheck size={15} className="footer-link-cyan-icon" />
                    <span>Login</span>
                  </div>
                </li>
                <li>
                  <div
                    className="footer-link-row"
                    onClick={() => handleAccountClick('register')}
                    id="footer-register-link"
                  >
                    <UserPlus size={15} className="footer-link-cyan-icon" />
                    <span>Register</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 4. Contact & Advisory Column */}
            <div id="contact">
              <div className="footer-header-group">
                <h4 className="footer-col-header">Contact & Advisory</h4>
                <div className="footer-header-accent-bar" />
              </div>
              <ul className="footer-links-vertical" style={{ gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="footer-contact-bubble">
                    <Mail size={14} />
                  </div>
                  <a
                    href="mailto:guidance@globalconsciousness.edu"
                    style={{ color: '#ffffff', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
                  >
                    guidance@globalconsciousness.edu
                  </a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="footer-contact-bubble">
                    <Clock size={14} />
                  </div>
                  <span style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: '12.5px', fontWeight: 500 }}>
                    Advisory Hours: Mon – Fri, 9:00 AM – 6:00 PM
                  </span>
                </li>
                <li style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.58)', lineHeight: 1.5, marginTop: '2px', maxWidth: '320px' }}>
                  Structured student intakes and profiles are reviewed directly through the verified counsellor advisory portal.
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="footer-legal-bar">
            <div>
              &copy; 2026 Global Consciousness. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', color: 'rgba(255, 255, 255, 0.75)', fontSize: '12.5px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.35)' }}>|</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveLegalModal('privacy')}
                id="footer-privacy-btn"
              >
                Privacy Policy
              </button>
              <span style={{ color: 'rgba(255, 255, 255, 0.35)' }}>|</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveLegalModal('terms')}
                id="footer-terms-btn"
              >
                Terms of Service
              </button>
              <span style={{ color: 'rgba(255, 255, 255, 0.35)' }}>|</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveLegalModal('protection')}
                id="footer-protection-btn"
              >
                Student Data Protection
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          LEGAL MODAL DIALOG (Privacy Policy, Terms of Service, Data Protection)
          ===================================================================== */}
      {activeLegalModal && (
        <div
          className="legal-modal-backdrop"
          onClick={() => setActiveLegalModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="legal-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="legal-modal-header">
              <div className="legal-modal-title-row">
                <div className="legal-modal-icon-badge">
                  {activeLegalModal === 'privacy' && <Lock size={20} color="#FF9800" />}
                  {activeLegalModal === 'terms' && <FileText size={20} color="#FF9800" />}
                  {activeLegalModal === 'protection' && <ShieldCheck size={20} color="#198754" />}
                </div>
                <div>
                  <h3 className="legal-modal-title">
                    {activeLegalModal === 'privacy' && 'Privacy Policy & Student Data Protocol'}
                    {activeLegalModal === 'terms' && 'Terms of Service & Advisory Charter'}
                    {activeLegalModal === 'protection' && 'Student Data Protection & Compliance Standards'}
                  </h3>
                  <span className="legal-modal-subtitle">
                    Global Consciousness Educational Guidance System • Effective Academic Year 2026
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="legal-modal-close-btn"
                onClick={() => setActiveLegalModal(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="legal-modal-tabs">
              <button
                type="button"
                className={`legal-modal-tab ${activeLegalModal === 'privacy' ? 'is-active' : ''}`}
                onClick={() => setActiveLegalModal('privacy')}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className={`legal-modal-tab ${activeLegalModal === 'terms' ? 'is-active' : ''}`}
                onClick={() => setActiveLegalModal('terms')}
              >
                Terms of Service
              </button>
              <button
                type="button"
                className={`legal-modal-tab ${activeLegalModal === 'protection' ? 'is-active' : ''}`}
                onClick={() => setActiveLegalModal('protection')}
              >
                Student Data Protection
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="legal-modal-body">
              {activeLegalModal === 'privacy' && (
                <div className="legal-modal-sections">
                  <div className="legal-section-block">
                    <h4>1. Scope of Data Collection</h4>
                    <p>
                      Global Consciousness collects student academic transcripts, test performance records, competency assessment inputs, and target institution preferences strictly to formulate verified education roadmaps and facilitate counsellor advisory.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>2. Use of Information</h4>
                    <p>
                      Collected data is used exclusively to calibrate university fit scores, predict entrance admission viability, schedule 1-on-1 certified mentorship sessions, and prepare verified scholarship eligibility dossiers.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>3. Zero Third-Party Monetization</h4>
                    <p>
                      We never sell, rent, or trade student personal records or academic assessments to commercial advertisers or unverified external third parties.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>4. Data Deletion & Portability</h4>
                    <p>
                      Students retain full ownership of their academic dossiers and may request a portable export or permanent deletion of their account records by contacting <code>privacy@superconsciousness.edu</code>.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalModal === 'terms' && (
                <div className="legal-modal-sections">
                  <div className="legal-section-block">
                    <h4>1. Advisory Nature of Guidance</h4>
                    <p>
                      Global Consciousness provides structured diagnostic assessments, pathway recommendations, and counsellor mentorship. Final admissions, exam scores, and visa decisions remain subject to independent university boards and consular authorities.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>2. Verified Student Profiles</h4>
                    <p>
                      Students agree to submit genuine academic transcripts and valid assessment inputs. Falsification of academic records or standardized test credentials voids verified counsellor endorsements.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>3. Appointment & Mentorship Etiquette</h4>
                    <p>
                      Direct 1-on-1 counsellor consultation slots must be scheduled in advance through the advisory calendar. Cancellations or reschedules require a minimum 24-hour notice.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>4. Intellectual Property</h4>
                    <p>
                      All diagnostic competency frameworks, 8-pathway career assessment methodologies, and proprietary scoring algorithms are the exclusive intellectual property of Global Consciousness.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalModal === 'protection' && (
                <div className="legal-modal-sections">
                  <div className="legal-section-block">
                    <h4>1. Encryption Standards</h4>
                    <p>
                      All student dossiers, SOP drafts, and assessment results are encrypted in transit via TLS 1.3 and at rest using AES-256 in isolated database partitions.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>2. Role-Based Access Isolation</h4>
                    <p>
                      Access to unmasked student records is strictly partitioned. Only assigned, verified counselors and authorized admissions administrators can view sensitive identity records through multi-factor authentication.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>3. Regulatory Compliance</h4>
                    <p>
                      Our data handling practices comply with the Indian Digital Personal Data Protection Act (DPDPA), the European General Data Protection Regulation (GDPR), and international student privacy conventions.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>4. Audit Logging & Verification</h4>
                    <p>
                      Every document upload, counselor review, and verification timestamp is recorded in immutable audit logs to protect students against unauthorized alterations or access.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="legal-modal-footer">
              <div className="legal-modal-status-badge">
                <CheckCircle2 size={16} color="#198754" />
                <span>Legally Binding Educational Service Agreement</span>
              </div>
              <button
                type="button"
                className="btn btn-primary legal-modal-close-action"
                onClick={() => setActiveLegalModal(null)}
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
