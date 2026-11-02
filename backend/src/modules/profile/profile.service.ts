import { prisma } from '../../shared/database/prisma.service';
import { VerificationStatus } from '../../config/constants';
import { ProfileIntakeDto, VerifyProfileDto } from './profile.validation';
import { StudentProfileRecord } from './profile.types';
import { PreferencesService } from '../preferences/preferences.service';
import { EducationService } from '../education/education.service';

export class ProfileService {
  /**
   * Save or update the intake record for a student
   * Module 1 creates or updates the profile with the 9 mandatory fields.
   */
  public static async saveIntake(
    userId: string,
    dto: ProfileIntakeDto
  ): Promise<StudentProfileRecord> {
    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      create: {
        userId,
        fullName: dto.fullName,
        gender: dto.gender as any,
        grade: dto.grade,
        contactEmail: dto.contactEmail,
        phone: dto.phone,
        addressStreet: dto.address.street,
        addressCity: dto.address.city,
        addressState: dto.address.state,
        addressPostalCode: dto.address.postalCode,
        addressCountry: dto.address.country,
        board: dto.board,
        citizenship: dto.citizenship,
        passingOutYear: dto.passingOutYear,
        verificationStatus: VerificationStatus.PENDING as any,
      },
      update: {
        fullName: dto.fullName,
        gender: dto.gender as any,
        grade: dto.grade,
        contactEmail: dto.contactEmail,
        phone: dto.phone,
        addressStreet: dto.address.street,
        addressCity: dto.address.city,
        addressState: dto.address.state,
        addressPostalCode: dto.address.postalCode,
        addressCountry: dto.address.country,
        board: dto.board,
        citizenship: dto.citizenship,
        passingOutYear: dto.passingOutYear,
        // When updated by student, status resets to PENDING for re-verification
        verificationStatus: VerificationStatus.PENDING as any,
      },
    });

    // Record audit log for intake submission
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PROFILE_INTAKE_SUBMITTED',
        details: JSON.stringify({
          profileId: profile.id,
          fullName: profile.fullName,
          grade: profile.grade,
          board: profile.board,
        }),
      },
    });

    return this.mapToRecord(profile);
  }

  /**
   * Get student profile by associated User ID
   */
  public static async getProfileByUserId(userId: string): Promise<StudentProfileRecord | null> {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        assignedCounsellor: {
          select: {
            id: true,
            email: true,
            counsellorProfile: true,
          },
        },
      },
    });

    if (!profile) return null;
    return this.mapToRecord(profile);
  }

  /**
   * High-performance unified summary endpoint:
   * Retrieves profile, preferences, education, and assigned counsellor in a single fast database query.
   */
  public static async getDashboardSummary(userId: string) {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        assignedCounsellor: {
          select: {
            id: true,
            email: true,
            counsellorProfile: true,
          },
        },
        preference: true,
        education: true,
      },
    });

    if (!profile) return null;

    return {
      profile: this.mapToRecord(profile),
      preferences: profile.preference ? PreferencesService.mapToRecord(profile.preference) : null,
      education: profile.education ? EducationService.mapToRecord(profile.education) : null,
      assignedCounsellor: profile.assignedCounsellor ? {
        id: profile.assignedCounsellor.id,
        email: profile.assignedCounsellor.email,
        fullName: profile.assignedCounsellor.counsellorProfile?.fullName || profile.assignedCounsellor.email,
        phone: profile.assignedCounsellor.counsellorProfile?.phone || null,
        designation: (profile.assignedCounsellor.counsellorProfile as any)?.designation || 'Educational Counsellor',
      } : null,
    };
  }

  /**
   * Get student profile by Profile ID (for Counsellor / Admin)
   */
  public static async getProfileById(profileId: string): Promise<StudentProfileRecord | null> {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId },
      include: {
        assignedCounsellor: {
          select: {
            id: true,
            email: true,
            counsellorProfile: true,
          },
        },
      },
    });

    if (!profile) return null;
    return this.mapToRecord(profile);
  }

  /**
   * List profiles with pagination and optional status filter (for Counsellor / Admin)
   */
  public static async listProfiles(params: {
    page?: number;
    limit?: number;
    status?: VerificationStatus;
  }): Promise<{ profiles: StudentProfileRecord[]; total: number; page: number; totalPages: number }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.status) {
      where.verificationStatus = params.status;
    }

    const [total, items] = await Promise.all([
      prisma.studentProfile.count({ where }),
      prisma.studentProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      profiles: items.map(this.mapToRecord),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update student verification status (Counsellor / Admin action)
   */
  public static async updateVerification(
    profileId: string,
    dto: VerifyProfileDto,
    verifiedByUserId: string
  ): Promise<StudentProfileRecord> {
    const existing = await prisma.studentProfile.findUnique({
      where: { id: profileId },
    });

    if (!existing) {
      throw new Error('Student profile not found');
    }

    const updated = await prisma.studentProfile.update({
      where: { id: profileId },
      data: {
        verificationStatus: dto.status as any,
        verificationNotes: dto.notes ?? null,
        verifiedAt: dto.status === VerificationStatus.VERIFIED ? new Date() : null,
        verifiedBy: verifiedByUserId,
      },
    });

    // Record audit log for verification action
    await prisma.auditLog.create({
      data: {
        userId: verifiedByUserId,
        action: `PROFILE_STATUS_${dto.status}`,
        details: JSON.stringify({
          profileId,
          newStatus: dto.status,
          notes: dto.notes,
        }),
      },
    });

    return this.mapToRecord(updated);
  }

  /**
   * Extend student access for continuing / postgraduate studies (+3 Years)
   */
  public static async extendAccess(userId: string): Promise<StudentProfileRecord> {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new Error('Student profile not found');
    }

    const now = new Date();
    const updated = await prisma.studentProfile.update({
      where: { id: profile.id },
      data: {
        enrolledAt: now,
        isEnrolled: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'ACCESS_LIFECYCLE_EXTENDED',
        details: JSON.stringify({
          studentProfileId: profile.id,
          extendedAt: now.toISOString(),
          additionalYears: 3,
          note: 'Postgraduate continuation extension activated',
        }),
      },
    });

    return this.mapToRecord(updated);
  }

  /**
   * Helper to format Prisma model into domain StudentProfileRecord
   */
  private static mapToRecord(raw: any): StudentProfileRecord {
    const isEnrolled = Boolean(raw.isEnrolled);
    const enrolledDate = raw.enrolledAt ? new Date(raw.enrolledAt) : (isEnrolled ? new Date(raw.createdAt) : null);
    const now = new Date();

    let accessLifecycle: any = undefined;
    if (isEnrolled && enrolledDate) {
      const validityYears = 5;
      const expiresAt = new Date(enrolledDate.getTime() + validityYears * 365.25 * 24 * 60 * 60 * 1000);
      const diffMs = expiresAt.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      const yearsRemaining = +(daysRemaining / 365.25).toFixed(1);

      const elapsedMs = now.getTime() - enrolledDate.getTime();
      const elapsedYears = elapsedMs / (1000 * 60 * 60 * 24 * 365.25);

      let phase = 'ACTIVE_GUIDANCE';
      let phaseTitle = 'Active Guidance Phase (Years 1–3)';
      let phaseDescription = 'Full 1-on-1 certified counsellor consultation, live mock tests, 3-tier fit algorithms, and admissions planning unlocked.';
      let canExtend = false;

      if (elapsedYears >= 5) {
        phase = 'EXTENSION_ELIGIBLE';
        phaseTitle = 'Postgraduate Extension Window (Year 5+)';
        phaseDescription = 'Standard 5-year academic lifecycle completed. 1-click extension available for Master’s, Doctoral, or Fellowship planning.';
        canExtend = true;
      } else if (elapsedYears >= 3) {
        phase = 'ALUMNI_SELF_SERVICE';
        phaseTitle = 'Alumni & Self-Service Phase (Years 4–5)';
        phaseDescription = 'Continuous access to college catalogs, fee comparisons, saved shortlists, notes, and academic dossier exports.';
        canExtend = true;
      }

      accessLifecycle = {
        isEnrolled: true,
        enrolledAt: enrolledDate,
        validityYears,
        expiresAt,
        daysRemaining,
        yearsRemaining,
        phase,
        phaseTitle,
        phaseDescription,
        canExtend,
      };
    } else {
      accessLifecycle = {
        isEnrolled: false,
        enrolledAt: null,
        validityYears: 5,
        expiresAt: null,
        daysRemaining: null,
        yearsRemaining: 5,
        phase: 'ACTIVE_GUIDANCE',
        phaseTitle: 'Pre-Enrolment Onboarding',
        phaseDescription: 'Complete profile intake and 1-on-1 counsellor consultation to activate your 5-Year Academic Lifecycle access window.',
        canExtend: false,
      };
    }

    return {
      id: raw.id,
      userId: raw.userId,
      fullName: raw.fullName,
      gender: raw.gender as any,
      grade: raw.grade,
      contactEmail: raw.contactEmail,
      phone: raw.phone,
      address: {
        street: raw.addressStreet,
        city: raw.addressCity,
        state: raw.addressState,
        postalCode: raw.addressPostalCode,
        country: raw.addressCountry,
      },
      board: raw.board,
      citizenship: raw.citizenship,
      passingOutYear: raw.passingOutYear,
      verificationStatus: raw.verificationStatus as any,
      verifiedAt: raw.verifiedAt,
      verifiedBy: raw.verifiedBy,
      verificationNotes: raw.verificationNotes,
      isEnrolled: Boolean(raw.isEnrolled),
      enrolledAt: raw.enrolledAt ? new Date(raw.enrolledAt) : null,
      accessLifecycle,
      assignedCounsellorId: raw.assignedCounsellorId || null,
      assignedCounsellor: raw.assignedCounsellor || null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
