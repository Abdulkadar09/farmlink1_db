export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  password?: string;
  isVerified: boolean;
  isActive: boolean;
  registeredDate: string;
  // Farmer specific
  farmAddress?: string;
  farmLocation?: { lat: number; lng: number; district: string };
  rating?: number;
  ratingCount?: number;
  memberSince?: string;
  // Buyer specific
  businessType?: 'Household' | 'Vendor' | 'Restaurant' | 'Wholesaler' | string;
}

export interface CropMaster {
  id: string;
  name: string;
  category: string;
  baseUnit: string;
  mandiPrice: number; // Current mandi benchmark price per base unit in ₹
  mandiPriceRange: { min: number; max: number };
  lastUpdated: string;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerRating: number;
  farmerPhone: string;
  cropName: string;
  quantity: number;
  unit: string;
  askingPrice: number; // per unit in ₹
  harvestDate: string;
  postedDate: string;
  distanceKm: number;
  farmAddress: string;
  coordinates: { lat: number; lng: number };
  photoUrl: string;
  status: 'Active' | 'Expired' | 'Flagged';
  availableForDelivery: boolean;
  notes?: string;
}

export interface NegotiationRound {
  roundNumber: number; // 1 to 4
  senderRole: 'buyer' | 'farmer';
  senderId: string;
  senderName: string;
  offeredPrice: number; // per unit
  quantity: number;
  totalAmount: number;
  timestamp: string;
  message?: string;
}

export interface Negotiation {
  id: string;
  listingId: string;
  cropName: string;
  cropPhoto: string;
  unit: string;
  askingPrice: number;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmAddress: string;
  coordinates: { lat: number; lng: number };
  currentRound: number; // max 4
  status: 'active' | 'accepted' | 'rejected' | 'expired';
  turn: 'buyer' | 'farmer'; // whose turn it is to respond
  rounds: NegotiationRound[];
  finalPrice?: number;
  finalQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  negotiationId: string;
  listingId: string;
  cropName: string;
  cropPhoto: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  quantity: number;
  unit: string;
  finalPricePerUnit: number;
  agreedPrice?: number;
  totalAmount: number;
  pickupLocation: string;
  coordinates: { lat: number; lng: number };
  status: 'Pending Pickup' | 'Completed' | 'Disputed' | 'Cancelled';
  paymentMode: 'Cash on Pickup';
  createdAt: string;
  completedAt?: string;
  disputeReason?: string;
  disputeNote?: string;
  disputeResolution?: string;
}

export interface SavedAlert {
  id: string;
  buyerId: string;
  cropName: string;
  maxRadiusKm: number;
  radiusKm?: number;
  maxTargetPrice?: number;
  createdAt: string;
  matchCount?: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'counter_offer' | 'listing_expiring' | 'alert_match' | 'order_update' | 'dispute_alert';
  linkTab?: string;
  linkId?: string; // listingId, negotiationId, or orderId
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  adminAction: string;
  target: string;
  timestamp: string;
  adminEmail: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  action?: string;
  details?: string;
}
