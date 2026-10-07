import React, { useState } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import {
  User,
  ShoppingBag,
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  Lock,
  LogOut,
  Edit,
  Save,
  CheckCircle2,
  X
} from 'lucide-react';

export const BuyerProfile: React.FC = () => {
  const { currentUser, updateProfile, logout } = useFarmLink();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [businessType, setBusinessType] = useState<string>(
    currentUser?.businessType || 'Wholesale Vendor / Aggregator'
  );

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      email,
      businessType
    });
    setIsEditing(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPwd || !confirmNewPwd) {
      setPwdFeedback('Please enter new password.');
      return;
    }
    if (newPwd !== confirmNewPwd) {
      setPwdFeedback('New passwords do not match.');
      return;
    }
    if (newPwd.length < 6) {
      setPwdFeedback('Password must be at least 6 characters.');
      return;
    }

    setPwdFeedback('Password updated successfully!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPwdFeedback('');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmNewPwd('');
    }, 1500);
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Profile Header Hero */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 mb-6 relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-emerald-800 text-white font-serif text-3xl font-bold flex items-center justify-center shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-stone-900">{currentUser.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {currentUser.businessType || 'Produce Wholesale Buyer'} • Member since {currentUser.memberSince || '2024'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                id="btn-edit-buyer-profile"
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Buyer profile updated successfully.
          </div>
        )}
      </div>

      {/* Profile Form per specification: Name, Phone, Email, Business type */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 mb-6">
        <h2 className="text-base font-bold text-stone-900 mb-6">
          Buyer Account Details
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Name */}
            <div>
              <label htmlFor="buyer-profile-name" className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name / Contact Person
              </label>
              {isEditing ? (
                <input
                  id="buyer-profile-name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden"
                />
              ) : (
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium text-stone-800">
                  {currentUser.name}
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="buyer-profile-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number (For Gate Pickup Coordination)
              </label>
              {isEditing ? (
                <input
                  id="buyer-profile-phone"
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden"
                />
              ) : (
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium text-stone-800 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="buyer-profile-email" className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  id="buyer-profile-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden"
                />
              ) : (
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium text-stone-800 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser.email}</span>
                </div>
              )}
            </div>

            {/* Business type dropdown per specification: Household / Vendor / Restaurant */}
            <div>
              <label htmlFor="buyer-profile-business-type" className="block text-xs font-semibold text-stone-700 mb-1">
                Business Type
              </label>
              {isEditing ? (
                <select
                  id="buyer-profile-business-type"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="Household">Household (Direct Family Consumer)</option>
                  <option value="Vendor">Vendor (Market Stall / Vegetable Vendor / Trader)</option>
                  <option value="Restaurant">Restaurant (Commercial Kitchen / Eatery / Hotel)</option>
                </select>
              ) : (
                <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm font-medium text-stone-800 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser.businessType || 'Vendor (Wholesale)'}</span>
                </div>
              )}
            </div>

          </div>

          {/* Button: "Save Changes" per specification */}
          {isEditing && (
            <div className="pt-2 flex justify-end">
              <button
                id="btn-save-buyer-profile"
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Security & Action Buttons per spec: "Change Password" & "Log Out" */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Security & Sign Out</h3>
          <p className="text-xs text-stone-500">Manage account access or exit this session.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-buyer-change-password"
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-stone-600" />
            <span>Change Password</span>
          </button>

          <button
            id="btn-buyer-profile-logout"
            type="button"
            onClick={logout}
            className="px-4 py-2 bg-white hover:bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">Change Buyer Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {pwdFeedback && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${
                  pwdFeedback.includes('successfully') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                }`}>
                  {pwdFeedback}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPwd}
                  onChange={e => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPwd}
                  onChange={e => setConfirmNewPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
