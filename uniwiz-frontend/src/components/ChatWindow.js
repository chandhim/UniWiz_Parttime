// FILE: src/components/ChatWindow.js (SOCKET.IO REAL-TIME CHAT)
// =============================================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initSocket, getSocket } from '../utils/socket';

const API_BASE_URL = 'http://uniwiz-backend.test/api';

// Report User Modal
const ReportModal = ({ isOpen, onClose, onSubmit, targetUser }) => {
    const [reason, setReason] = useState('');
    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert("Please provide a reason for your report.");
            return;
        }
        onSubmit(reason);
        setReason('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Report {targetUser.company_name || `${targetUser.first_name || ''} ${targetUser.last_name || ''}`}</h2>
                <p className="text-xs text-slate-500 mb-4">Please describe the issue. This will be sent to an administrator for review.</p>
                <textarea
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all"
                    rows="4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Inappropriate language, spam, payment dispute..."
                ></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm">Submit Report</button>
                </div>
            </div>
        </div>
    );
};

// Report App Problem Modal
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
                <p className="text-xs text-slate-500 mb-4">Describe the issue or bug you encountered. This will be sent directly to the development team.</p>
                <textarea
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all"
                    rows="4"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Message sending delay, UI glitch..."
                ></textarea>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Submit</button>
                </div>
            </div>
        </div>
    );
};

