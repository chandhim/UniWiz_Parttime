// FILE: src/components/LoginPage.js (MODERN REDESIGN)
// =========================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { validatePasswordStrength } from '../utils/passwordValidator';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { validateUniversityEmail } from '../utils/emailValidator';
import EmailValidationIndicator from './EmailValidationIndicator';

const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
};

function LoginPage({ onLoginSuccess, setPage, initialState }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [role, setRole] = useState('student');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (initialState) {
            if (initialState.signup) setIsSignUpMode(true);
            if (initialState.role) setRole(initialState.role);
        }
    }, [initialState]);

    const toggleMode = () => {
        setIsSignUpMode(prev => !prev);
        setError(null);
        setIsLoading(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setCompanyName('');
    };

    // Quick autofill demo accounts helper
    const handleAutofill = (demoRole) => {
        setError(null);
        if (isSignUpMode) setIsSignUpMode(false);

        if (demoRole === 'student') {
            setEmail('kasun.perera@std.uwu.ac.lk');
            setPassword('Password123!');
        } else if (demoRole === 'publisher') {
            setEmail('hr@techsolutions.lk');
            setPassword('Password123!');
        } else if (demoRole === 'admin') {
            setEmail('admin@uniwiz.lk');
            setPassword('Password123!');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        if (isSignUpMode && role === 'student') {
            const emailValidation = validateUniversityEmail(email);
            if (!emailValidation.valid) {
                setError(emailValidation.error);
                setIsLoading(false);
                return;
            }
        }

        if (isSignUpMode) {
            const passwordValidation = validatePasswordStrength(password);
            if (!passwordValidation.valid) {
                setError("Password does not meet security requirements.");
                setIsLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setIsLoading(false);
                return;
            }
        }

        try {
            const payload = isSignUpMode 
                ? {
                    action: 'register',
                    email,
                    password,
                    role,
                    ...(role === 'publisher' ? { company_name: companyName } : { first_name: firstName, last_name: lastName })
                }
                : {
                    action: 'login',
                    email,
                    password
                };

            const response = await fetch('http://uniwiz-backend.test/api/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Authentication failed. Please check your credentials.');
            }

            onLoginSuccess(result.user);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-radial-gradient bg-grid-slate">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[380px] bg-gradient-to-tr from-emerald-500/10 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* Back to Home Button */}
            <button
                onClick={() => setPage('home')}
                className="fixed top-5 left-5 z-40 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/90 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-all hover:scale-105"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Home
            </button>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
                {/* Brand Logo Header */}
                <div className="text-center mb-6">
                    <div
                        onClick={() => setPage('home')}
                        className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 mb-3 cursor-pointer hover:scale-105 transition-transform ring-2 ring-emerald-500/20"
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-9.422L12 14z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {isSignUpMode ? 'Join UniWiz' : 'Welcome Back'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isSignUpMode ? 'Connect with campus opportunities across Sri Lanka' : 'Sign in to access your student or employer portal'}
                    </p>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                >
                    {/* Error Box */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2"
                            >
                                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quick Demo Login Autofill Chips (Only on Sign In) */}
                    {!isSignUpMode && (
                        <div className="mb-6 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block mb-2">
                                🚀 1-Click Demo Evaluation Login:
                            </span>
                            <div className="grid grid-cols-3 gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleAutofill('student')}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-700 hover:text-white transition-all shadow-xs text-center"
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAutofill('publisher')}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-700 hover:text-white transition-all shadow-xs text-center"
                                >
                                    Employer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAutofill('admin')}
                                    className="px-2 py-1.5 rounded-lg bg-white border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-700 hover:text-white transition-all shadow-xs text-center"
                                >
                                    Admin
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Role Selector (Sign Up only) */}
                    {isSignUpMode && (
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    role === 'student'
                                        ? 'bg-white text-emerald-800 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('publisher')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    role === 'publisher'
                                        ? 'bg-white text-emerald-800 shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m8-10h1m-1 4h1m-1 4h1m-8 4v-4c0-1.49.53-2.94 1.5-4L12 9l2.5-2c.97-1.06 1.5-2.51 1.5-4V3H5v3" />
                                </svg>
                                Employer
                            </button>
                        </div>
                    )}
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    role === 'student'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('publisher')}
                                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    role === 'publisher'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m8-10h1m-1 4h1m-1 4h1m-8 4v-4c0-1.49.53-2.94 1.5-4L12 9l2.5-2c.97-1.06 1.5-2.51 1.5-4V3H5v3" />
                                </svg>
                                Employer
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name fields in Sign Up */}
                        {isSignUpMode && (
                            role === 'publisher' ? (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="e.g. Tech Solutions Lanka"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => validateName(e.target.value) && setFirstName(e.target.value)}
                                            placeholder="Kasun"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => validateName(e.target.value) && setLastName(e.target.value)}
                                            placeholder="Perera"
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                            required
                                        />
                                    </div>
                                </div>
                            )
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={isSignUpMode && role === 'student' ? 'e.g. name@std.uwu.ac.lk' : 'you@example.com'}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                required
                            />
                            {isSignUpMode && (
                                <EmailValidationIndicator
                                    email={email}
                                    className="mt-1.5"
                                    show={true}
                                    role={role}
                                />
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-bold text-slate-700">
                                    Password
                                </label>
                                {!isSignUpMode && (
                                    <button
                                        type="button"
                                        onClick={() => setPage('reset-password')}
                                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                                    >
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                                    </svg>
                                </button>
                            </div>
                            {isSignUpMode && (
                                <PasswordStrengthMeter
                                    password={password}
                                    showRequirements={true}
                                    className="mt-2"
                                />
                            )}
                        </div>

                        {/* Confirm Password (Sign Up) */}
                        {isSignUpMode && (
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your password"
                                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : isSignUpMode ? (
                                'Complete Free Registration'
                            ) : (
                                'Sign In to Workspace'
                            )}
                        </button>
                    </form>

                    {/* Mode Toggle Footer */}
                    <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
                        {isSignUpMode ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={toggleMode}
                                    className="font-bold text-emerald-700 hover:underline"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                Don&apos;t have an account?{' '}
                                <button
                                    onClick={toggleMode}
                                    className="font-bold text-emerald-700 hover:underline"
                                >
                                    Create Free Account
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default LoginPage;
