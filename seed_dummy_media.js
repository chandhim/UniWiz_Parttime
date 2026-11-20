const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Target directories (both backend api uploads and frontend public uploads)
const BACKEND_UPLOADS = path.resolve(__dirname, 'uniwiz-backend', 'api', 'uploads');
const FRONTEND_UPLOADS = path.resolve(__dirname, 'uniwiz-frontend', 'public', 'uploads');

const DIRS = ['profiles', 'logos', 'covers', 'gallery'];

// Ensure all directories exist
for (const dir of DIRS) {
  fs.mkdirSync(path.join(BACKEND_UPLOADS, dir), { recursive: true });
  fs.mkdirSync(path.join(FRONTEND_UPLOADS, dir), { recursive: true });
}

// Helper to save a file to both locations
function saveFile(subDir, fileName, bufferOrStr) {
  const p1 = path.join(BACKEND_UPLOADS, subDir, fileName);
  const p2 = path.join(FRONTEND_UPLOADS, subDir, fileName);
  fs.writeFileSync(p1, bufferOrStr);
  fs.writeFileSync(p2, bufferOrStr);
  console.log(`Saved [${subDir}/${fileName}] (${Buffer.byteLength(bufferOrStr)} bytes)`);
}

// Download image helper with retry
async function downloadImage(url, subDir, fileName, fallbackSvg) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    saveFile(subDir, fileName, buffer);
  } catch (err) {
    console.warn(`Failed downloading ${url}: ${err.message}. Using fallback SVG.`);
    if (fallbackSvg) {
      saveFile(subDir, fileName.replace(/\.(jpg|jpeg|png)$/, '.svg'), fallbackSvg);
    }
  }
}

