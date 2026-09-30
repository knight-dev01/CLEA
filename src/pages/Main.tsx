import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { useSEO } from '../seo';
import { ensureSeed } from '../store';
import { useEffect, useState } from 'react';
import type { BlogPost, MediaLink, SiteImages } from '../store';

const MAP = 'https://www.google.com/maps?q=Via+Corelli+5+Reggio+Emilia+Italy&output=embed';
export const PASTORS = [
  { n: 'Apostle Babatope Ojo', r: 'Senior Pastor — Nigeria' },
  { n: 'Pastor Bola', r: 'Senior Pastor — Europe' },
  { n: 'Pastor Mololuwa', r: 'Board of Trustees' },
];

export function Home() {
  const { t, lang } = useLang();
  useSEO('CLEA Reggio Emilia | Christ Love Evangelical Assembly', 'CLEA — Christ Love Evangelical Assembly in Reggio Emilia Italy. Sunday services, Bible study, sermons. Chiesa evangelica a Reggio Emilia.');
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [media, setMedia] = useState<MediaLink[]>([]);
  const [images, setImages] = useState<SiteImages | null>(null);
  useEffect(() => {
    ensureSeed();
    try {
      setBlog(JSON.parse(localStorage.getItem('clea-blog') || '[]'));
      setMedia(JSON.parse(localStorage.getItem('clea-media') || '[]'));
      setImages(JSON.parse(localStorage.getItem('clea-images') || 'null'));
    } catch { /* ignore */ }
  }, []);
  return (<>
    <div className="hero">
      <img className="bg" src={images?.hero || 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=70&auto=format&fit=crop'} alt="Church" />
      <div className="shade" /><div className="txt">
        <span className="kicker">{t('heroKicker')}</span>
        <h1>{t('heroTitle')}</h1><p>{t('heroSub')}</p>
        <Link className="btn solid" to="/visit">{t('joinUs')}</Link>
        <Link className="btn ghost" to="/media">{t('watch')}</Link>
      </div>
    </div>
    <section className="sec"><h2>⛪ {t('serviceTimes')}</h2>
      <div className="grid g3">
        <div className="card"><span className="pill">SUN 10:00</span><h3>{t('sunday')}</h3><p className="muted">{t('address')}</p></div>
        <div className="card"><span className="pill">WED 18:30</span><h3>{t('wednesday')}</h3><p className="muted">Bible Study / Studio Biblico</p></div>
        <div className="card"><span className="pill">FRI 22:00</span><h3>{t('friday')}</h3><p className="muted">Night Vigil / Veglia di preghiera</p></div>
      </div>
    </section>
    <section className="sec"><h2>🎥 {t('latestSermons')} <Link to="/media" style={{ fontSize: '.85rem' }}>{t('viewAll')} →</Link></h2>
      <div className="grid g3">{media.slice(0, 3).map(m => <div className="card" key={m.id}><strong>{m.title}</strong><iframe className="vid" src={m.url} title={m.title} allowFullScreen loading="lazy" /></div>)}</div>
    </section>
    <section className="sec"><h2>✍️ {t('latestBlog')} <Link to="/blog" style={{ fontSize: '.85rem' }}>{t('viewAll')} →</Link></h2>
      <div className="grid g3">{blog.slice(0, 3).map(b => <div className="card" key={b.id}>{b.imageUrl && <img src={b.imageUrl} alt="" />}<h3>{lang === 'it' ? b.title_it || b.title : b.title}</h3><p className="muted">{(lang === 'it' ? b.body_it || b.body : b.body).slice(0, 110)}…</p><Link to="/blog">{t('readMore')} →</Link></div>)}</div>
    </section>
    <section className="sec"><h2>🤝 {t('pastors')}</h2>
      <div className="grid g3">{PASTORS.map(p => <div className="card pastor" key={p.n}><div className="avatar">{p.n[0]}</div><div><strong>{p.n}</strong><br /><span className="muted">{p.r}</span></div></div>)}</div>
    </section>
    <section className="sec"><h2>📍 Visit Us</h2><iframe className="map" src={MAP} title="CLEA Map" loading="lazy" /></section>
  </>);
}

export function About() {
  const { lang } = useLang();
  useSEO('About CLEA | Vision, Beliefs & Pastors', 'About Christ Love Evangelical Assembly Reggio Emilia: vision, beliefs, pastorate.');
  const en = lang === 'en';
  return (<div className="sec">
    <h1>{en ? 'About CLEA' : 'Chi Siamo'}</h1>
    <div className="card"><h3>👁 {en ? 'Vision' : 'Visione'}</h3><p>{en ? 'To preach Christ\u2019s love, raise disciples and serve our city — a multicultural family where everyone belongs.' : 'Predicare l\u2019amore di Cristo, formare discepoli e servire la città — una famiglia multiculturale dove tutti sono accolti.'}</p></div>
    <div className="card" style={{ marginTop: 14 }}><h3>📖 {en ? 'Beliefs' : 'Credo'}</h3><p>{en ? 'We believe the Bible is God\u2019s Word, salvation through Jesus Christ, the power of the Holy Spirit, water baptism and holy living.' : 'Crediamo che la Bibbia è la Parola di Dio, la salvezza tramite Gesù Cristo, la potenza dello Spirito Santo, il battesimo e la santità.'}</p></div>
    <h2 style={{ marginTop: 22 }}>🤝 {en ? 'Pastorate' : 'Pastori'}</h2>
    <div className="grid g3">{PASTORS.map(p => <div className="card pastor" key={p.n}><div className="avatar">{p.n[0]}</div><div><strong>{p.n}</strong><br /><span className="muted">{p.r}</span></div></div>)}</div>
  </div>);
}

export function Media() {
  useSEO('Sermons & Media | CLEA Reggio Emilia', 'Watch CLEA sermons: YouTube and Facebook videos from Reggio Emilia church.');
  const [media, setMedia] = useState<MediaLink[]>([]);
  useEffect(() => { try { setMedia(JSON.parse(localStorage.getItem('clea-media') || '[]')); } catch { /* */ } });
  return (<div className="sec"><h1>🎥 Sermons & Media</h1><p className="muted">YouTube & Facebook — updated by the media team via Admin.</p>
    <div className="grid g3">{media.map(m => <div className="card" key={m.id}><span className="pill">{m.type}</span><h3>{m.title}</h3><iframe className="vid" src={m.url} title={m.title} allowFullScreen loading="lazy" /></div>)}</div>
  </div>);
}

export function Blog() {
  const { lang } = useLang();
  useSEO('Blog | CLEA Reggio Emilia', 'CLEA church blog: devotionals, news and testimonies in English and Italian.');
  const [blog, setBlog] = useState<BlogPost[]>([]);
  useEffect(() => { try { setBlog(JSON.parse(localStorage.getItem('clea-blog') || '[]')); } catch { /* */ } });
  return (<div className="sec"><h1>✍️ Blog</h1><div className="grid g3">{blog.map(b => <article className="card" key={b.id}>{b.imageUrl && <img src={b.imageUrl} alt="" loading="lazy" />}<small className="muted">{b.date}</small><h3>{lang === 'it' ? b.title_it || b.title : b.title}</h3><p>{lang === 'it' ? b.body_it || b.body : b.body}</p></article>)}</div></div>);
}

export function Visit() {
  useSEO('Visit Us | CLEA Reggio Emilia — Service Times & Map', 'Visit CLEA: Via Corelli 5, Reggio Emilia. Sunday 10:00, Wednesday Bible Study, Friday Vigil. Map & directions.');
  const { t } = useLang();
  return (<div className="sec"><h1>📍 {t('visit')}</h1>
    <div className="card"><strong>{t('address')}</strong><p className="muted">🚌 Bus lines to Via Cilea · 🚗 Parking nearby · ♿ Accessible</p>
    <p><strong>Sunday:</strong> 10:00–12:30 · <strong>Wednesday:</strong> 18:30–20:00 · <strong>Friday:</strong> 22:00–02:00</p></div>
    <div style={{ marginTop: 14 }}><iframe className="map" title="CLEA Map" loading="lazy" src="https://www.google.com/maps?q=Via+Corelli+5+Reggio+Emilia+Italy&output=embed" /></div>
  </div>);
}

export function Contact() {
  useSEO('Contact CLEA Reggio Emilia', 'Contact CLEA church: phone, WhatsApp +39 351 140 8770, Nigeria +2348030401694, Reggio Emilia address.');
  return (<div className="sec"><h1>💬 Contact</h1><div className="grid g3">
    <div className="card"><h3>📞 Phone / WhatsApp</h3><p><a href="tel:+393511408770">+39 351 140 8770</a><br /><a href="tel:+2348030401694">+234 803 040 1694</a></p>
    <p><a className="btn solid" href="https://wa.me/393511408770">WhatsApp Us</a></p></div>
    <div className="card"><h3>✉️ Message</h3><form onSubmit={e => { e.preventDefault(); alert('Thank you! / Grazie! We will reply soon.'); }}><input required placeholder="Name / Nome" /><input required type="email" placeholder="Email" /><textarea rows={4} required placeholder="Message / Messaggio" /><button className="btn gold" type="submit">Send</button></form></div>
  </div></div>);
}
