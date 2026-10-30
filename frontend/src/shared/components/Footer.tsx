import React, { useState, useEffect } from 'react';
import {
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
      <footer className="clean-footer" id="site-footer">
        <div className="landing-container">
          <div className="clean-footer-grid">
            {/* 1. Brand Column */}
            <div className="clean-footer-col clean-footer-brand-col">
              <div
                className="clean-footer-logo-row"
                onClick={() => scrollTo('home')}
                role="button"
                tabIndex={0}
              >
                <div className="clean-footer-logo-badge">
                  <span>G</span>
                </div>
                <span className="clean-footer-brand-name">
                  Global<span className="brand-orange">Consciousness</span>
                </span>
              </div>

              <p className="clean-footer-desc">
                Integrated educational consultancy and student guidance platform.
              </p>

              <div className="clean-footer-verified">
                <ShieldCheck size={16} className="clean-footer-shield" />
                <span>Verified Student Guidance System</span>
              </div>
            </div>

            {/* 2. Platform Column */}
            <div className="clean-footer-col">
              <h4 className="clean-footer-title">Platform</h4>
              <ul className="clean-footer-list">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('home')}
                    className="clean-footer-link"
                    id="footer-home-link"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('services')}
                    className="clean-footer-link"
                    id="footer-services-link"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('about')}
                    className="clean-footer-link"
                    id="footer-about-link"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('how-it-works')}
                    className="clean-footer-link"
                    id="footer-how-it-works-link"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollTo('contact')}
                    className="clean-footer-link"
                    id="footer-contact-link"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. Account Column */}
            <div className="clean-footer-col">
              <h4 className="clean-footer-title">Account</h4>
              <ul className="clean-footer-list">
                <li>
                  <button
                    type="button"
                    className="clean-footer-link"
                    onClick={() => handleAccountClick('login')}
                    id="footer-login-link"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="clean-footer-link"
                    onClick={() => handleAccountClick('register')}
                    id="footer-register-link"
                  >
                    Register
                  </button>
                </li>
              </ul>
            </div>

            {/* 4. Contact Column */}
            <div className="clean-footer-col clean-footer-contact-col" id="contact">
              <h4 className="clean-footer-title">Contact</h4>

              <div className="clean-footer-contact-group">
                <span className="clean-footer-contact-label">Email</span>
                <a
                  href="mailto:guidance@globalconsciousness.edu"
                  className="clean-footer-contact-val"
                >
                  guidance@globalconsciousness.edu
                </a>
              </div>

              <div className="clean-footer-contact-group">
                <span className="clean-footer-contact-label">Advisory hours</span>
                <span className="clean-footer-contact-val">Mon – Fri, 9:00 AM – 6:00 PM</span>
              </div>

              <p className="clean-footer-contact-note">
                Student profiles are reviewed through our verified counsellor portal.
              </p>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="clean-footer-bottom-bar">
            <div className="clean-footer-copyright">
              &copy; 2026 Global Consciousness. All rights reserved.
            </div>
            <div className="clean-footer-legal-links">
              <button
                type="button"
                className="clean-footer-legal-btn"
                onClick={() => setActiveLegalModal('privacy')}
                id="footer-privacy-btn"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                className="clean-footer-legal-btn"
                onClick={() => setActiveLegalModal('terms')}
                id="footer-terms-btn"
              >
                Terms of Service
              </button>
              <button
                type="button"
                className="clean-footer-legal-btn"
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
