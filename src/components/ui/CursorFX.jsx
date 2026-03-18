import { useEffect, useRef, useState } from 'react';

function supportsHoverFinePointer() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false;
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

export default function CursorFX() {
  const [enabled, setEnabled] = useState(false);
  const target = useRef({ x: -200, y: -200 });

  useEffect(() => {
    if (!supportsHoverFinePointer()) return;
    if (prefersReducedMotion()) return;

    setEnabled(true);

    const root = document.documentElement;

    // Write immediately on move to keep pointer feeling responsive.
    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      root.style.setProperty('--cursor-x', `${e.clientX}px`);
      root.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    const onLeave = () => {
      target.current.x = -200;
      target.current.y = -200;
      root.style.setProperty('--cursor-x', `-200px`);
      root.style.setProperty('--cursor-y', `-200px`);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      setEnabled(false);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      root.style.removeProperty('--cursor-x');
      root.style.removeProperty('--cursor-y');
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div aria-hidden className="cursor-fx-cursor">
        <span className="cursor-fx-dot" />
        <span className="cursor-fx-ring" />
      </div>
    </>
  );
}
