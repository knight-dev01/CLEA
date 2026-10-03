import { ARCHIVE_PHOTOS, type BlogPost, type MediaLink, type SiteImages } from './store';

export type EventItem = { id: string; title: string; title_it: string; date: string; time: string; location: string };

export type Content = {
  posts: BlogPost[];
  media: MediaLink[];
  events: EventItem[];
  settings: Record<string, string>;
};

const CACHE_KEY = 'clea-cms-cache';
const CACHE_TTL = 10 * 60 * 1000;

function readCache(): Content | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

/** Fetch shared content from /api/content; falls back to cache, then null (caller uses seed). */
export async function fetchContent(): Promise<Content | null> {
  const cached = readCache();
  try {
    const res = await fetch('/api/content');
    if (!res.ok) return cached;
    const data = (await res.json()) as Content;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    return data;
  } catch {
    return cached;
  }
}

export async function login(password: string): Promise<string | null> {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return null;
    const { token } = (await res.json()) as { token: string };
    sessionStorage.setItem('clea-token', token);
    return token;
  } catch {
    return null;
  }
}

export function adminToken(): string {
  return sessionStorage.getItem('clea-token') || '';
}

export async function manage(
  table: 'posts' | 'media' | 'events' | 'settings',
  action: 'upsert' | 'delete',
  row: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch('/api/manage', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-admin-token': adminToken() },
      body: JSON.stringify({ table, action, row }),
    });
    if (res.ok) localStorage.removeItem(CACHE_KEY);
    return res.ok;
  } catch {
    return false;
  }
}

export function contentToImages(settings: Record<string, string>, fallback: SiteImages): SiteImages {
  let gallery = fallback.gallery;
  try {
    if (settings.gallery) gallery = JSON.parse(settings.gallery);
  } catch { /* keep fallback */ }
  // Never let an archived/old photo (e.g. a past Christmas event) become the hero, even if
  // it's stored in settings from an earlier admin edit.
  const hero = settings.hero && !ARCHIVE_PHOTOS.includes(settings.hero) ? settings.hero : fallback.hero;
  return { hero, gallery };
}
