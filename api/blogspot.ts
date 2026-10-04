import { send, type VercelReq, type VercelRes } from './db.js';

const FEED = 'https://cleareggio.blogspot.com/feeds/posts/default?alt=json&max-results=20';

type FeedEntry = {
  id?: { $t?: string };
  title?: { $t?: string };
  published?: { $t?: string };
  content?: { $t?: string };
  summary?: { $t?: string };
};

function firstImage(html: string): string {
  const m = html.match(/https:\/\/blogger\.googleusercontent\.com[^"\s<>]+/);
  return m ? m[0].replace(/\/s\d+(-[^/]*)?\//, '/s1600/') : '';
}

function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Server-side Blogspot proxy: avoids JSONP, ad blockers and DNS issues on visitors' networks. */
export default async function handler(_req: VercelReq, res: VercelRes): Promise<void> {
  try {
    const r = await fetch(FEED, { headers: { accept: 'application/json' } });
    if (!r.ok) throw new Error(`Blogspot ${r.status}`);
    const data = (await r.json()) as { feed?: { entry?: FeedEntry[] } };
    const posts = (data.feed?.entry || []).map((e) => {
      const html = e.content?.$t || e.summary?.$t || '';
      const id = (e.id?.$t || '').split('.post-').pop() || Math.random().toString(36).slice(2);
      const title = e.title?.$t || 'Blogspot post';
      const body = textOf(html).slice(0, 2000);
      return { id: `bsp-${id}`, title, title_it: title, body, body_it: body, date: (e.published?.$t || '').slice(0, 10), imageUrl: firstImage(html) };
    });
    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400');
    send(res, { posts });
  } catch (e) {
    send(res, { error: 'Blogspot unavailable', detail: String(e).slice(0, 200) }, 502);
  }
}
