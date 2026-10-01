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
  send(res, { ok: hasPostgres && hasAdminPassword && hasAdminSecret && !tableError, hasPostgres, hasAdminPassword, hasAdminSecret, dbVarNames, tables, tableError });
}
