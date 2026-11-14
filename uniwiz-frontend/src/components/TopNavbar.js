// FILE: src/components/TopNavbar.js (MODERN REDESIGN)
// =================================================================================
import React, { useState, useEffect, useRef } from 'react';

// --- NotificationIcon: Shows notification icon with color based on type and user role ---
const NotificationIcon = ({ type, role }) => {
    const roleColors = {
        student: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        publisher: 'text-purple-600 bg-purple-50 border-purple-100',
        admin: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        default: 'text-slate-600 bg-slate-50 border-slate-100'
    };

    const iconMap = {
        new_applicant: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        application_accepted: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        application_rejected: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        new_review: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        default: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        )
    };

    return (
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${roleColors[role] || roleColors.default}`}>
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
        student: { label: 'Student', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100', dot: 'bg-indigo-500' },
        publisher: { label: 'Employer', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', dot: 'bg-purple-500' },
        admin: { label: 'Administrator', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' }
    }[user?.role] || { label: 'User', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', dot: 'bg-slate-500' };

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
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Left side: Role & Status indicator */}
            <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${roleBadge.dot}`}></span>
                    {roleBadge.label} Portal
                </span>
                <span className="hidden md:inline-block text-xs font-medium text-slate-400">
                    Sri Lankan Campus Network
                </span>
            </div>

            {/* Right side: Notifications & User profile */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notifications Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                        aria-label="Notifications"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 text-white text-[9px] font-bold items-center justify-center ring-2 ring-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            </span>
                        )}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-40 overflow-hidden animate-fade-in">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                                    <p className="text-xs text-slate-500">{unreadCount} unread update{unreadCount === 1 ? '' : 's'}</p>
                                </div>
                                <button
                                    onClick={() => { setIsDropdownOpen(false); setPage('notifications'); }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
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
                                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                                                !notif.is_read ? 'bg-indigo-50/30' : ''
                                            }`}
                                        >
                                            <NotificationIcon type={notif.type} role={user?.role} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-slate-800 leading-snug line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                                                    {timeSince(notif.created_at)}
                                                </span>
                                            </div>
                                            {!notif.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1"></span>
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
                    className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-xl hover:bg-slate-100 transition-all group"
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
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
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {displayName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                            View Profile
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}

export default TopNavbar;
