import type { BlogPost } from './store';

const FEED = 'https://cleareggio.blogspot.com/feeds/posts/default?alt=json-in-script&max-results=10';
const CACHE_KEY = 'clea-blogspot-cache';
const CACHE_TTL = 15 * 60 * 1000;

type FeedEntry = {
  id?: { $t?: string };
  title?: { $t?: string };
  published?: { $t?: string };
  content?: { $t?: string };
};

declare global {
  interface Window { __cleaBlogspot?: (data: { feed?: { entry?: FeedEntry[] } }) => void }
}

function firstImage(html: string): string {
  const m = html.match(/https:\/\/blogger\.googleusercontent\.com[^"\s<>]+/);
  if (!m) return '';
  return m[0].replace(/\/s\d+(-[^/]*)?\//, '/s1600/');
}

function textOf(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function readCache(): BlogPost[] | null {
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

/** Fetch public Blogspot posts via JSONP (cross-origin safe). Never throws. */
export function fetchBlogspot(): Promise<BlogPost[]> {
  const cached = readCache();
  return new Promise((resolve) => {
    let done = false;
    const finish = (posts: BlogPost[]) => {
      if (done) return;
      done = true;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: posts }));
      } catch { /* ignore */ }
      resolve(posts);
    };
    const timer = window.setTimeout(() => finish(cached || []), 8000);
    try {
      window.__cleaBlogspot = (data) => {
        window.clearTimeout(timer);
        const entries = data?.feed?.entry || [];
        const posts: BlogPost[] = entries.map((e) => {
          const html = e.content?.$t || '';
          const id = (e.id?.$t || Math.random().toString(36).slice(2)).split('.post-').pop() || 'x';
          return {
            id: `bsp-${id}`,
            title: e.title?.$t || 'Blogspot post',
            title_it: e.title?.$t || 'Blogspot post',
            body: textOf(html).slice(0, 2000),
            body_it: textOf(html).slice(0, 2000),
            date: (e.published?.$t || '').slice(0, 10),
            imageUrl: firstImage(html),
          };
        });
        finish(posts);
      };
      const s = document.createElement('script');
      s.src = `${FEED}&callback=__cleaBlogspot`;
      s.onerror = () => {
        window.clearTimeout(timer);
        finish(cached || []);
      };
      document.head.appendChild(s);
      window.setTimeout(() => s.remove(), 10000);
    } catch {
      window.clearTimeout(timer);
      finish(cached || []);
    }
  });
}

/** Admin/DB posts first, then Blogspot posts (deduped by id). */
export async function withBlogspot(posts: BlogPost[]): Promise<BlogPost[]> {
  try {
    const extra = await fetchBlogspot();
    const ids = new Set(posts.map((p) => p.id));
    return [...posts, ...extra.filter((p) => !ids.has(p.id))];
  } catch {
    return posts;
  }
}
