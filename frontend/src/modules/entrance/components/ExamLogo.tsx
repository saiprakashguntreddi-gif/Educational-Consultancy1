import React from 'react';

interface ExamLogoProps {
  examCode: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ExamLogo Component
 * Renders professional, consistent vector logos/icons for all entrance exams.
 * Consistent size: 18-22px (default 20px).
 * Maintains the orange/navy theme and clean aesthetic.
 */
export const ExamLogo: React.FC<ExamLogoProps> = ({
  examCode,
  size = 20,
  className,
  style,
}) => {
  const code = (examCode || '').toUpperCase().trim();

  // Common wrapper styling for consistent 18-22px sizing, alignment & border radius
  const baseContainerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    borderRadius: '4px',
    flexShrink: 0,
    verticalAlign: 'middle',
    overflow: 'hidden',
    ...style,
  };

  const renderSvg = () => {
    switch (code) {
      // 1. SAT - College Board style blue & orange arc symbol
      case 'SAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#003366" />
            <path d="M4 14C7 8 13 6 19 8" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M5 18C9 13 15 11 20 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <text x="12" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="900" fontFamily="sans-serif">SAT</text>
          </svg>
        );

      // 2. ACT - Dynamic red chevron lettermark
      case 'ACT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#B31B1B" />
            <path d="M4 17L9 6L14 17M6 14H12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 8L18 12L21 8" stroke="#FF9800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 3. JEE MAIN - NTA precision atom & core
      case 'JEE_MAIN':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#FFF3E0" stroke="#FF9800" strokeWidth="1" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#FF9800" strokeWidth="1.4" transform="rotate(30 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="#172D53" strokeWidth="1.4" transform="rotate(-30 12 12)" />
            <circle cx="12" cy="12" r="2.5" fill="#E65100" />
          </svg>
        );