// Main ChatWindow Component
function ChatWindow({ conversation, currentUser, onNewMessageSent }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const [typingUserName, setTypingUserName] = useState('');
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [isAppProblemModalOpen, setAppProblemModalOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const socketRef = useRef(null);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // 1. Initial Fetch of Past Messages
    const fetchMessages = useCallback(async () => {
        if (!conversation?.conversation_id || String(conversation.conversation_id).startsWith('temp_')) {
            setIsLoading(false);
            setMessages([]);
            return;
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/get_messages.php?conversation_id=${conversation.conversation_id}&user_id=${currentUser.id}`
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to fetch messages.');
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('[ChatWindow] fetchMessages error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [conversation.conversation_id, currentUser.id]);

    // 2. Real-Time Socket.IO Lifecycle
    useEffect(() => {
        fetchMessages();

        // Connect Socket
        const socket = initSocket(currentUser.id);
        socketRef.current = socket;

        setIsConnected(socket.connected);

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        // Join Conversation Room
        if (conversation?.conversation_id) {
            socket.emit('join_conversation', conversation.conversation_id);
            socket.emit('mark_as_read', {
                conversation_id: conversation.conversation_id,
                user_id: currentUser.id
            });
        }

        // Listener: Incoming Message in Real-Time
        const handleReceiveMessage = (msg) => {
            console.log('[ChatWindow] Real-time message received:', msg);
            const currentConvId = conversation?.conversation_id;

            if (
                msg.conversation_id === currentConvId ||
                (currentConvId && String(currentConvId).startsWith('temp_'))
            ) {
                setMessages((prev) => {
                    // Check if duplicate
                    if (prev.some((m) => m.id === msg.id)) return prev;

                    // Replace optimistic message if present
                    const withoutOptimistic = prev.filter(
                        (m) =>
                            !(
                                String(m.id).startsWith('temp-') &&
                                m.message_text === msg.message_text &&
                                m.sender_id === msg.sender_id
                            )
                    );
                    return [...withoutOptimistic, msg];
                });

                // Clear typing indicator since message arrived
                setIsOtherUserTyping(false);

                // Auto-read
                socket.emit('mark_as_read', {
                    conversation_id: currentConvId,
                    user_id: currentUser.id
                });
            }
        };

        // Listener: Typing Indicator
        const handleUserTyping = (data) => {
            if (data.user_id !== currentUser.id && (data.conversation_id === conversation?.conversation_id || String(conversation?.conversation_id).startsWith('temp_'))) {
                setIsOtherUserTyping(true);
                setTypingUserName(data.user_name || 'Other user');
            }
        };

        const handleUserStopTyping = (data) => {
            if (data.user_id !== currentUser.id) {
                setIsOtherUserTyping(false);
            }
        };

        // Listener: Messages Read
        const handleMessagesRead = (data) => {
            if (data.conversation_id === conversation?.conversation_id && data.read_by !== currentUser.id) {
                setMessages((prev) =>
                    prev.map((m) => (m.sender_id === currentUser.id ? { ...m, is_read: true } : m))
                );
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('user_typing', handleUserTyping);
        socket.on('user_stop_typing', handleUserStopTyping);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            if (conversation?.conversation_id) {
                socket.emit('leave_conversation', conversation.conversation_id);
            }
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('receive_message', handleReceiveMessage);
            socket.off('user_typing', handleUserTyping);
            socket.off('user_stop_typing', handleUserStopTyping);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [conversation.conversation_id, currentUser.id, fetchMessages]);

    // Initial Job Context Prefill
    useEffect(() => {
        const jobTitleContext =
            conversation.job_title_context ||
            (String(conversation.conversation_id).startsWith('temp_') ? conversation.job_title : null);
        if (jobTitleContext) {
            setNewMessage(`Regarding your job post: "${jobTitleContext}"\n`);
        }
    }, [conversation]);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOtherUserTyping]);

    // Handle Input Typing Event with Debounce
    const handleInputChange = (e) => {
        const val = e.target.value;
        setNewMessage(val);

        const socket = socketRef.current || getSocket();
        if (socket && conversation?.conversation_id) {
            socket.emit('typing', {
                conversation_id: conversation.conversation_id,
                user_id: currentUser.id,
                user_name: currentUser.first_name || currentUser.company_name || 'Someone'
            });

            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('stop_typing', {
                    conversation_id: conversation.conversation_id,
                    user_id: currentUser.id
                });
            }, 1500);
        }
    };

    // Send Message Handler
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        const text = newMessage.trim();
        if (!text) return;

        // Clear typing timeout immediately
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        const socket = socketRef.current || getSocket();
        if (socket && conversation?.conversation_id) {
            socket.emit('stop_typing', {
                conversation_id: conversation.conversation_id,
                user_id: currentUser.id
            });
        }

        // 1. Optimistic message update for instant UI feedback
        const tempId = 'temp-' + Date.now();
        const optimisticMessage = {
            id: tempId,
            conversation_id: conversation.conversation_id,
            sender_id: currentUser.id,
            receiver_id: conversation.other_user_id,
            message_text: text,
            is_read: false,
            created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        const payload = {
            conversation_id: conversation.conversation_id,
            sender_id: currentUser.id,
            receiver_id: conversation.other_user_id,
            job_id: conversation.job_id,
            message_text: text
        };

        let messageSentViaSocket = false;

        // 2. Try sending via Socket.IO
        if (socket && socket.connected) {
            try {
                socket.emit('send_message', payload, (response) => {
                    if (response && response.success) {
                        messageSentViaSocket = true;
                        if (onNewMessageSent) onNewMessageSent();
                    }
                });
                return;
            } catch (sockErr) {
                console.warn('[ChatWindow] Socket emit error, falling back to REST API:', sockErr);
            }
        }

        // 3. Fallback to REST API if Socket is unavailable
        if (!messageSentViaSocket) {
            try {
                const res = await fetch(`${API_BASE_URL}/send_message.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.message);

                if (onNewMessageSent) {
                    onNewMessageSent();
                } else {
                    fetchMessages();
                }
            } catch (err) {
                console.error('[ChatWindow] REST API fallback send error:', err);
                // Remove optimistic message if both socket and REST failed
                setMessages((prev) => prev.filter((m) => m.id !== tempId));
            }
        }
    };

    const handleReportSubmit = async (reason) => {
        try {
            const response = await fetch(`${API_BASE_URL}/report_user.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reporter_id: currentUser.id,
                    reported_user_id: conversation.other_user_id,
                    conversation_id: conversation.conversation_id,
                    reason: reason
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            alert(result.message);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleAppProblemSubmit = async (reason) => {
        try {
            const response = await fetch(`${API_BASE_URL}/report_user.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reporter_id: currentUser.id,
                    reason: reason,
                    type: 'app_problem'
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            alert(result.message);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const targetDisplayName =
        conversation.company_name ||
        `${conversation.first_name || ''} ${conversation.last_name || ''}`.trim() ||
        'Chat';

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
                onSubmit={handleReportSubmit}
                targetUser={conversation}
            />
            <AppProblemModal
                isOpen={isAppProblemModalOpen}
                onClose={() => setAppProblemModalOpen(false)}
                onSubmit={handleAppProblemSubmit}
            />

            {/* Conversation Header */}
            <div className="p-4 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden">
                            {conversation.profile_image_url ? (
                                <img
                                    src={`${API_BASE_URL}/${conversation.profile_image_url}`}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                targetDisplayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        {/* Real-time Online Indicator */}
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isConnected ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                                {targetDisplayName}
                            </h3>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isConnected ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                {isConnected ? 'Live Socket.IO' : 'Connecting...'}
                            </span>
                        </div>
                        {conversation.job_title && (
                            <p className="text-xs text-indigo-600 font-medium">
                                Job: {conversation.job_title}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setReportModalOpen(true)}
                        title="Report this user"
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-slate-50/70 space-y-3">
                {isLoading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-xs text-slate-400 font-medium flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-indigo-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading conversation history...
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800">Start the conversation</h4>
                        <p className="text-xs text-slate-500 max-w-xs mt-1">
                            Say hello, discuss interview availability, or ask about job details in real-time!
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                            >
                                <div
                                    className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2.5 shadow-xs ${
                                        isMe
                                            ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white rounded-2xl rounded-br-sm'
                                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-2xl rounded-bl-sm'
                                    }`}
                                >
                                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                        {msg.message_text}
                                    </p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className={`text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                        {isMe && (
                                            <span className={`text-[10px] ${msg.is_read ? 'text-amber-300 font-bold' : 'text-emerald-100'}`} title={msg.is_read ? 'Read' : 'Delivered'}>
                                                {msg.is_read ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* Real-time Typing Bubble */}
                <AnimatePresence>
                    {isOtherUserTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl rounded-bl-sm shadow-xs flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium italic">
                                    {typingUserName} is typing...
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input & Send Form */}
            <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <textarea
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type a message (Press Enter to send)..."
                        className="flex-grow px-4 py-2.5 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 resize-none h-11 transition-all"
                        rows="1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                        <svg className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWindow;
