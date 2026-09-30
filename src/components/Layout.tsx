import { NavLink, Outlet } from 'react-router-dom';
import { useLang } from '../i18n';
export function Nav() {
  const { t, lang, setLang } = useLang();
  const L: [string, string][] = [['/', t('home')], ['/about', t('about')], ['/media', t('media')], ['/blog', t('blog')], ['/visit', t('visit')], ['/contact', t('contact')]];
  return (
    <nav className="nav"><div className="nav-in">
      <a className="brand" href="/"><img src="logo.jpg" alt="CLEA logo" />CLEA</a>
      <div className="links">{L.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</div>
      <button className="langbtn" onClick={() => setLang(lang === 'en' ? 'it' : 'en')}>{lang === 'en' ? 'IT 🇮🇹' : 'EN 🇬🇧'}</button>
    </div></nav>
  );
}
export function Footer() {
  const { t } = useLang();
  return (
    <footer><div className="wrap grid g3">
      <div><strong>Christ Love Evangelical Assembly</strong><p className="muted">{t('footerTag')}<br />{t('address')}</p></div>
      <div><strong>Contact</strong><p className="muted">📞 +39 351 140 8770<br />📞 +234 803 040 1694</p></div>
      <div><strong>Follow</strong><p><a href="https://www.facebook.com/1806488646340376" target="_blank" rel="noreferrer">Facebook</a> · <a href="https://cleareggio.blogspot.com/" target="_blank" rel="noreferrer">Blogspot</a> · <a href="mailto:christloveevangelicalassembly@gmail.com">Email</a></p><p className="muted">© 2026 CLEA · {t('rights')}</p></div>
    </div></footer>
  );
}
export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/393511408770?text=Hello%20CLEA%2C%20I%20would%20like%20more%20info"
      target="_blank"
      rel="noreferrer"
      className="wa-float"
      aria-label="Chat with CLEA on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 2 6.5L4 29l7.7-2c1.8 1 3.9 1.5 4.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22.2c-1.4 0-2.7-.4-3.9-1l-.3-.2-4.6 1.2 1.2-4.5-.2-.3c-.7-1.2-1.1-2.6-1.1-4 0-5 4-9 9-9s9 4 9 9-4 9.8-9 9.8zm5-6.7c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L14.2 11c-.4-1-.8-.9-1.1-.9h-.9c-.3 0-.8.1-1.2.6-.4.4-1.5 1.5-1.5 3.7s1.6 4.3 1.8 4.6c.2.3 3.1 4.7 7.4 6.6 1 .4 1.8.7 2.5.9.9.3 1.9.2 2.6.2.8-.1 2.4-1 2.8-2 .3-1 .3-1.8.2-2 0-.2-.3-.3-.6-.4z" /></svg>
    </a>
  );
}
export default function Layout() {
  return (<><Nav /><div className="wrap"><Outlet /></div><Footer /><WhatsAppFloat /></>);
}
