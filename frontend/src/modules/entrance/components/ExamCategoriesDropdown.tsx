import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  PlayCircle,
  Clock,
  Search,
  Award,
  Bookmark,
} from 'lucide-react';
import { EntranceExamRecord, ExamCategoryGroup } from '../entrance.types';
import { ExamLogo } from './ExamLogo';

export interface ExamCategoriesDropdownProps {
  categories?: ExamCategoryGroup[];
  allExams: EntranceExamRecord[];
  onSelectExam: (exam: EntranceExamRecord) => void;
  onAddToPlan?: (exam: EntranceExamRecord) => void;
  onTakeMockTest?: (exam: EntranceExamRecord) => void;
  selectedExamId?: string | null;
  activeCategoryFilter?: string | null;
  onCategoryFilterChange?: (categoryId: string) => void;
}

// Fallback hierarchy specification matching the exact 7 main categories
export const DEFAULT_CATEGORY_HIERARCHY = [
  {
    id: 'undergraduate',
    name: 'Undergraduate Entrance Exams',
    description: 'Standardized and curriculum-based admissions exams for undergraduate and bachelor degree programs.',
    examCodes: [
      'SAT',
      'ACT',
      'JEE_MAIN',
      'CUET_UG',
      'GAOKAO',
      'ENEM',
      'BITSAT',
      'VITEEE',
      'COMEDK_UGET',
      'KCET',
      'WBJEE',
      'MHT_CET',
      'IPMAT',
      'NATA',
      'UCEED',
      'NID_DAT',
      'NIFT',
    ],
  },
  {
    id: 'engineering_technology',
    name: 'Engineering & Technology Exams',
    description: 'Competitive entrance assessments for premier engineering, technology, and applied sciences institutes.',
    examCodes: [
      'JEE_MAIN',
      'JEE_ADVANCED',
      'GATE',
      'BITSAT',
      'VITEEE',
      'COMEDK_UGET',
      'KCET',
      'WBJEE',
      'MHT_CET',
    ],
  },
  {
    id: 'postgraduate',
    name: 'Postgraduate Entrance Exams',
    description: 'Graduate level qualification exams for master degrees, research programs, and M.Sc./MCA pathways.',
    examCodes: [
      'GRE',
      'GATE',
      'CUET_PG',
      'IIT_JAM',
      'NIMCET',
      'CEED',
    ],
  },
  {
    id: 'mba_management',
    name: 'MBA & Management Exams',
    description: 'Management aptitude and business school admissions tests for MBA, PGDM, and executive master programs.',
    examCodes: [
      'GMAT',
      'CAT',
      'XAT',
      'MAT',
      'CMAT',
      'NMAT',
      'IPMAT',
      'GRE',
    ],
  },
  {
    id: 'study_abroad',
    name: 'Study Abroad Exams',
    description: 'Globally recognized standardized testing for international university applications and visas.',
    examCodes: [
      'SAT',
      'ACT',
      'GRE',
      'GMAT',
      'IELTS',
      'TOEFL',
      'PTE',
      'DUOLINGO',
    ],
  },
  {
    id: 'language_proficiency',
    name: 'Language Proficiency Exams',
    description: 'International standardized language certification exams for academic, work, and immigration credentials.',
    examCodes: [
      'IELTS',
      'TOEFL',
      'PTE',
      'DUOLINGO',
      'TOEIC',
      'OET',
      'JLPT',
      'TOPIK',
      'DELE',
      'DELF',
      'GOETHE',
      'HSK',
    ],
  },
  {
    id: 'design_architecture',
    name: 'Design & Architecture Exams',
    description: 'Aptitude and creative design entrance tests for premier design, architecture, and fashion technology schools.',
    examCodes: [
      'NID_DAT',
      'UCEED',
      'CEED',
      'NATA',
      'NIFT',
    ],
  },
];

