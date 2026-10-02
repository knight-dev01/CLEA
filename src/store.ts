import { useEffect, useState } from 'react';

export type BlogPost = { id: string; title: string; title_it: string; body: string; body_it: string; date: string; imageUrl: string };
export type MediaLink = { id: string; type: 'youtube' | 'facebook'; url: string; title: string };
export type SiteImages = { hero: string; gallery: string[] };

const K = { blog: 'clea-blog', media: 'clea-media', images: 'clea-images' };

const B = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl';
const seedBlog: BlogPost[] = [
  { id: 'christmas-2019', title: '2019 Christmas Party', title_it: 'Festa di Natale 2019', body: 'Christmas is one distinct annual festival commemorating the essence of the Birth of our Lord Jesus Christ. This particular celebration of Christmas in Christ Love Evangelical Assembly was an out-pour of the amazing love of God bestowed on mankind; as children were made to enjoy the bliss of the solitude of the existence of God in human form.', body_it: 'Il Natale commemora la nascita di nostro Signore Gesù Cristo. Questa celebrazione natalizia alla Christ Love Evangelical Assembly è stata un effusione dello straordinario amore di Dio per l\u2019umanità, con i bambini al centro della gioia.', date: '2020-01-24', imageUrl: `${B}/AVvXsEhbTgHnlHPWfPuKtWybHazQNgS1l99Vp966Bax_LOSpoYu9JGBPVgtFT5sbQYOHAdabvj6neQ5hQZ0huEL-wqBwxcTtpLNWG4HVLD6X5s-G1XapnjbtQ-i431w_ex8NLEGzGmbQkwIJkRQ/s1600/IMG-20200113-WA0028.jpg` },
  { id: 'third-anniversary', title: 'Our Third Anniversary was a glorious one', title_it: 'Il nostro terzo anniversario è stato glorioso', body: 'It was really an exciting moment in the presence of the Lord Jesus as we all made our time to celebrate the third year anniversary of Christ Love Evangelical Assembly. It was more than just a celebration; it\u2019s a memorial.', body_it: 'Un momento davvero emozionante alla presenza del Signore Gesù, celebrando il terzo anniversario della Christ Love Evangelical Assembly. Più di una celebrazione: un memoriale.', date: '2020-01-24', imageUrl: `${B}/AVvXsEixM5ety4V8E7pbQOs1AztoLKkxlmnqEgg3Ghkns_a4homB8MDQtg8mDRkpTebfJv66cYsMtFna49eevnh8xXkcJ5OvV8JMV_wmEqRcpU_a4QiFgGJirc4ou9mpn8XmQlBQQs1PUn5aNb4/s1600/IMG-20200113-WA0023.jpg` },
  { id: 'welcome', title: 'Welcome to Christ Love Evangelical Assembly Reggio Emilia', title_it: 'Benvenuti alla Christ Love Evangelical Assembly Reggio Emilia', body: 'We are a family of faith sharing the love of Christ. Join us every Sunday at 10:00.', body_it: 'Siamo una famiglia di fede che condivide l\u2019amore di Cristo. Unisciti a noi ogni domenica alle 10:00.', date: '2026-09-01', imageUrl: `${B}/AVvXsEhXZQBm4Kvbpy-2glSgeDAh4c-tdt5iT0H_GztBSgMZwyPCT_fpoy99GdYNytMM9nMi-1z1m-CR9AV0HurhBEFP9R0iEAzcxpsbdUA1Ps_SrauyyPOqUT8tS7hpdJnP79QE3NlhdlGirv8/s1600/IMG-20200113-WA0025.jpg` },
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
  { id: 'm1', type: 'facebook', url: 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F1806488646340376&tabs=timeline&width=500&height=700&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true', title: 'Christ Love Evangelical Assembly on Facebook: latest posts and live videos' },
  { id: 'm2', type: 'youtube', url: 'https://www.youtube.com/embed?listType=playlist&list=UUXRGmn1DVIWXTTmBh5BjwXw', title: 'Latest Sermons (YouTube uploads)' },
];
export const REAL_GALLERY: string[] = [
  `${B}/AVvXsEixM5ety4V8E7pbQOs1AztoLKkxlmnqEgg3Ghkns_a4homB8MDQtg8mDRkpTebfJv66cYsMtFna49eevnh8xXkcJ5OvV8JMV_wmEqRcpU_a4QiFgGJirc4ou9mpn8XmQlBQQs1PUn5aNb4/s1600/IMG-20200113-WA0023.jpg`,
  `${B}/AVvXsEhXZQBm4Kvbpy-2glSgeDAh4c-tdt5iT0H_GztBSgMZwyPCT_fpoy99GdYNytMM9nMi-1z1m-CR9AV0HurhBEFP9R0iEAzcxpsbdUA1Ps_SrauyyPOqUT8tS7hpdJnP79QE3NlhdlGirv8/s1600/IMG-20200113-WA0025.jpg`,
  `${B}/AVvXsEi2dOtfKVlAOdqCMYBsAyzv0vYdL0JO1a6E-O8GeOeenKsZBqAI98PblTCPBZSuYP-nLaOYhLgoqMGvsieb5N8yW5xarUzLUlUo4A0wKeYHL23gGvbiEmRQDsNnahzPgiHoh-QDkVjLCN8/s1600/IMG-20200113-WA0024.jpg`,
  `${B}/AVvXsEilWgnBy5i_gKUvWTJnF-1Q2rXemY32bA1NkhcV8vGeZhyzJv6EzvWh5TPXkxD-ac9fQCV8qN0WeCC_f5N7yjROdj8MQ4x1LmBGx3X_EbaDfq-1yvsQDRTWlQaKJOopnZSyX3o9o_EceUE/s1600/IMG-20200113-WA0033.jpg`,
  `${B}/AVvXsEj0zaGZfQuX_5aj3qfsyT5V67k8dCFyZR-hRnQz9b844lnIARp4o8Qj3gGcJ4TA2gdfr91yMu2ce5AJWpcslTn6uynXUchk55lK2deDd4YEpapwjj3vbTfqrq0fMPI2F16AmKMftq3OQGY/s1600/IMG-20200113-WA0017.jpg`,
  `${B}/AVvXsEhFfdU96WZOtYG7lRAfixg6x48sS9Bxg8HU9WwWDvJbf-IqHibYKYNnHmXygf_BF6sdHs-FJ29Yczb6q3_I1LqncyO0UMeEzoz-ouIt1kRn31AlkPLLAKPfyU7FEfY6k1JUoGsH5iYf2kg/s1600/IMG-20200113-WA0028.jpg`,
];
const seedImages: SiteImages = {
  hero: `${B}/AVvXsEixM5ety4V8E7pbQOs1AztoLKkxlmnqEgg3Ghkns_a4homB8MDQtg8mDRkpTebfJv66cYsMtFna49eevnh8xXkcJ5OvV8JMV_wmEqRcpU_a4QiFgGJirc4ou9mpn8XmQlBQQs1PUn5aNb4/s1600/IMG-20200113-WA0023.jpg`,
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
