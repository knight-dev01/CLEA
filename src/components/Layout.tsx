import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function OfflineBanner() {
  const { lang } = useLang();
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  if (online) return null;
  return (
    <div className="offline-banner" role="alert">
      {lang === 'it' ? 'Sei offline: stai vedendo i contenuti salvati.' : 'You are offline: showing saved content.'}
    </div>
  );
}
import { useLang } from '../i18n';
import { useScrolledNav } from '../hooks';
import { FacebookIcon, BloggerIcon, MailIcon, PhoneIcon, WhatsappIcon, YoutubeIcon } from '../icons';
import { ThemeToggle } from '../theme';
import { SOCIALS } from '../store';

export function Topbar() {
  return (
    <div className="topbar"><div className="topbar-in">
      <div className="topbar-contact">
        <a href="tel:+393511408770"><PhoneIcon size={13} /> +39 351 140 8770</a>
        <a href={`mailto:${SOCIALS.email}`} className="topbar-email"><MailIcon size={13} /> {SOCIALS.email}</a>
      </div>
      <div className="socials topbar-socials">
        <a href={SOCIALS.facebookPage} target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon size={14} /></a>
        <a href={SOCIALS.youtubeChannel} target="_blank" rel="noreferrer" aria-label="YouTube"><YoutubeIcon size={14} /></a>
        <a href="https://wa.me/393511408770" target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsappIcon size={14} /></a>
      </div>
    </div></div>
  );
}

export function Nav() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open ]);
  const L: [string, string][] = [['/', t('home')], ['/about', t('about')], ['/media', t('media')], ['/blog', t('blog')], ['/visit', t('visit')], ['/contact', t('contact')]];
  return (
    <nav className="nav"><div className="nav-in">
      <a className="brand" href="/"><img src="logo.png" alt="Christ Love Evangelical Assembly logo" /><span>Christ Love Evangelical Assembly</span></a>
      <div className="links">{L.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</div>
      <button className="langbtn" onClick={() => setLang(lang === 'en' ? 'it' : 'en')}>{lang === 'en' ? 'IT' : 'EN'}</button>
      <ThemeToggle />
      <button className={'menubtn' + (open ? ' open' : '')} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
        <span /><span /><span />
      </button>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className={'mobile-menu' + (open ? ' open' : '')} role="menu">
        <div className="mobile-menu-grid">{L.map(([to, l]) => <NavLink key={to} to={to} role="menuitem" className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</div>
      </div>
    </div></nav>
  );
}

export function Footer() {
  const { t } = useLang();
  const L: [string, string][] = [['/', t('home')], ['/about', t('about')], ['/media', t('media')], ['/blog', t('blog')], ['/visit', t('visit')], ['/contact', t('contact')]];
  return (
    <footer><div className="wrap footer-grid">
      <div className="footer-col-brand"><div className="footer-brand"><img className="footer-logo" src="logo.png" alt="Christ Love Evangelical Assembly logo" /><strong>Christ Love Evangelical Assembly</strong></div><p className="muted">{t('footerTag')}<br />{t('address')}</p>
        <p className="socials" style={{ marginTop: 12 }}>
          <a href={SOCIALS.facebookPage} target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly on Facebook"><FacebookIcon /></a>
          <a href={SOCIALS.youtubeChannel} target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly on YouTube"><YoutubeIcon /></a>
          <a href={SOCIALS.blogspot} target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly Blog"><BloggerIcon /></a>
          <a href={`mailto:${SOCIALS.email}`} aria-label="Email Christ Love Evangelical Assembly"><MailIcon /></a>
          <a href="https://wa.me/393511408770" target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly on WhatsApp"><WhatsappIcon size={18} /></a>
        </p>
      </div>
      <div><strong>{t('quickLinks')}</strong>
        <ul className="footer-links">{L.map(([to, l]) => <li key={to}><Link to={to}>{l}</Link></li>)}</ul>
      </div>
      <div><strong>Contact</strong>
        <p className="muted contactline"><PhoneIcon /> <a href="tel:+393511408770">+39 351 140 8770</a></p>
        <p className="muted contactline"><PhoneIcon /> <a href="tel:+2348030401694">+234 803 040 1694</a></p>
        <p className="muted contactline"><MailIcon /> <a href={`mailto:${SOCIALS.email}`}>{SOCIALS.email}</a></p>
      </div>
      <div><strong>{t('serviceTimes')}</strong>
        <p className="muted">Sunday · 10:00<br />Wednesday · 18:30<br />Friday · 22:00</p>
      </div>
      <div className="footer-bottom"><p className="muted">© 2026 Christ Love Evangelical Assembly · {t('rights')} · <Link to="/admin">Admin</Link></p></div>
    </div></footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/393511408770?text=Hello%20Christ%20Love%20Evangelical%20Assembly%2C%20I%20would%20like%20more%20info"
      target="_blank"
      rel="noreferrer"
      className="wa-float"
      aria-label="Chat with Christ Love Evangelical Assembly on WhatsApp"
    >
      <WhatsappIcon />
    </a>
  );
}

export default function Layout() {
  useScrolledNav();
  return (<><Topbar /><Nav /><OfflineBanner /><div className="wrap"><Outlet /></div><Footer /><WhatsAppFloat /></>);
}
