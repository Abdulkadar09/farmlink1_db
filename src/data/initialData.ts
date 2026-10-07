import { CropMaster, ProduceListing, Negotiation, Order, SavedAlert, AppNotification, User, AuditLog } from '../types';

export const INITIAL_CROPS: CropMaster[] = [
  {
    id: 'crop-1',
    name: 'Tomatoes (Hybrid Red)',
    category: 'Vegetables',
    baseUnit: 'kg',
    mandiPrice: 24,
    mandiPriceRange: { min: 20, max: 28 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-2',
    name: 'Onions (Nashik Red)',
    category: 'Vegetables',
    baseUnit: 'kg',
    mandiPrice: 32,
    mandiPriceRange: { min: 28, max: 36 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-3',
    name: 'Potatoes (Jyoti)',
    category: 'Vegetables',
    baseUnit: 'kg',
    mandiPrice: 18,
    mandiPriceRange: { min: 15, max: 22 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-4',
    name: 'Basmati Rice (Pusa 1121)',
    category: 'Grains',
    baseUnit: 'kg',
    mandiPrice: 78,
    mandiPriceRange: { min: 72, max: 84 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-5',
    name: 'Wheat (Sharbati)',
    category: 'Grains',
    baseUnit: 'kg',
    mandiPrice: 34,
    mandiPriceRange: { min: 30, max: 38 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-6',
    name: 'Green Chilies (G4)',
    category: 'Vegetables',
    baseUnit: 'kg',
    mandiPrice: 55,
    mandiPriceRange: { min: 48, max: 62 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-7',
    name: 'Alphonso Mangoes',
    category: 'Fruits',
    baseUnit: 'dozen',
    mandiPrice: 650,
    mandiPriceRange: { min: 580, max: 720 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-8',
    name: 'Fresh Cauliflower',
    category: 'Vegetables',
    baseUnit: 'crate',
    mandiPrice: 280,
    mandiPriceRange: { min: 240, max: 320 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-9',
    name: 'Ginger (Fresh Green)',
    category: 'Spices',
    baseUnit: 'kg',
    mandiPrice: 90,
    mandiPriceRange: { min: 82, max: 98 },
    lastUpdated: 'Today, 06:00 AM'
  },
  {
    id: 'crop-10',
    name: 'Bell Peppers (Shimla Capsicum)',
    category: 'Vegetables',
    baseUnit: 'kg',
    mandiPrice: 42,
    mandiPriceRange: { min: 38, max: 48 },
    lastUpdated: 'Today, 06:00 AM'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-farmer-1',
    name: 'Ramesh Patel',
    phone: '+91 98234 56789',
    email: 'farmer@farmlink.org',
    password: 'password123',
    role: 'farmer',
    isVerified: true,
    isActive: true,
    registeredDate: '2024-03-15',
    farmAddress: 'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune, MH',
    farmLocation: { lat: 18.8472, lng: 73.8964, district: 'Pune District' },
    rating: 4.8,
    ratingCount: 36,
    memberSince: 'March 2024'
  },
  {
    id: 'user-farmer-2',
    name: 'Balwinder Singh',
    phone: '+91 94172 33445',
    email: 'balwinder@farmlink.org',
    password: 'password123',
    role: 'farmer',
    isVerified: true,
    isActive: true,
    registeredDate: '2024-04-10',
    farmAddress: 'Golden Fields, GT Road, Karnal, HR',
    farmLocation: { lat: 29.6857, lng: 76.9905, district: 'Karnal District' },
    rating: 4.9,
    ratingCount: 52,
    memberSince: 'April 2024'
  },
  {
    id: 'user-farmer-3',
    name: 'Devraj Gowda',
    phone: '+91 97412 88990',
    email: 'devraj@farmlink.org',
    password: 'password123',
    role: 'farmer',
    isVerified: false,
    isActive: true,
    registeredDate: '2024-08-01',
    farmAddress: 'Cauvery River Basin, Mandya, KA',
    farmLocation: { lat: 12.5242, lng: 76.8958, district: 'Mandya District' },
    rating: 4.6,
    ratingCount: 14,
    memberSince: 'August 2024'
  },
  {
    id: 'user-buyer-1',
    name: 'Pooja Sharma',
    phone: '+91 99301 22334',
    email: 'buyer@farmlink.org',
    password: 'password123',
    role: 'buyer',
    isVerified: true,
    isActive: true,
    registeredDate: '2024-05-12',
    businessType: 'Restaurant'
  },
  {
    id: 'user-buyer-2',
    name: 'Anil Gupta',
    phone: '+91 98112 77889',
    email: 'anil@vegexpress.com',
    password: 'password123',
    role: 'buyer',
    isVerified: true,
    isActive: true,
    registeredDate: '2024-06-20',
    businessType: 'Vendor'
  },
  {
    id: 'user-buyer-3',
    name: 'Sunita Rao',
    phone: '+91 98450 11223',
    email: 'sunita@household.net',
    password: 'password123',
    role: 'buyer',
    isVerified: true,
    isActive: true,
    registeredDate: '2024-07-05',
    businessType: 'Household'
  },
  {
    id: 'user-admin-1',
    name: 'Marketplace Administrator',
    phone: '+91 80000 90000',
    email: 'admin@farmlink.org',
    password: 'adminpassword',
    role: 'admin',
    isVerified: true,
    isActive: true,
    registeredDate: '2024-01-01'
  }
];

export const INITIAL_LISTINGS: ProduceListing[] = [
  {
    id: 'list-1',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerRating: 4.8,
    farmerPhone: '+91 98234 56789',
    cropName: 'Tomatoes (Hybrid Red)',
    quantity: 850,
    unit: 'kg',
    askingPrice: 26, // ₹26/kg (Mandi benchmark ₹24)
    harvestDate: '2026-09-08',
    postedDate: 'Posted 1 day ago',
    distanceKm: 6.4,
    farmAddress: 'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    availableForDelivery: true,
    notes: 'Sun-ripened, graded grade-A tomatoes, firm skin ideal for transport or storage.'
  },
  {
    id: 'list-2',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerRating: 4.8,
    farmerPhone: '+91 98234 56789',
    cropName: 'Fresh Cauliflower',
    quantity: 120,
    unit: 'crate',
    askingPrice: 290,
    harvestDate: '2026-09-07',
    postedDate: 'Posted 2 days ago',
    distanceKm: 6.4,
    farmAddress: 'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    photoUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    availableForDelivery: false,
    notes: 'Snow-white compact heads, pesticide-free harvest.'
  },
  {
    id: 'list-3',
    farmerId: 'user-farmer-2',
    farmerName: 'Balwinder Singh',
    farmerRating: 4.9,
    farmerPhone: '+91 94172 33445',
    cropName: 'Wheat (Sharbati)',
    quantity: 4500,
    unit: 'kg',
    askingPrice: 36,
    harvestDate: '2026-09-04',
    postedDate: 'Posted 5 days ago',
    distanceKm: 14.2,
    farmAddress: 'Golden Fields, GT Road, Karnal',
    coordinates: { lat: 29.6857, lng: 76.9905 },
    photoUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    availableForDelivery: true,
    notes: 'Cleaned, graded, moisture content tested under 11%.'
  },
  {
    id: 'list-4',
    farmerId: 'user-farmer-2',
    farmerName: 'Balwinder Singh',
    farmerRating: 4.9,
    farmerPhone: '+91 94172 33445',
    cropName: 'Basmati Rice (Pusa 1121)',
    quantity: 2200,
    unit: 'kg',
    askingPrice: 82,
    harvestDate: '2026-09-02',
    postedDate: 'Posted 1 week ago',
    distanceKm: 14.2,
    farmAddress: 'Golden Fields, GT Road, Karnal',
    coordinates: { lat: 29.6857, lng: 76.9905 },
    photoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    availableForDelivery: true,
    notes: 'Extra long grain, aged 1 year, premium aroma.'
  },
  {
    id: 'list-5',
    farmerId: 'user-farmer-3',
    farmerName: 'Devraj Gowda',
    farmerRating: 4.6,
    farmerPhone: '+91 97412 88990',
    cropName: 'Onions (Nashik Red)',
    quantity: 1600,
    unit: 'kg',
    askingPrice: 34,
    harvestDate: '2026-09-06',
    postedDate: 'Posted 3 days ago',
    distanceKm: 22.8,
    farmAddress: 'Cauvery River Basin, Mandya',
    coordinates: { lat: 12.5242, lng: 76.8958 },
    photoUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    availableForDelivery: false,
    notes: 'Medium to large uniform bulbs, dried skins.'
  },
  {
    id: 'list-6',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerRating: 4.8,
    farmerPhone: '+91 98234 56789',
    cropName: 'Green Chilies (G4)',
    quantity: 350,
    unit: 'kg',
    askingPrice: 58,
    harvestDate: '2026-08-20',
    postedDate: 'Posted 2 weeks ago',
    distanceKm: 6.4,
    farmAddress: 'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    photoUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    status: 'Expired',
    availableForDelivery: false,
    notes: 'Harvest cycle ended, remaining stock archived.'
  }
];

export const INITIAL_NEGOTIATIONS: Negotiation[] = [
  {
    id: 'neg-1',
    listingId: 'list-1',
    cropName: 'Tomatoes (Hybrid Red)',
    cropPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    unit: 'kg',
    askingPrice: 26,
    buyerId: 'user-buyer-1',
    buyerName: 'Pooja Sharma (Restaurant)',
    buyerPhone: '+91 99301 22334',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    farmAddress: 'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    currentRound: 2,
    status: 'active',
    turn: 'farmer', // waiting for farmer response
    rounds: [
      {
        roundNumber: 1,
        senderRole: 'buyer',
        senderId: 'user-buyer-1',
        senderName: 'Pooja Sharma',
        offeredPrice: 22,
        quantity: 300,
        totalAmount: 6600,
        timestamp: 'Yesterday at 11:30 AM',
        message: 'Looking for 300kg weekly supply for our restaurant kitchen. Mandi rate is around ₹24.'
      },
      {
        roundNumber: 2,
        senderRole: 'farmer',
        senderId: 'user-farmer-1',
        senderName: 'Ramesh Patel',
        offeredPrice: 24.5,
        quantity: 300,
        totalAmount: 7350,
        timestamp: 'Yesterday at 04:15 PM',
        message: 'Can offer ₹24.50/kg since this is prime hybrid quality and sorted A-grade.'
      }
    ],
    createdAt: '2026-09-08T11:30:00Z',
    updatedAt: '2026-09-08T16:15:00Z'
  },
  {
    id: 'neg-2',
    listingId: 'list-3',
    cropName: 'Wheat (Sharbati)',
    cropPhoto: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    unit: 'kg',
    askingPrice: 36,
    buyerId: 'user-buyer-1',
    buyerName: 'Pooja Sharma (Restaurant)',
    buyerPhone: '+91 99301 22334',
    farmerId: 'user-farmer-2',
    farmerName: 'Balwinder Singh',
    farmerPhone: '+91 94172 33445',
    farmAddress: 'Golden Fields, GT Road, Karnal',
    coordinates: { lat: 29.6857, lng: 76.9905 },
    currentRound: 1,
    status: 'active',
    turn: 'farmer',
    rounds: [
      {
        roundNumber: 1,
        senderRole: 'buyer',
        senderId: 'user-buyer-1',
        senderName: 'Pooja Sharma',
        offeredPrice: 33,
        quantity: 500,
        totalAmount: 16500,
        timestamp: 'Today at 08:20 AM',
        message: 'Can pick up tomorrow morning if price is ₹33/kg.'
      }
    ],
    createdAt: '2026-09-09T08:20:00Z',
    updatedAt: '2026-09-09T08:20:00Z'
  },
  {
    id: 'neg-3',
    listingId: 'list-1',
    cropName: 'Tomatoes (Hybrid Red)',
    cropPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    unit: 'kg',
    askingPrice: 26,
    buyerId: 'user-buyer-2',
    buyerName: 'Anil Gupta (Vendor)',
    buyerPhone: '+91 98112 77889',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    farmAddress: 'Green Valley Organic Farms, Plot 42, Khed Taluka, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    currentRound: 3,
    status: 'accepted',
    turn: 'farmer',
    rounds: [
      {
        roundNumber: 1,
        senderRole: 'buyer',
        senderId: 'user-buyer-2',
        senderName: 'Anil Gupta',
        offeredPrice: 21,
        quantity: 400,
        totalAmount: 8400,
        timestamp: '2 days ago'
      },
      {
        roundNumber: 2,
        senderRole: 'farmer',
        senderId: 'user-farmer-1',
        senderName: 'Ramesh Patel',
        offeredPrice: 24,
        quantity: 400,
        totalAmount: 9600,
        timestamp: '2 days ago'
      },
      {
        roundNumber: 3,
        senderRole: 'buyer',
        senderId: 'user-buyer-2',
        senderName: 'Anil Gupta',
        offeredPrice: 23.5,
        quantity: 400,
        totalAmount: 9400,
        timestamp: 'Yesterday at 09:00 AM'
      }
    ],
    finalPrice: 23.5,
    finalQuantity: 400,
    createdAt: '2026-09-07T10:00:00Z',
    updatedAt: '2026-09-08T10:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7821',
    negotiationId: 'neg-3',
    listingId: 'list-1',
    cropName: 'Tomatoes (Hybrid Red)',
    cropPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    buyerId: 'user-buyer-1',
    buyerName: 'Pooja Sharma',
    buyerPhone: '+91 99301 22334',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    quantity: 250,
    unit: 'kg',
    finalPricePerUnit: 24,
    totalAmount: 6000,
    pickupLocation: 'Green Valley Organic Farms, Gate 2, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    status: 'Pending Pickup',
    paymentMode: 'Cash on Pickup',
    createdAt: '2026-09-08T14:30:00Z'
  },
  {
    id: 'ORD-6540',
    negotiationId: 'neg-old',
    listingId: 'list-2',
    cropName: 'Fresh Cauliflower',
    cropPhoto: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
    buyerId: 'user-buyer-1',
    buyerName: 'Pooja Sharma',
    buyerPhone: '+91 99301 22334',
    farmerId: 'user-farmer-1',
    farmerName: 'Ramesh Patel',
    farmerPhone: '+91 98234 56789',
    quantity: 40,
    unit: 'crate',
    finalPricePerUnit: 275,
    totalAmount: 11000,
    pickupLocation: 'Green Valley Organic Farms, Gate 2, Pune',
    coordinates: { lat: 18.8472, lng: 73.8964 },
    status: 'Completed',
    paymentMode: 'Cash on Pickup',
    createdAt: '2026-09-05T09:00:00Z',
    completedAt: '2026-09-06T15:45:00Z'
  },
  {
    id: 'ORD-5199',
    negotiationId: 'neg-disp',
    listingId: 'list-4',
    cropName: 'Basmati Rice (Pusa 1121)',
    cropPhoto: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    buyerId: 'user-buyer-2',
    buyerName: 'Anil Gupta',
    buyerPhone: '+91 98112 77889',
    farmerId: 'user-farmer-2',
    farmerName: 'Balwinder Singh',
    farmerPhone: '+91 94172 33445',
    quantity: 500,
    unit: 'kg',
    finalPricePerUnit: 80,
    totalAmount: 40000,
    pickupLocation: 'Golden Fields Warehouse, Karnal',
    coordinates: { lat: 29.6857, lng: 76.9905 },
    status: 'Disputed',
    paymentMode: 'Cash on Pickup',
    createdAt: '2026-09-04T12:00:00Z',
    disputeReason: 'Bag moisture level exceeded agreed 11% threshold upon visual inspection at warehouse.'
  }
];

export const INITIAL_ALERTS: SavedAlert[] = [
  {
    id: 'alert-1',
    buyerId: 'user-buyer-1',
    cropName: 'Tomatoes (Hybrid Red)',
    maxRadiusKm: 15,
    createdAt: '2026-09-01',
    matchCount: 2
  },
  {
    id: 'alert-2',
    buyerId: 'user-buyer-1',
    cropName: 'Bell Peppers (Shimla Capsicum)',
    maxRadiusKm: 25,
    createdAt: '2026-09-03',
    matchCount: 0
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-farmer-1',
    title: 'New Offer Received!',
    message: 'Pooja Sharma submitted an offer of ₹22/kg for 300kg of Tomatoes (Hybrid Red).',
    type: 'offer_received',
    linkTab: 'my-listings',
    linkId: 'list-1',
    timestamp: '10 mins ago',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-farmer-1',
    title: 'Order Confirmed',
    message: 'Negotiation #neg-3 accepted! Order ORD-7821 is pending Cash on Pickup.',
    type: 'offer_accepted',
    linkTab: 'my-listings',
    linkId: 'ORD-7821',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    userId: 'user-farmer-1',
    title: 'Listing Expiring Soon',
    message: 'Your Fresh Cauliflower listing will expire in 48 hours.',
    type: 'listing_expiring',
    linkTab: 'my-listings',
    linkId: 'list-2',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: 'notif-4',
    userId: 'user-buyer-1',
    title: 'Counter Offer Received',
    message: 'Farmer Ramesh Patel countered your offer with ₹24.50/kg for Tomatoes (Round 2).',
    type: 'counter_offer',
    linkTab: 'negotiations',
    linkId: 'neg-1',
    timestamp: '30 mins ago',
    read: false
  },
  {
    id: 'notif-5',
    userId: 'user-buyer-1',
    title: 'Alert Match Found!',
    message: 'New listing matching your alert for Tomatoes within 15km was posted.',
    type: 'alert_match',
    linkTab: 'search',
    linkId: 'list-1',
    timestamp: '1 day ago',
    read: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminAction: 'Mandi Price Index Updated',
    target: 'Tomatoes benchmark updated to ₹24/kg',
    timestamp: '2026-09-09 06:00 AM',
    adminEmail: 'admin@farmlink.org'
  },
  {
    id: 'log-2',
    adminAction: 'Dispute Flagged for Review',
    target: 'Order ORD-5199 marked as Disputed',
    timestamp: '2026-09-08 04:30 PM',
    adminEmail: 'system-agent'
  },
  {
    id: 'log-3',
    adminAction: 'Crop Added to Master Index',
    target: 'Bell Peppers (Shimla Capsicum)',
    timestamp: '2026-09-07 10:15 AM',
    adminEmail: 'admin@farmlink.org'
  }
];
