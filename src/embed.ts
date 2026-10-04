/** Turns any pasted YouTube link (watch, youtu.be, shorts, live, embed, playlist) into an embeddable URL. */
export function toEmbed(url: string): string {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^(www|m)\./, '');
    let id = '';
    if (host === 'youtu.be') id = u.pathname.slice(1);
    else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname === '/watch') id = u.searchParams.get('v') || '';
      else id = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/)?.[1] || '';
      const list = u.searchParams.get('list');
      if (!id && list) return `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(list)}`;
    }
    if (id) return `https://www.youtube.com/embed/${id.split(/[?&/]/)[0]}?rel=0`;
  } catch { /* not a URL: use as-is */ }
  return url;
}
