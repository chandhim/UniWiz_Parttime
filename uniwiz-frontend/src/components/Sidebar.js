// FILE: src/components/Sidebar.js (BESPOKE UNIWIZ EMPLOYER EDITION)
// ====================================================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- NavLink: Reusable navigation link with icon, text, and notification dot ---
const NavLink = ({ icon, text, isActive, isExpanded, onClick, isLogout = false, hasNotification = false }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className="relative group" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: isExpanded ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center transition-all duration-200
          ${!isExpanded ? 'px-3 justify-center' : 'px-3.5 justify-between'} 
          ${isActive
            ? 'bg-teal-50/90 border-l-4 border-teal-600 text-teal-900 shadow-xs py-3 rounded-r-xl font-bold' 
            : isLogout
              ? 'text-rose-600 hover:bg-rose-50/80 py-2.5 rounded-xl font-semibold'
              : 'text-slate-600 hover:bg-slate-100/80 hover:text-teal-950 py-2.5 rounded-xl font-medium'
          }
        `}
      >
        <div className="flex items-center">
            <div className="relative">
                <motion.div animate={{ rotate: isHovering && !isActive ? 6 : 0 }} className={isActive ? 'text-teal-700' : ''}>
                    {icon}
                </motion.div>
                {/* Notification dot for collapsed sidebar */}
                {!isExpanded && hasNotification && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-white"></span>
                    </span>
                )}
            </div>
            {isExpanded && (
            <motion.span 
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3.5 text-xs tracking-tight font-semibold"
            >
                {text}
            </motion.span>
            )}
        </div>
        {/* Notification pill for expanded sidebar */}
        {isExpanded && hasNotification && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>NEW</span>
            </span>
        )}
      </motion.button>
      
      {/* Tooltip for collapsed sidebar */}
      {!isExpanded && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ 
            opacity: isHovering ? 1 : 0,
            y: isHovering ? 0 : -5
          }}
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-50 border border-slate-700"
        >
          {text}
          <div className="absolute w-2 h-2 bg-slate-900 rotate-45 -left-1 top-1/2 -translate-y-1/2"></div>
        </motion.div>
      )}
    </div>
  );
};

// --- Main Sidebar component ---
function Sidebar({ currentPage, setPage, onLogout, isLocked, toggleLock, hasUnreadMessages }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const isExpanded = isLocked || isHovered;

    // --- SVG icons for employer sidebar ---
    const dashboardIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    const jobsIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    const applicantsIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    const messagesIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
    const profileIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    const settingsIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const logoutIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
    const pinIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>;
    const unpinIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" /></svg>;

    const handleToggleLock = () => {
      if (isAnimating) return;
      setIsAnimating(true);
      toggleLock();
      setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <motion.aside 
            className={`bg-white h-full flex-shrink-0 p-3.5 flex flex-col border-r border-slate-200/90 shadow-sm transition-all duration-200 ease-out relative z-20 ${isExpanded ? 'w-60' : 'w-20'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ width: isLocked ? 240 : 80 }}
            animate={{ width: isExpanded ? 240 : 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Header: Logo and pin button */}
            <div className="flex items-center justify-between mb-6 px-1">
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={() => setPage('home')}
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-800 to-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-xs ring-2 ring-teal-500/20">
                          UW
                        </div>
                        <div>
                          <motion.h1 className="text-base font-black tracking-tight text-slate-900 leading-none">
                            Uni<span className="text-teal-700">Wiz</span>
                          </motion.h1>
                          <span className="text-[10px] font-bold text-teal-600 tracking-wider uppercase block">
                            Employer Hub
                          </span>
                        </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!isExpanded && (
                    <div className="flex justify-center w-full">
                        <div 
                          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-800 to-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-xs ring-2 ring-teal-500/20 cursor-pointer"
                          onClick={() => setPage('home')}
                        >
                          UW
                        </div>
                    </div>
                )}
                
                <motion.button 
                  onClick={handleToggleLock}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 rounded-lg hover:bg-slate-100 ${!isExpanded ? 'hidden' : ''}`}
                  title={isLocked ? "Unlock Sidebar" : "Lock Sidebar"}
                >
                    {isLocked ? unpinIcon : pinIcon}
                </motion.button>
            </div>

            {/* Navigation links */}
            <nav className="flex-grow space-y-1">
                <NavLink text="Dashboard" icon={dashboardIcon} isActive={currentPage === 'home'} isExpanded={isExpanded} onClick={() => setPage('home')} />
                <NavLink text="Manage Jobs" icon={jobsIcon} isActive={currentPage === 'manage-jobs'} isExpanded={isExpanded} onClick={() => setPage('manage-jobs')} />
                <NavLink text="Applicants" icon={applicantsIcon} isActive={currentPage === 'applicants'} isExpanded={isExpanded} onClick={() => setPage('applicants')} />
                <NavLink text="Live Messages" icon={messagesIcon} isActive={currentPage === 'messages'} isExpanded={isExpanded} onClick={() => setPage('messages')} hasNotification={hasUnreadMessages} />
                <NavLink text="Company Profile" icon={profileIcon} isActive={currentPage === 'profile'} isExpanded={isExpanded} onClick={() => setPage('profile')} />
                <NavLink text="Account Settings" icon={settingsIcon} isActive={currentPage === 'settings'} isExpanded={isExpanded} onClick={() => setPage('settings')} />
            </nav>

            {/* Footer with logout */}
            <div className="mt-auto">
                <div className="border-t border-slate-200/80 my-2.5"></div>
                <NavLink text="Log Out" icon={logoutIcon} isExpanded={isExpanded} onClick={onLogout} isLogout={true} />
            </div>
            
            {/* Teal accent bar for collapsed sidebar */}
            {!isExpanded && !isLocked && (
              <motion.div 
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-14 bg-teal-400 rounded-l-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            )}
        </motion.aside>
    );
}

export default Sidebar;
