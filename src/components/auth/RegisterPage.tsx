import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { UserRole } from '../../types';
import { Sprout, ArrowLeft, ShieldCheck } from 'lucide-react';

interface RegisterPageProps {
  initialRole?: UserRole;
  onProceedToOtp?: (contactInfo: { email: string; phone: string; role: UserRole; name: string }) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ initialRole = 'farmer', onProceedToOtp }) => {
  const { setActiveView, register } = useFarmLink();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password) {
      setError('Please fill out all registration fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter carefully.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    if (onProceedToOtp) {
      onProceedToOtp({
        name: fullName,
        phone,
        email,
        role
      });
    } else {
      register({
        name: fullName,
        phone,
        email,
        role
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          id="btn-back-landing-from-register"
          onClick={() => setActiveView('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Create Your FarmLink Account
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          Direct wholesale negotiation with zero middleman fee
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-stone-200 rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role selection toggle per spec */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="role-select-farmer"
                  onClick={() => setRole('farmer')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    role === 'farmer'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  🌾 Farmer (Seller)
                </button>
                <button
                  type="button"
                  id="role-select-buyer"
                  onClick={() => setRole('buyer')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    role === 'buyer'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  🛒 Buyer (Purchaser)
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-medium text-stone-700 mb-1">
                Full Name
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-medium text-stone-700 mb-1">
                Phone Number (for Mandi SMS & OTP)
              </label>
              <input
                id="reg-phone"
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98234 56789"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@farmlink.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-medium text-stone-700 mb-1">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm-password" className="block text-xs font-medium text-stone-700 mb-1">
                Confirm Password
              </label>
              <input
                id="reg-confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Send OTP Button per spec */}
            <div className="pt-2">
              <button
                id="btn-send-otp"
                type="submit"
                className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Send OTP</span>
              </button>
            </div>
          </form>

          {/* Already registered? Log in link */}
          <div className="mt-6 text-center text-xs text-stone-600">
            Already registered?{' '}
            <button
              id="link-register-to-login"
              type="button"
              onClick={() => setActiveView('login')}
              className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Log in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