      // 4. JEE ADVANCED - IIT iconic torch flame & gear crest
      case 'JEE_ADVANCED':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#172D53" />
            <circle cx="12" cy="12" r="8" stroke="#FFB74D" strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M12 4C13.5 7 15 9 14 12C13.5 13.5 12 14.5 12 16C12 14.5 10.5 13.5 10 12C9 9 10.5 7 12 4Z" fill="#FF9800" />
            <circle cx="12" cy="12" r="2" fill="#FFE082" />
          </svg>
        );

      // 5. CUET UG - NTA national testing lotus & star emblem
      case 'CUET_UG':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#0D47A1" />
            <circle cx="12" cy="12" r="8.5" stroke="#FF9800" strokeWidth="1.2" />
            <path d="M12 5L13.5 9.5H18L14.5 12.2L16 16.5L12 14L8 16.5L9.5 12.2L6 9.5H10.5L12 5Z" fill="#FFB74D" />
          </svg>
        );

      // 6. CUET PG - Graduate crest with book & laurel
      case 'CUET_PG':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#1A237E" />
            <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="#FF9800" />
            <path d="M7 11.5V16C7 18 9 20 12 20C15 20 17 18 17 16V11.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="20" cy="12" r="1.5" fill="#FFB74D" />
          </svg>
        );

      // 7. BITSAT - BITS Pilani beacon tower & shield
      case 'BITSAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#780016" />
            <path d="M6 5H18V13C18 17.5 12 20.5 12 20.5C12 20.5 6 17.5 6 13V5Z" stroke="#FFB74D" strokeWidth="1.5" fill="#4A000E" />
            <path d="M12 7V16M9 11H15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 8. VITEEE - VIT star & shield
      case 'VITEEE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#0A369D" />
            <circle cx="12" cy="12" r="7.5" stroke="#FF9800" strokeWidth="1.5" />
            <path d="M12 6L13.8 10.2L18 12L13.8 13.8L12 18L10.2 13.8L6 12L10.2 10.2L12 6Z" fill="#FFFFFF" />
          </svg>
        );

      // 9. GATE - Engineering gear & microprocessor circuits
      case 'GATE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#263238" />
            <rect x="6" y="6" width="12" height="12" rx="2" stroke="#FF9800" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="2.5" fill="#FF9800" />
            <path d="M9 3V6M15 3V6M9 18V21M15 18V21M3 9H6M3 15H6M18 9H21M18 15H21" stroke="#ECEFF1" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      // 10. GRE - ETS swoosh & keystone
      case 'GRE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#006699" />
            <path d="M5 8C7 5 17 5 19 8C16 14 8 14 5 8Z" fill="#FF9800" />
            <path d="M6 13C9 19 15 19 18 13" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="10" r="1.5" fill="#FFFFFF" />
          </svg>
        );

      // 11. GMAT - GMAC diamond geometric logo
      case 'GMAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#102A43" />
            <path d="M12 3L20 12L12 21L4 12L12 3Z" stroke="#FF9800" strokeWidth="1.5" fill="#1F3A5A" />
            <circle cx="12" cy="12" r="3" fill="#FFB74D" />
          </svg>
        );

      // 12. CAT - IIM tiger & laurels
      case 'CAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#581845" />
            <circle cx="12" cy="12" r="7.5" stroke="#FFB74D" strokeWidth="1.5" />
            <path d="M8 10L10 6L12 9L14 6L16 10L12 17L8 10Z" fill="#FF9800" />
          </svg>
        );

      // 13. XAT - XLRI Xavier shield & cross
      case 'XAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#880E4F" />
            <path d="M7 6L17 18M17 6L7 18" stroke="#FF9800" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
          </svg>
        );

      // 14. IELTS - Official red square wordmark
      case 'IELTS':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#D32F2F" />
            <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="0.3">IELTS</text>
          </svg>
        );

      // 15. TOEFL - ETS speech bubbles & globe
      case 'TOEFL':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#004D80" />
            <path d="M6 7H18V14C18 15.5 16.5 17 15 17H9L6 19V7Z" fill="#FF9800" />
            <circle cx="10" cy="12" r="1.2" fill="#004D80" />
            <circle cx="14" cy="12" r="1.2" fill="#004D80" />
          </svg>
        );

      // 16. PTE - Pearson blue hexagon & P
      case 'PTE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#005A70" />
            <path d="M12 4L19 8V16L12 20L5 16V8L12 4Z" stroke="#FF9800" strokeWidth="1.5" fill="#003E4D" />
            <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800" fontFamily="sans-serif">P</text>
          </svg>
        );

      // 17. DUOLINGO - Green owl face
      case 'DUOLINGO':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#58CC02" />
            <circle cx="8.5" cy="11.5" r="3.5" fill="#FFFFFF" />
            <circle cx="15.5" cy="11.5" r="3.5" fill="#FFFFFF" />
            <circle cx="8.5" cy="11.5" r="1.8" fill="#172D53" />
            <circle cx="15.5" cy="11.5" r="1.8" fill="#172D53" />
            <path d="M12 13.5L10.5 16H13.5L12 13.5Z" fill="#FF9800" />
          </svg>
        );

      // 18. NATA - Architecture drafting compass & triangle
      case 'NATA':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#BF360C" />
            <path d="M12 4L6 19M12 4L18 19M8 14H16" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="4" r="1.5" fill="#FF9800" />
          </svg>
        );

      // 19. UCEED - Design hexagon & pen nib
      case 'UCEED':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#4A148C" />
            <path d="M12 4L19 8V16L12 20L5 16V8L12 4Z" stroke="#FF9800" strokeWidth="1.4" />
            <path d="M12 8L15 14H9L12 8Z" fill="#FFB74D" />
            <circle cx="12" cy="12" r="1.2" fill="#4A148C" />
          </svg>
        );

      // 20. NID_DAT - National Institute of Design geometric mark
      case 'NID_DAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#F57F17" />
            <rect x="6" y="6" width="12" height="12" fill="#172D53" />
            <circle cx="12" cy="12" r="3.5" fill="#FFFFFF" />
            <path d="M12 6V18M6 12H18" stroke="#F57F17" strokeWidth="1" />
          </svg>
        );

      // 21. NIFT - Fashion shears & needle
      case 'NIFT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#880E4F" />
            <path d="M7 6C7 8 9 9 10 11L14 17C15 18.5 17 18 17 16" stroke="#FF9800" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M17 6C17 8 15 9 14 11L10 17C9 18.5 7 18 7 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="11" r="1.5" fill="#FFB74D" />
          </svg>
        );

      // 22. CEED - Advanced design grid & prism
      case 'CEED':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#311B92" />
            <path d="M12 4L20 9V15L12 20L4 15V9L12 4Z" stroke="#FF9800" strokeWidth="1.3" />
            <path d="M12 4V20M4 9L20 15M4 15L20 9" stroke="#B388FF" strokeWidth="0.8" />
          </svg>
        );

      // 23. GAOKAO - Chinese calligraphy & star seal
      case 'GAOKAO':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#B71C1C" />
            <circle cx="12" cy="12" r="7.5" stroke="#FFD54F" strokeWidth="1.2" />
            <path d="M12 6L13.5 10H17.5L14.2 12.5L15.5 16.5L12 14L8.5 16.5L9.8 12.5L6.5 10H10.5L12 6Z" fill="#FFD54F" />
          </svg>
        );

      // 24. ENEM - Brazilian green & gold diamond
      case 'ENEM':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00796B" />
            <path d="M12 4L20 12L12 20L4 12L12 4Z" fill="#FBC02D" />
            <circle cx="12" cy="12" r="4" fill="#0288D1" />
            <path d="M9 12C11 11 13 13 15 12" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      // 25. COMEDK_UGET - Karnataka engineering shield
      case 'COMEDK_UGET':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#E65100" />
            <path d="M6 5H18V13C18 17 12 20 12 20C12 20 6 17 6 13V5Z" stroke="#FFFFFF" strokeWidth="1.4" fill="#BF360C" />
            <path d="M12 8V16M9 12H15" stroke="#FFD54F" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 26. KCET - Karnataka yellow/red flag crest
      case 'KCET':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#D32F2F" />
            <path d="M4 4H20V12H4V4Z" fill="#FBC02D" />
            <circle cx="12" cy="12" r="5" fill="#172D53" />
            <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
          </svg>
        );

      // 27. WBJEE - Bengal lamp of wisdom
      case 'WBJEE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#1565C0" />
            <path d="M6 16C8 18 16 18 18 16C17 14 7 14 6 16Z" fill="#FF9800" />
            <path d="M12 7C13 10 14 12 12 14C10 12 11 10 12 7Z" fill="#FFD54F" />
            <path d="M9 17L7 20H17L15 17" stroke="#FFFFFF" strokeWidth="1.2" />
          </svg>
        );

      // 28. MHT_CET - Maharashtra state torch
      case 'MHT_CET':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#EF6C00" />
            <path d="M10 12H14L13 20H11L10 12Z" fill="#4E342E" />
            <path d="M12 5C14 7 15 9 14 11H10C9 9 10 7 12 5Z" fill="#FFF9C4" />
            <circle cx="12" cy="8" r="1.5" fill="#D84315" />
          </svg>
        );

      // 29. IPMAT - IIM pillars of management
      case 'IPMAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#1A237E" />
            <path d="M5 6H19M5 18H19" stroke="#FF9800" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 7V17M12 7V17M16 7V17" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        );

      // 30. IIT_JAM - Pure science atom & flask
      case 'IIT_JAM':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00695C" />
            <path d="M10 5H14M11 5V10L7 17C6 19 8 20 10 20H14C16 20 18 19 17 17L13 10V5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="16" r="1.5" fill="#FF9800" />
          </svg>
        );

      // 31. NIMCET - Computing screen & code brackets
      case 'NIMCET':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#212121" />
            <rect x="4" y="5" width="16" height="11" rx="1.5" stroke="#FF9800" strokeWidth="1.4" />
            <path d="M8 9L6 10.5L8 12M16 9L18 10.5L16 12" stroke="#4CAF50" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 19H15M12 16V19" stroke="#BDBDBD" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        );

      // 32. MAT - Management compass
      case 'MAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#0277BD" />
            <circle cx="12" cy="12" r="7.5" stroke="#FFFFFF" strokeWidth="1.2" />
            <polygon points="12,6 15,12 12,18 9,12" fill="#FF9800" />
          </svg>
        );

      // 33. CMAT - Technical council chakra
      case 'CMAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#283593" />
            <circle cx="12" cy="12" r="7" stroke="#FF9800" strokeWidth="1.5" strokeDasharray="2.5 1.5" />
            <circle cx="12" cy="12" r="2.5" fill="#FF9800" />
          </svg>
        );

      // 34. NMAT - Graduate laurel & star
      case 'NMAT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#4E342E" />
            <path d="M6 14C6 9 8 7 12 7C16 7 18 9 18 14" stroke="#FFB74D" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 5L13.2 8.5H16.8L14 10.5L15 14L12 12L9 14L10 10.5L7.2 8.5H10.8L12 5Z" fill="#FF9800" />
          </svg>
        );

      // 35. TOEIC - Corporate speech bubbles
      case 'TOEIC':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00838F" />
            <circle cx="10" cy="11" r="5" fill="#FFFFFF" />
            <path d="M15 11C16.6 11 18 12.3 18 14C18 14.8 17.7 15.5 17.2 16L18 18L15.8 17.3C15.5 17.4 15.3 17.5 15 17.5C13.3 17.5 12 16.2 12 14.5C12 12.8 13.3 11 15 11Z" fill="#FF9800" />
          </svg>
        );

      // 36. OET - Medical healthcare cross & stethoscope
      case 'OET':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00796B" />
            <path d="M10 5H14V9H18V13H14V17H10V13H6V9H10V5Z" fill="#FFFFFF" />
            <circle cx="12" cy="11" r="2" fill="#E53935" />
          </svg>
        );

      // 37. JLPT - Torii gate & rising sun
      case 'JLPT':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#C62828" />
            <circle cx="12" cy="12" r="5" fill="#FFFFFF" />
            <path d="M5 8H19M7 10H17M8 10V18M16 10V18" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        );

      // 38. TOPIK - Korean Taegeuk red & blue circle
      case 'TOPIK':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
            <circle cx="12" cy="12" r="7" fill="#C62828" />
            <path d="M12 5C8.1 5 5 8.1 5 12C5 15.9 8.1 19 12 19C10 19 8.5 17.5 8.5 15.5C8.5 13.5 12 13.5 12 12C12 10.5 10.5 9 12 9C13.5 9 15.5 10.5 15.5 12C15.5 15.9 12 19 12 19" fill="#1565C0" />
          </svg>
        );

      // 39. DELE - Spanish solar rosette
      case 'DELE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#C2185B" />
            <circle cx="12" cy="12" r="6" fill="#FDD835" />
            <path d="M12 4V6M12 18V20M4 12H6M18 12H20M6.3 6.3L7.8 7.8M16.2 16.2L17.7 17.7M6.3 17.7L7.8 16.2M16.2 7.8L17.7 6.3" stroke="#C2185B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 40. DELF - French tricolor rosette
      case 'DELF':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#ECEFF1" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M4 4H9.3V20H4V4Z" fill="#1565C0" />
            <path d="M9.3 4H14.6V20H9.3V4Z" fill="#FFFFFF" />
            <path d="M14.6 4H20V20H14.6V4Z" fill="#D32F2F" />
          </svg>
        );

      // 41. GOETHE - Goethe green stylized G
      case 'GOETHE':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#2E7D32" />
            <circle cx="12" cy="12" r="7" stroke="#A5D6A7" strokeWidth="1.5" />
            <path d="M16 9C15 7.5 13.5 7 12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17C14.5 17 16 15 16 13H12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 42. HSK - Chinese Han character seal
      case 'HSK':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#D84315" />
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="#FFCCBC" strokeWidth="1.2" />
            <text x="12" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="900" fontFamily="sans-serif">汉</text>
          </svg>
        );

      // 43. NEET - Caduceus medical shield
      case 'NEET':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#1B5E20" />
            <path d="M12 4V20M12 5C9 8 9 11 12 13C15 15 15 18 12 20" stroke="#FFD54F" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M7 7C9 9 15 9 17 7" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="12" cy="4" r="1.5" fill="#FFD54F" />
          </svg>
        );

      // 44. Defense & Uniformed Services (NDA, CDS, AFCAT, CAPF)
      case 'NDA':
      case 'CDS':
      case 'AFCAT':
      case 'CAPF':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#2E4053" />
            <path d="M6 5H18V12C18 16.5 12 20 12 20C12 20 6 16.5 6 12V5Z" fill="#1B2631" stroke="#FF9800" strokeWidth="1.4" />
            <path d="M12 7V16M9 9H15" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      // 45. Civil & Public Services (UPSC_CSE, SSC_CGL, IBPS_PO, SBI_PO, RRB_NTPC)
      case 'UPSC_CSE':
      case 'SSC_CGL':
      case 'IBPS_PO':
      case 'SBI_PO':
      case 'RRB_NTPC':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#0D47A1" />
            <circle cx="12" cy="12" r="7.5" stroke="#FFB74D" strokeWidth="1.3" />
            <circle cx="12" cy="12" r="4" fill="#FF9800" />
            <path d="M12 4.5V6M12 18V19.5M4.5 12H6M18 12H19.5" stroke="#FFD54F" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      // 46. Hospitality & Professional Admissions
      case 'NCHM_JEE':
      case 'PROFESSIONAL_ADMISSIONS':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#E65100" />
            <path d="M12 4L19 8V16L12 20L5 16V8L12 4Z" stroke="#FFE082" strokeWidth="1.4" fill="#BF360C" />
            <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
          </svg>
        );

      // Default Clean Professional Exam Emblem with initials
      default: {
        const initials = code.substring(0, 3);
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#FFF3E0" stroke="#FF9800" strokeWidth="1.2" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fill="#E65100"
              fontSize={initials.length > 2 ? '6' : '7.5'}
              fontWeight="800"
              fontFamily="sans-serif"
            >
              {initials}
            </text>
          </svg>
        );
      }
    }
  };

  return (
    <span
      className={className}
      style={baseContainerStyle}
      title={`${code} Official Exam Emblem`}
    >
      {renderSvg()}
    </span>
  );
};
