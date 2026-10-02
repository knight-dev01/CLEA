import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { useSEO } from '../seo';
import { ensureSeed, REAL_GALLERY, seedBlog, seedMedia } from '../store';

function mergeUnique<T extends { id: string }>(primary: T[], fallback: T[]): T[] {
  const ids = new Set(primary.map((p) => p.id));
  return [...primary, ...fallback.filter((p) => !ids.has(p.id))];
}
import { useEffect, useState } from 'react';
import type { BlogPost, MediaLink, SiteImages } from '../store';
import { ChurchIcon, VideoIcon, BookIcon, UsersIcon, PinIcon, PhoneIcon, MailIcon } from '../icons';
import { useReveal } from '../hooks';
import { verseOfDay } from '../verse';
import { fetchContent, contentToImages, type EventItem } from '../cms';
import { useMemo } from 'react';
import YouTubeUploads from '../components/YouTubeUploads';
import FacebookFeed from '../components/FacebookFeed';
import { withBlogspot } from '../blogspot';
import { summarize } from '../summarize';
import { Reveal, Stagger, StaggerItem, PhotoBand } from '../anim';

const MAP = 'https://www.google.com/maps?q=Via+Corelli+5+Reggio+Emilia+Italy&output=embed';
export const PASTORS = [
  { n: 'Apostle Babatope Olusegun Ojo', r: 'Senior Pastor, Nigeria', img: 'pastor-babatope.jpg' },
  { n: 'Pastor Dr Bolanle Oluwakemi Anyanwu', r: 'Senior Pastor, Europe', img: 'pastor-bola.jpg' },
  { n: 'Pastor Mololuwa Patience Ojo', r: 'Board of Trustees', img: 'pastor-mololuwa.jpg' },
];

export function SummaryToggle({ text, lang }: { text: string; lang: string }) {
  const [open, setOpen] = useState(false);
  const body = lang === 'it' ? text : text;
  const sentences = body.match(/[^.!?\n]+[.!?]+/g) || [];
  if (sentences.length <= 3) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <button className="smallbtn" onClick={() => setOpen(!open)}>
        {open ? (lang === 'it' ? 'Nascondi riassunto' : 'Hide AI summary') : (lang === 'it' ? 'Riassunto AI' : 'AI summary')}
      </button>
      {open && <p className="muted" style={{ fontStyle: 'italic', borderLeft: '3px solid var(--gold)', paddingLeft: 12 }}>{summarize(body)}</p>}
    </div>
  );
}

