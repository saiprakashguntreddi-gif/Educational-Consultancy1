import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  Award,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { EntranceService } from '../services/entrance.service';
import {
  EntranceExamRecord,
  StudentExamPlanRecord,
  StudentMockAttemptRecord,
  MockTestSummary,
  UpdateExamPlanInput,
  ExamPlanStatus,
} from '../entrance.types';
import { ExamOverviewCards } from './ExamOverviewCards';
import { ExamDiscoveryView } from './ExamDiscoveryView';
import { ExamDetailModal } from './ExamDetailModal';
import { MyExamPlanCard } from './MyExamPlanCard';
import { TimedMockTestModal } from './TimedMockTestModal';
import { ExamLogo } from './ExamLogo';

interface EntranceExamsViewProps {
  onBackToDashboard?: () => void;
}

const EntranceExamsViewInner: React.FC<EntranceExamsViewProps> = ({ onBackToDashboard }) => {
  const { user } = useAuth();

  // Navigation Tabs: 'catalog' | 'plan' | 'mocks'
  const [activeTab, setActiveTab] = useState<'catalog' | 'plan' | 'mocks'>('catalog');

  // State
  const [exams, setExams] = useState<EntranceExamRecord[]>([]);
  const [planItems, setPlanItems] = useState<StudentExamPlanRecord[]>([]);
  const [mockAttempts, setMockAttempts] = useState<StudentMockAttemptRecord[]>([]);
  const [availableMocks, setAvailableMocks] = useState<{ examName: string; examCode: string; mock: MockTestSummary }[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals
  const [selectedExamForDetail, setSelectedExamForDetail] = useState<EntranceExamRecord | null>(null);
  const [activeMockTestId, setActiveMockTestId] = useState<string | null>(null);

  // Add to plan prompt modal
  const [examToAdd, setExamToAdd] = useState<EntranceExamRecord | null>(null);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [modalValidationErrors, setModalValidationErrors] = useState<{ [key: string]: string }>({});
  const [addPlanForm, setAddPlanForm] = useState<{
    status: ExamPlanStatus;
    targetCollege: string;
    targetCourse: string;
    targetDate: string;
    targetScore: string;
    notes: string;
  }>({
    status: 'PLANNED',
    targetCollege: '',
    targetCourse: '',
    targetDate: '',
    targetScore: '',
    notes: '',
  });

  // Load all entrance exam data
  const loadEntranceData = async () => {
    setIsLoading(true);
    setFeedback(null);

    // 1. Fetch Exam Catalog
    try {
      const catalogRes = await EntranceService.getCatalog();
      if (catalogRes.success && Array.isArray(catalogRes.data)) {
        setExams(catalogRes.data);

        // Fetch mock tests for exams with mock tests in parallel
        const mockExams = catalogRes.data.filter((e) => e.hasMockTest);
        const mockPromises = mockExams.map(async (exam) => {
          try {
            const res = await EntranceService.getMockTestsForExam(exam.id);
            if (res.success && Array.isArray(res.data)) {
              return res.data.map((m) => ({
                examName: exam.name,
                examCode: exam.code,
                mock: m,
              }));
            }
          } catch {
            // Soft fail individual mock test fetch
          }
          return [];
        });
        const mockResults = await Promise.all(mockPromises);
        setAvailableMocks(mockResults.flat());
      }
    } catch (err: any) {
      console.warn('Failed to load exams catalog:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to load entrance exam catalogue.',
      });
    }

    // 2. Fetch Student Plan
    try {
      const planRes = await EntranceService.getMyPlan();
      if (planRes.success && planRes.data) {
        const raw = planRes.data;
        const items: StudentExamPlanRecord[] = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any).items)
          ? (raw as any).items
          : [];
        setPlanItems(items);
      }
    } catch (err: any) {
      // Soft ignore if user does not have an active plan or profile yet
      console.warn('Student exam plan not available:', err);
    }

    // 3. Fetch Mock Test Attempts
    try {
      const attemptsRes = await EntranceService.getMyMockAttempts();
      if (attemptsRes.success && Array.isArray(attemptsRes.data)) {
        setMockAttempts(attemptsRes.data);
      }
    } catch (err: any) {
      console.warn('Mock attempts history not available:', err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadEntranceData();
  }, []);

  // Handle Add to Plan
  const handleInitiateAddToPlan = (exam: EntranceExamRecord) => {
    if (!user) {
      setFeedback({
        type: 'error',
        message: 'Please sign in to your student account to save exams to your personal plan.',
      });
      return;
    }

    const existing = planItems.find((p) => p.examId === exam.id);
    if (existing) {
      // If already in plan, switch to plan tab and highlight
      setActiveTab('plan');
      setFeedback({
        type: 'success',
        message: `${exam.name} is already in your personal plan. You can view or update your target college, course, and scores below.`,
      });
      return;
    }

    setModalValidationErrors({});
    setExamToAdd(exam);
    setAddPlanForm({
      status: 'PLANNED',
      targetCollege: '',
      targetCourse: '',
      targetDate: '',
      targetScore: '',
      notes: '',
    });
  };

  const handleConfirmAddToPlan = async () => {
    if (!examToAdd) return;

    if (!user) {
      setModalValidationErrors({
        general: 'Please log in to your student account to save this exam plan.',
      });
      return;
    }

    // Validate required fields
    const errors: { [key: string]: string } = {};
    if (!addPlanForm.targetCollege.trim()) {
      errors.targetCollege = 'Target College / University is required.';
    }
    if (!addPlanForm.targetCourse.trim()) {
      errors.targetCourse = 'Target Degree / Course is required.';
    }
    if (!addPlanForm.status) {
      errors.status = 'Status is required.';
    }

    if (Object.keys(errors).length > 0) {
      setModalValidationErrors(errors);
      return;
    }

    setIsSavingPlan(true);
    setModalValidationErrors({});

    try {
      const res = await EntranceService.savePlanItem({
        examId: examToAdd.id,
        status: addPlanForm.status,
        targetCollege: addPlanForm.targetCollege.trim(),
        targetCourse: addPlanForm.targetCourse.trim(),
        targetDate: addPlanForm.targetDate || undefined,
        targetScore: addPlanForm.targetScore.trim() || undefined,
        notes: addPlanForm.notes.trim() || undefined,
      });

      if (res.success && res.data) {
        setFeedback({
          type: 'success',
          message: `🎉 Successfully saved ${examToAdd.name} for ${addPlanForm.targetCollege.trim()} to your personal exam plan.`,
        });
        setExamToAdd(null);
        await loadEntranceData();
        setActiveTab('plan');
      } else {
        setModalValidationErrors({
          general: res.message || 'Failed to save exam to plan. Please check your connection and retry.',
        });
      }
    } catch (err: any) {
      setModalValidationErrors({
        general: err.message || 'An error occurred while saving the exam to your plan.',
      });
    } finally {
      setIsSavingPlan(false);
    }
  };

  // Handle Update Plan Item
  const handleUpdatePlanItem = async (id: string, data: UpdateExamPlanInput): Promise<boolean> => {
    try {
      const res = await EntranceService.updatePlanItem(id, data);
      if (res.success && res.data) {
        setFeedback({
          type: 'success',
          message: 'Exam plan status and target parameters updated successfully.',
        });
        await loadEntranceData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Handle Remove Plan Item
  const handleRemovePlanItem = async (id: string): Promise<boolean> => {
    try {
      const res = await EntranceService.removePlanItem(id);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Exam removed from your personal plan.',
        });
        await loadEntranceData();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Launch Mock Test
  const handleLaunchMockTest = async (exam: EntranceExamRecord) => {
    setSelectedExamForDetail(null);
    // Find mock test ID for this exam
    const found = availableMocks.find((m) => m.examCode === exam.code);
    if (found) {
      setActiveMockTestId(found.mock.id);
    } else {
      try {
        const res = await EntranceService.getMockTestsForExam(exam.id);
        if (res.success && res.data && res.data.length > 0) {
          setActiveMockTestId(res.data[0].id);
        } else {
          setFeedback({
            type: 'error',
            message: `Diagnostic mock test questions are currently unavailable for ${exam.name}.`,
          });
        }
      } catch {
        setFeedback({
          type: 'error',
          message: 'Failed to launch mock test.',
        });
      }
    }
  };

  return (
    <div id="entrance-exams-module-view" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Page Introduction */}
      <div style={{ marginBottom: '1.5rem' }}>
        {onBackToDashboard && (
          <div style={{ marginBottom: '0.6rem' }}>
            <button
              id="entrance-back-to-dash-btn"
              onClick={onBackToDashboard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'none',
                border: 'none',
                color: '#FF9800',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.2rem 0',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F57C00')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FF9800')}
            >
              <ArrowLeft size={15} />
              <span>Back to Dashboard</span>
            </button>
          </div>
        )}

        <h1
          id="entrance-module-title"
          style={{
            fontSize: '1.95rem',
            fontWeight: 800,
            color: '#172D53',
            letterSpacing: '-0.025em',
            margin: '0 0 0.35rem',
            lineHeight: 1.2,
          }}
        >
          Entrance Exams
        </h1>
        <p
          id="entrance-module-subtitle"
          style={{
            fontSize: '0.94rem',
            color: '#627D98',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Explore requirements and plan your exam journey.
        </p>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          id="entrance-feedback-alert"
          style={{
            background: feedback.type === 'success' ? '#E6F7FA' : '#FEF2F2',
            border: feedback.type === 'success' ? '1px solid rgba(255, 152, 0, 0.35)' : '1px solid #FECACA',
            color: feedback.type === 'success' ? '#F57C00' : '#991B1B',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.86rem',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {feedback.type === 'success' ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Overview Cards (Real data metrics) */}
      <ExamOverviewCards
        planItems={planItems}
        mockAttempts={mockAttempts}
        catalogCount={exams.length}
        onSelectTab={setActiveTab}
      />

      {/* Navigation Tabs Bar */}
      <div
        id="entrance-tab-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid #D9E2EC',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <button
          id="tab-btn-catalog"
          onClick={() => setActiveTab('catalog')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'catalog' ? '2.5px solid #FF9800' : '2.5px solid transparent',
            color: activeTab === 'catalog' ? '#FF9800' : '#627D98',
            fontWeight: activeTab === 'catalog' ? 700 : 500,
            fontSize: '0.9rem',
            padding: '0.65rem 0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Search size={15} />
          <span>Exam Discovery</span>
          <span
            style={{
              background: activeTab === 'catalog' ? 'rgba(255, 152, 0, 0.12)' : '#EDF2F7',
              color: activeTab === 'catalog' ? '#F57C00' : '#627D98',
              border: activeTab === 'catalog' ? '1px solid rgba(255, 152, 0, 0.25)' : '1px solid transparent',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px',
            }}
          >
            {exams.length}
          </span>
        </button>

        <button
          id="tab-btn-plan"
          onClick={() => setActiveTab('plan')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'plan' ? '2.5px solid #FF9800' : '2.5px solid transparent',
            color: activeTab === 'plan' ? '#FF9800' : '#627D98',
            fontWeight: activeTab === 'plan' ? 700 : 500,
            fontSize: '0.9rem',
            padding: '0.65rem 0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Bookmark size={15} />
          <span>My Exam Plan</span>
          {planItems.length > 0 && (
            <span
              style={{
                background: activeTab === 'plan' ? 'rgba(255, 152, 0, 0.12)' : '#EDF2F7',
                color: activeTab === 'plan' ? '#F57C00' : '#627D98',
                border: activeTab === 'plan' ? '1px solid rgba(255, 152, 0, 0.25)' : '1px solid transparent',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
              }}
            >
              {planItems.length}
            </span>
          )}
        </button>

        <button
          id="tab-btn-mocks"
          onClick={() => setActiveTab('mocks')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'mocks' ? '2.5px solid #FF9800' : '2.5px solid transparent',
            color: activeTab === 'mocks' ? '#FF9800' : '#627D98',
            fontWeight: activeTab === 'mocks' ? 700 : 500,
            fontSize: '0.9rem',
            padding: '0.65rem 0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Award size={15} />
          <span>Mock Tests & Diagnostic Results</span>
          {mockAttempts.length > 0 && (
            <span
              style={{
                background: activeTab === 'mocks' ? 'rgba(255, 152, 0, 0.12)' : '#EDF2F7',
                color: activeTab === 'mocks' ? '#F57C00' : '#627D98',
                border: activeTab === 'mocks' ? '1px solid rgba(255, 152, 0, 0.25)' : '1px solid transparent',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
              }}
            >
              {mockAttempts.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Discovery & Catalog */}
      {activeTab === 'catalog' && (
        <ExamDiscoveryView
          exams={exams}
          onSelectExam={(exam) => setSelectedExamForDetail(exam)}
          onAddToPlan={handleInitiateAddToPlan}
          onTakeMockTest={handleLaunchMockTest}
          isLoading={isLoading}
        />
      )}

      {/* Tab 2: My Exam Plan */}
      {activeTab === 'plan' && (
        <MyExamPlanCard
          planItems={planItems}
          allExams={exams}
          onUpdatePlanItem={handleUpdatePlanItem}
          onRemovePlanItem={handleRemovePlanItem}
          onTakeMockTest={handleLaunchMockTest}
          onExploreCatalog={() => setActiveTab('catalog')}
        />
      )}

      {/* Tab 3: Mock Tests & Diagnostic History */}
      {activeTab === 'mocks' && (
        <div id="mock-tests-tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Available Mock Tests */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
                Available Diagnostic Practice Tests
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
                Timed practice environments featuring real syllabus questions, active countdown timer, and automated scoring breakdown.
              </p>
            </div>

            {availableMocks.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Award size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  No Diagnostic Mock Tests Configured
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: '0.35rem' }}>
                  Mock tests will appear here once official questions and scoring algorithms are assigned.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {availableMocks.map(({ examName, examCode, mock }) => (
                  <div
                    key={mock.id}
                    id={`mock-card-${mock.id}`}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
                        <ExamLogo examCode={examCode} size={20} />
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, background: 'rgba(255, 152, 0, 0.12)', color: '#F57C00', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {examCode}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#627D98' }}>
                          {examName} • Diagnostic Mock
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#172D53', margin: '0 0 0.35rem' }}>
                        {mock.title}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: '#486581', lineHeight: 1.5, margin: '0 0 1rem' }}>
                        {mock.description}
                      </p>

                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#627D98', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} color="#FF9800" />
                          <span>{mock.durationMinutes} mins</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Award size={14} color="#FF9800" />
                          <span>{mock.totalMarks} Marks ({mock.totalQuestions} Questions)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`start-mock-btn-${mock.id}`}
                      onClick={() => setActiveMockTestId(mock.id)}
                      style={{
                        background: '#FF9800',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.6rem 1.15rem',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F57C00')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#FF9800')}
                    >
                      <PlayCircle size={16} />
                      <span>Start Timed Diagnostic Test</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Diagnostic Attempts */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem' }}>
                Your Diagnostic Test Attempts & History
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0 }}>
                Track performance over time across standardized mock tests.
              </p>
            </div>

            {mockAttempts.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <TrendingUp size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  No Diagnostic Tests Attempted Yet
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748B', marginTop: '0.35rem' }}>
                  Select any of the available mock tests above to gauge your baseline knowledge and receive instant score breakdowns.
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '0.85rem 1.25rem' }}>Test Name</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Score</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Accuracy</th>
                        <th style={{ padding: '0.85rem 1rem' }}>Time Taken</th>
                        <th style={{ padding: '0.85rem 1.25rem' }}>Date Completed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAttempts.map((attempt) => (
                        <tr key={attempt.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>
                              {attempt.mockTest?.title || 'Diagnostic Test'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                              {attempt.mockTest?.exam?.name || 'Standardized Exam'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                            {attempt.score} / {attempt.totalMarks}
                          </td>
                          <td style={{ padding: '1rem 1rem' }}>
                            <span
                              style={{
                                background: attempt.percentage >= 70 ? '#DCFCE7' : attempt.percentage >= 50 ? '#FEF3C7' : '#FEE2E2',
                                color: attempt.percentage >= 70 ? '#15803D' : attempt.percentage >= 50 ? '#B45309' : '#DC2626',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '9999px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                              }}
                            >
                              {attempt.percentage}%
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1rem', color: '#64748B' }}>
                            {Math.floor(attempt.timeSpentSeconds / 60)}m {attempt.timeSpentSeconds % 60}s
                          </td>
                          <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.82rem' }}>
                            {new Date(attempt.completedAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal 1: Exam Details */}
      {selectedExamForDetail && (
        <ExamDetailModal
          exam={selectedExamForDetail}
          onClose={() => setSelectedExamForDetail(null)}
          onAddToPlan={(exam) => {
            setSelectedExamForDetail(null);
            handleInitiateAddToPlan(exam);
          }}
          onTakeMockTest={handleLaunchMockTest}
        />
      )}

      {/* Modal 2: Timed Mock Test Engine */}
      {activeMockTestId && (
        <TimedMockTestModal
          testId={activeMockTestId}
          onClose={() => {
            setActiveMockTestId(null);
            loadEntranceData();
          }}
          onCompleted={() => {
            loadEntranceData();
          }}
        />
      )}

      {/* Modal 3: Add to Plan Prompt */}
      {examToAdd && (
        <div
          id="add-to-plan-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSavingPlan) setExamToAdd(null);
          }}
        >
          <div
            id="add-to-plan-modal-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxHeight: '92vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F57C00', background: 'rgba(255, 152, 0, 0.12)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {examToAdd.code}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <ExamLogo examCode={examToAdd.code} size={22} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#172D53', margin: 0 }}>
                    {examToAdd.name}
                  </h3>
                </div>
              </div>
              <button
                id="close-add-plan-modal"
                disabled={isSavingPlan}
                onClick={() => setExamToAdd(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.2rem', fontSize: '1.25rem' }}
              >
                &times;
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#627D98', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
              Track your preparation milestones, target college, target degree, and goal test scores for <strong>{examToAdd.name}</strong>.
            </p>

            {/* Error Banner */}
            {modalValidationErrors.general && (
              <div
                id="add-plan-modal-error"
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.84rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <AlertCircle size={15} />
                <span>{modalValidationErrors.general}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {/* Target College */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#172D53', marginBottom: '0.35rem' }}>
                  Target College / University <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="add-plan-college-input"
                  type="text"
                  placeholder="e.g. Stanford University, BITS Pilani, Harvard, IIT Bombay"
                  value={addPlanForm.targetCollege}
                  onChange={(e) => {
                    setAddPlanForm({ ...addPlanForm, targetCollege: e.target.value });
                    if (modalValidationErrors.targetCollege) {
                      setModalValidationErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.targetCollege;
                        return copy;
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    border: modalValidationErrors.targetCollege ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                    fontSize: '0.86rem',
                    boxSizing: 'border-box',
                  }}
                />
                {modalValidationErrors.targetCollege && (
                  <span style={{ display: 'block', color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {modalValidationErrors.targetCollege}
                  </span>
                )}
              </div>

              {/* Target Course */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#172D53', marginBottom: '0.35rem' }}>
                  Target Degree / Course <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="add-plan-course-input"
                  type="text"
                  placeholder="e.g. B.Tech Computer Science, Economics & Finance, Pre-Med"
                  value={addPlanForm.targetCourse}
                  onChange={(e) => {
                    setAddPlanForm({ ...addPlanForm, targetCourse: e.target.value });
                    if (modalValidationErrors.targetCourse) {
                      setModalValidationErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.targetCourse;
                        return copy;
                      });
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    border: modalValidationErrors.targetCourse ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                    fontSize: '0.86rem',
                    boxSizing: 'border-box',
                  }}
                />
                {modalValidationErrors.targetCourse && (
                  <span style={{ display: 'block', color: '#DC2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {modalValidationErrors.targetCourse}
                  </span>
                )}
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#172D53', marginBottom: '0.35rem' }}>
                  Current Status <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  id="add-plan-status-select"
                  value={addPlanForm.status}
                  onChange={(e) => setAddPlanForm({ ...addPlanForm, status: e.target.value as ExamPlanStatus })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                >
                  <option value="PLANNED">Planned (Exploring & Scheduling)</option>
                  <option value="PREPARING">Preparing (Actively Studying)</option>
                  <option value="REGISTERED">Registered (Exam Date Confirmed)</option>
                  <option value="COMPLETED">Completed (Scores Received)</option>
                </select>
              </div>

              {/* Target Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#172D53', marginBottom: '0.35rem' }}>
                  Target Exam Date (Optional)
                </label>
                <input
                  id="add-plan-target-date-input"
                  type="date"
                  value={addPlanForm.targetDate}
                  onChange={(e) => setAddPlanForm({ ...addPlanForm, targetDate: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Target Score */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#172D53', marginBottom: '0.35rem' }}>
                  Target Score (Optional)
                </label>
                <input
                  id="add-plan-target-score-input"
                  type="text"
                  placeholder="e.g. 1500+ or 7.5 Band or 99th Percentile"
                  value={addPlanForm.targetScore}
                  onChange={(e) => setAddPlanForm({ ...addPlanForm, targetScore: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#172D53', marginBottom: '0.35rem' }}>
                  Study Notes & Strategy (Optional)
                </label>
                <textarea
                  id="add-plan-notes-input"
                  rows={2}
                  placeholder="e.g. Focusing on vocabulary & timed practice..."
                  value={addPlanForm.notes}
                  onChange={(e) => setAddPlanForm({ ...addPlanForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.86rem', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                id="cancel-add-plan-btn"
                type="button"
                disabled={isSavingPlan}
                onClick={() => setExamToAdd(null)}
                style={{ background: '#F1F5F9', border: 'none', color: '#475569', padding: '0.6rem 1.15rem', borderRadius: '8px', fontSize: '0.86rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                id="confirm-add-plan-btn"
                type="button"
                disabled={isSavingPlan}
                onClick={handleConfirmAddToPlan}
                style={{
                  background: '#FF9800',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '0.6rem 1.35rem',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: isSavingPlan ? 'not-allowed' : 'pointer',
                  opacity: isSavingPlan ? 0.75 : 1,
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSavingPlan) e.currentTarget.style.background = '#F57C00';
                }}
                onMouseLeave={(e) => {
                  if (!isSavingPlan) e.currentTarget.style.background = '#FF9800';
                }}
              >
                {isSavingPlan ? 'Saving to My Plan...' : 'Save to My Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

class EntranceErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Entrance Exams Module Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          id="entrance-error-boundary-fallback"
          style={{
            background: '#FFFFFF',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '2rem auto',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#172D53', margin: '0 0 0.5rem' }}>
            Entrance Exams Workspace
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#627D98', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
            An unexpected error occurred while rendering the entrance exams workspace: {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#FF9800',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.6rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Retry Loading
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const EntranceExamsView: React.FC<EntranceExamsViewProps> = (props) => (
  <EntranceErrorBoundary>
    <EntranceExamsViewInner {...props} />
  </EntranceErrorBoundary>
);

