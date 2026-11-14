const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Supabase database...');

  const categories = [
    { name: 'Information Technology', description: 'Software development, web development, IT support, technical tasks' },
    { name: 'Design & Creative', description: 'Graphic design, UI/UX, video editing, branding, illustration' },
    { name: 'Marketing & Sales', description: 'Social media management, digital marketing, content creation, sales support' },
    { name: 'Tutoring & Education', description: 'Academic tutoring, language teaching, homework assistance' },
    { name: 'Writing & Translation', description: 'Article writing, copywriting, proofreading, translation services' },
    { name: 'Administrative Support', description: 'Data entry, virtual assistance, office support, scheduling' },
    { name: 'Customer Service', description: 'Customer support, chat support, phone assistance' },
    { name: 'Hospitality & Events', description: 'Event coordination, catering assistance, host/hostess roles' }
  ];

  for (const cat of categories) {
    await prisma.jobCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
  }

  const skills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'PHP', 'HTML/CSS',
    'Graphic Design', 'Figma', 'Photoshop', 'Video Editing',
    'Content Writing', 'Copywriting', 'SEO', 'Social Media Marketing',
    'Data Entry', 'Excel / Google Sheets', 'Customer Service',
    'English Tutoring', 'Mathematics Tutoring', 'Research'
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { name: s },
      update: {},
      create: { name: s }
    });
  }

  await prisma.siteSetting.upsert({
    where: { settingKey: 'footer_links' },
    update: {},
    create: {
      settingKey: 'footer_links',
      settingValue: JSON.stringify({
        about: 'About Us',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        careers: 'Careers'
      })
    }
  });

  const catCount = await prisma.jobCategory.count();
  const skillCount = await prisma.skill.count();
  console.log(`Seeding complete: ${catCount} categories, ${skillCount} skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
