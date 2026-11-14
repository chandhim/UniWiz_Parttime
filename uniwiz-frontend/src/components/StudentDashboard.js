// FILE: src/components/StudentDashboard.js (BESPOKE UNIWIZ EMERALD & AMBER EDITION)
// =================================================================================
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://uniwiz-backend.test/api';

// --- StatCard: Displays a dashboard stat with icon and action ---
const ModernStatCard = ({ title, value, icon, onLinkClick, description, gradient, textColor }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-emerald-500/40 flex flex-col justify-between transition-all"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-gradient-to-tr ${gradient} text-white shadow-xs`}>
        {icon}
      </div>
    </div>
    <button
      onClick={onLinkClick}
      className={`text-left text-xs font-bold mt-4 flex items-center group ${textColor} hover:underline`}
    >
      {description}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </motion.div>
);

// --- ProfileCompletionCard: Shows profile completion progress ---
const ModernProfileCompletionCard = ({ percentage = 85, setPage }) => (
  <motion.div
    whileHover={{ y: -3 }}
    onClick={() => setPage('profile')}
    className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-card hover:border-emerald-500/40 hover:shadow-card-hover cursor-pointer flex flex-col justify-between transition-all group"
  >
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Profile Strength</p>
        <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full"
        />
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
      <span>{percentage < 100 ? 'Boost profile to get 2x more interviews' : 'Your profile looks exceptional!'}</span>
      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </motion.div>
);

