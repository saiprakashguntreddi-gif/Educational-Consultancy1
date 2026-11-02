import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArrowLeft,
  Search,
  Award,
  Building,
  MapPin,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
  Filter,
  Eye,
  X,
  Maximize2,
} from 'lucide-react';
import { ScholarshipDto, ScholarshipListResponse } from '../scholarships.types';
import { ScholarshipsService } from '../services/scholarships.service';
import '../scholarships.css';

interface CountryScholarshipDetailPageProps {
  countryName: string;
  onBackToHubs: () => void;
  onSelectCountry: (countryName: string) => void;
  onOpenScholarshipDetail: (scholarship: ScholarshipDto) => void;
  onToggleSave: (scholarshipId: string) => void;
  savingId: string | null;
}

interface DestinationHeroMeta {
  code: string;
  flagUrl: string;
  bannerUrl: string;
  title: string;
  tagline: string;
  overview: string;
  coverageStat: string;
  stipendStat: string;
  categories: { key: string; label: string; countPredicate: (s: ScholarshipDto) => boolean }[];
}

const DESTINATION_META: Record<string, DestinationHeroMeta> = {
  India: {
    code: 'IND',
    flagUrl: 'https://flagcdn.com/w80/in.png',
    bannerUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
    title: 'India • Higher Education & Funding Directory',
    tagline: 'Andhra Pradesh State RTF/MTF Schemes, Central Sector Grants, PMRF & Premier Corporate Trusts',
    overview: 'Complete official repository of 13 verified domestic scholarships across the Government of Andhra Pradesh (Jagananna Vidya & Vasathi Deevena 100% Fee Reimbursement), Ministry of Education, PMRF, AICTE, and premier corporate endowments (Reliance Foundation, HDFC, Aditya Birla).',
    coverageStat: 'Up to 100% Full Fee Reimbursement (RTF)',
    stipendStat: 'Up to ₹70,000 / month (PMRF Fellowship)',
    categories: [
      { key: 'ALL', label: 'All Indian Schemes', countPredicate: () => true },
      {
        key: 'STATE',
        label: 'Andhra Pradesh State Schemes',
        countPredicate: (s) =>
          s.name.toLowerCase().includes('jagananna') ||
          s.name.toLowerCase().includes('andhra') ||
          s.provider.toLowerCase().includes('andhra'),
      },
      {
        key: 'CENTRAL',
        label: 'Central Govt & Fellowships',
        countPredicate: (s) =>
          s.name.toLowerCase().includes('pmrf') ||
          s.name.toLowerCase().includes('central') ||
          s.name.toLowerCase().includes('aicte') ||
          s.name.toLowerCase().includes('inspire'),
      },
      {
        key: 'CORP',
        label: 'Corporate & Merit Trusts',
        countPredicate: (s) =>
          s.name.toLowerCase().includes('reliance') ||
          s.name.toLowerCase().includes('hdfc') ||
          s.name.toLowerCase().includes('birla') ||
          s.name.toLowerCase().includes('asha') ||
          s.name.toLowerCase().includes('lovely') ||
          s.name.toLowerCase().includes('tata'),
      },
    ],
  },
  'United States': {
    code: 'USA',
    flagUrl: 'https://flagcdn.com/w80/us.png',
    bannerUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85',
    title: 'United States • Fellowships & Institutional Aid',
    tagline: 'Need-Blind Financial Aid, Fulbright-Nehru, Stanford Knight-Hennessy & MIT Fellowships',
    overview: 'Curated prestigious international funding programs for Indian and global scholars pursuing Master’s and Doctoral studies in the United States, including full tuition waivers, living stipends, and leadership cohorts.',
    coverageStat: '$50,000 – $80,000 / yr Full Funding',
    stipendStat: 'Full Living Stipend & Health Insurance',
    categories: [
      { key: 'ALL', label: 'All US Opportunities', countPredicate: () => true },
      { key: 'NATIONAL', label: 'Bilateral & Foundation', countPredicate: (s) => s.name.toLowerCase().includes('fulbright') || s.name.toLowerCase().includes('inlaks') },
      { key: 'INSTITUTIONAL', label: 'University Fellowships', countPredicate: (s) => s.name.toLowerCase().includes('stanford') || s.name.toLowerCase().includes('mit') },
    ],
  },
  'United Kingdom': {
    code: 'GBR',
    flagUrl: 'https://flagcdn.com/w80/gb.png',
    bannerUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85',
    title: 'United Kingdom • Leadership Grants & University Awards',
    tagline: 'Chevening, Commonwealth Master’s, Rhodes Oxford, British Council IELTS & GREAT Scholarships',
    overview: 'The definitive guide to UK government and university endowments offering full tuition coverage, economy return airfare, and monthly living allowances for high-achieving Indian scholars.',
    coverageStat: '£15,000 – Full Tuition Coverage',
    stipendStat: 'Return Airfare & Monthly Living Allowance',
    categories: [
      { key: 'ALL', label: 'All UK Opportunities', countPredicate: () => true },
      { key: 'GOV', label: 'Government & Bilateral', countPredicate: (s) => s.name.toLowerCase().includes('chevening') || s.name.toLowerCase().includes('commonwealth') || s.name.toLowerCase().includes('great') },
      { key: 'ENDOWMENT', label: 'Trusts & Council', countPredicate: (s) => s.name.toLowerCase().includes('rhodes') || s.name.toLowerCase().includes('british council') },
    ],
  },
  Australia: {
    code: 'AUS',
    flagUrl: 'https://flagcdn.com/w80/au.png',
    bannerUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=85',
    title: 'Australia • DFAT & Group of Eight Research Grants',
    tagline: 'Australia Awards (DFAT), Melbourne Research Scholarships & Sydney International Awards',
    overview: 'Verified funding schemes supporting undergraduate, postgraduate, and doctoral studies across Group of Eight Australian universities with tuition fee offsets and Overseas Student Health Cover (OSHC).',
    coverageStat: 'AUD $35,000 – $110,000 Total Value',
    stipendStat: 'Living Allowance & OSHC Health Cover',
    categories: [
      { key: 'ALL', label: 'All Australian Schemes', countPredicate: () => true },
      { key: 'GOV', label: 'DFAT Bilateral', countPredicate: (s) => s.name.toLowerCase().includes('australia awards') },
      { key: 'GO8', label: 'Group of Eight Research', countPredicate: (s) => s.name.toLowerCase().includes('melbourne') || s.name.toLowerCase().includes('sydney') },
    ],
  },
  Germany: {
    code: 'DEU',
    flagUrl: 'https://flagcdn.com/w80/de.png',
    bannerUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=85',
    title: 'Germany • DAAD Public University Stipends',
    tagline: 'DAAD EPOS Postgraduate, DAAD Master Studies & Heinrich Böll Foundation Grants',
    overview: 'Low-to-zero tuition public higher education in Germany paired with generous DAAD living stipends, travel subsidies, and comprehensive health insurance for international students.',
    coverageStat: 'Tuition-Free + €934 – €1,200/mo',
    stipendStat: 'Travel Subsidy & Health Insurance Included',
    categories: [
      { key: 'ALL', label: 'All German Opportunities', countPredicate: () => true },
      { key: 'DAAD', label: 'DAAD Federal Ministry', countPredicate: (s) => s.name.toLowerCase().includes('daad') },
      { key: 'CIVIL', label: 'Civil Society Trusts', countPredicate: (s) => s.name.toLowerCase().includes('boell') || s.name.toLowerCase().includes('böll') },
    ],
  },
  Canada: {
    code: 'CAN',
    flagUrl: 'https://flagcdn.com/w80/ca.png',
    bannerUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=85',
    title: 'Canada • Vanier Honours & University Scholarships',
    tagline: 'Vanier Canada CGS, Ontario Trillium (OTS) & University of Toronto International Scholar',
    overview: 'Canada’s premier federal and provincial doctoral awards alongside top research university entrance scholarships providing up to CAD $50,000 per year.',
    coverageStat: 'CAD $20,000 – $50,000 / year',
    stipendStat: 'Full Research & Academic Stipends',
    categories: [
      { key: 'ALL', label: 'All Canadian Awards', countPredicate: () => true },
      { key: 'FEDERAL', label: 'Vanier & Provincial OTS', countPredicate: (s) => s.name.toLowerCase().includes('vanier') || s.name.toLowerCase().includes('trillium') },
      { key: 'U15', label: 'U15 University Honors', countPredicate: (s) => s.name.toLowerCase().includes('toronto') },
    ],
  },
};

