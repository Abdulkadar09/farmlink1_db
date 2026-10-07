import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { Sprout, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setActiveView } = useFarmLink();

  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resetOtp, setResetOtp] = useState('889900');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }
    setError('');
    setOtpSent(true);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please enter your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setSuccess(true);
    setTimeout(() => {
      setActiveView('login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <button
          id="btn-back-to-login-from-forgot"
          onClick={() => setActiveView('login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Log In
        </button>

        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Recover access to your FarmLink agricultural account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-stone-200 rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">Password Reset Successful!</h3>
              <p className="text-xs text-stone-600 mb-4">
                Your new password has been configured. Redirecting to Log In...
              </p>
              <button
                onClick={() => setActiveView('login')}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-xl"
              >
                Log In Now
              </button>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-medium text-stone-700 mb-1">
                  Registered Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@farmlink.org"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
                />
              </div>

              <button
                id="btn-send-reset-otp"
                type="submit"
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Send Reset OTP</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                Password reset code sent to <strong>{email}</strong> (Demo code: <strong>889900</strong>)
              </div>

              <div>
                <label htmlFor="input-reset-otp" className="block text-xs font-medium text-stone-700 mb-1">
                  Reset OTP Code
                </label>
                <input
                  id="input-reset-otp"
                  type="text"
                  required
                  value={resetOtp}
                  onChange={e => setResetOtp(e.target.value)}
                  placeholder="889900"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden font-mono tracking-widest text-center"
                />
              </div>

              <div>
                <label htmlFor="input-new-password" className="block text-xs font-medium text-stone-700 mb-1">
                  New Password
                </label>
                <input
                  id="input-new-password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
                />
              </div>

              <div>
                <label htmlFor="input-confirm-new-password" className="block text-xs font-medium text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="input-confirm-new-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
                />
              </div>

              <button
                id="btn-reset-password-submit"
                type="submit"
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Reset Password
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
