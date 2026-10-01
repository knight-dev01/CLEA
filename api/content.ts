import { neon } from '@neondatabase/serverless';
import { send, type VercelReq, type VercelRes } from './db.js';

export default async function handler(_req: VercelReq, res: VercelRes): Promise<void> {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
  if (!url) {
    send(res, { error: 'DB not configured' }, 503);
    return;
  }
  try {
    const db = neon(url);
    const [posts, media, events, settings] = await Promise.all([
      db`SELECT id, title, title_it, body, body_it, date, image_url AS "imageUrl" FROM posts ORDER BY date DESC`,
      db`SELECT id, type, url, title, ratio FROM media ORDER BY created_at DESC`,
      db`SELECT id, title, title_it, date, time, location FROM events ORDER BY date ASC`,
      db`SELECT key, value FROM settings`,
    ]);
    const settingsObj: Record<string, string> = {};
    for (const row of settings as { key: string; value: string }[]) settingsObj[row.key] = row.value;
    send(res, { posts, media, events, settings: settingsObj });
  } catch (e) {
    send(res, { error: 'DB unavailable', detail: String(e) }, 503);
  }
}
