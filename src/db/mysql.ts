import mysql, { Pool, RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';
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
} from '../types.ts';
import {
  INITIAL_USERS,
  INITIAL_CROPS,
  INITIAL_LISTINGS,
  INITIAL_NEGOTIATIONS,
  INITIAL_ORDERS,
  INITIAL_ALERTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData.ts';

dotenv.config();

export interface DatabaseSchema {
  users: User[];
  crops: CropMaster[];
  listings: ProduceListing[];
  negotiations: Negotiation[];
  orders: Order[];
  alerts: SavedAlert[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
}

export const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'farmlink1_db'
};

let pool: Pool | null = null;
let isMySqlConnected = false;

export function getMySqlStatus() {
  return {
    connected: isMySqlConnected,
    engine: isMySqlConnected ? 'MySQL 8.0 (mysql2/promise)' : 'MySQL (Fallback Mode — Local Sync Active)',
    host: MYSQL_CONFIG.host,
    port: MYSQL_CONFIG.port,
    database: MYSQL_CONFIG.database,
    workbenchScriptPath: 'database/farmlink_mysql_workbench.sql'
  };
}

/**
 * Initializes the MySQL database connection pool, creates the database and tables
 * if they don't exist, and seeds initial data when empty.
 */
export async function initMySql(): Promise<boolean> {
  try {
    // 1. Connect without database first to ensure `farmlink_db` exists
    const bootstrapConn = await mysql.createConnection({
      host: MYSQL_CONFIG.host,
      port: MYSQL_CONFIG.port,
      user: MYSQL_CONFIG.user,
      password: MYSQL_CONFIG.password,
      connectTimeout: 2500
    });

    await bootstrapConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${MYSQL_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await bootstrapConn.end();

    // 2. Create connection pool targeting `farmlink_db`
    pool = mysql.createPool({
      host: MYSQL_CONFIG.host,
      port: MYSQL_CONFIG.port,
      user: MYSQL_CONFIG.user,
      password: MYSQL_CONFIG.password,
      database: MYSQL_CONFIG.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    await createTablesIfNeeded();
    await seedMySqlIfEmpty();

    isMySqlConnected = true;
    console.log(
      `[MySQL] Connected to ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}/${MYSQL_CONFIG.database} (MySQL Workbench Ready)`
    );
    return true;
  } catch (err) {
    isMySqlConnected = false;
    console.log(
      `[MySQL] Local MySQL daemon not detected at ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}. Running with MySQL-compatible schema sync & SQL export.`
    );
    return false;
  }
}

async function createTablesIfNeeded(): Promise<void> {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password_hash VARCHAR(255) DEFAULT 'password123',
      role ENUM('farmer', 'buyer', 'admin') NOT NULL DEFAULT 'farmer',
      is_verified TINYINT(1) NOT NULL DEFAULT 1,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      registered_date VARCHAR(32) NOT NULL,
      farm_address VARCHAR(255) DEFAULT NULL,
      farm_lat DECIMAL(10, 6) DEFAULT NULL,
      farm_lng DECIMAL(10, 6) DEFAULT NULL,
      farm_district VARCHAR(100) DEFAULT NULL,
      rating DECIMAL(3, 2) DEFAULT 5.00,
      rating_count INT DEFAULT 1,
      member_since VARCHAR(50) DEFAULT 'Just now',
      business_type VARCHAR(50) DEFAULT NULL
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_index (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      category VARCHAR(80) NOT NULL,
      base_unit VARCHAR(30) NOT NULL DEFAULT 'kg',
      mandi_price DECIMAL(10, 2) NOT NULL,
      mandi_min_price DECIMAL(10, 2) NOT NULL,
      mandi_max_price DECIMAL(10, 2) NOT NULL,
      last_updated VARCHAR(64) NOT NULL DEFAULT 'Today, 06:00 AM'
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS produce_listings (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      farmer_id VARCHAR(64) NOT NULL,
      farmer_name VARCHAR(120) NOT NULL,
      farmer_rating DECIMAL(3, 2) NOT NULL DEFAULT 4.80,
      farmer_phone VARCHAR(30) NOT NULL,
      crop_name VARCHAR(120) NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL,
      unit VARCHAR(30) NOT NULL DEFAULT 'kg',
      asking_price DECIMAL(10, 2) NOT NULL,
      harvest_date VARCHAR(32) NOT NULL,
      posted_date VARCHAR(64) NOT NULL DEFAULT 'Posted just now',
      distance_km DECIMAL(6, 2) NOT NULL DEFAULT 5.00,
      farm_address VARCHAR(255) NOT NULL,
      lat DECIMAL(10, 6) NOT NULL,
      lng DECIMAL(10, 6) NOT NULL,
      photo_url TEXT NOT NULL,
      status ENUM('Active', 'Expired') NOT NULL DEFAULT 'Active',
      available_for_delivery TINYINT(1) NOT NULL DEFAULT 0,
      notes TEXT DEFAULT NULL
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS negotiations (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      listing_id VARCHAR(64) NOT NULL,
      crop_name VARCHAR(120) NOT NULL,
      crop_photo TEXT NOT NULL,
      unit VARCHAR(30) NOT NULL,
      asking_price DECIMAL(10, 2) NOT NULL,
      buyer_id VARCHAR(64) NOT NULL,
      buyer_name VARCHAR(120) NOT NULL,
      buyer_phone VARCHAR(30) NOT NULL,
      farmer_id VARCHAR(64) NOT NULL,
      farmer_name VARCHAR(120) NOT NULL,
      farmer_phone VARCHAR(30) NOT NULL,
      farm_address VARCHAR(255) NOT NULL,
      lat DECIMAL(10, 6) NOT NULL,
      lng DECIMAL(10, 6) NOT NULL,
      current_round TINYINT NOT NULL DEFAULT 1,
      status ENUM('active', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'active',
      turn ENUM('buyer', 'farmer') NOT NULL DEFAULT 'farmer',
      final_price DECIMAL(10, 2) DEFAULT NULL,
      final_quantity DECIMAL(10, 2) DEFAULT NULL,
      created_at VARCHAR(64) NOT NULL,
      updated_at VARCHAR(64) NOT NULL
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS negotiation_rounds (
      id INT AUTO_INCREMENT PRIMARY KEY,
      negotiation_id VARCHAR(64) NOT NULL,
      round_number TINYINT NOT NULL,
      sender_role ENUM('buyer', 'farmer') NOT NULL,
      sender_id VARCHAR(64) NOT NULL,
      sender_name VARCHAR(120) NOT NULL,
      offered_price DECIMAL(10, 2) NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL,
      total_amount DECIMAL(12, 2) NOT NULL,
      timestamp_label VARCHAR(64) NOT NULL,
      message TEXT DEFAULT NULL
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      negotiation_id VARCHAR(64) NOT NULL,
      listing_id VARCHAR(64) NOT NULL,
      crop_name VARCHAR(120) NOT NULL,
      crop_photo TEXT NOT NULL,
      buyer_id VARCHAR(64) NOT NULL,
      buyer_name VARCHAR(120) NOT NULL,
      buyer_phone VARCHAR(30) NOT NULL,
      farmer_id VARCHAR(64) NOT NULL,
      farmer_name VARCHAR(120) NOT NULL,
      farmer_phone VARCHAR(30) NOT NULL,
      quantity DECIMAL(10, 2) NOT NULL,
      unit VARCHAR(30) NOT NULL,
      final_price_per_unit DECIMAL(10, 2) NOT NULL,
      total_amount DECIMAL(12, 2) NOT NULL,
      pickup_location VARCHAR(255) NOT NULL,
      lat DECIMAL(10, 6) NOT NULL,
      lng DECIMAL(10, 6) NOT NULL,
      status ENUM('Pending Pickup', 'Completed', 'Disputed', 'Cancelled') NOT NULL DEFAULT 'Pending Pickup',
      payment_mode VARCHAR(50) NOT NULL DEFAULT 'Cash on Pickup',
      created_at VARCHAR(64) NOT NULL,
      completed_at VARCHAR(64) DEFAULT NULL,
      dispute_reason TEXT DEFAULT NULL,
      dispute_resolution TEXT DEFAULT NULL
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS saved_alerts (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      buyer_id VARCHAR(64) NOT NULL,
      crop_name VARCHAR(120) NOT NULL,
      max_radius_km INT NOT NULL DEFAULT 15,
      created_at VARCHAR(32) NOT NULL,
      match_count INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      user_id VARCHAR(64) NOT NULL,
      title VARCHAR(180) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(64) NOT NULL,
      link_tab VARCHAR(64) DEFAULT NULL,
      link_id VARCHAR(64) DEFAULT NULL,
      timestamp_label VARCHAR(64) NOT NULL,
      is_read TINYINT(1) NOT NULL DEFAULT 0
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id VARCHAR(64) NOT NULL PRIMARY KEY,
      admin_action VARCHAR(180) NOT NULL,
      target VARCHAR(255) NOT NULL,
      timestamp_label VARCHAR(64) NOT NULL,
      admin_email VARCHAR(150) NOT NULL
    ) ENGINE=InnoDB;
  `);
}

async function seedMySqlIfEmpty(): Promise<void> {
  if (!pool) return;
  const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS cnt FROM users');
  if (rows[0].cnt > 0) return;

  await syncFullStateToMySql({
    users: INITIAL_USERS,
    crops: INITIAL_CROPS,
    listings: INITIAL_LISTINGS,
    negotiations: INITIAL_NEGOTIATIONS,
    orders: INITIAL_ORDERS,
    alerts: INITIAL_ALERTS,
    notifications: INITIAL_NOTIFICATIONS,
    auditLogs: INITIAL_AUDIT_LOGS
  });
}

/**
 * Fetches the complete relational dataset from MySQL tables and maps it back
 * to the FarmLink domain entities.
 */
export async function fetchFullStateFromMySql(): Promise<DatabaseSchema | null> {
  if (!pool || !isMySqlConnected) return null;

  try {
    const [userRows] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
    const [cropRows] = await pool.query<RowDataPacket[]>('SELECT * FROM price_index');
    const [listingRows] = await pool.query<RowDataPacket[]>('SELECT * FROM produce_listings');
    const [negRows] = await pool.query<RowDataPacket[]>('SELECT * FROM negotiations');
    const [roundRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM negotiation_rounds ORDER BY round_number ASC'
    );
    const [orderRows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders');
    const [alertRows] = await pool.query<RowDataPacket[]>('SELECT * FROM saved_alerts');
    const [notifRows] = await pool.query<RowDataPacket[]>('SELECT * FROM notifications');
    const [logRows] = await pool.query<RowDataPacket[]>('SELECT * FROM audit_logs');

    const users: User[] = userRows.map(r => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      role: r.role,
      isVerified: Boolean(r.is_verified),
      isActive: Boolean(r.is_active),
      registeredDate: String(r.registered_date),
      farmAddress: r.farm_address || undefined,
      farmLocation:
        r.farm_lat && r.farm_lng
          ? { lat: Number(r.farm_lat), lng: Number(r.farm_lng), district: r.farm_district || 'Pune' }
          : undefined,
      rating: r.rating ? Number(r.rating) : undefined,
      ratingCount: r.rating_count ? Number(r.rating_count) : undefined,
      memberSince: r.member_since || undefined,
      businessType: r.business_type || undefined
    }));

    const crops: CropMaster[] = cropRows.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      baseUnit: r.base_unit,
      mandiPrice: Number(r.mandi_price),
      mandiPriceRange: {
        min: Number(r.mandi_min_price),
        max: Number(r.mandi_max_price)
      },
      lastUpdated: r.last_updated
    }));

    const listings: ProduceListing[] = listingRows.map(r => ({
      id: r.id,
      farmerId: r.farmer_id,
      farmerName: r.farmer_name,
      farmerRating: Number(r.farmer_rating),
      farmerPhone: r.farmer_phone,
      cropName: r.crop_name,
      quantity: Number(r.quantity),
      unit: r.unit,
      askingPrice: Number(r.asking_price),
      harvestDate: String(r.harvest_date),
      postedDate: r.posted_date,
      distanceKm: Number(r.distance_km),
      farmAddress: r.farm_address,
      coordinates: { lat: Number(r.lat), lng: Number(r.lng) },
      photoUrl: r.photo_url,
      status: r.status,
      availableForDelivery: Boolean(r.available_for_delivery),
      notes: r.notes || undefined
    }));

    const negotiations: Negotiation[] = negRows.map(r => {
      const rounds: NegotiationRound[] = roundRows
        .filter(rr => rr.negotiation_id === r.id)
        .map(rr => ({
          roundNumber: Number(rr.round_number),
          senderRole: rr.sender_role,
          senderId: rr.sender_id,
          senderName: rr.sender_name,
          offeredPrice: Number(rr.offered_price),
          quantity: Number(rr.quantity),
          totalAmount: Number(rr.total_amount),
          timestamp: rr.timestamp_label,
          message: rr.message || undefined
        }));

      return {
        id: r.id,
        listingId: r.listing_id,
        cropName: r.crop_name,
        cropPhoto: r.crop_photo,
        unit: r.unit,
        askingPrice: Number(r.asking_price),
        buyerId: r.buyer_id,
        buyerName: r.buyer_name,
        buyerPhone: r.buyer_phone,
        farmerId: r.farmer_id,
        farmerName: r.farmer_name,
        farmerPhone: r.farmer_phone,
        farmAddress: r.farm_address,
        coordinates: { lat: Number(r.lat), lng: Number(r.lng) },
        currentRound: Number(r.current_round),
        status: r.status,
        turn: r.turn,
        rounds,
        finalPrice: r.final_price !== null ? Number(r.final_price) : undefined,
        finalQuantity: r.final_quantity !== null ? Number(r.final_quantity) : undefined,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      };
    });

    const orders: Order[] = orderRows.map(r => ({
      id: r.id,
      negotiationId: r.negotiation_id,
      listingId: r.listing_id,
      cropName: r.crop_name,
      cropPhoto: r.crop_photo,
      buyerId: r.buyer_id,
      buyerName: r.buyer_name,
      buyerPhone: r.buyer_phone,
      farmerId: r.farmer_id,
      farmerName: r.farmer_name,
      farmerPhone: r.farmer_phone,
      quantity: Number(r.quantity),
      unit: r.unit,
      finalPricePerUnit: Number(r.final_price_per_unit),
      totalAmount: Number(r.total_amount),
      pickupLocation: r.pickup_location,
      coordinates: { lat: Number(r.lat), lng: Number(r.lng) },
      status: r.status,
      paymentMode: 'Cash on Pickup',
      createdAt: r.created_at,
      completedAt: r.completed_at || undefined,
      disputeReason: r.dispute_reason || undefined,
      disputeResolution: r.dispute_resolution || undefined
    }));

    const alerts: SavedAlert[] = alertRows.map(r => ({
      id: r.id,
      buyerId: r.buyer_id,
      cropName: r.crop_name,
      maxRadiusKm: Number(r.max_radius_km),
      createdAt: String(r.created_at),
      matchCount: Number(r.match_count)
    }));

    const notifications: AppNotification[] = notifRows.map(r => ({
      id: r.id,
      userId: r.user_id,
      title: r.title,
      message: r.message,
      type: r.type,
      linkTab: r.link_tab || undefined,
      linkId: r.link_id || undefined,
      timestamp: r.timestamp_label,
      read: Boolean(r.is_read)
    }));

    const auditLogs: AuditLog[] = logRows.map(r => ({
      id: r.id,
      adminAction: r.admin_action,
      target: r.target,
      timestamp: r.timestamp_label,
      adminEmail: r.admin_email
    }));

    return {
      users,
      crops,
      listings,
      negotiations,
      orders,
      alerts,
      notifications,
      auditLogs
    };
  } catch (err) {
    console.error('[MySQL] Error reading state:', err);
    return null;
  }
}

/**
 * Synchronizes the in-memory state into the MySQL relational tables.
 */
export async function syncFullStateToMySql(data: DatabaseSchema): Promise<void> {
  if (!pool || !isMySqlConnected) return;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM audit_logs');
    await conn.query('DELETE FROM notifications');
    await conn.query('DELETE FROM saved_alerts');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM negotiation_rounds');
    await conn.query('DELETE FROM negotiations');
    await conn.query('DELETE FROM produce_listings');
    await conn.query('DELETE FROM price_index');
    await conn.query('DELETE FROM users');

    for (const u of data.users) {
      await conn.query(
        `INSERT INTO users (id, name, phone, email, role, is_verified, is_active, registered_date, farm_address, farm_lat, farm_lng, farm_district, rating, rating_count, member_since, business_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u.id,
          u.name,
          u.phone,
          u.email,
          u.role,
          u.isVerified ? 1 : 0,
          u.isActive ? 1 : 0,
          u.registeredDate,
          u.farmAddress || null,
          u.farmLocation?.lat || null,
          u.farmLocation?.lng || null,
          u.farmLocation?.district || null,
          u.rating || 5.0,
          u.ratingCount || 1,
          u.memberSince || 'Just now',
          u.businessType || null
        ]
      );
    }

    for (const c of data.crops) {
      await conn.query(
        `INSERT INTO price_index (id, name, category, base_unit, mandi_price, mandi_min_price, mandi_max_price, last_updated)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          c.id,
          c.name,
          c.category,
          c.baseUnit,
          c.mandiPrice,
          c.mandiPriceRange.min,
          c.mandiPriceRange.max,
          c.lastUpdated
        ]
      );
    }

    for (const l of data.listings) {
      await conn.query(
        `INSERT INTO produce_listings (id, farmer_id, farmer_name, farmer_rating, farmer_phone, crop_name, quantity, unit, asking_price, harvest_date, posted_date, distance_km, farm_address, lat, lng, photo_url, status, available_for_delivery, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          l.id,
          l.farmerId,
          l.farmerName,
          l.farmerRating,
          l.farmerPhone,
          l.cropName,
          l.quantity,
          l.unit,
          l.askingPrice,
          l.harvestDate,
          l.postedDate,
          l.distanceKm,
          l.farmAddress,
          l.coordinates.lat,
          l.coordinates.lng,
          l.photoUrl,
          l.status,
          l.availableForDelivery ? 1 : 0,
          l.notes || null
        ]
      );
    }

    for (const n of data.negotiations) {
      await conn.query(
        `INSERT INTO negotiations (id, listing_id, crop_name, crop_photo, unit, asking_price, buyer_id, buyer_name, buyer_phone, farmer_id, farmer_name, farmer_phone, farm_address, lat, lng, current_round, status, turn, final_price, final_quantity, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          n.id,
          n.listingId,
          n.cropName,
          n.cropPhoto,
          n.unit,
          n.askingPrice,
          n.buyerId,
          n.buyerName,
          n.buyerPhone,
          n.farmerId,
          n.farmerName,
          n.farmerPhone,
          n.farmAddress,
          n.coordinates.lat,
          n.coordinates.lng,
          n.currentRound,
          n.status,
          n.turn,
          n.finalPrice ?? null,
          n.finalQuantity ?? null,
          n.createdAt,
          n.updatedAt
        ]
      );

      for (const r of n.rounds) {
        await conn.query(
          `INSERT INTO negotiation_rounds (negotiation_id, round_number, sender_role, sender_id, sender_name, offered_price, quantity, total_amount, timestamp_label, message)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            n.id,
            r.roundNumber,
            r.senderRole,
            r.senderId,
            r.senderName,
            r.offeredPrice,
            r.quantity,
            r.totalAmount,
            r.timestamp,
            r.message || null
          ]
        );
      }
    }

    for (const o of data.orders) {
      await conn.query(
        `INSERT INTO orders (id, negotiation_id, listing_id, crop_name, crop_photo, buyer_id, buyer_name, buyer_phone, farmer_id, farmer_name, farmer_phone, quantity, unit, final_price_per_unit, total_amount, pickup_location, lat, lng, status, payment_mode, created_at, completed_at, dispute_reason, dispute_resolution)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          o.id,
          o.negotiationId,
          o.listingId,
          o.cropName,
          o.cropPhoto,
          o.buyerId,
          o.buyerName,
          o.buyerPhone,
          o.farmerId,
          o.farmerName,
          o.farmerPhone,
          o.quantity,
          o.unit,
          o.finalPricePerUnit,
          o.totalAmount,
          o.pickupLocation,
          o.coordinates.lat,
          o.coordinates.lng,
          o.status,
          o.paymentMode,
          o.createdAt,
          o.completedAt || null,
          o.disputeReason || null,
          o.disputeResolution || null
        ]
      );
    }

    for (const a of data.alerts) {
      await conn.query(
        `INSERT INTO saved_alerts (id, buyer_id, crop_name, max_radius_km, created_at, match_count)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [a.id, a.buyerId, a.cropName, a.maxRadiusKm, a.createdAt, a.matchCount || 0]
      );
    }

    for (const notif of data.notifications) {
      await conn.query(
        `INSERT INTO notifications (id, user_id, title, message, type, link_tab, link_id, timestamp_label, is_read)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          notif.id,
          notif.userId,
          notif.title,
          notif.message,
          notif.type,
          notif.linkTab || null,
          notif.linkId || null,
          notif.timestamp,
          notif.read ? 1 : 0
        ]
      );
    }

    for (const log of data.auditLogs) {
      await conn.query(
        `INSERT INTO audit_logs (id, admin_action, target, timestamp_label, admin_email)
         VALUES (?, ?, ?, ?, ?)`,
        [log.id, log.adminAction, log.target, log.timestamp, log.adminEmail]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error('[MySQL] Error syncing to MySQL tables:', err);
  } finally {
    conn.release();
  }
}
