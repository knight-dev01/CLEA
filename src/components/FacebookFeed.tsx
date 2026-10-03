import { useState } from 'react';
import { FacebookIcon } from '../icons';
import { SOCIALS } from '../store';

/**
 * Click-to-load facade for the Facebook Page plugin.
 * Facebook's SDK throws noisy console errors and blocks the main thread,
 * so we only load the live feed when the visitor asks for it.
 */
const PAGE_PLUGIN =
  'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F1806488646340376&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true';

export default function FacebookFeed({ src = PAGE_PLUGIN, title = 'Christ Love Evangelical Assembly latest Facebook posts' }: { src?: string; title?: string }) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) {
    return (
      <div className="fb-embed" style={{ marginTop: 12 }}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="fullscreen; encrypted-media; picture-in-picture"
        />
      </div>
    );
  }
  return (
    <div className="fb-facade" style={{ marginTop: 12 }}>
      <span className="fb-facade-icon"><FacebookIcon size={34} /></span>
      <p><strong>See our latest posts & videos</strong><br /><span className="muted">1.1K followers · loads the live Facebook feed</span></p>
      <div className="rowbtns" style={{ justifyContent: 'center' }}>
        <button className="btn solid" onClick={() => setLoaded(true)}>Load Facebook feed</button>
        <a className="btn ghost" href={SOCIALS.facebookPage} target="_blank" rel="noreferrer">Open Facebook</a>
      </div>
    </div>
  );
}
