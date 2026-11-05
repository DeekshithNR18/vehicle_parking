import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const dbPath = path.resolve(process.env.DB_PATH || "../database/veh_parking.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, role TEXT DEFAULT 'resident', wallet REAL DEFAULT 500,
  points INTEGER DEFAULT 120, plate TEXT, vehicle_type TEXT DEFAULT 'car',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS slots (
  id TEXT PRIMARY KEY, label TEXT NOT NULL UNIQUE, zone TEXT NOT NULL,
  type TEXT NOT NULL, status TEXT DEFAULT 'available', price_per_hour REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, slot_id TEXT NOT NULL,
  date TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT, duration INTEGER NOT NULL,
  amount REAL NOT NULL, status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL,
  amount REAL NOT NULL, note TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, ticket_id TEXT NOT NULL,
  title TEXT NOT NULL, priority TEXT DEFAULT 'normal', status TEXT DEFAULT 'open',
  has_photo INTEGER DEFAULT 0, photo TEXT, reply TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sos_alerts (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, user_name TEXT NOT NULL,
  status TEXT DEFAULT 'active', created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS visitor_passes (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, name TEXT NOT NULL,
  guests INTEGER DEFAULT 1, vehicle TEXT, expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

const slotCount = db.prepare("SELECT COUNT(*) as count FROM slots").get();
if (slotCount.count === 0) {
  const zones = ["A", "B", "C", "D"];
  const types = ["car", "bike", "ev"];
  const insert = db.prepare("INSERT INTO slots (id, label, zone, type, status, price_per_hour) VALUES (?, ?, ?, ?, ?, ?)");
  for (let i = 0; i < 48; i++) {
    const zone = zones[Math.floor(i / 12)];
    const num = (i % 12) + 1;
    const type = types[i % 3];
    const status = i % 5 === 0 ? "occupied" : "available";
    const price = type === "ev" ? 40 : type === "car" ? 25 : 15;
    insert.run(`S${i + 1}`, `${zone}-${num}`, zone, type, status, price);
  }
  console.log("? Seeded 48 slots");
}

export default db;

