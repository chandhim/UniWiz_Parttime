// FILE: src/components/MessagesPage.js (MODERN SOCKET.IO INTEGRATION)
// =============================================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ChatWindow from './ChatWindow';
import { initSocket } from '../utils/socket';
import { API_BASE_URL } from '../config';


// App Problem Modal for Messages Page
const AppProblemModal = ({ isOpen, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    if (!isOpen) return null;
    const handleSubmit = () => {
        if (!reason.trim()) {
            alert("Please describe the app problem.");
            return;
        }
        onSubmit(reason);
        setReason('');
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Report App Problem</h2>
                <p className="text-xs text-slate-500 mb-4">Describe the issue or bug you encountered. This will be sent directly to the dev team.</p>
                <textarea
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:outline-none transition-all"
                    rows="4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., App crashed when sending a message, UI not loading..."
                ></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs">Submit</button>
                </div>
            </div>
        </div>
    );
};

// Reusable Conversation Item Component
const ConversationItem = ({ conversation, onSelect, isActive }) => {
    const displayName = conversation.company_name || `${conversation.first_name || ''} ${conversation.last_name || ''}`.trim() || 'Conversation';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <button 
            onClick={() => onSelect(conversation)}
            className={`w-full text-left p-3.5 flex items-center gap-3 transition-all duration-200 border-b border-slate-100 relative ${
                isActive 
                    ? 'bg-emerald-50/80 border-l-4 border-l-emerald-600' 
                    : 'hover:bg-slate-50'
            }`}
        >
            <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-xs overflow-hidden ring-1 ring-emerald-500/20">
                    {conversation.profile_image_url ? (
                        <img 
                            src={`${API_BASE_URL}/${conversation.profile_image_url}`}
                            alt="profile"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        initial
                    )}
                </div>
                {conversation.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 ring-2 ring-white"></span>
                    </span>
                )}
            </div>

            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`font-bold text-xs sm:text-sm truncate ${isActive ? 'text-emerald-950 font-extrabold' : 'text-slate-800'}`}>
                        {displayName}
                    </p>
                    {conversation.last_message_time && (
                        <span className="text-[10px] text-slate-400 font-medium flex-shrink-0 ml-2">
                            {new Date(conversation.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-xs truncate ${conversation.unread_count > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {conversation.last_message || 'Start a conversation...'}
                    </p>
                    {conversation.unread_count > 0 && (
                        <span className="ml-2 bg-emerald-600 text-white text-[10px] font-extrabold rounded-full h-4 min-w-[16px] px-1.5 flex items-center justify-center">
                            {conversation.unread_count}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

// Main Messages Page Component
function MessagesPage({ user, setPage, conversationContext, setConversationContext }) {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAppProblemModalOpen, setAppProblemModalOpen] = useState(false);

    const handleAppProblemSubmit = async (reason) => {
        try {
            const response = await fetch(`${API_BASE_URL}/report_user.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reporter_id: user.id,
                    reason: reason,
                    type: 'app_problem',
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            alert(result.message);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const fetchConversations = useCallback(async () => {
        if (!user) return;
        try {
            const response = await fetch(`${API_BASE_URL}/get_conversations.php?user_id=${user.id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch conversations.');
            setConversations(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Initial Fetch & Socket.IO Listener for real-time inbox updates
    useEffect(() => {
        fetchConversations();

        const socket = initSocket(user.id);

        const handleRealTimeNotification = () => {
            console.log('[MessagesPage] Real-time message arrived, refreshing inbox list...');
            fetchConversations();
        };

        socket.on('new_message_notification', handleRealTimeNotification);
        socket.on('receive_message', handleRealTimeNotification);

        return () => {
            socket.off('new_message_notification', handleRealTimeNotification);
            socket.off('receive_message', handleRealTimeNotification);
        };
    }, [fetchConversations, user.id]);

    // Handle Initiating Conversation from another page
    useEffect(() => {
        if (conversationContext && !isLoading) {
            const existingConvo = conversations.find(c => 
                c.other_user_id === conversationContext.targetUserId
            );

            if (existingConvo) {
                setSelectedConversation({
                    ...existingConvo,
                    job_title_context: conversationContext.jobTitle,
                    job_id: conversationContext.jobId
                });
            } else {
                const newPlaceholderConvo = {
                    conversation_id: `temp_${conversationContext.targetUserId}`,
                    job_id: conversationContext.jobId,
                    job_title: conversationContext.jobTitle,
                    other_user_id: conversationContext.targetUserId,
                    first_name: conversationContext.targetUserFirstName,
                    last_name: conversationContext.targetUserLastName,
                    company_name: conversationContext.targetUserCompanyName,
                    profile_image_url: null,
                    last_message: null,
                    last_message_time: new Date().toISOString(),
                    unread_count: 0
                };
                setConversations(prev => [newPlaceholderConvo, ...prev.filter(c => !String(c.conversation_id).startsWith('temp_'))]);
                setSelectedConversation(newPlaceholderConvo);
            }
            setConversationContext(null);
        }
    }, [conversationContext, conversations, isLoading, setConversationContext]);
    
    const filteredConversations = useMemo(() => {
        if (!searchTerm) return conversations;
        return conversations.filter(convo => {
            const name = convo.company_name || `${convo.first_name || ''} ${convo.last_name || ''}`;
            const lastMessage = convo.last_message || '';
            return name.toLowerCase().includes(searchTerm.toLowerCase()) || lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [conversations, searchTerm]);

    const handleSelectConversation = (conversation) => {
        setSelectedConversation(conversation);
        if (!String(conversation.conversation_id).startsWith('temp_')) {
            setConversations(prev => prev.map(c => 
                c.conversation_id === conversation.conversation_id ? { ...c, unread_count: 0 } : c
            ));
        }
    };

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-[#F8FAFC] text-slate-800">
            <AppProblemModal
                isOpen={isAppProblemModalOpen}
                onClose={() => setAppProblemModalOpen(false)}
                onSubmit={handleAppProblemSubmit}
            />

            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                            Direct Communication
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Messages</h1>
                    </div>
                    <button 
                        onClick={() => setAppProblemModalOpen(true)}
                        className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Report Issue
                    </button>
                </div>

                {/* Main Split Chat Layout */}
                <div className="bg-white rounded-3xl shadow-card border border-slate-200/90 h-[calc(100vh-13rem)] flex overflow-hidden">
                    {/* Left Panel: Conversation List */}
                    <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col">
                        <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search conversations..." 
                                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex-grow overflow-y-auto divide-y divide-slate-100">
                            {isLoading && conversations.length === 0 ? (
                                <p className="p-6 text-center text-xs text-slate-400 font-medium">Loading conversations...</p>
                            ) : error ? (
                                <p className="p-6 text-center text-xs text-rose-500 font-semibold">{error}</p>
                            ) : filteredConversations.length > 0 ? (
                                filteredConversations.map(convo => (
                                    <ConversationItem 
                                        key={convo.conversation_id}
                                        conversation={convo}
                                        onSelect={handleSelectConversation}
                                        isActive={selectedConversation?.conversation_id === convo.conversation_id}
                                    />
                                ))
                            ) : (
                                <div className="p-8 text-center text-xs text-slate-400">
                                    No active conversations found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Chat Window */}
                    <div className={`w-full md:w-2/3 flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                        {selectedConversation ? (
                            <ChatWindow 
                                key={selectedConversation.conversation_id}
                                conversation={selectedConversation}
                                currentUser={user}
                                onNewMessageSent={() => {
                                    fetchConversations();
                                }}
                            />
                        ) : (
                            <div className="flex-grow flex items-center justify-center bg-slate-50/50 p-8">
                                <div className="text-center max-w-sm">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-xs ring-1 ring-emerald-500/20">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-extrabold text-slate-800 mb-1">Select a Conversation</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Choose a chat on the left to start communicating in real-time with employers and candidates.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
