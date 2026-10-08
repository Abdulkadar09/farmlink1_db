import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ProduceListing,
  Negotiation,
  NegotiationRound,
  Order,
  SavedAlert,
  AppNotification,
  CropMaster,
  AuditLog
} from '../types';
import {
  INITIAL_CROPS,
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_NEGOTIATIONS,
  INITIAL_ORDERS,
  INITIAL_ALERTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

interface ConfirmationModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface MapModalConfig {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  coordinates: { lat: number; lng: number };
  address: string;
}

interface FarmLinkContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  activeView: string;
  setActiveView: (view: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  selectedNegotiationId: string | null;
  setSelectedNegotiationId: (id: string | null) => void;
  
  // Data
  users: User[];
  crops: CropMaster[];
  listings: ProduceListing[];
  negotiations: Negotiation[];
  orders: Order[];
  alerts: SavedAlert[];
  savedAlerts: SavedAlert[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];

  // Auth
  login: (emailOrPhone: string, password?: string, forceRole?: UserRole) => boolean;
  register: (user: Partial<User>) => void;
  verifyOtp: (otp: string) => boolean;
  logout: () => void;
  switchDemoUser: (role: UserRole) => void;
  updateProfile: (updated: Partial<User>) => void;

  // Listings
  addListing: (listing: Omit<ProduceListing, 'id' | 'farmerId' | 'farmerName' | 'farmerRating' | 'farmerPhone' | 'postedDate' | 'status'>) => void;
  updateListing: (id: string, listing: Partial<ProduceListing>) => void;
  markListingExpired: (id: string) => void;
  deleteListing: (id: string) => void;

  // Negotiation Engine
  createOffer: (listingId: string, offeredPrice: number, quantity: number, message?: string) => string;
  acceptOffer: (negotiationId: string) => void;
  rejectOffer: (negotiationId: string) => void;
  counterOffer: (negotiationId: string, newPrice: number, quantity?: number, message?: string) => void;

  // Orders & Disputes
  markOrderPickedUp: (orderId: string) => void;
  completeOrder: (orderId: string) => void;
  reportOrderDispute: (orderId: string, reason: string) => void;
  fileDispute: (orderId: string, reason: string) => void;
  adminResolveDispute: (orderId: string, resolution: string) => void;
  resolveDispute: (orderId: string, resolution: string) => void;
  dismissDispute: (orderId: string) => void;
  adminCancelOrder: (orderId: string) => void;

  // Alerts
  addAlert: (cropName: string, maxRadiusKm: number, maxTargetPrice?: number) => void;
  deleteAlert: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  navigateToNotification: (notif: AppNotification) => void;

  // Admin
  toggleUserBan: (userId: string) => void;
  suspendUser: (userId: string) => void;
  toggleVerifyUser: (userId: string) => void;
  removeListingAdmin: (listingId: string) => void;
  flagListing: (listingId: string, reason?: string) => void;
  addMasterCrop: (crop: Omit<CropMaster, 'id' | 'lastUpdated'>) => void;
  addNewCrop: (crop: Omit<CropMaster, 'id' | 'lastUpdated'>) => void;
  editMasterCropPrice: (cropId: string, newPrice: number) => void;
  updateCropMandiPrice: (cropId: string, newPrice: number) => void;
  deleteMasterCrop: (cropId: string) => void;
  refreshMandiPrices: () => void;
  addAuditLog: (action: string, target: string) => void;

  // Modals
  confirmationModal: ConfirmationModalConfig;
  openConfirmation: (config: Omit<ConfirmationModalConfig, 'isOpen'>) => void;
  closeConfirmation: () => void;
  mapModal: MapModalConfig;
  openMapModal: (config: Omit<MapModalConfig, 'isOpen'>) => void;
  closeMapModal: () => void;
}

const FarmLinkContext = createContext<FarmLinkContextType | undefined>(undefined);

export const FarmLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage or fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('farmlink_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [crops, setCrops] = useState<CropMaster[]>(() => {
    const saved = localStorage.getItem('farmlink_crops');
    return saved ? JSON.parse(saved) : INITIAL_CROPS;
  });

  const [listings, setListings] = useState<ProduceListing[]>(() => {
    const saved = localStorage.getItem('farmlink_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [negotiations, setNegotiations] = useState<Negotiation[]>(() => {
    const saved = localStorage.getItem('farmlink_negotiations');
    return saved ? JSON.parse(saved) : INITIAL_NEGOTIATIONS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('farmlink_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [alerts, setAlerts] = useState<SavedAlert[]>(() => {
    const saved = localStorage.getItem('farmlink_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('farmlink_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('farmlink_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Current session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('farmlink_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default to Ramesh Patel (Farmer) for instant experience
  });

  const [activeView, setActiveView] = useState<string>('dashboard'); // 'landing' | 'login' | 'register' | 'verify-otp' | 'forgot-password' | 'dashboard' | 'listing-detail'
  const [activeTab, setActiveTab] = useState<string>('my-listings'); // Farmer: add-listing, my-listings, notifications, profile; Buyer: search, negotiations, orders, alerts, notifications, profile; Admin: overview, users, listings, orders-disputes, reports, settings
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedNegotiationId, setSelectedNegotiationId] = useState<string | null>(null);

  // Modals state
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    isDestructive: false,
    onConfirm: () => {}
  });

  const [mapModal, setMapModal] = useState<MapModalConfig>({
    isOpen: false,
    title: 'Farm Location',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    address: 'Khed Taluka, Pune, MH'
  });

  // Hydrate from Express Backend API on mount
  useEffect(() => {
    const fetchServerState = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const serverData = await res.json();
          if (serverData.users) setUsers(serverData.users);
          if (serverData.crops) setCrops(serverData.crops);
          if (serverData.listings) setListings(serverData.listings);
          if (serverData.negotiations) setNegotiations(serverData.negotiations);
          if (serverData.orders) setOrders(serverData.orders);
          if (serverData.alerts) setAlerts(serverData.alerts);
          if (serverData.notifications) setNotifications(serverData.notifications);
          if (serverData.auditLogs) setAuditLogs(serverData.auditLogs);
        }
      } catch (err) {
        console.error('Failed to sync initial state from backend API:', err);
      }
    };
    fetchServerState();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('farmlink_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('farmlink_crops', JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem('farmlink_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('farmlink_negotiations', JSON.stringify(negotiations));
  }, [negotiations]);

  useEffect(() => {
    localStorage.setItem('farmlink_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('farmlink_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('farmlink_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('farmlink_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('farmlink_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('farmlink_current_user');
    }
  }, [currentUser]);

  const currentRole = currentUser ? currentUser.role : null;

  // Handlers
  const openConfirmation = (config: Omit<ConfirmationModalConfig, 'isOpen'>) => {
    setConfirmationModal({ ...config, isOpen: true });
  };

  const closeConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const openMapModal = (config: Omit<MapModalConfig, 'isOpen'>) => {
    setMapModal({ ...config, isOpen: true });
  };

  const closeMapModal = () => {
    setMapModal(prev => ({ ...prev, isOpen: false }));
  };

  const addAuditLog = (action: string, target: string) => {
    const adminEmail = currentUser?.email || 'admin@farmlink.org';
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminAction: action,
      target,
      timestamp: new Date().toLocaleString(),
      adminEmail
    };
    setAuditLogs(prev => [newLog, ...prev]);

    fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, target, adminEmail })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.auditLogs) setAuditLogs(data.auditLogs);
      })
      .catch(console.error);
  };

  const login = (emailOrPhone: string, _password?: string, forceRole?: UserRole): boolean => {
    const found = users.find(u => 
      (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone.includes(emailOrPhone)) &&
      (!forceRole || u.role === forceRole)
    );

    if (found) {
      if (!found.isActive) {
        alert('This account has been suspended by marketplace administration.');
        return false;
      }
      setCurrentUser(found);
      setActiveView('dashboard');
      if (found.role === 'farmer') setActiveTab('my-listings');
      else if (found.role === 'buyer') setActiveTab('search');
      else setActiveTab('overview');

      // Verify session with backend
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, forceRole })
      }).catch(console.error);

      return true;
    }
    return false;
  };

  const switchDemoUser = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');
      if (role === 'farmer') setActiveTab('my-listings');
      else if (role === 'buyer') setActiveTab('search');
      else setActiveTab('overview');
    }
  };

  const register = (data: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name || 'New Member',
      phone: data.phone || '+91 99000 11000',
      email: data.email || 'user@farmlink.org',
      role: data.role || 'farmer',
      isVerified: true,
      isActive: true,
      registeredDate: new Date().toISOString().split('T')[0],
      farmAddress: data.farmAddress || (data.role === 'farmer' ? 'Green Agro Farm, Taluka North' : undefined),
      businessType: data.businessType || (data.role === 'buyer' ? 'Restaurant' : undefined),
      rating: 5.0,
      ratingCount: 1,
      memberSince: 'Just now'
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setActiveView('dashboard');
    setActiveTab(newUser.role === 'farmer' ? 'add-listing' : 'search');

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.users) setUsers(resData.users);
      })
      .catch(console.error);
  };

  const verifyOtp = (otp: string): boolean => {
    // Accepts 6 digit OTP
    if (otp.length === 6) {
      if (currentUser) {
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isVerified: true } : u));
        setCurrentUser(prev => prev ? { ...prev, isVerified: true } : null);
      }

      fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, userId: currentUser?.id })
      }).catch(console.error);

      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const refreshed = { ...currentUser, ...updated };
    setCurrentUser(refreshed);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? refreshed : u));

    fetch(`/api/users/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.users) setUsers(resData.users);
      })
      .catch(console.error);
  };

  // Listings
  const addListing = (data: Omit<ProduceListing, 'id' | 'farmerId' | 'farmerName' | 'farmerRating' | 'farmerPhone' | 'postedDate' | 'status'>) => {
    if (!currentUser) return;
    const newListing: ProduceListing = {
      id: `list-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerRating: currentUser.rating || 4.9,
      farmerPhone: currentUser.phone,
      cropName: data.cropName,
      quantity: data.quantity,
      unit: data.unit,
      askingPrice: data.askingPrice,
      harvestDate: data.harvestDate,
      postedDate: 'Posted just now',
      distanceKm: data.distanceKm || 5.0,
      farmAddress: data.farmAddress || currentUser.farmAddress || 'Farmer Location',
      coordinates: data.coordinates || { lat: 18.8472, lng: 73.8964 },
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      status: 'Active',
      availableForDelivery: data.availableForDelivery,
      notes: data.notes
    };

    setListings(prev => [newListing, ...prev]);
    
    // Check if any buyer alerts match this crop!
    const matchingAlerts = alerts.filter(a => a.cropName.toLowerCase() === newListing.cropName.toLowerCase());
    matchingAlerts.forEach(alertItem => {
      const notif: AppNotification = {
        id: `notif-${Date.now()}-${Math.random()}`,
        userId: alertItem.buyerId,
        title: 'Alert Match Found!',
        message: `A new listing for ${newListing.cropName} at ₹${newListing.askingPrice}/${newListing.unit} matches your saved alert!`,
        type: 'alert_match',
        linkTab: 'search',
        linkId: newListing.id,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    });

    setActiveTab('my-listings');

    fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newListing)
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.listings) setListings(resData.listings);
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  const updateListing = (id: string, updatedData: Partial<ProduceListing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updatedData } : l));

    fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.listings) setListings(resData.listings);
      })
      .catch(console.error);
  };

  const markListingExpired = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'Expired' } : l));

    fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Expired' })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.listings) setListings(resData.listings);
      })
      .catch(console.error);
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));

    fetch(`/api/listings/${id}`, {
      method: 'DELETE'
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.listings) setListings(resData.listings);
      })
      .catch(console.error);
  };

  // Negotiation Engine
  const createOffer = (listingId: string, offeredPrice: number, quantity: number, message?: string): string => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing || !currentUser) return '';

    const negId = `neg-${Date.now()}`;
    const round1: NegotiationRound = {
      roundNumber: 1,
      senderRole: 'buyer',
      senderId: currentUser.id,
      senderName: currentUser.name,
      offeredPrice,
      quantity,
      totalAmount: Math.round(offeredPrice * quantity),
      timestamp: 'Just now',
      message: message || `Offering ₹${offeredPrice}/${listing.unit} for ${quantity} ${listing.unit}.`
    };

    const newNeg: Negotiation = {
      id: negId,
      listingId: listing.id,
      cropName: listing.cropName,
      cropPhoto: listing.photoUrl,
      unit: listing.unit,
      askingPrice: listing.askingPrice,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      farmAddress: listing.farmAddress,
      coordinates: listing.coordinates,
      currentRound: 1,
      status: 'active',
      turn: 'farmer', // waiting for farmer response
      rounds: [round1],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNegotiations(prev => [newNeg, ...prev]);

    // Send notification to farmer
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: listing.farmerId,
      title: 'New Offer Received!',
      message: `${currentUser.name} made an initial offer of ₹${offeredPrice}/${listing.unit} for ${quantity} ${listing.unit} on ${listing.cropName}.`,
      type: 'offer_received',
      linkTab: 'my-listings',
      linkId: listing.id,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    fetch('/api/negotiations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ negotiation: newNeg, notification: notif })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.negotiations) setNegotiations(resData.negotiations);
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);

    return negId;
  };

  const acceptOffer = (negotiationId: string) => {
    const neg = negotiations.find(n => n.id === negotiationId);
    if (!neg) return;

    const latestRound = neg.rounds[neg.rounds.length - 1];
    const finalPrice = latestRound.offeredPrice;
    const finalQty = latestRound.quantity;

    // Update negotiation
    setNegotiations(prev => prev.map(n => n.id === negotiationId ? {
      ...n,
      status: 'accepted',
      finalPrice,
      finalQuantity: finalQty,
      updatedAt: new Date().toISOString()
    } : n));

    // Create Order automatically!
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      negotiationId: neg.id,
      listingId: neg.listingId,
      cropName: neg.cropName,
      cropPhoto: neg.cropPhoto,
      buyerId: neg.buyerId,
      buyerName: neg.buyerName,
      buyerPhone: neg.buyerPhone,
      farmerId: neg.farmerId,
      farmerName: neg.farmerName,
      farmerPhone: neg.farmerPhone,
      quantity: finalQty,
      unit: neg.unit,
      finalPricePerUnit: finalPrice,
      agreedPrice: finalPrice,
      totalAmount: Math.round(finalPrice * finalQty),
      pickupLocation: neg.farmAddress,
      coordinates: neg.coordinates,
      status: 'Pending Pickup',
      paymentMode: 'Cash on Pickup',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Notify other party
    const targetUserId = currentUser?.id === neg.farmerId ? neg.buyerId : neg.farmerId;
    const actorRoleName = currentUser?.id === neg.farmerId ? 'Farmer' : 'Buyer';
    const recipientIsFarmer = targetUserId === neg.farmerId;
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: 'Offer Accepted! Order Created',
      message: `${actorRoleName} accepted the offer of ₹${finalPrice}/${neg.unit} for ${neg.cropName}. Order #${orderId} has been generated for Cash on Pickup.`,
      type: 'offer_accepted',
      linkTab: recipientIsFarmer ? 'my-listings' : 'orders',
      linkId: recipientIsFarmer ? neg.listingId : orderId,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    fetch(`/api/negotiations/${negotiationId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actorUserId: currentUser?.id, orderId })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.negotiations) setNegotiations(resData.negotiations);
        if (resData?.orders) setOrders(resData.orders);
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  const rejectOffer = (negotiationId: string) => {
    const neg = negotiations.find(n => n.id === negotiationId);
    if (!neg) return;

    setNegotiations(prev => prev.map(n => n.id === negotiationId ? {
      ...n,
      status: 'rejected',
      updatedAt: new Date().toISOString()
    } : n));

    const targetUserId = currentUser?.id === neg.farmerId ? neg.buyerId : neg.farmerId;
    const recipientIsFarmer = targetUserId === neg.farmerId;
    const senderName = currentUser?.name || 'User';
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: 'Offer Rejected',
      message: `${senderName} declined the offer on ${neg.cropName}. Negotiation closed.`,
      type: 'offer_rejected',
      linkTab: recipientIsFarmer ? 'my-listings' : 'negotiations',
      linkId: recipientIsFarmer ? neg.listingId : negotiationId,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    fetch(`/api/negotiations/${negotiationId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actorUserId: currentUser?.id, actorName: senderName })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.negotiations) setNegotiations(resData.negotiations);
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  const counterOffer = (negotiationId: string, newPrice: number, quantity?: number, message?: string) => {
    const neg = negotiations.find(n => n.id === negotiationId);
    if (!neg || !currentUser) return;

    if (neg.currentRound >= 4) {
      return;
    }

    const nextRoundNumber = neg.currentRound + 1;
    const currentQty = quantity || neg.rounds[neg.rounds.length - 1].quantity;
    const senderRole = currentUser.id === neg.farmerId ? 'farmer' : 'buyer';
    const nextTurn = senderRole === 'farmer' ? 'buyer' : 'farmer';

    const newRound: NegotiationRound = {
      roundNumber: nextRoundNumber,
      senderRole,
      senderId: currentUser.id,
      senderName: currentUser.name,
      offeredPrice: newPrice,
      quantity: currentQty,
      totalAmount: Math.round(newPrice * currentQty),
      timestamp: 'Just now',
      message: message || `Counter offer: ₹${newPrice}/${neg.unit} for ${currentQty} ${neg.unit}.`
    };

    setNegotiations(prev => prev.map(n => n.id === negotiationId ? {
      ...n,
      currentRound: nextRoundNumber,
      turn: nextTurn,
      rounds: [...n.rounds, newRound],
      updatedAt: new Date().toISOString()
    } : n));

    const targetUserId = senderRole === 'farmer' ? neg.buyerId : neg.farmerId;
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: `Counter Offer (Round ${nextRoundNumber})`,
      message: `${currentUser.name} sent a counter offer of ₹${newPrice}/${neg.unit} on ${neg.cropName}.`,
      type: 'counter_offer',
      linkTab: senderRole === 'farmer' ? 'negotiations' : 'my-listings',
      linkId: senderRole === 'farmer' ? negotiationId : neg.listingId,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    fetch(`/api/negotiations/${negotiationId}/counter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newPrice,
        quantity: currentQty,
        message,
        senderId: currentUser.id,
        senderName: currentUser.name
      })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.negotiations) setNegotiations(resData.negotiations);
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  // Orders & Disputes
  const markOrderPickedUp = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'Completed',
      completedAt: new Date().toISOString()
    } : o));

    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Notify farmer
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: order.farmerId,
        title: 'Produce Picked Up & Paid',
        message: `Buyer ${order.buyerName} marked Order #${order.id} as Picked Up via Cash on Pickup. Trade completed!`,
        type: 'order_update',
        linkTab: 'my-listings',
        linkId: order.listingId || order.id,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
    }

    fetch(`/api/orders/${orderId}/pickup`, {
      method: 'POST'
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.orders) setOrders(resData.orders);
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  const reportOrderDispute = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'Disputed',
      disputeReason: reason,
      disputeNote: reason
    } : o));

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin-1',
      title: 'Dispute Reported on Order',
      message: `Buyer reported issue on Order #${orderId}: "${reason}"`,
      type: 'dispute_alert',
      linkTab: 'orders-disputes',
      linkId: orderId,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    fetch(`/api/orders/${orderId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, actorEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.orders) setOrders(resData.orders);
        if (resData?.notifications) setNotifications(resData.notifications);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const adminResolveDispute = (orderId: string, resolution: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'Completed',
      disputeResolution: resolution
    } : o));

    fetch(`/api/admin/orders/${orderId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution, adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.orders) setOrders(resData.orders);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const dismissDispute = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'Pending Pickup',
      disputeResolution: 'Report dismissed by Marketplace Admin'
    } : o));
    addAuditLog('Dispute Report Dismissed', `Order #${orderId} dispute dismissed and restored to Pending Pickup`);

    fetch(`/api/admin/orders/${orderId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution: 'Dismissed by Admin', adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.orders) setOrders(resData.orders);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const adminCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o,
      status: 'Cancelled'
    } : o));

    fetch(`/api/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.orders) setOrders(resData.orders);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  // Alerts
  const addAlert = (cropName: string, maxRadiusKm: number, maxTargetPrice?: number) => {
    if (!currentUser) return;
    const matchCount = listings.filter(l => 
      l.cropName.toLowerCase().includes(cropName.toLowerCase()) && 
      l.distanceKm <= maxRadiusKm &&
      l.status === 'Active'
    ).length;

    const newAlert: SavedAlert = {
      id: `alert-${Date.now()}`,
      buyerId: currentUser.id,
      cropName,
      maxRadiusKm,
      radiusKm: maxRadiusKm,
      maxTargetPrice,
      createdAt: new Date().toISOString().split('T')[0],
      matchCount
    };
    setAlerts(prev => [newAlert, ...prev]);

    fetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAlert)
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.alerts) setAlerts(resData.alerts);
      })
      .catch(console.error);
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));

    fetch(`/api/alerts/${id}`, {
      method: 'DELETE'
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.alerts) setAlerts(resData.alerts);
      })
      .catch(console.error);
  };

  // Notifications & Deep-Link Navigation
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));

    fetch('/api/notifications/read-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.notifications) setNotifications(resData.notifications);
      })
      .catch(console.error);
  };

  const navigateToNotification = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    setActiveView('dashboard');

    const role = currentUser?.role || 'farmer';

    if (role === 'farmer') {
      if (notif.linkId) {
        if (notif.linkId.startsWith('list-')) {
          setSelectedListingId(notif.linkId);
        } else if (notif.linkId.startsWith('neg-')) {
          const matchedNeg = negotiations.find(n => n.id === notif.linkId);
          if (matchedNeg) {
            setSelectedListingId(matchedNeg.listingId);
            setSelectedNegotiationId(matchedNeg.id);
          }
        } else if (notif.linkId.startsWith('ORD-')) {
          const matchedOrder = orders.find(o => o.id === notif.linkId);
          if (matchedOrder?.listingId) {
            setSelectedListingId(matchedOrder.listingId);
          }
        }
      }
      // Farmer dashboard valid tabs: 'add-listing' | 'my-listings' | 'notifications' | 'profile'
      const targetTab =
        notif.linkTab === 'add-listing' || notif.linkTab === 'profile'
          ? notif.linkTab
          : 'my-listings';
      setActiveTab(targetTab);
      return;
    }

    if (role === 'buyer') {
      if (
        notif.type === 'alert_match' ||
        notif.linkTab === 'search' ||
        notif.linkTab === 'search-discover'
      ) {
        if (notif.linkId && notif.linkId.startsWith('list-')) {
          setSelectedListingId(notif.linkId);
        }
        setActiveTab('search');
        return;
      }

      if (
        notif.type === 'offer_accepted' ||
        notif.type === 'order_update' ||
        notif.linkTab === 'orders' ||
        notif.linkId?.startsWith('ORD-')
      ) {
        setActiveTab('orders');
        return;
      }

      if (notif.linkId) {
        if (notif.linkId.startsWith('neg-')) {
          setSelectedNegotiationId(notif.linkId);
        } else if (notif.linkId.startsWith('list-')) {
          const matchedNeg = negotiations.find(
            n => n.listingId === notif.linkId && n.buyerId === currentUser?.id
          );
          if (matchedNeg) {
            setSelectedNegotiationId(matchedNeg.id);
          } else {
            setSelectedListingId(notif.linkId);
            setActiveTab('search');
            return;
          }
        }
      }
      setActiveTab('negotiations');
      return;
    }

    // Admin
    if (notif.linkTab === 'orders-disputes' || notif.linkTab === 'disputes' || notif.type === 'dispute_alert') {
      setActiveTab('orders-disputes');
    } else if (notif.linkTab) {
      setActiveTab(notif.linkTab);
    } else {
      setActiveTab('overview');
    }
  };

  // Admin features
  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = !u.isActive;
        return { ...u, isActive: nextStatus };
      }
      return u;
    }));

    fetch(`/api/admin/users/${userId}/toggle-ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.users) setUsers(resData.users);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const toggleVerifyUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    const nextVerified = !targetUser.isVerified;

    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, isVerified: nextVerified } : u)));
    addAuditLog(
      nextVerified ? 'User Identity Verified' : 'User Verification Revoked',
      `${targetUser.name} (${targetUser.role})`
    );

    fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified: nextVerified })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.users) setUsers(resData.users);
      })
      .catch(console.error);
  };

  const removeListingAdmin = (listingId: string) => {
    setListings(prev => prev.filter(l => l.id !== listingId));

    fetch(`/api/admin/listings/${listingId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.listings) setListings(resData.listings);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const flagListing = (listingId: string, reason?: string) => {
    const target = listings.find(l => l.id === listingId);
    setListings(prev => prev.map(l => (l.id === listingId ? { ...l, status: 'Flagged' } : l)));
    addAuditLog(
      'Listing Flagged / Removed',
      `Listing #${listingId} (${target?.cropName || 'Produce'}): ${reason || 'Policy violation'}`
    );

    fetch(`/api/listings/${listingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Expired', notes: `[FLAGGED BY ADMIN: ${reason || 'Policy violation'}]` })
    }).catch(console.error);
  };

  const addMasterCrop = (cropData: Omit<CropMaster, 'id' | 'lastUpdated'>) => {
    const newCrop: CropMaster = {
      ...cropData,
      id: `crop-${Date.now()}`,
      lastUpdated: 'Just now'
    };
    setCrops(prev => [...prev, newCrop]);

    fetch('/api/admin/crops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: newCrop, adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.crops) setCrops(resData.crops);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const editMasterCropPrice = (cropId: string, newPrice: number) => {
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) {
        return {
          ...c,
          mandiPrice: newPrice,
          mandiPriceRange: { min: Math.round(newPrice * 0.9), max: Math.round(newPrice * 1.1) },
          lastUpdated: 'Just now'
        };
      }
      return c;
    }));

    fetch(`/api/admin/crops/${cropId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPrice, adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.crops) setCrops(resData.crops);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const deleteMasterCrop = (cropId: string) => {
    setCrops(prev => prev.filter(c => c.id !== cropId));

    fetch(`/api/admin/crops/${cropId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail: currentUser?.email })
    })
      .then(r => (r.ok ? r.json() : null))
      .then(resData => {
        if (resData?.crops) setCrops(resData.crops);
        if (resData?.auditLogs) setAuditLogs(resData.auditLogs);
      })
      .catch(console.error);
  };

  const refreshMandiPrices = () => {
    setCrops(prev =>
      prev.map(c => ({
        ...c,
        lastUpdated: 'Synced just now'
      }))
    );
    addAuditLog('APMC Mandi Index Synced', `Synchronized ${crops.length} commodity benchmark prices`);
  };

  // Normalized data collections so all components have every expected field
  const normalizedOrders = orders.map(o => ({
    ...o,
    agreedPrice: o.agreedPrice ?? o.finalPricePerUnit,
    disputeNote: o.disputeNote ?? o.disputeReason
  }));

  const normalizedAlerts = alerts.map(a => ({
    ...a,
    radiusKm: a.radiusKm ?? a.maxRadiusKm
  }));

  const normalizedAuditLogs = auditLogs.map(log => ({
    ...log,
    userId: log.userId || 'user-admin-1',
    userName: log.userName || log.adminEmail || 'Marketplace Admin',
    userRole: log.userRole || (log.adminEmail?.includes('system') ? 'system' : 'admin'),
    action: log.action || log.adminAction || 'System Event',
    details: log.details || log.target || ''
  }));

  return (
    <FarmLinkContext.Provider
      value={{
        currentUser,
        currentRole,
        activeView,
        setActiveView,
        activeTab,
        setActiveTab,
        selectedListingId,
        setSelectedListingId,
        selectedNegotiationId,
        setSelectedNegotiationId,
        users,
        crops,
        listings,
        negotiations,
        orders: normalizedOrders,
        alerts: normalizedAlerts,
        savedAlerts: normalizedAlerts,
        notifications,
        auditLogs: normalizedAuditLogs,
        login,
        register,
        verifyOtp,
        logout,
        switchDemoUser,
        updateProfile,
        addListing,
        updateListing,
        markListingExpired,
        deleteListing,
        createOffer,
        acceptOffer,
        rejectOffer,
        counterOffer,
        markOrderPickedUp,
        completeOrder: markOrderPickedUp,
        reportOrderDispute,
        fileDispute: reportOrderDispute,
        adminResolveDispute,
        resolveDispute: adminResolveDispute,
        dismissDispute,
        adminCancelOrder,
        addAlert,
        deleteAlert,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        navigateToNotification,
        toggleUserBan,
        suspendUser: toggleUserBan,
        toggleVerifyUser,
        removeListingAdmin,
        flagListing,
        addMasterCrop,
        addNewCrop: addMasterCrop,
        editMasterCropPrice,
        updateCropMandiPrice: editMasterCropPrice,
        deleteMasterCrop,
        refreshMandiPrices,
        addAuditLog,
        confirmationModal,
        openConfirmation,
        closeConfirmation,
        mapModal,
        openMapModal,
        closeMapModal
      }}
    >
      {children}
    </FarmLinkContext.Provider>
  );
};

export const useFarmLink = () => {
  const context = useContext(FarmLinkContext);
  if (!context) {
    throw new Error('useFarmLink must be used within a FarmLinkProvider');
  }
  return context;
};
