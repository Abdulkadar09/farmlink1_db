import React, { useState, useEffect } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { UserRole } from '../../types';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

interface OtpVerifyPageProps {
  contactInfo?: {
    email: string;
    phone: string;
    role: UserRole;
    name: string;
  };
}

export const OtpVerifyPage: React.FC<OtpVerifyPageProps> = ({ contactInfo }) => {
  const { register, setActiveView } = useFarmLink();

  const safeContact = contactInfo || {
    name: 'New Member',
    email: 'newuser@farmlink.org',
    phone: '+91 98765 43210',
    role: 'farmer' as UserRole
  };

  const [otp, setOtp] = useState('123456'); // Pre-fill sample OTP for convenience
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');

  // 30 second timer for Resend OTP button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    // Register user successfully into state
    register({
      name: safeContact.name,
      email: safeContact.email,
      phone: safeContact.phone,
      role: safeContact.role
    });
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(30);
    setError('');
    alert(`A fresh 6-digit OTP code has been re-sent to ${safeContact.phone} and ${safeContact.email}. (Hint: Demo OTP is 123456)`);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Back Link to Register */}
        <button
          id="btn-back-to-register"
          onClick={() => setActiveView('register')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Change email/phone
        </button>

        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Verify Phone & Email
        </h2>

        {/* Display: "OTP sent to [email/phone]" per spec */}
        <p className="mt-2 text-center text-sm text-stone-600 px-4">
          OTP sent to <span className="font-semibold text-stone-900">{safeContact.phone || safeContact.email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-stone-200 rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div className="mb-6 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <span>Demo Verification Passcode:</span>
            <span className="font-mono font-bold tracking-widest text-sm bg-white px-2 py-0.5 rounded border border-emerald-300">
              123456
            </span>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            
            {/* 6-digit OTP field */}
            <div>
              <label htmlFor="input-otp-field" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit OTP
              </label>
              <input
                id="input-otp-field"
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.6em] text-2xl font-mono py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden font-bold text-stone-900"
              />
            </div>

            {/* Button: "Verify OTP" */}
            <button
              id="btn-verify-otp"
              type="submit"
              className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Verify OTP</span>
            </button>

            {/* Button: "Resend OTP" (disabled with countdown timer) */}
            <button
              id="btn-resend-otp"
              type="button"
              disabled={countdown > 0}
              onClick={handleResend}
              className={`w-full py-2.5 px-4 text-xs font-medium rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                countdown > 0
                  ? 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${countdown > 0 ? '' : 'text-emerald-700'}`} />
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>

            {/* Link: "Change email/phone" */}
            <div className="pt-2 text-center">
              <button
                id="link-change-contact"
                type="button"
                onClick={() => setActiveView('register')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                ← Change email or phone number
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
