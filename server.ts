import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  User,
  CropMaster,
  ProduceListing,
  Negotiation,
  NegotiationRound,
  Order,
  SavedAlert,
  AppNotification,
  AuditLog
} from './src/types.ts';
import {
  INITIAL_USERS,
  INITIAL_CROPS,
  INITIAL_LISTINGS,
  INITIAL_NEGOTIATIONS,
  INITIAL_ORDERS,
  INITIAL_ALERTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './src/data/initialData.ts';
import {
  DatabaseSchema,
  initMySql,
  fetchFullStateFromMySql,
  syncFullStateToMySql,
  getMySqlStatus
} from './src/db/mysql.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'farmlink-db.json');
const WORKBENCH_SQL_FILE = path.join(__dirname, 'database', 'farmlink_mysql_workbench.sql');

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw) as DatabaseSchema;
    }
  } catch (err) {
    console.error('Error loading database file, seeding defaults:', err);
  }

  const initialDb: DatabaseSchema = {
    users: [...INITIAL_USERS],
    crops: [...INITIAL_CROPS],
    listings: [...INITIAL_LISTINGS],
    negotiations: [...INITIAL_NEGOTIATIONS],
    orders: [...INITIAL_ORDERS],
    alerts: [...INITIAL_ALERTS],
    notifications: [...INITIAL_NOTIFICATIONS],
    auditLogs: [...INITIAL_AUDIT_LOGS]
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    // Also persist to MySQL server when connected
    syncFullStateToMySql(data).catch(err =>
      console.error('MySQL background sync error:', err)
    );
  } catch (err) {
    console.error('Failed to write database:', err);
  }
}

let db: DatabaseSchema = loadDatabase();

