/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FarmLinkProvider, useFarmLink } from './context/FarmLinkContext';
import { Header } from './components/common/Header';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { MapModal } from './components/common/MapModal';
import { LandingPage } from './components/auth/LandingPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { OtpVerifyPage } from './components/auth/OtpVerifyPage';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { activeView, setActiveView, currentUser } = useFarmLink();
  const [registerRole, setRegisterRole] = useState<UserRole>('farmer');
  const [pendingContact, setPendingContact] = useState<{
    email: string;
    phone: string;
    role: UserRole;
    name: string;
  }>({
    name: 'Ramesh Patel',
    email: 'farmer@farmlink.org',
    phone: '+91 98765 43210',
    role: 'farmer'
  });

  const handleSelectRole = (role: UserRole) => {
    setRegisterRole(role);
    setActiveView('register');
  };

  const handleProceedToOtp = (info: { email: string; phone: string; role: UserRole; name: string }) => {
    setPendingContact(info);
    setActiveView('otp-verify');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      {/* Universal Header with role switcher, profile badge, notifications, and navigation */}
      <Header />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage onSelectRole={handleSelectRole} />}
        {activeView === 'register' && (
          <RegisterPage initialRole={registerRole} onProceedToOtp={handleProceedToOtp} />
        )}
        {activeView === 'otp-verify' && <OtpVerifyPage contactInfo={pendingContact} />}
        {activeView === 'login' && <LoginPage />}
        {activeView === 'forgot-password' && <ForgotPasswordPage />}
        
        {/* Dashboard views: either specific view or general 'dashboard' matching current user role */}
        {(activeView === 'farmer-dashboard' || (activeView === 'dashboard' && currentUser?.role === 'farmer')) && (
          <FarmerDashboard />
        )}
        {(activeView === 'buyer-dashboard' || (activeView === 'dashboard' && currentUser?.role === 'buyer')) && (
          <BuyerDashboard />
        )}
        {(activeView === 'admin-dashboard' || (activeView === 'dashboard' && currentUser?.role === 'admin')) && (
          <AdminDashboard />
        )}

        {/* Fallback if on dashboard without logged in user */}
        {activeView === 'dashboard' && !currentUser && (
          <LandingPage onSelectRole={handleSelectRole} />
        )}
      </main>

      {/* Global Modals */}
      <ConfirmationModal />
      <MapModal />
    </div>
  );
};

export default function App() {
  return (
    <FarmLinkProvider>
      <AppContent />
    </FarmLinkProvider>
  );
}

