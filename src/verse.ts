const VERSES = [
  { en: '“For God so loved the world that He gave His only Son.” — John 3:16', it: '“Dio ha tanto amato il mondo da dare il suo unico Figlio.” — Giovanni 3:16' },
  { en: '“The Lord is my shepherd; I shall not want.” — Psalm 23:1', it: '“Il Signore è il mio pastore: nulla mi manca.” — Salmo 23:1' },
  { en: '“Be strong and courageous… for the Lord your God is with you.” — Joshua 1:9', it: '“Sii forte e coraggioso… il Signore è con te.” — Giosuè 1:9' },
  { en: '“Come to me, all who are weary, and I will give you rest.” — Matthew 11:28', it: '“Venite a me, voi che siete affaticati, e io vi darò ristoro.” — Matteo 11:28' },
  { en: '“Walk in love, as Christ loved us.” — Ephesians 5:2', it: '“Camminate nell’amore, come Cristo ci ha amati.” — Efesini 5:2' },
  { en: '“Your word is a lamp to my feet.” — Psalm 119:105', it: '“La tua parola è lampada al mio piede.” — Salmo 119:105' },
  { en: '“Rejoice in hope, be patient in tribulation, constant in prayer.” — Romans 12:12', it: '“Siate allegri nella speranza, pazienti nella tribolazione, perseveranti nella preghiera.” — Romani 12:12' },
];

export function verseOfDay(): { en: string; it: string } {
  const day = Math.floor(Date.now() / 86400000);
  return VERSES[day % VERSES.length];
}
