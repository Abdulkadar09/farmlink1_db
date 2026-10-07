import React, { useState, useRef, useEffect } from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import {
  Sprout,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    activeTab,
    setActiveTab,
    setActiveView,
    logout,
    notifications,
    markNotificationAsRead,
    switchDemoUser
  } = useFarmLink();

  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setShowBellDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setShowRoleSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Filter notifications for current user
  const userNotifs = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;
  const recentNotifs = userNotifs.slice(0, 5);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setActiveView('dashboard');
  };

  const handleNotificationClick = (notif: typeof userNotifs[0]) => {
    markNotificationAsRead(notif.id);
    setShowBellDropdown(false);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      setActiveView('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Negotiation Marketplace Badge */}
          <div className="flex items-center gap-3">
            <button
              id="btn-logo-home"
              onClick={() => {
                setActiveView('dashboard');
                if (currentRole === 'farmer') setActiveTab('my-listings');
                else if (currentRole === 'buyer') setActiveTab('search');
                else setActiveTab('overview');
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-800 transition-colors">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                    Farm<span className="text-emerald-700">Link</span>
                  </span>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                    Negotiation Marketplace
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-sans hidden md:block">
                  Direct Mandi Trade • Fair Price Negotiation
                </p>
              </div>
            </button>
          </div>

          {/* Role Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {currentRole === 'farmer' && (
              <>
                <button
                  id="nav-tab-add-listing"
                  onClick={() => handleTabClick('add-listing')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'add-listing'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Add Listing
                </button>
                <button
                  id="nav-tab-my-listings"
                  onClick={() => handleTabClick('my-listings')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'my-listings'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  My Listings
                </button>
                <button
                  id="nav-tab-farmer-notifications"
                  onClick={() => handleTabClick('notifications')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors relative cursor-pointer ${
                    activeTab === 'notifications'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  id="nav-tab-farmer-profile"
                  onClick={() => handleTabClick('profile')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Profile
                </button>
              </>
            )}

            {currentRole === 'buyer' && (
              <>
                <button
                  id="nav-tab-buyer-search"
                  onClick={() => handleTabClick('search')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'search'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Search & Discover
                </button>
                <button
                  id="nav-tab-buyer-negotiations"
                  onClick={() => handleTabClick('negotiations')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'negotiations'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  My Negotiations
                </button>
                <button
                  id="nav-tab-buyer-orders"
                  onClick={() => handleTabClick('orders')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  My Orders
                </button>
                <button
                  id="nav-tab-buyer-alerts"
                  onClick={() => handleTabClick('alerts')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'alerts'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Saved Alerts
                </button>
                <button
                  id="nav-tab-buyer-notifications"
                  onClick={() => handleTabClick('notifications')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors relative cursor-pointer ${
                    activeTab === 'notifications'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  id="nav-tab-buyer-profile"
                  onClick={() => handleTabClick('profile')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Profile
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  id="nav-tab-admin-overview"
                  onClick={() => handleTabClick('overview')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  id="nav-tab-admin-users"
                  onClick={() => handleTabClick('users')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Users
                </button>
                <button
                  id="nav-tab-admin-listings"
                  onClick={() => handleTabClick('listings')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'listings'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Listings
                </button>
                <button
                  id="nav-tab-admin-orders"
                  onClick={() => handleTabClick('orders-disputes')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'orders-disputes'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Orders & Disputes
                </button>
                <button
                  id="nav-tab-admin-reports"
                  onClick={() => handleTabClick('reports')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Reports
                </button>
                <button
                  id="nav-tab-admin-settings"
                  onClick={() => handleTabClick('settings')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  Settings
                </button>
              </>
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Persona Switcher (Convenient for evaluators) */}
            <div className="relative" ref={roleRef}>
              <button
                id="btn-role-switcher"
                type="button"
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-200 transition-colors"
                title="Switch persona to test Farmer, Buyer, or Admin role instantly"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="capitalize">{currentRole} View</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    id="switch-to-farmer"
                    onClick={() => {
                      switchDemoUser('farmer');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between"
                  >
                    <span>🌾 Ramesh Patel (Farmer)</span>
                    {currentRole === 'farmer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    id="switch-to-buyer"
                    onClick={() => {
                      switchDemoUser('buyer');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between"
                  >
                    <span>🛒 Pooja Sharma (Buyer)</span>
                    {currentRole === 'buyer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    id="switch-to-admin"
                    onClick={() => {
                      switchDemoUser('admin');
                      setShowRoleSwitcher(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between"
                  >
                    <span>🛡️ Marketplace Admin</span>
                    {currentRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell Dropdown (Farmer & Buyer) */}
            {currentRole !== 'admin' && (
              <div className="relative" ref={bellRef}>
                <button
                  id="btn-notification-bell"
                  onClick={() => setShowBellDropdown(!showBellDropdown)}
                  className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span 
                      id="badge-unread-count"
                      className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse"
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showBellDropdown && (
                  <div 
                    id="dropdown-notification-bell"
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in"
                  >
                    <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                      <div className="font-semibold text-sm text-stone-900">Notifications</div>
                      <span className="text-xs text-stone-500">{unreadCount} unread</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                      {recentNotifs.length === 0 ? (
                        <div className="p-4 text-center text-xs text-stone-500">
                          No notifications yet.
                        </div>
                      ) : (
                        recentNotifs.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 hover:bg-stone-50 transition-colors cursor-pointer ${
                              !notif.read ? 'bg-emerald-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-medium text-xs text-stone-900">{notif.title}</div>
                              <span className="text-[10px] text-stone-400 whitespace-nowrap flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {notif.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-stone-100 bg-stone-50 text-center">
                      <button
                        id="btn-view-all-notifications"
                        onClick={() => {
                          setShowBellDropdown(false);
                          setActiveTab('notifications');
                        }}
                        className="w-full py-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        View All Notifications <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                id="btn-profile-avatar"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 p-1.5 text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-stone-800 hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {showProfileDropdown && (
                <div 
                  id="dropdown-profile-menu"
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in"
                >
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-900">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                      <ShieldCheck className="w-3 h-3" /> {currentUser.role}
                    </span>
                  </div>

                  {currentRole !== 'admin' && (
                    <button
                      id="dropdown-item-profile"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        setActiveTab('profile');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                      My Profile
                    </button>
                  )}

                  <button
                    id="dropdown-item-logout"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Top-Right Log Out Button per specification */}
            <button
              id="btn-topright-logout"
              onClick={logout}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer hidden sm:flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1.5 border-t border-stone-100 scrollbar-none">
          {currentRole === 'farmer' && (
            <>
              <button
                id="mobile-tab-add-listing"
                onClick={() => handleTabClick('add-listing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'add-listing' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Add Listing
              </button>
              <button
                id="mobile-tab-my-listings"
                onClick={() => handleTabClick('my-listings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'my-listings' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                My Listings
              </button>
              <button
                id="mobile-tab-notifications"
                onClick={() => handleTabClick('notifications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'notifications' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Notifications ({unreadCount})
              </button>
              <button
                id="mobile-tab-profile"
                onClick={() => handleTabClick('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'profile' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Profile
              </button>
            </>
          )}

          {currentRole === 'buyer' && (
            <>
              <button
                id="mobile-tab-search"
                onClick={() => handleTabClick('search')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'search' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Discover
              </button>
              <button
                id="mobile-tab-negotiations"
                onClick={() => handleTabClick('negotiations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'negotiations' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Negotiations
              </button>
              <button
                id="mobile-tab-orders"
                onClick={() => handleTabClick('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'orders' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Orders
              </button>
              <button
                id="mobile-tab-alerts"
                onClick={() => handleTabClick('alerts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'alerts' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Alerts
              </button>
              <button
                id="mobile-tab-notifications"
                onClick={() => handleTabClick('notifications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'notifications' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Notifications ({unreadCount})
              </button>
              <button
                id="mobile-tab-profile"
                onClick={() => handleTabClick('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'profile' ? 'bg-emerald-800 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Profile
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                id="mobile-tab-admin-overview"
                onClick={() => handleTabClick('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Overview
              </button>
              <button
                id="mobile-tab-admin-users"
                onClick={() => handleTabClick('users')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'users' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Users
              </button>
              <button
                id="mobile-tab-admin-listings"
                onClick={() => handleTabClick('listings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'listings' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Listings
              </button>
              <button
                id="mobile-tab-admin-orders"
                onClick={() => handleTabClick('orders-disputes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'orders-disputes' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Disputes
              </button>
              <button
                id="mobile-tab-admin-reports"
                onClick={() => handleTabClick('reports')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'reports' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Reports
              </button>
              <button
                id="mobile-tab-admin-settings"
                onClick={() => handleTabClick('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  activeTab === 'settings' ? 'bg-stone-900 text-white' : 'text-stone-600 bg-stone-100'
                }`}
              >
                Settings
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
