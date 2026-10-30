import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import {
  Compass,
  GraduationCap,
  Check,
  ArrowRight,
  BookOpen,
  Target,
  Phone,
  Coins,
  Award,
  ShieldCheck,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (view: string) => void;
}

const CAMPUS_SLIDES = [
  {
    src: '/assets/hero-university-building.png',
    alt: 'European Historic University Palace Front Elevation',
    caption: 'Premier European University Campuses',
  },
  {
    src: '/assets/college-oxford-campus.jpg',
    alt: 'Historic Oxford University Campus Front Quad',
    caption: 'Historic Collegiate University Campuses',
  },
  {
    src: '/assets/college-cambridge-kings.jpg',
    alt: 'King\'s College Cambridge Front Grounds',
    caption: 'World-Renowned Research Universities',
  },
  {
    src: '/assets/college-front-toronto.jpg',
    alt: 'University of Toronto Historic Front Facade',
    caption: 'Iconic Global University Facades',
  },
  {
    src: '/assets/college-front-trinity.jpg',
    alt: 'Trinity College Historic Front Campanile Quad',
    caption: 'Historic World-Class Campus Architecture',
  },
  {
    src: '/assets/hero-building-modern.jpg',
    alt: 'Collegiate Gothic University Front Hall',
    caption: 'Premier Tier-1 Global Institutions',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      if (user.role === 'STUDENT') {
        onNavigate('dashboard');
      } else {
        onNavigate('counsellor-queue');
      }
    } else {
      onNavigate('login');
    }
  };

  const handleExplore = (targetView: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    onNavigate(targetView);
  };



  return (
    <div className="landing-root" id="home" onClick={!user ? () => onNavigate('login') : undefined}>
      {/* =====================================================================
          1. HERO SECTION (Animated Multi-College Background Slideshow)
          ===================================================================== */}
      <section className="hero-section">
        {/* Animated Background University Slides */}
        <div className="hero-bg-media hero-slides-container">
          {CAMPUS_SLIDES.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.src}
                className={`hero-slide-item ${isActive ? 'is-active' : ''}`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="hero-bg-img hero-slide-img"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            );
          })}
          <div className="hero-dark-overlay" />

          {/* Minimal Elegant Slide Navigation Indicators */}
          <div className="hero-slide-indicators">
            {CAMPUS_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                onClick={() => setCurrentSlide(index)}
                className={`hero-slide-dot ${index === currentSlide ? 'is-active' : ''}`}
                aria-label={`Switch to slide ${index + 1}: ${slide.caption}`}
                title={slide.caption}
              />
            ))}
          </div>
        </div>

        <div className="landing-container hero-container-relative">
          {/* Left Hero Content */}
          <div className="hero-content-inner">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>✦ PREMIER EDUCATIONAL CONSULTANCY & GUIDANCE</span>
            </div>

            <h1 className="t-h1 text-white">
              <span>Your Gateway to</span><br />
              <span>Premier Universities &</span><br />
              <span className="hero-title-highlight">Global Excellence.</span>
            </h1>

            <p className="t-body text-ink-dim">
              Global Consciousness bridges the gap between student aspirations and top educational institutions worldwide. Explore premier university pathways, assess academic competencies, and secure verified admissions with structured mentor guidance.
            </p>

            <div className="hero-actions">
              <button
                onClick={handleGetStarted}
                className="btn btn-primary"
                id="hero-get-started-btn"
              >
                <span>{user ? 'Go to Dashboard' : 'Apply Now — Get Started'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. ACCESS PORTAL TRACKS (EUniStud Tall + Stacked Cards Layout)
          ===================================================================== */}
      <section className="eunistud-section" id="portal-tracks">
        <div className="landing-container">
          <div className="eunistud-section-header">
            <div className="eunistud-header-left">
              <div className="eunistud-eyebrow-row">
                <span className="eunistud-eyebrow-line" />
                <h4 className="t-eyebrow text-brand-dark">Portal Tracks</h4>
              </div>
              <h2 className="t-h2">Student Command Center</h2>
            </div>
            <div className="eunistud-header-right">
              <p className="t-body text-ink-mute">
                Build your verified academic profile, explore calibrated examination pathways, and connect directly with certified educational advisors.
              </p>
            </div>
          </div>

          <div className="eunistud-portal-cards-layout">
            {/* Tall Left Card: Student Command Center */}
            <div
              className="eunistud-portal-card-tall group"
              id="portal-track-student"
              onClick={() => handleExplore('dashboard')}
            >
              <img
                src="/assets/card-students-library.jpg"
                alt="Student Command Center"
                className="eunistud-card-bg-img eunistud-card-library-img"
              />
              <div className="eunistud-card-overlay" />
              <div className="eunistud-card-content">
                <div className="eunistud-card-tag-row">
                  <span className="eunistud-badge-brand">Student Portal</span>
                </div>
                <div className="eunistud-card-title-row">
                  <h3 className="t-h3 text-white">Student Command Center</h3>
                  <span className="eunistud-round-arrow">
                    <ArrowRight size={18} />
                  </span>
                </div>
                <p className="t-small text-ink-dim">
                  Build your verified academic profile, complete 8-pathway career fit assessments, and manage your personalized exam prep roadmap.
                </p>
              </div>
            </div>

            {/* Stacked Right Column: 2 Cards */}
            <div className="eunistud-portal-cards-stacked">
              {/* Card 2: Global University Discovery */}
              <div
                className="eunistud-portal-card-stacked group"
                onClick={() => handleExplore('colleges')}
                id="portal-track-colleges"
              >
                <img
                  src="/assets/card-campus-exterior.jpg"
                  alt="Global University Discovery"
                  className="eunistud-card-bg-img eunistud-card-campus-img"
                />
                <div className="eunistud-card-overlay" />
                <div className="eunistud-card-content">
                  <div className="eunistud-card-tag-row">
                    <span className="eunistud-badge-brand">750+ Universities</span>
                  </div>
                  <div className="eunistud-card-title-row">
                    <h3 className="t-h3 text-white">Global University Discovery</h3>
                    <span className="eunistud-round-arrow">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                  <p className="t-small text-ink-dim">
                    Discover world-renowned universities across India, UK, USA, Canada, Germany, and Australia calibrated precisely to your verified student profile.
                  </p>
                </div>
              </div>

              {/* Card 3: 1-on-1 Certified Mentorship */}
              <div
                className="eunistud-portal-card-stacked group"
                onClick={() => handleExplore('counsellors')}
                id="portal-track-mentorship"
              >
                <img
                  src="/assets/card-advisor-office.jpg"
                  alt="1-on-1 Certified Mentorship"
                  className="eunistud-card-bg-img eunistud-card-advisor-img"
                />
                <div className="eunistud-card-overlay" />
                <div className="eunistud-card-content">
                  <div className="eunistud-card-tag-row">
                    <span className="eunistud-badge-accent">Mentorship</span>
                  </div>
                  <div className="eunistud-card-title-row">
                    <h3 className="t-h3 text-white">1-on-1 Certified Mentorship</h3>
                    <span className="eunistud-round-arrow">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                  <p className="t-small text-ink-dim">
                    Consult directly with certified educational counsellors for university shortlisting, SOP verification, fee planning, and visa dossiers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CREDIBILITY STATS SECTION
          ===================================================================== */}
      <section className="eunistud-stats-section" id="hero-stats-ribbon">
        <img
          src="/assets/stats-campus-faded.jpg"
          alt="Campus Architecture"
          className="eunistud-stats-bg-img"
        />
        <div className="eunistud-stats-overlay" />

        <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="eunistud-stats-grid">
            <div className="eunistud-stat-item">
              <p className="t-stat-number">500+</p>
              <p className="t-stat-label">Students Guided & Placed</p>
              <p className="t-stat-sub">Across Premier Global Institutions</p>
            </div>

            <div className="eunistud-stat-item">
              <p className="t-stat-number">750+</p>
              <p className="t-stat-label">Accredited Global Universities</p>
              <p className="t-stat-sub">Calibrated Requirements & Cut-Offs</p>
            </div>

            <div className="eunistud-stat-item">
              <p className="t-stat-number">7</p>
              <p className="t-stat-label">Core Academic Streams</p>
              <p className="t-stat-sub">Engg, MBA, Study Abroad, Design & More</p>
            </div>

            <div className="eunistud-stat-item">
              <p className="t-stat-number">99%</p>
              <p className="t-stat-label">Guidance Satisfaction</p>
              <p className="t-stat-sub">Transparent Certified Advisory</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ABOUT SECTION (Exact Image 2 Specification with Transparent 4K Image)
          ===================================================================== */}
      <section className="about-modern-section" id="about">
        <div className="landing-container">
          <div className="about-layout-grid">
            {/* Left: Eyebrow, Bold Headline, and Transparent 4K Students Visual Showcase */}
            <div className="about-showcase-left">
              <div className="about-eyebrow-row">
                <span className="about-eyebrow-dash" />
                <span className="about-eyebrow-text">ABOUT GLOBAL CONSCIOUSNESS</span>
              </div>

              <h2 className="about-main-headline">
                Education decisions should be{' '}
                <span className="text-highlight-orange">informed,</span> not overwhelming.
              </h2>

              <div className="about-visual-container">
                {/* Floating Top Pill */}
                <div className="about-float-pill">
                  <span className="about-pill-dot" />
                  <span>Global Campus Network</span>
                </div>

                {/* 4K Transparent Students Image Cutout */}
                <img
                  src="/assets/about-students-transparent.png"
                  alt="Global Consciousness university students"
                  className="about-students-img"
                />

                {/* Floating Dark Card at Bottom */}
                <div className="about-float-card">
                  <div className="about-card-icon-orange">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="about-card-text">
                    <div className="about-card-title">100% Verified Pathways</div>
                    <div className="about-card-sub">Calibrated admissions &amp; exam advisory</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Narrative Lead, Underlined Action Link, and Numbered Steps (01, 02, 03) */}
            <div className="about-details-right">
              <p className="about-intro-paragraph">
                Every student has unique strengths, backgrounds and aspirations. We replace fragmented advice and hearsay with a structured, verified guidance framework, so every choice is made with clarity.
              </p>

              <div className="about-action-link-wrap">
                <button
                  type="button"
                  onClick={() => handleExplore('dashboard')}
                  className="about-link-with-underline"
                  id="about-discover-link"
                >
                  <span>Discover our advisory process</span>
                  <ArrowRight size={16} className="about-link-arrow" />
                </button>
              </div>

              <div className="about-numbered-list">
                {/* Step 01 */}
                <div className="about-num-item">
                  <span className="about-num-index">01</span>
                  <div className="about-num-content">
                    <h3 className="about-num-title">Understand your strengths</h3>
                    <p className="about-num-desc">
                      Clarify academic competencies, curriculum board strengths (CBSE, ICSE, IB, Cambridge, State) and career inclinations.
                    </p>
                  </div>
                </div>

                {/* Step 02 */}
                <div className="about-num-item">
                  <span className="about-num-index">02</span>
                  <div className="about-num-content">
                    <h3 className="about-num-title">Explore calibrated pathways</h3>
                    <p className="about-num-desc">
                      Discover premier colleges, degree programmes and study pathways matched to your verified student profile.
                    </p>
                  </div>
                </div>

                {/* Step 03 */}
                <div className="about-num-item">
                  <span className="about-num-index">03</span>
                  <div className="about-num-content">
                    <h3 className="about-num-title">Decide with confidence</h3>
                    <p className="about-num-desc">
                      Plan every milestone backed by real admission data, diagnostic mock tests and certified counsellor oversight.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. CORE SERVICES SECTION (3-Column Service Grid)
          ===================================================================== */}
      <section className="eunistud-section bg-surface" id="services">
        <div className="landing-container">
          <div className="eunistud-section-center-header">
            <div className="eunistud-eyebrow-row justify-center">
              <span className="eunistud-eyebrow-line" />
              <h4 className="t-eyebrow text-brand-dark">Our Core Consultancy Services</h4>
            </div>
            <h2 className="t-h2">Comprehensive Guidance Across Every Stage</h2>
            <p className="t-body text-ink-mute">
              From university shortlisting to final enrollment, our structured services provide end-to-end guidance tailored to your ambitions.
            </p>
          </div>

          <div className="eunistud-services-grid">
            {/* Service 1: Global University Discovery */}
            <div
              className="eunistud-service-card"
              id="service-card-discovery"
              onClick={() => handleExplore('colleges')}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="eunistud-service-icon-box">
                  <BookOpen size={24} />
                </div>
                <h3 className="t-h4 text-ink">Global University Discovery</h3>
                <p className="t-small text-ink-mute" style={{ marginTop: '8px' }}>
                  Browse 750+ accredited institutions across engineering, management, medicine, arts, and science with tailored admission requirements, cut-offs, and deadlines.
                </p>
              </div>
              <button
                className="t-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={(e) => { e.stopPropagation(); handleExplore('colleges'); }}
              >
                <span>Explore Universities →</span>
              </button>
            </div>

            {/* Service 2: Personalised Academic Guidance */}
            <div className="eunistud-service-card" id="service-card-guidance" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div>
                <div className="eunistud-service-icon-box">
                  <Compass size={24} />
                </div>
                <h3 className="t-h4 text-ink">Personalised Educational Guidance</h3>
                <p className="t-small text-ink-mute" style={{ marginTop: '8px' }}>
                  Structured intake evaluating academic history, curriculum boards (CBSE, ICSE, IB, Cambridge), subject specializations, and individual student capability.
                </p>
              </div>
              <button
                className="t-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={handleGetStarted}
              >
                <span>Start Student Intake →</span>
              </button>
            </div>

            {/* Service 3: Career Planning & Assessment */}
            <div className="eunistud-service-card" id="service-card-career" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div>
                <div className="eunistud-service-icon-box">
                  <Target size={24} />
                </div>
                <h3 className="t-h4 text-ink">Career & Pathway Planning</h3>
                <p className="t-small text-ink-mute" style={{ marginTop: '8px' }}>
                  Rigorous 8-Pathway career fit assessments matching student inclinations with emerging global industry sectors, professional degrees, and career trajectories.
                </p>
              </div>
              <button
                className="t-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={handleGetStarted}
              >
                <span>Assess Career Pathways →</span>
              </button>
            </div>

            {/* Service 4: Diagnostic Mock Tests */}
            <div className="eunistud-service-card" id="service-card-mocks" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div>
                <div className="eunistud-service-icon-box">
                  <Award size={24} />
                </div>
                <h3 className="t-h4 text-ink">Diagnostic Mock Tests & Prep</h3>
                <p className="t-small text-ink-mute" style={{ marginTop: '8px' }}>
                  Timed diagnostic mock exams with countdown timers, immediate accuracy analytics, question-level answer keys, and performance tracking.
                </p>
              </div>
              <button
                className="t-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={(e) => { e.stopPropagation(); handleExplore('dashboard'); }}
              >
                <span>Take Diagnostic Mock →</span>
              </button>
            </div>

            {/* Service 5: College & University Discovery */}
            <div className="eunistud-service-card" id="service-card-colleges" onClick={() => handleExplore('colleges')} style={{ cursor: 'pointer' }}>
              <div>
                <div className="eunistud-service-icon-box">
                  <GraduationCap size={24} />
                </div>
                <h3 className="t-h4 text-ink">College & University Discovery</h3>
                <p className="t-small text-ink-mute" style={{ marginTop: '8px' }}>
                  Three-tier recommendation framework (Dream, Reach, Safe) matching student profiles to verified institutions across India and global study destinations.
                </p>
              </div>
              <button
                className="t-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={(e) => { e.stopPropagation(); handleExplore('colleges'); }}
              >
                <span>Discover Institutions →</span>
              </button>
            </div>

            {/* Service 6: Scholarships & Financial Advisory */}
            <div className="eunistud-service-card" id="service-card-scholarships" onClick={() => handleExplore('scholarships')} style={{ cursor: 'pointer' }}>
              <div>
                <div className="eunistud-service-icon-box">
                  <Coins size={24} />
                </div>
                <h3 className="t-h4 text-ink">Scholarships & Fee Advisory</h3>
                <p className="t-small text-ink-mute" style={{ marginTop: '8px' }}>
                  Identify merit- and need-based scholarships, calculate net tuition and living expenditures, and prepare competitive financial aid submissions.
                </p>
              </div>
              <button
                className="t-link"
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={(e) => { e.stopPropagation(); handleExplore('scholarships'); }}
              >
                <span>Search Scholarships →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. STRUCTURED ADVISORY ROADMAP (Exact Image 2 Specification)
          ===================================================================== */}
      <section className="roadmap-blueprint-section" id="how-it-works">
        <div className="landing-container roadmap-container-relative">
          {/* Centered Section Header with Badge */}
          <div className="roadmap-center-header">
            <div className="roadmap-badge">
              <span className="roadmap-badge-dot" />
              <span>STRUCTURED ADVISORY ROADMAP</span>
            </div>
            <h2 className="roadmap-main-title">
              Your Roadmap to <span className="roadmap-title-highlight">Admission</span>
            </h2>
            <p className="roadmap-subtext">
              Four connected stages that take you from first discovery to a confident, verified university admission.
            </p>
          </div>

          {/* 4 Connected Cards in Single Horizontal Row */}
          <div className="roadmap-cards-grid">
            {/* Step 01: Discover */}
            <div 
              className="roadmap-step-card step-card-white" 
              id="step-discover" 
              onClick={() => handleExplore('dashboard')}
            >
              <div className="roadmap-card-top">
                <div className="roadmap-icon-badge">
                  <Compass size={20} />
                </div>
                <span className="roadmap-step-label">STEP 01</span>
              </div>
              <h3 className="roadmap-step-heading">Discover</h3>
              <p className="roadmap-step-desc">
                Build your verified student profile and discover matched academic pathways, curriculum boards and global institutions.
              </p>
              <div className="roadmap-progress-track">
                <div className="roadmap-progress-fill fill-step-1" />
              </div>

              {/* Arched Connector 1 -> 2 (Top Arch) */}
              <div className="roadmap-bridge bridge-top">
                <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="bridge-svg">
                  <path d="M 0,42 C 28,4 72,4 100,42" fill="none" stroke="#F38D22" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Step 02: Understand */}
            <div 
              className="roadmap-step-card step-card-white" 
              id="step-understand" 
              onClick={() => handleExplore('dashboard')}
            >
              <div className="roadmap-card-top">
                <div className="roadmap-icon-badge">
                  <BookOpen size={20} />
                </div>
                <span className="roadmap-step-label">STEP 02</span>
              </div>
              <h3 className="roadmap-step-heading">Understand</h3>
              <p className="roadmap-step-desc">
                Analyse your strengths, academic inclinations and career interests through structured diagnostic evaluations.
              </p>
              <div className="roadmap-progress-track">
                <div className="roadmap-progress-fill fill-step-2" />
              </div>

              {/* Loop Connector 2 -> 3 (Bottom Loop) */}
              <div className="roadmap-bridge bridge-bottom">
                <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="bridge-svg">
                  <path d="M 0,2 C 28,40 72,40 100,2" fill="none" stroke="#F38D22" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Step 03: Plan */}
            <div 
              className="roadmap-step-card step-card-white" 
              id="step-plan" 
              onClick={() => handleExplore('dashboard')}
            >
              <div className="roadmap-card-top">
                <div className="roadmap-icon-badge">
                  <Target size={20} />
                </div>
                <span className="roadmap-step-label">STEP 03</span>
              </div>
              <h3 className="roadmap-step-heading">Plan</h3>
              <p className="roadmap-step-desc">
                Get a personalised exam-preparation roadmap with clear milestones, target scores and prerequisites.
              </p>
              <div className="roadmap-progress-track">
                <div className="roadmap-progress-fill fill-step-3" />
              </div>

              {/* Arched Connector 3 -> 4 (Top Arch) */}
              <div className="roadmap-bridge bridge-top">
                <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="bridge-svg">
                  <path d="M 0,42 C 28,4 72,4 100,42" fill="none" stroke="#F38D22" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Step 04: Move Forward */}
            <div 
              className="roadmap-step-card step-card-orange" 
              id="step-move-forward" 
              onClick={() => handleExplore('dashboard')}
            >
              <div className="roadmap-card-top">
                <div className="roadmap-icon-badge dark-badge">
                  <GraduationCap size={20} />
                </div>
                <span className="roadmap-step-label dark-label">STEP 04</span>
              </div>
              <h3 className="roadmap-step-heading dark-heading">Move Forward</h3>
              <p className="roadmap-step-desc dark-desc">
                Work directly with expert counsellors to finalise admissions, verify documents and secure your offer.
              </p>
              <div className="roadmap-progress-track dark-track">
                <div className="roadmap-progress-fill fill-step-4" />
              </div>
            </div>
          </div>

          {/* Action CTAs underneath the cards (matching Image 2) */}
          <div className="roadmap-cta-group">
            <button 
              type="button"
              className="roadmap-btn-primary" 
              onClick={() => handleExplore('dashboard')}
            >
              <span>Start Your Journey</span>
              <ArrowRight size={16} />
            </button>
            <button 
              type="button"
              className="roadmap-btn-secondary" 
              onClick={() => handleExplore('appointments')}
            >
              Book a free counselling session
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. GLOBAL DESTINATIONS (Destination Cards Grid)
          ===================================================================== */}
      <section className="eunistud-section" id="destinations">
        <div className="landing-container">
          <div className="eunistud-section-center-header">
            <div className="eunistud-eyebrow-row justify-center">
              <span className="eunistud-eyebrow-line" />
              <h4 className="t-eyebrow text-brand-dark">Global Study Hubs</h4>
            </div>
            <h2 className="t-h2">Explore Premier Education Destinations</h2>
            <p className="t-body text-ink-mute">
              Target world-renowned universities with tailored admission requirements, test prep, and visa support.
            </p>
          </div>

          <div className="eunistud-destinations-grid">
            {/* UK */}
            <div
              className="eunistud-destination-card"
              onClick={() => handleExplore('colleges')}
              id="destination-uk"
            >
              <img
                src="/assets/dest-uk.jpg"
                alt="Study in United Kingdom"
                className="eunistud-destination-img"
              />
              <div className="eunistud-dest-overlay" />
              <div className="eunistud-dest-bottom">
                <h3 className="t-h4 text-white">United Kingdom</h3>
                <span className="t-small text-ink-dim">Top QS Universities • Graduate Visa</span>
              </div>
            </div>

            {/* USA */}
            <div
              className="eunistud-destination-card"
              onClick={() => handleExplore('colleges')}
              id="destination-usa"
            >
              <img
                src="/assets/dest-usa.jpg"
                alt="Study in United States"
                className="eunistud-destination-img"
              />
              <div className="eunistud-dest-overlay" />
              <div className="eunistud-dest-bottom">
                <h3 className="t-h4 text-white">United States</h3>
                <span className="t-small text-ink-dim">Ivy League & Research • STEM OPT</span>
              </div>
            </div>

            {/* Canada */}
            <div
              className="eunistud-destination-card"
              onClick={() => handleExplore('colleges')}
              id="destination-canada"
            >
              <img
                src="/assets/dest-canada.jpg"
                alt="Study in Canada"
                className="eunistud-destination-img"
              />
              <div className="eunistud-dest-overlay" />
              <div className="eunistud-dest-bottom">
                <h3 className="t-h4 text-white">Canada</h3>
                <span className="t-small text-ink-dim">World-Class Degrees • PGWP Eligible</span>
              </div>
            </div>

            {/* Germany */}
            <div
              className="eunistud-destination-card"
              onClick={() => handleExplore('colleges')}
              id="destination-germany"
            >
              <img
                src="/assets/dest-germany.jpg"
                alt="Study in Germany"
                className="eunistud-destination-img"
              />
              <div className="eunistud-dest-overlay" />
              <div className="eunistud-dest-bottom">
                <h3 className="t-h4 text-white">Germany</h3>
                <span className="t-small text-ink-dim">Tuition-Free Public Unis • Tech Hub</span>
              </div>
            </div>

            {/* Australia */}
            <div
              className="eunistud-destination-card"
              onClick={() => handleExplore('colleges')}
              id="destination-australia"
            >
              <img
                src="/assets/dest-australia.jpg"
                alt="Study in Australia"
                className="eunistud-destination-img"
              />
              <div className="eunistud-dest-overlay" />
              <div className="eunistud-dest-bottom">
                <h3 className="t-h4 text-white">Australia</h3>
                <span className="t-small text-ink-dim">Group of Eight • Post-Study Rights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. CALL TO ACTION SECTION (Exact Image 2 Specification)
          ===================================================================== */}
      <section className="cta-modern-dark-section" id="get-started">
        <div className="landing-container">
          <div className="cta-modern-grid">
            {/* Left Content Column */}
            <div className="cta-modern-left">
              {/* Eyebrow */}
              <div className="cta-modern-eyebrow">
                STUDENT GUIDANCE PROGRAM
              </div>

              {/* Main Headline with "next step?" in Orange */}
              <h2 className="cta-modern-headline">
                Ready to understand<br />
                your <span className="cta-modern-orange">next step?</span>
              </h2>

              {/* Description */}
              <p className="cta-modern-desc">
                Start your student journey with Global Consciousness. Complete your profile intake and receive structured, verified guidance from expert mentors.
              </p>

              {/* Action Buttons */}
              <div className="cta-modern-actions">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="cta-modern-btn-primary"
                  id="cta-get-started-btn"
                >
                  <span>Open Student Portal</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleExplore('counsellors')}
                  className="cta-modern-btn-secondary"
                  id="cta-talk-to-us-btn"
                >
                  <Phone size={15} />
                  <span>Talk to an Advisor</span>
                </button>
              </div>

              {/* 3 Micro-Columns at Bottom */}
              <div className="cta-modern-features-grid">
                <div className="cta-feature-col">
                  <h4 className="cta-feature-title">Personalised</h4>
                  <p className="cta-feature-sub">Guidance built on your goals</p>
                </div>
                <div className="cta-feature-col">
                  <h4 className="cta-feature-title">Verified mentors</h4>
                  <p className="cta-feature-sub">Vetted subject experts</p>
                </div>
                <div className="cta-feature-col">
                  <h4 className="cta-feature-title">Clear next steps</h4>
                  <p className="cta-feature-sub">A written action plan</p>
                </div>
              </div>
            </div>

            {/* Right Card Column: Guidance Roadmap */}
            <div className="cta-modern-right">
              <div className="cta-roadmap-card">
                {/* Card Header */}
                <div className="cta-card-header">
                  <div className="cta-card-header-left">
                    <span className="cta-card-eyebrow">YOUR PROGRESS</span>
                    <h3 className="cta-card-title">Guidance roadmap</h3>
                  </div>
                  <span className="cta-card-counter">2 of 3</span>
                </div>

                {/* Vertical Stepper */}
                <div className="cta-stepper">
                  {/* Step 1 */}
                  <div className="cta-step-item">
                    <div className="cta-step-node-col">
                      <div className="cta-step-circle is-done">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div className="cta-step-line is-done" />
                    </div>
                    <div className="cta-step-info">
                      <h4 className="cta-step-name">Profile intake</h4>
                      <p className="cta-step-sub">Goals, interests, background</p>
                    </div>
                    <span className="cta-step-badge-green">Completed</span>
                  </div>

                  {/* Step 2 */}
                  <div className="cta-step-item">
                    <div className="cta-step-node-col">
                      <div className="cta-step-circle is-done">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div className="cta-step-line is-pending" />
                    </div>
                    <div className="cta-step-info">
                      <h4 className="cta-step-name">Mentor match</h4>
                      <p className="cta-step-sub">Paired with a verified expert</p>
                    </div>
                    <span className="cta-step-badge-green">Completed</span>
                  </div>

                  {/* Step 3 */}
                  <div className="cta-step-item">
                    <div className="cta-step-node-col">
                      <div className="cta-step-circle is-current">
                        <span>3</span>
                      </div>
                    </div>
                    <div className="cta-step-info">
                      <h4 className="cta-step-name">Your next step</h4>
                      <p className="cta-step-sub">A clear, personal action plan</p>
                    </div>
                  </div>
                </div>

                {/* Action button inside card */}
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="cta-card-action-btn"
                  id="cta-continue-action-btn"
                >
                  <span>Continue to action plan</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
