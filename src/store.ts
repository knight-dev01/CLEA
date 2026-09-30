import { useEffect, useState } from 'react';

export type BlogPost = { id: string; title: string; title_it: string; body: string; body_it: string; date: string; imageUrl: string };
export type MediaLink = { id: string; type: 'youtube' | 'facebook'; url: string; title: string };
export type SiteImages = { hero: string; gallery: string[] };

const K = { blog: 'clea-blog', media: 'clea-media', images: 'clea-images' };

const seedBlog: BlogPost[] = [
  { id: 'welcome', title: 'Welcome to Christ Love Evangelical Assembly Reggio Emilia', title_it: 'Benvenuti alla Christ Love Evangelical Assembly Reggio Emilia', body: 'We are a family of faith sharing the love of Christ. Join us every Sunday at 10:00.', body_it: 'Siamo una famiglia di fede che condivide l\u2019amore di Cristo. Unisciti a noi ogni domenica alle 10:00.', date: '2026-09-01', imageUrl: 'https://picsum.photos/seed/clea1/800/500' },
  { id: 'faith', title: 'Walking in Love and Faith', title_it: 'Camminare nell\u2019amore e nella fede', body: 'Discover our midweek Bible study and Friday prayer meetings. All are welcome.', body_it: 'Scopri il nostro studio biblico infrasettimanale e gli incontri di preghiera del venerdì. Tutti sono benvenuti.', date: '2026-09-15', imageUrl: 'https://picsum.photos/seed/clea2/800/500' },
];
export const SOCIALS = {
  facebookPage: 'https://www.facebook.com/1806488646340376',
  facebookFollowers: '1.1K',
  youtubeChannel: 'https://www.youtube.com/@pastordoctorbolanleoluwake3805',
  youtubeChannelId: 'UCXRGmn1DVIWXTTmBh5BjwXw',
  youtubeUploadsEmbed: 'https://www.youtube.com/embed?listType=playlist&list=UUXRGmn1DVIWXTTmBh5BjwXw',
  youtubeVideos: 296,
  blogspot: 'https://cleareggio.blogspot.com/',
  email: 'christloveevangelicalassembly@gmail.com',
  phoneIT: '+39 351 140 8770',
};
const seedMedia: MediaLink[] = [
  { id: 'm1', type: 'facebook', url: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F1806488646340376&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true', title: 'Christ Love Evangelical Assembly on Facebook — latest posts & live videos' },
  { id: 'm2', type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/1806488646340376/videos/', title: 'Sunday Celebration Service (Facebook)' },
];
const seedImages: SiteImages = {
  hero: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=70&auto=format&fit=crop',
  gallery: [
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=60&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470075801209-17f9ec0cada6?w=800&q=60&auto=format&fit=crop',
    'https://picsum.photos/seed/clea3/800/600',
  ],
};

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; }
}
function save(key: string, v: unknown) { localStorage.setItem(key, JSON.stringify(v)); }

export function ensureSeed() {
  if (!localStorage.getItem(K.blog)) save(K.blog, seedBlog);
  if (!localStorage.getItem(K.media)) save(K.media, seedMedia);
  if (!localStorage.getItem(K.images)) save(K.images, seedImages);
}

export function useStore() {
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [media, setMedia] = useState<MediaLink[]>([]);
  const [images, setImages] = useState<SiteImages>(seedImages);
  useEffect(() => { ensureSeed(); setBlog(load(K.blog, seedBlog)); setMedia(load(K.media, seedMedia)); setImages(load(K.images, seedImages)); }, []);
  const persist = {
    setBlog(v: BlogPost[]) { setBlog(v); save(K.blog, v); },
    setMedia(v: MediaLink[]) { setMedia(v); save(K.media, v); },
    setImages(v: SiteImages) { setImages(v); save(K.images, v); },
  };
  return { blog, media, images, persist };
}
export const uid = () => Math.random().toString(36).slice(2, 9);
