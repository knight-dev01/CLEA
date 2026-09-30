import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'it';

const dict = {
  en: {
    home: 'Home', about: 'About', media: 'Sermons & Media', blog: 'Blog', visit: 'Visit Us', contact: 'Contact', admin: 'Admin',
    heroKicker: 'Reggio Emilia · Italy',
    heroTitle: 'A place to belong, believe and become.',
    heroSub: 'Christ Love Evangelical Assembly (CLEA) — a warm, Bible-believing family in Reggio nell\u2019Emilia. Join us Sundays and midweek.',
    joinUs: 'Plan Your Visit', watch: 'Watch Sermons',
    serviceTimes: 'Service Times', latestSermons: 'Latest Sermons', latestBlog: 'From the Blog', pastors: 'Our Pastors',
    sunday: 'Sunday Celebration Service', wednesday: 'Wednesday Bible Study', friday: 'Friday Prayer & Vigil',
    viewAll: 'View all', readMore: 'Read more',
    address: 'Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell\u2019Emilia, Italy',
    footerTag: 'Preaching Christ\u2019s love in Reggio Emilia and beyond.',
    rights: 'All rights reserved.',
  },
  it: {
    home: 'Home', about: 'Chi Siamo', media: 'Predicazioni e Media', blog: 'Blog', visit: 'Vieni a Trovarci', contact: 'Contatti', admin: 'Admin',
    heroKicker: 'Reggio Emilia · Italia',
    heroTitle: 'Un luogo dove appartenere, credere e crescere.',
    heroSub: 'Christ Love Evangelical Assembly (CLEA) — una calda famiglia biblica a Reggio nell\u2019Emilia. Ti aspettiamo la domenica e durante la settimana.',
    joinUs: 'Pianifica la Visita', watch: 'Guarda le Predicazioni',
    serviceTimes: 'Orari delle Celebrazioni', latestSermons: 'Ultime Predicazioni', latestBlog: 'Dal Blog', pastors: 'I Nostri Pastori',
    sunday: 'Domenica — Culto di Celebrazione', wednesday: 'Mercoledì — Studio Biblico', friday: 'Venerdì — Preghiera e Veglia',
    viewAll: 'Vedi tutto', readMore: 'Leggi tutto',
    address: 'Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell\u2019Emilia, Italia',
    footerTag: 'Predichiamo l\u2019amore di Cristo a Reggio Emilia e oltre.',
    rights: 'Tutti i diritti riservati.',
  },
} as const;

export type DictKey = keyof typeof dict.en;

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: DictKey) => string }>({
  lang: 'en', setLang: () => {}, t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('clea-lang') as Lang) || 'en');
  useEffect(() => { localStorage.setItem('clea-lang', lang); document.documentElement.lang = lang; }, [lang]);
  const setLang = (l: Lang) => setLangState(l);
  const t = (k: DictKey): string => (dict[lang] as Record<string, string>)[k] ?? k;
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}
export const useLang = () => useContext(LangCtx);
