# UniWiz - University Part-Time Job Portal

## 📋 Project Description

**UniWiz** is a comprehensive full-stack web application designed to connect university students with part-time job opportunities posted by publishers (employers). The platform streamlines the job application process, facilitates direct communication between students and employers, and incorporates a robust review system to ensure quality and accountability on both sides.

The system addresses the common problem of university students struggling to find relevant part-time work while managing their academic commitments. Publishers benefit from accessing a pool of motivated, university-verified students for their staffing needs.

---

## ✨ Features

### For Students
- **University Email Verification** - Email validation ensures only verified university students can register
- **Job Discovery** - Browse, search, and filter part-time jobs by category, job type, and keywords
- **Wishlist Management** - Save interesting jobs for later review
- **Application Tracking** - Apply for jobs with custom proposals and track application status (pending, accepted, rejected)
- **Profile Management** - Create comprehensive profiles with skills, CV uploads, education details, and languages spoken
- **Direct Messaging** - Chat with publishers about job opportunities
- **Review System** - Leave reviews for publishers after successful collaboration (access control enforced)
- **Notifications** - Real-time notifications for application updates, messages, and job alerts
- **Dashboard Analytics** - View application statistics, job recommendations, and profile completeness

### For Publishers (Employers)
- **Job Posting** - Create detailed job listings with payment ranges, deadlines, skills required, and work modes (remote, on-site, hybrid)
- **Payment Integration** - Integrated payment system (Stripe/PayPal) for job posting fees with multiple payment methods (credit card, bank transfer, e-wallet)
- **Application Management** - Review student applications, view profiles, CVs, and accept/reject candidates
- **Company Profile** - Showcase company details, gallery images, social media links, and industry information
- **Direct Messaging** - Communicate with applicants directly through the platform
- **Job Management** - Edit active jobs, extend deadlines, and manage job status
- **Student Reviews** - Review students who have worked on accepted jobs
- **Dashboard Analytics** - Track total jobs posted, applications received, review ratings, and statistics

### For Administrators
- **User Management** - View, filter, search, block/unblock users (students, publishers, admins)
- **Job Management** - Monitor all job postings, approve/reject jobs, and manage job visibility
- **Report Management** - Handle user reports and app problem reports with status tracking
- **Conversation Viewer** - View all messaging conversations for moderation purposes (read-only)
- **Site Settings** - Configure platform-wide settings (job posting fees, commission rates, max job duration)
- **Analytics Dashboard** - System-wide statistics including user counts, job metrics, and application data
- **Category & Skills Management** - Add, edit, or remove job categories and skill tags

### General Features
- **Role-Based Access Control** - Three distinct user roles (student, publisher, admin) with specific permissions
- **Responsive Design** - Mobile-first approach using TailwindCSS for seamless experience across devices
- **Email Notifications** - Automated emails for registration, verification, password reset, and important events
- **Real-time Notifications** - In-app notification system with unread counts and popup alerts
- **Profile Verification System** - Email verification required before full platform access
- **Secure Authentication** - Password strength validation, hashed password storage, and secure session management
- **File Upload System** - Support for profile images, CVs, company logos, gallery images, and documents
- **Advanced Search & Filtering** - Comprehensive filtering options across jobs, applications, and users
- **Review Access Control** - Students can only review publishers for jobs where their application was accepted

---

## 🛠️ Tech Stack

### Frontend
- **React** (v18.2.0) - Component-based UI framework
- **TailwindCSS** (v3.4.15) - Utility-first CSS framework for responsive design
- **Framer Motion** (v12.23.6) - Animation library for smooth UI transitions
- **React Scripts** (v5.0.1) - Build toolchain for React applications
- **Concurrently** - Run multiple npm scripts simultaneously

### Backend
- **PHP** (v8.1+) - Server-side scripting language
- **MySQL** (v8.0+) - Relational database management system
- **Composer** - PHP dependency manager
- **PHPMailer** - Email sending library (via Composer)
- **Stripe PHP SDK** (v13.0) - Payment processing integration
- **Dotenv** (v5.5) - Environment variable management

### Development Tools
- **XAMPP/Laragon** - Local development environment (Apache, MySQL, PHP)
- **Node.js** (v16.x or v18.x) - JavaScript runtime for frontend tooling
- **npm** - Package manager for JavaScript dependencies
- **Git** - Version control system

### APIs & Services
- **Stripe API** - Payment gateway for job posting fees
- **PHPMailer** - SMTP email integration
- **REST API** - Custom PHP backend APIs for all data operations

---

## 📁 Folder Structure

