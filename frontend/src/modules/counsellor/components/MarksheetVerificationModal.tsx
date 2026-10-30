import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FileCheck,
  Award,
  GraduationCap,
  Check,
} from 'lucide-react';
import { StudentEducationRecord } from '../../education/education.types';
import { StudentProfileRecord } from '../../profile/profile.types';

export type MarksheetType = '12th' | '10th' | 'undergrad';

interface MarksheetVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: StudentEducationRecord | null;
  profile: StudentProfileRecord | null;
  initialDocumentType?: MarksheetType;
  onApplyVerificationNote?: (note: string) => void;
}

export const MarksheetVerificationModal: React.FC<MarksheetVerificationModalProps> = ({
  isOpen,
  onClose,
  education,
  profile,
  initialDocumentType = '12th',
  onApplyVerificationNote,
}) => {
  const [activeDocType, setActiveDocType] = useState<MarksheetType>(initialDocumentType);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Checklist state
  const [checklist, setChecklist] = useState({
    nameMatches: true,
    boardMatches: true,
    aggregateMatches: true,
    subjectsMatch: true,
  });

  useEffect(() => {
    setActiveDocType(initialDocumentType);
    setZoomLevel(1);
    setRotation(0);
    setAppliedNotice(null);
  }, [initialDocumentType, isOpen]);

  // Determine active document URL and details
  const activeDoc = useMemo(() => {
    if (!education) {
      return {
        url: null,
        title: 'Academic Marksheet',
        claimedPercentage: null,
        claimedSchool: null,
        claimedBoard: null,
        claimedYear: null,
      };
    }

    if (activeDocType === '10th') {
      return {
        url: education.tenthDocumentUrl || null,
        title: '10th Class Marksheet & Passing Certificate',
        subtitle: 'Secondary School Examination',
        claimedPercentage: education.tenthPercentage ?? null,
        claimedSchool: education.tenthSchoolName || 'Not specified',
        claimedBoard: education.tenthBoard || 'CBSE / State Board',
        claimedYear: education.tenthPassingYear || 'N/A',
      };
    }

    if (activeDocType === 'undergrad') {
      return {
        url: education.undergradDocumentUrl || null,
        title: 'Undergraduate Degree Certificate / Marksheet',
        subtitle: 'Bachelor Higher Education Qualification',
        claimedPercentage: education.undergradPercentage ?? null,
        claimedSchool: education.undergradCollege || 'Not specified',
        claimedBoard: education.undergradDegree || 'Degree',
        claimedYear: education.undergradPassingYear || 'N/A',
      };
    }

    // Default: 12th
    return {
      url: education.twelfthDocumentUrl || null,
      title: '12th Class Marksheet & Senior Secondary Certificate',
      subtitle: 'Higher Secondary (10+2) Examination',
      claimedPercentage: education.percentage ?? null,
      claimedSchool: education.schoolName || 'Not specified',
      claimedBoard: education.board || 'State / CBSE / ISC',
      claimedYear: education.completionYear || 'N/A',
    };
  }, [activeDocType, education]);

  // Safe helper to convert Data URLs to Blob URLs for external viewing / downloading
  const getSafeBlobUrl = (url: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith('data:')) {
      try {
        const parts = url.split(';base64,');
        const contentType = parts[0].replace('data:', '');
        const byteCharacters = atob(parts[1]);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        return URL.createObjectURL(blob);
      } catch {
        return url;
      }
    }
    return url;
  };

  const safeBlobUrl = useMemo(() => getSafeBlobUrl(activeDoc.url), [activeDoc.url]);

  const isPdf = useMemo(() => {
    if (!activeDoc.url) return false;
    return (
      activeDoc.url.includes('application/pdf') ||
      activeDoc.url.toLowerCase().endsWith('.pdf')
    );
  }, [activeDoc.url]);

  if (!isOpen) return null;

  // Zoom and rotation handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(3, prev + 0.25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(0.5, prev - 0.25));
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handleOpenInNewTab = () => {
    const targetUrl = safeBlobUrl || activeDoc.url;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    const targetUrl = safeBlobUrl || activeDoc.url;
    if (!targetUrl) return;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = `${profile?.fullName || 'Student'}_${activeDocType}_marksheet.${isPdf ? 'pdf' : 'jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 1-Click Verification Note Fillers
  const handleApproveAll = () => {
    if (!onApplyVerificationNote) return;

    let noteText = `[VERIFIED BY ADMIN]: Authenticated official marksheet photocopy.`;
    if (education) {
      noteText += ` 12th Aggregate: ${education.percentage}%`;
      if (education.subjectDetails && education.subjectDetails.length > 0) {
        const subs = education.subjectDetails.map((s) => `${s.subject}: ${s.score}%`).join(', ');
        noteText += ` (${subs})`;
      }
      if (education.tenthPercentage) {
        noteText += ` | 10th Aggregate: ${education.tenthPercentage}%`;
      }
    }
    noteText += `. All candidate marks, percentages, and board records verified against submitted photocopy.`;

    onApplyVerificationNote(noteText);
    setAppliedNotice('✓ Auto-filled verified marks justification into verification notes!');
    setTimeout(() => setAppliedNotice(null), 3500);
  };

  const handleFlagDiscrepancy = () => {
    if (!onApplyVerificationNote) return;
    const noteText = `[DISCREPANCY FLAGGED]: Submitted ${activeDocType.toUpperCase()} marksheet photocopy does not match claimed percentage/scores. Claimed ${
      activeDoc.claimedPercentage ?? 'N/A'
    }%. Please provide authentic original marksheet or update score records.`;

    onApplyVerificationNote(noteText);
    setAppliedNotice('⚠ Flagged marks discrepancy note to verification gateway.');
    setTimeout(() => setAppliedNotice(null), 3500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          height: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #426557',
        }}
      >
        {/* Top Header */}
        <div
          style={{
            height: '68px',
            backgroundColor: '#013A2B',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            borderBottom: '2px solid #025942',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCheck size={22} color="#34D399" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F8FAFC' }}>
                {activeDoc.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#A7F3D0' }}>
                Student: <strong style={{ color: '#FFFFFF' }}>{profile?.fullName || 'Student'}</strong> • ID:{' '}
                <span style={{ color: '#FDE68A' }}>{profile?.id?.slice(0, 8) || 'N/A'}</span> • Board:{' '}
                <strong style={{ color: '#FFFFFF' }}>{activeDoc.claimedBoard}</strong>
              </div>
            </div>
          </div>

          {/* Marksheet Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              padding: '0.25rem',
              gap: '0.25rem',
            }}
          >
            <button
              onClick={() => setActiveDocType('12th')}
              style={{
                backgroundColor: activeDocType === '12th' ? '#FFFFFF' : 'transparent',
                color: activeDocType === '12th' ? '#013A2B' : '#E2E8F0',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText size={14} />
              <span>12th Marksheet</span>
              {education?.twelfthDocumentUrl && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                  }}
                />
              )}
            </button>

            <button
              onClick={() => setActiveDocType('10th')}
              style={{
                backgroundColor: activeDocType === '10th' ? '#FFFFFF' : 'transparent',
                color: activeDocType === '10th' ? '#013A2B' : '#E2E8F0',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText size={14} />
              <span>10th Marksheet</span>
              {education?.tenthDocumentUrl && (
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                  }}
                />
              )}
            </button>

            {(education?.studyCategory === 'POSTGRADUATE' || education?.undergradDocumentUrl) && (
              <button
                onClick={() => setActiveDocType('undergrad')}
                style={{
                  backgroundColor: activeDocType === 'undergrad' ? '#FFFFFF' : 'transparent',
                  color: activeDocType === 'undergrad' ? '#013A2B' : '#E2E8F0',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Award size={14} />
                <span>Degree Certificate</span>
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#CBD5E1',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            title="Close Preview (Esc)"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar Bar */}
        <div
          style={{
            height: '46px',
            backgroundColor: '#F8F5EE',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            fontSize: '0.82rem',
            color: '#334155',
            flexShrink: 0,
          }}
        >
          {/* Zoom & Rotate Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, color: '#475569', marginRight: '0.25rem' }}>
              Document View Controls:
            </span>
            <button
              onClick={handleZoomIn}
              disabled={!activeDoc.url || isPdf}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '0.25rem 0.55rem',
                borderRadius: '5px',
                cursor: !activeDoc.url || isPdf ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                color: '#1E293B',
              }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
              <span>Zoom In</span>
            </button>

            <button
              onClick={handleZoomOut}
              disabled={!activeDoc.url || isPdf}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '0.25rem 0.55rem',
                borderRadius: '5px',
                cursor: !activeDoc.url || isPdf ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                color: '#1E293B',
              }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
              <span>Zoom Out</span>
            </button>

            <button
              onClick={handleRotate}
              disabled={!activeDoc.url || isPdf}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '0.25rem 0.55rem',
                borderRadius: '5px',
                cursor: !activeDoc.url || isPdf ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                color: '#1E293B',
              }}
              title="Rotate 90 degrees"
            >
              <RotateCw size={14} />
              <span>Rotate ({rotation}°)</span>
            </button>

            <button
              onClick={handleResetView}
              disabled={!activeDoc.url || isPdf}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '0.25rem 0.55rem',
                borderRadius: '5px',
                cursor: !activeDoc.url || isPdf ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.78rem',
                color: '#1E293B',
              }}
              title="Reset View"
            >
              <RefreshCw size={14} />
              <span>Reset ({Math.round(zoomLevel * 100)}%)</span>
            </button>
          </div>

          {/* Quick External Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {activeDoc.url && (
              <>
                <button
                  onClick={handleOpenInNewTab}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #426557',
                    color: '#013A2B',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                  }}
                  title="Open full resolution marksheet in a new tab"
                >
                  <ExternalLink size={14} />
                  <span>Open Fullscreen Tab</span>
                </button>

                <button
                  onClick={handleDownload}
                  style={{
                    backgroundColor: '#013A2B',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.78rem',
                  }}
                  title="Download student marksheet photocopy"
                >
                  <Download size={14} />
                  <span>Download Marksheet</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Applied Action Alert Banner */}
        {appliedNotice && (
          <div
            style={{
              backgroundColor: '#DCFCE7',
              borderBottom: '1px solid #86EFAC',
              color: '#15803D',
              padding: '0.5rem 1.5rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Main Split Content: Left = Document Viewer, Right = Marks Comparison */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left Canvas: Document Viewer */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto',
              padding: '1.5rem',
              position: 'relative',
            }}
          >
            {activeDoc.url ? (
              isPdf ? (
                /* PDF Viewer via embedded frame with fallbacks */
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <iframe
                    src={safeBlobUrl || activeDoc.url}
                    title="Student Marksheet PDF"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
              ) : (
                /* High Resolution Image Viewer with Pan/Zoom/Rotation */
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '100%',
                    minHeight: '100%',
                  }}
                >
                  <img
                    src={activeDoc.url}
                    alt="Student Submitted Marksheet Photocopy"
                    style={{
                      maxWidth: '92%',
                      maxHeight: '78vh',
                      objectFit: 'contain',
                      borderRadius: '6px',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.15s ease-out',
                      cursor: zoomLevel > 1 ? 'grab' : 'default',
                    }}
                  />
                </div>
              )
            ) : (
              /* Empty state if student has not submitted marksheet */
              <div
                style={{
                  textAlign: 'center',
                  color: '#94A3B8',
                  maxWidth: '420px',
                  backgroundColor: '#1E293B',
                  padding: '3rem 2rem',
                  borderRadius: '12px',
                  border: '1px dashed #475569',
                }}
              >
                <AlertTriangle size={48} color="#F59E0B" style={{ marginBottom: '1rem' }} />
                <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  Photocopy Not Yet Uploaded
                </h4>
                <p style={{ fontSize: '0.82rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  The student has not attached a scan/photocopy for their{' '}
                  <strong style={{ color: '#FDE68A' }}>{activeDoc.title}</strong> yet. You can inspect the
                  student-claimed scores on the right and request the document.
                </p>
                <div
                  style={{
                    backgroundColor: '#0F172A',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    color: '#CBD5E1',
                  }}
                >
                  Claimed Aggregate: <strong>{activeDoc.claimedPercentage ?? 'N/A'}%</strong>
                </div>
              </div>
            )}
          </div>

          {/* Right Verification & Comparison Panel */}
          <div
            style={{
              width: '380px',
              backgroundColor: '#FFFFFF',
              borderLeft: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
            {/* Panel Title */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#FBF8F1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <GraduationCap size={16} color="#013A2B" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#013A2B' }}>
                  Marksheet Cross-Check & Audit
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Verify claimed marks and percentage against the submitted photocopy.
              </span>
            </div>

            {/* Scrollable Comparison Content */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
              {/* Claimed Aggregate Badge Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748B',
                    display: 'block',
                    marginBottom: '0.35rem',
                  }}
                >
                  {activeDocType === '10th' ? '10th Standard Aggregate' : '12th Senior Secondary Aggregate'}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: '#0284C7',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {activeDoc.claimedPercentage != null ? `${activeDoc.claimedPercentage}%` : 'N/A'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Claimed Overall Score</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.5rem' }}>
                  <div>
                    Institution: <strong style={{ color: '#0F172A' }}>{activeDoc.claimedSchool}</strong>
                  </div>
                  <div>
                    Board / Year:{' '}
                    <strong style={{ color: '#0F172A' }}>
                      {activeDoc.claimedBoard} ({activeDoc.claimedYear})
                    </strong>
                  </div>
                </div>
              </div>

              {/* 12th Subject-Wise Breakdown Table */}
              {activeDocType === '12th' && education?.subjectDetails && education.subjectDetails.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Subject-Wise Claimed Marks</span>
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
                      {education.subjectDetails.length} Subjects Recorded
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ textAlign: 'left', padding: '0.45rem 0.65rem', color: '#475569' }}>
                            Subject
                          </th>
                          <th style={{ textAlign: 'right', padding: '0.45rem 0.65rem', color: '#475569' }}>
                            Claimed Score
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {education.subjectDetails.map((sub, idx) => (
                          <tr
                            key={idx}
                            style={{
                              borderBottom:
                                idx === education.subjectDetails.length - 1 ? 'none' : '1px solid #F1F5F9',
                            }}
                          >
                            <td style={{ padding: '0.45rem 0.65rem', fontWeight: 600, color: '#1E293B' }}>
                              {sub.subject}
                            </td>
                            <td style={{ textAlign: 'right', padding: '0.45rem 0.65rem' }}>
                              <span
                                style={{
                                  backgroundColor: '#E2E8F0',
                                  color: '#059669',
                                  fontWeight: 700,
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  fontSize: '0.78rem',
                                }}
                              >
                                {sub.score}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 10th Standard Reference Note */}
              {activeDocType === '12th' && education?.tenthSchoolName && (
                <div
                  style={{
                    backgroundColor: '#F8F5EE',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    fontSize: '0.78rem',
                    color: '#334155',
                  }}
                >
                  <strong style={{ color: '#013A2B', display: 'block', marginBottom: '0.2rem' }}>
                    10th High School Record Reference:
                  </strong>
                  <div>
                    {education.tenthSchoolName} ({education.tenthBoard || 'CBSE'}) —{' '}
                    <strong style={{ color: '#0284C7' }}>{education.tenthPercentage || 'N/A'}%</strong>
                  </div>
                </div>
              )}

              {/* Admin Verification Checklist */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#475569',
                    display: 'block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Admin Verification Checklist:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist.nameMatches}
                      onChange={(e) => setChecklist({ ...checklist, nameMatches: e.target.checked })}
                    />
                    <span>Candidate Name matches ID ({profile?.fullName || 'Student'})</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist.boardMatches}
                      onChange={(e) => setChecklist({ ...checklist, boardMatches: e.target.checked })}
                    />
                    <span>Board & Passing Year match records</span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist.aggregateMatches}
                      onChange={(e) => setChecklist({ ...checklist, aggregateMatches: e.target.checked })}
                    />
                    <span>
                      Aggregate Percentage ({activeDoc.claimedPercentage ?? 'N/A'}%) verified
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontSize: '0.78rem',
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist.subjectsMatch}
                      onChange={(e) => setChecklist({ ...checklist, subjectsMatch: e.target.checked })}
                    />
                    <span>Subject-wise individual scores confirmed</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div
              style={{
                padding: '1rem',
                borderTop: '1px solid #E2E8F0',
                backgroundColor: '#F8F5EE',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <button
                onClick={handleApproveAll}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  backgroundColor: '#013A2B',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 4px rgba(1, 58, 43, 0.2)',
                }}
              >
                <Check size={16} />
                <span>Auto-Fill: Verified All Marks Match</span>
              </button>

              <button
                onClick={handleFlagDiscrepancy}
                style={{
                  width: '100%',
                  padding: '0.55rem 1rem',
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  border: '1px solid #FECDD3',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <AlertTriangle size={15} />
                <span>Flag Marks Discrepancy Note</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

