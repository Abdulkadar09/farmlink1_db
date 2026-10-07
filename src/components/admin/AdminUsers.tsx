import React, { useState, useMemo } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import { User } from '../../types';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Ban,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, toggleVerifyUser, suspendUser, openConfirmation } = useFarmLink();

  const [filterRole, setFilterRole] = useState<'All' | 'Farmers' | 'Buyers' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      // Role and pending filters
      if (filterRole === 'Farmers' && u.role !== 'farmer') return false;
      if (filterRole === 'Buyers' && u.role !== 'buyer') return false;
      if (filterRole === 'Pending' && u.isVerified) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesPhone = u.phone.includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail) return false;
      }

      return true;
    });
  }, [users, filterRole, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          User Management & Verification
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Supervise registered agricultural producers and wholesale buyers. Review verification credentials and enforce platform compliance.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50"
          />
        </div>

        {/* Filter per specification: All / Farmers / Buyers / Pending Verification */}
        <div className="flex rounded-xl bg-stone-100 p-1 w-full sm:w-auto overflow-x-auto">
          {(['All', 'Farmers', 'Buyers', 'Pending'] as const).map(role => (
            <button
              key={role}
              id={`filter-users-${role.toLowerCase()}`}
              type="button"
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                filterRole === role ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {role === 'Pending' ? 'Pending Verification' : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table per specification: Name, Role (Farmer/Buyer), Phone, Verification Status (Verified/Pending), Actions */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Phone</th>
                <th className="py-3.5 px-6">Verification Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    No users matching selected filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-stone-50/70 transition-colors">
                    
                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-stone-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-[11px] text-stone-400 font-normal">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        user.role === 'farmer'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.role === 'buyer'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 font-mono">
                      {user.phone}
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-6">
                      {user.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px]">
                          <ShieldAlert className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                    </td>

                    {/* Actions per specification:
                        - Button per user: "Verify" (manual verify toggle)
                        - Button per user: "Suspend"
                        - Button per user: "View Profile"
                    */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Verify button */}
                        <button
                          id={`btn-verify-user-${user.id}`}
                          type="button"
                          onClick={() => toggleVerifyUser(user.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            user.isVerified
                              ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-300'
                              : 'bg-emerald-800 text-white hover:bg-emerald-900 border-emerald-800 shadow-2xs'
                          }`}
                        >
                          {user.isVerified ? 'Unverify' : 'Verify'}
                        </button>

                        {/* View Profile button */}
                        <button
                          id={`btn-view-user-${user.id}`}
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                          title="View User Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Suspend button */}
                        <button
                          id={`btn-suspend-user-${user.id}`}
                          type="button"
                          onClick={() =>
                            openConfirmation({
                              title: `Suspend ${user.name}?`,
                              message: `Are you sure you want to suspend this ${user.role}? This will immediately disable their login session and freeze all active listings/offers.`,
                              confirmLabel: 'Suspend Account',
                              isDestructive: true,
                              onConfirm: () => suspendUser(user.id)
                            })
                          }
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Suspend User"
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Profile Modal per specification */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">User Dossier: {selectedUser.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold flex items-center justify-center text-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-base">{selectedUser.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-200 text-stone-800">
                      {selectedUser.role}
                    </span>
                    <span className={`text-[11px] font-semibold ${selectedUser.isVerified ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedUser.isVerified ? '✓ Identity Verified' : '⚠ Verification Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-semibold text-stone-900 font-mono">{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span className="font-semibold text-stone-900">{selectedUser.email}</span>
                </div>
                {selectedUser.farmAddress && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Farm Gate:</span>
                    <span className="font-semibold text-stone-900 text-right max-w-xs">{selectedUser.farmAddress}</span>
                  </div>
                )}
                {selectedUser.businessType && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Business Model:</span>
                    <span className="font-semibold text-stone-900">{selectedUser.businessType}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-stone-200">
                  <span className="text-stone-500">Member Since:</span>
                  <span className="text-stone-700">{selectedUser.memberSince || '2024'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleVerifyUser(selectedUser.id);
                    setSelectedUser({ ...selectedUser, isVerified: !selectedUser.isVerified });
                  }}
                  className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {selectedUser.isVerified ? 'Revoke Verification' : 'Approve & Verify User'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
