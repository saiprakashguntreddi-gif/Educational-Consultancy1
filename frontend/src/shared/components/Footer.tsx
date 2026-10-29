import React, { useState, useEffect } from 'react';
import { Compass, Mail, Clock, ShieldCheck, X, FileText, Lock, CheckCircle2 } from 'lucide-react';

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
        <div className="landing-container">
          <div className="footer-inner-grid">
            {/* Brand Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="footer-brand-badge" onClick={() => scrollTo('home')} style={{ cursor: 'pointer' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: 'var(--color-brand-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  <Compass size={16} />
                </div>
                <span
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    color: 'var(--color-ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  SUPER<span style={{ color: 'var(--color-brand-dark)' }}>CONSCIOUSNESS</span>
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.55, maxWidth: '340px', margin: 0 }}>
                Integrated Educational Consultancy and Student Guidance Platform.
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  width: 'fit-content',
                }}
              >
                <ShieldCheck size={13} color="#38bdf8" /> Verified Student Guidance System
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="footer-col-header">Platform</h4>
              <ul className="footer-links-vertical">
                <li>
                  <span className="footer-link-action" onClick={() => scrollTo('home')} id="footer-home-link">
                    Home
                  </span>
                </li>
                <li>
                  <span className="footer-link-action" onClick={() => scrollTo('services')} id="footer-services-link">
                    Services
                  </span>
                </li>
                <li>
                  <span className="footer-link-action" onClick={() => scrollTo('about')} id="footer-about-link">
                    About
                  </span>
                </li>
                <li>
                  <span className="footer-link-action" onClick={() => scrollTo('how-it-works')} id="footer-how-it-works-link">
                    How It Works
                  </span>
                </li>
                <li>
                  <span className="footer-link-action" onClick={() => scrollTo('contact')} id="footer-contact-link">
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
              <ul className="footer-links-vertical" style={{ gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                  <Mail size={14} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <a href="mailto:guidance@superconsciousness.edu" style={{ color: 'inherit', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    guidance@superconsciousness.edu
                  </a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.72)' }}>
                  <Clock size={14} color="#38bdf8" style={{ flexShrink: 0 }} />
                  <span>Advisory Hours: Mon – Fri, 9:00 AM – 6:00 PM</span>
                </li>
                <li style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.55)', lineHeight: 1.45, marginTop: '2px' }}>
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
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', color: 'rgba(255, 255, 255, 0.55)', fontSize: '12.5px' }}>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveLegalModal('privacy')}
                id="footer-privacy-btn"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                className="footer-legal-link"
                onClick={() => setActiveLegalModal('terms')}
                id="footer-terms-btn"
              >
                Terms of Service
              </button>
              <span>•</span>
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

      {/* Official Legal Modal Dialog */}
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
                  {activeLegalModal === 'privacy' && <Lock size={20} color="#0071e3" />}
                  {activeLegalModal === 'terms' && <FileText size={20} color="#0071e3" />}
                  {activeLegalModal === 'protection' && <ShieldCheck size={20} color="#0071e3" />}
                </div>
                <div>
                  <h3 className="legal-modal-title">
                    {activeLegalModal === 'privacy' && 'Privacy Policy & Student Data Charter'}
                    {activeLegalModal === 'terms' && 'Terms of Educational Advisory Service'}
                    {activeLegalModal === 'protection' && 'Student Data Protection & Compliance Framework'}
                  </h3>
                  <span className="legal-modal-subtitle">
                    Superconsciousness Official Legal Documentation • Last Revised: October 2026
                  </span>
                </div>
              </div>

              <button
                className="legal-modal-close-btn"
                onClick={() => setActiveLegalModal(null)}
                aria-label="Close modal"
                id="legal-modal-close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
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

            {/* Modal Body Content */}
            <div className="legal-modal-body">
              {activeLegalModal === 'privacy' && (
                <div className="legal-modal-sections">
                  <div className="legal-section-block">
                    <h4>1. Purpose & Academic Scope</h4>
                    <p>
                      Superconsciousness collects and evaluates student academic credentials, secondary board marks (CBSE, ICSE, State Boards, IB, Cambridge), curriculum specializations, and career inclinations strictly to furnish calibrated university recommendations and structured counselor guidance.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>2. Zero Third-Party Commercial Monetization</h4>
                    <p>
                      We enforce an uncompromising commitment: <strong>we never sell, rent, trade, or distribute student contact numbers, emails, or personal portfolios</strong> to commercial coaching centers, lead brokers, or unauthorized third parties.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>3. Explicit Application Consent</h4>
                    <p>
                      Academic dossiers, test scores, and recommendation summaries are only shared with partner institutions upon explicit authorization by the student or designated parent/guardian during active admission processing.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>4. Data Subject Rights & Deletion</h4>
                    <p>
                      Students hold absolute sovereignty over their data. You have the right to request a full copy of your portfolio, update personal particulars, or request permanent cryptographic erasure by contacting our compliance officer at <code>privacy@superconsciousness.edu</code>.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalModal === 'terms' && (
                <div className="legal-modal-sections">
                  <div className="legal-section-block">
                    <h4>1. Educational Advisory Framework</h4>
                    <p>
                      Superconsciousness functions as a specialized educational consultancy. Our algorithms, diagnostic assessments, and counselor shortlists provide calibrated guidance based on verified academic metrics and institutional requirements.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>2. Student Accuracy & Record Integrity</h4>
                    <p>
                      Users warrant that all submitted transcripts, scores, and portfolio documents are authentic. Providing falsified credentials or fraudulent documents constitutes grounds for immediate profile termination and institutional notification.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>3. Certified Counselor Code of Conduct</h4>
                    <p>
                      All advisors in the Superconsciousness network adhere to transparent advisory standards. Counselor recommendations are motivated solely by student academic fit, career potential, and affordability.
                    </p>
                  </div>

                  <div className="legal-section-block">
                    <h4>4. Sovereign Authority Disclaimer</h4>
                    <p>
                      While Superconsciousness assists with admission applications, scholarship dossiers, and visa requirements, final admission offers, financial aid disbursements, and visa decisions remain under the sole sovereign jurisdiction of the respective university senates and embassy consulates.
                    </p>
                  </div>
                </div>
              )}

              {activeLegalModal === 'protection' && (
                <div className="legal-modal-sections">
                  <div className="legal-section-block">
                    <h4>1. Cryptographic Security Standards</h4>
                    <p>
                      All personal student information, academic transcripts, and communications are encrypted at rest using AES-256 standards and transmitted across TLS 1.3 encrypted tunnels on isolated database partitions.
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
                <CheckCircle2 size={16} color="#10b981" />
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
