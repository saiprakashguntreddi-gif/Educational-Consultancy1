import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Layers,
  Search,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Building,
  CheckCircle,
} from 'lucide-react';
import {
  RecommendationBatchDto,
  RecommendationItemDto,
  RecommendationTier,
} from '../recommendations.types';
import { RecommendationsService } from '../services/recommendations.service';
import { RecommendationCard } from './RecommendationCard';
import { EvidenceModal } from './EvidenceModal';
import { CohortScatterPlotModal } from './CohortScatterPlotModal';

import {
  InstitutionSummary,
  InstitutionDetail,
  CountrySummary,
} from '../../colleges/colleges.types';
import { CollegesService } from '../../colleges/services/colleges.service';
import { InstitutionCard } from '../../colleges/components/InstitutionCard';
import { InstitutionDetailModal } from '../../colleges/components/InstitutionDetailModal';

interface ThreeTierFitViewProps {
  onNavigateSection?: (section: string) => void;
}

export const ThreeTierFitView: React.FC<ThreeTierFitViewProps> = ({
  onNavigateSection,
}) => {
  // Top-Level View Mode: 'framework' (Institutions by Tier) vs 'strategy' (My Personalized Strategy)
  const [activeMode, setActiveMode] = useState<'framework' | 'strategy'>('framework');

  // -------------------------------------------------------------
  // STATE 1: THREE-TIER INSTITUTION EXPLORER (The Tier Things)
  // -------------------------------------------------------------
  const [institutions, setInstitutions] = useState<InstitutionSummary[]>([]);
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [isInstitutionsLoading, setIsInstitutionsLoading] = useState<boolean>(true);

  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'fee_asc' | 'fee_desc'>('name_asc');

  // Modals & Shortlist / Comparison State
  const [selectedDetailInst, setSelectedDetailInst] = useState<InstitutionDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [savedInstIds, setSavedInstIds] = useState<Set<string>>(new Set());
  const [comparedInstIds, setComparedInstIds] = useState<Set<string>>(new Set());

  // -------------------------------------------------------------
  // STATE 2: PERSONALIZED STRATEGY RECOMMENDATIONS
  // -------------------------------------------------------------
  const [batch, setBatch] = useState<RecommendationBatchDto | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [verificationStatus, setVerificationStatus] = useState<string>('VERIFIED');
  const [verificationNotice, setVerificationNotice] = useState<string>('');
  const [isStrategyLoading, setIsStrategyLoading] = useState<boolean>(true);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [strategyTab, setStrategyTab] = useState<'ALL' | RecommendationTier | 'ALTERNATIVES'>('ALL');
  const [selectedItemForEvidence, setSelectedItemForEvidence] = useState<RecommendationItemDto | null>(null);
  const [selectedItemForScatter, setSelectedItemForScatter] = useState<RecommendationItemDto | null>(null);
  const [shortlistLoadingId, setShortlistLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // -------------------------------------------------------------
  // DATA FETCHING: INSTITUTIONS BY TIER
  // -------------------------------------------------------------
  const fetchInstitutionsData = useCallback(async () => {
    setIsInstitutionsLoading(true);
    try {
      const [collegesRes, countriesRes, savedRes, compRes] = await Promise.all([
        CollegesService.listColleges({ limit: 100 }),
        CollegesService.getCountries(),
        CollegesService.getSaved(),
        CollegesService.getComparison(),
      ]);

      if (collegesRes.success && collegesRes.data) {
        setInstitutions(collegesRes.data.data || []);
      }
      if (countriesRes.success && countriesRes.data) {
        setCountries(countriesRes.data);
      }
      if (savedRes.success && savedRes.data) {
        setSavedInstIds(new Set((savedRes.data.savedInstitutions || []).map((i) => i.id)));
      }
      if (compRes.success && compRes.data) {
        setComparedInstIds(new Set((compRes.data.institutions || []).map((i) => i.id)));
      }
    } catch (_err) {
      // Non-blocking
    } finally {
      setIsInstitutionsLoading(false);
    }
  }, []);

  // -------------------------------------------------------------
  // DATA FETCHING: PERSONALIZED STRATEGY
  // -------------------------------------------------------------
  const loadStrategyData = async () => {
    setIsStrategyLoading(true);
    setFeedback(null);
    try {
      const res = await RecommendationsService.getMyRecommendations();
      if (res.success && res.data) {
        setIsVerified(res.data.isVerified);
        setVerificationStatus(res.data.verificationStatus);
        setVerificationNotice(res.data.message || '');
        setBatch(res.data.batch);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load recommendations' });
    } finally {
      setIsStrategyLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutionsData();
    loadStrategyData();
  }, [fetchInstitutionsData]);

  // -------------------------------------------------------------
  // HANDLERS FOR STRATEGY
  // -------------------------------------------------------------
  const handleRegenerateStrategy = async () => {
    setIsRegenerating(true);
    setFeedback(null);
    try {
      const res = await RecommendationsService.generateRecommendations();
      if (res.success && res.data) {
        setBatch(res.data);
        setFeedback({ type: 'success', message: 'Balanced recommendation strategy freshly generated!' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to regenerate recommendations' });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleStrategyShortlist = async (itemId: string) => {
    setShortlistLoadingId(itemId);
    try {
      const res = await RecommendationsService.toggleShortlist(itemId);
      if (res.success && res.data && batch) {
        const updateItems = (items: RecommendationItemDto[]) =>
          items.map((it) =>
            it.id === itemId ? { ...it, isShortlisted: res.data!.isShortlisted } : it
          );

        setBatch({
          ...batch,
          items: updateItems(batch.items),
          alternatives: updateItems(batch.alternatives),
          counts: {
            ...batch.counts,
            shortlisted: res.data.isShortlisted
              ? batch.counts.shortlisted + 1
              : Math.max(0, batch.counts.shortlisted - 1),
          },
        });

        if (selectedItemForEvidence && selectedItemForEvidence.id === itemId) {
          setSelectedItemForEvidence({
            ...selectedItemForEvidence,
            isShortlisted: res.data.isShortlisted,
          });
        }
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Could not update shortlist' });
    } finally {
      setShortlistLoadingId(null);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR INSTITUTIONS GRID
  // -------------------------------------------------------------
  const handleOpenDetailModal = async (inst: InstitutionSummary) => {
    try {
      const res = await CollegesService.getCollegeById(inst.id);
      if (res.success && res.data) {
        setSelectedDetailInst(res.data);
        setIsDetailModalOpen(true);
      }
    } catch (_err) {
      // Non-blocking
    }
  };

  const handleToggleSaveInstitution = async (inst: InstitutionSummary) => {
    const isSaved = savedInstIds.has(inst.id);
    try {
      if (isSaved) {
        await CollegesService.unsaveInstitution(inst.id);
        setSavedInstIds((prev) => {
          const next = new Set(prev);
          next.delete(inst.id);
          return next;
        });
      } else {
        await CollegesService.saveInstitution(inst.id);
        setSavedInstIds((prev) => new Set(prev).add(inst.id));
      }
    } catch (_err) {
      // Non-blocking
    }
  };

  const handleToggleCompareInstitution = async (inst: InstitutionSummary) => {
    const isCompared = comparedInstIds.has(inst.id);
    try {
      if (isCompared) {
        await CollegesService.removeFromComparison(inst.id);
        setComparedInstIds((prev) => {
          const next = new Set(prev);
          next.delete(inst.id);
          return next;
        });
      } else {
        await CollegesService.addToComparison(inst.id);
        setComparedInstIds((prev) => new Set(prev).add(inst.id));
      }
    } catch (_err) {
      // Non-blocking
    }
  };

  // Dynamic Tier Counts
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

  // Client-side Instant Filtered Institutions
  const filteredInstitutions = useMemo(() => {
    let list = [...institutions];

    // Filter by Country
    if (selectedCountry !== 'ALL') {
      list = list.filter(
        (i) => i.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    // Filter by Tier
    if (selectedTier !== 'ALL') {
      list = list.filter((i) => {
        const tier = i.counsellingTier || (i.managedTier === 'ASPIRATIONAL' ? 'TOP' : i.managedTier === 'SAFE' ? 'LOW' : 'MID');
        return tier === selectedTier;
      });
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q) ||
          i.country.toLowerCase().includes(q) ||
          (i.overview && i.overview.toLowerCase().includes(q)) ||
          (i.academicProfileSummary && i.academicProfileSummary.toLowerCase().includes(q))
      );
    }

    // Filter by Exam
    if (selectedExam !== 'ALL') {
      list = list.filter((i) => {
        if (i.examRules && i.examRules.length > 0) {
          return i.examRules.some(
            (r) =>
              r.examCode.toUpperCase() === selectedExam.toUpperCase() &&
              ['REQUIRED', 'ACCEPTED', 'ALTERNATIVE'].includes(r.ruleStatus)
          );
        }
        return i.entranceExams && i.entranceExams.includes(selectedExam);
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
  }, [institutions, selectedCountry, selectedTier, searchQuery, selectedExam, sortBy]);

  const visibleStrategyItems = () => {
    if (!batch) return [];
    if (strategyTab === 'ALTERNATIVES') return batch.alternatives;
    if (strategyTab === 'ALL') return batch.items;
    return batch.items.filter((i) => i.effectiveTier === strategyTab);
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* 1. HERO HEADER WITH VIEW SWITCHER */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '1.75rem 2rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#5B4FE9',
                background: '#EEF2FF',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                marginBottom: '0.45rem',
              }}
            >
              <Layers size={14} />
              <span>Three-Tier Admissions Fit Framework</span>
            </div>
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.03em',
                margin: '0 0 0.35rem 0',
              }}
            >
              Three-Tier Fit & Application Strategy
            </h1>
            <p
              style={{
                fontSize: '0.94rem',
                color: '#64748B',
                margin: 0,
                maxWidth: '740px',
                lineHeight: 1.5,
              }}
            >
              Strategic university classification (Top Reach, Target/Mid-Tier, Safer/Value, and Colleges & Polytechnics) aligned with verified 2026 admissions benchmarks and tuition parameters.
            </p>
          </div>

          {/* Primary View Switcher: Institutions by Tier vs My Personalized Strategy */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#F1F5F9',
              padding: '0.35rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
            }}
          >
            <button
              onClick={() => setActiveMode('framework')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '9px',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                background: activeMode === 'framework' ? '#5B4FE9' : 'transparent',
                color: activeMode === 'framework' ? '#FFFFFF' : '#475569',
                boxShadow: activeMode === 'framework' ? '0 2px 6px rgba(91,79,233,0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Building size={16} />
              <span>Institutions by Tier</span>
              <span
                style={{
                  padding: '0.1rem 0.5rem',
                  borderRadius: '999px',
                  background: activeMode === 'framework' ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                  color: activeMode === 'framework' ? '#FFFFFF' : '#64748B',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                {institutions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMode('strategy')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '9px',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                background: activeMode === 'strategy' ? '#5B4FE9' : 'transparent',
                color: activeMode === 'strategy' ? '#FFFFFF' : '#475569',
                boxShadow: activeMode === 'strategy' ? '0 2px 6px rgba(91,79,233,0.3)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Sparkles size={16} />
              <span>My Personalized Strategy</span>
              {batch && (
                <span
                  style={{
                    padding: '0.1rem 0.5rem',
                    borderRadius: '999px',
                    background: activeMode === 'strategy' ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                    color: activeMode === 'strategy' ? '#FFFFFF' : '#64748B',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {batch.counts.total}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: INSTITUTIONS BY TIER (ALL TIER THINGS HERE)       */}
      {/* ========================================================= */}
      {activeMode === 'framework' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. TIER EXPLANATION CARDS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Card 1: Top Reach */}
            <div
              onClick={() => setSelectedTier(selectedTier === 'TOP' ? 'ALL' : 'TOP')}
              style={{
                background: selectedTier === 'TOP' ? '#FEF3C7' : '#FFFFFF',
                borderRadius: '14px',
                padding: '1.15rem',
                border: selectedTier === 'TOP' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: selectedTier === 'TOP' ? '0 8px 20px -4px rgba(245, 158, 11, 0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7C2D12', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🌟 Top Reach (Aspirational)
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, background: '#FDE68A', color: '#7C2D12', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                  {tierCounts.TOP} Colleges
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                Highly selective research institutions (Ivy League, Group of Eight, TU9, Russell Group, U15).
              </p>
              <div style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 700 }}>
                High GPA (3.4+ / 75%+), strong test scores, and research background.
              </div>
            </div>

            {/* Card 2: Target / Mid-Tier */}
            <div
              onClick={() => setSelectedTier(selectedTier === 'MID' ? 'ALL' : 'MID')}
              style={{
                background: selectedTier === 'MID' ? '#DBEAFE' : '#FFFFFF',
                borderRadius: '14px',
                padding: '1.15rem',
                border: selectedTier === 'MID' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: selectedTier === 'MID' ? '0 8px 20px -4px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🎯 Target / Mid-Tier (Best-Fit)
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, background: '#BFDBFE', color: '#1E40AF', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                  {tierCounts.MID} Colleges
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                Renowned public universities, mid-tier comprehensive state schools with strong alumni networks.
              </p>
              <div style={{ fontSize: '0.74rem', color: '#1D4ED8', fontWeight: 700 }}>
                Balanced admission criteria, high ROI, practical industry internships.
              </div>
            </div>

            {/* Card 3: Safer / Value */}
            <div
              onClick={() => setSelectedTier(selectedTier === 'LOW' ? 'ALL' : 'LOW')}
              style={{
                background: selectedTier === 'LOW' ? '#D1FAE5' : '#FFFFFF',
                borderRadius: '14px',
                padding: '1.15rem',
                border: selectedTier === 'LOW' ? '2px solid #10B981' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: selectedTier === 'LOW' ? '0 8px 20px -4px rgba(16, 185, 129, 0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🛡️ Safer / Value / Regional
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, background: '#A7F3D0', color: '#065F46', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                  {tierCounts.LOW} Colleges
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                High acceptance likelihood, lower annual tuition fees, and regional post-study work visa incentives.
              </p>
              <div style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700 }}>
                Accessible admission parameters, transparent entry, and cost-effective living.
              </div>
            </div>

            {/* Card 4: Colleges & Polytechnics */}
            <div
              onClick={() => setSelectedTier(selectedTier === 'COLLEGE' ? 'ALL' : 'COLLEGE')}
              style={{
                background: selectedTier === 'COLLEGE' ? '#E0E7FF' : '#FFFFFF',
                borderRadius: '14px',
                padding: '1.15rem',
                border: selectedTier === 'COLLEGE' ? '2px solid #6366F1' : '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: selectedTier === 'COLLEGE' ? '0 8px 20px -4px rgba(99, 102, 241, 0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#312E81', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  🏫 Colleges & Polytechnics
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, background: '#C7D2FE', color: '#312E81', padding: '0.1rem 0.5rem', borderRadius: '999px' }}>
                  {tierCounts.COLLEGE} Colleges
                </span>
              </div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
                Applied learning, polytechnics, postgraduate diplomas, and direct career workforce preparation.
              </p>
              <div style={{ fontSize: '0.74rem', color: '#4338CA', fontWeight: 700 }}>
                Hands-on practical training, co-op work terms, and high graduate employment.
              </div>
            </div>
          </div>

          {/* 2. PROMINENT COUNSELLING TIER TABS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            {[
              { label: 'All Tiers', value: 'ALL', count: tierCounts.ALL },
              { label: '🌟 Top Reach (Go8/TU9/Ivy/Russell)', value: 'TOP', count: tierCounts.TOP },
              { label: '🎯 Target / Mid', value: 'MID', count: tierCounts.MID },
              { label: '🛡️ Safer / Value', value: 'LOW', count: tierCounts.LOW },
              { label: '🏫 Colleges & Polytechnics', value: 'COLLEGE', count: tierCounts.COLLEGE },
            ].map((tab) => {
              const isSelected = selectedTier === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedTier(tab.value)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    border: isSelected ? '1px solid #5B4FE9' : '1px solid #E2E8F0',
                    background: isSelected ? '#5B4FE9' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(91,79,233,0.25)' : 'none',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.05rem 0.45rem',
                      borderRadius: '999px',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                      color: isSelected ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 3. DESTINATION COUNTRY TABS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            {[
              { label: '🌐 All Destinations', value: 'ALL', count: 138 },
              ...(countries.length > 0
                ? countries.map((c) => ({
                    label: `${c.flag || '🌐'} ${c.name}`,
                    value: c.name,
                    count: c.institutionsCount,
                  }))
                : [
                    { label: '🇺🇸 United States', value: 'United States', count: 25 },
                    { label: '🇬🇧 United Kingdom', value: 'United Kingdom', count: 30 },
                    { label: '🇦🇺 Australia', value: 'Australia', count: 27 },
                    { label: '🇩🇪 Germany', value: 'Germany', count: 26 },
                    { label: '🇨🇦 Canada', value: 'Canada', count: 30 },
                  ]),
            ].map((tab) => {
              const isSelected = selectedCountry === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCountry(tab.value)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    background: isSelected ? '#0F172A' : '#F8FAFC',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.05rem 0.4rem',
                      borderRadius: '999px',
                      background: isSelected ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                      color: isSelected ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 4. SEARCH & FILTER TOOLBAR */}
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
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search colleges, cities or degree programs by tier..."
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
              {/* Exam Filter */}
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
                <option value="ALL">All Entrance Tests</option>
                <option value="IELTS">IELTS Accepted</option>
                <option value="TOEFL">TOEFL Accepted</option>
                <option value="PTE">PTE Accepted</option>
                <option value="GRE">GRE Accepted</option>
                <option value="GMAT">GMAT Accepted</option>
                <option value="GATE">GATE Recognized</option>
              </select>

              {/* Sort Order */}
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

              {(searchQuery || selectedTier !== 'ALL' || selectedCountry !== 'ALL' || selectedExam !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTier('ALL');
                    setSelectedCountry('ALL');
                    setSelectedExam('ALL');
                    setSortBy('name_asc');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* 5. INSTITUTIONS GRID (WITH SHOWTIERBADGE = TRUE) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.25rem 0' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A' }}>
              Showing {filteredInstitutions.length} Institutions in Three-Tier Framework
            </span>
          </div>

          {isInstitutionsLoading ? (
            <div
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                color: '#64748B',
              }}
            >
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                Loading institutions by counselling tier...
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>
                Categorizing institutions into Reach, Target, Safe, and Applied tiers.
              </p>
            </div>
          ) : filteredInstitutions.length === 0 ? (
            <div
              style={{
                padding: '3.5rem 2rem',
                textAlign: 'center',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem' }}>
                No institutions match the current tier filters
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0 0 1rem' }}>
                Try selecting "All Tiers" or adjusting your destination country.
              </p>
              <button
                onClick={() => {
                  setSelectedTier('ALL');
                  setSelectedCountry('ALL');
                  setSearchQuery('');
                  setSelectedExam('ALL');
                }}
                style={{
                  padding: '0.6rem 1.25rem',
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {filteredInstitutions.map((institution) => (
                <InstitutionCard
                  key={institution.id}
                  institution={institution}
                  onViewDetails={handleOpenDetailModal}
                  onToggleSave={handleToggleSaveInstitution}
                  onToggleCompare={handleToggleCompareInstitution}
                  isSaved={savedInstIds.has(institution.id)}
                  isCompared={comparedInstIds.has(institution.id)}
                  showTierBadge={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: MY PERSONALIZED STRATEGY                          */}
      {/* ========================================================= */}
      {activeMode === 'strategy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Strategy Header & Recalculate */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Personalized Application Portfolio Allocation
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0.2rem 0 0', lineHeight: 1.45 }}>
                Algorithmic admission probability matching based on your verified credentials and counsellor oversight.
              </p>
            </div>

            <button
              onClick={handleRegenerateStrategy}
              disabled={isRegenerating || isStrategyLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                background: '#5B4FE9',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: isRegenerating ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={15} className={isRegenerating ? 'spin' : ''} />
              <span>{isRegenerating ? 'Recalculating...' : 'Regenerate Strategy'}</span>
            </button>
          </div>

          {/* Strategy Metrics Grid (Safe, Best-Fit, Aspirational) */}
          {batch && (
            <div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                {/* Total */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Recommended</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                    {batch.counts.total}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.1rem' }}>Primary Balanced List</div>
                </div>

                {/* Safe Card */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>Safe Options</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>
                    {batch.counts.safe}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: '0.1rem' }}>&gt;95% Admission Likelihood</div>
                </div>

                {/* Best-Fit Card */}
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 700 }}>Best-Fit Matches</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB', marginTop: '0.2rem' }}>
                    {batch.counts.bestFit}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#1E40AF', marginTop: '0.1rem' }}>50% – 95% Admission Chance</div>
                </div>

                {/* Aspirational Card */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700 }}>Aspirational Targets</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706', marginTop: '0.2rem' }}>
                    {batch.counts.aspirational}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#92400E', marginTop: '0.1rem' }}>&lt;50% Reach Targets</div>
                </div>
              </div>

              {/* Distribution Bar */}
              <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.82rem' }}>
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>Portfolio Balance Strategy:</span>
                  <span style={{ color: '#5B4FE9', fontWeight: 600 }}>{batch.strategySummary}</span>
                </div>
                <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', gap: '3px' }}>
                  <div style={{ flex: batch.counts.safe || 1, background: '#22C55E', borderRadius: '3px' }} title={`Safe: ${batch.counts.safe}`} />
                  <div style={{ flex: batch.counts.bestFit || 1, background: '#3B82F6', borderRadius: '3px' }} title={`Best-Fit: ${batch.counts.bestFit}`} />
                  <div style={{ flex: batch.counts.aspirational || 1, background: '#F59E0B', borderRadius: '3px' }} title={`Aspirational: ${batch.counts.aspirational}`} />
                </div>
              </div>
            </div>
          )}

          {/* Unverified Profile Banner (Non-blocking) */}
          {!isStrategyLoading && !isVerified && (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#D97706',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400E' }}>
                    Personalized Strategy Requires Counsellor Authentication ({verificationStatus})
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#B45309', marginTop: '0.15rem' }}>
                    {verificationNotice || 'Complete your educational intake details and book a counsellor session to unlock tailored admission probabilities.'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateSection?.('education')}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '8px',
                  background: '#D97706',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Verify Education Profile
              </button>
            </div>
          )}

          {/* Feedback Alert */}
          {feedback && (
            <div
              style={{
                background: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
                color: feedback.type === 'success' ? '#065F46' : '#991B1B',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: 600,
              }}
            >
              {feedback.message}
            </div>
          )}

          {/* Counsellor Advisory Note */}
          {batch?.counsellorNotes && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
              }}
            >
              <CheckCircle size={20} color="#16A34A" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', marginBottom: '0.2rem' }}>
                  Counsellor Review & Strategy Advisory
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#14532D', lineHeight: 1.5 }}>
                  {batch.counsellorNotes}
                </p>
              </div>
            </div>
          )}

          {/* Strategy Tabs */}
          {batch && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              <button
                onClick={() => setStrategyTab('ALL')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: strategyTab === 'ALL' ? '1px solid #5B4FE9' : '1px solid #E2E8F0',
                  background: strategyTab === 'ALL' ? '#5B4FE9' : '#FFFFFF',
                  color: strategyTab === 'ALL' ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                }}
              >
                All Recommendations ({batch.items.length})
              </button>

              <button
                onClick={() => setStrategyTab('SAFE')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: strategyTab === 'SAFE' ? '1px solid #16A34A' : '1px solid #E2E8F0',
                  background: strategyTab === 'SAFE' ? '#16A34A' : '#FFFFFF',
                  color: strategyTab === 'SAFE' ? '#FFFFFF' : '#166534',
                  cursor: 'pointer',
                }}
              >
                Safe ({batch.counts.safe})
              </button>

              <button
                onClick={() => setStrategyTab('BEST_FIT')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: strategyTab === 'BEST_FIT' ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  background: strategyTab === 'BEST_FIT' ? '#2563EB' : '#FFFFFF',
                  color: strategyTab === 'BEST_FIT' ? '#FFFFFF' : '#1E40AF',
                  cursor: 'pointer',
                }}
              >
                Best-Fit ({batch.counts.bestFit})
              </button>

              <button
                onClick={() => setStrategyTab('ASPIRATIONAL')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: strategyTab === 'ASPIRATIONAL' ? '1px solid #D97706' : '1px solid #E2E8F0',
                  background: strategyTab === 'ASPIRATIONAL' ? '#D97706' : '#FFFFFF',
                  color: strategyTab === 'ASPIRATIONAL' ? '#FFFFFF' : '#92400E',
                  cursor: 'pointer',
                }}
              >
                Aspirational ({batch.counts.aspirational})
              </button>

              <button
                onClick={() => setStrategyTab('ALTERNATIVES')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  border: strategyTab === 'ALTERNATIVES' ? '1px solid #9333EA' : '1px solid #E2E8F0',
                  background: strategyTab === 'ALTERNATIVES' ? '#9333EA' : '#FFFFFF',
                  color: strategyTab === 'ALTERNATIVES' ? '#FFFFFF' : '#6B21A8',
                  cursor: 'pointer',
                }}
              >
                Strategic Alternatives ({batch.counts.alternatives || 0})
              </button>
            </div>
          )}

          {/* Strategy Recommendation Cards Grid */}
          {isStrategyLoading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: '#64748B' }}>
              Evaluating admission benchmarks and student profile...
            </div>
          ) : visibleStrategyItems().length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                border: '1px dashed #CBD5E1',
                padding: '3rem 2rem',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <Layers size={36} color="#5B4FE9" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                No Recommendations in Selected Category
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto' }}>
                Switch to "Institutions by Tier" to explore all 138 universities categorized by admissions tier.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {visibleStrategyItems().map((item) => (
                <RecommendationCard
                  key={item.id}
                  item={item}
                  onOpenEvidence={(it) => setSelectedItemForEvidence(it)}
                  onOpenScatterPlot={(it) => setSelectedItemForScatter(it)}
                  onToggleShortlist={handleToggleStrategyShortlist}
                  isShortlistLoading={shortlistLoadingId === item.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: INSTITUTION DETAIL MODAL (From clicking any institution in Framework mode) */}
      {isDetailModalOpen && selectedDetailInst && (
        <InstitutionDetailModal
          institution={selectedDetailInst}
          onClose={() => setIsDetailModalOpen(false)}
          onSelectCourse={(_course) => {}}
          onToggleSave={handleToggleSaveInstitution}
          onToggleCompare={handleToggleCompareInstitution}
          isSaved={savedInstIds.has(selectedDetailInst.id)}
          isCompared={comparedInstIds.has(selectedDetailInst.id)}
        />
      )}

      {/* MODAL: EVIDENCE BREAKDOWN MODAL */}
      <EvidenceModal
        isOpen={!!selectedItemForEvidence}
        onClose={() => setSelectedItemForEvidence(null)}
        item={selectedItemForEvidence}
        onToggleShortlist={handleToggleStrategyShortlist}
      />

      {/* MODAL: COHORT SCATTER PLOT MODAL */}
      <CohortScatterPlotModal
        isOpen={!!selectedItemForScatter}
        onClose={() => setSelectedItemForScatter(null)}
        item={selectedItemForScatter}
      />
    </div>
  );
};
