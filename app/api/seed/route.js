import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, uid } from '@/lib/db';
import productsData from '@/data/products.json';

export async function GET() {
  try {
    const adminPw = await bcrypt.hash('admin123', 10);

    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@oceanpearl.com');
    if (!existingAdmin) {
      db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(uid(), 'admin@oceanpearl.com', adminPw, 'Admin', 'ADMIN');
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get('user@test.com');
    if (!existingUser) {
      const custPw = await bcrypt.hash('user123', 10);
      db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(uid(), 'user@test.com', custPw, 'Test User', 'CUSTOMER');
    }

    const insert = db.prepare('INSERT OR IGNORE INTO products (id, slug, name, description, specs, price, compare_at, images, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    let count = 0;
    for (const p of productsData) {
      const result = insert.run(uid(), p.slug, JSON.stringify(p.name), JSON.stringify(p.description), JSON.stringify(p.specs), p.price, p.compareAt || null, JSON.stringify(p.images || []), p.category, 99);
      if (result.changes > 0) count++;
    }

    return NextResponse.json({ ok: true, users: existingAdmin ? 0 : 1, products: count });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
