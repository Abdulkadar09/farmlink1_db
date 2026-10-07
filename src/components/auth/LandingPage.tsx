import React from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { Sprout, TrendingUp, Handshake, ShieldCheck, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onSelectRole?: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const { setActiveView, switchDemoUser } = useFarmLink();

  const handleRoleClick = (role: UserRole) => {
    if (onSelectRole) {
      onSelectRole(role);
    } else {
      setActiveView('register');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Brand Bar */}
      <header className="px-6 py-5 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                Farm<span className="text-emerald-700">Link</span>
              </span>
              <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                Negotiation Marketplace
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="link-header-login"
              onClick={() => setActiveView('login')}
              className="text-sm font-semibold text-stone-700 hover:text-emerald-800 px-4 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              id="btn-header-admin"
              onClick={() => {
                switchDemoUser('admin');
              }}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl w-full text-center">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Zero Commission • Direct Farm Gate Trade
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-tight mb-4">
            Connect Directly.<br />
            <span className="text-emerald-700">Negotiate Fairly.</span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
            A transparent agricultural marketplace powered by real APMC Mandi price benchmarks. No middlemen, no forced retail markups—just transparent offer rounds between farmers and buyers.
          </p>

          {/* Primary Action Buttons per UI specification */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
            <button
              id="btn-landing-farmer"
              onClick={() => handleRoleClick('farmer')}
              className="w-full sm:w-1/2 py-4 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-base rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🌾 I'm a Farmer</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-landing-buyer"
              onClick={() => handleRoleClick('buyer')}
              className="w-full sm:w-1/2 py-4 px-6 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-base rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🛒 I'm a Buyer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Already have an account link per spec */}
          <div className="text-sm text-stone-500 mb-12">
            Already have an account?{' '}
            <button
              id="link-landing-login"
              onClick={() => setActiveView('login')}
              className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              Log in
            </button>
          </div>

          {/* Value pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-8 border-t border-stone-200">
            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
              <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-sm mb-1">Mandi Price Index</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Live official APMC rate hints protect both farmers and buyers against below-cost exploitation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
              <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <Handshake className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-sm mb-1">4-Round Negotiation</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Structured offer, counter, and acceptance loops designed specifically for wholesale agricultural produce.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
              <div className="p-2 w-fit rounded-lg bg-emerald-50 text-emerald-700 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-stone-900 text-sm mb-1">GPS Farm Pickups</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Precise farm gate coordinate pins with Cash on Pickup terms ensuring verified, fresh batch handovers.
              </p>
            </div>
          </div>

          {/* Quick Demo Personas helper bar */}
          <div className="mt-8 p-3 bg-stone-100/80 rounded-xl border border-stone-200 text-xs text-stone-600 flex flex-wrap items-center justify-center gap-2">
            <span className="font-semibold text-stone-700">Quick Test Personas:</span>
            <button
              onClick={() => switchDemoUser('farmer')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 font-medium rounded-md border border-stone-300 transition-colors"
            >
              Demo Farmer (Ramesh)
            </button>
            <button
              onClick={() => switchDemoUser('buyer')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 font-medium rounded-md border border-stone-300 transition-colors"
            >
              Demo Buyer (Pooja)
            </button>
            <button
              onClick={() => switchDemoUser('admin')}
              className="px-2.5 py-1 bg-white hover:bg-stone-200 text-stone-800 font-medium rounded-md border border-stone-300 transition-colors"
            >
              Demo Admin (Catalog & Disputes)
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200 text-center text-xs text-stone-500 bg-white">
        <p>FarmLink © 2026 • Direct Agricultural Negotiation Marketplace • Cash on Pickup Model</p>
      </footer>
    </div>
  );
};
