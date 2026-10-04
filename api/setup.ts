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
  try {
    const db = neon(url);
    await ensureSchema(db);
    send(res, { ok: true, message: 'Tables ready: posts, media, events, settings' });
  } catch (e) {
    send(res, { error: 'Setup failed', detail: String(e) }, 500);
  }
}
