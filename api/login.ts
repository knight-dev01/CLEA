import { json, signToken } from './db.js';

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SECRET || '';
  if (!expected || !secret) return json({ error: 'Server not configured' }, 500);
  if (password !== expected) return json({ error: 'Wrong password' }, 401);
  return json({ token: signToken(secret) });
}
