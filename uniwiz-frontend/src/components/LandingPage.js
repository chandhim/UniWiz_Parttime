import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Constants ---
const API_BASE_URL = 'http://uniwiz-backend.test/api';

// --- Category Data with Modern Icons & Gradients ---
const CATEGORIES = [
  {
    name: 'Information Technology',
    slug: 'it',
    count: '14+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'hover:border-blue-300'
  },
  {
    name: 'Design & Creative',
    slug: 'design',
    count: '9+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-50',
    border: 'hover:border-purple-300'
  },
  {
    name: 'Marketing & Sales',
    slug: 'marketing',
    count: '11+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    color: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-50',
    border: 'hover:border-rose-300'
  },
  {
    name: 'Tutoring & Education',
    slug: 'tutoring',
    count: '16+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-9.422L12 14z" />
      </svg>
    ),
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'hover:border-emerald-300'
  },
  {
    name: 'Writing & Translation',
    slug: 'writing',
    count: '7+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'from-amber-500 to-yellow-600',
    bg: 'bg-amber-50',
    border: 'hover:border-amber-300'
  },
  {
    name: 'Administrative Support',
    slug: 'admin',
    count: '12+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-50',
    border: 'hover:border-cyan-300'
  },
  {
    name: 'Customer Service',
    slug: 'support',
    count: '8+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    border: 'hover:border-indigo-300'
  },
  {
    name: 'Hospitality & Events',
    slug: 'events',
    count: '6+ Openings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-fuchsia-500 to-pink-600',
    bg: 'bg-fuchsia-50',
    border: 'hover:border-fuchsia-300'
  }
];

