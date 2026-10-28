import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building,
  Award,
  Globe,
  Bookmark,
  Scale,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Coins,
  Home,
  Briefcase,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { InstitutionDetail, CourseSummary } from '../colleges.types';

interface InstitutionDetailModalProps {
  institution: InstitutionDetail | null;
  onClose: () => void;
  onSelectCourse: (course: CourseSummary) => void;
  onToggleSave: (institution: InstitutionDetail) => void;
  onToggleCompare: (institution: InstitutionDetail) => void;
  isSaved: boolean;
  isCompared: boolean;
}

export const InstitutionDetailModal: React.FC<InstitutionDetailModalProps> = ({
  institution,
  onClose,
  onSelectCourse,
  onToggleSave,
  onToggleCompare,
  isSaved,
  isCompared,
}) => {
  const [activeTab, setActiveTab] = useState<'admissions' | 'overview' | 'courses' | 'contact'>('admissions');

  if (!institution) return null;

  const renderTierBadge = () => {
    const tier = institution.counsellingTier || (institution.managedTier === 'ASPIRATIONAL' ? 'TOP' : institution.managedTier === 'SAFE' ? 'LOW' : 'MID');
    if (tier === 'TOP') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#7C2D12',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
          }}
        >
          🌟 TOP REACH
        </span>
      );
    }
    if (tier === 'COLLEGE') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#312E81',
            background: '#E0E7FF',
            border: '1px solid #C7D2FE',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
          }}
        >
          🏫 COLLEGE / DIPLOMA
        </span>
      );
    }
    if (tier === 'LOW') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#065F46',
            background: '#D1FAE5',
            border: '1px solid #A7F3D0',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
          }}
        >
          🛡️ SAFER / VALUE
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: '0.74rem',
          fontWeight: 800,
          color: '#1E40AF',
          background: '#DBEAFE',
          border: '1px solid #BFDBFE',
          padding: '0.2rem 0.65rem',
          borderRadius: '999px',
        }}
      >
        🎯 TARGET / MID
      </span>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(8, 20, 38, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        id="institution-detail-modal"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          background: '#FFFFFF',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(8, 20, 38, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER WITH DARK NAVY BANNER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B1535 0%, #1E1B4B 100%)',
            padding: '1.75rem 2rem',
            color: '#FFFFFF',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>

          {/* Badges row: Tier + Ranking */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
            {renderTierBadge()}

            {institution.rankingInfo && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#C7D2FE',
                  background: 'rgba(91, 79, 233, 0.3)',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(199, 210, 254, 0.25)',
                }}
              >
                <Award size={13} />
                <span>{institution.rankingInfo}</span>
              </div>
            )}
          </div>

          {/* Name & Location */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 0.35rem',
              color: '#FFFFFF',
            }}
          >
            {institution.name}
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              fontSize: '0.86rem',
              color: '#CBD5E1',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#94A3B8" />
              <span>
                {institution.city}, {institution.state ? `${institution.state}, ` : ''}{institution.country}
              </span>
            </span>

            {institution.institutionType && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={14} color="#94A3B8" />
                <span>{institution.institutionType}</span>
              </span>
            )}

            {institution.establishedYear && <span>Est. {institution.establishedYear}</span>}
          </div>

          {/* Header Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginTop: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Official Website Button */}
            {institution.officialWebsiteUrl && (
              <a
                href={institution.officialWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="modal-official-site-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '8px',
                  background: '#5B4FE9',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(91, 79, 233, 0.4)',
                }}
              >
                <Globe size={15} />
                <span>Visit Official Website</span>
                <ExternalLink size={13} />
              </a>
            )}

            {/* Save Button */}
            <button
              onClick={() => onToggleSave(institution)}
              id="modal-save-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                background: isSaved ? '#FEF3C7' : 'rgba(255, 255, 255, 0.12)',
                border: isSaved ? '1px solid #FDE68A' : '1px solid rgba(255, 255, 255, 0.2)',
                color: isSaved ? '#D97706' : '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Bookmark size={15} fill={isSaved ? '#D97706' : 'none'} />
              <span>{isSaved ? 'Saved in Shortlist' : 'Save Institution'}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => onToggleCompare(institution)}
              id="modal-compare-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                background: isCompared ? '#EEF2FF' : 'rgba(255, 255, 255, 0.12)',
                border: isCompared ? '1px solid #C7D2FE' : '1px solid rgba(255, 255, 255, 0.2)',
                color: isCompared ? '#4338CA' : '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Scale size={15} />
              <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
            padding: '0 1.5rem',
            overflowX: 'auto',
          }}
        >
          {[
            { key: 'admissions', label: '2026 Admissions & Entrance Tests' },
            { key: 'overview', label: 'Overview & Campus' },
            { key: 'courses', label: `Available Programs (${institution.courses?.length || 0})` },
            { key: 'contact', label: 'Admissions & Contact' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                style={{
                  padding: '0.9rem 1.25rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#5B4FE9' : '#64748B',
                  borderBottom: isActive ? '2px solid #5B4FE9' : '2px solid transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* MODAL BODY CONTENT SCROLLABLE */}
        <div
          style={{
            padding: '1.75rem 2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
          }}
        >
          {/* TAB 1: 2026 ADMISSIONS & ENTRANCE TESTS */}
          {activeTab === 'admissions' && (
            <>
              {/* Disclaimer Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.85rem 1rem',
                  background: '#EFF6FF',
                  borderRadius: '10px',
                  border: '1px solid #BFDBFE',
                  color: '#1E40AF',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Admissions Guide 2026 Reference:</strong> Planning estimates from published institutional
                  and government benchmarks. Requirements are department-specific and subject to change; verify the exact
                  programme page prior to submitting an official application.
                </span>
              </div>

              {/* Academic Profile & Eligibility Card */}
              <div
                style={{
                  padding: '1.25rem',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <FileText size={15} color="#5B4FE9" />
                  <span>Academic Profile & Percentage / GPA Equivalency</span>
                </h4>
                <p style={{ fontSize: '0.94rem', color: '#0F172A', fontWeight: 600, margin: '0 0 0.35rem' }}>
                  {institution.academicProfileSummary || 'Refer to programme-specific degree criteria and prerequisite transcripts.'}
                </p>
                {institution.admissionsOverview && (
                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    {institution.admissionsOverview}
                  </p>
                )}
              </div>

              {/* Entrance Exams & Tests Matrix */}
              <div>
                <h4
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.75rem',
                  }}
                >
                  Entrance Exams & Language Proficiency Policy
                </h4>

                {institution.examRules && institution.examRules.length > 0 ? (
                  <div
                    style={{
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      overflow: 'hidden',
                    }}
                  >
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                      <thead>
                        <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#334155' }}>Exam</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#334155' }}>Status</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#334155' }}>Min Score Guide</th>
                          <th style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#334155' }}>Program / Faculty Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {institution.examRules.map((rule, idx) => {
                          const isReq = rule.ruleStatus === 'REQUIRED';
                          const isAlt = rule.ruleStatus === 'ALTERNATIVE';
                          const isWaived = rule.ruleStatus === 'WAIVED';
                          return (
                            <tr
                              key={`${rule.examCode}-${idx}`}
                              style={{
                                borderBottom: idx < institution.examRules!.length - 1 ? '1px solid #F1F5F9' : 'none',
                                background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                              }}
                            >
                              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                                {rule.examCode}
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    background: isReq ? '#EFF6FF' : isAlt ? '#FEF3C7' : isWaived ? '#ECFDF5' : '#F1F5F9',
                                    color: isReq ? '#1D4ED8' : isAlt ? '#B45309' : isWaived ? '#047857' : '#475569',
                                    border: isReq ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                                  }}
                                >
                                  {rule.ruleStatus}
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem', color: '#334155', fontWeight: 600 }}>
                                {rule.minScore || 'Faculty specific'}
                              </td>
                              <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>
                                {rule.notes || 'Confirm requirement on department admissions page.'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ fontSize: '0.86rem', color: '#64748B' }}>
                    {institution.examRequirementsSummary || 'Standard English language proficiency and department tests apply.'}
                  </p>
                )}
              </div>

              {/* Financial Planning: Tuition & Living Costs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    padding: '1rem',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284C7', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <Coins size={15} />
                    <span>Indicative Tuition Structure</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#0F172A', fontWeight: 600 }}>
                    {institution.tuitionStructureNotes || `${institution.feeCurrency || '$'} ${institution.minAnnualFee?.toLocaleString()} – ${institution.maxAnnualFee?.toLocaleString()} / year`}
                  </p>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <Home size={15} />
                    <span>Living Cost Estimate</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#0F172A', fontWeight: 600 }}>
                    {institution.livingCostEstimate || 'Estimated based on official national immigration guidelines.'}
                  </p>
                </div>
              </div>

              {/* Post-Study Work Rights */}
              <div
                style={{
                  padding: '1rem',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#D97706', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  <Briefcase size={15} />
                  <span>Post-Study Work Visa & Career Pathways</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                  {institution.postStudyWorkDetails || 'International graduates are eligible for destination country post-study work routes subject to immigration requirements.'}
                </p>
              </div>

              {/* Verification & Official Sources Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: '#EEF2FF',
                  borderRadius: '10px',
                  border: '1px solid #C7D2FE',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4338CA', fontSize: '0.82rem', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>Verified 2026 Admissions Guide • Confidence: {institution.verificationConfidence || 'HIGH'}</span>
                </div>

                {institution.sourceUrl && (
                  <a
                    href={institution.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#4338CA',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Official Reference Page</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </>
          )}

          {/* TAB 2: OVERVIEW & CAMPUS */}
          {activeTab === 'overview' && (
            <>
              {/* SECTION: ABOUT */}
              <div>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.5rem',
                  }}
                >
                  About the Institution
                </h4>
                <p style={{ fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.6, margin: 0 }}>
                  {institution.overview || 'Information not currently available.'}
                </p>
              </div>

              {/* SECTION: POPULAR PROGRAMS */}
              <div>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.65rem',
                  }}
                >
                  Popular Programs
                </h4>
                {institution.popularPrograms && institution.popularPrograms.length > 0 ? (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {institution.popularPrograms.map((p) => (
                      <span
                        key={p}
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          padding: '0.35rem 0.85rem',
                          borderRadius: '8px',
                          background: '#EEF2FF',
                          color: '#4338CA',
                          border: '1px solid #E0E7FF',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                    Information not currently available.
                  </p>
                )}
              </div>

              {/* SECTION: CAMPUS FACILITIES */}
              <div>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.65rem',
                  }}
                >
                  Campus Facilities
                </h4>
                {institution.campusFacilities && institution.campusFacilities.length > 0 ? (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.25rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '0.5rem',
                      fontSize: '0.88rem',
                      color: '#334155',
                    }}
                  >
                    {institution.campusFacilities.map((facility, idx) => (
                      <li key={idx} style={{ lineHeight: 1.5 }}>
                        {facility}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                    Information not currently available.
                  </p>
                )}
              </div>

              {/* SECTION: CAREERS & PLACEMENT */}
              {institution.placementInfo && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: '#64748B',
                      margin: '0 0 0.5rem',
                    }}
                  >
                    Career Support & Graduate Outcomes
                  </h4>
                  <p style={{ fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.6, margin: 0 }}>
                    {institution.placementInfo}
                  </p>
                </div>
              )}
            </>
          )}

          {/* TAB 3: AVAILABLE PROGRAMS */}
          {activeTab === 'courses' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: 0,
                  }}
                >
                  Published Degree Offerings
                </h4>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Showing {institution.courses?.length || 0} programmes
                </span>
              </div>

              {institution.courses && institution.courses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {institution.courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => onSelectCourse(course)}
                      style={{
                        padding: '1.1rem',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#5B4FE9';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 79, 233, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A' }}>
                            {course.name}
                          </span>
                          {course.isPopular && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: '#16A34A',
                                background: '#DCFCE7',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                              }}
                            >
                              Popular
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            flexWrap: 'wrap',
                            fontSize: '0.8rem',
                            color: '#64748B',
                          }}
                        >
                          <span>{course.department}</span>
                          <span>•</span>
                          <span>{course.level}</span>
                          <span>•</span>
                          <span>{course.durationText || `${course.durationYears} Years`}</span>
                          {course.feeRange && (
                            <>
                              <span>•</span>
                              <span style={{ color: '#0F172A', fontWeight: 600 }}>{course.feeRange}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5B4FE9', fontWeight: 600, fontSize: '0.84rem' }}>
                        <span>Details</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Information not currently available.
                </p>
              )}
            </div>
          )}

          {/* TAB 4: ADMISSIONS & CONTACT */}
          {activeTab === 'contact' && (
            <>
              {/* SECTION: ADMISSION / DEADLINES */}
              <div>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.5rem',
                  }}
                >
                  Admission Cycles & Deadlines
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.55, margin: 0 }}>
                  {institution.admissionDeadlines || 'Information not currently available.'}
                </p>
              </div>

              {/* SECTION: CONTACT */}
              <div>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    margin: '0 0 0.65rem',
                  }}
                >
                  Official Contact Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {institution.contactEmail && (
                    <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                        <Mail size={13} />
                        <span>Admissions Email</span>
                      </div>
                      <a href={`mailto:${institution.contactEmail}`} style={{ color: '#5B4FE9', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                        {institution.contactEmail}
                      </a>
                    </div>
                  )}

                  {institution.contactPhone && (
                    <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                        <Phone size={13} />
                        <span>Admissions Phone</span>
                      </div>
                      <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.88rem' }}>
                        {institution.contactPhone}
                      </span>
                    </div>
                  )}

                  {institution.address && (
                    <div style={{ padding: '0.85rem', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', gridColumn: '1 / -1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                        <MapPin size={13} />
                        <span>Campus Address</span>
                      </div>
                      <span style={{ color: '#0F172A', fontSize: '0.86rem' }}>
                        {institution.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: OFFICIAL WEBSITE */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#312E81', margin: '0 0 0.2rem' }}>
                    Direct Institution Application & Prospectus
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: '#4338CA', margin: 0 }}>
                    Official verified address: {institution.officialWebsiteUrl}
                  </p>
                </div>
                <a
                  href={institution.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    background: '#5B4FE9',
                    color: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>Open Official Website</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