export function Home() {
  const { t, lang } = useLang();
  useSEO('Christ Love Evangelical Assembly Reggio Emilia', 'Christ Love Evangelical Assembly in Reggio Emilia Italy. Sunday services, Bible study, sermons. Chiesa evangelica a Reggio Emilia.', '/');
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [media, setMedia] = useState<MediaLink[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [images, setImages] = useState<SiteImages | null>(null);
  useReveal();
  const verse = useMemo(verseOfDay, []);
  useEffect(() => {
    ensureSeed();
    fetchContent().then(async (c) => {
      if (c) {
        setBlog(await withBlogspot(mergeUnique(c.posts, seedBlog)));
        setMedia(mergeUnique(c.media, seedMedia));
        setEvents(c.events);
        setImages(contentToImages(c.settings, {
          hero: REAL_GALLERY[0],
          gallery: REAL_GALLERY,
        }));
        return;
      }
      try {
        const localBlog = JSON.parse(localStorage.getItem('clea-blog') || '[]') as BlogPost[];
        setBlog(await withBlogspot(mergeUnique(localBlog.length ? localBlog : seedBlog, seedBlog)));
        const localMedia = JSON.parse(localStorage.getItem('clea-media') || '[]') as MediaLink[];
        setMedia(mergeUnique(localMedia.length ? localMedia : seedMedia, seedMedia));
        setEvents(JSON.parse(localStorage.getItem('clea-events') || '[]'));
        setImages(JSON.parse(localStorage.getItem('clea-images') || 'null'));
      } catch { /* ignore */ }
    });
  }, []);
  return (<>
    <div className="hero">
      <img className="bg" src={images?.hero || REAL_GALLERY[0]} alt="Christ Love Evangelical Assembly celebration" />
      <div className="shade" /><div className="txt">
        <span className="kicker">{t('heroKicker')}</span>
        <h1>{t('heroTitle')}</h1><p>{t('heroSub')}</p>
        <Link className="btn solid" to="/visit">{t('joinUs')}</Link>
        <Link className="btn ghost" to="/media">{t('watch')}</Link>
      </div>
    </div>
    <div className="ticker" aria-hidden="true"><div className="ticker-track">{[0, 1].map((k) => <span key={k}>SUNDAY 10:00 · WEDNESDAY 18:30 · FRIDAY 22:00 · REGGIO EMILIA · {t('tagline')} · </span>)}</div></div>
    <Reveal className="sec"><div className="editorial"><span className="eyebrow">{lang === 'it' ? 'Chi Siamo' : 'Who We Are'}</span><p className="lead">“{t('tagline')}”</p><p>{t('aboutLong')}</p></div></Reveal>
    <section className="sec"><Stagger className="stats">
      <StaggerItem className="stat"><b>296</b><span>{t('statsVideos')}</span></StaggerItem>
      <StaggerItem className="stat"><b>1.1K</b><span>{t('statsFollowers')}</span></StaggerItem>
      <StaggerItem className="stat"><b>2</b><span>{t('statsCities')}</span></StaggerItem>
      <StaggerItem className="stat"><b>10+</b><span>{t('statsYears')}</span></StaggerItem>
    </Stagger></section>
    <Reveal className="sec"><PhotoBand src={REAL_GALLERY[1]} label={lang === 'it' ? 'Celebrazione · Reggio Emilia' : 'Celebration · Reggio Emilia'} /></Reveal>
    <section className="sec reveal"><h2 className="h-icon"><VideoIcon /> {t('featured')}</h2>
      <div className="featured"><YouTubeUploads />
        <div className="featured-cap"><div><strong>{t('latestSermons')}</strong><br /><span className="muted">296 videos · YouTube & Facebook</span></div>
        <Link className="btn solid" to="/media">{t('watchCta')}</Link></div></div>
      {media.length > 0 && (<div className="grid g3" style={{ marginTop: 14 }}>{media.slice(0, 2).map(m => <div className="card" key={m.id}><strong>{m.title}</strong>{m.type === 'facebook' ? <FacebookFeed /> : <div className="vid-wrap"><iframe src={m.url} title={m.title} allowFullScreen loading="lazy" referrerPolicy="no-referrer" allow="fullscreen; encrypted-media; picture-in-picture" /></div>}</div>)}</div>)}
    </section>
    <section className="sec reveal"><div className="card verse-card"><span className="kicker">Verse of the day · Versetto del giorno</span><h2 style={{ margin: '10px 0 4px' }}>{lang === 'it' ? verse.it : verse.en}</h2></div></section>
    <section className="sec reveal"><h2 className="h-icon"><ChurchIcon /> {t('serviceTimes')}</h2>
      <div className="grid g3 svc">
        <div className="card"><span className="pill">SUN 10:00</span><h3>{t('sunday')}</h3><p className="muted">{t('address')}</p></div>
        <div className="card"><span className="pill">WED 18:30</span><h3>{t('wednesday')}</h3><p className="muted">Bible Study / Studio Biblico</p></div>
        <div className="card"><span className="pill">FRI 22:00</span><h3>{t('friday')}</h3><p className="muted">Night Vigil / Veglia di preghiera</p></div>
      </div>
    </section>
    <section className="sec reveal"><h2 className="h-icon"><BookIcon /> {t('gallery')}</h2>
      <div className="gallery-strip auto">{(() => { const list = images?.gallery?.length ? images.gallery : REAL_GALLERY; const loop = [...list, ...list]; return (<div className="marquee">{loop.map((g, i) => <figure className="photo-card" key={i} aria-hidden={i >= list.length}><img src={g} alt={i < list.length ? 'Life at Christ Love Evangelical Assembly' : ''} loading="lazy" /></figure>)}</div>); })()}</div>
    </section>
    <Reveal className="sec"><PhotoBand src={REAL_GALLERY[4]} label={lang === 'it' ? 'Vita in Chiesa' : 'Life at Church'} /></Reveal>
    <section className="sec reveal"><div className="cta-band"><div className="cta-inner"><span className="kicker">Reggio Emilia · Italia</span><h2>{t('planTitle')}</h2><p>{t('planSub')}</p>
      <div className="cta-pills"><span>SUN 10:00</span><span>WED 18:30</span><span>FRI 22:00</span></div>
      <div><Link className="btn gold" to="/visit">{t('joinUs')}</Link><Link className="btn ghost" to="/about">{t('aboutCta')}</Link></div></div></div></section>
    <section className="sec reveal"><h2 className="h-icon"><BookIcon /> {t('latestBlog')} <Link to="/blog" style={{ fontSize: '.85rem' }}>{t('viewAll')} →</Link></h2>
      {blog.length > 0 ? (
      <div className="grid g3">{blog.slice(0, 3).map(b => <div className="card" key={b.id}>{b.imageUrl && <img src={b.imageUrl} alt="" />}<h3>{lang === 'it' ? b.title_it || b.title : b.title}</h3><p className="muted">{(lang === 'it' ? b.body_it || b.body : b.body).slice(0, 110)}…</p><Link to="/blog">{t('readMore')} →</Link></div>)}</div>
      ) : (
      <div className="card"><p className="muted">{lang === 'it' ? 'Nuovi articoli in arrivo: nel frattempo leggi il nostro Blogspot.' : 'Fresh stories on the way: meanwhile read our Blogspot.'}</p><div><a className="btn solid" href="https://cleareggio.blogspot.com/" target="_blank" rel="noreferrer">Blogspot</a></div></div>
      )}
    </section>
    <section className="sec reveal"><h2 className="h-icon"><UsersIcon /> {t('pastors')}</h2>
      <div className="grid g3">{PASTORS.map(p => <div className="card pastor" key={p.n}>{'img' in p && p.img ? <img className="pastor-photo" src={p.img} alt={p.n} loading="lazy" /> : <div className="avatar">{p.n[0]}</div>}<div><strong>{p.n}</strong><br /><span className="muted">{p.r}</span></div></div>)}</div>
    </section>
    <section className="sec reveal"><h2 className="h-icon"><PinIcon /> {t('locations')}</h2>
      <div className="grid g3">
        <div className="card location"><span className="pill">IT · +39 351 140 8770</span><h3>{t('italyBase')}</h3><p className="muted">{t('italyAddr')}</p><p>{t('italyLead')}</p><p className="muted">{t('italySvc')}</p><Link className="btn solid" to="/visit">{t('visitCta')}</Link></div>
        <div className="card location"><span className="pill">NG · +234 803 040 1694</span><h3>{t('nigeriaBase')}</h3><p className="muted">{t('nigeriaAddr')}</p><p>{t('nigeriaLead')}</p><p className="muted">{t('nigeriaSvc')}</p><a className="btn ghost" href="https://wa.me/2348030401694">WhatsApp Nigeria</a></div>
      </div>
    </section>
    {events.length > 0 && (<section className="sec reveal band" style={{ borderRadius: 18, padding: 18 }}><h2 className="h-icon"><UsersIcon /> {lang === 'it' ? 'Prossimi Eventi' : 'Upcoming Events'}</h2>
      <div className="grid g3">{events.slice(0, 3).map((ev) => <div className="card" key={ev.id}><span className="pill">{ev.date}{ev.time ? ` · ${ev.time}` : ''}</span><h3>{lang === 'it' ? ev.title_it || ev.title : ev.title}</h3>{ev.location && <p className="muted">{ev.location}</p>}</div>)}</div>
    </section>)}
    <section className="sec reveal"><h2 className="h-icon"><PinIcon /> Visit Us</h2><div className="map-wrap"><iframe className="map" src={MAP} title="Christ Love Evangelical Assembly map" loading="lazy" /></div></section>
  </>);
}

export function About() {
  const { lang } = useLang();
  useSEO('About Christ Love Evangelical Assembly | Vision, Beliefs & Pastors', 'About Christ Love Evangelical Assembly Reggio Emilia: vision, beliefs, pastorate.', '/about');
  const en = lang === 'en';
  const { t } = useLang();
  return (<div className="sec">
    <h1>{en ? 'About Christ Love Evangelical Assembly' : 'Chi Siamo'}</h1>
    <p className="muted">{t('aboutLong')}</p>
    <p className="muted">{t('hqNote')}</p>
    <div className="editorial" style={{ marginTop: 18 }}>
      <span className="eyebrow">{en ? 'Vision' : 'Visione'}</span>
      <p className="lead">{en ? 'To preach Christ\u2019s love, raise disciples and serve our city.' : 'Predicare l\u2019amore di Cristo, formare discepoli e servire la città.'}</p>
      <p>{en ? 'A multicultural family where everyone belongs.' : 'Una famiglia multiculturale dove tutti sono accolti.'}</p>
    </div>
    <div className="editorial">
      <span className="eyebrow">{t('mission')}</span>
      <p>{t('missionText')}</p>
    </div>
    <div className="editorial">
      <span className="eyebrow">{t('beliefs')}</span>
      <p>{en ? 'We believe the Bible is God\u2019s Word, salvation through Jesus Christ, the power of the Holy Spirit, water baptism and holy living.' : 'Crediamo che la Bibbia è la Parola di Dio, la salvezza tramite Gesù Cristo, la potenza dello Spirito Santo, il battesimo e la santità.'}</p>
    </div>
    <h2 className="h-icon" style={{ marginTop: 26 }}><UsersIcon /> {en ? 'Pastorate' : 'Pastori'}</h2>
    <div className="grid g3">{PASTORS.map(p => <div className="card pastor" key={p.n}>{'img' in p && p.img ? <img className="pastor-photo" src={p.img} alt={p.n} loading="lazy" /> : <div className="avatar">{p.n[0]}</div>}<div><strong>{p.n}</strong><br /><span className="muted">{p.r}</span></div></div>)}</div>
    <div className="card" style={{ marginTop: 16 }}><h3 className="h-icon"><UsersIcon /> {t('trustees')}</h3>
      <ul className="trustees"><li>Pastor Mololuwa Patience Ojo</li><li>Mr. Ibukun Olaniyi Ojo</li><li>Mr. Michael Kayode Alabi</li><li>Pastor Bolanle Oluwakemi Anyanwu</li></ul>
      <p className="muted">{en ? 'Associate Pastor: Assistant Pastor Ekundayo Olusanjo Oginni · Church Secretary: Brother Emmanuel Akinwunmi' : 'Pastore associato: Ekundayo Olusanjo Oginni · Segretario: Emmanuel Akinwunmi'}</p></div>
  </div>);
}

export function Media() {
  useSEO('Sermons & Media | Christ Love Evangelical Assembly Reggio Emilia', 'Watch Christ Love Evangelical Assembly sermons: YouTube and Facebook videos from Reggio Emilia church.', '/media');
  const [media, setMedia] = useState<MediaLink[]>([]);
  useEffect(() => {
    fetchContent().then((c) => {
      if (c && c.media.length) { setMedia(mergeUnique(c.media, seedMedia)); return; }
      try {
        const local = JSON.parse(localStorage.getItem('clea-media') || '[]') as MediaLink[];
        setMedia(mergeUnique(local.length ? local : seedMedia, seedMedia));
      } catch { /* */ }
    });
  }, []);
  return (<div className="sec"><h1 className="h-icon"><VideoIcon /> Sermons & Media</h1>
    <div className="card channel-banner"><div><strong>Christ Love Evangelical Assembly Reggio Emilia</strong><p className="muted">296 videos · Pastor Dr Bolanle Oluwakemi Anyanwu</p></div>
      <div className="rowbtns"><a className="btn solid" href="https://www.youtube.com/@pastordoctorbolanleoluwake3805" target="_blank" rel="noreferrer">Watch on YouTube</a>
      <a className="btn ghost" href="https://www.youtube.com/@pastordoctorbolanleoluwake3805?sub_confirmation=1" target="_blank" rel="noreferrer">Subscribe</a></div></div>
    <div className="card" style={{ marginBottom: 20 }}><span className="pill">Latest uploads · auto-updates</span>
      <YouTubeUploads /></div>
    <div className="card" style={{ marginBottom: 20 }}><span className="pill">Latest from Facebook · auto-updates</span>
      <FacebookFeed />
      <div className="rowbtns"><a className="btn solid" href="https://www.facebook.com/1806488646340376/videos" target="_blank" rel="noreferrer">Watch Facebook videos</a><a className="btn ghost" href="https://www.facebook.com/1806488646340376" target="_blank" rel="noreferrer">Follow on Facebook · 1.1K</a></div></div>
    <p className="muted">YouTube and Facebook: new videos added by the media team via Admin.</p>
    <div className="grid g3">{media.map(m => <div className="card" key={m.id}><span className="pill">{m.type}</span><h3>{m.title}</h3>{m.type === 'facebook' ? <FacebookFeed src={m.url} title={m.title} /> : <div className="vid-wrap"><iframe src={m.url} title={m.title} allowFullScreen loading="lazy" referrerPolicy="no-referrer" allow="fullscreen; encrypted-media; picture-in-picture" /></div>}</div>)}</div>
  </div>);
}

export function Blog() {
  const { lang } = useLang();
  useSEO('Blog | Christ Love Evangelical Assembly Reggio Emilia', 'Christ Love Evangelical Assembly church blog: devotionals, news and testimonies in English and Italian.', '/blog');
  const [blog, setBlog] = useState<BlogPost[]>([]);
  useEffect(() => {
    fetchContent().then(async (c) => {
      const base = c && c.posts.length ? c.posts : seedBlog;
      try {
        setBlog(mergeUnique(base, seedBlog));
        setBlog(await withBlogspot(mergeUnique(base, seedBlog)));
      } catch { /* */ }
    });
  }, []);
  return (<div className="sec"><h1 className="h-icon"><BookIcon /> Blog</h1><p className="muted">Admin posts plus automatic updates from our <a href="https://cleareggio.blogspot.com/" target="_blank" rel="noreferrer">Blogspot</a>.</p><div className="grid g3">{blog.map(b => <article className="card" key={b.id}>{b.imageUrl && <img src={b.imageUrl} alt="" loading="lazy" />}<small className="muted">{b.date}</small><h3>{lang === 'it' ? b.title_it || b.title : b.title}</h3><p>{lang === 'it' ? b.body_it || b.body : b.body}</p><SummaryToggle text={lang === 'it' ? b.body_it || b.body : b.body} lang={lang} /></article>)}</div></div>);
}

export function Visit() {
  useSEO('Visit Us | Christ Love Evangelical Assembly Reggio Emilia, Service Times and Map', 'Visit Christ Love Evangelical Assembly: Via Corelli 5, Reggio Emilia. Sunday 10:00, Wednesday Bible Study, Friday Vigil. Map & directions.', '/visit');
  const { t } = useLang();
  return (<div className="sec"><h1 className="h-icon"><PinIcon /> {t('visit')}</h1>
    <div className="card"><strong>{t('address')}</strong><p className="muted">Bus lines to Via Cilea · Parking nearby · Accessible entrance</p>
    <div className="rowbtns"><a className="btn solid" href="https://www.google.com/maps?q=Via+Corelli+5+Reggio+Emilia+Italy" target="_blank" rel="noreferrer">{t('visitCta')}</a>
    <a className="btn ghost" href="https://wa.me/393511408770">WhatsApp Us</a></div></div>
    <h2 style={{ marginTop: 22 }}>{t('serviceTable')}</h2>
    <div className="table-scroll"><table className="svc-table"><tbody>
      <tr><td><strong>Sunday</strong><br /><span className="muted">Domenica</span></td><td>10:00–12:30</td><td>{t('sunday')}</td></tr>
      <tr><td><strong>Wednesday</strong><br /><span className="muted">Mercoledì</span></td><td>18:30–20:00</td><td>{t('wednesday')}</td></tr>
      <tr><td><strong>Friday</strong><br /><span className="muted">Venerdì</span></td><td>22:00–02:00</td><td>{t('friday')}</td></tr>
    </tbody></table></div>
    <h2 style={{ marginTop: 22 }}>{t('expect')}</h2>
    <div className="steps"><div className="step"><b>1</b><strong>{t('expect1')}</strong></div><div className="step"><b>2</b><strong>{t('expect2')}</strong></div><div className="step"><b>3</b><strong>{t('expect3')}</strong></div></div>
    <div style={{ marginTop: 14 }}><iframe className="map" title="Christ Love Evangelical Assembly map" loading="lazy" src="https://www.google.com/maps?q=Via+Corelli+5+Reggio+Emilia+Italy&output=embed" /></div>
    <h2 style={{ marginTop: 22 }}>{t('locations')}</h2>
    <div className="grid g3">
      <div className="card location"><span className="pill">IT</span><h3>{t('italyBase')}</h3><p className="muted">{t('italyAddr')}</p><p>{t('italyLead')}</p></div>
      <div className="card location"><span className="pill">NG</span><h3>{t('nigeriaBase')}</h3><p className="muted">{t('nigeriaAddr')}</p><p>{t('nigeriaLead')}</p></div>
    </div>
  </div>);
}

export function NotFound() {
  const { lang } = useLang();
  useSEO('Page not found | Christ Love Evangelical Assembly', 'This page does not exist.');
  return (<div className="sec" style={{ textAlign: 'center', padding: '40px 0' }}>
    <p className="kicker" style={{ borderColor: 'var(--gold)', color: 'var(--sage-d)' }}>404</p>
    <h1>{lang === 'it' ? 'Pagina non trovata' : 'Page not found'}</h1>
    <p className="muted">{lang === 'it' ? 'La pagina che cerchi non esiste o è stata spostata.' : 'The page you are looking for does not exist or was moved.'}</p>
    <div className="rowbtns" style={{ justifyContent: 'center' }}>
      <Link className="btn solid" to="/">Home</Link>
      <Link className="btn ghost" to="/media">{lang === 'it' ? 'Predicazioni' : 'Sermons'}</Link>
    </div>
  </div>);
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const subject = encodeURIComponent(`Website message from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom ${name} (${email})`);
      window.location.href = `mailto:christloveevangelicalassembly@gmail.com?subject=${subject}&body=${body}`;
      setSent(true);
    }}>
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name / Nome" autoComplete="name" />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" />
      <textarea rows={4} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message / Messaggio" />
      <button className="btn gold" type="submit">Send</button>
      {sent && <p className="muted">Opening your email app… / Grazie! We will reply soon.</p>}
      <p className="muted">Prefer WhatsApp? <a href="https://wa.me/393511408770">+39 351 140 8770</a></p>
    </form>
  );
}

export function Contact() {
  useSEO('Contact Christ Love Evangelical Assembly Reggio Emilia', 'Contact Christ Love Evangelical Assembly church: phone, WhatsApp +39 351 140 8770, Nigeria +2348030401694, Reggio Emilia address.', '/contact');
  return (<div className="sec"><h1 className="h-icon"><MailIcon /> Contact</h1><div className="grid g3">
    <div className="card"><h3 className="h-icon"><PhoneIcon /> Phone / WhatsApp</h3><p><a href="tel:+393511408770">+39 351 140 8770</a><br /><a href="tel:+2348030401694">+234 803 040 1694</a></p>
    <p><a className="btn solid" href="https://wa.me/393511408770">WhatsApp Us</a></p></div>
    <div className="card"><h3 className="h-icon"><MailIcon /> Message</h3><ContactForm /></div>
  </div></div>);
}
