import { useEffect, useState } from 'react';
import { useSEO } from '../seo';
import { uid, type BlogPost, type MediaLink, type SiteImages } from '../store';
import { fetchContent, login, manage, type EventItem } from '../cms';
import { ChurchIcon, VideoIcon, BookIcon, UsersIcon, MailIcon } from '../icons';

export default function Admin() {
  useSEO('Admin | Christ Love Evangelical Assembly', 'Christ Love Evangelical Assembly admin panel.');
  const [authed, setAuthed] = useState(
    sessionStorage.getItem('clea-admin') === '1' || !!sessionStorage.getItem('clea-token')
  );
  const [pw, setPw] = useState('');
  const [remote, setRemote] = useState(false);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [media, setMedia] = useState<MediaLink[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [images, setImages] = useState<SiteImages>({ hero: '', gallery: [] });
  const [form, setForm] = useState({ title: '', title_it: '', body: '', body_it: '', imageUrl: '' });
  const [mform, setMform] = useState({ type: 'youtube' as 'youtube' | 'facebook', url: '', title: '' });
  const [eform, setEform] = useState({ title: '', title_it: '', date: '', time: '', location: '' });
  const [heroUrl, setHeroUrl] = useState('');
  const [galUrl, setGalUrl] = useState('');

  useEffect(() => {
    if (!authed) return;
    fetchContent().then((c) => {
      if (c && (c.posts.length || c.media.length || c.events.length)) {
        setRemote(true);
        setBlog(c.posts);
        setMedia(c.media);
        setEvents(c.events);
        try {
          setImages({
            hero: c.settings.hero || '',
            gallery: c.settings.gallery ? JSON.parse(c.settings.gallery) : [],
          });
        } catch { /* keep */ }
      } else {
        // Local fallback (no DB configured yet): existing localStorage behaviour
        try {
          setBlog(JSON.parse(localStorage.getItem('clea-blog') || '[]'));
          setMedia(JSON.parse(localStorage.getItem('clea-media') || '[]'));
          setEvents(JSON.parse(localStorage.getItem('clea-events') || '[]'));
          setImages(JSON.parse(localStorage.getItem('clea-images') || '{"hero":"","gallery":[]}'));
        } catch { /* ignore */ }
      }
    });
  }, [authed]);

  const saveBlog = async (v: BlogPost[]) => {
    setBlog(v);
    if (remote) {
      const changed = v.find((b) => !blog.some((x) => x.id === b.id));
      if (changed) await manage('posts', 'upsert', changed as unknown as Record<string, string>);
      else {
        const removed = blog.find((b) => !v.some((x) => x.id === b.id));
        if (removed) await manage('posts', 'delete', { id: removed.id });
      }
    } else localStorage.setItem('clea-blog', JSON.stringify(v));
  };
  const saveMedia = async (v: MediaLink[]) => {
    setMedia(v);
    if (remote) {
      const changed = v.find((m) => !media.some((x) => x.id === m.id));
      if (changed) await manage('media', 'upsert', changed as unknown as Record<string, string>);
      else {
        const removed = media.find((m) => !v.some((x) => x.id === m.id));
        if (removed) await manage('media', 'delete', { id: removed.id });
      }
    } else localStorage.setItem('clea-media', JSON.stringify(v));
  };
  const saveEvents = async (v: EventItem[]) => {
    setEvents(v);
    if (remote) {
      const changed = v.find((e) => !events.some((x) => x.id === e.id));
      if (changed) await manage('events', 'upsert', changed as unknown as Record<string, string>);
      else {
        const removed = events.find((e) => !v.some((x) => x.id === e.id));
        if (removed) await manage('events', 'delete', { id: removed.id });
      }
    } else localStorage.setItem('clea-events', JSON.stringify(v));
  };
  const saveImages = async (v: SiteImages) => {
    setImages(v);
    if (remote) {
      await manage('settings', 'upsert', { key: 'hero', value: v.hero });
      await manage('settings', 'upsert', { key: 'gallery', value: JSON.stringify(v.gallery) });
    } else localStorage.setItem('clea-images', JSON.stringify(v));
  };

  if (!authed) return (<div className="sec card" style={{ maxWidth: 420, margin: '40px auto' }}>
    <h1 className="h-icon"><MailIcon /> Admin</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      const token = await login(pw);
      if (token) { sessionStorage.setItem('clea-admin', '1'); setAuthed(true); }
      else if (pw === 'clea-admin') { sessionStorage.setItem('clea-admin', '1'); setAuthed(true); }
      else alert('Wrong password');
    }}>
      <label>Password</label><input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter admin password" />
      <button className="btn solid" type="submit">Login</button>
    </form></div>);

  return (<div className="sec">
    <h1 className="h-icon"><ChurchIcon /> Admin Dashboard</h1>
    <p className="muted">{remote ? 'Connected to shared database — changes are visible to all visitors.' : 'Local preview mode — connect the database (see README) to publish for everyone.'}</p>
    <div className="rowbtns"><button className="smallbtn" onClick={() => { sessionStorage.removeItem('clea-admin'); sessionStorage.removeItem('clea-token'); setAuthed(false); }}>Logout</button>
    <button className="smallbtn" onClick={() => { localStorage.clear(); location.reload(); }}>Reset demo data</button></div>

    <h2 className="h-icon"><ChurchIcon /> Hero & Gallery</h2>
    <div className="card"><label>Hero image URL</label><input value={heroUrl} onChange={(e) => setHeroUrl(e.target.value)} placeholder={images.hero} />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { saveImages({ ...images, hero: heroUrl || images.hero }); setHeroUrl(''); }}>Set hero</button></div>
      <label>Gallery image URL</label><input value={galUrl} onChange={(e) => setGalUrl(e.target.value)} placeholder="https://…" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (galUrl) { saveImages({ ...images, gallery: [...images.gallery, galUrl] }); setGalUrl(''); } }}>Add image</button></div>
      <p className="muted">{images.gallery.length} gallery images</p></div>

    <h2 className="h-icon"><BookIcon /> Blog posts</h2>
    <div className="card"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title (EN)" />
      <input value={form.title_it} onChange={(e) => setForm({ ...form, title_it: e.target.value })} placeholder="Titolo (IT)" />
      <textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Body (EN)" />
      <textarea rows={3} value={form.body_it} onChange={(e) => setForm({ ...form, body_it: e.target.value })} placeholder="Testo (IT)" />
      <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (!form.title) return alert('Title required'); saveBlog([{ id: uid(), date: new Date().toISOString().slice(0, 10), ...form }, ...blog]); setForm({ title: '', title_it: '', body: '', body_it: '', imageUrl: '' }); }}>Add post</button></div></div>
    <table><tbody>{blog.map((b) => <tr key={b.id}><td>{b.title}</td><td>{b.date}</td><td><button className="smallbtn" onClick={() => saveBlog(blog.filter((x) => x.id !== b.id))}>Delete</button></td></tr>)}</tbody></table>

    <h2 className="h-icon"><VideoIcon /> Media links</h2>
    <div className="card"><select value={mform.type} onChange={(e) => setMform({ ...mform, type: e.target.value as 'youtube' | 'facebook' })}><option value="youtube">youtube</option><option value="facebook">facebook</option></select>
      <input value={mform.title} onChange={(e) => setMform({ ...mform, title: e.target.value })} placeholder="Title" />
      <input value={mform.url} onChange={(e) => setMform({ ...mform, url: e.target.value })} placeholder="Embed URL (youtube embed / facebook video plugin)" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (!mform.url) return alert('URL required'); saveMedia([{ id: uid(), ...mform }, ...media]); setMform({ type: 'youtube', url: '', title: '' }); }}>Add media</button></div></div>
    <table><tbody>{media.map((m) => <tr key={m.id}><td>{m.type}</td><td>{m.title}</td><td><button className="smallbtn" onClick={() => saveMedia(media.filter((x) => x.id !== m.id))}>Delete</button></td></tr>)}</tbody></table>

    <h2 className="h-icon"><UsersIcon /> Events</h2>
    <div className="card"><input value={eform.title} onChange={(e) => setEform({ ...eform, title: e.target.value })} placeholder="Title (EN)" />
      <input value={eform.title_it} onChange={(e) => setEform({ ...eform, title_it: e.target.value })} placeholder="Titolo (IT)" />
      <input value={eform.date} onChange={(e) => setEform({ ...eform, date: e.target.value })} placeholder="Date (YYYY-MM-DD)" />
      <input value={eform.time} onChange={(e) => setEform({ ...eform, time: e.target.value })} placeholder="Time (e.g. 10:00)" />
      <input value={eform.location} onChange={(e) => setEform({ ...eform, location: e.target.value })} placeholder="Location" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (!eform.title) return alert('Title required'); saveEvents([{ id: uid(), ...eform }, ...events]); setEform({ title: '', title_it: '', date: '', time: '', location: '' }); }}>Add event</button></div></div>
    <table><tbody>{events.map((ev) => <tr key={ev.id}><td>{ev.title}</td><td>{ev.date} {ev.time}</td><td><button className="smallbtn" onClick={() => saveEvents(events.filter((x) => x.id !== ev.id))}>Delete</button></td></tr>)}</tbody></table>
  </div>);
}