// --- Modern Job Card ---
const ModernJobCard = ({ job, setPage, isNew }) => {
  const companyName = job.company_name || 'Verified Employer';
  const logo = job.profile_image_url;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_30px_-4px_rgba(99,102,241,0.12)] hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      {/* Top Accent Gradient Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Company & Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-lg">
              {logo ? (
                <img
                  src={logo.startsWith('http') ? logo : `${API_BASE_URL}/${logo}`}
                  alt={companyName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                companyName.charAt(0)
              )}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                {companyName}
                <svg className="w-3.5 h-3.5 text-blue-500 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </h4>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mt-0.5">
                {job.title}
              </h3>
            </div>
          </div>

          {isNew && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
              New
            </span>
          )}
        </div>

        {/* Job Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Meta Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {job.job_type || 'Part-time'}
          </span>
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            <svg className="w-3 h-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {job.location || 'Remote'}
          </span>
          {job.category_name && (
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              {job.category_name}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Rate & CTA */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Estimated Pay</span>
          <span className="text-sm font-extrabold text-emerald-800">
            {job.payment_range || 'Competitive'}
          </span>
        </div>

        <button
          onClick={() => setPage('login', { signup: true, role: 'student' })}
          className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs hover:shadow group-hover:scale-105 active:scale-95"
        >
          Apply Now
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

// --- Main LandingPage Component ---
const LandingPage = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [jobs, setJobs] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch jobs
  useEffect(() => {
    fetch(`${API_BASE_URL}/get_public_jobs.php`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .catch((err) => console.error('Error fetching jobs:', err));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage('public-jobs', { search: searchQuery, category: selectedCategory });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* =========================================================================
          1. FLOATING MODERN HEADER / NAVBAR
         ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform ring-2 ring-emerald-500/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-9.422L12 14z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Uni<span className="text-emerald-700">Wiz</span>
                </span>
                <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-amber-50 text-amber-800 ring-1 ring-amber-500/20">
                  Campus Gigs
                </span>
              </div>
            </div>

            {/* Center Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#browse-categories" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
                Categories
              </a>
              <a href="#featured-jobs" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
                Featured Jobs
              </a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
                Reviews
              </a>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage('login')}
                className="text-sm font-bold text-slate-700 hover:text-emerald-700 px-4 py-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => setPage('login', { signup: true, role: 'student' })}
                className="text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ULTRA-MODERN HERO SECTION
         ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-radial-gradient bg-grid-slate">
        {/* Ambient background glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-500/15 via-amber-500/12 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Announcement */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm mb-6 text-xs font-semibold text-slate-700"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              The #1 Campus Talent & Part-Time Job Platform in Sri Lanka
            </motion.div>

            {/* Hero Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-6"
            >
              Power Your Degree with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
                Real-World Experience.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto"
            >
              Connect with vetted employers, earn competitive part-time income, and build a stand-out portfolio that fits seamlessly around your lectures.
            </motion.p>

            {/* Interactive Hero Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08)] max-w-3xl mx-auto mb-10"
            >
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2 px-3.5 py-2.5 flex-1 w-full bg-slate-50/80 rounded-xl border border-slate-200/60 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, skill (e.g. React, Tutor, Design)..."
                    className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 px-3.5 py-2.5 sm:w-56 w-full bg-slate-50/80 rounded-xl border border-slate-200/60 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                  <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 group active:scale-95"
                >
                  Explore Jobs
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </motion.div>

            {/* Quick Hero Value Points / Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Student Identity
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Guaranteed Pay
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Flexible Lecture Hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CATEGORIES BENTO GRID
         ========================================================================= */}
      <section id="browse-categories" className="py-20 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">
                Explore Sectors
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Job Categories
              </h2>
            </div>
            <button
              onClick={() => setPage('public-jobs')}
              className="mt-4 sm:mt-0 text-sm font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 group"
            >
              Browse all categories
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.slug}
                whileHover={{ y: -4 }}
                onClick={() => setPage('public-jobs', { category: cat.name })}
                className={`p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 ${cat.border} hover:bg-white hover:shadow-card-hover transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{cat.count}</span>
                  <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                    View
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FEATURED JOBS SECTION
         ========================================================================= */}
      <section id="featured-jobs" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">
              Hand-Picked Openings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Latest Verified Opportunities
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Apply to active vacancies designed specifically for undergraduates with flexible schedules and fair wages.
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 6).map((job, idx) => (
                <ModernJobCard key={job.id || idx} job={job} setPage={setPage} isNew={idx < 2} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Loading Available Openings...</h3>
              <p className="text-sm text-slate-500">Checking the database for the newest opportunities.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => setPage('public-jobs')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 hover:text-indigo-600 font-bold text-sm shadow-sm hover:shadow transition-all group"
            >
              Browse All Job Openings
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS (STUDENTS & EMPLOYERS)
         ========================================================================= */}
      <section id="how-it-works" className="py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">
              Effortless Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              How UniWiz Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A transparent, secure process designed for Sri Lankan university talent and modern companies.
            </p>

            {/* Segmented Control Switcher */}
            <div className="mt-8 inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'students'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveTab('employers')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'employers'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                For Employers
              </button>
            </div>
          </div>

          {/* Steps Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {activeTab === 'students' ? (
              <>
                <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/70 relative">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Build Your Campus Profile</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sign up with your university email, list your key skills, availability slots, and showcase your past projects.
                  </p>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/70 relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-purple-500/20">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Apply with 1-Click</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Filter by category, pay rate, or remote work. Send customized proposals directly to hiring managers.
                  </p>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/70 relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Work & Earn Safely</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Chat in-app, complete tasks, receive verified employer reviews, and build your corporate reputation.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/70 relative">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Post Your Requirement</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Define the task, required university disciplines, hourly rates, and working hours in less than 2 minutes.
                  </p>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/70 relative">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-purple-500/20">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Review Top Applicants</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Filter verified students by degree, GPA, and student review score. Interview candidates via built-in chat.
                  </p>
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-8 border border-slate-200/70 relative">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-500/20">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Onboard & Scale</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Hire motivated young minds for part-time, seasonal, or project gigs with predictable pricing and zero friction.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. TESTIMONIALS & REVIEWS
         ========================================================================= */}
      <section id="testimonials" className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Trusted by Students & Employers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              See what undergraduates and industry partners say about their experience on UniWiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Review 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "UniWiz allowed me to work as a junior React developer for Tech Solutions Lanka while completing my 3rd year at UWU. The flexible 15 hrs/week schedule never interfered with my exams!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  KP
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Kasun Perera</h4>
                  <p className="text-xs text-slate-500">CS Undergrad, Uva Wellassa University</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "Finding skilled undergraduates with fresh ideas in Figma and UI design used to take weeks. With UniWiz, we found Dineth from Moratuwa within 48 hours. The quality of student work is top notch!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  KS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Kavindi Silva</h4>
                  <p className="text-xs text-slate-500">Design Lead, Creative Studio Colombo</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic mb-6">
                  "UniWiz made student peer-tutoring coordination seamless. Senior students get fair stipends while junior students get personalized academic mentoring."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  NF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dr. Nihal Fernando</h4>
                  <p className="text-xs text-slate-500">Coordinator, Uva Wellassa Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. MODERN HIGH-IMPACT CALL TO ACTION (CTA)
         ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
            {/* Ambient circular gradients inside card */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30 mb-4">
                Start Today
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
                Ready to take control of your student journey?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Join thousands of Sri Lankan undergraduates already discovering verified part-time jobs, internships, and project work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setPage('login', { signup: true, role: 'student' })}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Sign Up as Student
                </button>
                <button
                  onClick={() => setPage('login', { signup: true, role: 'publisher' })}
                  className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 hover:scale-[1.02] active:scale-95 transition-all backdrop-blur-sm"
                >
                  Hire Campus Talent
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. MODERN DARK FOOTER
         ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Col 1: Brand Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  UW
                </div>
                <span className="text-lg font-extrabold text-white tracking-tight">UniWiz</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
                The leading platform connecting Sri Lankan university students with verified part-time employment, academic tutoring, and corporate freelance gigs.
              </p>
              <div className="text-xs text-slate-500">
                Created for Sri Lankan University undergraduates.
              </div>
            </div>

            {/* Col 2: For Students */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">For Students</h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#featured-jobs" className="hover:text-indigo-400 transition-colors">Browse Jobs</a></li>
                <li><button onClick={() => setPage('login', { signup: true, role: 'student' })} className="hover:text-indigo-400 transition-colors">Student Sign Up</button></li>
                <li><a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Col 3: For Employers */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">For Employers</h4>
              <ul className="space-y-2.5 text-xs">
                <li><button onClick={() => setPage('login', { signup: true, role: 'publisher' })} className="hover:text-indigo-400 transition-colors">Post a Vacancy</button></li>
                <li><a href="#browse-categories" className="hover:text-indigo-400 transition-colors">Talent Disciplines</a></li>
                <li><button onClick={() => setPage('login')} className="hover:text-indigo-400 transition-colors">Employer Login</button></li>
              </ul>
            </div>

            {/* Col 4: Platform */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5 text-xs">
                <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Support Desk</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} UniWiz Portal. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Backed by Supabase & Prisma</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          9. FLOATING BACK TO TOP
         ========================================================================= */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-slate-900 text-white shadow-xl hover:bg-indigo-600 transition-all hover:scale-110 active:scale-95"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default LandingPage;