```
UniWiz_Parttime/
│
├── uniwiz-frontend/                 # React Frontend Application
│   ├── public/                      # Static assets (HTML, favicon, etc.)
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── admin/               # Admin-specific components
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── UserManagement.js
│   │   │   │   ├── JobManagement.js
│   │   │   │   ├── ReportManagement.js
│   │   │   │   └── AdminSettingsPage.js
│   │   │   ├── LandingPage.js       # Public landing page
│   │   │   ├── LoginPage.js         # Login/registration
│   │   │   ├── StudentDashboard.js  # Student dashboard
│   │   │   ├── PublisherDashboard.js # Publisher dashboard
│   │   │   ├── FindJobsPage.js      # Job browsing page
│   │   │   ├── AppliedJobsPage.js   # Application tracking
│   │   │   ├── ManageJobs.js        # Publisher job management
│   │   │   ├── CreateJob.js         # Job posting with payment
│   │   │   ├── ProfilePage.js       # User profile editor
│   │   │   ├── MessagesPage.js      # Messaging interface
│   │   │   ├── NotificationsPage.js # Notifications center
│   │   │   ├── WishlistPage.js      # Saved jobs
│   │   │   ├── SettingsPage.js      # Account settings
│   │   │   └── ... (30+ components total)
│   │   ├── utils/                   # Utility functions
│   │   ├── App.js                   # Main application component
│   │   ├── index.js                 # React entry point
│   │   ├── index.css                # Tailwind base styles
│   │   └── output.css               # Compiled Tailwind styles
│   ├── package.json                 # Frontend dependencies
│   └── tailwind.config.js           # TailwindCSS configuration
│
├── uniwiz-backend/                  # PHP Backend API
│   ├── api/                         # API endpoints (50+ files)
│   │   ├── auth.php                 # Registration/login
│   │   ├── jobs.php                 # Fetch jobs
│   │   ├── create_job.php           # Create new job
│   │   ├── applications.php         # Submit job applications
│   │   ├── get_applications.php     # Fetch applications
│   │   ├── update_application_status.php
│   │   ├── send_message.php         # Messaging system
│   │   ├── get_messages.php
│   │   ├── get_conversations.php
│   │   ├── process_payment.php      # Payment processing
│   │   ├── create_review.php        # Review creation
│   │   ├── create_student_review.php
│   │   ├── get_notifications.php    # Notifications
│   │   ├── update_profile.php       # Profile updates
│   │   ├── upload_profile_picture.php
│   │   ├── upload_cv.php
│   │   ├── get_all_users_admin.php  # Admin APIs
│   │   ├── get_admin_stats.php
│   │   ├── report_user.php
│   │   └── ... (50+ API files total)
│   ├── classes/                     # PHP class definitions
│   │   ├── users/                   # User-related classes
│   │   │   ├── User.php
│   │   │   ├── Student.php
│   │   │   ├── Publisher.php
│   │   │   ├── Admin.php
│   │   │   └── RegisteredUser.php
│   │   ├── business/                # Business logic classes
│   │   │   ├── Job.php
│   │   │   ├── Application.php
│   │   │   ├── Payment.php
│   │   │   ├── Feedback.php
│   │   │   └── Wishlist.php
│   │   └── core/                    # Core system classes
│   ├── config/
│   │   └── database.php             # Database connection config
│   ├── uploads/                     # File upload directory
│   │   ├── profile_images/
│   │   ├── cv/
│   │   ├── gallery/
│   │   └── documents/
│   ├── vendor/                      # Composer dependencies
│   ├── composer.json                # Backend dependencies
│   └── .env                         # Environment variables (create this)
│
├── start-frontend.bat               # Quick start script for Windows
├── SYSTEM_REQUIREMENTS.md           # System requirements documentation
├── REVIEW_ACCESS_CONTROL.md         # Review feature documentation
├── GALLERY_DELETION_FEATURE.md      # Gallery feature documentation
└── README.md                        # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- **XAMPP/Laragon** (PHP 8.1+, MySQL 8.0+, Apache)
- **Node.js** (v16.x or v18.x LTS)
- **Composer** (PHP dependency manager)
- **Git** (for version control)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd UniWiz_Parttime
```

### Step 2: Backend Setup

#### 2.1 Start XAMPP/Laragon
- Start Apache and MySQL services
- Ensure Apache is running on port 80

