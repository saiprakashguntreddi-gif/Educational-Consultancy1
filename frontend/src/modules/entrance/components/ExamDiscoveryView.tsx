import React, { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { EntranceExamRecord, ExamCategoryGroup } from '../entrance.types';
import { EntranceService } from '../services/entrance.service';
import { ExamCategoriesDropdown } from './ExamCategoriesDropdown';

// Filter options: Exactly the 7 main categories + All Exams
const CATEGORY_OPTIONS = [
  { label: 'All Exams', value: 'ALL' },
  { label: 'Undergraduate', value: 'UNDERGRADUATE' },
  { label: 'Engineering & Tech', value: 'ENGINEERING_TECHNOLOGY' },
  { label: 'Postgraduate', value: 'POSTGRADUATE' },
  { label: 'MBA & Management', value: 'MBA_MANAGEMENT' },
  { label: 'Study Abroad', value: 'STUDY_ABROAD' },
  { label: 'Language Proficiency', value: 'LANGUAGE_PROFICIENCY' },
  { label: 'Design & Architecture', value: 'DESIGN_ARCHITECTURE' },
];

interface ExamDiscoveryViewProps {
  exams: EntranceExamRecord[];
  onSelectExam: (exam: EntranceExamRecord) => void;
  onAddToPlan: (exam: EntranceExamRecord) => void;
  onTakeMockTest: (exam: EntranceExamRecord) => void;
  isLoading: boolean;
  categories?: ExamCategoryGroup[];
}

export const ExamDiscoveryView: React.FC<ExamDiscoveryViewProps> = ({
  exams,
  onSelectExam,
  onAddToPlan,
  onTakeMockTest,
  isLoading: _isLoading,
  categories: initialCategories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDestination, setSelectedDestination] = useState<string>('ALL');
  const [categoryGroups, setCategoryGroups] = useState<ExamCategoryGroup[]>(initialCategories || []);

  // Fetch category hierarchy from API
  useEffect(() => {
    let isMounted = true;
    if (!initialCategories || initialCategories.length === 0) {
      EntranceService.getCategories()
        .then((res) => {
          if (isMounted && res.success && Array.isArray(res.data)) {
            setCategoryGroups(res.data);
          }
        })
        .catch(() => {
          // Handled gracefully inside dropdown
        });
    }
    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  const safeExams = Array.isArray(exams) ? exams : [];

  // Extract unique destinations across all exams
  const availableDestinations = useMemo(() => {
    const set = new Set<string>();
    safeExams.forEach((exam) => {
      exam?.destinations?.forEach((dest) => set.add(dest));
    });
    return Array.from(set).sort();
  }, [safeExams]);

  return (
    <div id="exam-discovery-container">
      {/* Search and Filters Toolbar */}
      <div
        id="exam-discovery-toolbar"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Main Search Toolbar (Desktop: single row; Mobile: stacked) */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Search size={16} />
              </div>
              <input
                id="exam-search-input"
                type="text"
                placeholder="Search exams by name, code, or format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '42px',
                  padding: '0 1rem 0 2.3rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
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
            </div>

            {/* Destination Dropdown */}
            <div style={{ minWidth: '220px', flex: '0 1 240px' }}>
              <select
                id="exam-destination-filter"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  height: '42px',
                  padding: '0 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  color: '#172D53',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer',
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
              >
                <option value="ALL">All Study Destinations</option>
                {availableDestinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Chips (Single row on desktop with horizontal scroll) */}
          <div
            id="category-filter-chips-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: '2px',
              whiteSpace: 'nowrap',
            }}
          >
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  id={`filter-cat-${cat.value.toLowerCase()}`}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setTimeout(() => {
                      if (cat.value === 'ALL') {
                        const section = document.getElementById('exam-categories-dropdown-section');
                        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        const catId = cat.value.toLowerCase();
                        const el = document.getElementById(`category-wrapper-${catId}`) ||
                                   document.getElementById(`exam-card-${catId}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }
                    }, 120);
                  }}
                  style={{
                    background: isSelected ? '#FF9800' : '#EDF2F7',
                    color: isSelected ? '#FFFFFF' : '#334E68',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.42rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#D9E2EC';
                      e.currentTarget.style.color = '#172D53';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#EDF2F7';
                      e.currentTarget.style.color = '#334E68';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Clean Modern Exam Categories Accordion System */}
      <ExamCategoriesDropdown
        categories={categoryGroups}
        allExams={safeExams}
        onSelectExam={onSelectExam}
        onAddToPlan={onAddToPlan}
        onTakeMockTest={onTakeMockTest}
        activeCategoryFilter={selectedCategory}
        onCategoryFilterChange={(catId) => {
          const match = CATEGORY_OPTIONS.find((c) => c.value.toLowerCase() === catId.toLowerCase());
          if (match) setSelectedCategory(match.value);
        }}
      />
    </div>
  );
};