// Display names for exam codes
const EXAM_DISPLAY_NAMES: Record<string, string> = {
  SAT: 'SAT (Scholastic Assessment Test)',
  ACT: 'ACT (American College Testing)',
  JEE_MAIN: 'JEE Main (Joint Entrance Examination)',
  CUET_UG: 'CUET UG (Common University Entrance Test Undergraduate)',
  GAOKAO: 'Gaokao (National College Entrance Examination)',
  ENEM: 'ENEM (Exame Nacional do Ensino Médio)',
  JEE_ADVANCED: 'JEE Advanced',
  GATE: 'GATE (Graduate Aptitude Test in Engineering)',
  BITSAT: 'BITSAT (BITS Admission Test)',
  VITEEE: 'VITEEE (VIT Engineering Entrance Examination)',
  COMEDK_UGET: 'COMEDK UGET (Consortium of Medical, Engineering and Dental Colleges of Karnataka)',
  KCET: 'KCET (Karnataka Common Entrance Test)',
  WBJEE: 'WBJEE (West Bengal Joint Entrance Examination)',
  MHT_CET: 'MHT CET (Maharashtra Common Entrance Test)',
  IPMAT: 'IPMAT (Integrated Programme in Management Aptitude Test)',
  GRE: 'GRE General Test (Graduate Record Examination)',
  CUET_PG: 'CUET PG (Common University Entrance Test Postgraduate)',
  IIT_JAM: 'IIT JAM (Joint Admission test for Masters)',
  NIMCET: 'NIMCET (NIT MCA Common Entrance Test)',
  GMAT: 'GMAT Focus Edition',
  CAT: 'CAT (Common Admission Test)',
  XAT: 'XAT (Xavier Aptitude Test)',
  MAT: 'MAT (Management Aptitude Test)',
  CMAT: 'CMAT (Common Management Admission Test)',
  NMAT: 'NMAT by GMAC',
  IELTS: 'IELTS Academic',
  TOEFL: 'TOEFL iBT',
  PTE: 'PTE Academic',
  DUOLINGO: 'Duolingo English Test (DET)',
  TOEIC: 'TOEIC (Test of English for International Communication)',
  OET: 'OET (Occupational English Test)',
  JLPT: 'JLPT (Japanese-Language Proficiency Test)',
  TOPIK: 'TOPIK (Test of Proficiency in Korean)',
  DELE: 'DELE (Diplomas de Español como Lengua Extranjera)',
  DELF: 'DELF / DALF (Diplôme d\'Études en Langue Française)',
  GOETHE: 'Goethe-Zertifikat (German Language Examination)',
  HSK: 'HSK (Hanyu Shuiping Kaoshi - Chinese Proficiency Test)',
  NID_DAT: 'NID DAT (Design Aptitude Test)',
  UCEED: 'UCEED (Undergraduate Common Entrance Examination for Design)',
  CEED: 'CEED (Common Entrance Examination for Design)',
  NATA: 'NATA (National Aptitude Test in Architecture)',
  NIFT: 'NIFT Entrance Exam',
  NEET: 'NEET UG (National Eligibility cum Entrance Test)',
};

/**
 * Formats an exam code and raw name into official title format:
 * e.g. "SAT — Scholastic Assessment Test"
 */