#### 2.2 Create Database
```sql
CREATE DATABASE uniwiz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 2.3 Import Database Schema
Import the SQL schema file (if provided) or create tables manually using the database structure:
```sql
-- Key tables include:
-- users, student_profiles, publisher_profiles
-- jobs, job_applications, job_categories
-- conversations, messages, notifications
-- reviews, student_reviews, company_reviews
-- payments, reports, publisher_images
```

#### 2.4 Configure Virtual Host (Recommended)
Add to your `httpd-vhosts.conf`:
```apache
<VirtualHost *:80>
    DocumentRoot "C:/path/to/UniWiz_Parttime/uniwiz-backend"
    ServerName uniwiz-backend.test
    <Directory "C:/path/to/UniWiz_Parttime/uniwiz-backend">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Add to your `hosts` file:
```
127.0.0.1 uniwiz-backend.test
```

#### 2.5 Install PHP Dependencies
```bash
cd uniwiz-backend
composer install
```

#### 2.6 Create Environment File
Create `.env` file in `uniwiz-backend/`:
```env
# Database Configuration
DB_HOST=localhost
DB_NAME=uniwiz_db
DB_USER=root
DB_PASSWORD=

# SMTP Email Configuration (PHPMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=UniWiz Platform

# Stripe Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Application Settings
APP_URL=http://uniwiz-backend.test
FRONTEND_URL=http://localhost:3000
```

#### 2.7 Set Folder Permissions
Ensure the `uploads/` directory is writable:
```bash
chmod -R 775 uniwiz-backend/uploads
```

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend
```bash
cd uniwiz-frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Configure API Base URL
Update the `API_BASE_URL` in [src/App.js](uniwiz-frontend/src/App.js#L42):
```javascript
const API_BASE_URL = 'http://uniwiz-backend.test/api';
```

#### 3.4 Build Tailwind CSS
```bash
npm run build:css
```

#### 3.5 Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### Step 4: Initial Data Setup

#### 4.1 Seed Job Categories (Optional)
Run the provided seed scripts:
```bash
php uniwiz-backend/api/manage_categories_admin.php
```

#### 4.2 Create Admin Account
Register through the UI and manually update the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

---

## 🌐 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_NAME=uniwiz_db
DB_USER=root
DB_PASSWORD=

# Email (PHPMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=UniWiz Platform

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# URLs
APP_URL=http://uniwiz-backend.test
FRONTEND_URL=http://localhost:3000
```

### Frontend
The frontend uses hardcoded API URLs in `App.js`. For production, consider using environment variables:
```javascript
// Create .env in uniwiz-frontend/
REACT_APP_API_BASE_URL=http://uniwiz-backend.test/api
```

---

## 🗄️ Database Setup

### Database Structure

#### Core Tables
- **users** - Main user table (students, publishers, admins)
- **student_profiles** - Extended student information
- **publisher_profiles** - Extended publisher/company information

#### Job Management
- **jobs** - Job postings
- **job_categories** - Job categories (IT, Design, Marketing, etc.)
- **job_applications** - Student applications to jobs

#### Communication
- **conversations** - Chat conversation threads
- **messages** - Individual messages between users
- **notifications** - System notifications

#### Reviews & Feedback
- **reviews** - Publisher reviews (students reviewing publishers)
- **student_reviews** - Student reviews (publishers reviewing students)
- **company_reviews** - Alternative review table

#### Business Operations
- **payments** - Payment transaction records
- **reports** - User reports and problem reports
- **publisher_images** - Company gallery images
- **wishlists** - Student saved jobs (if implemented)

### Key Relationships
```sql
-- Student applies to job
students (users) -> applications -> jobs -> publishers (users)

-- Messaging
user_1 <-> conversations <-> user_2
conversations -> messages

-- Reviews (with access control)
students -> reviews -> publishers (only if application accepted)
publishers -> student_reviews -> students
```

---

## 🔌 API Overview

### Authentication APIs
- `POST /api/auth.php?action=register` - User registration
- `POST /api/auth.php?action=login` - User login
- `POST /api/auth.php?action=verify_email` - Email verification
- `POST /api/reset_password.php` - Password reset

### Job APIs
- `GET /api/get_public_jobs.php` - Public job listings
- `GET /api/jobs.php` - Jobs with application status
- `GET /api/get_job_details.php` - Single job details
- `POST /api/create_job.php` - Create new job (publisher)
- `PUT /api/update_job.php` - Edit job
- `GET /api/get_publisher_jobs.php` - Publisher's jobs
- `GET /api/get_recommended_jobs.php` - Personalized recommendations

### Application APIs
- `POST /api/applications.php` - Submit job application
- `GET /api/get_applications.php` - Publisher's received applications
- `GET /api/get_applied_jobs.php` - Student's applications
- `PUT /api/update_application_status.php` - Accept/reject applications
- `GET /api/get_student_application_details.php` - Application details

