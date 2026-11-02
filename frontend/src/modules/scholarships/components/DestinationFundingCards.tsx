import React from 'react';
import {
  Globe,
  Award,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export interface DestinationFundingHub {
  name: string;
  code: string;
  flagUrl: string;
  bannerUrl: string;
  opportunitiesCount: number;
  tagline: string;
  coverageHighlight: string;
  topProviders: string[];
  keySchemes: string;
}

interface DestinationFundingCardsProps {
  selectedCountry: string;
  onSelectCountry: (countryName: string) => void;
  onOpenCountryPage?: (countryName: string) => void;
  countryCounts?: Record<string, number>;
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

const DESTINATIONS: DestinationFundingHub[] = [
  {
    name: 'India',
    code: 'IND',
    flagUrl: FLAG_MAP.IND,
    bannerUrl: CURATED_BANNERS.IND,
    opportunitiesCount: 13,
    tagline: 'State RTF/MTF, Central Schemes & Premier Corporate Grants',
    coverageHighlight: 'Up to 100% Fee Reimbursement + ₹70,000/mo (PMRF)',
    topProviders: ['Govt of Andhra Pradesh', 'Ministry of Education', 'DST', 'Reliance Foundation'],
    keySchemes: 'AP Jagananna Vidya & Vasathi Deevena, PMRF, NSP CSSS, AICTE, Reliance, HDFC',
  },
  {
    name: 'United States',
    code: 'USA',
    flagUrl: FLAG_MAP.USA,
    bannerUrl: CURATED_BANNERS.USA,
    opportunitiesCount: 4,
    tagline: 'Need-Blind Aid, Prestigious Fellowships & University Grants',
    coverageHighlight: '$50,000 – $80,000 / yr (Full Tuition & Living Stipend)',
    topProviders: ['USIEF / Fulbright', 'Stanford University', 'MIT', 'Inlaks Foundation'],
    keySchemes: 'Fulbright-Nehru, Knight-Hennessy, MIT Presidential, Inlaks Shivdasani',
  },
  {
    name: 'United Kingdom',
    code: 'GBR',
    flagUrl: FLAG_MAP.GBR,
    bannerUrl: CURATED_BANNERS.GBR,
    opportunitiesCount: 5,
    tagline: 'Government Leadership Awards & Oxford / Cambridge Endowments',
    coverageHighlight: '£15,000 – Full Tuition, Flights & Monthly Living Allowance',
    topProviders: ['FCDO UK', 'Commonwealth Commission', 'Rhodes Trust', 'British Council'],
    keySchemes: 'Chevening, Commonwealth Master\'s, Rhodes Oxford, British Council IELTS, GREAT',
  },
  {
    name: 'Australia',
    code: 'AUS',
    flagUrl: FLAG_MAP.AUS,
    bannerUrl: CURATED_BANNERS.AUS,
    opportunitiesCount: 3,
    tagline: 'DFAT Bilateral Honors & Group of Eight Research Grants',
    coverageHighlight: 'AUD $35,000 – $110,000 (Full Research Stipend & Health)',
    topProviders: ['DFAT Australia', 'Uni of Melbourne', 'Uni of Sydney'],
    keySchemes: 'Australia Awards (DFAT), Melbourne Research Scholarship, Sydney Int\'l Award',
  },
  {
    name: 'Germany',
    code: 'DEU',
    flagUrl: FLAG_MAP.DEU,
    bannerUrl: CURATED_BANNERS.DEU,
    opportunitiesCount: 3,
    tagline: 'Public University Grants, DAAD Stipends & Civil Foundations',
    coverageHighlight: 'Tuition-Free + €934 – €1,200/mo Stipend, Travel & Insurance',
    topProviders: ['DAAD Federal Ministry', 'Heinrich Böll Foundation'],
    keySchemes: 'DAAD EPOS Postgraduate, DAAD Master Studies, Heinrich Böll International',
  },
  {
    name: 'Canada',
    code: 'CAN',
    flagUrl: FLAG_MAP.CAN,
    bannerUrl: CURATED_BANNERS.CAN,
    opportunitiesCount: 3,
    tagline: 'Vanier Federal Honours, Trillium & U of Toronto Awards',
    coverageHighlight: 'CAD $20,000 – $50,000 / yr (Doctoral & UG Merit Honors)',
    topProviders: ['Govt of Canada (Tri-Agency)', 'Gov of Ontario', 'University of Toronto'],
    keySchemes: 'Vanier Canada CGS, Ontario Trillium (OTS), U of Toronto Scholar Award',
  },
];

export const DestinationFundingCards: React.FC<DestinationFundingCardsProps> = ({
  selectedCountry,
  onSelectCountry,
  onOpenCountryPage,
  countryCounts,
}) => {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Visual Reference A Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.15rem',
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
            <span>2026 Higher Education Funding Guide • Destination Hubs</span>
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
            Global Funding & Scholarship Hubs
          </h2>
          <p style={{ margin: '0.2rem 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Explore verified tuition waivers, living stipends, and research fellowships across 6 destination countries.
          </p>
        </div>

        {selectedCountry && selectedCountry !== 'ALL' && (
          <button
            onClick={() => onSelectCountry('')}
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

      {/* 6-Country Funding Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {DESTINATIONS.map((dest) => {
          const isSelected =
            selectedCountry === dest.name ||
            (selectedCountry === 'United States' && dest.code === 'USA') ||
            (selectedCountry === 'United Kingdom' && dest.code === 'GBR');

          const actualCount = countryCounts?.[dest.name] ?? dest.opportunitiesCount;

          return (
            <div
              key={dest.code}
              id={`funding-card-${dest.code.toLowerCase()}`}
              onClick={() => {
                if (onOpenCountryPage) {
                  onOpenCountryPage(dest.name);
                } else {
                  onSelectCountry(isSelected ? '' : dest.name);
                }
              }}
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
              {/* Destination Hero Photographic Banner */}
              <div
                style={{
                  height: '145px',
                  position: 'relative',
                  backgroundImage: `url(${dest.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: dest.code === 'IND' ? 'center 22%' : 'center',
                  backgroundColor: '#1E293B',
                }}
              >
                {/* Contrast scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(15,23,42,0.38) 0%, rgba(15,23,42,0.1) 32%, rgba(15,23,42,0.7) 68%, rgba(15,23,42,0.96) 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Country Flag & Code Badge */}
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
                    src={dest.flagUrl}
                    alt={`${dest.name} flag`}
                    style={{
                      width: '18px',
                      height: '13px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ letterSpacing: '0.04em' }}>{dest.code}</span>
                </div>

                {/* Opportunity Count Badge */}
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
                  {actualCount} Opportunities
                </div>

                {/* High Contrast Country Title & Tagline */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '0.85rem',
                    right: '0.85rem',
                    zIndex: 2,
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0,
                      letterSpacing: '-0.015em',
                      textShadow: '0 2px 6px rgba(0,0,0,0.8)',
                    }}
                  >
                    {dest.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: '#E2E8F0',
                      margin: '0.15rem 0 0 0',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                    }}
                  >
                    {dest.tagline}
                  </p>
                </div>
              </div>

              {/* Card Body with Key Funding Metrics */}
              <div
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  flex: 1,
                }}
              >
                {/* Coverage metric */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    background: '#F8FAFC',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <Award size={15} color="#5B4FE9" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                      Award Coverage
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3, display: 'block' }}>
                      {dest.coverageHighlight}
                    </span>
                  </div>
                </div>

                {/* Key Schemes */}
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'block', marginBottom: '0.2rem' }}>
                    Key Flagship Schemes
                  </span>
                  <p style={{ fontSize: '0.78rem', color: '#334155', margin: 0, lineHeight: 1.35, fontWeight: 500 }}>
                    {dest.keySchemes}
                  </p>
                </div>

                {/* Action Button */}
                <div style={{ marginTop: 'auto', paddingTop: '0.4rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenCountryPage) {
                        onOpenCountryPage(dest.name);
                      } else {
                        onSelectCountry(isSelected ? '' : dest.name);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      background: '#5B4FE9',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 5px rgba(91, 79, 233, 0.22)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#4338CA';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#5B4FE9';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>View All {actualCount} Scholarships in {dest.name}</span>
                    <ArrowRight size={13} />
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

