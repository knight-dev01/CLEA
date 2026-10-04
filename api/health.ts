import { neon } from '@neondatabase/serverless';
import { getDbUrl, send, type VercelReq, type VercelRes } from './db.js';

/** Diagnostics (no secrets): visit /api/health to see what the server is missing. */
export default async function handler(_req: VercelReq, res: VercelRes): Promise<void> {
  const dbUrl = getDbUrl();
  const hasPostgres = !!dbUrl;
  const hasAdminPassword = !!process.env.ADMIN_PASSWORD;
  const hasAdminSecret = !!process.env.ADMIN_SECRET;
  const dbVarNames = Object.keys(process.env).filter((k) => /POSTGRES|DATABASE|NEON|^PG(HOST|DATABASE|USER|PASSWORD|PORT)$/.test(k));
  let tables: string[] | null = null;
  let tableError: string | null = null;
  if (hasPostgres) {
    try {
      const db = neon(dbUrl);
      const rows = (await db`SELECT tablename FROM pg_tables WHERE schemaname='public'`) as { tablename: string }[];
      tables = rows.map((r) => r.tablename);
    } catch (e) {
      tableError = String(e).slice(0, 200);
    }
  }
  // Which connection-string variables point at a database that already has tables (names only, no values).
  const candidates: Record<string, string[] | string> = {};
  const seen = new Set<string>();
  for (const [k, v] of Object.entries(process.env)) {
    if (typeof v !== 'string' || !/^postgres(ql)?:\/\//i.test(v.trim()) || /^ADMIN_/i.test(k) || seen.has(v.trim())) continue;
    seen.add(v.trim());
    try {
      const rows = (await neon(v.trim())`SELECT tablename FROM pg_tables WHERE schemaname='public'`) as { tablename: string }[];
      candidates[k] = rows.map((r) => r.tablename);
    } catch (e) {
      candidates[k] = String(e).slice(0, 80);
    }
  }
  send(res, { ok: hasPostgres && hasAdminPassword && hasAdminSecret && !tableError, hasPostgres, hasAdminPassword, hasAdminSecret, dbVarNames, tables, tableError, candidates });
}