export const formatExamDisplayName = (code: string, rawName: string): string => {
  if (!rawName && !code) return 'Entrance Exam';
  const nameToUse = rawName || code;

  // Extract parentheses if present: "SAT (Scholastic Assessment Test)" -> "SAT — Scholastic Assessment Test"
  const match = nameToUse.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (match) {
    const short = match[1].trim();
    const full = match[2].trim();
    return `${short} — ${full}`;
  }
  if (nameToUse.includes('—')) return nameToUse;
  if (nameToUse.includes(' - ')) return nameToUse.replace(' - ', ' — ');

  const officialNames: Record<string, string> = {
    SAT: 'Scholastic Assessment Test',
    ACT: 'American College Testing',
    JEE_MAIN: 'Joint Entrance Examination Main',
    JEE_ADVANCED: 'Joint Entrance Examination Advanced',
    CUET_UG: 'Common University Entrance Test Undergraduate',
    CUET_PG: 'Common University Entrance Test Postgraduate',
    GAOKAO: 'National College Entrance Examination',
    ENEM: 'Exame Nacional do Ensino Médio',
    BITSAT: 'BITS Admission Test',
    VITEEE: 'VIT Engineering Entrance Examination',
    COMEDK_UGET: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka',
    KCET: 'Karnataka Common Entrance Test',
    WBJEE: 'West Bengal Joint Entrance Examination',
    MHT_CET: 'Maharashtra Common Entrance Test',
    IPMAT: 'Integrated Programme in Management Aptitude Test',
    GATE: 'Graduate Aptitude Test in Engineering',
    GRE: 'Graduate Record Examination',
    GMAT: 'Graduate Management Admission Test Focus Edition',
    CAT: 'Common Admission Test',
    XAT: 'Xavier Aptitude Test',
    MAT: 'Management Aptitude Test',
    CMAT: 'Common Management Admission Test',
    NMAT: 'NMAT by GMAC',
    IELTS: 'International English Language Testing System',
    TOEFL: 'Test of English as a Foreign Language',
    PTE: 'Pearson Test of English Academic',
    DUOLINGO: 'Duolingo English Test',
    NEET: 'National Eligibility cum Entrance Test',
    UCEED: 'Undergraduate Common Entrance Examination for Design',
    CEED: 'Common Entrance Examination for Design',
    NATA: 'National Aptitude Test in Architecture',
    NIFT: 'National Institute of Fashion Technology Entrance Exam',
    NID_DAT: 'Design Aptitude Test',
    IIT_JAM: 'Joint Admission test for Masters',
    NIMCET: 'NIT MCA Common Entrance Test',
    NDA: 'National Defence Academy Examination',
    CDS: 'Combined Defence Services Examination',
    AFCAT: 'Air Force Common Admission Test',
    CAPF: 'Central Armed Police Forces Examination',
    UPSC_CSE: 'Civil Services Examination',
    SSC_CGL: 'Combined Graduate Level Examination',
    IBPS_PO: 'Probationary Officer Examination',
    SBI_PO: 'State Bank of India PO Examination',
    RRB_NTPC: 'Non-Technical Popular Categories Examination',
    NCHM_JEE: 'National Council for Hotel Management Joint Entrance Exam',
    TOEIC: 'Test of English for International Communication',
    OET: 'Occupational English Test',
    JLPT: 'Japanese-Language Proficiency Test',
    TOPIK: 'Test of Proficiency in Korean',
    DELE: 'Diplomas de Español como Lengua Extranjera',
    DELF: 'Diplôme d\'Études en Langue Française',
    GOETHE: 'Goethe-Zertifikat German Examination',
    HSK: 'Hanyu Shuiping Kaoshi Chinese Proficiency Test',
  };

  const cleanCode = (code || '').replace(/_/g, ' ');
  const lookupKey = (code || '').toUpperCase();
  const matchedFull = officialNames[lookupKey];
  if (matchedFull) {
    return `${cleanCode} — ${matchedFull}`;
  }

  return nameToUse;
};

