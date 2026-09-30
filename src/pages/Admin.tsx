import { useEffect, useState } from 'react';
import { useSEO } from '../seo';
import { uid, type BlogPost, type MediaLink, type SiteImages } from '../store';

export default function Admin() {
  useSEO('Admin | CLEA', 'CLEA admin panel.');
  const [authed, setAuthed] = useState(sessionStorage.getItem('clea-admin') === '1');
  const [pw, setPw] = useState('');
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [media, setMedia] = useState<MediaLink[]>([]);
  const [images, setImages] = useState<SiteImages>({ hero: '', gallery: [] });
  const [form, setForm] = useState({ title: '', title_it: '', body: '', body_it: '', imageUrl: '' });
  const [mform, setMform] = useState({ type: 'youtube' as 'youtube' | 'facebook', url: '', title: '' });
  const [heroUrl, setHeroUrl] = useState('');
  const [galUrl, setGalUrl] = useState('');

  useEffect(() => {
    try {
      setBlog(JSON.parse(localStorage.getItem('clea-blog') || '[]'));
      setMedia(JSON.parse(localStorage.getItem('clea-media') || '[]'));
      setImages(JSON.parse(localStorage.getItem('clea-images') || '{"hero":"","gallery":[]}'));
    } catch { /* ignore */ }
  }, [authed]);

  const saveBlog = (v: BlogPost[]) => { setBlog(v); localStorage.setItem('clea-blog', JSON.stringify(v)); };
  const saveMedia = (v: MediaLink[]) => { setMedia(v); localStorage.setItem('clea-media', JSON.stringify(v)); };
  const saveImages = (v: SiteImages) => { setImages(v); localStorage.setItem('clea-images', JSON.stringify(v)); };

  if (!authed) return (<div className="sec card" style={{ maxWidth: 420, margin: '40px auto' }}>
    <h1>🔒 Admin</h1>
    <form onSubmit={e => { e.preventDefault(); if (pw === 'clea-admin') { sessionStorage.setItem('clea-admin', '1'); setAuthed(true); } else alert('Wrong password'); }}>
      <label>Password</label><input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter admin password" />
      <button className="btn solid" type="submit">Login</button>
    </form></div>);

  return (<div className="sec">
    <h1>⚙️ Admin Dashboard</h1>
    <div className="rowbtns"><button className="smallbtn" onClick={() => { sessionStorage.removeItem('clea-admin'); setAuthed(false); }}>Logout</button>
    <button className="smallbtn" onClick={() => { localStorage.clear(); location.reload(); }}>Reset demo data</button></div>

    <h2>🖼 Hero & Gallery</h2>
    <div className="card"><label>Hero image URL</label><input value={heroUrl} onChange={e => setHeroUrl(e.target.value)} placeholder={images.hero} />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { saveImages({ ...images, hero: heroUrl || images.hero }); setHeroUrl(''); }}>Set hero</button></div>
      <label>Gallery image URL</label><input value={galUrl} onChange={e => setGalUrl(e.target.value)} placeholder="https://…" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (galUrl) { saveImages({ ...images, gallery: [...images.gallery, galUrl] }); setGalUrl(''); } }}>Add image</button></div>
      <p className="muted">{images.gallery.length} gallery images</p></div>

    <h2>✍️ Blog posts</h2>
    <div className="card"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title (EN)" />
      <input value={form.title_it} onChange={e => setForm({ ...form, title_it: e.target.value })} placeholder="Titolo (IT)" />
      <textarea rows={3} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Body (EN)" />
      <textarea rows={3} value={form.body_it} onChange={e => setForm({ ...form, body_it: e.target.value })} placeholder="Testo (IT)" />
      <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (!form.title) return alert('Title required'); saveBlog([{ id: uid(), date: new Date().toISOString().slice(0, 10), ...form }, ...blog]); setForm({ title: '', title_it: '', body: '', body_it: '', imageUrl: '' }); }}>Add post</button></div></div>
    <table><tbody>{blog.map(b => <tr key={b.id}><td>{b.title}</td><td>{b.date}</td><td><button className="smallbtn" onClick={() => saveBlog(blog.filter(x => x.id !== b.id))}>Delete</button></td></tr>)}</tbody></table>

    <h2>🎥 Media links</h2>
    <div className="card"><select value={mform.type} onChange={e => setMform({ ...mform, type: e.target.value as 'youtube' | 'facebook' })}><option value="youtube">youtube</option><option value="facebook">facebook</option></select>
      <input value={mform.title} onChange={e => setMform({ ...mform, title: e.target.value })} placeholder="Title" />
      <input value={mform.url} onChange={e => setMform({ ...mform, url: e.target.value })} placeholder="Embed URL (youtube embed / facebook video plugin)" />
      <div className="rowbtns"><button className="smallbtn" onClick={() => { if (!mform.url) return alert('URL required'); saveMedia([{ id: uid(), ...mform }, ...media]); setMform({ type: 'youtube', url: '', title: '' }); }}>Add media</button></div></div>
    <table><tbody>{media.map(m => <tr key={m.id}><td>{m.type}</td><td>{m.title}</td><td><button className="smallbtn" onClick={() => saveMedia(media.filter(x => x.id !== m.id))}>Delete</button></td></tr>)}</tbody></table>
  </div>);
}
