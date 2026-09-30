import { neon } from '@neondatabase/serverless';
import { isAuthed, json } from './db.js';

const TABLES = ['posts', 'media', 'events', 'settings'] as const;
type Table = (typeof TABLES)[number];

export async function POST(req: Request) {
  const secret = process.env.ADMIN_SECRET || '';
  if (!secret || !isAuthed(req, secret)) return json({ error: 'Unauthorized' }, 401);
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
  if (!url) return json({ error: 'DB not configured' }, 503);
  const body = (await req.json().catch(() => ({}))) as {
    table?: Table; action?: 'upsert' | 'delete'; row?: Record<string, string>;
  };
  if (!body.table || !TABLES.includes(body.table) || !body.action || !body.row) {
    return json({ error: 'table, action, row required' }, 400);
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
      return json({ error: 'Unsupported action' }, 400);
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: 'DB error', detail: String(e) }, 500);
  }
}
