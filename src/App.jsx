import { useEffect, useRef, useState } from "react";
import Folio from "./components/Folio.jsx";
import ShelfCanvas from "./components/ShelfCanvas.jsx";
import ShelfCursor from "./components/ShelfCursor.jsx";
import { browserLocale, isMobileBrowser, locales, readLocale, storeLocale } from "./data/content.js";

function detectWeChat() {
  if (typeof navigator === "undefined") return { isWeChat: false, isIOS: false };
  const ua = navigator.userAgent || "";
  const forced = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("wx") === "1";
  return {
    isWeChat: forced || /MicroMessenger/i.test(ua),
    isIOS: /iphone|ipad|ipod/i.test(ua),
  };
}

function WeChatGate({ copy, isIOS }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="wx-gate" role="dialog" aria-modal="true" aria-label={copy.ui.wxTitle}>
      <svg className="wx-arrow" width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true">
        <path
          d="M16 70 C 26 42, 46 28, 68 14"
          stroke="#f2d488"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="5 5"
        />
        <path
          d="M54 12 L70 13 L66 28"
          stroke="#fae19c"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="wx-card">
        <img className="wx-avatar" src="/logo.jpg" alt="Amico" />
        <div className="eyebrow">AMICO · ARCHIVE</div>
        <h2>{copy.ui.wxTitle}</h2>
        <p className="wx-body">{copy.ui.wxBody}</p>
        <ol className="wx-steps">
          <li><span>1</span>{copy.ui.wxStep1}</li>
          <li><span>2</span>{isIOS ? copy.ui.wxStep2Ios : copy.ui.wxStep2Android}</li>
        </ol>
        <button type="button" className={`wx-copy ${copied ? "copied" : ""}`} onClick={copyUrl}>
          {copied ? `✓ ${copy.ui.wxCopied}` : copy.ui.wxCopyLink}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [wxEnv] = useState(detectWeChat);
  if (wxEnv.isWeChat) {
    return <WeChatGate copy={locales[browserLocale()]} isIOS={wxEnv.isIOS} />;
  }
  return <ShelfApp />;
}

