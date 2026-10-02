import { useEffect } from 'react';

export const SITE_URL = 'https://www.clea1.com';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`;
  let m = document.head.querySelector<HTMLMetaElement>(sel);
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute(attr, key);
    document.head.appendChild(m);
  }
  m.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let l = document.head.querySelector<HTMLLinkElement>(sel);
  if (!l) {
    l = document.createElement('link');
    l.setAttribute('rel', rel);
    if (hreflang) l.setAttribute('hreflang', hreflang);
    document.head.appendChild(l);
  }
  l.setAttribute('href', href);
}

/** Full per-page SEO: title, description, canonical, OG/Twitter, EN/IT hreflang. */
export function useSEO(title: string, description: string, path = '/', noindex = false) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setLink('canonical', url);
    setLink('alternate', url, 'en');
    setLink('alternate', url, 'it');
    setLink('alternate', url, 'x-default');
  }, [title, description, path, noindex]);
}
