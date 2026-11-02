import React, { useState } from 'react';
import {
  Globe,
  Coins,
  Home,
  Briefcase,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CountrySummary } from '../colleges.types';

interface CountryDiscoveryCardsProps {
  countries: CountrySummary[];
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
}


const FLAG_MAP: Record<string, string> = {
  IND: 'https://flagcdn.com/w80/in.png',
  USA: 'https://flagcdn.com/w80/us.png',
  GBR: 'https://flagcdn.com/w80/gb.png',
  AUS: 'https://flagcdn.com/w80/au.png',
  CAN: 'https://flagcdn.com/w80/ca.png',
  DEU: 'https://flagcdn.com/w80/de.png',
};

const CURATED_BANNERS: Record<string, string> = {
  IND: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
  USA: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85',
  GBR: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85',
  AUS: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=85',
  DEU: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=85',
  CAN: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=85',
};

export const CountryDiscoveryCards: React.FC<CountryDiscoveryCardsProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
}) => {
  const [expandedVisaNotes, setExpandedVisaNotes] = useState<string | null>(null);

  const toggleVisaNotes = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedVisaNotes((prev) => (prev === code ? null : code));
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Visual Reference A Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#EEF2FF',
              color: '#4338CA',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.35rem',
            }}
          >
            <Globe size={14} />
            <span>2026 Admissions Guide • Destination Countries</span>
          </div>
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Global Higher Education Hubs
          </h2>
          <p style={{ margin: '0.2rem 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Explore verified tuition estimates, living expenses, and post-study work visa policies across {countries.reduce((acc, c) => acc + (c.institutionsCount || 0), 0) || 171} institutions.
          </p>
        </div>

        {selectedCountry !== 'ALL' && (
          <button
            onClick={() => onSelectCountry('ALL')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Reset Country Filter</span>
          </button>
        )}
      </div>

      {/* 5-Country Discovery Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {countries.map((country) => {
          const isSelected =
            selectedCountry === country.name ||
            selectedCountry === country.code ||
            (selectedCountry === 'United States' && country.code === 'USA') ||
            (selectedCountry === 'United Kingdom' && country.code === 'GBR');

          const isNotesExpanded = expandedVisaNotes === country.code;

          return (
            <div
              key={country.id}
              id={`country-card-${country.code.toLowerCase()}`}
              onClick={() => onSelectCountry(country.name)}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: isSelected ? '2px solid #5B4FE9' : '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: isSelected
                  ? '0 12px 28px -4px rgba(91, 79, 233, 0.18)'
                  : '0 2px 6px rgba(15, 23, 42, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#C7D2FE';
                  e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(91, 79, 233, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.04)';
                }
              }}
            >
              {/* Destination Hero Image */}
              <div
                style={{
                  height: '165px',
                  position: 'relative',
                  backgroundImage: `url(${CURATED_BANNERS[country.code] || country.bannerImageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: country.code === 'IND' ? 'center 22%' : 'center',
                  backgroundColor: '#1E293B',
                }}
              >
                {/* Enhanced multi-stage gradient scrim for crystal clear contrast */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.08) 32%, rgba(15,23,42,0.65) 68%, rgba(15,23,42,0.96) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Country Real National Flag & Code Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.28rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    color: '#0F172A',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                  }}
                >
                  <img
                    src={FLAG_MAP[country.code] || `https://flagcdn.com/w80/${country.code.slice(0, 2).toLowerCase()}.png`}
                    alt={`${country.name} flag`}
                    style={{
                      width: '18px',
                      height: '13px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ letterSpacing: '0.04em' }}>{country.code}</span>
                </div>

                {/* Institution Count Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    zIndex: 2,
                    background: isSelected ? '#5B4FE9' : 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    padding: '0.28rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(6px)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  {country.institutionsCount} Institutions
                </div>

                {/* Ultra Clear Country Name & Tagline at bottom of banner */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.85rem',
                    left: '0.95rem',
                    right: '0.95rem',
                    zIndex: 2,
                    color: '#FFFFFF',
                    pointerEvents: 'none',
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.45rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.95)',
                      lineHeight: 1.2,
                    }}
                  >
                    {country.name}
                  </h3>
                  <div
                    style={{
                      marginTop: '0.22rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#F1F5F9',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textShadow: '0 1px 4px rgba(0,0,0,0.85)',
                    }}
                  >
                    {country.tagline}
                  </div>
                </div>
              </div>

              {/* Card Body: Key Metrics */}
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  flex: 1,
                }}
              >
                {/* 1. Tuition Range */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.6rem',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#64748B',
                      fontWeight: 600,
                    }}
                  >
                    <Coins size={14} color="#0284C7" />
                    <span>Avg Tuition</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>
                    {country.avgTuitionRange}
                  </span>
                </div>

                {/* 2. Living Costs */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.6rem',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#64748B',
                      fontWeight: 600,
                    }}
                  >
                    <Home size={14} color="#10B981" />
                    <span>Living Costs</span>
                  </span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>
                    {country.livingCostRange}
                  </span>
                </div>

                {/* 3. Post-Study Work Visa */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.6rem',
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #F1F5F9',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#64748B',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase size={14} color="#F59E0B" />
                    <span>Work Rights</span>
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#0F172A',
                      textAlign: 'right',
                      fontSize: '0.78rem',
                    }}
                  >
                    {country.postStudyWorkVisa}
                  </span>
                </div>

                {/* Collapsible Visa & Guide Notes */}
                {country.visaNotes && (
                  <div style={{ marginTop: '0.2rem' }}>
                    <button
                      onClick={(e) => toggleVisaNotes(country.code, e)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '0.25rem 0',
                        color: '#6366F1',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <ShieldCheck size={13} />
                      <span>{isNotesExpanded ? 'Hide Visa & Verification Policy' : 'View Visa & Verification Policy'}</span>
                      {isNotesExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {isNotesExpanded && (
                      <div
                        style={{
                          marginTop: '0.35rem',
                          padding: '0.65rem',
                          background: '#EEF2FF',
                          borderRadius: '8px',
                          border: '1px solid #E0E7FF',
                          fontSize: '0.75rem',
                          color: '#334155',
                          lineHeight: 1.45,
                        }}
                      >
                        <p style={{ margin: '0 0 0.4rem' }}>{country.visaNotes}</p>
                        {country.sourceUrl && (
                          <a
                            href={country.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              color: '#4338CA',
                              fontWeight: 700,
                              textDecoration: 'none',
                              fontSize: '0.72rem',
                            }}
                          >
                            <span>Official Source Reference</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Action Button */}
                <div style={{ marginTop: 'auto', paddingTop: '0.65rem' }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      background: '#5B4FE9',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 4px rgba(91, 79, 233, 0.2)',
                    }}
                  >
                    <span>View All {country.institutionsCount} Colleges in {country.name}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