// --- StatusBadge ---
const ModernStatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    viewed: 'bg-sky-50 text-sky-800 border-sky-200',
    accepted: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold',
    rejected: 'bg-rose-50 text-rose-800 border-rose-200',
    applied: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    default: 'bg-slate-50 text-slate-700 border-slate-200'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold capitalize border ${styles[status] || styles.default}`}>
      {status}
    </span>
  );
};

// --- Modern Job Card for Recommended Jobs ---
const ModernJobCard = ({
  job,
  currentUser,
  handleApply,
  handleViewCompanyProfile,
  handleViewJobDetails,
  applyingStatus,
  addToWishlist,
  isInWishlist
}) => {
  const categoryName = job.category_name || job.category;
  const displayName = job.company_name || job.publisher_name || 'Verified Employer';
  const logoUrl = job.profile_image_url;
  const currentApplicationStatus = applyingStatus[job.id] || job.application_status;
  const inWishlist = isInWishlist ? isInWishlist(job.id) : false;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-emerald-500/40 p-5 sm:p-6 flex flex-col justify-between transition-all group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center font-bold text-emerald-800 flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl.startsWith('http') ? logoUrl : `${API_BASE_URL}/${logoUrl}`}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                displayName.charAt(0)
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 line-clamp-1 flex items-center gap-1">
                <button
                  onClick={() => handleViewCompanyProfile(job.publisher_id)}
                  className="hover:text-emerald-700 transition-colors"
                >
                  {displayName}
                </button>
                <svg className="w-3.5 h-3.5 text-emerald-600 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </p>
              <h3 
                onClick={() => handleViewJobDetails(job)}
                className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
              >
                {job.title}
              </h3>
            </div>
          </div>

          {currentUser && currentUser.role === 'student' && (
            <button
              onClick={() => addToWishlist(job)}
              className={`p-1.5 rounded-lg transition-colors ${
                inWishlist
                  ? 'text-rose-500 bg-rose-50'
                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
              }`}
              title={inWishlist ? "Saved in wishlist" : "Save job"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            {job.job_type || 'Part-time'}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
            {job.location || 'Remote'}
          </span>
          {categoryName && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              {categoryName}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Estimated Pay</span>
          <span className="text-xs font-black text-emerald-800">
            {job.payment_range || 'Competitive'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentApplicationStatus ? (
            <ModernStatusBadge status={currentApplicationStatus} />
          ) : (
            <>
              <button
                onClick={() => handleViewJobDetails(job)}
                className="text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all"
              >
                Details
              </button>
              {currentUser && currentUser.role === 'student' && (
                <button
                  onClick={() => handleApply(job)}
                  className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl transition-all shadow-xs active:scale-95"
                >
                  Apply
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- StudentDashboard Component ---
function StudentDashboard({
  currentUser,
  handleApply,
  setPage,
  setPublisherIdForProfile,
  handleViewJobDetails,
  setAppliedJobsPageFilter,
  applyingStatus = {},
  addToWishlist,
  isInWishlist
}) {
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [errorJobs, setErrorJobs] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser || !currentUser.id) return;
      setIsLoadingStats(true);
      try {
        const response = await fetch(`http://uniwiz-backend.test/api/get_student_stats.php?student_id=${currentUser.id}`);
        const data = await response.json();
        if (response.ok) setStats(data);
        else throw new Error(data.message || 'Failed to fetch student stats.');
      } catch (err) {
        setErrorStats(err.message);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [currentUser]);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      if (!currentUser || !currentUser.id) return;
      setIsLoadingJobs(true);
      try {
        const response = await fetch(`http://uniwiz-backend.test/api/get_recommended_jobs.php?student_id=${currentUser.id}`);
        const data = await response.json();
        if (response.ok) setRecommendedJobs(data);
        else throw new Error(data.message || 'Failed to fetch recommended jobs.');
      } catch (err) {
        setErrorJobs(err.message);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchRecommendedJobs();
  }, [currentUser]);

  const handleViewCompanyProfile = (publisherId) => {
    if (setPage && setPublisherIdForProfile) {
      setPublisherIdForProfile(publisherId);
      setPage('company-profile');
    }
  };

  const handleStatLinkClick = (filter) => {
    setAppliedJobsPageFilter(filter);
    setPage('applied-jobs');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner: Deep Emerald Pine Obsidian */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#032019] via-[#063a2f] to-[#041f18] p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-emerald-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30">
                  🎓 Undergrad Career Hub
                </span>
                <span className="text-xs font-semibold text-emerald-200/70">
                  Verified Campus Network
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back, {currentUser?.first_name || 'Scholar'}! 👋
              </h1>
              <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-xl">
                Ready to earn and build your resume? Explore flexible part-time gigs that fit your lecture timetable.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPage('find-jobs')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                Browse All Gigs
              </button>
              <button
                onClick={() => setPage('profile')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 transition-all backdrop-blur-sm"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoadingStats ? (
            <>
              <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200" />
              <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200" />
              <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200" />
              <div className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200" />
            </>
          ) : errorStats ? (
            <div className="col-span-full p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold">
              Error loading metrics: {errorStats}
            </div>
          ) : (
            <>
              <ModernStatCard
                title="Applications Sent"
                value={stats?.applications_sent ?? 0}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                }
                gradient="from-emerald-600 to-teal-700"
                textColor="text-emerald-700"
                description="View all sent applications"
                onLinkClick={() => handleStatLinkClick('All')}
              />
              <ModernStatCard
                title="Offers Accepted"
                value={stats?.applications_accepted ?? 0}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                gradient="from-amber-500 to-yellow-600"
                textColor="text-amber-700"
                description="View accepted offers"
                onLinkClick={() => handleStatLinkClick('Accepted')}
              />
              <ModernStatCard
                title="Profile Views"
                value={stats?.profile_views ?? 0}
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
                gradient="from-teal-600 to-cyan-700"
                textColor="text-teal-700"
                description="Who viewed your profile"
                onLinkClick={() => handleStatLinkClick('Viewed')}
              />
              <ModernProfileCompletionCard
                percentage={stats?.profile_completion_percentage ?? 85}
                setPage={setPage}
              />
            </>
          )}
        </div>

        {/* Recommended Jobs */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Recommended For You
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Curated based on your university courses, study year, and verified skills.
              </p>
            </div>
            <button
              onClick={() => setPage('find-jobs')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 group"
            >
              Browse all jobs
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {isLoadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="h-48 bg-white rounded-2xl animate-pulse border border-slate-200" />
              <div className="h-48 bg-white rounded-2xl animate-pulse border border-slate-200" />
              <div className="h-48 bg-white rounded-2xl animate-pulse border border-slate-200" />
            </div>
          ) : errorJobs ? (
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold">
              Error loading recommended jobs: {errorJobs}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <ModernJobCard
                    key={job.id}
                    job={job}
                    currentUser={currentUser}
                    handleApply={handleApply}
                    handleViewCompanyProfile={handleViewCompanyProfile}
                    handleViewJobDetails={handleViewJobDetails}
                    applyingStatus={applyingStatus}
                    addToWishlist={addToWishlist}
                    isInWishlist={isInWishlist}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 p-8">
                  <p className="text-sm font-bold text-slate-700">No recommended jobs right now.</p>
                  <p className="text-xs text-slate-400 mt-1">Check back later or search all open vacancies.</p>
                  <button
                    onClick={() => setPage('find-jobs')}
                    className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    Explore Job Feed
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
