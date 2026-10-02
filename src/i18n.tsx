import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'it';

const dict = {
  en: {
    home: 'Home', about: 'About', media: 'Sermons & Media', blog: 'Blog', visit: 'Visit Us', contact: 'Contact', admin: 'Admin',
    heroKicker: 'Reggio Emilia · Italy',
    heroTitle: 'A place to belong, believe and become.',
    heroSub: 'Christ Love Evangelical Assembly, a warm, Bible-believing family in Reggio nell\u2019Emilia. Join us Sundays and midweek.',
    joinUs: 'Plan Your Visit', watch: 'Watch Sermons',
    serviceTimes: 'Service Times', latestSermons: 'Latest Sermons', latestBlog: 'From the Blog', pastors: 'Our Pastors',
    sunday: 'Sunday Celebration Service', wednesday: 'Wednesday Bible Study', friday: 'Friday Prayer & Vigil',
    viewAll: 'View all', readMore: 'Read more',
    address: 'Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell\u2019Emilia, Italy',
    footerTag: 'Preaching Christ\u2019s love in Reggio Emilia and beyond.',
    rights: 'All rights reserved.',
    statsVideos: 'Sermon videos online', statsFollowers: 'Facebook community', statsCities: 'Churches · Italy & Nigeria', statsYears: 'Years of grace',
    gallery: 'Life at Church', planTitle: 'Join us this Sunday', planSub: '10:00 · Via Corelli 5, Reggio Emilia. Come as you are, all are welcome.',
    mission: 'Our Mission', beliefs: 'Our Beliefs', trustees: 'Board of Trustees',
    expect: 'What to expect', expect1: 'Warm welcome at the door', expect2: 'Spirit-filled worship & the Word', expect3: 'Prayer for every need',
    serviceTable: 'Weekly Services', visitCta: 'Get Directions', watchCta: 'Watch Sermons', aboutCta: 'Our Story',
    missionText: 'To proclaim the Gospel of Christ, inspire all to live for Him, with a passion for righteousness and a consciousness of our duties to God and mankind.',
    aboutLong: 'Christ Love Evangelical Assembly is a mission-focused, Bible-believing family with churches in Europe and Nigeria. A community of faith, hope and love, where we worship, pray, study the Word, grow and serve together.',
    hqNote: 'Headquarters: Adedeji Street church, Nigeria · Europe base: Reggio Emilia, Italy',
    tagline: 'A place where you grasp the mystery behind understanding God\u2019s Word.',
    featured: 'Featured Sermon',
    locations: 'Our Locations', italyBase: 'Italy · Europe Base', nigeriaBase: 'Nigeria · Headquarters',
    italyAddr: 'Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell\u2019Emilia',
    nigeriaAddr: 'Adedeji Street church, Nigeria',
    italyLead: 'Led by Pastor Dr Bolanle Oluwakemi Anyanwu',
    nigeriaLead: 'Led by Apostle Babatope Olusegun Ojo',
    italySvc: 'Sunday 10:00 · Wednesday 18:30 · Friday 22:00',
    nigeriaSvc: 'Anniversary celebrations & Living Well, Living Blessed outreach',
  },
  it: {
    home: 'Home', about: 'Chi Siamo', media: 'Predicazioni e Media', blog: 'Blog', visit: 'Vieni a Trovarci', contact: 'Contatti', admin: 'Admin',
    heroKicker: 'Reggio Emilia · Italia',
    heroTitle: 'Un luogo dove appartenere, credere e crescere.',
    heroSub: 'Christ Love Evangelical Assembly, una calda famiglia biblica a Reggio nell\u2019Emilia. Ti aspettiamo la domenica e durante la settimana.',
    joinUs: 'Pianifica la Visita', watch: 'Guarda le Predicazioni',
    serviceTimes: 'Orari delle Celebrazioni', latestSermons: 'Ultime Predicazioni', latestBlog: 'Dal Blog', pastors: 'I Nostri Pastori',
    sunday: 'Domenica: Culto di Celebrazione', wednesday: 'Mercoledì: Studio Biblico', friday: 'Venerdì: Preghiera e Veglia',
    viewAll: 'Vedi tutto', readMore: 'Leggi tutto',
    address: 'Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell\u2019Emilia, Italia',
    footerTag: 'Predichiamo l\u2019amore di Cristo a Reggio Emilia e oltre.',
    rights: 'Tutti i diritti riservati.',
    statsVideos: 'Video di predicazioni online', statsFollowers: 'Comunità su Facebook', statsCities: 'Chiese · Italia e Nigeria', statsYears: 'Anni di grazia',
    gallery: 'Vita in Chiesa', planTitle: 'Unisciti a noi domenica', planSub: 'Ore 10:00 · Via Corelli 5, Reggio Emilia. Vieni come sei, tutti sono benvenuti.',
    mission: 'La Nostra Missione', beliefs: 'Il Nostro Credo', trustees: 'Consiglio di Amministrazione',
    expect: 'Cosa aspettarti', expect1: 'Calda accoglienza alla porta', expect2: 'Lode piena di Spirito e la Parola', expect3: 'Preghiera per ogni bisogno',
    serviceTable: 'Celebrazioni Settimanali', visitCta: 'Indicazioni Stradali', watchCta: 'Guarda le Predicazioni', aboutCta: 'La Nostra Storia',
    missionText: 'Proclamare il Vangelo di Cristo, ispirare tutti a vivere per Lui, con passione per la giustizia e consapevolezza dei nostri doveri verso Dio e il prossimo.',
    aboutLong: 'Christ Love Evangelical Assembly è una famiglia biblica missionaria con chiese in Europa e Nigeria. Una comunità di fede, speranza e amore, dove adoriamo, preghiamo, studiamo la Parola, cresciamo e serviamo insieme.',
    hqNote: 'Sede principale: chiesa di Adedeji Street, Nigeria · Sede europea: Reggio Emilia, Italia',
    tagline: 'Un luogo dove cogliere il mistero della comprensione della Parola di Dio.',
    featured: 'Predicazione in Evidenza',
    locations: 'Le Nostre Sedi', italyBase: 'Italia · Sede Europea', nigeriaBase: 'Nigeria · Sede Principale',
    italyAddr: 'Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell\u2019Emilia',
    nigeriaAddr: 'Chiesa di Adedeji Street, Nigeria',
    italyLead: 'Guidata dalla Pastora Dr Bolanle Oluwakemi Anyanwu',
    nigeriaLead: 'Guidata dall\u2019Apostolo Babatope Olusegun Ojo',
    italySvc: 'Domenica 10:00 · Mercoledì 18:30 · Venerdì 22:00',
    nigeriaSvc: 'Celebrazioni annuali e iniziative di beneficenza Living Well, Living Blessed',
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