export const ExamCategoriesDropdown: React.FC<ExamCategoriesDropdownProps> = ({
  categories: initialCategories,
  allExams,
  onSelectExam,
  onAddToPlan,
  onTakeMockTest,
  selectedExamId,
  activeCategoryFilter,
  onCategoryFilterChange,
}) => {
  // Set of expanded category IDs - default to expanding the first 2 categories for high discovery
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['undergraduate', 'engineering_technology'])
  );

  // Search query within the category accordion
  const [filterQuery, setFilterQuery] = useState('');

  // Map unique exams by code for constant-time lookup
  const examByCodeMap = useMemo(() => {
    const map = new Map<string, EntranceExamRecord>();
    (allExams || []).forEach((exam) => {
      if (exam?.code) {
        map.set(exam.code, exam);
        map.set(exam.code.toUpperCase(), exam);
      }
    });
    return map;
  }, [allExams]);

  // Merge provided category data or construct from default hierarchy
  const resolvedCategories = useMemo(() => {
    return DEFAULT_CATEGORY_HIERARCHY.map((def) => {
      const serverCat = initialCategories?.find((c) => c.id === def.id);
      const codes = serverCat?.examCodes || def.examCodes;

      // Resolve each exam code to its unique single record
      const exams: EntranceExamRecord[] = [];
      codes.forEach((code) => {
        const found = examByCodeMap.get(code);
        if (found) {
          exams.push(found);
        } else {
          // Graceful fallback dummy record until exams finish loading
          exams.push({
            id: `temp-${code.toLowerCase()}`,
            code: code,
            name: EXAM_DISPLAY_NAMES[code] || code,
            category: 'UNDERGRADUATE' as any,
            description: 'Comprehensive entrance assessment and standardized college admission exam.',
            destinations: ['Global'],
            relevantStreams: ['All'],
            format: 'Standardized examination',
            sections: [],
            totalDurationMinutes: 120,
            scoreRange: 'Standard scale',
            scoringDetails: 'Official regulatory marking scheme',
            validity: '1 to 5 years',
            importantDates: [],
            officialWebsiteUrl: 'https://superconsciousness.internal',
            prepResources: [],
            recommendedBooks: [],
            testDayTips: [],
            hasMockTest: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });

      return {
        id: def.id,
        name: def.name,
        description: serverCat?.description || def.description,
        examCodes: codes,
        exams,
      };
    });
  }, [initialCategories, examByCodeMap]);

  // Filter categories and subcategories based on user search query
  const filteredCategoryList = useMemo(() => {
    if (!filterQuery.trim()) {
      return resolvedCategories;
    }
    const q = filterQuery.toLowerCase().trim();

    return resolvedCategories
      .map((cat) => {
        const catMatches = cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
        const matchingExams = cat.exams.filter((exam) => {
          return (
            exam.name.toLowerCase().includes(q) ||
            exam.code.toLowerCase().includes(q) ||
            exam.description.toLowerCase().includes(q) ||
            exam.destinations.some((d) => d.toLowerCase().includes(q))
          );
        });

        if (catMatches || matchingExams.length > 0) {
          return {
            ...cat,
            // If category matches, show all its exams; otherwise show matched exams
            exams: catMatches ? cat.exams : matchingExams,
            hasMatches: true,
          };
        }
        return null;
      })
      .filter(Boolean) as (typeof resolvedCategories[0] & { hasMatches?: boolean })[];
  }, [resolvedCategories, filterQuery]);

  // Auto-expand categories if search query is entered
  useEffect(() => {
    if (filterQuery.trim()) {
      const allMatchingIds = filteredCategoryList.map((c) => c.id);
      setExpandedIds(new Set(allMatchingIds));
    }
  }, [filterQuery, filteredCategoryList]);

  // If activeCategoryFilter changes from parent, isolate and auto-expand that category, and smoothly scroll to it
  useEffect(() => {
    if (activeCategoryFilter && activeCategoryFilter !== 'ALL') {
      const match = resolvedCategories.find(
        (c) => c.id.toLowerCase() === activeCategoryFilter.toLowerCase()
      );
      if (match) {
        // Expand ONLY the selected category to focus user attention
        setExpandedIds(new Set([match.id]));

        // Smoothly scroll down directly to this category so it appears right in view
        setTimeout(() => {
          const el = document.getElementById(`category-wrapper-${match.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    } else if (activeCategoryFilter === 'ALL') {
      // Default to expanding the first 2 for high discovery
      setExpandedIds(new Set(['undergraduate', 'engineering_technology']));
    }
  }, [activeCategoryFilter, resolvedCategories]);

  // Toggle single category
  const toggleCategory = (categoryId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });

    if (onCategoryFilterChange) {
      onCategoryFilterChange(categoryId);
    }
  };

  // Accurate count calculations: distinguish unique canonical exams from category listings
  const { uniqueExamCount, totalListingsCount } = useMemo(() => {
    const uniqueIds = new Set<string>();
    let listings = 0;
    resolvedCategories.forEach((cat) => {
      listings += cat.exams.length;
      cat.exams.forEach((exam) => {
        if (exam?.id) uniqueIds.add(exam.id);
        else if (exam?.code) uniqueIds.add(exam.code);
      });
    });
    return {
      uniqueExamCount: uniqueIds.size,
      totalListingsCount: listings,
    };
  }, [resolvedCategories]);

  // Expand all
  const handleExpandAll = () => {
    setExpandedIds(new Set(resolvedCategories.map((c) => c.id)));
  };

  // Collapse all
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  return (
    <div
      id="exam-categories-dropdown-section"
      style={{
        marginBottom: '2rem',
      }}
    >
      {/* Main Category Section Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2
          id="categories-section-heading"
          style={{
            margin: '0 0 0.35rem 0',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#172D53',
            letterSpacing: '-0.02em',
          }}
        >
          Explore Exam Categories
        </h2>
        <p
          id="categories-section-subtitle"
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '0.9rem',
            color: '#64748B',
            lineHeight: 1.5,
          }}
        >
          Discover entrance exams, eligibility requirements, and study opportunities.
        </p>

        {/* Compact Statistics Row */}
        <div
          id="category-statistics-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            id="badge-main-categories-count"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: '#F5F8FC',
              color: '#F57C00',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 152, 0, 0.25)',
            }}
          >
            {resolvedCategories.length} Main Categories
          </span>
          <span
            id="badge-unique-exam-records"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: '#F5F8FC',
              color: '#F57C00',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 152, 0, 0.25)',
            }}
          >
            {uniqueExamCount} Unique Exam Records
          </span>
          <span
            id="badge-total-category-listings"
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: '#F5F8FC',
              color: '#F57C00',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 152, 0, 0.25)',
            }}
          >
            {totalListingsCount} Total Category Listings
          </span>
        </div>
      </div>

      {/* Category Toolbar: Search + Expand/Collapse Actions */}
      <div
        id="category-toolbar-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
      >
        {/* Search Field */}
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <Search size={15} />
          </div>
          <input
            id="category-search-filter-input"
            type="text"
            placeholder="Filter categories or find an exam..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              height: '38px',
              padding: '0 0.75rem 0 2.2rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.86rem',
              color: '#172D53',
              backgroundColor: '#FFFFFF',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#FF9800';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 152, 0, 0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Expand / Collapse Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            id="categories-expand-all-btn"
            onClick={handleExpandAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              height: '38px',
              padding: '0 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#FF9800',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F8FC';
              e.currentTarget.style.borderColor = '#FF9800';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = 'rgba(255, 152, 0, 0.3)';
            }}
            title="Expand all categories"
          >
            <ChevronDown size={14} />
            <span>Expand All</span>
          </button>

          <button
            type="button"
            id="categories-collapse-all-btn"
            onClick={handleCollapseAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              height: '38px',
              padding: '0 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#64748B',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F8FC';
              e.currentTarget.style.color = '#172D53';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#64748B';
            }}
            title="Collapse all categories"
          >
            <ChevronUp size={14} />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Accordion Container for Exam Categories */}
      <div
        id="exam-categories-accordion"
        role="region"
        aria-label="Exam Categories Accordion"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {filteredCategoryList.map((category, index) => {
          const isExpanded = expandedIds.has(category.id);
          const examCount = category.exams.length;
          const isCurrentActiveFilter =
            activeCategoryFilter && activeCategoryFilter.toLowerCase() === category.id.toLowerCase();

          return (
            <div
              key={category.id}
              id={`category-wrapper-${category.id}`}
              style={{
                border: isCurrentActiveFilter
                  ? '2px solid #FF9800'
                  : isExpanded
                  ? '1.5px solid #FF9800'
                  : '1px solid #E2E8F0',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                boxShadow: isCurrentActiveFilter
                  ? '0 0 0 3px rgba(255, 152, 0, 0.15), 0 8px 24px -4px rgba(16, 42, 67, 0.12)'
                  : isExpanded
                  ? '0 4px 12px -2px rgba(255, 152, 0, 0.1)'
                  : 'none',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Category Header Row (Clickable Accordion Trigger) */}
              <button
                type="button"
                id={`category-header-${category.id}`}
                aria-expanded={isExpanded}
                aria-controls={`category-panel-${category.id}`}
                onClick={() => toggleCategory(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCategory(category.id);
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: isCurrentActiveFilter
                    ? 'linear-gradient(90deg, rgba(255, 152, 0, 0.08) 0%, #FFFFFF 100%)'
                    : isExpanded
                    ? 'linear-gradient(90deg, #F5F8FC 0%, #FFFFFF 100%)'
                    : '#FFFFFF',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded && !isCurrentActiveFilter) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded && !isCurrentActiveFilter) e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                {/* Left: Category Index, Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: '1 1 auto' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isCurrentActiveFilter ? '#FF9800' : isExpanded ? '#F57C00' : '#F1F5F9',
                      color: isCurrentActiveFilter || isExpanded ? '#FFFFFF' : '#172D53',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {index + 1}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: isCurrentActiveFilter ? '#F57C00' : isExpanded ? '#172D53' : '#172D53',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {category.name}
                      </span>

                      {/* Pill Badge showing total exams count */}
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '12px',
                          backgroundColor: isCurrentActiveFilter ? 'rgba(255, 152, 0, 0.15)' : isExpanded ? 'rgba(255, 152, 0, 0.1)' : '#F1F5F9',
                          color: isCurrentActiveFilter ? '#F57C00' : isExpanded ? '#F57C00' : '#64748B',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {examCount} {examCount === 1 ? 'Exam' : 'Exams'}
                      </span>

                      {isCurrentActiveFilter && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '12px',
                            backgroundColor: '#FF9800',
                            color: '#FFFFFF',
                            letterSpacing: '0.02em',
                          }}
                        >
                          Active Category
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        margin: '0.2rem 0 0 0',
                        fontSize: '0.82rem',
                        color: '#64748B',
                        lineHeight: 1.35,
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Right: Dropdown Arrow with Smooth Rotation Animation */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isExpanded ? 'rgba(255, 152, 0, 0.12)' : '#F8FAFC',
                    color: isExpanded ? '#FF9800' : '#64748B',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  <ChevronDown size={18} />
                </div>
              </button>

              {/* Collapsible Panel containing the Subcategory Exams */}
              {isExpanded && (
                <div
                  id={`category-panel-${category.id}`}
                  role="region"
                  aria-labelledby={`category-header-${category.id}`}
                  style={{
                    padding: '0.5rem 1.25rem 1.25rem 1.25rem',
                    backgroundColor: '#FAFAFC',
                    borderTop: '1px solid #EEF2F6',
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <div className="entrance-2col-grid">
                    {category.exams.map((exam) => {
                      const isSelected = selectedExamId === exam.id || selectedExamId === exam.code;
                      const displayName = formatExamDisplayName(exam.code, exam.name);

                      return (
                        <div
                          key={`${category.id}-${exam.code}`}
                          id={`exam-subcategory-item-${exam.code.toLowerCase()}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '1rem 1.15rem',
                            backgroundColor: isSelected ? '#F5F8FC' : '#FFFFFF',
                            border: isSelected ? '1.5px solid #FF9800' : '1px solid #E2E8F0',
                            borderRadius: '12px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                            cursor: 'pointer',
                          }}
                          onClick={() => onSelectExam(exam)}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#FF9800';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow =
                                '0 6px 14px -2px rgba(255, 152, 0, 0.12), 0 2px 6px -2px rgba(0, 0, 0, 0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#E2E8F0';
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04)';
                            }
                          }}
                        >
                          <div>
                            {/* Exam Header: Logo + Combined Name & Official Full Name + Official Website Link */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: '0.75rem',
                                marginBottom: '0.5rem',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flex: 1, minWidth: 0 }}>
                                <div style={{ flexShrink: 0 }}>
                                  <ExamLogo examCode={exam.code} size={22} />
                                </div>
                                <h4
                                  style={{
                                    margin: 0,
                                    fontSize: '0.94rem',
                                    fontWeight: 700,
                                    color: '#172D53',
                                    lineHeight: 1.35,
                                    wordBreak: 'break-word',
                                  }}
                                >
                                  {displayName}
                                </h4>
                              </div>

                              {exam.officialWebsiteUrl && (
                                <a
                                  href={exam.officialWebsiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '6px',
                                    color: '#F57C00',
                                    backgroundColor: 'rgba(255, 152, 0, 0.08)',
                                    border: '1px solid rgba(255, 152, 0, 0.3)',
                                    textDecoration: 'none',
                                    fontSize: '0.74rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FF9800';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 152, 0, 0.08)';
                                    e.currentTarget.style.color = '#F57C00';
                                  }}
                                  title={`Open official ${exam.code} website in new tab`}
                                >
                                  <span>Official Website</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>

                            {/* Score range & duration snippet */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.76rem',
                                color: '#64748B',
                                marginBottom: '0.65rem',
                                flexWrap: 'wrap',
                              }}
                            >
                              {exam.totalDurationMinutes > 0 && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={13} color="#FF9800" />
                                  {exam.totalDurationMinutes} mins
                                </span>
                              )}
                              {exam.scoreRange && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Award size={13} color="#FF9800" />
                                  {exam.scoreRange}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Link Footer: View Details, Single Mock Test Button, Save to My Plan */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '0.6rem',
                              borderTop: '1px solid #F1F5F9',
                              marginTop: '0.35rem',
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectExam(exam);
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: 'none',
                                border: 'none',
                                color: '#FF9800',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              <BookOpen size={14} />
                              <span>View Details</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {exam.hasMockTest && onTakeMockTest && (
                                <button
                                  type="button"
                                  id={`mock-test-btn-${exam.code.toLowerCase()}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onTakeMockTest(exam);
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                    border: '1px solid rgba(255, 152, 0, 0.4)',
                                    color: '#F57C00',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 152, 0, 0.2)';
                                    e.currentTarget.style.borderColor = '#FF9800';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 152, 0, 0.4)';
                                  }}
                                  title="Take diagnostic timed practice test"
                                >
                                  <PlayCircle size={13} />
                                  <span>Mock Test</span>
                                </button>
                              )}

                              {onAddToPlan && (
                                <button
                                  type="button"
                                  id={`plan-btn-${exam.code.toLowerCase()}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToPlan(exam);
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#FF9800',
                                    border: '1px solid #FF9800',
                                    color: '#FFFFFF',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F57C00')}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FF9800')}
                                  title="Save exam to personal plan"
                                >
                                  <Bookmark size={13} />
                                  <span>{exam.studentPlanStatus ? 'In Plan' : '+ Plan'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .entrance-2col-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 0.5rem;
        }
        @media (max-width: 860px) {
          .entrance-2col-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
