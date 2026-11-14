// FILE: src/components/TopNavbar.js (BESPOKE UNIWIZ EMERALD & AMBER EDITION)
// =================================================================================
import React, { useState, useEffect, useRef } from 'react';

// --- NotificationIcon: Shows notification icon with color based on type and user role ---
const NotificationIcon = ({ type, role }) => {
    const roleColors = {
        student: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
        publisher: 'text-teal-700 bg-teal-50 border-teal-200/80',
        admin: 'text-amber-700 bg-amber-50 border-amber-200/80',
        default: 'text-slate-600 bg-slate-50 border-slate-200'
    };

    const iconMap = {
        new_applicant: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        application_accepted: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        application_rejected: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        new_review: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
        default: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        )
    };

    return (
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl border flex items-center justify-center ${roleColors[role] || roleColors.default}`}>
            {iconMap[type] || iconMap.default}
        </div>
    );
};

// --- Main TopNavbar Component ---
function TopNavbar({ user, setPage, notifications = [], onNotificationClick }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const safeNotifications = Array.isArray(notifications) ? notifications : [];
    const unreadCount = safeNotifications.filter(n => !n.is_read).length;

    const roleBadge = {
        student: {
            label: 'Undergrad Student',
            bg: 'bg-emerald-50/90',
            text: 'text-emerald-800',
            border: 'border-emerald-200',
            dot: 'bg-emerald-500',
            icon: '🎓'
        },
        publisher: {
            label: 'Vetted Employer',
            bg: 'bg-teal-50/90',
            text: 'text-teal-800',
            border: 'border-teal-200',
            dot: 'bg-teal-500',
            icon: '🏢'
        },
        admin: {
            label: 'Administrator',
            bg: 'bg-amber-50/90',
            text: 'text-amber-800',
            border: 'border-amber-200',
            dot: 'bg-amber-500',
            icon: '⚡'
        }
    }[user?.role] || {
        label: 'UniWiz Portal',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
        icon: '✨'
    };

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleItemClick = (notification) => {
        if (onNotificationClick) onNotificationClick(notification);
        setIsDropdownOpen(false);
    };

    const timeSince = (date) => {
        if (!date) return '';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "just now";
    };

    const displayName = user?.company_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'My Account';
    const avatarInitial = displayName.charAt(0).toUpperCase() || 'U';

    return (
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
            {/* Left side: Role & Real-time network indicator */}
            <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
                    <span className="text-[13px]">{roleBadge.icon}</span>
                    <span>{roleBadge.label}</span>
                </span>
                
                {/* Live Socket.IO Network Status Pill */}
                <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50/80 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Network</span>
                </div>
            </div>

            {/* Right side: Quick Action CTA, Notifications, Profile */}
            <div className="flex items-center gap-2.5 sm:gap-4">
                {/* Quick Action Button depending on role */}
                {user?.role === 'student' && (
                    <button
                        onClick={() => setPage('find-jobs')}
                        className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-xs"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Browse Gigs
                    </button>
                )}

                {user?.role === 'publisher' && (
                    <button
                        onClick={() => setPage('create-job')}
                        className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post Part-Time Job
                    </button>
                )}

                {/* Notifications Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-slate-100/80 transition-all"
                        aria-label="Notifications"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 text-white text-[9px] font-extrabold items-center justify-center ring-2 ring-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            </span>
                        )}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-40 overflow-hidden animate-fade-in">
                            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                <div>
                                    <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">Notifications</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p>
                                </div>
                                <button
                                    onClick={() => { setIsDropdownOpen(false); setPage('notifications'); }}
                                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                                >
                                    View All
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                {safeNotifications.length > 0 ? (
                                    safeNotifications.slice(0, 5).map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleItemClick(notif)}
                                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors ${
                                                !notif.is_read ? 'bg-emerald-50/40' : ''
                                            }`}
                                        >
                                            <NotificationIcon type={notif.type} role={user?.role} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                                                    {timeSince(notif.created_at)}
                                                </span>
                                            </div>
                                            {!notif.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-1"></span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-xs text-slate-400">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-slate-200"></div>

                {/* Profile Pill Button */}
                <button
                    onClick={() => setPage('profile')}
                    className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl hover:bg-slate-100/80 transition-all group border border-transparent hover:border-slate-200"
                >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden ring-1 ring-emerald-500/20">
                        {user?.profile_image_url ? (
                            <img
                                src={`http://uniwiz-backend.test/api/${user.profile_image_url}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            avatarInitial
                        )}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                            {displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                            Manage Profile →
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}

export default TopNavbar;
