import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import { useScrolledNav } from '../hooks';
import { FacebookIcon, BloggerIcon, MailIcon, PhoneIcon, WhatsappIcon, YoutubeIcon } from '../icons';
import { SOCIALS } from '../store';

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
      <div className={'links' + (open ? ' open' : '')}>{L.map(([to, l]) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>{l}</NavLink>)}</div>
      <button className="langbtn" onClick={() => setLang(lang === 'en' ? 'it' : 'en')}>{lang === 'en' ? 'IT' : 'EN'}</button>
      <button className={'menubtn' + (open ? ' open' : '')} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
        <span /><span /><span />
      </button>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </div></nav>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer><div className="wrap grid g3">
      <div><img className="footer-logo" src="logo.png" alt="Christ Love Evangelical Assembly logo" /><strong>Christ Love Evangelical Assembly</strong><p className="muted">{t('footerTag')}<br />{t('address')}</p></div>
      <div><strong>Contact</strong>
        <p className="muted contactline"><PhoneIcon /> <a href="tel:+393511408770">+39 351 140 8770</a></p>
        <p className="muted contactline"><PhoneIcon /> <a href="tel:+2348030401694">+234 803 040 1694</a></p>
        <p className="muted contactline"><MailIcon /> <a href={`mailto:${SOCIALS.email}`}>{SOCIALS.email}</a></p>
      </div>
      <div><strong>{t('serviceTimes')}</strong>
        <p className="muted">Sunday · 10:00<br />Wednesday · 18:30<br />Friday · 22:00</p>
      </div>
      <div><strong>Follow</strong>
        <p className="socials">
          <a href={SOCIALS.facebookPage} target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly on Facebook"><FacebookIcon /></a>
          <a href={SOCIALS.youtubeChannel} target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly on YouTube"><YoutubeIcon /></a>
          <a href={SOCIALS.blogspot} target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly Blog"><BloggerIcon /></a>
          <a href={`mailto:${SOCIALS.email}`} aria-label="Email Christ Love Evangelical Assembly"><MailIcon /></a>
          <a href="https://wa.me/393511408770" target="_blank" rel="noreferrer" aria-label="Christ Love Evangelical Assembly on WhatsApp"><WhatsappIcon size={18} /></a>
        </p>
        <p className="muted">© 2026 Christ Love Evangelical Assembly · {t('rights')} · <Link to="/admin">Admin</Link></p>
      </div>
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
  const logo = `${import.meta.env.BASE_URL}logo.png`;
  return (<><div className="watermark" aria-hidden="true" style={{ backgroundImage: `url('${logo}')` }} /><Nav /><div className="wrap"><Outlet /></div><Footer /><WhatsAppFloat /></>);
}
