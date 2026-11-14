// FILE: src/components/AppliedJobsPage.js (BESPOKE UNIWIZ EMERALD & AMBER EDITION)
// =================================================================================
import React, { useState, useEffect, useCallback } from 'react';

// --- LoadingSpinner ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-3 border-emerald-200 border-t-emerald-600"></div>
  </div>
);

// --- StatusBadge ---
const StatusBadge = ({ status }) => {
    const statusClasses = {
        applied: "bg-emerald-50 text-emerald-800 border-emerald-200",
        pending: "bg-amber-50 text-amber-800 border-amber-200",
        viewed: "bg-sky-50 text-sky-800 border-sky-200",
        accepted: "bg-emerald-50 text-emerald-800 border-emerald-200 font-extrabold",
        rejected: "bg-rose-50 text-rose-800 border-rose-200",
        active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        closed: "bg-slate-100 text-slate-700 border-slate-200",
        deleted: "bg-rose-50 text-rose-700 border-rose-200",
        default: "bg-slate-100 text-slate-800 border-slate-200",
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border capitalize inline-block ${statusClasses[status] || statusClasses.default}`}>
            {status}
        </span>
    );
};

// --- Main AppliedJobsPage component ---
function AppliedJobsPage({ user, initialFilter, setInitialFilter, handleViewJobDetails }) {
    const [allApplications, setAllApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(initialFilter || 'All');

    const tabs = ['All', 'Pending', 'Viewed', 'Accepted', 'Rejected', 'Closed'];

    const fetchApplicationDetails = useCallback(async () => {
        if (!user || !user.id) {
            setIsLoading(false);
            setAllApplications([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://uniwiz-backend.test/api/get_student_application_details.php?student_id=${user.id}`);
            const data = await response.json();

            if (response.ok) {
                setAllApplications(data);
            } else {
                throw new Error(data.message || 'Failed to fetch your applications.');
            }
        } catch (err) {
            console.error("Failed to fetch applied job details:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const filterApplications = useCallback((applicationsToFilter, tab) => {
        if (tab === 'All') {
            setFilteredApplications(applicationsToFilter);
        } else if (tab === 'Closed') {
            setFilteredApplications(applicationsToFilter.filter(app => app.job_status === 'closed'));
        } else {
            setFilteredApplications(applicationsToFilter.filter(app => app.application_status?.toLowerCase() === tab.toLowerCase()));
        }
    }, []);

    useEffect(() => {
        fetchApplicationDetails();
    }, [fetchApplicationDetails]);

    useEffect(() => {
        filterApplications(allApplications, activeTab);
    }, [activeTab, allApplications, filterApplications]);

    useEffect(() => {
        return () => {
            if (setInitialFilter) {
                setInitialFilter('All');
            }
        };
    }, [setInitialFilter]);
    
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        if (setInitialFilter) {
            setInitialFilter(tab);
        }
    };

    if (!user) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-[#F8FAFC] text-slate-800">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                📋 Application Tracker
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            My Part-Time Applications
                        </h2>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                            Monitor employer reviews, interviews, and job acceptance statuses in real time.
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white p-1.5 rounded-2xl flex flex-wrap gap-1.5 shadow-sm border border-slate-200/90">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => handleTabClick(tab)}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                                activeTab === tab 
                                    ? 'bg-emerald-700 text-white shadow-xs' 
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-slate-200/90">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Job Role</th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Employer</th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Date Applied</th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Application Status</th>
                                    <th className="px-5 py-3.5 text-left text-[11px] font-black text-slate-500 uppercase tracking-wider">Vacancy Status</th>
                                    <th className="px-5 py-3.5 text-right text-[11px] font-black text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr><td colSpan="6" className="text-center py-12 text-slate-400"><LoadingSpinner /></td></tr>
                                ) : error ? (
                                    <tr><td colSpan="6" className="text-center py-10 bg-rose-50 text-rose-600 font-semibold">{error}</td></tr>
                                ) : filteredApplications.length > 0 ? (
                                    filteredApplications.map(app => (
                                        <tr key={app.job_id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className="text-sm font-extrabold text-slate-900 block">
                                                    {app.job_title}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                                                {app.publisher_name}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                                                {new Date(app.applied_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-xs">
                                                <StatusBadge status={app.application_status} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-xs">
                                                <StatusBadge status={app.job_status || 'active'} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-right text-xs font-bold">
                                                {app.job_status === 'active' ? (
                                                    <button 
                                                        onClick={() => handleViewJobDetails(app)}
                                                        className="text-emerald-700 hover:text-emerald-800 hover:underline px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                                                    >
                                                        View Job →
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400 cursor-not-allowed">Closed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 bg-slate-50/50">
                                            <p className="font-bold text-sm text-slate-600">No applications found in this category.</p>
                                            <p className="text-xs text-slate-400 mt-1">Explore available part-time jobs and apply today.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppliedJobsPage;
