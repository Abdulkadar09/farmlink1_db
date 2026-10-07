import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { Sprout, ArrowLeft, LogIn, ShieldAlert, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  initialRoleTab?: 'general' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ initialRoleTab = 'general' }) => {
  const { login, setActiveView, switchDemoUser } = useFarmLink();

  const [mode, setMode] = useState<'general' | 'admin'>(initialRoleTab);
  const [emailOrPhone, setEmailOrPhone] = useState('farmer@farmlink.org');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password) {
      setError('Please enter your email/phone and password.');
      return;
    }

    const roleConstraint: UserRole | undefined = mode === 'admin' ? 'admin' : undefined;
    const success = login(emailOrPhone, password, roleConstraint);

    if (!success) {
      setError(
        mode === 'admin'
          ? 'Invalid admin credentials. Please use admin@farmlink.org'
          : 'Invalid login details. Try the quick demo accounts below or check your credentials.'
      );
    }
  };

  const handleSwitchToAdmin = () => {
    setMode('admin');
    setEmailOrPhone('admin@farmlink.org');
    setPassword('adminpassword');
    setError('');
  };

  const handleSwitchToGeneral = () => {
    setMode('general');
    setEmailOrPhone('farmer@farmlink.org');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Back Link */}
        <button
          id="btn-back-to-landing-from-login"
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
          {mode === 'admin' ? 'Marketplace Admin Login' : 'Log In to FarmLink'}
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600">
          {mode === 'admin' 
            ? 'Supervisory control panel for Mandi price indices, users, and disputes'
            : 'Access your negotiations, active harvest listings, and farm orders'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-stone-200 rounded-3xl sm:px-10">
          
          {/* Admin vs General Portal Switcher */}
          <div className="mb-6 flex rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              id="tab-login-general"
              onClick={handleSwitchToGeneral}
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'general' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Farmer / Buyer
            </button>
            <button
              type="button"
              id="tab-login-admin"
              onClick={handleSwitchToAdmin}
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'admin' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Admin Portal
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Input: Email or Phone */}
            <div>
              <label htmlFor="login-email-phone" className="block text-xs font-medium text-stone-700 mb-1">
                {mode === 'admin' ? 'Admin Email / Username' : 'Email or Phone Number'}
              </label>
              <input
                id="login-email-phone"
                type="text"
                required
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                placeholder={mode === 'admin' ? 'admin@farmlink.org' : 'farmer@farmlink.org or +91 98234 56789'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Input: Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs font-medium text-stone-700">
                  Password
                </label>
                {mode === 'general' && (
                  <button
                    id="link-forgot-password"
                    type="button"
                    onClick={() => setActiveView('forgot-password')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 focus:border-transparent outline-hidden"
              />
            </div>

            {/* Button: "Log In" */}
            <div className="pt-2">
              <button
                id="btn-login-submit"
                type="submit"
                className={`w-full py-3 px-4 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'admin' ? 'bg-stone-900 hover:bg-black' : 'bg-emerald-800 hover:bg-emerald-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            </div>
          </form>

          {/* New user? Register link */}
          {mode === 'general' && (
            <div className="mt-6 text-center text-xs text-stone-600">
              New user?{' '}
              <button
                id="link-login-to-register"
                type="button"
                onClick={() => setActiveView('register')}
                className="font-bold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
              >
                Register
              </button>
            </div>
          )}

          {/* 1-Click Fast Persona Switcher for convenient testing */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant Test Logins:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                id="quick-demo-farmer"
                onClick={() => switchDemoUser('farmer')}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-200 text-center transition-colors cursor-pointer"
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                id="quick-demo-buyer"
                onClick={() => switchDemoUser('buyer')}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg border border-emerald-200 text-center transition-colors cursor-pointer"
              >
                🛒 Buyer
              </button>
              <button
                type="button"
                id="quick-demo-admin"
                onClick={() => switchDemoUser('admin')}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold rounded-lg border border-stone-300 text-center transition-colors cursor-pointer"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