// -----------------------------------------------------------------------------
// 1. Vector SVG Logos
// -----------------------------------------------------------------------------
const LOGOS = {
  'techsolutions.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="tsBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="tsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#0284C7"/>
    </linearGradient>
    <linearGradient id="tsAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#tsBg)"/>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="#334155" stroke-width="2"/>
  
  <!-- Outer glowing hexagon -->
  <polygon points="100,28 156,60 156,124 100,156 44,124 44,60" fill="none" stroke="url(#tsGrad)" stroke-width="4" stroke-linejoin="round"/>
  
  <!-- Code brackets </> -->
  <path d="M78 78 L60 92 L78 106" fill="none" stroke="url(#tsGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M122 78 L140 92 L122 106" fill="none" stroke="url(#tsGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="106" y1="74" x2="94" y2="110" stroke="url(#tsAccent)" stroke-width="5" stroke-linecap="round"/>
  
  <!-- Microchip Nodes -->
  <circle cx="100" cy="28" r="4" fill="#38BDF8"/>
  <circle cx="156" cy="60" r="4" fill="#38BDF8"/>
  <circle cx="156" cy="124" r="4" fill="#38BDF8"/>
  <circle cx="100" cy="156" r="4" fill="#34D399"/>
  <circle cx="44" cy="124" r="4" fill="#38BDF8"/>
  <circle cx="44" cy="60" r="4" fill="#38BDF8"/>
  
  <!-- Brand Name -->
  <text x="100" y="174" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" fill="#F8FAFC" letter-spacing="2">TECH SOLUTIONS</text>
  <text x="100" y="188" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="700" fill="#38BDF8" letter-spacing="3">LANKA</text>
</svg>`,

  'creativestudio.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="csBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E1065"/>
      <stop offset="100%" stop-color="#4C1D95"/>
    </linearGradient>
    <linearGradient id="csPink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="100%" stop-color="#EC4899"/>
    </linearGradient>
    <linearGradient id="csViolet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="csAmber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#csBg)"/>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="#6D28D9" stroke-width="2"/>
  
  <!-- Overlapping Designer Flower/Petals -->
  <circle cx="85" cy="80" r="32" fill="url(#csPink)" opacity="0.85"/>
  <circle cx="115" cy="80" r="32" fill="url(#csViolet)" opacity="0.85"/>
  <circle cx="100" cy="105" r="32" fill="url(#csAmber)" opacity="0.85"/>
  
  <!-- Stylized CS Monogram in center -->
  <path d="M92 82 C86 76 78 80 78 88 C78 96 86 100 92 94" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M120 84 C116 80 108 81 108 86 C108 93 118 91 118 97 C118 102 110 102 106 98" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round"/>
  
  <!-- Sparkles -->
  <polygon points="145,42 147,48 153,50 147,52 145,58 143,52 137,50 143,48" fill="#FDE047"/>
  <polygon points="52,118 53,123 58,124 53,126 52,131 51,126 46,124 51,123" fill="#F43F5E"/>
  
  <text x="100" y="166" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" letter-spacing="2">CREATIVE STUDIO</text>
  <text x="100" y="182" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" fill="#F472B6" letter-spacing="3">COLOMBO</text>
</svg>`,

  'uwu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="uwuBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="100%" stop-color="#022C22"/>
    </linearGradient>
    <linearGradient id="uwuGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#uwuBg)"/>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="#059669" stroke-width="2"/>
  
  <!-- Academic Crest Shield -->
  <path d="M100 32 L144 48 C144 94 124 126 100 138 C76 126 56 94 56 48 Z" fill="#047857" stroke="url(#uwuGold)" stroke-width="3"/>
  
  <!-- Graduation Cap -->
  <polygon points="100,56 132,68 100,80 68,68" fill="url(#uwuGold)"/>
  <polygon points="100,80 124,71 124,82 C124 90 100 96 100 96 C100 96 76 90 76 82 L76,71" fill="#D97706"/>
  <!-- Tassel -->
  <path d="M128 70 C128 78 132 86 132 94" fill="none" stroke="#FDE68A" stroke-width="2"/>
  <circle cx="132" cy="95" r="2.5" fill="#FDE68A"/>
  
  <!-- Open Book -->
  <path d="M82 108 C90 104 98 106 100 109 C102 106 110 104 118 108 L118 120 C110 116 102 118 100 121 C98 118 90 116 82 120 Z" fill="#FFFFFF"/>
  <line x1="100" y1="109" x2="100" y2="121" stroke="#047857" stroke-width="1.5"/>
  
  <text x="100" y="164" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FDE68A" letter-spacing="3">UWU SUPPORT</text>
  <text x="100" y="180" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="700" fill="#A7F3D0" letter-spacing="2">UVA WELLASSA CAMPUS</text>
</svg>`,

  'apexdigital.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="apexBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#27272A"/>
    </linearGradient>
    <linearGradient id="apexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FB923C"/>
      <stop offset="50%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#C2410C"/>
    </linearGradient>
    <linearGradient id="apexNeon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#apexBg)"/>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="#3F3F46" stroke-width="2"/>
  
  <!-- Upward surging Apex Chevron / Rocket Triangles -->
  <polygon points="100,32 148,110 124,110 100,68 76,110 52,110" fill="url(#apexGrad)"/>
  <polygon points="100,72 130,122 112,122 100,102 88,122 70,122" fill="url(#apexNeon)"/>
  
  <!-- Rising Bar Chart indicator -->
  <rect x="64" y="128" width="12" height="10" rx="2" fill="#71717A"/>
  <rect x="82" y="122" width="12" height="16" rx="2" fill="#FB923C"/>
  <rect x="100" y="114" width="12" height="24" rx="2" fill="#EA580C"/>
  <rect x="118" y="106" width="12" height="32" rx="2" fill="#38BDF8"/>
  
  <text x="100" y="165" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" letter-spacing="3">APEX DIGITAL</text>
  <text x="100" y="181" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="700" fill="#FB923C" letter-spacing="2">MARKETING AGENCY</text>
</svg>`,

  'admin_uniwiz.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="admBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#312E81"/>
    </linearGradient>
    <linearGradient id="admGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="admEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#admBg)"/>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="#4338CA" stroke-width="2"/>
  
  <!-- Security Shield & Crown -->
  <path d="M100 34 L146 54 C146 102 126 132 100 144 C74 132 54 102 54 54 Z" fill="url(#admEmerald)" stroke="url(#admGold)" stroke-width="3.5"/>
  
  <!-- Wizard Star & Lightning -->
  <polygon points="100,56 106,72 122,74 110,84 114,100 100,90 86,100 90,84 78,74 94,72" fill="url(#admGold)"/>
  
  <text x="100" y="166" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#F8FAFC" letter-spacing="3">UNIWIZ ADMIN</text>
  <text x="100" y="182" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="8" font-weight="800" fill="#34D399" letter-spacing="2">VERIFIED PORTAL</text>
</svg>`,

  'default_student.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="stdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ECFDF5"/>
      <stop offset="100%" stop-color="#D1FAE5"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#stdBg)"/>
  <circle cx="100" cy="74" r="32" fill="#059669"/>
  <!-- Mortarboard -->
  <polygon points="100,32 134,44 100,56 66,44" fill="#064E3B"/>
  <path d="M100 56 L124 48 L124 58 C124 64 100 70 100 70 C100 70 76 64 76 58 L76 48 Z" fill="#047857"/>
  <!-- Body/Shoulders -->
  <path d="M50 160 C50 126 72 118 100 118 C128 118 150 126 150 160 Z" fill="#059669"/>
</svg>`,

  'default_company.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="cmpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EEF2FF"/>
      <stop offset="100%" stop-color="#E0E7FF"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="44" fill="url(#cmpBg)"/>
  <rect x="62" y="60" width="76" height="96" rx="6" fill="#4338CA"/>
  <!-- Office Windows -->
  <rect x="72" y="74" width="12" height="12" rx="2" fill="#A5B4FC"/>
  <rect x="94" y="74" width="12" height="12" rx="2" fill="#A5B4FC"/>
  <rect x="116" y="74" width="12" height="12" rx="2" fill="#A5B4FC"/>
  
  <rect x="72" y="96" width="12" height="12" rx="2" fill="#A5B4FC"/>
  <rect x="94" y="96" width="12" height="12" rx="2" fill="#A5B4FC"/>
  <rect x="116" y="96" width="12" height="12" rx="2" fill="#A5B4FC"/>
  
  <rect x="72" y="118" width="12" height="12" rx="2" fill="#A5B4FC"/>
  <rect x="94" y="118" width="12" height="12" rx="2" fill="#A5B4FC"/>
  <rect x="116" y="118" width="12" height="12" rx="2" fill="#A5B4FC"/>
  
  <rect x="90" y="138" width="20" height="18" fill="#C7D2FE"/>
</svg>`
};

// -----------------------------------------------------------------------------
// 2. Main Seeder
// -----------------------------------------------------------------------------
async function main() {
  console.log('=== Starting Dummy Media Seeding (Logos, Profiles, Covers, Gallery) ===');

  // 1. Write vector logos and placeholders
  console.log('\n--- Writing SVG Logos and Placeholders ---');
  for (const [name, content] of Object.entries(LOGOS)) {
    saveFile('logos', name, content);
  }

  // Also put default student avatar in profiles/
  saveFile('profiles', 'default_student.svg', LOGOS['default_student.svg']);
  saveFile('profiles', 'admin_uniwiz.svg', LOGOS['admin_uniwiz.svg']);

  // 2. Download Student Profile Pictures
  console.log('\n--- Downloading High-Quality Student Profile Pictures ---');
  const studentPhotos = [
    {
      email: 'kasun.perera@std.uwu.ac.lk',
      file: 'kasun_perera.jpg',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      email: 'amali.senanayake@std.uwu.ac.lk',
      file: 'amali_senanayake.jpg',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      email: 'dineth.wijesinghe@std.uwu.ac.lk',
      file: 'dineth_wijesinghe.jpg',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      email: 'thilini.jayawardena@std.uwu.ac.lk',
      file: 'thilini_jayawardena.jpg',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&auto=format&fit=crop&q=80'
    },
    {
      email: 'chathura.ranasinghe@std.uwu.ac.lk',
      file: 'chathura_ranasinghe.jpg',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&q=80'
    }
  ];

  for (const s of studentPhotos) {
    await downloadImage(s.url, 'profiles', s.file, LOGOS['default_student.svg']);
  }

  // Admin Profile Picture
  await downloadImage(
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80',
    'profiles',
    'admin_uniwiz.jpg',
    LOGOS['admin_uniwiz.svg']
  );

  // 3. Download Publisher Covers
  console.log('\n--- Downloading Publisher Profile Cover Banners ---');
  const publisherCovers = [
    {
      email: 'hr@techsolutions.lk',
      file: 'cover_techsolutions.jpg',
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=450&auto=format&fit=crop&q=80'
    },
    {
      email: 'jobs@creativestudio.lk',
      file: 'cover_creativestudio.jpg',
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=450&auto=format&fit=crop&q=80'
    },
    {
      email: 'academics@uwu.ac.lk',
      file: 'cover_uwu.jpg',
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=450&auto=format&fit=crop&q=80'
    },
    {
      email: 'careers@apexdigital.lk',
      file: 'cover_apexdigital.jpg',
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=450&auto=format&fit=crop&q=80'
    }
  ];

  for (const c of publisherCovers) {
    await downloadImage(c.url, 'covers', c.file);
  }

  // 4. Download Publisher Gallery Photos
  console.log('\n--- Downloading Publisher Gallery Images ---');
  const galleryItems = [
    // Tech Solutions Lanka
    { email: 'hr@techsolutions.lk', file: 'gallery_tech_1.jpg', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'hr@techsolutions.lk', file: 'gallery_tech_2.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'hr@techsolutions.lk', file: 'gallery_tech_3.jpg', url: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&h=600&auto=format&fit=crop&q=80' },
    // Creative Studio Colombo
    { email: 'jobs@creativestudio.lk', file: 'gallery_creative_1.jpg', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'jobs@creativestudio.lk', file: 'gallery_creative_2.jpg', url: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'jobs@creativestudio.lk', file: 'gallery_creative_3.jpg', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&h=600&auto=format&fit=crop&q=80' },
    // UWU Campus Support
    { email: 'academics@uwu.ac.lk', file: 'gallery_uwu_1.jpg', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'academics@uwu.ac.lk', file: 'gallery_uwu_2.jpg', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'academics@uwu.ac.lk', file: 'gallery_uwu_3.jpg', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&auto=format&fit=crop&q=80' },
    // Apex Digital
    { email: 'careers@apexdigital.lk', file: 'gallery_apex_1.jpg', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'careers@apexdigital.lk', file: 'gallery_apex_2.jpg', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&auto=format&fit=crop&q=80' },
    { email: 'careers@apexdigital.lk', file: 'gallery_apex_3.jpg', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&auto=format&fit=crop&q=80' }
  ];

  for (const g of galleryItems) {
    await downloadImage(g.url, 'gallery', g.file);
  }

  // -----------------------------------------------------------------------------
  // 5. Update Database Records
  // -----------------------------------------------------------------------------
  console.log('\n--- Updating Database with Seeded Images ---');

  // 5.1 Admin
  await prisma.user.updateMany({
    where: { email: 'admin@uniwiz.lk' },
    data: { profileImageUrl: 'uploads/profiles/admin_uniwiz.jpg' }
  });
  console.log('✓ Updated Admin profile image');

  // 5.2 Publishers: Company Logos & Covers
  const publisherLogoMap = {
    'hr@techsolutions.lk': { logo: 'uploads/logos/techsolutions.svg', cover: 'uploads/covers/cover_techsolutions.jpg' },
    'jobs@creativestudio.lk': { logo: 'uploads/logos/creativestudio.svg', cover: 'uploads/covers/cover_creativestudio.jpg' },
    'academics@uwu.ac.lk': { logo: 'uploads/logos/uwu.svg', cover: 'uploads/covers/cover_uwu.jpg' },
    'careers@apexdigital.lk': { logo: 'uploads/logos/apexdigital.svg', cover: 'uploads/covers/cover_apexdigital.jpg' }
  };

  for (const [email, info] of Object.entries(publisherLogoMap)) {
    const pubUser = await prisma.user.findUnique({ where: { email } });
    if (pubUser) {
      await prisma.user.update({
        where: { id: pubUser.id },
        data: { profileImageUrl: info.logo }
      });
      await prisma.publisherProfile.updateMany({
        where: { userId: pubUser.id },
        data: { coverImageUrl: info.cover }
      });
      console.log(`✓ Updated Publisher [${email}]: logo & cover`);
    }
  }

  // 5.3 Students: Profile Pictures
  const studentMap = {
    'kasun.perera@std.uwu.ac.lk': 'uploads/profiles/kasun_perera.jpg',
    'amali.senanayake@std.uwu.ac.lk': 'uploads/profiles/amali_senanayake.jpg',
    'dineth.wijesinghe@std.uwu.ac.lk': 'uploads/profiles/dineth_wijesinghe.jpg',
    'thilini.jayawardena@std.uwu.ac.lk': 'uploads/profiles/thilini_jayawardena.jpg',
    'chathura.ranasinghe@std.uwu.ac.lk': 'uploads/profiles/chathura_ranasinghe.jpg'
  };

  for (const [email, imgPath] of Object.entries(studentMap)) {
    await prisma.user.updateMany({
      where: { email },
      data: { profileImageUrl: imgPath }
    });
    console.log(`✓ Updated Student [${email}]: ${imgPath}`);
  }

  // 5.4 Seed Publisher Gallery Images
  console.log('\n--- Seeding Publisher Gallery Images ---');
  for (const item of galleryItems) {
    const user = await prisma.user.findUnique({ where: { email: item.email } });
    if (user) {
      const imgUrl = `uploads/gallery/${item.file}`;
      const existing = await prisma.publisherImage.findFirst({
        where: { publisherId: user.id, imageUrl: imgUrl }
      });
      if (!existing) {
        await prisma.publisherImage.create({
          data: {
            publisherId: user.id,
            imageUrl: imgUrl
          }
        });
        console.log(`✓ Added gallery image for ${item.email}: ${imgUrl}`);
      }
    }
  }

  console.log('\n=== Dummy Media Seeding Completed Successfully! ===');
}

main()
  .catch((e) => {
    console.error('Error during media seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
