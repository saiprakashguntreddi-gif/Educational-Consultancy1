import { prisma } from '../shared/database/prisma.service';
import { seedScholarshipsCatalog } from '../modules/scholarships/scholarships.seed';

async function main() {
  console.log('🚀 Seeding updated scholarships catalog...');
  const count = await seedScholarshipsCatalog();
  console.log(`✅ Successfully upserted ${count} scholarships into database!`);
  const all = await prisma.scholarship.groupBy({
    by: ['destinationCountry'],
    _count: { id: true }
  });
  console.log('Scholarships by destination country:', JSON.stringify(all, null, 2));
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error seeding scholarships:', err);
  process.exit(1);
});
