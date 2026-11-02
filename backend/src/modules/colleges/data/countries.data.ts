export interface SeedCountryData {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  bannerImageUrl: string;
  tagline: string;
  avgTuitionRange: string;
  livingCostRange: string;
  postStudyWorkVisa: string;
  postStudyWorkSourceUrl: string;
  postStudyWorkCheckedAt: Date;
  visaNotes: string;
  sourceUrl: string;
  lastVerifiedAt: Date;
}

export const COUNTRIES_DATA: SeedCountryData[] = [
  {
    code: 'USA',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    bannerImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Ivy League & R1 Research Powerhouses',
    avgTuitionRange: '$25,000 – $55,000 / yr',
    livingCostRange: '$12,000 – $18,000 / yr',
    postStudyWorkVisa: '12 – 36 Months (STEM OPT)',
    postStudyWorkSourceUrl: 'https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies/graduate',
    postStudyWorkCheckedAt: new Date('2026-01-15'),
    visaNotes: 'F-1 Student Visa. STEM-designated degree programs are eligible for a 24-month OPT extension (total 36 months). Proof of funds required for I-20 issuance.',
    sourceUrl: 'https://educationusa.state.gov/your-5-steps-us-study/finance-your-studies/graduate',
    lastVerifiedAt: new Date('2026-02-01'),
  },
  {
    code: 'GBR',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    bannerImageUrl: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=1200&q=85',
    tagline: 'World-Ranked Intensive 1-Year Masters',
    avgTuitionRange: '£18,000 – £35,000 / yr',
    livingCostRange: '£12,000 – £16,000 / yr',
    postStudyWorkVisa: '2 Years Graduate Route (18 mo from 2027)',
    postStudyWorkSourceUrl: 'https://www.gov.uk/graduate-visa',
    postStudyWorkCheckedAt: new Date('2026-01-20'),
    visaNotes: 'UK Student Visa. Graduate Route provides 2 years unsponsored work for applications lodged by 31 Dec 2026 (18 months from 1 Jan 2027; 3 years for PhD).',
    sourceUrl: 'https://sheffield.ac.uk/international/entry-requirements/india',
    lastVerifiedAt: new Date('2026-02-01'),
  },
  {
    code: 'AUS',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    bannerImageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Group of Eight & High Quality of Life',
    avgTuitionRange: 'AUD 30,000 – $55,000 / yr',
    livingCostRange: 'AUD 20,000 – $29,710 / yr',
    postStudyWorkVisa: '2 – 4 Years (Subclass 485 Post-Study)',
    postStudyWorkSourceUrl: 'https://www.studyaustralia.gov.au/en/plan-your-move/visa-application-process',
    postStudyWorkCheckedAt: new Date('2026-01-10'),
    visaNotes: 'Subclass 500 Student Visa. Department of Home Affairs requires evidence of AUD 29,710/year for living expenses. Overseas Student Health Cover (OSHC) mandatory.',
    sourceUrl: 'https://www.studyaustralia.gov.au/en/plan-your-studies/universities-and-higher-education/postgraduate-qualifications',
    lastVerifiedAt: new Date('2026-02-01'),
  },
  {
    code: 'DEU',
    name: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
    bannerImageUrl: 'https://images.unsplash.com/photo-1534313314376-a72289b6181e?auto=format&fit=crop&w=1200&q=85',
    tagline: 'TU9 Engineering & Low-Tuition Public Universities',
    avgTuitionRange: '€0 – €3,000 / yr',
    livingCostRange: '€11,208 – €14,400 / yr',
    postStudyWorkVisa: '18 Months Job Seeker Residence Permit',
    postStudyWorkSourceUrl: 'https://www.daad.de/en/studying-in-germany/living-in-germany/finances/',
    postStudyWorkCheckedAt: new Date('2026-01-18'),
    visaNotes: 'National Visa Type D. Most public master degrees have no tuition (semester fee €70–€430; non-EU in Baden-Württemberg €1,500/sem). Blocked account €11,208/yr required. APS certificate mandatory for India.',
    sourceUrl: 'https://www.daad.in/files/2024/01/Master-India-Jan-2024.pdf',
    lastVerifiedAt: new Date('2026-02-01'),
  },
  {
    code: 'CAN',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: 'C$',
    flag: '🇨🇦',
    bannerImageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=85',
    tagline: 'U15 Research Excellence & Applied Polytechnic Diplomas',
    avgTuitionRange: 'CAD 16,000 – $35,000 / yr',
    livingCostRange: 'CAD 20,635 – $24,000 / yr',
    postStudyWorkVisa: 'Up to 3 Years PGWP (DLI & Field Dependent)',
    postStudyWorkSourceUrl: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/eligibility.html',
    postStudyWorkCheckedAt: new Date('2026-01-25'),
    visaNotes: 'Study Permit. PGWP eligibility requires graduating from an eligible DLI in an approved program. College diploma grads must check field-of-study list. Living cost requirement CAD 20,635 minimum.',
    sourceUrl: 'https://www.educanada.ca/programs-programmes/education_cost-cout_education.aspx?lang=eng',
    lastVerifiedAt: new Date('2026-02-01'),
  },
  {
    code: 'IND',
    name: 'India',
    currency: 'INR',
    currencySymbol: '₹',
    flag: '🇮🇳',
    bannerImageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Premier Central, State, Research & Autonomous Universities',
    avgTuitionRange: '₹30,000 – ₹3,50,000 / yr',
    livingCostRange: '₹60,000 – ₹1,80,000 / yr',
    postStudyWorkVisa: 'Domestic / Campus Placement & Direct Employment',
    postStudyWorkSourceUrl: 'https://www.education.gov.in/',
    postStudyWorkCheckedAt: new Date('2026-02-01'),
    visaNotes: 'Domestic education governed by UGC, AICTE, and State Councils. State quota reservation, entrance examination scores (AP EAPCET, JEE, CUET, GATE, CAT), and central counselling apply.',
    sourceUrl: 'https://www.education.gov.in/',
    lastVerifiedAt: new Date('2026-02-01'),
  },
];

