import { useEffect, type RefObject } from 'react';

const GROUPS = '.grid,.trio,.steps,.stats';
const RV_SEL = [
  '.bleed-inner > :not(.grid):not(.trio):not(.steps):not(.stats)',
  '.page > :not(.page-header):not(.grid):not(.trio):not(.steps):not(.stats)',
  '.grid > *', '.trio > *', '.steps > *', '.stats > *',
].join(',');

/** Reveals sections and cards as they scroll into view (staggered in grids). Works in every browser. */
export function useScrollReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Reveals in both scroll directions: hides again once off-screen, remembering which side it left from.
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const t = en.target as HTMLElement;
        if (en.isIntersecting) t.classList.add('in');
        else {
          t.classList.remove('in');
          t.dataset.dir = en.boundingClientRect.top < 0 ? 'up' : 'down';
        }
      }
    }, { threshold: 0, rootMargin: '-40px 0px -40px 0px' });
    const scan = () => {
      el.querySelectorAll<HTMLElement>(RV_SEL).forEach((node) => {
        if (node.dataset.rv || node.closest('.page-header')) return;
        node.dataset.rv = '1';
        const parent = node.parentElement;
        if (parent?.matches(GROUPS)) node.style.transitionDelay = `${(Array.from(parent.children).indexOf(node) % 4) * 100}ms`;
        node.classList.add('rv');
        io.observe(node);
      });
    };
    scan();
    let raf = 0;
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan); });
    mo.observe(el, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(raf); };
  }, [root]);
}

/** Adds .visible to .reveal elements on scroll into view. */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  });
}

/** Toggles .scrolled on .nav after scrolling past 8px. */
export function useScrolledNav() {
  useEffect(() => {
    const onScroll = () => document.querySelector('.nav')?.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
