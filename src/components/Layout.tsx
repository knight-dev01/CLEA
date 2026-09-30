import { NavLink, Outlet } from 'react-router-dom';
import { useLang } from '../i18n';
import { FacebookIcon, BloggerIcon, MailIcon, PhoneIcon, WhatsappIcon } from '../icons';

export function Nav() {
  const { t, lang, setLang } = useLang();
  const L: [string, string][] = [['/', t('home')], ['/about', t('about')], ['/media', t('media')], ['/blog', t('blog')], ['/visit', t('visit')], ['/contact', t('contact')]];
  return (
    <nav className="nav"><div className="nav-in">
      <a className="brand" href="/"><img src="logo.jpg" alt="CLEA logo" />CLEA</a>
      <div className="links">{L.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</div>
      <button className="langbtn" onClick={() => setLang(lang === 'en' ? 'it' : 'en')}>{lang === 'en' ? 'IT' : 'EN'}</button>
    </div></nav>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer><div className="wrap grid g3">
      <div><strong>Christ Love Evangelical Assembly</strong><p className="muted">{t('footerTag')}<br />{t('address')}</p></div>
      <div><strong>Contact</strong>
        <p className="muted contactline"><PhoneIcon /> <a href="tel:+393511408770">+39 351 140 8770</a></p>
        <p className="muted contactline"><PhoneIcon /> <a href="tel:+2348030401694">+234 803 040 1694</a></p>
      </div>
      <div><strong>Follow</strong>
        <p className="socials">
          <a href="https://www.facebook.com/1806488646340376" target="_blank" rel="noreferrer" aria-label="CLEA on Facebook"><FacebookIcon /></a>
          <a href="https://cleareggio.blogspot.com/" target="_blank" rel="noreferrer" aria-label="CLEA Blogspot"><BloggerIcon /></a>
          <a href="mailto:christloveevangelicalassembly@gmail.com" aria-label="Email CLEA"><MailIcon /></a>
          <a href="https://wa.me/393511408770" target="_blank" rel="noreferrer" aria-label="CLEA on WhatsApp"><WhatsappIcon size={18} /></a>
        </p>
        <p className="muted">© 2026 CLEA · {t('rights')}</p>
      </div>
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
      <WhatsappIcon />
    </a>
  );
}

export default function Layout() {
  return (<><Nav /><div className="wrap"><Outlet /></div><Footer /><WhatsAppFloat /></>);
}