function appendAuditLog(action: string, target: string, adminEmail = 'admin@farmlink.org'): AuditLog {
  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    adminAction: action,
    target,
    timestamp: new Date().toLocaleString(),
    adminEmail
  };
  db.auditLogs.unshift(newLog);
  return newLog;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MySQL connection pool (Managed via MySQL Workbench)
  const mysqlReady = await initMySql();
  if (mysqlReady) {
    const mysqlState = await fetchFullStateFromMySql();
    if (mysqlState && mysqlState.users.length > 0) {
      db = mysqlState;
    } else {
      await syncFullStateToMySql(db);
    }
  }

  app.use(express.json({ limit: '10mb' }));

  // ============================================================================
  // HEALTH, MYSQL WORKBENCH SCHEMA & FULL STATE SYNC
  // ============================================================================
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      database: getMySqlStatus(),
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/database/status', (_req, res) => {
    res.json({
      ...getMySqlStatus(),
      tables: {
        users: db.users.length,
        price_index: db.crops.length,
        produce_listings: db.listings.length,
        negotiations: db.negotiations.length,
        orders: db.orders.length,
        saved_alerts: db.alerts.length,
        notifications: db.notifications.length,
        audit_logs: db.auditLogs.length
      }
    });
  });

  app.get('/api/database/workbench-sql', (_req, res) => {
    if (fs.existsSync(WORKBENCH_SQL_FILE)) {
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="farmlink_mysql_workbench.sql"'
      );
      res.send(fs.readFileSync(WORKBENCH_SQL_FILE, 'utf-8'));
    } else {
      res.status(404).json({ error: 'SQL script not found' });
    }
  });

  app.get('/api/state', async (_req, res) => {
    const mysqlState = await fetchFullStateFromMySql();
    if (mysqlState && mysqlState.users.length > 0) {
      db = mysqlState;
    }
    res.json(db);
  });

  app.post('/api/reset', (_req, res) => {
    db = {
      users: [...INITIAL_USERS],
      crops: [...INITIAL_CROPS],
      listings: [...INITIAL_LISTINGS],
      negotiations: [...INITIAL_NEGOTIATIONS],
      orders: [...INITIAL_ORDERS],
      alerts: [...INITIAL_ALERTS],
      notifications: [...INITIAL_NOTIFICATIONS],
      auditLogs: [...INITIAL_AUDIT_LOGS]
    };
    saveDatabase(db);
    res.json(db);
  });

  // ============================================================================
  // AUTH & USERS API
  // ============================================================================
  app.post('/api/auth/login', (req, res) => {
    const { emailOrPhone, forceRole } = req.body;
    if (!emailOrPhone) {
      res.status(400).json({ error: 'Email or phone is required' });
      return;
    }

    const found = db.users.find(
      u =>
        (u.email.toLowerCase() === String(emailOrPhone).toLowerCase() ||
          u.phone.includes(String(emailOrPhone))) &&
        (!forceRole || u.role === forceRole)
    );

    if (!found) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (!found.isActive) {
      res.status(403).json({ error: 'Account suspended by marketplace administration' });
      return;
    }

    res.json({ user: found });
  });

  app.post('/api/auth/register', (req, res) => {
    const data = req.body as Partial<User>;
    const newUser: User = {
      id: data.id || `user-${Date.now()}`,
      name: data.name || 'New Member',
      phone: data.phone || '+91 99000 11000',
      email: data.email || 'user@farmlink.org',
      role: data.role || 'farmer',
      isVerified: true,
      isActive: true,
      registeredDate: new Date().toISOString().split('T')[0],
      farmAddress:
        data.farmAddress ||
        (data.role === 'farmer' ? 'Green Agro Farm, Taluka North' : undefined),
      businessType:
        data.businessType || (data.role === 'buyer' ? 'Restaurant' : undefined),
      rating: 5.0,
      ratingCount: 1,
      memberSince: 'Just now'
    };

    db.users.unshift(newUser);
    saveDatabase(db);
    res.status(201).json({ user: newUser, users: db.users });
  });

  app.post('/api/auth/verify-otp', (req, res) => {
    const { otp, userId } = req.body;
    if (!otp || String(otp).length !== 6) {
      res.status(400).json({ error: 'Invalid 6-digit OTP' });
      return;
    }
    if (userId) {
      db.users = db.users.map(u => (u.id === userId ? { ...u, isVerified: true } : u));
      saveDatabase(db);
    }
    res.json({ verified: true, users: db.users });
  });

  app.patch('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body as Partial<User>;
    let updatedUser: User | null = null;

    db.users = db.users.map(u => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    saveDatabase(db);
    res.json({ user: updatedUser, users: db.users });
  });

  // ============================================================================
  // PRODUCE LISTINGS API
  // ============================================================================
  app.get('/api/listings', (_req, res) => {
    res.json(db.listings);
  });

  app.post('/api/listings', (req, res) => {
    const listing = req.body as ProduceListing;
    db.listings.unshift(listing);

    // Check if any buyer alerts match this crop
    const matchingAlerts = db.alerts.filter(
      a => a.cropName.toLowerCase() === listing.cropName.toLowerCase()
    );
    matchingAlerts.forEach(alertItem => {
      const notif: AppNotification = {
        id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: alertItem.buyerId,
        title: 'Alert Match Found!',
        message: `A new listing for ${listing.cropName} at ₹${listing.askingPrice}/${listing.unit} matches your saved alert!`,
        type: 'alert_match',
        linkTab: 'search',
        linkId: listing.id,
        timestamp: 'Just now',
        read: false
      };
      db.notifications.unshift(notif);
    });

    saveDatabase(db);
    res.status(201).json({
      listing,
      listings: db.listings,
      notifications: db.notifications
    });
  });

  app.patch('/api/listings/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body as Partial<ProduceListing>;
    db.listings = db.listings.map(l => (l.id === id ? { ...l, ...updates } : l));
    saveDatabase(db);
    res.json({ listings: db.listings });
  });

  app.delete('/api/listings/:id', (req, res) => {
    const { id } = req.params;
    db.listings = db.listings.filter(l => l.id !== id);
    saveDatabase(db);
    res.json({ listings: db.listings });
  });

  // ============================================================================
  // 4-ROUND NEGOTIATION ENGINE API
  // ============================================================================
  app.post('/api/negotiations', (req, res) => {
    const { negotiation, notification } = req.body as {
      negotiation: Negotiation;
      notification?: AppNotification;
    };

    db.negotiations.unshift(negotiation);
    if (notification) {
      db.notifications.unshift(notification);
    }

    saveDatabase(db);
    res.status(201).json({
      negotiation,
      negotiations: db.negotiations,
      notifications: db.notifications
    });
  });

  app.post('/api/negotiations/:id/counter', (req, res) => {
    const { id } = req.params;
    const { newPrice, quantity, message, senderId, senderName } = req.body;

    const neg = db.negotiations.find(n => n.id === id);
    if (!neg) {
      res.status(404).json({ error: 'Negotiation not found' });
      return;
    }

    if (neg.currentRound >= 4) {
      res.status(400).json({ error: 'Maximum 4 negotiation rounds reached' });
      return;
    }

    const nextRoundNumber = neg.currentRound + 1;
    const currentQty = quantity || neg.rounds[neg.rounds.length - 1].quantity;
    const senderRole: 'farmer' | 'buyer' = senderId === neg.farmerId ? 'farmer' : 'buyer';
    const nextTurn: 'farmer' | 'buyer' = senderRole === 'farmer' ? 'buyer' : 'farmer';

    const newRound: NegotiationRound = {
      roundNumber: nextRoundNumber,
      senderRole,
      senderId,
      senderName,
      offeredPrice: Number(newPrice),
      quantity: Number(currentQty),
      totalAmount: Math.round(Number(newPrice) * Number(currentQty)),
      timestamp: 'Just now',
      message: message || `Counter offer: ₹${newPrice}/${neg.unit} for ${currentQty} ${neg.unit}.`
    };

    db.negotiations = db.negotiations.map(n =>
      n.id === id
        ? {
            ...n,
            currentRound: nextRoundNumber,
            turn: nextTurn,
            rounds: [...n.rounds, newRound],
            updatedAt: new Date().toISOString()
          }
        : n
    );

    const targetUserId = senderRole === 'farmer' ? neg.buyerId : neg.farmerId;
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: `Counter Offer (Round ${nextRoundNumber})`,
      message: `${senderName} sent a counter offer of ₹${newPrice}/${neg.unit} on ${neg.cropName}.`,
      type: 'counter_offer',
      linkTab: senderRole === 'farmer' ? 'negotiations' : 'my-listings',
      linkId: neg.listingId,
      timestamp: 'Just now',
      read: false
    };
    db.notifications.unshift(notif);

    saveDatabase(db);
    res.json({
      negotiations: db.negotiations,
      notifications: db.notifications
    });
  });

  app.post('/api/negotiations/:id/accept', (req, res) => {
    const { id } = req.params;
    const { actorUserId, orderId } = req.body;

    const neg = db.negotiations.find(n => n.id === id);
    if (!neg) {
      res.status(404).json({ error: 'Negotiation not found' });
      return;
    }

    const latestRound = neg.rounds[neg.rounds.length - 1];
    const finalPrice = latestRound.offeredPrice;
    const finalQty = latestRound.quantity;

    db.negotiations = db.negotiations.map(n =>
      n.id === id
        ? {
            ...n,
            status: 'accepted',
            finalPrice,
            finalQuantity: finalQty,
            updatedAt: new Date().toISOString()
          }
        : n
    );

    const generatedOrderId = orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: generatedOrderId,
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
      totalAmount: Math.round(finalPrice * finalQty),
      pickupLocation: neg.farmAddress,
      coordinates: neg.coordinates,
      status: 'Pending Pickup',
      paymentMode: 'Cash on Pickup',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    const targetUserId = actorUserId === neg.farmerId ? neg.buyerId : neg.farmerId;
    const targetRoleName = actorUserId === neg.farmerId ? 'Farmer' : 'Buyer';
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: 'Offer Accepted! Order Created',
      message: `${targetRoleName} accepted the offer of ₹${finalPrice}/${neg.unit} for ${neg.cropName}. Order #${generatedOrderId} has been generated for Cash on Pickup.`,
      type: 'offer_accepted',
      linkTab: 'orders',
      linkId: generatedOrderId,
      timestamp: 'Just now',
      read: false
    };
    db.notifications.unshift(notif);

    saveDatabase(db);
    res.json({
      negotiations: db.negotiations,
      orders: db.orders,
      notifications: db.notifications
    });
  });

  app.post('/api/negotiations/:id/reject', (req, res) => {
    const { id } = req.params;
    const { actorUserId, actorName } = req.body;

    const neg = db.negotiations.find(n => n.id === id);
    if (!neg) {
      res.status(404).json({ error: 'Negotiation not found' });
      return;
    }

    db.negotiations = db.negotiations.map(n =>
      n.id === id
        ? {
            ...n,
            status: 'rejected',
            updatedAt: new Date().toISOString()
          }
        : n
    );

    const targetUserId = actorUserId === neg.farmerId ? neg.buyerId : neg.farmerId;
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: 'Offer Rejected',
      message: `${actorName || 'User'} declined the offer on ${neg.cropName}. Negotiation closed.`,
      type: 'offer_rejected',
      linkTab: 'negotiations',
      linkId: id,
      timestamp: 'Just now',
      read: false
    };
    db.notifications.unshift(notif);

    saveDatabase(db);
    res.json({
      negotiations: db.negotiations,
      notifications: db.notifications
    });
  });

  // ============================================================================
  // ORDERS & DISPUTES API
  // ============================================================================
  app.post('/api/orders/:id/pickup', (req, res) => {
    const { id } = req.params;
    const order = db.orders.find(o => o.id === id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    db.orders = db.orders.map(o =>
      o.id === id
        ? {
            ...o,
            status: 'Completed',
            completedAt: new Date().toISOString()
          }
        : o
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: order.farmerId,
      title: 'Produce Picked Up & Paid',
      message: `Buyer ${order.buyerName} marked Order #${order.id} as Picked Up via Cash on Pickup. Trade completed!`,
      type: 'order_update',
      linkTab: 'my-listings',
      linkId: order.id,
      timestamp: 'Just now',
      read: false
    };
    db.notifications.unshift(notif);

    saveDatabase(db);
    res.json({
      orders: db.orders,
      notifications: db.notifications
    });
  });

  app.post('/api/orders/:id/dispute', (req, res) => {
    const { id } = req.params;
    const { reason, actorEmail } = req.body;

    db.orders = db.orders.map(o =>
      o.id === id
        ? {
            ...o,
            status: 'Disputed',
            disputeReason: reason
          }
        : o
    );

    appendAuditLog('Dispute Raised by Buyer', `Order #${id}: ${reason}`, actorEmail);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin-1',
      title: 'Dispute Reported on Order',
      message: `Buyer reported issue on Order #${id}: "${reason}"`,
      type: 'dispute_alert',
      linkTab: 'orders-disputes',
      linkId: id,
      timestamp: 'Just now',
      read: false
    };
    db.notifications.unshift(notif);

    saveDatabase(db);
    res.json({
      orders: db.orders,
      notifications: db.notifications,
      auditLogs: db.auditLogs
    });
  });

  // ============================================================================
  // SAVED ALERTS & NOTIFICATIONS API
  // ============================================================================
  app.post('/api/alerts', (req, res) => {
    const alertItem = req.body as SavedAlert;
    db.alerts.unshift(alertItem);
    saveDatabase(db);
    res.status(201).json({ alerts: db.alerts });
  });

  app.delete('/api/alerts/:id', (req, res) => {
    const { id } = req.params;
    db.alerts = db.alerts.filter(a => a.id !== id);
    saveDatabase(db);
    res.json({ alerts: db.alerts });
  });

  app.patch('/api/notifications/:id/read', (req, res) => {
    const { id } = req.params;
    db.notifications = db.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveDatabase(db);
    res.json({ notifications: db.notifications });
  });

  app.post('/api/notifications/read-all', (req, res) => {
    const { userId } = req.body;
    db.notifications = db.notifications.map(n =>
      n.userId === userId ? { ...n, read: true } : n
    );
    saveDatabase(db);
    res.json({ notifications: db.notifications });
  });

  // ============================================================================
  // ADMIN MODERATION & MASTER CROP CATALOG API
  // ============================================================================
  app.post('/api/admin/users/:id/toggle-ban', (req, res) => {
    const { id } = req.params;
    const { adminEmail } = req.body;

    db.users = db.users.map(u => {
      if (u.id === id) {
        const nextStatus = !u.isActive;
        appendAuditLog(
          nextStatus ? 'User Account Unbanned' : 'User Account Banned',
          `${u.name} (${u.email})`,
          adminEmail
        );
        return { ...u, isActive: nextStatus };
      }
      return u;
    });

    saveDatabase(db);
    res.json({ users: db.users, auditLogs: db.auditLogs });
  });

  app.delete('/api/admin/listings/:id', (req, res) => {
    const { id } = req.params;
    const { adminEmail } = req.body || {};
    const listing = db.listings.find(l => l.id === id);
    db.listings = db.listings.filter(l => l.id !== id);
    if (listing) {
      appendAuditLog(
        'Listing Removed by Admin',
        `${listing.cropName} by ${listing.farmerName}`,
        adminEmail
      );
    }
    saveDatabase(db);
    res.json({ listings: db.listings, auditLogs: db.auditLogs });
  });

  app.post('/api/admin/orders/:id/resolve', (req, res) => {
    const { id } = req.params;
    const { resolution, adminEmail } = req.body;
    db.orders = db.orders.map(o =>
      o.id === id
        ? {
            ...o,
            status: 'Completed',
            disputeResolution: resolution
          }
        : o
    );
    appendAuditLog(
      'Dispute Resolved by Admin',
      `Order #${id} marked as resolved: ${resolution}`,
      adminEmail
    );
    saveDatabase(db);
    res.json({ orders: db.orders, auditLogs: db.auditLogs });
  });

  app.post('/api/admin/orders/:id/cancel', (req, res) => {
    const { id } = req.params;
    const { adminEmail } = req.body;
    db.orders = db.orders.map(o =>
      o.id === id
        ? {
            ...o,
            status: 'Cancelled'
          }
        : o
    );
    appendAuditLog(
      'Order Cancelled by Admin',
      `Order #${id} marked as Cancelled`,
      adminEmail
    );
    saveDatabase(db);
    res.json({ orders: db.orders, auditLogs: db.auditLogs });
  });

  app.post('/api/admin/crops', (req, res) => {
    const { crop, adminEmail } = req.body as { crop: CropMaster; adminEmail?: string };
    db.crops.push(crop);
    appendAuditLog(
      'Crop Added to Master Catalog',
      `${crop.name} benchmark ₹${crop.mandiPrice}/${crop.baseUnit}`,
      adminEmail
    );
    saveDatabase(db);
    res.status(201).json({ crops: db.crops, auditLogs: db.auditLogs });
  });

  app.patch('/api/admin/crops/:id', (req, res) => {
    const { id } = req.params;
    const { newPrice, adminEmail } = req.body;
    db.crops = db.crops.map(c => {
      if (c.id === id) {
        appendAuditLog(
          'Mandi Price Updated',
          `${c.name}: from ₹${c.mandiPrice} to ₹${newPrice}`,
          adminEmail
        );
        return {
          ...c,
          mandiPrice: Number(newPrice),
          mandiPriceRange: {
            min: Math.round(Number(newPrice) * 0.9),
            max: Math.round(Number(newPrice) * 1.1)
          },
          lastUpdated: 'Just now'
        };
      }
      return c;
    });
    saveDatabase(db);
    res.json({ crops: db.crops, auditLogs: db.auditLogs });
  });

  app.delete('/api/admin/crops/:id', (req, res) => {
    const { id } = req.params;
    const { adminEmail } = req.body || {};
    const crop = db.crops.find(c => c.id === id);
    db.crops = db.crops.filter(c => c.id !== id);
    if (crop) {
      appendAuditLog('Crop Removed from Master Catalog', crop.name, adminEmail);
    }
    saveDatabase(db);
    res.json({ crops: db.crops, auditLogs: db.auditLogs });
  });

  app.post('/api/admin/audit-logs', (req, res) => {
    const { action, target, adminEmail } = req.body;
    appendAuditLog(action, target, adminEmail);
    saveDatabase(db);
    res.status(201).json({ auditLogs: db.auditLogs });
  });

  // ============================================================================
  // VITE MIDDLEWARE (DEV) OR STATIC ASSETS (PROD)
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FarmLink Full-Stack Server running on http://localhost:${PORT}`);
  });
}

startServer();
