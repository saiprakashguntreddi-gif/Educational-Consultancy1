import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Coins,
  Home,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import {
  CountrySummary,
  InstitutionSummary,
} from '../colleges.types';
import { CollegesService } from '../services/colleges.service';
import { InstitutionCard } from './InstitutionCard';

interface CountryDetailPageProps {
  country: CountrySummary;
  allCountries: CountrySummary[];
  onSelectCountry: (countryName: string) => void;
  onBackToAllCountries: () => void;
  onViewInstitutionDetails: (institution: InstitutionSummary) => void;
  onToggleSave: (institution: InstitutionSummary) => void;
  onToggleCompare: (institution: InstitutionSummary) => void;
  savedInstitutionIds: Set<string>;
  comparedInstitutionIds: Set<string>;
}

export const CountryDetailPage: React.FC<CountryDetailPageProps> = ({
  country,
  allCountries,
  onSelectCountry,
  onBackToAllCountries,
  onViewInstitutionDetails,
  onToggleSave,
  onToggleCompare,
  savedInstitutionIds,
  comparedInstitutionIds,
}) => {
  // Institutions for this country
  const [institutions, setInstitutions] = useState<InstitutionSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters within this country
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'fee_asc' | 'fee_desc'>('name_asc');
  const [isVisaExpanded, setIsVisaExpanded] = useState<boolean>(true);

  // Fetch all institutions for this country (using limit: 100 to get the complete list)
  const fetchCountryColleges = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await CollegesService.listColleges({
        country: country.name,
        limit: 100,
        page: 1,
      });

      if (res.success && res.data) {
        setInstitutions(res.data.data || []);
      }
    } catch (_err) {
      // Non-blocking
    } finally {
      setIsLoading(false);
    }
  }, [country.name]);

  useEffect(() => {
    fetchCountryColleges();
    // Scroll to top when changing country
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchCountryColleges]);

  // Compute tier counts dynamically
  const tierCounts = useMemo(() => {
    const counts = { ALL: institutions.length, TOP: 0, MID: 0, LOW: 0, COLLEGE: 0 };
    institutions.forEach((inst) => {
      const tier = inst.counsellingTier || (inst.managedTier === 'ASPIRATIONAL' ? 'TOP' : inst.managedTier === 'SAFE' ? 'LOW' : 'MID');
      if (tier === 'TOP') counts.TOP++;
      else if (tier === 'MID') counts.MID++;
      else if (tier === 'LOW') counts.LOW++;
      else if (tier === 'COLLEGE') counts.COLLEGE++;
    });
    return counts;
  }, [institutions]);

  // Client-side instant filtering across the loaded institutions
  const filteredInstitutions = useMemo(() => {
    let list = [...institutions];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (inst) =>
          inst.name.toLowerCase().includes(q) ||
          inst.city.toLowerCase().includes(q) ||
          (inst.overview && inst.overview.toLowerCase().includes(q)) ||
          (inst.academicProfileSummary && inst.academicProfileSummary.toLowerCase().includes(q))
      );
    }

    // Tier filter
    if (selectedTier !== 'ALL') {
      list = list.filter((inst) => {
        const tier = inst.counsellingTier || (inst.managedTier === 'ASPIRATIONAL' ? 'TOP' : inst.managedTier === 'SAFE' ? 'LOW' : 'MID');
        return tier === selectedTier;
      });
    }

    // Exam filter
    if (selectedExam !== 'ALL') {
      list = list.filter((inst) => {
        if (inst.examRules && inst.examRules.length > 0) {
          return inst.examRules.some(
            (r) =>
              r.examCode.toUpperCase() === selectedExam.toUpperCase() &&
              ['REQUIRED', 'ACCEPTED', 'ALTERNATIVE'].includes(r.ruleStatus)
          );
        }
        return inst.entranceExams && inst.entranceExams.includes(selectedExam);
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'fee_asc') return (a.minAnnualFee || 0) - (b.minAnnualFee || 0);
      if (sortBy === 'fee_desc') return (b.maxAnnualFee || 0) - (a.maxAnnualFee || 0);
      return 0;
    });

    return list;
  }, [institutions, searchQuery, selectedTier, selectedExam, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTier('ALL');
    setSelectedExam('ALL');
    setSortBy('name_asc');
  };

  return (
    <div
      id={`country-hub-${country.code.toLowerCase()}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* 1. TOP NAVIGATION & COUNTRY JUMP BAR */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Back to All Destinations Button */}
        <button
          onClick={onBackToAllCountries}
          id="back-to-destinations-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '0.5rem 0.95rem',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: '#1E293B',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#5B4FE9';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#5B4FE9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = '#1E293B';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
        >
          <ArrowLeft size={16} />
          <span>← Back to All Destinations</span>
        </button>

        {/* Quick Switch to Other Countries */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginRight: '0.2rem' }}>
            Switch Destination:
          </span>
          {allCountries.map((c) => {
            const isCurrent = c.code === country.code;
            return (
              <button
                key={c.code}
                onClick={() => onSelectCountry(c.name)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 800 : 600,
                  border: isCurrent ? '1px solid #5B4FE9' : '1px solid #E2E8F0',
                  background: isCurrent ? '#5B4FE9' : '#FFFFFF',
                  color: isCurrent ? '#FFFFFF' : '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COMPLETE COUNTRY HERO & BENCHMARK GUIDE */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Banner with high-res photo */}
        <div
          style={{
            height: '240px',
            position: 'relative',
            backgroundImage: `url(${country.bannerImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%)',
            }}
          />

          {/* Top badges */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.8rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F172A',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{country.flag}</span>
              <span>2026 Admissions Guide • {country.name}</span>
            </div>

            <div
              style={{
                background: '#5B4FE9',
                color: '#FFFFFF',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(91,79,233,0.4)',
              }}
            >
              {institutions.length || country.institutionsCount} Institutions in Guide
            </div>
          </div>

          {/* Country Title & Tagline in Hero */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              color: '#FFFFFF',
            }}
          >
            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                margin: '0 0 0.35rem',
                textShadow: '0 2px 6px rgba(0,0,0,0.5)',
              }}
            >
              Study in {country.name}
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: 0,
                maxWidth: '800px',
                lineHeight: 1.5,
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              }}
            >
              {country.tagline}. Verified tuition parameters, post-study work regulations, and direct institutional entry standards.
            </p>
          </div>
        </div>

        {/* 4 Financial & Work Rights Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            padding: '1.5rem',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          {/* Panel 1: Tuition */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '1.15rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284C7', fontSize: '0.82rem', fontWeight: 700 }}>
              <Coins size={16} />
              <span>Indicative Tuition Structure</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {country.avgTuitionRange}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Varies by discipline, institution tier, and programme length.
            </div>
          </div>

          {/* Panel 2: Living Costs */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '1.15rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.82rem', fontWeight: 700 }}>
              <Home size={16} />
              <span>Living Cost Estimate</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {country.livingCostRange}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Official immigration maintenance & living benchmark.
            </div>
          </div>

          {/* Panel 3: Post Study Work */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '1.15rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', fontSize: '0.82rem', fontWeight: 700 }}>
              <Briefcase size={16} />
              <span>Post-Study Work Visa</span>
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
              {country.postStudyWorkVisa}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Graduation work permission & regional incentives where eligible.
            </div>
          </div>

          {/* Panel 4: Currency & Verification */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '1.15rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6366F1', fontSize: '0.82rem', fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>Official Verification</span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              {country.currency} ({country.currencySymbol}) • Verified 2026
            </div>
            {country.sourceUrl && (
              <a
                href={country.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: '#4338CA',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                <span>Government Portal Reference</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Collapsible Visa Policy Note */}
        {country.visaNotes && (
          <div style={{ padding: '1.25rem 1.5rem', background: '#FFFFFF' }}>
            <div
              onClick={() => setIsVisaExpanded(!isVisaExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B', fontWeight: 700, fontSize: '0.9rem' }}>
                <ShieldCheck size={16} color="#5B4FE9" />
                <span>Student Visa & Proof of Financial Capacity Policy for {country.name}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: 600 }}>
                {isVisaExpanded ? 'Collapse ▲' : 'Expand Details ▼'}
              </span>
            </div>

            {isVisaExpanded && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '1rem',
                  background: '#EEF2FF',
                  borderRadius: '10px',
                  border: '1px solid #E0E7FF',
                  fontSize: '0.85rem',
                  color: '#334155',
                  lineHeight: 1.55,
                }}
              >
                <p style={{ margin: '0 0 0.5rem' }}>{country.visaNotes}</p>
                {country.postStudyWorkSourceUrl && (
                  <a
                    href={country.postStudyWorkSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#4338CA',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Read official immigration guidelines</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. COUNTRY INSTITUTIONS CATALOGUE SECTION */}
      <div>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              All Colleges & Universities in {country.name} ({filteredInstitutions.length} shown)
            </h2>
            <p style={{ margin: '0.2rem 0 0', color: '#64748B', fontSize: '0.86rem' }}>
              Showing all verified institutions from the 2026 Admissions Guide.
            </p>
          </div>

          {(searchQuery || selectedTier !== 'ALL' || selectedExam !== 'ALL') && (
            <button
              onClick={resetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Tier Tabs (All, Top, Mid, Low/Safe, College) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={() => setSelectedTier('ALL')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1rem',
              borderRadius: '999px',
              fontSize: '0.84rem',
              fontWeight: selectedTier === 'ALL' ? 800 : 600,
              background: selectedTier === 'ALL' ? '#0F172A' : '#FFFFFF',
              color: selectedTier === 'ALL' ? '#FFFFFF' : '#475569',
              border: selectedTier === 'ALL' ? '1px solid #0F172A' : '1px solid #E2E8F0',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <span>All Institutions</span>
            <span
              style={{
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                fontSize: '0.74rem',
                background: selectedTier === 'ALL' ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                color: selectedTier === 'ALL' ? '#FFFFFF' : '#64748B',
              }}
            >
              {tierCounts.ALL}
            </span>
          </button>

          {tierCounts.TOP > 0 && (
            <button
              onClick={() => setSelectedTier('TOP')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: selectedTier === 'TOP' ? 800 : 600,
                background: selectedTier === 'TOP' ? '#7C2D12' : '#FFFFFF',
                color: selectedTier === 'TOP' ? '#FFFFFF' : '#7C2D12',
                border: selectedTier === 'TOP' ? '1px solid #7C2D12' : '1px solid #FDE68A',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🌟 Top Reach {country.name === 'Australia' ? '(Group of Eight)' : country.name === 'Germany' ? '(TU9 / Research)' : country.name === 'United Kingdom' ? '(Russell Group)' : country.name === 'Canada' ? '(U15 Research)' : '(Ivy & R1)'}</span>
              <span
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  background: selectedTier === 'TOP' ? 'rgba(255,255,255,0.2)' : '#FEF3C7',
                  color: selectedTier === 'TOP' ? '#FFFFFF' : '#7C2D12',
                }}
              >
                {tierCounts.TOP}
              </span>
            </button>
          )}

          {tierCounts.MID > 0 && (
            <button
              onClick={() => setSelectedTier('MID')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: selectedTier === 'MID' ? 800 : 600,
                background: selectedTier === 'MID' ? '#1E40AF' : '#FFFFFF',
                color: selectedTier === 'MID' ? '#FFFFFF' : '#1E40AF',
                border: selectedTier === 'MID' ? '1px solid #1E40AF' : '1px solid #BFDBFE',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🎯 Target / Mid-Tier</span>
              <span
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  background: selectedTier === 'MID' ? 'rgba(255,255,255,0.2)' : '#DBEAFE',
                  color: selectedTier === 'MID' ? '#FFFFFF' : '#1E40AF',
                }}
              >
                {tierCounts.MID}
              </span>
            </button>
          )}

          {tierCounts.LOW > 0 && (
            <button
              onClick={() => setSelectedTier('LOW')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: selectedTier === 'LOW' ? 800 : 600,
                background: selectedTier === 'LOW' ? '#065F46' : '#FFFFFF',
                color: selectedTier === 'LOW' ? '#FFFFFF' : '#065F46',
                border: selectedTier === 'LOW' ? '1px solid #065F46' : '1px solid #A7F3D0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🛡️ Safer / Value</span>
              <span
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  background: selectedTier === 'LOW' ? 'rgba(255,255,255,0.2)' : '#D1FAE5',
                  color: selectedTier === 'LOW' ? '#FFFFFF' : '#065F46',
                }}
              >
                {tierCounts.LOW}
              </span>
            </button>
          )}

          {tierCounts.COLLEGE > 0 && (
            <button
              onClick={() => setSelectedTier('COLLEGE')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                fontSize: '0.84rem',
                fontWeight: selectedTier === 'COLLEGE' ? 800 : 600,
                background: selectedTier === 'COLLEGE' ? '#312E81' : '#FFFFFF',
                color: selectedTier === 'COLLEGE' ? '#FFFFFF' : '#312E81',
                border: selectedTier === 'COLLEGE' ? '1px solid #312E81' : '1px solid #C7D2FE',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🏫 Colleges & Polytechnics</span>
              <span
                style={{
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  background: selectedTier === 'COLLEGE' ? 'rgba(255,255,255,0.2)' : '#E0E7FF',
                  color: selectedTier === 'COLLEGE' ? '#FFFFFF' : '#312E81',
                }}
              >
                {tierCounts.COLLEGE}
              </span>
            </button>
          )}
        </div>

        {/* Filter Toolbar: Search Bar + Exam filter + Sort dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem',
            background: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Instant Search Bar */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              minWidth: '260px',
            }}
          >
            <Search
              size={16}
              color="#94A3B8"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder={`Search universities or cities in ${country.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                color: '#0F172A',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Accepted Entrance Exam Filter */}
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                fontSize: '0.84rem',
                color: '#0F172A',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Entrance Exams</option>
              <option value="IELTS">IELTS Accepted</option>
              <option value="TOEFL">TOEFL Accepted</option>
              <option value="PTE">PTE Accepted</option>
              <option value="GRE">GRE Accepted</option>
              <option value="GMAT">GMAT Accepted</option>
              <option value="GATE">GATE Recognized</option>
            </select>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.82rem' }}>
              <ArrowUpDown size={14} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  fontSize: '0.84rem',
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="fee_asc">Tuition: Low to High</option>
                <option value="fee_desc">Tuition: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. INSTITUTIONS GRID (ALL COLLEGES UNDER THIS COUNTRY) */}
        {isLoading ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              color: '#64748B',
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Loading colleges in {country.name}...
            </div>
            <div style={{ fontSize: '0.84rem' }}>
              Retrieving verified institutional benchmarks and fee parameters.
            </div>
          </div>
        ) : filteredInstitutions.length === 0 ? (
          <div
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem' }}>
              No institutions matched your current filters
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 1rem' }}>
              Try adjusting your search query, tier selection, or entrance exam filters.
            </p>
            <button
              onClick={resetFilters}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                background: '#5B4FE9',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredInstitutions.map((institution) => (
              <InstitutionCard
                key={institution.id}
                institution={institution}
                onViewDetails={onViewInstitutionDetails}
                onToggleSave={onToggleSave}
                onToggleCompare={onToggleCompare}
                isSaved={savedInstitutionIds.has(institution.id)}
                isCompared={comparedInstitutionIds.has(institution.id)}
                showTierBadge={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
