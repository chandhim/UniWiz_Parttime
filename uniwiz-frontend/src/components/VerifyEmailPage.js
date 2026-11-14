import React, { useEffect } from 'react';

function VerifyEmailPage({ setPage }) {
  useEffect(() => {
    // Email verification is no longer required - automatically redirect to login
    const timer = setTimeout(() => {
      setPage('login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [setPage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <img src="/logo.png" alt="UniWiz" className="h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Account Ready</h1>
        <p className="text-gray-600 mb-6">
          Email verification is not required. You can start using UniWiz immediately. Redirecting you to login...
        </p>
        <button
          onClick={() => setPage('login')}
          className="bg-primary-main text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
