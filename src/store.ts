import { useEffect, useState } from 'react';

export type BlogPost = { id: string; title: string; title_it: string; body: string; body_it: string; date: string; imageUrl: string };
export type MediaLink = { id: string; type: 'youtube' | 'facebook'; url: string; title: string };
export type SiteImages = { hero: string; gallery: string[] };

const K = { blog: 'clea-blog', media: 'clea-media', images: 'clea-images' };

const B = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl';
export const seedBlog: BlogPost[] = [];
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
export const seedMedia: MediaLink[] = [];
const YT = 'https://i.ytimg.com/vi';
export const REAL_GALLERY: string[] = [
  `${YT}/6-vGr3IwozI/hqdefault.jpg`,
  `${YT}/A2UTkZutIRE/hqdefault.jpg`,
  `${YT}/aogItOm3vD8/hqdefault.jpg`,
  `${YT}/VcbeJw4GsGM/hqdefault.jpg`,
  `${YT}/edyzQzstNKY/hqdefault.jpg`,
  `${B}/AVvXsEixM5ety4V8E7pbQOs1AztoLKkxlmnqEgg3Ghkns_a4homB8MDQtg8mDRkpTebfJv66cYsMtFna49eevnh8xXkcJ5OvV8JMV_wmEqRcpU_a4QiFgGJirc4ou9mpn8XmQlBQQs1PUn5aNb4/s1600/IMG-20200113-WA0023.jpg`,
  `${B}/AVvXsEhXZQBm4Kvbpy-2glSgeDAh4c-tdt5iT0H_GztBSgMZwyPCT_fpoy99GdYNytMM9nMi-1z1m-CR9AV0HurhBEFP9R0iEAzcxpsbdUA1Ps_SrauyyPOqUT8tS7hpdJnP79QE3NlhdlGirv8/s1600/IMG-20200113-WA0025.jpg`,
  `${B}/AVvXsEi2dOtfKVlAOdqCMYBsAyzv0vYdL0JO1a6E-O8GeOeenKsZBqAI98PblTCPBZSuYP-nLaOYhLgoqMGvsieb5N8yW5xarUzLUlUo4A0wKeYHL23gGvbiEmRQDsNnahzPgiHoh-QDkVjLCN8/s1600/IMG-20200113-WA0024.jpg`,
  `${B}/AVvXsEilWgnBy5i_gKUvWTJnF-1Q2rXemY32bA1NkhcV8vGeZhyzJv6EzvWh5TPXkxD-ac9fQCV8qN0WeCC_f5N7yjROdj8MQ4x1LmBGx3X_EbaDfq-1yvsQDRTWlQaKJOopnZSyX3o9o_EceUE/s1600/IMG-20200113-WA0033.jpg`,
  `${B}/AVvXsEj0zaGZfQuX_5aj3qfsyT5V67k8dCFyZR-hRnQz9b844lnIARp4o8Qj3gGcJ4TA2gdfr91yMu2ce5AJWpcslTn6uynXUchk55lK2deDd4YEpapwjj3vbTfqrq0fMPI2F16AmKMftq3OQGY/s1600/IMG-20200113-WA0017.jpg`,
  `${B}/AVvXsEhFfdU96WZOtYG7lRAfixg6x48sS9Bxg8HU9WwWDvJbf-IqHibYKYNnHmXygf_BF6sdHs-FJ29Yczb6q3_I1LqncyO0UMeEzoz-ouIt1kRn31AlkPLLAKPfyU7FEfY6k1JUoGsH5iYf2kg/s1600/IMG-20200113-WA0028.jpg`,
];
const seedImages: SiteImages = {
  hero: `${YT}/6-vGr3IwozI/hqdefault.jpg`,
  gallery: REAL_GALLERY,
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
