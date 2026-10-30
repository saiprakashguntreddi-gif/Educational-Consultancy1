import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/context/AuthContext';
import {
  Compass,
  CheckCircle2,
  GraduationCap,
  Check,
  ArrowRight,
  BookOpen,
  Target,
  Phone,
  PhoneCall,
  Coins,
  Award,
  ShieldCheck,
  Users,
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
              Global Consultancy bridges the gap between student aspirations and top educational institutions worldwide. Explore premier university pathways, assess academic competencies, and secure verified admissions with structured mentor guidance.
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
          4. ABOUT SECTION (Two-Column with Checkmark List)
          ===================================================================== */}
      <section className="eunistud-section" id="about">
        <div className="landing-container">
          <div className="eunistud-about-grid">
            {/* Left: Full-Height London Campus Image with Credibility Badges */}
            <div className="eunistud-about-image-wrap">
              <img
                src="/assets/about-london-students.jpg"
                alt="International university students walking near Westminster London with Big Ben"
                className="eunistud-about-img"
              />
              <div className="eunistud-about-top-badge">
                <span className="eunistud-about-pulse-dot" />
                <span>Global Campus Network</span>
              </div>
              <div className="eunistud-about-floating-card">
                <div className="eunistud-about-floating-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="eunistud-about-floating-title">100% Verified Pathways</div>
                  <div className="eunistud-about-floating-subtitle">Calibrated admissions & exam advisory</div>
                </div>
              </div>
            </div>

            {/* Right: Perfectly Aligned Content & Value Proposition */}
            <div className="eunistud-about-content">
              <div className="eunistud-eyebrow-row">
                <span className="eunistud-eyebrow-line" />
                <h4 className="t-eyebrow text-brand-dark">About Global Consultancy</h4>
              </div>

              <h2 className="eunistud-about-heading">
                Education decisions should be informed, not overwhelming.
              </h2>
              <p className="eunistud-about-lead">
                Every student has unique strengths, academic backgrounds, and aspirations.
                Global Consultancy replaces fragmented advice and hearsay with a structured, verified student guidance framework.
              </p>

              <div className="eunistud-checklist">
                <div className="eunistud-checklist-item">
                  <div className="eunistud-check-bubble">
                    <Check size={15} strokeWidth={2.8} />
                  </div>
                  <div className="eunistud-check-body">
                    <h4 className="eunistud-check-title">Understand your individual strengths</h4>
                    <p className="eunistud-check-desc">
                      Clarify academic competencies, curriculum board strengths (CBSE, ICSE, IB, Cambridge, State), and career inclinations.
                    </p>
                  </div>
                </div>

                <div className="eunistud-checklist-item">
                  <div className="eunistud-check-bubble">
                    <Check size={15} strokeWidth={2.8} />
                  </div>
                  <div className="eunistud-check-body">
                    <h4 className="eunistud-check-title">Explore calibrated pathways</h4>
                    <p className="eunistud-check-desc">
                      Discover premier colleges, degree programs, and calibrated study pathways to your verified student profile.
                    </p>
                  </div>
                </div>

                <div className="eunistud-checklist-item">
                  <div className="eunistud-check-bubble">
                    <Check size={15} strokeWidth={2.8} />
                  </div>
                  <div className="eunistud-check-body">
                    <h4 className="eunistud-check-title">Make confident, informed decisions</h4>
                    <p className="eunistud-check-desc">
                      Plan every milestone backed by real admission data, diagnostic mock testing, and certified counsellor oversight.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleExplore('dashboard')}
                className="btn btn-primary eunistud-about-btn"
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
          6. STRUCTURED ADVISORY ROADMAP (College Students Moving Background)
          ===================================================================== */}
      <section className="eunistud-dark-section" id="how-it-works">
        {/* Animated Background: College Campus with Students & Ambient Glow */}
        <div className="roadmap-bg-media">
          <img
            src="/assets/campus-students-quad.jpg"
            alt="University campus with students"
            className="roadmap-bg-img"
          />
          <div className="roadmap-dark-overlay" />
          {/* Dynamic Ambient Glowing Orbs */}
          <div className="roadmap-orb roadmap-orb-1" />
          <div className="roadmap-orb roadmap-orb-2" />
          <div className="roadmap-orb roadmap-orb-3" />
        </div>

        <div className="landing-container roadmap-container-relative">
          {/* Centered Section Header with Badge (Matching Image 2 Layout) */}
          <div className="roadmap-center-header">
            <span className="roadmap-badge">
              STRUCTURED ADVISORY ROADMAP
            </span>
            <h2 className="t-h2 text-white">Your Journey, One Step at a Time</h2>
            <p className="t-body roadmap-subtext">
              Four connected stages designed to take you from initial academic discovery to confident, verified university admissions.
            </p>
          </div>

          {/* 4 Connected Cards in Single Horizontal Row */}
          <div className="roadmap-cards-grid">
            {/* Step 01: Discover */}
            <div className="roadmap-step-card step-card-1" id="step-discover" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div className="roadmap-card-shine" />
              <div className="roadmap-card-top">
                <span className="roadmap-step-num">01.</span>
                <div className="roadmap-icon-box">
                  <Compass size={20} />
                </div>
              </div>
              <h3 className="roadmap-step-title">Discover</h3>
              <p className="roadmap-step-desc">
                Build your verified student profile and discover matched academic pathways, curriculum boards, and global institutions.
              </p>
            </div>

            {/* Step 02: Understand */}
            <div className="roadmap-step-card step-card-2" id="step-understand" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div className="roadmap-card-shine" />
              <div className="roadmap-card-top">
                <span className="roadmap-step-num">02.</span>
                <div className="roadmap-icon-box">
                  <BookOpen size={20} />
                </div>
              </div>
              <h3 className="roadmap-step-title">Understand</h3>
              <p className="roadmap-step-desc">
                Analyze your strengths, academic inclinations, and career interests through structured diagnostic evaluations.
              </p>
            </div>

            {/* Step 03: Plan */}
            <div className="roadmap-step-card step-card-3" id="step-plan" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div className="roadmap-card-shine" />
              <div className="roadmap-card-top">
                <span className="roadmap-step-num">03.</span>
                <div className="roadmap-icon-box">
                  <Target size={20} />
                </div>
              </div>
              <h3 className="roadmap-step-title">Plan</h3>
              <p className="roadmap-step-desc">
                Create a personalised exam preparation roadmap with clear milestone schedules, target scores, and prerequisites.
              </p>
            </div>

            {/* Step 04: Move Forward */}
            <div className="roadmap-step-card step-card-4 is-highlighted" id="step-move-forward" onClick={() => handleExplore('dashboard')} style={{ cursor: 'pointer' }}>
              <div className="roadmap-card-shine" />
              <div className="roadmap-card-top">
                <span className="roadmap-step-num">04.</span>
                <div className="roadmap-icon-box">
                  <GraduationCap size={20} />
                </div>
              </div>
              <h3 className="roadmap-step-title">Move Forward</h3>
              <p className="roadmap-step-desc">
                Engage directly with expert educational counsellors to finalize admissions, verify documents, and secure your offer.
              </p>
            </div>
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
          9. CALL TO ACTION SECTION (Compact Banner with 3D Books & Neon Waves)
          ===================================================================== */}
      <section className="eunistud-cta-banner-section" id="get-started">
        <div className="landing-container">
          <div className="eunistud-cta-banner">
            {/* Left Content Column */}
            <div className="cta-content-column">
              {/* Top Eyebrow */}
              <div className="cta-eyebrow-badge">
                <GraduationCap size={15} className="cta-cyan-accent" />
                <span>YOUR FUTURE, WITH CLARITY</span>
              </div>

              {/* Main Headline */}
              <h2 className="cta-headline">
                Ready to understand<br />
                your <span className="cta-pill-highlight">next step?</span>
              </h2>

              {/* Description */}
              <p className="cta-description">
                Start your student journey with Global Consultancy. Complete your initial profile intake and receive structured, verified guidance from expert mentors.
              </p>

              {/* Action Buttons */}
              <div className="cta-actions-group">
                <button
                  onClick={handleGetStarted}
                  className="cta-btn-primary"
                  id="cta-get-started-btn"
                >
                  <span>Open Student Portal</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => handleExplore('counsellors')}
                  className="cta-btn-secondary"
                  id="cta-talk-to-us-btn"
                >
                  <Phone size={15} className="cta-cyan-accent" />
                  <span>Talk to an Advisor</span>
                </button>
              </div>

              {/* Trust Features Row */}
              <div className="cta-trust-row">
                <div className="cta-trust-item">
                  <CheckCircle2 size={16} strokeWidth={2.4} className="cta-cyan-accent" />
                  <span>Personalised guidance</span>
                </div>
                <div className="cta-trust-item">
                  <CheckCircle2 size={16} strokeWidth={2.4} className="cta-cyan-accent" />
                  <span>Verified mentors</span>
                </div>
                <div className="cta-trust-item">
                  <CheckCircle2 size={16} strokeWidth={2.4} className="cta-cyan-accent" />
                  <span>Clear next steps</span>
                </div>
              </div>
            </div>

            {/* Right Mockup Window Column */}
            <div className="cta-mockup-wrapper">
              <div className="cta-ambient-decor" aria-hidden="true">
                <svg className="cta-decor-curve" viewBox="0 0 150 100" fill="none">
                  <path
                    d="M 15 90 C 25 40, 70 18, 140 18"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                </svg>
                <div className="cta-glass-orb orb-small" />
                <div className="cta-glass-orb orb-large" />
              </div>

              <div className="cta-roadmap-window">
                <div className="cta-window-header">
                  <div className="cta-window-controls">
                    <span className="cta-window-dot" />
                    <span className="cta-window-dot" />
                    <span className="cta-window-dot" />
                  </div>
                  <span className="cta-window-title">Your guidance roadmap</span>
                </div>

                <div className="cta-window-body">
                  <div className="cta-roadmap-item is-completed">
                    <div className="cta-roadmap-check">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div className="cta-roadmap-info">
                      <span className="cta-roadmap-name">Profile intake</span>
                      <span className="cta-roadmap-desc">Goals, interests, background</span>
                    </div>
                    <span className="cta-roadmap-status">Done</span>
                  </div>

                  <div className="cta-roadmap-item is-completed">
                    <div className="cta-roadmap-check">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <div className="cta-roadmap-info">
                      <span className="cta-roadmap-name">Mentor match</span>
                      <span className="cta-roadmap-desc">Paired with a verified expert</span>
                    </div>
                    <span className="cta-roadmap-status">Done</span>
                  </div>

                  <div
                    className="cta-roadmap-item is-active"
                    onClick={handleGetStarted}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="cta-roadmap-step-badge">3</div>
                    <div className="cta-roadmap-info">
                      <span className="cta-roadmap-name">Your next step</span>
                      <span className="cta-roadmap-desc">A clear, personal action plan</span>
                    </div>
                    <ArrowRight size={18} className="cta-roadmap-arrow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
