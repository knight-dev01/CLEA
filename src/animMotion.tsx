import { m, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade-and-rise on scroll into view (respects reduced motion). */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [...EASE] }}
    >
      {children}
    </m.div>
  );
}

/** Staggered children entrance. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-64px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [...EASE] } } }}
    >
      {children}
    </m.div>
  );
}

/** Full-bleed photo band (static, calm). */
export function PhotoBand({ src, label }: { src: string; label: string }) {
  return (
    <div className="photo-band">
      <img src={src} alt={label} loading="lazy" />
      <div className="photo-band-shade" />
      <span className="photo-band-label">{label}</span>
    </div>
  );
}

/** Ambient floating color orbs behind content (royal + silver, theme-aware). */
export function Orbs() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="orbs" aria-hidden="true">
      <m.span
        className="orb orb-a"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
      <m.span
        className="orb orb-b"
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 48, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
