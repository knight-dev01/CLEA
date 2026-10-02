import { neon } from '@neondatabase/serverless';
import { getDbUrl, send, type VercelReq, type VercelRes } from './db.js';

/**
 * One-time database setup. Visit:
 *   https://<your-domain>/api/setup?secret=<ADMIN_SECRET>
 * Creates all tables if missing. Safe to run multiple times.
 */
export default async function handler(req: VercelReq, res: VercelRes): Promise<void> {
  const secret = process.env.ADMIN_SECRET || '';
  const q = req.query ?? {};
  const provided = Array.isArray(q.secret) ? q.secret[0] : q.secret;
  if (!secret || provided !== secret) {
    send(res, { error: 'Unauthorized: pass ?secret=<ADMIN_SECRET>' }, 401);
    return;
  }
  const url = getDbUrl();
  if (!url) {
    send(res, { error: 'DB not configured' }, 503);
    return;
  }
  try {
    const db = neon(url);
    await db`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, title_it TEXT DEFAULT '',
      body TEXT DEFAULT '', body_it TEXT DEFAULT '', date TEXT DEFAULT '',
      image_url TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT NOW())`;
    await db`CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY, type TEXT NOT NULL, url TEXT NOT NULL,
      title TEXT DEFAULT '', ratio TEXT DEFAULT 'auto',
      created_at TIMESTAMPTZ DEFAULT NOW())`;
    await db`CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, title_it TEXT DEFAULT '',
      date TEXT DEFAULT '', time TEXT DEFAULT '', location TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW())`;
    await db`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
    send(res, { ok: true, message: 'Tables ready: posts, media, events, settings' });
  } catch (e) {
    send(res, { error: 'Setup failed', detail: String(e) }, 500);
  }
}
