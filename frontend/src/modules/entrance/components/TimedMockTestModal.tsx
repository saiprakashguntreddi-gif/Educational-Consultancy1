import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Send,
  Bookmark,
  Award,
  Check,
  RotateCcw,
  BarChart2,
  HelpCircle,
} from 'lucide-react';
import { EntranceService } from '../services/entrance.service';
import { MockTestTakingView, MockTestResultRecord } from '../entrance.types';

interface TimedMockTestModalProps {
  testId: string;
  onClose: () => void;
  onCompleted: (result: MockTestResultRecord) => void;
}

export const TimedMockTestModal: React.FC<TimedMockTestModalProps> = ({
  testId,
  onClose,
  onCompleted,
}) => {
  const [testData, setTestData] = useState<MockTestTakingView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Test Taking State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Results State
  const [result, setResult] = useState<MockTestResultRecord | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer Ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Load Mock Test Data
  useEffect(() => {
    let isMounted = true;
    const fetchTest = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await EntranceService.getMockTestForTaking(testId);
        if (!isMounted) return;
        if (res.success && res.data) {
          setTestData(res.data);
          const initialSeconds = res.data.durationMinutes * 60;
          setSecondsRemaining(initialSeconds);
        } else {
          setLoadError(res.message || 'Failed to load mock test questions.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setLoadError(err.message || 'Network error while loading mock test.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTest();
    return () => {
      isMounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (!testData || result || isSubmitting) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testData, result, isSubmitting]);

  // Auto-submit when time expires
  const handleAutoSubmit = () => {
    if (!result && !isSubmitting) {
      handleSubmitAnswers();
    }
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitAnswers = async () => {
    if (!testData || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setShowConfirmSubmit(false);

    try {
      const res = await EntranceService.submitMockTest(testData.id, {
        timeSpentSeconds,
        answers,
      });

      if (res.success && res.data) {
        setResult(res.data);
        onCompleted(res.data);
      } else {
        setSubmitError(res.message || 'Failed to submit test evaluation.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div
        id="mock-modal-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '3.5px solid #E2E8F0',
              borderTopColor: '#FF9800',
              borderRadius: '50%',
              margin: '0 auto 1.25rem',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#172D53', margin: '0 0 0.4rem' }}>
            Preparing Mock Test Environment
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Loading verified exam questions, multiple choice options, and countdown timer...
          </p>
        </div>
      </div>
    );
  }

  if (loadError || !testData) {
    return (
      <div
        id="mock-modal-backdrop"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
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
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#172D53', margin: '0 0 0.5rem' }}>
            Mock Test Unavailable
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
            {loadError || 'Diagnostic mock test questions are currently not available for this exam.'}
          </p>
          <button
            id="close-load-error-btn"
            onClick={onClose}
            style={{
              background: '#172D53',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Return to Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unansweredCount = testData.questions.length - answeredCount;
  const isTimeCritical = secondsRemaining < 120; // under 2 minutes

  return (
    <div
      id="mock-test-environment-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(11, 19, 32, 0.82)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
    >
      <div
        id="mock-test-modal-card"
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          position: 'relative',
        }}
      >
        {/* ========================================================
            HEADER: Test Title, Badges & Live Countdown Timer
           ======================================================== */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0e1e3b 0%, #172D53 100%)',
            color: '#FFFFFF',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(255, 152, 0, 0.2)',
                  color: '#FFB547',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 152, 0, 0.35)',
                }}
              >
                {testData.examName}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Practice Mock Examination
              </span>
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              {testData.title}
            </h2>
          </div>

          {/* Timer and Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!result && (
              <div
                id="mock-test-countdown-timer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: isTimeCritical ? '#EF4444' : '#F57C00',
                  color: '#FFFFFF',
                  padding: '0.5rem 0.95rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  fontVariantNumeric: 'tabular-nums',
                  border: isTimeCritical ? '1px solid #F87171' : '1px solid rgba(255, 152, 0, 0.4)',
                  boxShadow: isTimeCritical ? '0 0 14px rgba(239, 68, 68, 0.6)' : '0 2px 8px rgba(245, 124, 0, 0.3)',
                }}
              >
                <Clock size={16} />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}

            <button
              id="exit-mock-test-btn"
              onClick={() => {
                if (!result) {
                  if (window.confirm('Are you sure you want to exit? Your progress in this mock test will not be saved.')) {
                    onClose();
                  }
                } else {
                  onClose();
                }
              }}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                color: '#E2E8F0',
                padding: '0.45rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              title="Close Test"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ========================================================
            VIEW A: DIAGNOSTIC RESULTS BREAKDOWN (POST-SUBMISSION)
           ======================================================== */}
        {result ? (
          <div
            id="mock-test-results-view"
            style={{
              padding: '1.75rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Score Summary Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0e1e3b 0%, #172D53 60%, #F57C00 100%)',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                boxShadow: '0 8px 24px rgba(14, 30, 59, 0.25)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#FFB547',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Diagnostic Result Completed
                </span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.25rem 0 0.4rem', letterSpacing: '-0.02em' }}>
                  {result.score} / {result.totalMarks} Marks
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', fontSize: '0.86rem', color: '#E2E8F0' }}>
                  <span>Accuracy: <strong>{result.percentage}%</strong></span>
                  <span>•</span>
                  <span>Time: <strong>{Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s</strong></span>
                  <span>•</span>
                  <span>
                    Performance:{' '}
                    <strong>
                      {result.percentage >= 80
                        ? 'Excellent (Exam Ready)'
                        : result.percentage >= 60
                        ? 'Proficient (Competitive)'
                        : 'Foundational (Targeted Practice Needed)'}
                    </strong>
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '12px',
                  padding: '1rem 1.6rem',
                  textAlign: 'center',
                  minWidth: '120px',
                }}
              >
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: result.percentage >= 60 ? '#FFB547' : '#FCA5A5', lineHeight: 1 }}>
                  {result.percentage}%
                </div>
                <div style={{ fontSize: '0.74rem', color: '#F1F5F9', marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Overall Score
                </div>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Questions</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                  {result.breakdown.length}
                </div>
              </div>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>Correct Answers</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#15803D', marginTop: '0.2rem' }}>
                  {result.breakdown.filter((b) => b.isCorrect).length}
                </div>
              </div>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>Incorrect Answers</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#991B1B', marginTop: '0.2rem' }}>
                  {result.breakdown.filter((b) => !b.isCorrect).length}
                </div>
              </div>
              <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 600 }}>Time Allocation</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#B45309', marginTop: '0.2rem' }}>
                  {Math.round(result.timeSpentSeconds / result.breakdown.length)}s / q
                </div>
              </div>
            </div>

            {/* Question Breakdown Heading */}
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#172D53', margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
                Question-by-Question Analysis & Detailed Explanations
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.breakdown.map((item, idx) => (
                  <div
                    key={item.questionId}
                    id={`result-question-${idx}`}
                    style={{
                      background: item.isCorrect ? '#F0FDF4' : '#FEF2F2',
                      border: item.isCorrect ? '1.5px solid #86EFAC' : '1.5px solid #FCA5A5',
                      borderRadius: '12px',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, background: '#FFFFFF', padding: '0.2rem 0.55rem', borderRadius: '5px', border: '1px solid #CBD5E1' }}>
                          Q{idx + 1} • {item.section}
                        </span>
                        {item.isCorrect ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#16A34A', fontSize: '0.82rem', fontWeight: 700 }}>
                            <CheckCircle2 size={16} /> Correct (+{item.marksObtained} mark)
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                            <XCircle size={16} /> Incorrect (0 / {item.maxMarks} marks)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p style={{ fontSize: '0.94rem', fontWeight: 600, color: '#0F172A', margin: '0 0 0.95rem', lineHeight: 1.55 }}>
                      {item.questionText}
                    </p>

                    {/* Options list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.95rem' }}>
                      {item.options.map((opt, optIdx) => {
                        const isSelected = item.selectedOptionIndex === optIdx;
                        const isCorrectOption = item.correctOptionIndex === optIdx;

                        let optBg = '#FFFFFF';
                        let optBorder = '#E2E8F0';
                        let optColor = '#334155';

                        if (isCorrectOption) {
                          optBg = '#DCFCE7';
                          optBorder = '#86EFAC';
                          optColor = '#166534';
                        } else if (isSelected && !item.isCorrect) {
                          optBg = '#FEE2E2';
                          optBorder = '#FCA5A5';
                          optColor = '#991B1B';
                        }

                        return (
                          <div
                            key={optIdx}
                            style={{
                              background: optBg,
                              border: `1.5px solid ${optBorder}`,
                              color: optColor,
                              borderRadius: '8px',
                              padding: '0.65rem 0.95rem',
                              fontSize: '0.88rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>
                              <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                            </span>
                            {isCorrectOption && (
                              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#15803D' }}>
                                Correct Answer ✓
                              </span>
                            )}
                            {isSelected && !isCorrectOption && (
                              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#B91C1C' }}>
                                Your Answer ✗
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Verified Explanation */}
                    <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FF9800', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Explanation & Concept Rationale:
                      </div>
                      <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0, lineHeight: 1.55 }}>
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
              <button
                id="close-mock-results-btn"
                onClick={onClose}
                style={{
                  background: '#FF9800',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.7rem 1.6rem',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  boxShadow: '0 2px 6px rgba(255, 152, 0, 0.3)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F57C00')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FF9800')}
              >
                Close & Return to Exams
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             VIEW B: ACTIVE TEST TAKING ENVIRONMENT
             ======================================================== */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Question Navigation Palette Header with Status Breakdown */}
            <div
              style={{
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                padding: '0.85rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              {/* Question Buttons Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#172D53', marginRight: '0.25rem' }}>
                    Questions:
                  </span>
                  {testData.questions.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isMarked = !!markedForReview[q.id];
                    const isCurrent = idx === currentIndex;

                    let bg = '#FFFFFF';
                    let border = '1px solid #CBD5E1';
                    let color = '#475569';

                    if (isCurrent) {
                      border = '2px solid #FF9800';
                      bg = '#FFF7ED';
                      color = '#EA580C';
                    } else if (isMarked) {
                      bg = '#F3E8FF';
                      border = '1.5px solid #A855F7';
                      color = '#7E22CE';
                    } else if (isAnswered) {
                      bg = '#DCFCE7';
                      border = '1.5px solid #22C55E';
                      color = '#15803D';
                    }

                    return (
                      <button
                        key={q.id}
                        id={`palette-btn-${idx}`}
                        onClick={() => setCurrentIndex(idx)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '7px',
                          border,
                          background: bg,
                          color,
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          transition: 'all 0.15s ease',
                          boxShadow: isCurrent ? '0 0 0 2px rgba(255, 152, 0, 0.25)' : 'none',
                        }}
                      >
                        {idx + 1}
                        {isMarked && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '-3px',
                              right: '-3px',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#A855F7',
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Progress Counter */}
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Answered: <strong>{answeredCount}</strong> of {testData.questions.length} • Marked: <strong>{markedCount}</strong>
                </div>
              </div>

              {/* Status Legend Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  fontSize: '0.74rem',
                  color: '#64748B',
                  flexWrap: 'wrap',
                  paddingTop: '0.2rem',
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
                  <span>Unanswered ({unansweredCount})</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#A855F7', display: 'inline-block' }} />
                  <span>Marked for Review ({markedCount})</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', border: '2px solid #FF9800', background: '#FFF7ED', display: 'inline-block' }} />
                  <span>Current Question</span>
                </div>
              </div>
            </div>

            {/* Question Content Area */}
            <div style={{ padding: '1.75rem', flex: 1, overflowY: 'auto' }}>
              {submitError && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#B91C1C',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {submitError}
                </div>
              )}

              {currentQuestion && (
                <div id={`question-card-${currentQuestion.id}`}>
                  {/* Section, Question numbering & Mark for Review toggle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.85rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          background: 'rgba(255, 152, 0, 0.12)',
                          color: '#F57C00',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 152, 0, 0.25)',
                        }}
                      >
                        Section: {currentQuestion.section}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                        Question {currentIndex + 1} of {testData.questions.length} ({currentQuestion.marks} mark)
                      </span>
                    </div>

                    {/* Mark for Review Button */}
                    <button
                      type="button"
                      id="mark-for-review-btn"
                      onClick={() => toggleMarkForReview(currentQuestion.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: markedForReview[currentQuestion.id] ? '#F3E8FF' : '#FFFFFF',
                        border: markedForReview[currentQuestion.id] ? '1.5px solid #A855F7' : '1px solid #CBD5E1',
                        color: markedForReview[currentQuestion.id] ? '#7E22CE' : '#475569',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Bookmark
                        size={14}
                        fill={markedForReview[currentQuestion.id] ? '#7E22CE' : 'none'}
                      />
                      <span>
                        {markedForReview[currentQuestion.id] ? 'Marked for Review' : 'Mark for Review'}
                      </span>
                    </button>
                  </div>

                  {/* Question prompt */}
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#172D53',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      padding: '1.25rem',
                      background: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    {currentQuestion.questionText}
                  </div>

                  {/* Selectable MCQ Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = answers[currentQuestion.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          id={`option-${currentQuestion.id}-${optIdx}`}
                          onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                          style={{
                            background: isSelected ? 'rgba(255, 152, 0, 0.08)' : '#FFFFFF',
                            border: isSelected ? '2px solid #FF9800' : '1px solid #CBD5E1',
                            borderRadius: '10px',
                            padding: '0.85rem 1.15rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 2px 8px rgba(255, 152, 0, 0.15)' : 'none',
                          }}
                        >
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              border: isSelected ? '2px solid #FF9800' : '1px solid #94A3B8',
                              background: isSelected ? '#FF9800' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span style={{ fontSize: '0.94rem', color: '#172D53', lineHeight: 1.45, fontWeight: isSelected ? 600 : 400 }}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation & Submit Toolbar */}
            <div
              style={{
                borderTop: '1px solid #E2E8F0',
                padding: '1rem 1.75rem',
                background: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              {/* Previous & Next Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  id="mock-prev-btn"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: currentIndex === 0 ? '#94A3B8' : '#172D53',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  id="mock-next-btn"
                  disabled={currentIndex === testData.questions.length - 1}
                  onClick={() =>
                    setCurrentIndex((prev) => Math.min(testData.questions.length - 1, prev + 1))
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: currentIndex === testData.questions.length - 1 ? '#94A3B8' : '#172D53',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    cursor: currentIndex === testData.questions.length - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Submit Test Trigger */}
              <div>
                <button
                  id="trigger-submit-mock-btn"
                  onClick={() => setShowConfirmSubmit(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: '#FF9800',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(255, 152, 0, 0.3)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F57C00')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FF9800')}
                >
                  <Send size={15} />
                  <span>Submit Test</span>
                </button>
              </div>
            </div>

            {/* ========================================================
                CONFIRM SUBMIT POPUP DIALOG
               ======================================================== */}
            {showConfirmSubmit && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  backdropFilter: 'blur(3px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '2rem',
                    maxWidth: '460px',
                    width: '100%',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#172D53', margin: '0 0 0.5rem' }}>
                    Confirm Test Submission
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                    Are you ready to submit your diagnostic practice test? Your responses will be scored immediately.
                  </p>

                  {/* Summary Box */}
                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      textAlign: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16A34A' }}>
                        {answeredCount}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.15rem' }}>
                        Answered
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DC2626' }}>
                        {unansweredCount}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.15rem' }}>
                        Unanswered
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7E22CE' }}>
                        {markedCount}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.15rem' }}>
                        Marked
                      </div>
                    </div>
                  </div>

                  {unansweredCount > 0 && (
                    <div
                      style={{
                        background: '#FEF3C7',
                        border: '1px solid #FCD34D',
                        borderRadius: '6px',
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.8rem',
                        color: '#92400E',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <AlertTriangle size={15} />
                      <span>You still have {unansweredCount} unanswered questions!</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      id="cancel-submit-modal-btn"
                      onClick={() => setShowConfirmSubmit(false)}
                      style={{
                        background: '#F1F5F9',
                        color: '#475569',
                        border: 'none',
                        padding: '0.6rem 1.1rem',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Return to Test
                    </button>
                    <button
                      type="button"
                      id="confirm-submit-modal-btn"
                      disabled={isSubmitting}
                      onClick={handleSubmitAnswers}
                      style={{
                        background: '#FF9800',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.6rem 1.3rem',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 6px rgba(255, 152, 0, 0.3)',
                      }}
                    >
                      {isSubmitting ? 'Evaluating...' : 'Yes, Submit Test'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
