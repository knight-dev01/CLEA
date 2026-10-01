import { neon } from '@neondatabase/serverless';
import { getDbUrl, isAuthed, send, type VercelReq, type VercelRes } from './db.js';

const TABLES = ['posts', 'media', 'events', 'settings'] as const;
type Table = (typeof TABLES)[number];

export default async function handler(req: VercelReq, res: VercelRes): Promise<void> {
  if (req.method !== 'POST') {
    send(res, { error: 'Method not allowed' }, 405);
    return;
  }
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret || !isAuthed(req, secret)) {
    send(res, { error: 'Unauthorized' }, 401);
    return;
  }
  const url = getDbUrl();
  if (!url) {
    send(res, { error: 'DB not configured' }, 503);
    return;
  }
  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}) as {
    table?: Table; action?: 'upsert' | 'delete'; row?: Record<string, string>;
  };
  if (!body.table || !TABLES.includes(body.table) || !body.action || !body.row) {
    send(res, { error: 'table, action, row required' }, 400);
    return;
  }
  try {
    const db = neon(url);
    const r = body.row;
    if (body.table === 'posts' && body.action === 'upsert') {
      await db`INSERT INTO posts (id,title,title_it,body,body_it,date,image_url)
        VALUES (${r.id},${r.title || ''},${r.title_it || ''},${r.body || ''},${r.body_it || ''},${r.date || ''},${r.imageUrl || ''})
        ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,title_it=EXCLUDED.title_it,body=EXCLUDED.body,body_it=EXCLUDED.body_it,date=EXCLUDED.date,image_url=EXCLUDED.image_url`;
    } else if (body.table === 'media' && body.action === 'upsert') {
      await db`INSERT INTO media (id,type,url,title,ratio)
        VALUES (${r.id},${r.type},${r.url},${r.title || ''},${r.ratio || 'auto'})
        ON CONFLICT (id) DO UPDATE SET type=EXCLUDED.type,url=EXCLUDED.url,title=EXCLUDED.title,ratio=EXCLUDED.ratio`;
    } else if (body.table === 'events' && body.action === 'upsert') {
      await db`INSERT INTO events (id,title,title_it,date,time,location)
        VALUES (${r.id},${r.title || ''},${r.title_it || ''},${r.date || ''},${r.time || ''},${r.location || ''})
        ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,title_it=EXCLUDED.title_it,date=EXCLUDED.date,time=EXCLUDED.time,location=EXCLUDED.location`;
    } else if (body.table === 'settings' && body.action === 'upsert') {
      await db`INSERT INTO settings (key,value) VALUES (${r.key},${r.value || ''})
        ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`;
    } else if (body.action === 'delete') {
      const id = r.id || r.key || '';
      if (body.table === 'settings') await db`DELETE FROM settings WHERE key=${id}`;
      else if (body.table === 'posts') await db`DELETE FROM posts WHERE id=${id}`;
      else if (body.table === 'media') await db`DELETE FROM media WHERE id=${id}`;
      else await db`DELETE FROM events WHERE id=${id}`;
    } else {
      send(res, { error: 'Unsupported action' }, 400);
      return;
    }
    send(res, { ok: true });
  } catch (e) {
    send(res, { error: 'DB error', detail: String(e) }, 500);
  }
}
