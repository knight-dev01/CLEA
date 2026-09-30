import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL = 1000 * 60 * 60 * 12; // 12h

export function signToken(secret: string): string {
  const exp = Date.now() + TOKEN_TTL;
  const sig = createHmac('sha256', secret).update(String(exp)).digest('hex');
  return `${exp}.${sig}`;
}

export function verifyToken(token: string, secret: string): boolean {
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!exp || !sig || Date.now() > exp) return false;
  const good = createHmac('sha256', secret).update(String(exp)).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(good));
  } catch {
    return false;
  }
}

export function isAuthed(req: Request, secret: string): boolean {
  const token = req.headers.get('x-admin-token') || '';
  return token ? verifyToken(token, secret) : false;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
