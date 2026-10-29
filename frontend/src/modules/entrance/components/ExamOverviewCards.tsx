import React from 'react';
import { Bookmark, Clock, CheckCircle2, Award, CalendarCheck } from 'lucide-react';
import { StudentExamPlanRecord, StudentMockAttemptRecord } from '../entrance.types';

interface ExamOverviewCardsProps {
  planItems: StudentExamPlanRecord[];
  mockAttempts: StudentMockAttemptRecord[];
  catalogCount: number;
  onSelectTab?: (tab: 'catalog' | 'plan' | 'mocks') => void;
}

export const ExamOverviewCards: React.FC<ExamOverviewCardsProps> = ({
  planItems,
  mockAttempts,
  catalogCount,
  onSelectTab,
}) => {
  const safePlans = Array.isArray(planItems) ? planItems : [];
  const safeAttempts = Array.isArray(mockAttempts) ? mockAttempts : [];

  const plannedCount = safePlans.filter((p) => p?.status === 'PLANNED').length;
  const preparingCount = safePlans.filter((p) => p?.status === 'PREPARING').length;
  const registeredCount = safePlans.filter((p) => p?.status === 'REGISTERED').length;
  const completedCount = safePlans.filter((p) => p?.status === 'COMPLETED').length;

  const avgScore =
    safeAttempts.length > 0
      ? Math.round(
          safeAttempts.reduce((acc, curr) => acc + (curr?.percentage || 0), 0) / safeAttempts.length
        )
      : null;

  const cards = [
    {
      id: 'my-exam-plan',
      label: 'MY EXAM PLAN',
      value: safePlans.length,
      description: `of ${catalogCount} verified exams`,
      icon: Bookmark,
      color: '#FF9800',
      bgColor: 'rgba(255, 152, 0, 0.12)',
      targetTab: 'plan' as const,
    },
    {
      id: 'active-prep',
      label: 'ACTIVE PREP',
      value: preparingCount,
      description: `in preparation (${plannedCount} planned)`,
      icon: Clock,
      color: '#F57C00',
      bgColor: 'rgba(8, 79, 94, 0.1)',
      targetTab: 'plan' as const,
    },
    {
      id: 'registered',
      label: 'REGISTERED',
      value: registeredCount,
      description: 'official test date booked',
      icon: CalendarCheck,
      color: '#172D53',
      bgColor: '#EBF3F8',
      targetTab: 'plan' as const,
    },
    {
      id: 'completed',
      label: 'COMPLETED',
      value: completedCount,
      description: 'achieved exam scores',
      icon: CheckCircle2,
      color: '#B7791F',
      bgColor: 'rgba(255, 181, 71, 0.18)',
      targetTab: 'plan' as const,
    },
    {
      id: 'diagnostic-mocks',
      label: 'MOCK TESTS',
      value: safeAttempts.length,
      description: avgScore !== null ? `Avg. ${avgScore}% accuracy` : 'No mock tests taken yet',
      icon: Award,
      color: '#F57C00',
      bgColor: 'rgba(255, 152, 0, 0.2)',
      targetTab: 'mocks' as const,
    },
  ];

  return (
    <div
      id="entrance-overview-cards"
      className="entrance-overview-cards-grid"
    >
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isClickable = Boolean(onSelectTab);

        return (
          <div
            key={card.id}
            id={`overview-card-${card.id}`}
            onClick={() => {
              if (onSelectTab) {
                onSelectTab(card.targetTab);
              }
            }}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={(e) => {
              if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelectTab?.(card.targetTab);
              }
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #D9E2EC',
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              boxShadow: '0 1px 3px rgba(16, 42, 67, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '102px',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'all 0.18s ease',
              position: 'relative',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF9800';
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(255, 152, 0, 0.14)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D9E2EC';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(16, 42, 67, 0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Top row: Label and Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {card.label}
              </span>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  background: card.bgColor,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconComponent size={16} strokeWidth={2.2} />
              </div>
            </div>

            {/* Bottom block: Prominent Value & Description */}
            <div>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#172D53',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#64748B',
                  marginTop: '0.25rem',
                  lineHeight: 1.35,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={card.description}
              >
                {card.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
