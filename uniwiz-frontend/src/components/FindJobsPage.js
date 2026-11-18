// FILE: src/components/FindJobsPage.js (BESPOKE UNIWIZ EMERALD & AMBER EDITION)
// =================================================================================
import React, { useState, useEffect, useCallback } from 'react';
import { getCategoryColorClass } from '../utils/categoryColors';
import { API_BASE_URL } from '../config';

const MAX_SALARY = 50000;

// --- LoadingSpinner: Shows an emerald spinner ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-16">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-emerald-200 border-t-emerald-600"></div>
    </div>
);

// --- StatusBadge: Shows a colored badge for application status ---
const StatusBadge = ({ status }) => {
    const statusClasses = {
        pending: "bg-amber-50 text-amber-800 border-amber-200",
        viewed: "bg-sky-50 text-sky-800 border-sky-200",
        accepted: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold",
        rejected: "bg-rose-50 text-rose-800 border-rose-200",
        applied: "bg-emerald-50 text-emerald-700 border-emerald-200",
        default: "bg-slate-50 text-slate-700 border-slate-200"
    };
    return (
        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider capitalize ${statusClasses[status] || statusClasses.default}`}>
            {status}
        </span>
    );
};

// --- JobCard: Displays a single job card in the job list ---
const JobCard = ({ job, currentUser, handleApply, handleViewCompanyProfile, handleViewJobDetails, applyingStatus, addToWishlist, isInWishlist }) => {
    const categoryName = job.category_name || job.category;
    const displayName = job.company_name || job.publisher_name || 'A Reputed Company';
    const categoryColorClass = getCategoryColorClass(categoryName);
    const logoUrl = job.profile_image_url;
    const currentApplicationStatus = applyingStatus[job.id] || job.application_status;

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const postedDate = formatDate(job.created_at);
    const inWishlist = isInWishlist ? isInWishlist(job.id) : false;

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div className="p-5">
                {/* Top Row: Category + Wishlist + Posted Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-md ${categoryColorClass}`}>
                        {categoryName}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium text-slate-400">
                            {postedDate ? `Posted ${postedDate}` : ''}
                        </span>
                        {currentUser && currentUser.role === 'student' && (
                            <button 
                                onClick={(e) => { e.stopPropagation(); addToWishlist(job); }}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    inWishlist
                                        ? 'text-rose-500 bg-rose-50' 
                                        : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100'
                                }`}
                                title={inWishlist ? "Saved to Wishlist" : "Save for later"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Job Title */}
                <h3 
                    onClick={() => handleViewJobDetails(job)}
                    className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 mb-2"
                >
                    {job.title}
                </h3>

                {/* Company Name & Verification */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    <button 
                        onClick={() => handleViewCompanyProfile(job.publisher_id)}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors flex items-center gap-1 line-clamp-1"
                    >
                        <span>{displayName}</span>
                        <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Job Meta Chips */}
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-600 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {job.job_type || 'Part-time'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {job.location || 'Colombo / Remote'}
                    </span>
                </div>
            </div>

            {/* Bottom Row: Compensation + Apply Button */}
            <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Compensation</span>
                    <span className="text-sm font-black text-emerald-800">
                        {job.payment_range || 'Negotiable'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleViewJobDetails(job)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 transition-colors shadow-xs"
                    >
                        Details
                    </button>
                    
                    {currentApplicationStatus ? (
                        <StatusBadge status={currentApplicationStatus} />
                    ) : (
                        currentUser && currentUser.role === 'student' && (
                            <button
                                onClick={() => handleApply(job)}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs hover:shadow transition-all group-hover:scale-105 active:scale-95"
                            >
                                Apply Now
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main FindJobsPage Component ---
function FindJobsPage({ currentUser, handleApply, setPage, setPublisherIdForProfile, handleViewJobDetails, applyingStatus, addToWishlist, isInWishlist }) {
    const [allJobs, setAllJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleJobsCount, setVisibleJobsCount] = useState(9);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [jobTypeFilter, setJobTypeFilter] = useState('');
    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(MAX_SALARY);
    const [postedDateFilter, setPostedDateFilter] = useState('anytime');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [categories, setCategories] = useState([]);
    
    const JOBS_PER_LOAD = 9;

    const sriLankaDistricts = [
        "Colombo", "Kandy", "Gampaha", "Galle", "Kalutara", "Matara", "Kurunegala", "Jaffna",
        "Anuradhapura", "Badulla", "Batticaloa", "Hambantota", "Kegalle", "Kilinochchi",
        "Mannar", "Matale", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
        "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya", "Ampara"
    ];

    // Fetch jobs
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const studentIdParam = currentUser ? `student_id=${currentUser.id}` : '';
            const jobsResponse = await fetch(`${API_BASE_URL}/jobs.php?${studentIdParam}`);
            if (!jobsResponse.ok) throw new Error('Failed to fetch jobs.');
            const jobsData = await jobsResponse.json();
            setAllJobs(jobsData);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/get_categories.php`);
                const data = await response.json();
                if (response.ok) setCategories(data);
            } catch (err) { console.error("Failed to fetch categories:", err); }
        };
        fetchData();
        fetchCategories();
    }, [fetchData]);

    const handleViewCompanyProfile = (publisherId) => {
        if (setPage && setPublisherIdForProfile) {
            setPublisherIdForProfile(publisherId);
            setPage('company-profile');
        }
    };
    
    // Filter jobs
    const filteredJobs = allJobs.filter(job => {
        const searchTermMatch = searchTerm === '' || 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const categoryMatch = selectedCategory === '' || String(job.category_id) === String(selectedCategory);
        const jobTypeMatch = jobTypeFilter === '' || job.job_type === jobTypeFilter;
        const paymentValue = parseInt(job.payment_range?.replace(/[^0-9]/g, '') || '0', 10);
        const salaryMatch = paymentValue >= minSalary && paymentValue <= maxSalary;
        const districtMatch = selectedDistrict === '' || (job.location && job.location.toLowerCase().includes(selectedDistrict.toLowerCase()));

        const now = new Date();
        const createdDate = new Date(job.created_at);
        let postedDateMatch = true;
        if (postedDateFilter === '24hours') postedDateMatch = now - createdDate <= 24 * 60 * 60 * 1000;
        else if (postedDateFilter === '7days') postedDateMatch = now - createdDate <= 7 * 24 * 60 * 60 * 1000;
        else if (postedDateFilter === '30days') postedDateMatch = now - createdDate <= 30 * 24 * 60 * 60 * 1000;

        return searchTermMatch && categoryMatch && jobTypeMatch && salaryMatch && postedDateMatch && districtMatch;
    });
    
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setJobTypeFilter('');
        setMinSalary(0);
        setMaxSalary(MAX_SALARY);
        setPostedDateFilter('anytime');
        setSelectedDistrict('');
    };

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-[#F8FAFC] text-slate-800">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                🎓 Campus & Remote Gigs
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                                Verified Undergrad Roles
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Find Flexible Part-Time Jobs
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                            Earn while you learn with top employers who respect your university schedule.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">
                            Showing <strong className="text-emerald-700">{filteredJobs.length}</strong> available jobs
                        </span>
                    </div>
                </div>

                {/* Quick Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === ''
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        ⚡ All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === String(cat.id) ? '' : String(cat.id))}
                            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                selectedCategory === String(cat.id)
                                    ? 'bg-emerald-700 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Search & Filter Card */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs items-end">
                        {/* Search Input */}
                        <div className="lg:col-span-2">
                            <label className="block text-slate-700 font-bold mb-1">Search Keywords</label>
                            <div className="relative">
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by job title, skill, company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Job Type */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Job Type</label>
                            <select
                                value={jobTypeFilter}
                                onChange={(e) => setJobTypeFilter(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                                <option value="">All Job Types</option>
                                <option value="part-time">Part-time</option>
                                <option value="freelance">Freelance / Gig</option>
                                <option value="internship">Internship</option>
                                <option value="task-based">Task-based</option>
                            </select>
                        </div>

                        {/* District / Location */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">Location / District</label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                                <option value="">All Locations</option>
                                <option value="Remote">Remote Only</option>
                                {sriLankaDistricts.map(dist => (<option key={dist} value={dist}>{dist}</option>))}
                            </select>
                        </div>

                        {/* Salary Slider */}
                        <div>
                            <label className="block text-slate-700 font-bold mb-1">
                                Max Budget: <span className="text-emerald-700 font-extrabold">Rs. {maxSalary.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min="5000"
                                max={MAX_SALARY}
                                step="2500"
                                value={maxSalary}
                                onChange={(e) => setMaxSalary(Number(e.target.value))}
                                className="w-full accent-emerald-600 cursor-pointer mt-2"
                            />
                        </div>

                        {/* Reset Filter Button */}
                        <div>
                            <button
                                onClick={handleResetFilters}
                                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Job Cards Grid */}
                {isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center text-rose-500 py-16 bg-white rounded-2xl border border-slate-200">
                        {`Failed to load jobs: ${error}`}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.slice(0, visibleJobsCount).map(job => (
                                    <JobCard 
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
                                <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-800">No jobs match your current filters</h3>
                                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                        Try loosening your search keywords or resetting the filters to explore all available part-time opportunities.
                                    </p>
                                    <button
                                        onClick={handleResetFilters}
                                        className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {visibleJobsCount < filteredJobs.length && (
                            <div className="text-center pt-4">
                                <button
                                    onClick={() => setVisibleJobsCount(prev => prev + JOBS_PER_LOAD)}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-xs hover:shadow transition-all"
                                >
                                    Load More Gigs ({filteredJobs.length - visibleJobsCount} remaining)
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default FindJobsPage;