### Messaging APIs
- `POST /api/send_message.php` - Send message
- `GET /api/get_messages.php` - Fetch conversation messages
- `GET /api/get_conversations.php` - User's conversations
- `GET /api/get_messages_admin.php` - Admin read-only messages

### Profile APIs
- `GET /api/get_user_profile_by_id.php` - User profile
- `GET /api/get_student_profile.php` - Student profile
- `GET /api/get_company_profile.php` - Publisher profile
- `POST /api/update_profile.php` - Update profile
- `POST /api/upload_profile_picture.php` - Upload profile image
- `POST /api/upload_cv.php` - Upload CV

### Review APIs
- `POST /api/create_review.php` - Create publisher review
- `POST /api/create_student_review.php` - Create student review
- `GET /api/get_student_reviews.php` - Get student reviews
- `GET /api/can_review_publisher.php` - Check review eligibility

### Payment APIs
- `POST /api/process_payment.php` - Process job posting payment

### Notification APIs
- `GET /api/get_notifications.php` - Fetch user notifications
- `PUT /api/mark_notification_read.php` - Mark as read

### Admin APIs
- `GET /api/get_admin_stats.php` - Dashboard statistics
- `GET /api/get_all_users_admin.php` - User management
- `GET /api/get_all_jobs_admin.php` - Job management
- `GET /api/get_reports_admin.php` - Reports management
- `PUT /api/update_user_status_admin.php` - Block/unblock users
- `PUT /api/update_job_status_admin.php` - Approve/reject jobs
- `POST /api/manage_categories_admin.php` - Category management

### API Authentication
Most APIs require user authentication through session or user_id parameter. Sensitive operations validate user roles.

### CORS Configuration
All APIs include CORS headers allowing requests from `http://localhost:3000`

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)

#### Step 1: Prepare Frontend for Production
```bash
cd uniwiz-frontend
npm run build
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 3: Configure Environment Variables
In Vercel dashboard, add:
```
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
```

#### Step 4: Update CORS in Backend
Update backend API CORS headers to allow Vercel domain:
```php
header("Access-Control-Allow-Origin: https://your-frontend.vercel.app");
```

### Backend Deployment (PHP Hosting)

#### Recommended Hosting Providers
- **Hostinger** - Shared/VPS hosting with PHP & MySQL
- **DigitalOcean** - Cloud VPS (LAMP stack)
- **AWS EC2** - Cloud server
- **Heroku** - Platform-as-a-Service (with ClearDB MySQL addon)

#### Step 1: Upload Backend Files
```bash
# Via FTP/SFTP or Git
scp -r uniwiz-backend/ user@server:/var/www/html/
```

#### Step 2: Configure Database
- Create MySQL database on hosting provider
- Import database schema
- Update `.env` file with production credentials

#### Step 3: Install Dependencies
```bash
cd /var/www/html/uniwiz-backend
composer install --no-dev
```

#### Step 4: Set Permissions
```bash
chmod -R 755 /var/www/html/uniwiz-backend
chmod -R 777 /var/www/html/uniwiz-backend/uploads
```

#### Step 5: Configure Apache
```apache
<VirtualHost *:80>
    ServerName api.yourwisdom.com
    DocumentRoot /var/www/html/uniwiz-backend
    
    <Directory /var/www/html/uniwiz-backend>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
</VirtualHost>
```

#### Step 6: Enable HTTPS (Let's Encrypt)
```bash
sudo certbot --apache -d api.yourdomain.com
```

#### Step 7: Environment Variables
Ensure `.env` file is configured and **not publicly accessible**:
```apache
# In .htaccess
<Files .env>
    Order allow,deny
    Deny from all
</Files>
```

### Post-Deployment Checklist
- ✅ Test all API endpoints
- ✅ Verify file uploads work
- ✅ Test email sending (SMTP)
- ✅ Verify payment integration (Stripe)
- ✅ Check CORS configuration
- ✅ Test user registration & login
- ✅ Monitor error logs

---

## 👥 Team Collaboration & Git Workflow

### Branching Strategy

```
main (production)
  ├── develop (integration)
  │   ├── feature/student-dashboard
  │   ├── feature/job-posting
  │   ├── feature/messaging-system
  │   └── feature/admin-panel
  └── hotfix/critical-bug-fix
```

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-issue` - Production hotfixes
- `refactor/component-name` - Code refactoring

### Commit Message Format
```
<type>: <short description>

<longer description (optional)>

Types: feat, fix, refactor, docs, style, test, chore
```

