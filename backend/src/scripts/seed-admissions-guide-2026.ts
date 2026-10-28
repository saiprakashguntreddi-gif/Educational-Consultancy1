import { prisma } from '../shared/database/prisma.service';
import { COUNTRIES_DATA } from '../modules/colleges/data/countries.data';
import { USA_INSTITUTIONS } from '../modules/colleges/data/institutions-usa.data';
import { UK_INSTITUTIONS } from '../modules/colleges/data/institutions-uk.data';
import { AUSTRALIA_INSTITUTIONS } from '../modules/colleges/data/institutions-australia.data';
import { GERMANY_INSTITUTIONS } from '../modules/colleges/data/institutions-germany.data';
import { CANADA_INSTITUTIONS } from '../modules/colleges/data/institutions-canada.data';
import { DetailedInstitutionSeed } from '../modules/colleges/data/institutions-usa.data';

async function seedAdmissionsGuide2026() {
  console.log('🚀 Starting Admissions Guide 2026 Database Seeder...');
  console.log('--------------------------------------------------');

  // 1. Upsert Countries
  console.log(`\n📌 1. Upserting ${COUNTRIES_DATA.length} Destination Countries...`);
  const countryIdMap: Record<string, string> = {};

  for (const c of COUNTRIES_DATA) {
    const upserted = await prisma.country.upsert({
      where: { code: c.code },
      update: {
        name: c.name,
        currency: c.currency,
        currencySymbol: c.currencySymbol,
        flag: c.flag,
        bannerImageUrl: c.bannerImageUrl,
        tagline: c.tagline,
        avgTuitionRange: c.avgTuitionRange,
        livingCostRange: c.livingCostRange,
        postStudyWorkVisa: c.postStudyWorkVisa,
        postStudyWorkSourceUrl: c.postStudyWorkSourceUrl,
        postStudyWorkCheckedAt: c.postStudyWorkCheckedAt,
        visaNotes: c.visaNotes,
        sourceUrl: c.sourceUrl,
        lastVerifiedAt: c.lastVerifiedAt,
      },
      create: {
        code: c.code,
        name: c.name,
        currency: c.currency,
        currencySymbol: c.currencySymbol,
        flag: c.flag,
        bannerImageUrl: c.bannerImageUrl,
        tagline: c.tagline,
        avgTuitionRange: c.avgTuitionRange,
        livingCostRange: c.livingCostRange,
        postStudyWorkVisa: c.postStudyWorkVisa,
        postStudyWorkSourceUrl: c.postStudyWorkSourceUrl,
        postStudyWorkCheckedAt: c.postStudyWorkCheckedAt,
        visaNotes: c.visaNotes,
        sourceUrl: c.sourceUrl,
        lastVerifiedAt: c.lastVerifiedAt,
      },
    });

    countryIdMap[c.name] = upserted.id;
    // Map alternate names
    if (c.code === 'USA') countryIdMap['United States'] = upserted.id;
    if (c.code === 'GBR') countryIdMap['United Kingdom'] = upserted.id;
    if (c.code === 'AUS') countryIdMap['Australia'] = upserted.id;
    if (c.code === 'DEU') countryIdMap['Germany'] = upserted.id;
    if (c.code === 'CAN') countryIdMap['Canada'] = upserted.id;

    console.log(`   ✓ Country [${c.code}] ${c.name} (ID: ${upserted.id})`);
  }

  // 2. Prepare Country Datasets
  const datasets: { countryName: string; list: DetailedInstitutionSeed[] }[] = [
    { countryName: 'United States', list: USA_INSTITUTIONS },
    { countryName: 'United Kingdom', list: UK_INSTITUTIONS },
    { countryName: 'Australia', list: AUSTRALIA_INSTITUTIONS },
    { countryName: 'Germany', list: GERMANY_INSTITUTIONS },
    { countryName: 'Canada', list: CANADA_INSTITUTIONS },
  ];

  let totalInstitutions = 0;
  let totalCourses = 0;
  let totalExamRules = 0;

  for (const ds of datasets) {
    const countryId = countryIdMap[ds.countryName];
    console.log(`\n📌 2. Seeding ${ds.list.length} Institutions for ${ds.countryName}...`);

    for (const inst of ds.list) {
      // Upsert Institution
      const instRecord = await prisma.institution.upsert({
        where: { slug: inst.slug },
        update: {
          name: inst.name,
          country: inst.country,
          city: inst.city,
          state: inst.state,
          institutionType: inst.institutionType,
          establishedYear: inst.establishedYear,
          counsellingTier: inst.counsellingTier,
          managedTier: inst.managedTier,
          overview: inst.overview,
          admissionsOverview: inst.admissionsOverview,
          academicProfileSummary: inst.academicProfileSummary,
          examRequirementsSummary: inst.examRequirementsSummary,
          tuitionStructureNotes: inst.tuitionStructureNotes,
          livingCostEstimate: inst.livingCostEstimate,
          postStudyWorkDetails: inst.postStudyWorkDetails,
          minAnnualFee: inst.minAnnualFee,
          maxAnnualFee: inst.maxAnnualFee,
          feeCurrency: inst.feeCurrency,
          officialWebsiteUrl: inst.officialWebsiteUrl,
          sourceUrl: inst.sourceUrl,
          sourceType: 'OFFICIAL_DOCUMENT_2026',
          verificationConfidence: inst.country === 'Canada' ? 'PROGRAMME_SPECIFIC' : 'HIGH',
          lastVerifiedAt: new Date('2026-02-01'),
          bannerImageUrl: inst.bannerImageUrl,
          rankingInfo: inst.rankingInfo,
          campusFacilities: JSON.stringify(inst.campusFacilities),
          placementInfo: inst.placementInfo,
          countryId: countryId || null,
          isPublished: true,
          isVerified: true,
          isActive: true,
          status: 'PUBLISHED',
        },
        create: {
          slug: inst.slug,
          name: inst.name,
          country: inst.country,
          city: inst.city,
          state: inst.state,
          institutionType: inst.institutionType,
          establishedYear: inst.establishedYear,
          counsellingTier: inst.counsellingTier,
          managedTier: inst.managedTier,
          overview: inst.overview,
          admissionsOverview: inst.admissionsOverview,
          academicProfileSummary: inst.academicProfileSummary,
          examRequirementsSummary: inst.examRequirementsSummary,
          tuitionStructureNotes: inst.tuitionStructureNotes,
          livingCostEstimate: inst.livingCostEstimate,
          postStudyWorkDetails: inst.postStudyWorkDetails,
          minAnnualFee: inst.minAnnualFee,
          maxAnnualFee: inst.maxAnnualFee,
          feeCurrency: inst.feeCurrency,
          officialWebsiteUrl: inst.officialWebsiteUrl,
          sourceUrl: inst.sourceUrl,
          sourceType: 'OFFICIAL_DOCUMENT_2026',
          verificationConfidence: inst.country === 'Canada' ? 'PROGRAMME_SPECIFIC' : 'HIGH',
          lastVerifiedAt: new Date('2026-02-01'),
          bannerImageUrl: inst.bannerImageUrl,
          rankingInfo: inst.rankingInfo,
          campusFacilities: JSON.stringify(inst.campusFacilities),
          placementInfo: inst.placementInfo,
          countryId: countryId || null,
          isPublished: true,
          isVerified: true,
          isActive: true,
          status: 'PUBLISHED',
        },
      });

      totalInstitutions++;

      // Seed Courses for this institution
      for (const course of inst.courses) {
        // Find existing course by name and institutionId or create
        const existingCourse = await prisma.course.findFirst({
          where: {
            institutionId: instRecord.id,
            name: course.name,
          },
        });

        if (existingCourse) {
          await prisma.course.update({
            where: { id: existingCourse.id },
            data: {
              department: course.department,
              specialization: course.specialization,
              level: course.level,
              durationYears: course.durationYears,
              durationText: course.durationText,
              annualTuitionFee: course.annualTuitionFee,
              feeCurrency: course.feeCurrency,
              feeRange: course.feeRange,
              entranceExamsRequired: JSON.stringify(course.entranceExamsRequired),
              description: course.description,
              eligibilityCriteria: course.eligibilityCriteria,
              isPopular: course.isPopular,
              isPublished: true,
            },
          });
        } else {
          await prisma.course.create({
            data: {
              institutionId: instRecord.id,
              name: course.name,
              department: course.department,
              specialization: course.specialization,
              level: course.level,
              durationYears: course.durationYears,
              durationText: course.durationText,
              annualTuitionFee: course.annualTuitionFee,
              feeCurrency: course.feeCurrency,
              feeRange: course.feeRange,
              entranceExamsRequired: JSON.stringify(course.entranceExamsRequired),
              description: course.description,
              eligibilityCriteria: course.eligibilityCriteria,
              isPopular: course.isPopular,
              isPublished: true,
            },
          });
        }
        totalCourses++;
      }

      // Seed Exam Rules for this institution
      if (inst.examRules && inst.examRules.length > 0) {
        // Clean old rules for clean upsert
        await prisma.institutionExamRule.deleteMany({
          where: { institutionId: instRecord.id },
        });

        for (const rule of inst.examRules) {
          await prisma.institutionExamRule.create({
            data: {
              institutionId: instRecord.id,
              examCode: rule.examCode,
              ruleStatus: rule.ruleStatus,
              minScore: rule.minScore || null,
              notes: rule.notes || null,
              sourceUrl: inst.sourceUrl,
              checkedAt: new Date('2026-02-01'),
            },
          });
          totalExamRules++;
        }
      }
    }
  }

  console.log('\n==================================================');
  console.log('✅ ADMISSIONS GUIDE 2026 SEEDING COMPLETED!');
  console.log(`   Countries seeded:     ${COUNTRIES_DATA.length}`);
  console.log(`   Institutions seeded:  ${totalInstitutions} (USA: 25, UK: 30, AUS: 27, DEU: 26, CAN: 30)`);
  console.log(`   Courses seeded:       ${totalCourses}`);
  console.log(`   Exam rules mapped:    ${totalExamRules}`);
  console.log('==================================================\n');

  await prisma.$disconnect();
}

seedAdmissionsGuide2026().catch(err => {
  console.error('❌ Seeder error:', err);
  process.exit(1);
});

