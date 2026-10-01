import { send, signToken, type VercelReq, type VercelRes } from './db.js';

export default async function handler(req: VercelReq, res: VercelRes): Promise<void> {
  if (req.method !== 'POST') {
    send(res, { error: 'Method not allowed' }, 405);
    return;
  }
  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD || '';
  const secret = process.env.ADMIN_SECRET || '';
  if (!expected || !secret) {
    send(res, { error: 'Server not configured' }, 500);
    return;
  }
  if (body.password !== expected) {
    send(res, { error: 'Wrong password' }, 401);
    return;
  }
  send(res, { token: signToken(secret) });
}
