import { Gender, VerificationStatus } from '../../config/constants';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StudentProfileIntakeInput {
  fullName: string;
  gender: Gender;
  grade: string;
  contactEmail: string;
  phone: string;
  address: Address;
  board: string;
  citizenship: string;
  passingOutYear: number;
}

export interface AccessLifecycle {
  isEnrolled: boolean;
  enrolledAt: Date | string | null;
  validityYears: number;
  expiresAt: Date | string | null;
  daysRemaining: number | null;
  yearsRemaining: number | null;
  phase: 'ACTIVE_GUIDANCE' | 'ALUMNI_SELF_SERVICE' | 'EXTENSION_ELIGIBLE';
  phaseTitle: string;
  phaseDescription: string;
  canExtend: boolean;
}

export interface StudentProfileRecord extends StudentProfileIntakeInput {
  id: string;
  userId: string;
  verificationStatus: VerificationStatus;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  verificationNotes: string | null;
  isEnrolled?: boolean;
  enrolledAt?: Date | null;
  accessLifecycle?: AccessLifecycle;
  assignedCounsellorId?: string | null;
  assignedCounsellor?: any;
  createdAt: Date;
  updatedAt: Date;
}
