const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Standard bcrypt hash for "Password123!"
const DEFAULT_PASSWORD_HASH = '$2y$10$4uRgDou2Wn3UBcMR/MpGW.X3EZJJdmbhoNiDzJZk0RV4O.YXbaaai';

async function main() {
  console.log('--- Starting Complete UniWiz Data Seeding ---');

  // =========================================================================
  // 1. SITE SETTINGS
  // =========================================================================
  console.log('Seeding site settings...');
  await prisma.siteSetting.upsert({
    where: { settingKey: 'footer_links' },
    update: {},
    create: {
      settingKey: 'footer_links',
      settingValue: JSON.stringify({
        about: 'About Us',
        contact: 'Contact Support',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        careers: 'Campus Careers'
      })
    }
  });

  // =========================================================================
  // 2. JOB CATEGORIES
  // =========================================================================
  console.log('Seeding job categories...');
  const categoryData = [
    { name: 'Information Technology', description: 'Software development, web development, IT support, technical tasks' },
    { name: 'Design & Creative', description: 'Graphic design, UI/UX, video editing, branding, illustration' },
    { name: 'Marketing & Sales', description: 'Social media management, digital marketing, content creation, sales support' },
    { name: 'Tutoring & Education', description: 'Academic tutoring, language teaching, homework assistance' },
    { name: 'Writing & Translation', description: 'Article writing, copywriting, proofreading, translation services' },
    { name: 'Administrative Support', description: 'Data entry, virtual assistance, office support, scheduling' },
    { name: 'Customer Service', description: 'Customer support, chat support, phone assistance' },
    { name: 'Hospitality & Events', description: 'Event coordination, catering assistance, host/hostess roles' }
  ];

  const categoryMap = {};
  for (const cat of categoryData) {
    const record = await prisma.jobCategory.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: cat
    });
    categoryMap[cat.name] = record.id;
  }

  // =========================================================================
  // 3. SKILLS
  // =========================================================================
  console.log('Seeding skills...');
  const skillsList = [
    'JavaScript', 'Python', 'React', 'Node.js', 'PHP', 'HTML/CSS', 'Tailwind CSS', 'Git',
    'Graphic Design', 'Figma', 'Photoshop', 'Video Editing', 'UI/UX',
    'Content Writing', 'Copywriting', 'SEO', 'Social Media Marketing',
    'Data Entry', 'Excel / Google Sheets', 'Customer Service',
    'English Tutoring', 'Mathematics Tutoring', 'Research'
  ];

  for (const skillName of skillsList) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName }
    });
  }

  // =========================================================================
  // 4. USERS & PROFILES
  // =========================================================================
  console.log('Seeding users and profiles...');

  // 4.1 Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@uniwiz.lk' },
    update: {},
    create: {
      email: 'admin@uniwiz.lk',
      password: DEFAULT_PASSWORD_HASH,
      firstName: 'Admin',
      lastName: 'UniWiz',
      role: 'ADMIN',
      status: 'ACTIVE',
      isVerified: true,
      emailVerifiedAt: new Date()
    }
  });

  // 4.2 Publishers (Employers)
  const publishersData = [
    {
      email: 'hr@techsolutions.lk',
      firstName: 'Saman',
      lastName: 'Perera',
      companyName: 'Tech Solutions Lanka',
      profile: {
        about: 'Tech Solutions Lanka is a premier software development consultancy specializing in web, mobile, and cloud systems. We actively mentor and hire talented university students for part-time and project roles.',
        industry: 'Information Technology',
        websiteUrl: 'https://techsolutions.lk',
        address: 'Level 4, Galle Road, Colombo 03',
        phoneNumber: '+94 11 234 5678'
      }
    },
    {
      email: 'jobs@creativestudio.lk',
      firstName: 'Kavindi',
      lastName: 'Silva',
      companyName: 'Creative Studio Colombo',
      profile: {
        about: 'Boutique digital design and branding agency producing award-winning UI/UX, graphic identities, and motion graphics for regional and global clients.',
        industry: 'Design & Media',
        websiteUrl: 'https://creativestudio.lk',
        address: '15 Horton Place, Colombo 07',
        phoneNumber: '+94 11 789 1234'
      }
    },
    {
      email: 'academics@uwu.ac.lk',
      firstName: 'Dr. Nihal',
      lastName: 'Fernando',
      companyName: 'Uva Wellassa Campus Support',
      profile: {
        about: 'University academic assistance and student employment initiative, matching talented senior undergraduates with part-time teaching, lab, and tutoring positions.',
        industry: 'Education & Academia',
        websiteUrl: 'https://uwu.ac.lk',
        address: 'Passara Road, Badulla',
        phoneNumber: '+94 55 222 6622'
      }
    },
    {
      email: 'careers@apexdigital.lk',
      firstName: 'Roshan',
      lastName: 'Gunawardena',
      companyName: 'Apex Digital Marketing',
      profile: {
        about: 'Fast-growing digital marketing agency helping high-growth brands scale with SEO, social media strategies, and content production.',
        industry: 'Marketing & Advertising',
        websiteUrl: 'https://apexdigital.lk',
        address: '72 Peradeniya Road, Kandy',
        phoneNumber: '+94 81 220 4455'
      }
    }
  ];

  const publisherMap = {};
  for (const pub of publishersData) {
    const user = await prisma.user.upsert({
      where: { email: pub.email },
      update: {
        companyName: pub.companyName,
        isVerified: true
      },
      create: {
        email: pub.email,
        password: DEFAULT_PASSWORD_HASH,
        firstName: pub.firstName,
        lastName: pub.lastName,
        companyName: pub.companyName,
        role: 'PUBLISHER',
        status: 'ACTIVE',
        isVerified: true,
        emailVerifiedAt: new Date()
      }
    });

    await prisma.publisherProfile.upsert({
      where: { userId: user.id },
      update: pub.profile,
      create: {
        userId: user.id,
        ...pub.profile
      }
    });

    publisherMap[pub.email] = user;
  }

  // 4.3 Students
  const studentsData = [
    {
      email: 'kasun.perera@std.uwu.ac.lk',
      firstName: 'Kasun',
      lastName: 'Perera',
      profile: {
        universityName: 'Uva Wellassa University',
        fieldOfStudy: 'Computer Science & Technology',
        yearOfStudy: '3rd Year',
        languagesSpoken: 'English, Sinhala',
        skills: 'React, JavaScript, Node.js, HTML/CSS, Git, Tailwind CSS',
        preferredCategories: 'Information Technology'
      }
    },
    {
      email: 'amali.senanayake@std.uwu.ac.lk',
      firstName: 'Amali',
      lastName: 'Senanayake',
      profile: {
        universityName: 'Uva Wellassa University',
        fieldOfStudy: 'Management Sciences',
        yearOfStudy: '2nd Year',
        languagesSpoken: 'English, Sinhala',
        skills: 'Content Writing, Copywriting, SEO, Social Media Marketing',
        preferredCategories: 'Marketing & Sales, Writing & Translation'
      }
    },
    {
      email: 'dineth.wijesinghe@std.uwu.ac.lk',
      firstName: 'Dineth',
      lastName: 'Wijesinghe',
      profile: {
        universityName: 'University of Moratuwa',
        fieldOfStudy: 'Information Technology',
        yearOfStudy: '4th Year',
        languagesSpoken: 'English, Sinhala',
        skills: 'Figma, UI/UX, Graphic Design, Photoshop, Video Editing',
        preferredCategories: 'Design & Creative'
      }
    },
    {
      email: 'thilini.jayawardena@std.uwu.ac.lk',
      firstName: 'Thilini',
      lastName: 'Jayawardena',
      profile: {
        universityName: 'University of Colombo',
        fieldOfStudy: 'Applied Mathematics',
        yearOfStudy: '2nd Year',
        languagesSpoken: 'English, Sinhala, Tamil',
        skills: 'Mathematics Tutoring, English Tutoring, Python, Research',
        preferredCategories: 'Tutoring & Education'
      }
    },
    {
      email: 'chathura.ranasinghe@std.uwu.ac.lk',
      firstName: 'Chathura',
      lastName: 'Ranasinghe',
      profile: {
        universityName: 'University of Kelaniya',
        fieldOfStudy: 'Business Management',
        yearOfStudy: '1st Year',
        languagesSpoken: 'English, Sinhala',
        skills: 'Data Entry, Excel / Google Sheets, Customer Service',
        preferredCategories: 'Administrative Support, Customer Service'
      }
    }
  ];

  const studentMap = {};
  for (const stu of studentsData) {
    const user = await prisma.user.upsert({
      where: { email: stu.email },
      update: { isVerified: true },
      create: {
        email: stu.email,
        password: DEFAULT_PASSWORD_HASH,
        firstName: stu.firstName,
        lastName: stu.lastName,
        role: 'STUDENT',
        status: 'ACTIVE',
        isVerified: true,
        emailVerifiedAt: new Date()
      }
    });

    await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: stu.profile,
      create: {
        userId: user.id,
        ...stu.profile
      }
    });

    studentMap[stu.email] = user;
  }

  // =========================================================================
  // 5. JOBS
  // =========================================================================
  console.log('Seeding job postings...');
  const techSolutions = publisherMap['hr@techsolutions.lk'];
  const creativeStudio = publisherMap['jobs@creativestudio.lk'];
  const uwuSupport = publisherMap['academics@uwu.ac.lk'];
  const apexDigital = publisherMap['careers@apexdigital.lk'];

  const jobsData = [
    {
      publisherId: techSolutions.id,
      categoryId: categoryMap['Information Technology'],
      title: 'Junior Frontend React Developer (Part-Time)',
      description: 'We are seeking a proactive undergraduate student to join our web development team part-time. You will work on real client web applications building responsive components with React and Tailwind CSS. Highly flexible hours designed around your lecture schedule.',
      skillsRequired: 'React, JavaScript, Tailwind CSS, Git',
      jobType: 'part-time',
      paymentRange: 'LKR 45,000 - 65,000 / month',
      location: 'Remote (Sri Lanka)',
      requirements: 'Currently enrolled in an IT / Software Engineering degree. Good understanding of React fundamentals and component state. Experience with Git is a plus.',
      benefits: 'Mentorship from senior software architects, flexible 15-20 hours/week, completion certificate and reference letter.',
      workMode: 'remote',
      vacancies: 2,
      status: 'ACTIVE'
    },
    {
      publisherId: creativeStudio.id,
      categoryId: categoryMap['Design & Creative'],
      title: 'UI/UX Mobile App Designer',
      description: 'Creative Studio is looking for a design-savvy student to help build wireframes, interactive prototypes, and modern interface components in Figma for upcoming mobile app releases.',
      skillsRequired: 'Figma, UI/UX, Graphic Design, Mobile Design',
      jobType: 'part-time',
      paymentRange: 'LKR 40,000 - 55,000 / month',
      location: 'Remote / Colombo 07',
      requirements: 'Strong visual aesthetic, portfolio or Behance link with Figma projects, understanding of responsive mobile design patterns.',
      benefits: 'Work with international brands, access to premium design resources, flexible deadlines.',
      workMode: 'remote',
      vacancies: 1,
      status: 'ACTIVE'
    },
    {
      publisherId: apexDigital.id,
      categoryId: categoryMap['Marketing & Sales'],
      title: 'Social Media Content Creator & Video Editor',
      description: 'Help create engaging short-form TikTok/Reels videos, carousel graphics, and community posts for fast-growing lifestyle brands. Ideal for creative undergraduates with video editing skills.',
      skillsRequired: 'Video Editing, Social Media Marketing, Content Writing, Photoshop',
      jobType: 'part-time',
      paymentRange: 'LKR 30,000 - 45,000 / month',
      location: 'Kandy / Hybrid',
      requirements: 'Experience with CapCut, Premiere, or Canva. Keen eye for trending viral sounds and social media aesthetics.',
      benefits: 'Hands-on training in digital advertising, performance bonuses, hybrid schedule.',
      workMode: 'hybrid',
      vacancies: 2,
      status: 'ACTIVE'
    },
    {
      publisherId: uwuSupport.id,
      categoryId: categoryMap['Tutoring & Education'],
      title: 'Undergraduate Mathematics & Physics Tutor',
      description: 'Conduct interactive online evening tutorial sessions for first-year undergraduate students in Calculus, Linear Algebra, and Mechanics. Support fellow students in grasping difficult concepts.',
      skillsRequired: 'Mathematics Tutoring, English Tutoring, Problem Solving',
      jobType: 'part-time',
      paymentRange: 'LKR 2,500 - 3,500 / hour',
      location: 'Online (Zoom)',
      requirements: '2nd year or above in Physical Science, Engineering, or Applied Sciences with an A/B grade in first-year Math.',
      benefits: 'Official campus tutoring certificate, teaching experience, flexible 4-8 hours per week.',
      workMode: 'remote',
      vacancies: 3,
      status: 'ACTIVE'
    },
    {
      publisherId: techSolutions.id,
      categoryId: categoryMap['Writing & Translation'],
      title: 'Technical Documentation & Blog Writer',
      description: 'Write clear API documentation, developer getting-started guides, and informative technical blog articles on cloud development and full-stack software concepts.',
      skillsRequired: 'Content Writing, Copywriting, Technical Writing, Markdown',
      jobType: 'freelance',
      paymentRange: 'LKR 35,000 - 50,000 / project',
      location: 'Remote',
      requirements: 'Excellent written English, ability to explain complex technical ideas simply, familiarity with GitHub or Markdown.',
      benefits: 'Author byline on prominent industry publications, remote flexible milestones.',
      workMode: 'remote',
      vacancies: 1,
      status: 'ACTIVE'
    },
    {
      publisherId: apexDigital.id,
      categoryId: categoryMap['Administrative Support'],
      title: 'Virtual Administrative & Data Entry Assistant',
      description: 'Assist our account operations team with CRM lead organization, Google Sheets data cleaning, and sending follow-up scheduling emails.',
      skillsRequired: 'Data Entry, Excel / Google Sheets, Communication',
      jobType: 'part-time',
      paymentRange: 'LKR 25,000 - 35,000 / month',
      location: 'Remote',
      requirements: 'High attention to detail, proficiency with Google Sheets or Excel, dependable internet connection.',
      benefits: 'Steady monthly income, work anytime during the day or evening, easy workflows.',
      workMode: 'remote',
      vacancies: 2,
      status: 'ACTIVE'
    },
    {
      publisherId: techSolutions.id,
      categoryId: categoryMap['Customer Service'],
      title: 'Weekend Customer Support Representative (Live Chat)',
      description: 'Provide friendly, helpful assistance to platform users via live chat on weekend afternoons. Answer FAQs and escalate technical bugs to engineers.',
      skillsRequired: 'Customer Service, Communication, English Fluency',
      jobType: 'part-time',
      paymentRange: 'LKR 25,000 - 35,000 / month',
      location: 'Remote',
      requirements: 'Fluent spoken and written English, patient demeanor, quick typing speed.',
      benefits: 'Only weekend shifts (Sat & Sun), full training provided, equipment allowance.',
      workMode: 'remote',
      vacancies: 2,
      status: 'ACTIVE'
    },
    {
      publisherId: uwuSupport.id,
      categoryId: categoryMap['Hospitality & Events'],
      title: 'Annual Tech Expo Student Event Coordinator',
      description: 'Join the campus events committee to organize student registrations, assist corporate guest speakers, and help coordinate booth operations during the university technology symposium.',
      skillsRequired: 'Customer Service, Event Coordination, Leadership',
      jobType: 'temporary',
      paymentRange: 'LKR 30,000 fixed stipend',
      location: 'Badulla Campus',
      requirements: 'Enthusiastic, reliable, and punctual undergraduate. Good team player with strong interpersonal skills.',
      benefits: 'Official certificate of event management, networking with leading Sri Lankan tech companies.',
      workMode: 'on-site',
      vacancies: 4,
      status: 'ACTIVE'
    }
  ];

  const createdJobs = [];
  for (const job of jobsData) {
    // Check if job with this title and publisher already exists
    let existing = await prisma.job.findFirst({
      where: {
        publisherId: job.publisherId,
        title: job.title
      }
    });

    if (!existing) {
      existing = await prisma.job.create({
        data: job
      });
    }
    createdJobs.push(existing);
  }

  // =========================================================================
  // 6. APPLICATIONS
  // =========================================================================
  console.log('Seeding job applications...');
  const kasun = studentMap['kasun.perera@std.uwu.ac.lk'];
  const dineth = studentMap['dineth.wijesinghe@std.uwu.ac.lk'];
  const amali = studentMap['amali.senanayake@std.uwu.ac.lk'];
  const thilini = studentMap['thilini.jayawardena@std.uwu.ac.lk'];
  const chathura = studentMap['chathura.ranasinghe@std.uwu.ac.lk'];

  const applicationsData = [
    {
      jobId: createdJobs[0].id, // Junior Frontend Dev
      studentId: kasun.id,
      proposal: 'Hello! I am a 3rd-year CS student with hands-on experience in React, JavaScript, and Tailwind CSS. I have built several projects including a campus course review portal. I would love to contribute 15-20 hours a week to your team.',
      status: 'ACCEPTED'
    },
    {
      jobId: createdJobs[1].id, // UI/UX Designer
      studentId: dineth.id,
      proposal: 'Hi team! I specialize in Figma UI/UX design and mobile design systems. You can check my portfolio with complete case studies of two live Flutter/React Native apps. Excited about the opportunity!',
      status: 'ACCEPTED'
    },
    {
      jobId: createdJobs[2].id, // Social Media Creator
      studentId: amali.id,
      proposal: 'Dear Apex Digital, I actively create content on Instagram and TikTok, with over 15K views on student lifestyle videos. I can script, shoot, and edit reels with high audience engagement.',
      status: 'ACCEPTED'
    },
    {
      jobId: createdJobs[3].id, // Math Tutor
      studentId: thilini.id,
      proposal: 'Hello Dr. Fernando, I scored an A+ in undergraduate Calculus and enjoy explaining concepts with visual diagrams and problem breakdown steps. Looking forward to helping junior batches!',
      status: 'ACCEPTED'
    },
    {
      jobId: createdJobs[5].id, // Admin / Data Entry
      studentId: chathura.id,
      proposal: 'Hello! I am proficient in Google Sheets, Excel VLOOKUP, and rapid typing (65 WPM). I am meticulous about data accuracy and available every afternoon.',
      status: 'PENDING'
    },
    {
      jobId: createdJobs[4].id, // Tech Writer
      studentId: kasun.id,
      proposal: 'I frequently write technical markdown guides for open-source repositories and would love to help document your APIs and write developer articles.',
      status: 'VIEWED'
    }
  ];

  for (const app of applicationsData) {
    await prisma.jobApplication.upsert({
      where: {
        unique_job_student_application: {
          jobId: app.jobId,
          studentId: app.studentId
        }
      },
      update: { status: app.status },
      create: app
    });
  }

  // =========================================================================
  // 7. REVIEWS
  // =========================================================================
  console.log('Seeding reviews...');

  // 7.1 Student Reviews (Publisher -> Student)
  const studentReviewsData = [
    {
      publisherId: techSolutions.id,
      studentId: kasun.id,
      jobId: createdJobs[0].id,
      rating: 5,
      reviewText: 'Kasun did an outstanding job delivering clean, well-tested React components. He communicated proactively, adhered to our coding standards, and finished sprint tasks ahead of schedule!',
      status: 'ACTIVE'
    },
    {
      publisherId: creativeStudio.id,
      studentId: dineth.id,
      jobId: createdJobs[1].id,
      rating: 5,
      reviewText: 'Dineth has exceptional design instincts! He crafted beautiful, accessible Figma wireframes and mobile mockups that our client loved. Highly recommended.',
      status: 'ACTIVE'
    },
    {
      publisherId: apexDigital.id,
      studentId: amali.id,
      jobId: createdJobs[2].id,
      rating: 4,
      reviewText: 'Amali created creative and engaging social media posts. Very dependable, punctual, and receptive to feedback. A great addition to any marketing team.',
      status: 'ACTIVE'
    },
    {
      publisherId: uwuSupport.id,
      studentId: thilini.id,
      jobId: createdJobs[3].id,
      rating: 5,
      reviewText: 'Thilini is a gifted tutor. Her first-year tutorial group praised her patience and ability to explain complex calculus derivations clearly.',
      status: 'ACTIVE'
    }
  ];

  for (const rev of studentReviewsData) {
    await prisma.studentReview.upsert({
      where: {
        unique_student_review: {
          publisherId: rev.publisherId,
          studentId: rev.studentId,
          jobId: rev.jobId
        }
      },
      update: { rating: rev.rating, reviewText: rev.reviewText },
      create: rev
    });
  }

  // 7.2 Company Reviews (Student -> Publisher)
  const companyReviewsData = [
    {
      publisherId: techSolutions.id,
      studentId: kasun.id,
      jobId: createdJobs[0].id,
      rating: 5,
      reviewText: 'Incredible company to work with! The senior developers provided great mentorship, code reviews were constructive, and work hours were fully respected around my university exams.',
      isAnonymous: false,
      status: 'ACTIVE'
    },
    {
      publisherId: creativeStudio.id,
      studentId: dineth.id,
      jobId: createdJobs[1].id,
      rating: 5,
      reviewText: 'Creative Studio gave me real-world design experience on production applications. Compensation was fair and punctual. Very supportive team culture.',
      isAnonymous: false,
      status: 'ACTIVE'
    },
    {
      publisherId: apexDigital.id,
      studentId: amali.id,
      jobId: createdJobs[2].id,
      rating: 4,
      reviewText: 'Learned a lot about modern digital marketing analytics and viral campaign production. Great atmosphere and flexible hours.',
      isAnonymous: false,
      status: 'ACTIVE'
    },
    {
      publisherId: uwuSupport.id,
      studentId: thilini.id,
      jobId: createdJobs[3].id,
      rating: 5,
      reviewText: 'Very fulfilling experience tutoring first-year students. The academic department is organized and support was always readily available.',
      isAnonymous: false,
      status: 'ACTIVE'
    }
  ];

  for (const rev of companyReviewsData) {
    await prisma.companyReview.upsert({
      where: {
        unique_company_review: {
          publisherId: rev.publisherId,
          studentId: rev.studentId,
          jobId: rev.jobId
        }
      },
      update: { rating: rev.rating, reviewText: rev.reviewText },
      create: rev
    });
  }

  // =========================================================================
  // 8. WISHLIST (SAVED JOBS)
  // =========================================================================
  console.log('Seeding wishlists...');
  const wishlistData = [
    { studentId: kasun.id, jobId: createdJobs[1].id },
    { studentId: kasun.id, jobId: createdJobs[4].id },
    { studentId: amali.id, jobId: createdJobs[5].id },
    { studentId: dineth.id, jobId: createdJobs[0].id },
    { studentId: thilini.id, jobId: createdJobs[7].id }
  ];

  for (const item of wishlistData) {
    await prisma.wishlist.upsert({
      where: {
        unique_student_wishlist: {
          studentId: item.studentId,
          jobId: item.jobId
        }
      },
      update: {},
      create: item
    });
  }

  // =========================================================================
  // 9. CONVERSATIONS & MESSAGES
  // =========================================================================
  console.log('Seeding conversation & messages...');
  let conversation = await prisma.conversation.findFirst({
    where: {
      userOneId: techSolutions.id,
      userTwoId: kasun.id,
      jobId: createdJobs[0].id
    }
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userOneId: techSolutions.id,
        userTwoId: kasun.id,
        jobId: createdJobs[0].id
      }
    });
  }

  const messageCount = await prisma.message.count({
    where: { conversationId: conversation.id }
  });

  if (messageCount === 0) {
    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          senderId: techSolutions.id,
          receiverId: kasun.id,
          messageText: 'Hi Kasun! We reviewed your GitHub profile and were very impressed with your React projects. Would you be available for a 15-minute introductory video chat tomorrow at 4 PM?',
          isRead: true,
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2) // 2 days ago
        },
        {
          conversationId: conversation.id,
          senderId: kasun.id,
          receiverId: techSolutions.id,
          messageText: 'Hello Mr. Saman! Thank you so much for the invitation. Yes, 4 PM tomorrow works perfectly for me after my lecture. Looking forward to speaking with you!',
          isRead: true,
          createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 1) // 1 day ago
        },
        {
          conversationId: conversation.id,
          senderId: techSolutions.id,
          receiverId: kasun.id,
          messageText: 'Great! I have accepted your application on the portal and sent the Google Meet link to your email. See you tomorrow!',
          isRead: false,
          createdAt: new Date(Date.now() - 3600 * 1000 * 2) // 2 hours ago
        }
      ]
    });
  }

  // =========================================================================
  // 10. NOTIFICATIONS
  // =========================================================================
  console.log('Seeding notifications...');
  const notificationsData = [
    {
      userId: kasun.id,
      type: 'application_accepted',
      message: 'Congratulations! Your application for "Junior Frontend React Developer" has been accepted by Tech Solutions Lanka.',
      link: `/student/jobs/${createdJobs[0].id}`,
      isRead: false
    },
    {
      userId: dineth.id,
      type: 'application_accepted',
      message: 'Congratulations! Creative Studio Colombo accepted your application for "UI/UX Mobile App Designer".',
      link: `/student/jobs/${createdJobs[1].id}`,
      isRead: true
    },
    {
      userId: amali.id,
      type: 'application_accepted',
      message: 'Your application for "Social Media Content Creator" was accepted by Apex Digital Marketing.',
      link: `/student/jobs/${createdJobs[2].id}`,
      isRead: true
    },
    {
      userId: techSolutions.id,
      type: 'new_application',
      message: 'Kasun Perera submitted an application for "Junior Frontend React Developer".',
      link: `/publisher/applications`,
      isRead: true
    },
    {
      userId: adminUser.id,
      type: 'system_alert',
      message: 'Welcome to UniWiz! System initialization and database configuration completed successfully.',
      link: `/admin/dashboard`,
      isRead: false
    }
  ];

  for (const notif of notificationsData) {
    const existing = await prisma.notification.findFirst({
      where: {
        userId: notif.userId,
        type: notif.type,
        message: notif.message
      }
    });

    if (!existing) {
      await prisma.notification.create({
        data: notif
      });
    }
  }

  // Final summary
  const summary = {
    categories: await prisma.jobCategory.count(),
    skills: await prisma.skill.count(),
    users: await prisma.user.count(),
    jobs: await prisma.job.count(),
    applications: await prisma.jobApplication.count(),
    studentReviews: await prisma.studentReview.count(),
    companyReviews: await prisma.companyReview.count(),
    conversations: await prisma.conversation.count(),
    messages: await prisma.message.count(),
    notifications: await prisma.notification.count()
  };

  console.log('--- UniWiz Seeding Finished Successfully ---');
  console.log(summary);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
