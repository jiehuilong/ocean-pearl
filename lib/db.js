import Database from 'better-sqlite3';
import { join } from 'path';

const globalForDb = globalThis;
const DB_PATH = join(process.cwd(), 'dev.db');

function getDb() {
  if (!globalForDb.__db) {
    globalForDb.__db = new Database(DB_PATH);
    globalForDb.__db.pragma('journal_mode = WAL');
    globalForDb.__db.pragma('foreign_keys = ON');
  }
  return globalForDb.__db;
}

// Run migrations on first load
function migrate() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'CUSTOMER',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      specs TEXT NOT NULL DEFAULT '{}',
      price REAL NOT NULL,
      compare_at REAL,
      images TEXT NOT NULL DEFAULT '[]',
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 99,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      shipping TEXT NOT NULL DEFAULT '{}',
      stripe_session_id TEXT UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);
}

migrate();

export const db = getDb();

// Helper: generate a simple ID
export function uid() {
  return 'xxxxxxxxxxxx'.replace(/x/g, () => Math.random().toString(36)[2] || '0');
}
