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

/** Accepts every common Postgres env name (Vercel Postgres, Neon, manual). */
export function getDbUrl(): string {
  const e = process.env;
  const direct =
    e.POSTGRES_URL || e.DATABASE_URL || e.NEON_DATABASE_URL ||
    e.POSTGRES_PRISMA_URL || e.POSTGRES_URL_NON_POOLING || '';
  if (direct) return direct;
  // Fallback: accept ANY env var whose value is a postgres connection string
  // (covers custom-prefixed integrations, e.g. POSGRES_*).
  for (const [k, v] of Object.entries(e)) {
    if (typeof v === 'string' && /^postgres(ql)?:\/\//i.test(v.trim()) && !/^ADMIN_/i.test(k)) return v.trim();
  }
  if (e.PGHOST && e.PGDATABASE && e.PGUSER) {
    const pass = e.PGPASSWORD ? `:${encodeURIComponent(e.PGPASSWORD)}` : '';
    const port = e.PGPORT || '5432';
    return `postgresql://${e.PGUSER}${pass}@${e.PGHOST}:${port}/${e.PGDATABASE}?sslmode=require`;
  }
  return '';
}

export function isAuthed(req: VercelReq, secret: string): boolean {
  const token = header(req, 'x-admin-token');
  return token ? verifyToken(token, secret) : false;
}

export function send(res: VercelRes, data: unknown, status = 200): void {
  res.status(status).json(data);
}

type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
let schemaReady = false;

/** Creates all tables if missing (idempotent; runs once per server instance). */
export async function ensureSchema(db: Sql): Promise<void> {
  if (schemaReady) return;
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
  schemaReady = true;
}
