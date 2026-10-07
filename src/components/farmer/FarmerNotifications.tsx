import React from 'react';
import { useFarmLink } from '../../context/FarmLinkContext';
import {
  Bell,
  CheckCheck,
  ArrowRight,
  Handshake,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

export const FarmerNotifications: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    setSelectedListingId
  } = useFarmLink();

  const userNotifs = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const handleNotificationAction = (notif: (typeof userNotifs)[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.linkId) {
      setSelectedListingId(notif.linkId);
    }
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
    } else {
      setActiveTab('my-listings');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'offer_received':
        return <Handshake className="w-5 h-5 text-amber-600" />;
      case 'offer_accepted':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'offer_rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'listing_expiring':
        return <Clock className="w-5 h-5 text-stone-500" />;
      case 'alert_match':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-stone-600">
            Real-time trade alerts, buyer offer updates, and listing expiry reminders.
          </p>
        </div>

        {/* Button: "Mark All as Read" */}
        {userNotifs.length > 0 && (
          <button
            id="btn-mark-all-read"
            type="button"
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-700" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {userNotifs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 shadow-xs">
          <div className="w-12 h-12 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">All Caught Up!</h3>
          <p className="text-xs text-stone-500">
            You don't have any notifications at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userNotifs.map(notif => (
            <div
              key={notif.id}
              id={`farmer-notification-${notif.id}`}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !notif.read
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  !notif.read ? 'bg-white shadow-xs' : 'bg-stone-100'
                }`}>
                  {getIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-stone-900 leading-tight">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[11px] font-mono text-stone-400 mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {/* Each notification: "View" button per specification */}
              <div className="self-end sm:self-center shrink-0">
                <button
                  id={`btn-view-notification-${notif.id}`}
                  type="button"
                  onClick={() => handleNotificationAction(notif)}
                  className="px-4 py-2 bg-stone-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
