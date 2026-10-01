import { createHmac, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL = 1000 * 60 * 60 * 12; // 12h

export type VercelReq = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
};

export type VercelRes = {
  status: (code: number) => VercelRes;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

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

function header(req: VercelReq, name: string): string {
  const v = req.headers[name.toLowerCase()] ?? req.headers[name];
  return Array.isArray(v) ? v[0] ?? '' : v ?? '';
}

export function isAuthed(req: VercelReq, secret: string): boolean {
  const token = header(req, 'x-admin-token');
  return token ? verifyToken(token, secret) : false;
}

export function send(res: VercelRes, data: unknown, status = 200): void {
  res.status(status).json(data);
}