const ALL_DESTINATIONS = ['India', 'United States', 'United Kingdom', 'Australia', 'Germany', 'Canada'];

export const CountryScholarshipDetailPage: React.FC<CountryScholarshipDetailPageProps> = ({
  countryName,
  onBackToHubs,
  onSelectCountry,
  onOpenScholarshipDetail,
  onToggleSave,
  savingId,
}) => {
  const [scholarships, setScholarships] = useState<ScholarshipDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters within country page
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [studyLevelFilter, setStudyLevelFilter] = useState<string>('');
  const [eligibilityFilter, setEligibilityFilter] = useState<string>('ALL');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  const meta = DESTINATION_META[countryName] || DESTINATION_META['India'];

  const loadCountryScholarships = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ScholarshipsService.listScholarships({
        country: countryName,
        limit: 50,
      });

      if (res.success && res.data) {
        setScholarships(res.data.scholarships || []);
      } else {
        setError('Could not load scholarships for ' + countryName);
      }
    } catch (err: any) {
      setError(err?.message || 'Error communicating with scholarship service.');
    } finally {
      setLoading(false);
    }
  }, [countryName]);

  useEffect(() => {
    loadCountryScholarships();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadCountryScholarships]);

  // Client-side filtering within this country
  const filteredScholarships = useMemo(() => {
    let list = [...scholarships];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          (s.department && s.department.toLowerCase().includes(q)) ||
          s.awardDetails.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'ALL' && meta.categories) {
      const cat = meta.categories.find((c) => c.key === selectedCategory);
      if (cat) {
        list = list.filter(cat.countPredicate);
      }
    }

    // Study level
    if (studyLevelFilter) {
      list = list.filter((s) => {
        if (!s.studyLevel || s.studyLevel.toUpperCase() === 'ALL') return true;
        return s.studyLevel.toUpperCase() === studyLevelFilter.toUpperCase();
      });
    }

    // Eligibility
    if (eligibilityFilter !== 'ALL') {
      if (eligibilityFilter === 'SAVED') {
        list = list.filter((s) => s.isSaved);
      } else {
        list = list.filter((s) => s.eligibilityStatus === eligibilityFilter);
      }
    }

    return list;
  }, [scholarships, searchTerm, selectedCategory, studyLevelFilter,
  Eye,
  X,
  Maximize2, eligibilityFilter,
  Eye,
  X,
  Maximize2, meta.categories]);

  // Helper: Format days remaining or deadline text
  const getDeadlineInfo = (deadlineStr?: string | null) => {
    if (!deadlineStr) return null;
    const deadlineDate = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = deadlineDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      formattedDate,
      diffDays,
      isUpcoming: diffDays > 0,
      isExpired: diffDays < 0,
      isUrgent: diffDays > 0 && diffDays <= 30,
    };
  };

  // Helper: Format currency and amount
  const formatAward = (amount?: number | null, currency?: string | null, type?: string | null) => {
    if (amount !== null && amount !== undefined) {
      const curr = currency || 'USD';
      if (curr === 'INR') {
        return `₹${amount.toLocaleString('en-IN')}`;
      } else if (curr === 'USD') {
        return `$${amount.toLocaleString('en-US')} USD`;
      } else if (curr === 'GBP') {
        return `£${amount.toLocaleString('en-GB')}`;
      } else if (curr === 'EUR') {
        return `€${amount.toLocaleString('en-EU')}`;
      }
      return `${curr} ${amount.toLocaleString()}`;
    }
    return type || 'Full / Partial Coverage';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* 1. TOP NAVIGATION & COUNTRY SWITCHER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <button
          onClick={onBackToHubs}
          id="btn-back-to-hubs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '0.55rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#1E293B',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#5B4FE9';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#5B4FE9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.color = '#1E293B';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
        >
          <ArrowLeft size={16} />
          <span>← Back to Global Funding Hubs</span>
        </button>

        {/* Quick Switch to Other Countries */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, marginRight: '0.2rem' }}>
            Switch Destination:
          </span>
          {ALL_DESTINATIONS.map((cName) => {
            const isCurrent = cName === countryName;
            const cMeta = DESTINATION_META[cName];
            return (
              <button
                key={cName}
                onClick={() => onSelectCountry(cName)}
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
                {cMeta && (
                  <img
                    src={cMeta.flagUrl}
                    alt=""
                    style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '2px', display: 'inline-block' }}
                  />
                )}
                <span>{cName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DEDICATED COMPLETE COUNTRY HERO & BENCHMARK BANNER */}
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
            height: '350px',
            minHeight: '340px',
            position: 'relative',
            backgroundImage: `url(${meta.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: meta.code === 'IND' ? 'center 22%' : 'center 32%',
            cursor: 'pointer',
          }}
          onClick={() => setIsPhotoModalOpen(true)}
          title="Click to view full uncropped landmark photograph"
        >
          {/* Gradient scrim: light in middle so full landmark is vividly clear, darker at bottom for text contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15,23,42,0.42) 0%, rgba(15,23,42,0.06) 30%, rgba(15,23,42,0.3) 65%, rgba(15,23,42,0.92) 100%)',
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
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0F172A',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <img
                src={meta.flagUrl}
                alt={`${countryName} flag`}
                style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px' }}
              />
              <span>{meta.code} • {countryName}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhotoModalOpen(true);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  color: '#FFFFFF',
                  padding: '0.32rem 0.8rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(91, 79, 233, 0.9)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)')}
                title="View full uncropped landmark photograph"
              >
                <Eye size={13} />
                <span>View Full Photo</span>
              </button>
              <div
                style={{
                  background: '#5B4FE9',
                  color: '#FFFFFF',
                  padding: '0.32rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {scholarships.length} Verified Funding Opportunities
              </div>
            </div>
          </div>

          {/* Title and Tagline inside banner */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.4rem',
              left: '1.75rem',
              right: '1.75rem',
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: '1.95rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: '0 0 0.4rem 0',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              }}
            >
              {meta.title}
            </h1>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#F1F5F9',
                margin: 0,
                fontWeight: 500,
                maxWidth: '900px',
                lineHeight: 1.5,
                textShadow: '0 1px 6px rgba(0,0,0,0.85)',
              }}
            >
              {meta.tagline}
            </p>
          </div>
        </div>

        {/* Detailed Country Funding Benchmark Metrics Strip */}
        <div
          style={{
            padding: '1.35rem 1.75rem',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#EEF2FF',
                color: '#5B4FE9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                Tuition Fee Relief
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                {meta.coverageStat}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                Living & Research Fellowship
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                {meta.stipendStat}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#F0F9FF',
                color: '#0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                Official Verification Status
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                100% Verified Provider Intake
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
          <p style={{ margin: 0, fontSize: '0.83rem', color: '#475569', lineHeight: 1.55 }}>
            {meta.overview}
          </p>
        </div>
      </div>

      {/* 3. DEDICATED IN-COUNTRY CATEGORY TABS & SEARCH */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
        }}
      >
        {/* Category Tabs */}
        {meta.categories && meta.categories.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.4rem',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            {meta.categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              const count = scholarships.filter(cat.countPredicate).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: isSelected ? '1px solid #5B4FE9' : '1px solid #E2E8F0',
                    background: isSelected ? '#5B4FE9' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{cat.label}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.05rem 0.4rem',
                      borderRadius: '999px',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Search & Filter Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder={`Search ${countryName} scholarships by name, provider, or scheme...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.65rem 1rem 0.65rem 2.45rem',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                background: '#F8FAFC',
                fontSize: '0.88rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {/* Study level dropdown */}
          <select
            value={studyLevelFilter}
            onChange={(e) => setStudyLevelFilter(e.target.value)}
            style={{
              padding: '0.65rem 0.95rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">All Study Levels</option>
            <option value="UNDERGRADUATE">Undergraduate</option>
            <option value="POSTGRADUATE">Postgraduate</option>
          </select>

          {/* Eligibility tab dropdown / filter */}
          <select
            value={eligibilityFilter}
            onChange={(e) => setEligibilityFilter(e.target.value)}
            style={{
              padding: '0.65rem 0.95rem',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">All Eligibility Statuses</option>
            <option value="ELIGIBLE">Verified Eligible Only</option>
            <option value="POTENTIALLY_ELIGIBLE">Needs Review Only</option>
            <option value="SAVED">Saved / Shortlisted Only</option>
          </select>

          {(searchTerm || selectedCategory !== 'ALL' || studyLevelFilter || eligibilityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setStudyLevelFilter('');
                setEligibilityFilter('ALL');
              }}
              style={{
                padding: '0.65rem 0.95rem',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#64748B',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. SCHOLARSHIP CARDS LIST */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.88rem', color: '#64748B' }}>
            Showing <b>{filteredScholarships.length}</b> verified funding schemes for <b>{countryName}</b>
          </span>
        </div>

        {loading ? (
          <div className="sch-loading-card">
            <RefreshCw size={36} className="sch-spinner" />
            <h3 className="sch-loading-title">Loading {countryName} verified scholarships directory...</h3>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <div className="sch-empty-card">
            <Award size={32} />
            <h3 className="sch-empty-title">No scholarships match your filter criteria for {countryName}.</h3>
            <p className="sch-empty-text">Try resetting filters or searching for alternative schemes.</p>
          </div>
        ) : (
          <div className="sch-grid" id="country-sch-cards-grid">
            {filteredScholarships.map((scholarship) => {
              const eligibility = scholarship.eligibility;
              const deadlineInfo = getDeadlineInfo(scholarship.applicationDeadline);

              return (
                <div key={scholarship.id} className="sch-card" id={`sch-card-${scholarship.id}`}>
                  <div>
                    {/* Top Badges & Bookmark */}
                    <div className="sch-card-top">
                      <div className="sch-badges-cluster">
                        {eligibility && (
                          <span
                            className={`sch-status-badge ${
                              eligibility.status === 'ELIGIBLE'
                                ? 'eligible'
                                : eligibility.status === 'POTENTIALLY_ELIGIBLE'
                                ? 'review'
                                : 'not-eligible'
                            }`}
                          >
                            {eligibility.status === 'ELIGIBLE' ? (
                              <CheckCircle2 size={13} />
                            ) : eligibility.status === 'POTENTIALLY_ELIGIBLE' ? (
                              <AlertTriangle size={13} />
                            ) : (
                              <XCircle size={13} />
                            )}
                            <span>
                              {eligibility.status === 'ELIGIBLE'
                                ? 'Eligible'
                                : eligibility.status === 'POTENTIALLY_ELIGIBLE'
                                ? 'Needs Review'
                                : 'Not Eligible'}
                            </span>
                          </span>
                        )}

                        <span className="sch-tag destination" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <img
                            src={meta.flagUrl}
                            alt=""
                            style={{ width: '15px', height: '10px', objectFit: 'cover', borderRadius: '2px', display: 'inline-block' }}
                          />
                          <span>{scholarship.destinationCountry || countryName}</span>
                        </span>

                        {scholarship.studyLevel && (
                          <span className="sch-tag">
                            <span>{scholarship.studyLevel}</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onToggleSave(scholarship.id)}
                        disabled={savingId === scholarship.id}
                        className={`sch-btn-save ${scholarship.isSaved ? 'saved' : ''}`}
                        title={scholarship.isSaved ? 'Remove from Saved' : 'Save / Shortlist Scholarship'}
                      >
                        <Bookmark size={17} className={scholarship.isSaved ? 'fill-amber-500' : ''} />
                      </button>
                    </div>

                    {/* Title & Metadata */}
                    <div className="sch-card-body">
                      <h3
                        className="sch-card-title"
                        onClick={() => onOpenScholarshipDetail(scholarship)}
                      >
                        {scholarship.name}
                      </h3>

                      <div className="sch-card-meta">
                        <span className="sch-card-meta-item" title="Official Provider">
                          <Building size={13} />
                          <b>{scholarship.provider}</b>
                        </span>

                        <span className="sch-card-meta-item">
                          <MapPin size={13} />
                          <span>{scholarship.country}</span>
                        </span>

                        {scholarship.department && (
                          <span className="sch-card-meta-item" style={{ color: '#5B4FE9' }}>
                            <BookOpen size={13} />
                            <span>{scholarship.department}</span>
                          </span>
                        )}
                      </div>

                      {/* Award Highlight Box */}
                      <div className="sch-award-box">
                        <div className="sch-award-left">
                          <div className="sch-award-icon">
                            <Award size={18} />
                          </div>
                          <div>
                            <div className="sch-award-amount">
                              {formatAward(scholarship.awardAmount, scholarship.awardCurrency, scholarship.awardType)}
                            </div>
                            <div className="sch-award-type">
                              {scholarship.awardType || scholarship.awardDetails}
                            </div>
                          </div>
                        </div>

                        {deadlineInfo && (
                          <div className="sch-award-deadline">
                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                              <Calendar size={11} style={{ display: 'inline', marginRight: 3 }} />
                              Deadline:
                            </span>
                            <span className="sch-award-deadline-date">{deadlineInfo.formattedDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Eligibility Insight Explanation Callout */}
                      {eligibility && (
                        <div
                          className={`sch-insight-box ${
                            eligibility.status === 'ELIGIBLE'
                              ? 'eligible'
                              : eligibility.status === 'POTENTIALLY_ELIGIBLE'
                              ? 'review'
                              : 'not-eligible'
                          }`}
                        >
                          {eligibility.status === 'ELIGIBLE' ? (
                            <CheckCircle2 size={15} className="sch-insight-icon" />
                          ) : eligibility.status === 'POTENTIALLY_ELIGIBLE' ? (
                            <AlertTriangle size={15} className="sch-insight-icon" />
                          ) : (
                            <XCircle size={15} className="sch-insight-icon" />
                          )}
                          <div>
                            <b>Eligibility Insight: </b>
                            <span>{eligibility.summary}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="sch-card-footer">
                    <button
                      onClick={() => onOpenScholarshipDetail(scholarship)}
                      className="sch-btn-details"
                    >
                      <span>View Details & Evidence</span>
                      <ChevronRight size={14} />
                    </button>

                    {scholarship.applicationUrl && (
                      <a
                        href={scholarship.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sch-btn-portal"
                      >
                        <span>Official Portal</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* FULL LANDMARK PHOTO LIGHTBOX MODAL */}
      {isPhotoModalOpen && (
        <div
          onClick={() => setIsPhotoModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '1100px',
              width: '100%',
              background: '#0F172A',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30, 41, 59, 0.85)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src={meta.flagUrl}
                  alt=""
                  style={{ width: '22px', height: '15px', objectFit: 'cover', borderRadius: '3px' }}
                />
                <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1rem' }}>
                  {meta.title}
                </span>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Complete Uncropped Image Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#020617',
                maxHeight: '72vh',
                overflow: 'hidden',
              }}
            >
              <img
                src={meta.bannerUrl}
                alt={`${countryName} Landmark`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '72vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Modal Caption */}
            <div
              style={{
                padding: '0.9rem 1.5rem',
                background: 'rgba(30, 41, 59, 0.95)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <span style={{ color: '#E2E8F0', fontSize: '0.84rem', fontWeight: 500 }}>
                {meta.tagline}
              </span>
              <a
                href={meta.bannerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#818CF8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>Open Original Ultra-HD Landmark Photo</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