function ShelfApp() {
  const [isMobile] = useState(isMobileBrowser);
  const [rotateCopy] = useState(() => locales[browserLocale()].ui);
  const [locale, setLocale] = useState(readLocale);
  const [bookId, setBookId] = useState(null);
  const [lampOn, setLampOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [readIds, setReadIds] = useState([]);
  const [celebrationToast, setCelebrationToast] = useState(false);
  const [dismissRotate, setDismissRotate] = useState(false);
  const [swipeHint, setSwipeHint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [hover, setHover] = useState(null);
  const [progress, setProgress] = useState(0.05);
  const [tipIndex, setTipIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [shelf, setShelf] = useState(null);
  const celebratedRef = useRef(false);
  const copy = locales[locale];
  const bookIndex = copy.books.findIndex((item) => item.id === bookId);
  const book = bookIndex >= 0 ? copy.books[bookIndex] : null;

  useEffect(() => {
    if (ready) return undefined;
    const timer = window.setInterval(() => {
      setTipIndex((prev) => (prev + 1) % copy.ui.loadingTips.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [ready, copy.ui.loadingTips.length]);

  useEffect(() => {
    document.body.classList.toggle("open", Boolean(book));
    if (book) {
      shelf?.selectBook(book.id);
      setReadIds((prev) => (prev.includes(book.id) ? prev : [...prev, book.id]));
    } else {
      shelf?.close();
    }
  }, [book, shelf]);

  useEffect(() => {
    shelf?.setReadBooks(readIds);
  }, [readIds, shelf]);

  useEffect(() => {
    if (!book && readIds.length === copy.books.length && !celebratedRef.current && shelf) {
      celebratedRef.current = true;
      shelf.celebrate();
      setCelebrationToast(true);
      const timer = window.setTimeout(() => setCelebrationToast(false), 4600);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [book, readIds, copy.books.length, shelf]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = copy.ui.pageTitle;
  }, [locale, copy.ui.pageTitle]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setBookId(null);
        return;
      }
      if (bookIndex < 0) return;
      if (event.key === "ArrowLeft") {
        const prev = copy.books[(bookIndex - 1 + copy.books.length) % copy.books.length];
        setBookId(prev.id);
      } else if (event.key === "ArrowRight") {
        const next = copy.books[(bookIndex + 1) % copy.books.length];
        setBookId(next.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookIndex, copy.books]);

  const switchLocale = () => {
    const next = locale === "en" ? "zh" : "en";
    storeLocale(next);
    setLocale(next);
  };

  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled));
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = document.documentElement;
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document)?.catch?.(() => {});
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
    }
  };

  useEffect(() => {
    if (!swipeHint) return undefined;
    const hide = () => setSwipeHint(false);
    const timer = window.setTimeout(hide, 3600);
    window.addEventListener("pointerdown", hide, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", hide);
    };
  }, [swipeHint]);

  const handleDismissRotate = () => {
    setDismissRotate(true);
    setSwipeHint(true);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    shelf?.setSoundEnabled(next);
  };

  return (
    <>
      <ShelfCanvas
        books={copy.books}
        onOpen={(item) => { setHover(null); setBookId(item.id); }}
        onLampToggle={(on) => setLampOn(on)}
        onHoverChange={(info) => setHover(info)}
        onProgress={(ratio) => setProgress(ratio)}
        onReady={(api) => { setShelf(api); setReady(true); }}
      />
      <header>
        <div className="brand">
          <img className="portrait" src="/logo.jpg" alt="" />
          <h1>{copy.site.name}</h1>
        </div>
        <div className="head-side">
          <div className="head-actions">
            <button
              className={`sound-btn ${soundOn ? "on" : ""}`}
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={copy.ui.soundLabel}
            >
              <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>
              <span className="btn-label">{soundOn ? copy.ui.soundOn : copy.ui.soundOff}</span>
            </button>
            {canFullscreen && (
              <button
                className={`fs-btn ${isFullscreen ? "on" : ""}`}
                type="button"
                onClick={toggleFullscreen}
                aria-pressed={isFullscreen}
                aria-label={isFullscreen ? copy.ui.fullscreenExit : copy.ui.fullscreenEnter}
                title={isFullscreen ? copy.ui.fullscreenExit : copy.ui.fullscreenEnter}
              >
                {isFullscreen ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )}
            <button className="lang" type="button" onClick={switchLocale} aria-label={copy.ui.switchLabel}>
              {copy.ui.switchText}
            </button>
          </div>
        </div>
      </header>
      <div className={`celebrate-toast ${celebrationToast ? "show" : ""}`} role="status" aria-live="polite">
        ✦ {copy.ui.allReadToast}
      </div>
      <div className={`swipe-hint ${swipeHint && !book ? "show" : ""}`} aria-hidden={!swipeHint}>
        {rotateCopy.portraitSwipeHint}
      </div>
      <footer>
        <a href={`mailto:${copy.site.email}`}>{copy.site.email}</a>
        {" · "}
        <a href={copy.site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
      <Folio
        book={book}
        books={copy.books}
        copy={copy}
        onSelectBook={(id) => setBookId(id)}
        onClose={() => setBookId(null)}
      />
      {isMobile && !dismissRotate && (
        <div id="rotate-tip" role="dialog" aria-modal="true" aria-label={rotateCopy.rotateTitle}>
          <div className="rotate-card">
            <svg className="rotate-icon" width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <rect x="20" y="10" width="24" height="44" rx="5" stroke="#f2d488" strokeWidth="2.5" />
              <line x1="28" y1="48" x2="36" y2="48" stroke="#f2d488" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M51 22a20 20 0 0 1 0 20" stroke="#e6bd66" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
              <path d="M48 39l3 4 4-3" stroke="#e6bd66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="eyebrow">AMICO · ARCHIVE</div>
            <h2>{rotateCopy.rotateTitle}</h2>
            <p>{rotateCopy.rotateBody}</p>
            <button type="button" className="rotate-skip" onClick={handleDismissRotate}>
              {rotateCopy.rotateSkip}
            </button>
          </div>
        </div>
      )}
      <div id="loading" className={ready ? "hide" : ""}>
        <div className="loading-card">
          <div className="eyebrow">AMICO · A SHELF</div>
          <h2>{copy.ui.loading}</h2>
          <div className="bar">
            <i style={{ width: `${Math.max(8, Math.round(progress * 100))}%` }} />
          </div>
          <div className="loading-pct">{Math.round(progress * 100)}%</div>
          <p className="loading-tip" key={tipIndex}>
            {copy.ui.loadingTips[tipIndex]}
          </p>
        </div>
      </div>
      <ShelfCursor hover={hover} copy={copy} lampOn={lampOn} folioOpen={Boolean(book)} />
    </>
  );
}