Examples:
```bash
git commit -m "feat: add job wishlist functionality"
git commit -m "fix: resolve application status update bug"
git commit -m "refactor: optimize database queries in jobs API"
```

### Development Workflow

1. **Pull Latest Changes**
```bash
git checkout develop
git pull origin develop
```

2. **Create Feature Branch**
```bash
git checkout -b feature/my-new-feature
```

3. **Make Changes & Commit**
```bash
git add .
git commit -m "feat: implement feature"
```

4. **Push to Remote**
```bash
git push origin feature/my-new-feature
```

5. **Create Pull Request**
- Create PR from `feature/my-new-feature` → `develop`
- Request code review from team members
- Address feedback and merge

6. **Merge to Main (Production)**
```bash
git checkout main
git merge develop
git push origin main
```

### Code Review Guidelines
- ✅ Check for proper error handling
- ✅ Verify database security (SQL injection prevention)
- ✅ Ensure CORS headers are correct
- ✅ Test on both desktop and mobile
- ✅ Verify no sensitive data in commits

### Team Communication
- **Daily Standups** - Quick progress updates
- **Code Reviews** - Peer review before merging
- **Documentation** - Update README for major changes
- **Issue Tracking** - Use GitHub Issues for bugs/features

---

## 🔮 Future Enhancements

### High Priority
- [ ] **Push Notifications** - Real-time browser notifications for messages/applications
- [ ] **Advanced Search** - Elasticsearch integration for faster, more relevant job search
- [ ] **Video Interviews** - Integrate WebRTC for in-platform video interviews
- [ ] **Calendar Integration** - Sync job deadlines and interviews with Google Calendar
- [ ] **Mobile App** - React Native iOS/Android applications
- [ ] **Analytics Dashboard** - Advanced data visualization for employers

### Medium Priority
- [ ] **AI Job Recommendations** - Machine learning for personalized job matching
- [ ] **Multi-language Support** - Internationalization (i18n) for regional support
- [ ] **Portfolio Showcase** - Students can upload project portfolios
- [ ] **Skill Verification** - Third-party skill assessment integrations
- [ ] **Referral System** - Reward students for referring other students
- [ ] **Automated Testing** - Increase unit test coverage

### Low Priority
- [ ] **Social Media Integration** - Login with Google, Facebook, LinkedIn
- [ ] **Job Alerts** - Email/SMS alerts for new matching jobs
- [ ] **Company Verification** - Business license verification for publishers
- [ ] **Time Tracking** - Built-in timesheet management for accepted jobs
- [ ] **Dispute Resolution** - Mediation system for conflicts between students and publishers
- [ ] **API Webhooks** - Allow third-party integrations

### Technical Improvements
- [ ] **TypeScript Migration** - Convert frontend to TypeScript for type safety
- [ ] **API Rate Limiting** - Prevent abuse with request throttling
- [ ] **Caching Layer** - Redis/Memcached for improved performance
- [ ] **Database Optimization** - Indexing and query optimization
- [ ] **API Documentation** - Swagger/OpenAPI documentation
- [ ] **Docker Containerization** - Docker Compose for easy deployment
- [ ] **CI/CD Pipeline** - Automated testing and deployment (GitHub Actions)
- [ ] **Monitoring & Logging** - Sentry for error tracking, LogRocket for user sessions

### Security Enhancements
- [ ] **Two-Factor Authentication (2FA)** - Enhanced account security
- [ ] **Content Security Policy** - Prevent XSS attacks
- [ ] **API Versioning** - Backward compatibility for API changes
- [ ] **Penetration Testing** - Regular security audits
- [ ] **GDPR Compliance** - Data privacy and user consent management

---

## 📝 License

This project is developed as a university group project. All rights reserved by the development team.

---

## 🤝 Contributing

This is a university group project. Contributions are managed within the team using the Git workflow outlined above.

For external contributions, please contact the project maintainers.

---

## 📧 Contact & Support

For questions, issues, or feature requests:
- **GitHub Issues** - [Create an issue](https://github.com/your-repo/issues)
- **Team Email** - uniwiz.dev@example.com
- **Project Lead** - [Name] (email@example.com)

---

## 🙏 Acknowledgments

- **TailwindCSS** - For the excellent utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Stripe** - For payment processing infrastructure
- **PHPMailer** - For reliable email delivery
- **React Community** - For extensive documentation and support
- **University Faculty** - For guidance and project support

---

**Built with ❤️ by the UniWiz Development Team**

*Last Updated: January 2026*
