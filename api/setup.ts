import { neon } from '@neondatabase/serverless';
import { ensureSchema, getDbUrl, send, type VercelReq, type VercelRes } from './db.js';

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
  const DEFAULT_HERO = 'photos/worship-01.jpeg';
  const DEFAULT_GALLERY = [
    'photos/worship-01.jpeg',
    'photos/worship-12.jpeg',
    'photos/worship-03.jpeg',
    'photos/worship-07.jpeg',
    'photos/worship-05.jpeg',
    'photos/worship-02.jpeg',
    'photos/worship-04.jpeg',
    'photos/worship-06.jpeg',
    'photos/worship-08.jpeg',
    'photos/worship-09.jpeg',
    'photos/worship-10.jpeg',
    'photos/worship-13.jpeg',
  ];
  try {
    const db = neon(url);
    await ensureSchema(db);
    const existing = (await db`SELECT key FROM settings WHERE key IN ('hero','gallery')`) as { key: string }[];
    const have = new Set(existing.map((r) => r.key));
    if (!have.has('hero')) await db`INSERT INTO settings (key,value) VALUES ('hero',${DEFAULT_HERO})`;
    if (!have.has('gallery')) await db`INSERT INTO settings (key,value) VALUES ('gallery',${JSON.stringify(DEFAULT_GALLERY)})`;
    const seeded = { hero: !have.has('hero'), gallery: !have.has('gallery') };
    send(res, { ok: true, message: 'Tables ready: posts, media, events, settings', seededImages: seeded });
  } catch (e) {
    send(res, { error: 'Setup failed', detail: String(e) }, 500);
  }
}
