import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';

function lazyComp<P extends object>(pick: (m: typeof import('./animMotion')) => ComponentType<P>) {
  return lazy(() => import('./animMotion').then((m) => ({ default: pick(m) })));
}

const RevealMotion = lazyComp((m) => m.Reveal);
const StaggerMotion = lazyComp((m) => m.Stagger);
const StaggerItemMotion = lazyComp((m) => m.StaggerItem);
const PhotoBandMotion = lazyComp((m) => m.PhotoBand);
const OrbsMotion = lazyComp((m) => m.Orbs);

type Common = { children: ReactNode; className?: string };

export function Reveal({ children, className, delay }: Common & { delay?: number }) {
  return (
    <Suspense fallback={children}>
      <RevealMotion className={className} delay={delay}>{children}</RevealMotion>
    </Suspense>
  );
}

export function Stagger({ children, className }: Common) {
  return (
    <Suspense fallback={children}>
      <StaggerMotion className={className}>{children}</StaggerMotion>
    </Suspense>
  );
}

export function StaggerItem({ children, className }: Common) {
  return (
    <Suspense fallback={children}>
      <StaggerItemMotion className={className}>{children}</StaggerItemMotion>
    </Suspense>
  );
}

export function PhotoBand({ src, label }: { src: string; label: string }) {
  return (
    <Suspense fallback={<div className="photo-band"><img src={src} alt={label} loading="lazy" /><div className="photo-band-shade" /><span className="photo-band-label">{label}</span></div>}>
      <PhotoBandMotion src={src} label={label} />
    </Suspense>
  );
}

export function Orbs() {
  return (
    <Suspense fallback={null}>
      <OrbsMotion />
    </Suspense>
  );
}
