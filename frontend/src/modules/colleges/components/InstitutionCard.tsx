import React from 'react';
import {
  MapPin,
  Building,
  Award,
  BookOpen,
  Bookmark,
  Scale,
  ArrowRight,
  Coins,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { InstitutionSummary } from '../colleges.types';

interface InstitutionCardProps {
  institution: InstitutionSummary;
  onViewDetails: (institution: InstitutionSummary) => void;
  onToggleSave: (institution: InstitutionSummary) => void;
  onToggleCompare: (institution: InstitutionSummary) => void;
  isSaved: boolean;
  isCompared: boolean;
  showTierBadge?: boolean;
}

export const InstitutionCard: React.FC<InstitutionCardProps> = ({
  institution,
  onViewDetails,
  onToggleSave,
  onToggleCompare,
  isSaved,
  isCompared,
  showTierBadge = false,
}) => {
  // Render counselling tier badge
  const renderTierBadge = () => {
    if (!showTierBadge) return null;
    const tier = institution.counsellingTier || (institution.managedTier === 'ASPIRATIONAL' ? 'TOP' : institution.managedTier === 'SAFE' ? 'LOW' : 'MID');
    
    if (tier === 'TOP') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#7C2D12',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            letterSpacing: '0.02em',
          }}
        >
          <span>🌟 TOP REACH</span>
        </span>
      );
    }
    if (tier === 'COLLEGE') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#312E81',
            background: '#E0E7FF',
            border: '1px solid #C7D2FE',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
          }}
        >
          <span>🏫 COLLEGE / DIPLOMA</span>
        </span>
      );
    }
    if (tier === 'LOW') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#065F46',
            background: '#D1FAE5',
            border: '1px solid #A7F3D0',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
          }}
        >
          <span>🛡️ SAFER / VALUE</span>
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#1E40AF',
          background: '#DBEAFE',
          border: '1px solid #BFDBFE',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
        }}
      >
        <span>🎯 TARGET / MID</span>
      </span>
    );
  };

  return (
    <div
      id={`college-card-${institution.slug}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.15rem',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = '#C7D2FE';
        e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(91, 79, 233, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04)';
      }}
    >
      <div>
        {/* Top Header Row: Tier Pill + Ranking + Bookmark Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {renderTierBadge()}

            {institution.rankingInfo && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#4338CA',
                  background: '#EEF2FF',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  border: '1px solid #E0E7FF',
                }}
              >
                <Award size={11} />
                <span>{institution.rankingInfo}</span>
              </span>
            )}
          </div>

          {/* Save Bookmark Button */}
          <button
            onClick={() => onToggleSave(institution)}
            style={{
              background: isSaved ? '#FEF3C7' : '#F8FAFC',
              border: isSaved ? '1px solid #FDE68A' : '1px solid #E2E8F0',
              color: isSaved ? '#D97706' : '#64748B',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title={isSaved ? 'Remove from Saved' : 'Save Institution'}
          >
            <Bookmark size={15} fill={isSaved ? '#D97706' : 'none'} />
          </button>
        </div>

        {/* Institution Name */}
        <h3
          onClick={() => onViewDetails(institution)}
          style={{
            fontSize: '1.18rem',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 0.35rem',
            lineHeight: 1.35,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#5B4FE9')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#0F172A')}
        >
          {institution.name}
        </h3>

        {/* Location & Institution Type */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            fontSize: '0.8rem',
            color: '#64748B',
            marginBottom: '0.85rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <MapPin size={13} color="#94A3B8" />
            <span>
              {institution.city}, {institution.country}
            </span>
          </span>

          {institution.institutionType && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building size={13} color="#94A3B8" />
              <span>{institution.institutionType}</span>
            </span>
          )}
        </div>

        {/* 2026 Admissions Academic Profile / Eligibility Summary */}
        {institution.academicProfileSummary && (
          <div
            style={{
              padding: '0.55rem 0.7rem',
              background: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #F1F5F9',
              fontSize: '0.78rem',
              color: '#334155',
              lineHeight: 1.45,
              marginBottom: '0.85rem',
            }}
          >
            <span style={{ fontWeight: 700, color: '#0F172A' }}>Profile: </span>
            <span>{institution.academicProfileSummary}</span>
          </div>
        )}

        {/* Indicative Tuition Structure */}
        {institution.tuitionStructureNotes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.35rem',
              fontSize: '0.78rem',
              color: '#475569',
              marginBottom: '0.75rem',
            }}
          >
            <Coins size={14} color="#0284C7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong style={{ color: '#0F172A' }}>Tuition: </strong>
              {institution.tuitionStructureNotes}
            </span>
          </div>
        )}

        {/* Highlights Bar: Programs Preview + Accepted Exams */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #F1F5F9',
            fontSize: '0.8rem',
          }}
        >
          {/* Programs count & preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
            <BookOpen size={14} color="#5B4FE9" />
            <span style={{ fontWeight: 700 }}>{institution.coursesCount} Programs</span>
            {institution.popularPrograms.length > 0 && (
              <span style={{ color: '#64748B', fontSize: '0.78rem' }}>
                • {institution.popularPrograms[0]}
              </span>
            )}
          </div>

          {/* Entrance Exams Required / Accepted */}
          {institution.examRules && institution.examRules.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.1rem' }}>
              <span style={{ color: '#64748B', fontSize: '0.74rem', fontWeight: 600 }}>Tests:</span>
              {institution.examRules.slice(0, 4).map((rule, idx) => {
                const isReq = rule.ruleStatus === 'REQUIRED';
                const isAlt = rule.ruleStatus === 'ALTERNATIVE';
                const isWaived = rule.ruleStatus === 'WAIVED';
                return (
                  <span
                    key={`${rule.examCode}-${idx}`}
                    title={rule.notes || `${rule.examCode} ${rule.ruleStatus}`}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '4px',
                      background: isReq ? '#EFF6FF' : isAlt ? '#FEF3C7' : isWaived ? '#ECFDF5' : '#F1F5F9',
                      color: isReq ? '#1D4ED8' : isAlt ? '#B45309' : isWaived ? '#047857' : '#475569',
                      border: isReq ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    }}
                  >
                    {rule.examCode} {isReq ? '• Req' : ''}
                  </span>
                );
              })}
            </div>
          ) : institution.entranceExams.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.1rem' }}>
              <span style={{ color: '#64748B', fontSize: '0.74rem', fontWeight: 600 }}>Tests:</span>
              {institution.entranceExams.slice(0, 3).map((exam) => (
                <span
                  key={exam}
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px',
                    background: '#F1F5F9',
                    color: '#475569',
                  }}
                >
                  {exam}
                </span>
              ))}
            </div>
          ) : null}

          {/* Verification source link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: '#64748B',
              marginTop: '0.25rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#16A34A', fontWeight: 600 }}>
              <ShieldCheck size={12} />
              <span>Verified 2026 Guide</span>
            </span>

            {institution.officialWebsiteUrl && (
              <a
                href={institution.officialWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  color: '#6366F1',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <span>Official Site</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.65rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #F1F5F9',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => onViewDetails(institution)}
          id={`view-details-${institution.slug}`}
          style={{
            flex: 1,
            minWidth: '110px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            padding: '0.55rem 0.85rem',
            borderRadius: '8px',
            background: '#5B4FE9',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#4338CA')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#5B4FE9')}
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={() => onToggleCompare(institution)}
          id={`compare-btn-${institution.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.55rem 0.85rem',
            borderRadius: '8px',
            background: isCompared ? '#EEF2FF' : '#F8FAFC',
            border: isCompared ? '1px solid #5B4FE9' : '1px solid #CBD5E1',
            color: isCompared ? '#5B4FE9' : '#475569',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title={isCompared ? 'Remove from Comparison' : 'Add to Comparison'}
        >
          <Scale size={14} />
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>
      </div>
    </div>
  );
};
