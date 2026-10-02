const STOP = new Set(
  'a,an,the,and,or,but,if,then,so,of,at,by,for,with,about,into,through,to,from,in,on,that,this,these,those,is,are,was,were,be,been,being,have,has,had,do,does,did,will,would,shall,should,can,could,may,might,must,as,it,its,it\u2019s,i,you,he,she,we,they,them,his,her,our,your,their,not,no,yes,all,also,just,than,too,very,our,us,me,my,mine,il,lo,la,i,gli,le,di,a,da,in,con,su,per,tra,fra,che,chi,come,questo,questa,questi,queste,quello,quella,quelli,quelle,il,lo,la,i,gli,le,un,uno,una,si,ci,ne,non,piu,anche,sono,siamo,siete,ho,hai,ha,abbiamo,hanno,dei,delle,degli,nella,nello,nella,negli,sulla,della,dello,dell,al,allo,alla,ai,agli,alle,dal,dallo,dalla,dai,dagli,dalle,nel,nello,nella,negli,sul,sullo,sulla,sui,sugli,sulle,e,ed,o,od,ma,se,anche'.split(',')
);

/** Tiny on-device extractive summarizer: scores sentences by word frequency, returns top N. */
export function summarize(text: string, maxSentences = 3): string {
  const sentences = text.replace(/\s+/g, ' ').match(/[^.!?\n]+[.!?]+/g) || [text];
  if (sentences.length <= maxSentences) return text.trim();
  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().replace(/[^a-zà-ÿ'\s]/gi, ' ').split(/\s+/)) {
    if (w.length > 3 && !STOP.has(w)) freq.set(w, (freq.get(w) || 0) + 1);
  }
  const scored = sentences.map((s, i) => {
    const words = s.toLowerCase().split(/\s+/);
    const score = words.reduce((a, w) => a + (freq.get(w) || 0), 0) / Math.sqrt(words.length || 1);
    // Prefer early sentences slightly (lede bias)
    return { s: s.trim(), score: score * (1 + 0.15 * Math.max(0, 1 - i / 5)), i };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxSentences).sort((a, b) => a.i - b.i);
  return top.map((t) => t.s).join(' ');
}
