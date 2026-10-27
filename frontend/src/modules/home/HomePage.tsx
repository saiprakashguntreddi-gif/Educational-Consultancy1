import React from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import {
  Compass,
  GraduationCap,
  Users,
  TrendingUp,
  Check,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Target,
  FileCheck2,
  PhoneCall,
  Coins,
  Award,
  Globe,
  Layers,
  CalendarCheck,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'STUDENT') {
        onNavigate('profile-intake');
      } else {
        onNavigate('counsellor-queue');
      }
    } else {
      onNavigate('register');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-root" id="home">
      {/* =====================================================================
          1. HERO SECTION (EUniStud Benchmark)
          ===================================================================== */}
      <section className="hero-section">
        <div className="landing-container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                <span>✦ PREMIER EDUCATIONAL CONSULTANCY & GUIDANCE</span>
              </div>

              <h1 className="hero-title">
                <span>Your Gateway to</span>
                <span>Premier Universities &</span>
                <span className="hero-title-guidance">Global Excellence.</span>
              </h1>

              <p className="hero-subtitle">
                Superconsciousness bridges the gap between student aspirations and top educational institutions worldwide. Plan 54+ entrance exams, assess competencies, and secure verified admissions with structured mentor guidance.
              </p>

              <div className="hero-actions">
                <button
                  onClick={handleGetStarted}
                  className="btn-primary-indigo"
                  id="hero-get-started-btn"
                >
                  <span>{user ? 'Go to Dashboard' : 'Apply Now — Get Started'}</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => onNavigate('entrance')}
                  className="btn-secondary-outline"
                  id="hero-explore-btn"
                >
                  <Compass size={17} />
                  <span>Explore 54+ Entrance Exams</span>
                </button>
              </div>

              <div className="hero-trust-line">
                <ShieldCheck size={18} color="#129DB9" />
                <span>Verified Admissions Guidance • Certified Counselling Framework</span>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <img
                  src="/assets/hero-student.jpg"
                  alt="University student in academic library researching admissions"
                  className="hero-image"
                />

                {/* Floating Card 1: Student Profile / Verified */}
                <div className="hero-floating-card floating-card-top-left">
                  <div className="card-icon-bubble verified">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="card-label-col">
                    <span className="card-label-title">Student Profile</span>
                    <span className="card-label-sub" style={{ color: '#059669', fontWeight: 700 }}>
                      Verified Intake ✓
                    </span>
                  </div>
                </div>

                {/* Floating Card 2: 54+ Entrance Exams */}
                <div
                  className="hero-floating-card floating-card-mid-right"
                  onClick={() => onNavigate('entrance')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-icon-bubble">
                    <Sparkles size={18} />
                  </div>
                  <div className="card-label-col">
                    <span className="card-label-title">Entrance Exams</span>
                    <span className="card-label-sub" style={{ color: '#129DB9', fontWeight: 600 }}>
                      54 Verified Catalog →
                    </span>
                  </div>
                </div>

                {/* Floating Card 3: 1-on-1 Guidance */}
                <div
                  className="hero-floating-card floating-card-bottom-left"
                  onClick={() => scrollTo('services')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-icon-bubble future">
                    <TrendingUp size={18} />
                  </div>
                  <div className="card-label-col">
                    <span className="card-label-title">Advisory Pathways</span>
                    <span className="card-label-sub" style={{ color: '#084F5E', fontWeight: 600 }}>
                      Personalised Roadmap →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credibility Stats Ribbon (Directly anchored below hero) */}
          <div className="hero-stats-ribbon" id="hero-stats-ribbon">
            <div className="hero-stats-grid">
              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  500<span>+</span>
                </div>
                <div className="hero-stat-label">Students Guided & Placed</div>
                <div className="hero-stat-sublabel">Across Premier Global Institutions</div>
              </div>

              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  54<span>+</span>
                </div>
                <div className="hero-stat-label">Verified Entrance Exams</div>
                <div className="hero-stat-sublabel">Detailed Syllabi & Mock Testing</div>
              </div>

              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  7<span></span>
                </div>
                <div className="hero-stat-label">Core Academic Streams</div>
                <div className="hero-stat-sublabel">Engg, MBA, Study Abroad, Design & More</div>
              </div>

              <div className="hero-stat-card">
                <div className="hero-stat-number">
                  99<span>%</span>
                </div>
                <div className="hero-stat-label">Guidance Satisfaction</div>
                <div className="hero-stat-sublabel">Transparent Certified Advisory</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ACCESS PORTAL TRACKS (Inspired by EUniStud Access Cards)
          ===================================================================== */}
      <section className="portal-tracks-section" id="portal-tracks">
        <div className="landing-container">
          <div className="portal-tracks-grid">
            {/* Track 1: Student Command Center */}
            <div
              className="portal-track-card"
              onClick={handleGetStarted}
              id="portal-track-student"
            >
              <div>
                <div className="portal-track-icon-row">
                  <div className="portal-track-icon">
                    <GraduationCap size={24} />
                  </div>
                  <span className="portal-track-badge">Student Portal</span>
                </div>
                <h3 className="portal-track-title">Student Command Center</h3>
                <p className="portal-track-desc">
                  Build your verified academic profile, complete 8-pathway career fit assessments, and manage your personalized exam prep roadmap.
                </p>
              </div>
              <div className="portal-track-cta">
                <span>{user ? 'Open Dashboard' : 'Register as a Student'}</span>
                <ArrowRight size={17} />
              </div>
            </div>

            {/* Track 2: Entrance Exam Intelligence */}
            <div
              className="portal-track-card"
              onClick={() => onNavigate('entrance')}
              id="portal-track-exams"
            >
              <div>
                <div className="portal-track-icon-row">
                  <div className="portal-track-icon" style={{ color: '#084F5E', background: 'rgba(8, 79, 94, 0.1)' }}>
                    <BookOpen size={24} />
                  </div>
                  <span className="portal-track-badge" style={{ color: '#084F5E' }}>54+ Exams</span>
                </div>
                <h3 className="portal-track-title">Entrance Exam Intelligence</h3>
                <p className="portal-track-desc">
                  Discover competitive national & international entrance exams with syllabi, dates, scoring patterns, and full-length timed diagnostic mocks.
                </p>
              </div>
              <div className="portal-track-cta" style={{ color: '#084F5E' }}>
                <span>Explore 54+ Entrance Exams</span>
                <ArrowRight size={17} />
              </div>
            </div>

            {/* Track 3: 1-on-1 Guidance Advisory */}
            <div
              className="portal-track-card"
              onClick={() => scrollTo('contact')}
              id="portal-track-mentorship"
            >
              <div>
                <div className="portal-track-icon-row">
                  <div className="portal-track-icon" style={{ color: '#B7791F', background: 'rgba(255, 181, 71, 0.18)' }}>
                    <Users size={24} />
                  </div>
                  <span className="portal-track-badge" style={{ color: '#B7791F' }}>Mentorship</span>
                </div>
                <h3 className="portal-track-title">1-on-1 Certified Mentorship</h3>
                <p className="portal-track-desc">
                  Consult directly with certified educational counsellors for university shortlisting, SOP verification, fee planning, and visa dossiers.
                </p>
              </div>
              <div className="portal-track-cta" style={{ color: '#B7791F' }}>
                <span>Book Guidance Consultation</span>
                <ArrowRight size={17} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ABOUT SECTION
          ===================================================================== */}
      <section className="about-section" id="about">
        <div className="landing-container">
          <div className="about-grid">
            {/* Left: Mentor / Student Consultation Image */}
            <div className="about-image-card">
              <img
                src="/assets/mentor-guidance.jpg"
                alt="Educational consultant mentoring student on university pathways"
                className="about-image"
              />
            </div>

            {/* Right: Content & Value Proposition */}
            <div className="about-content">
              <span className="section-badge">About Superconsciousness</span>
              <h2 className="about-heading">
                Education decisions should be informed, not overwhelming.
              </h2>
              <p className="about-paragraph">
                Every student has unique strengths, academic backgrounds, and aspirations.
                Superconsciousness replaces fragmented advice and hearsay with a structured, verified student guidance framework.
              </p>

              <div className="about-features-list">
                <div className="about-feature-item">
                  <div className="feature-check-icon">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div className="feature-text-block">
                    <span className="feature-text-title">Understand your individual strengths</span>
                    <span className="feature-text-desc">
                      Clarify academic competencies, curriculum board strengths (CBSE, ICSE, IB, Cambridge, State), and career inclinations.
                    </span>
                  </div>
                </div>

                <div className="about-feature-item">
                  <div className="feature-check-icon">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div className="feature-text-block">
                    <span className="feature-text-title">Explore calibrated pathways</span>
                    <span className="feature-text-desc">
                      Discover colleges, entrance exams, and study programs calibrated precisely to your verified student profile.
                    </span>
                  </div>
                </div>

                <div className="about-feature-item">
                  <div className="feature-check-icon">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div className="feature-text-block">
                    <span className="feature-text-title">Make confident, informed decisions</span>
                    <span className="feature-text-desc">
                      Plan every milestone backed by real admission data, diagnostic mock testing, and certified counsellor oversight.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => scrollTo('how-it-works')}
                className="btn-secondary-outline"
                id="about-discover-btn"
              >
                <span>Discover Our Advisory Process</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. CORE SERVICES SECTION (3-Column Grid, 6 Real Services)
          ===================================================================== */}
      <section className="services-section" id="services">
        <div className="landing-container">
          <div className="section-header-center">
            <span className="section-badge">Our Core Consultancy Services</span>
            <h2 className="section-heading-lg">Comprehensive Guidance Across Every Stage</h2>
            <p className="section-subtext">
              From initial entrance exam preparation to final university enrolment, our structured services provide end-to-end guidance tailored to your ambitions.
            </p>
          </div>

          <div className="services-grid-3col">
            {/* Service 1: Entrance Exam Discovery */}
            <div className="service-box-card" id="service-card-entrance">
              <div>
                <div className="service-icon-wrapper">
                  <BookOpen size={22} />
                </div>
                <h3 className="service-title">Entrance Exam Discovery</h3>
                <p className="service-desc">
                  Browse 54+ national & international entrance examinations across engineering, management, study abroad, medicine, and design with syllabi, dates, and patterns.
                </p>
              </div>
              <button
                className="service-action-link"
                onClick={() => onNavigate('entrance')}
              >
                <span>Explore Entrance Exams</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Service 2: Personalised Academic Guidance */}
            <div className="service-box-card" id="service-card-guidance">
              <div>
                <div className="service-icon-wrapper">
                  <Compass size={22} />
                </div>
                <h3 className="service-title">Personalised Educational Guidance</h3>
                <p className="service-desc">
                  Structured intake evaluating academic history, curriculum boards (CBSE, ICSE, IB, Cambridge), subject specializations, and individual student capability.
                </p>
              </div>
              <button
                className="service-action-link"
                onClick={handleGetStarted}
              >
                <span>Start Student Intake</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Service 3: Career Planning & Assessment */}
            <div className="service-box-card" id="service-card-career">
              <div>
                <div className="service-icon-wrapper">
                  <Target size={22} />
                </div>
                <h3 className="service-title">Career & Pathway Planning</h3>
                <p className="service-desc">
                  Rigorous 8-Pathway career fit assessments matching student inclinations with emerging global industry sectors, professional degrees, and career trajectories.
                </p>
              </div>
              <button
                className="service-action-link"
                onClick={handleGetStarted}
              >
                <span>Assess Career Pathways</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Service 4: Diagnostic Mock Tests */}
            <div className="service-box-card" id="service-card-mocks">
              <div>
                <div className="service-icon-wrapper">
                  <Award size={22} />
                </div>
                <h3 className="service-title">Diagnostic Mock Tests & Prep</h3>
                <p className="service-desc">
                  Timed diagnostic mock exams with countdown timers, immediate accuracy analytics, question-level answer keys, and performance tracking.
                </p>
              </div>
              <button
                className="service-action-link"
                onClick={() => onNavigate('entrance')}
              >
                <span>Take Diagnostic Mock</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Service 5: College & University Discovery */}
            <div className="service-box-card" id="service-card-colleges">
              <div>
                <div className="service-icon-wrapper">
                  <GraduationCap size={22} />
                </div>
                <h3 className="service-title">College & University Discovery</h3>
                <p className="service-desc">
                  Three-tier recommendation framework (Dream, Reach, Safe) matching student profiles to verified institutions across India and global study destinations.
                </p>
              </div>
              <button
                className="service-action-link"
                onClick={() => onNavigate('colleges')}
              >
                <span>Discover Institutions</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Service 6: Scholarships & Financial Advisory */}
            <div className="service-box-card" id="service-card-scholarships">
              <div>
                <div className="service-icon-wrapper">
                  <Coins size={22} />
                </div>
                <h3 className="service-title">Scholarships & Fee Advisory</h3>
                <p className="service-desc">
                  Identify merit- and need-based scholarships, calculate net tuition and living expenditures, and prepare competitive financial aid submissions.
                </p>
              </div>
              <button
                className="service-action-link"
                onClick={() => onNavigate('scholarships')}
              >
                <span>Search Scholarships</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. STUDENT JOURNEY (4-Step Connected Process in Dark Navy)
          ===================================================================== */}
      <section className="journey-dark-section" id="how-it-works">
        <div className="landing-container">
          <div className="section-header-center" style={{ color: '#FFFFFF' }}>
            <span
              className="section-badge"
              style={{
                backgroundColor: 'rgba(64, 199, 229, 0.15)',
                color: '#40C7E5',
                borderColor: 'rgba(64, 199, 229, 0.35)',
              }}
            >
              Structured Advisory Roadmap
            </span>
            <h2 className="section-heading-lg" style={{ color: '#FFFFFF' }}>
              Your Journey, One Step at a Time
            </h2>
            <p className="section-subtext" style={{ color: '#CBD5E1' }}>
              Four connected stages designed to take you from initial academic discovery to confident, verified university admissions.
            </p>
          </div>

          <div className="journey-steps-grid">
            {/* Step 01: Discover */}
            <div className="journey-step-card" id="step-discover">
              <div className="journey-step-num">01.</div>
              <h3 className="journey-step-title">Discover</h3>
              <p className="journey-step-desc">
                Build your verified student profile and discover matched academic pathways, curriculum boards, and global institutions.
              </p>
            </div>

            {/* Step 02: Understand */}
            <div className="journey-step-card" id="step-understand">
              <div className="journey-step-num">02.</div>
              <h3 className="journey-step-title">Understand</h3>
              <p className="journey-step-desc">
                Analyze your strengths, academic inclinations, and career interests through structured diagnostic evaluations.
              </p>
            </div>

            {/* Step 03: Plan */}
            <div className="journey-step-card" id="step-plan">
              <div className="journey-step-num">03.</div>
              <h3 className="journey-step-title">Plan</h3>
              <p className="journey-step-desc">
                Create a personalised exam preparation roadmap with clear milestone schedules, target scores, and prerequisites.
              </p>
            </div>

            {/* Step 04: Move Forward */}
            <div className="journey-step-card" id="step-move-forward">
              <div className="journey-step-num">04.</div>
              <h3 className="journey-step-title">Move Forward</h3>
              <p className="journey-step-desc">
                Engage directly with expert educational counsellors to finalize admissions, verify documents, and secure your offer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. GLOBAL STUDY DESTINATIONS SHOWCASE (EUniStud Style)
          ===================================================================== */}
      <section className="destinations-section" id="destinations">
        <div className="landing-container">
          <div className="section-header-center">
            <span className="section-badge">Global Study Hubs</span>
            <h2 className="section-heading-lg">Explore Premier Education Destinations</h2>
            <p className="section-subtext">
              Target world-renowned universities with tailored admission requirements, test prep, and visa support.
            </p>
          </div>

          <div className="destinations-grid-5col">
            {/* UK */}
            <div
              className="destination-card"
              onClick={() => onNavigate('entrance')}
              id="destination-uk"
            >
              <img
                src="/assets/dest-uk.jpg"
                alt="Study in United Kingdom"
                className="destination-img"
              />
              <div className="destination-overlay" />
              <div className="destination-content">
                <div className="destination-country">United Kingdom</div>
                <div className="destination-meta">Top QS Universities • Graduate Visa</div>
              </div>
            </div>

            {/* USA */}
            <div
              className="destination-card"
              onClick={() => onNavigate('entrance')}
              id="destination-usa"
            >
              <img
                src="/assets/dest-usa.jpg"
                alt="Study in United States"
                className="destination-img"
              />
              <div className="destination-overlay" />
              <div className="destination-content">
                <div className="destination-country">United States</div>
                <div className="destination-meta">Ivy League & Research • STEM OPT</div>
              </div>
            </div>

            {/* Canada */}
            <div
              className="destination-card"
              onClick={() => onNavigate('entrance')}
              id="destination-canada"
            >
              <img
                src="/assets/dest-canada.jpg"
                alt="Study in Canada"
                className="destination-img"
              />
              <div className="destination-overlay" />
              <div className="destination-content">
                <div className="destination-country">Canada</div>
                <div className="destination-meta">World-Class Degrees • PGWP Eligible</div>
              </div>
            </div>

            {/* Germany */}
            <div
              className="destination-card"
              onClick={() => onNavigate('entrance')}
              id="destination-germany"
            >
              <img
                src="/assets/dest-germany.jpg"
                alt="Study in Germany"
                className="destination-img"
              />
              <div className="destination-overlay" />
              <div className="destination-content">
                <div className="destination-country">Germany</div>
                <div className="destination-meta">Tuition-Free Public Unis • Tech Hub</div>
              </div>
            </div>

            {/* Australia */}
            <div
              className="destination-card"
              onClick={() => onNavigate('entrance')}
              id="destination-australia"
            >
              <img
                src="/assets/dest-australia.jpg"
                alt="Study in Australia"
                className="destination-img"
              />
              <div className="destination-overlay" />
              <div className="destination-content">
                <div className="destination-country">Australia</div>
                <div className="destination-meta">Group of Eight • Post-Study Rights</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. STUDENT GUIDANCE RESOURCES & TOOLKITS
          ===================================================================== */}
      <section id="resources" className="resources-section">
        <div className="landing-container">
          <div className="resources-card">
            <div className="resources-content-wrap">
              <div className="resources-icon-box">
                <FileCheck2 size={24} />
              </div>
              <div className="resources-text-block">
                <h3 className="resources-heading">
                  Student Guidance Resources & Toolkits
                </h3>
                <p className="resources-subtext">
                  Access curated entrance examination syllabi, board comparative frameworks, and university admission checklists.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('entrance')}
              className="btn-primary-indigo resources-action-btn"
              id="resources-action-btn"
            >
              <span>Explore Exam Catalog</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. CALL TO ACTION SECTION
          ===================================================================== */}
      <section className="cta-section" id="get-started">
        <div className="landing-container">
          <div className="cta-box">
            <h2 className="cta-title">Ready to understand your next step?</h2>
            <p className="cta-text">
              Start your student journey with Superconsciousness. Complete your initial
              profile intake and receive structured, verified guidance from expert mentors.
            </p>

            <div className="cta-actions">
              <button
                onClick={handleGetStarted}
                className="btn-cta-primary"
                id="cta-get-started-btn"
              >
                <span>{user ? 'Open Student Portal' : 'Apply Now — Get Started'}</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => scrollTo('contact')}
                className="btn-cta-secondary"
                id="cta-talk-to-us-btn"
              >
                <PhoneCall size={16} />
                <span>Talk to an Advisor</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
