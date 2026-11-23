import { useEffect, useRef, useState } from "react";

function resolveTag(hover, copy, lampOn) {
  if (!hover) return "";
  if (hover.type === "liveCat") return copy.ui.cursorCatBack;
  if (hover.type === "book") {
    return `${copy.ui.cursorRead} · ${hover.title}`;
  }
  if (hover.type === "ornament") {
    if (hover.kind === "lamp") return lampOn ? copy.ui.cursorLampOff : copy.ui.cursorLampOn;
    if (hover.kind === "moon") return copy.ui.cursorMoon;
    if (hover.kind === "rocket") return copy.ui.cursorRocket;
    if (hover.kind === "cat") return copy.ui.cursorCatWake;
    if (hover.kind === "owl") return copy.ui.cursorOwl;
    if (hover.kind === "rose") return copy.ui.cursorRose;
    return copy.ui.cursorTap;
  }
  return "";
}

export default function ShelfCursor({ hover, copy, lampOn, folioOpen }) {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const tagRef = useRef(null);
  const rippleRef = useRef(null);
  const hoverRef = useRef(hover);
  const folioRef = useRef(folioOpen);

  hoverRef.current = hover;
  folioRef.current = folioOpen;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-custom-cursor", enabled);
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;
    let visible = false;
    let pressed = false;
    let domInteractive = false;
    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };

    const setVisible = (next) => {
      visible = next;
      const opacity = next ? "1" : "0";
      if (dotRef.current) dotRef.current.style.opacity = opacity;
      if (ringRef.current) ringRef.current.style.opacity = opacity;
      if (tagRef.current && !next) tagRef.current.style.opacity = "0";
    };

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        ring.x = target.x;
        ring.y = target.y;
        setVisible(true);
      }
      domInteractive = Boolean(event.target?.closest?.("a, button, [role='button']"));
    };

    const onDown = () => {
      pressed = true;
      if (rippleRef.current) {
        rippleRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        rippleRef.current.classList.remove("pop");
        void rippleRef.current.offsetWidth;
        rippleRef.current.classList.add("pop");
      }
    };

    const onUp = () => {
      pressed = false;
    };

    const onLeave = () => {
      pressed = false;
      setVisible(false);
    };

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.22;
      ring.y += (target.y - ring.y) * 0.22;

      const sceneInteractive = !folioRef.current && Boolean(hoverRef.current);
      const active = domInteractive || sceneInteractive;
      const scale = pressed ? 0.8 : active ? 1.48 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(${pressed ? 0.72 : 1})`;
        dotRef.current.classList.toggle("active", active);
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) scale(${scale})`;
        ringRef.current.classList.toggle("active", active);
      }
      if (tagRef.current) {
        const flipLeft = ring.x > window.innerWidth - 165;
        const offsetX = flipLeft ? -26 : 26;
        tagRef.current.style.transform = `translate3d(${ring.x + offsetX}px, ${ring.y - 2}px, 0) translate(${flipLeft ? "-100%" : "0"}, -50%)`;
        const showTag = visible && !folioRef.current && Boolean(hoverRef.current) && !domInteractive;
        tagRef.current.style.opacity = showTag ? "1" : "0";
      }

      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const tagText = resolveTag(hover, copy, lampOn);

  return (
    <div className={`shelf-cursor ${folioOpen ? "folio-mode" : ""}`} aria-hidden="true">
      <div className="cursor-ripple" ref={rippleRef} />
      <div className="cursor-ring" ref={ringRef} />
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-tag" ref={tagRef}>{tagText}</div>
    </div>
  );
}
