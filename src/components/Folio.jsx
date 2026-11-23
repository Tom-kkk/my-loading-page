import { useEffect, useRef, useState } from "react";
import { themes } from "../data/content.js";
import Medallion from "./Medallion.jsx";

function Corner({ place }) {
  return <i className={`corner ${place}`} aria-hidden="true" />;
}

function Rule() {
  return (
    <div className="rule" aria-hidden="true">
      <i />
      <svg width="15" height="15" viewBox="0 0 16 16">
        <path d="M8 1l1.5 5.5L15 8l-5.5 1.5L8 15l-1.5-5.5L1 8l5.5-1.5z" fill="#d9a45c" />
      </svg>
      <i />
    </div>
  );
}

function Page({ book, copy }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copy.site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${copy.site.email}`;
    }
  };

  if (book.id === "about") {
    return (
      <>
        <img className="about-photo" src="/logo.jpg" alt="Amico" />
        <div className="about-meta">{copy.ui.aboutMeta}</div>
        <p>{copy.about.lead}</p>
        <div className="divider" />
        <h3>{copy.ui.stackHeading}</h3>
        <p>{copy.about.stack}</p>
        <div className="chips">
          {copy.about.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </>
    );
  }
  if (book.id === "projects") {
    return copy.projects.map((item, idx) => {
      const techs = item.tech.split("·").map((s) => s.trim()).filter(Boolean);
      return (
        <div className="project" key={item.title}>
          <div className="project-head">
            <span className="project-num">{String(idx + 1).padStart(2, "0")}</span>
            <b>{item.title}</b>
          </div>
          <div className="project-tags">
            {techs.map((t) => <span key={t}>{t}</span>)}
          </div>
          <p>{item.body}</p>
          <a className="project-link" href={item.href} target="_blank" rel="noopener noreferrer">
            {item.cta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      );
    });
  }
  if (book.id === "craft") {
    return (
      <div className="skill-grid">
        {copy.skills.map((item, idx) => (
          <div className="skill" key={item.title}>
            <span className="skill-num">{String(idx + 1).padStart(2, "0")}</span>
            <b>{item.title}</b>
            <p>{item.body}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      <p>{copy.ui.contactLead}</p>
      <div className="chips">
        <a href={`mailto:${copy.site.email}`}>{copy.site.email}</a>
        <button className={`chip-btn ${copied ? "copied" : ""}`} type="button" onClick={handleCopy}>
          {copied ? `✓ ${copy.ui.copiedEmail}` : copy.ui.copyEmail}
        </button>
        <a href={copy.site.github} target="_blank" rel="noopener noreferrer">github.com/Tom-kkk ↗</a>
      </div>
      <div className="wechat-card">
        <img src="/wechat.jpg" alt={copy.ui.wechatAlt} />
        <small>{copy.ui.wechatCaption}</small>
        <span className="reply-hint">{copy.ui.replyHint}</span>
      </div>
    </>
  );
}

export default function Folio({ book, books, copy, onSelectBook, onClose }) {
  const touchRef = useRef(null);
  const [rendered, setRendered] = useState(book);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (book) {
      setRendered(book);
      setClosing(false);
      return undefined;
    }
    if (!rendered) return undefined;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setRendered(null);
      setClosing(false);
    }, 200);
    return () => window.clearTimeout(timer);
  }, [book, rendered]);

  if (!rendered) return null;
  const activeBook = books.find((item) => item.id === rendered.id) || rendered;
  const index = books.findIndex((item) => item.id === activeBook.id);
  const prevBook = books[(index - 1 + books.length) % books.length];
  const nextBook = books[(index + 1) % books.length];
  const theme = themes[activeBook.id];

  const onTouchStart = (event) => {
    const t = event.touches?.[0];
    if (!t) return;
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (event) => {
    const start = touchRef.current;
    touchRef.current = null;
    const t = event.changedTouches?.[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      onSelectBook(dx < 0 ? nextBook.id : prevBook.id);
    }
  };

  return (
    <div id="page" className={closing ? "closing" : ""} onClick={(event) => { if (event.target.id === "page") onClose(); }}>
      <article
        key={activeBook.id}
        className={`folio ${closing ? "closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="folio-title"
        style={{ "--cloth": theme.cloth, "--seal": theme.seal }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <i className="folio-crease" aria-hidden="true" />
        <i className="folio-ribbon" aria-hidden="true" />
        <Corner place="tl" />
        <Corner place="tr" />
        <Corner place="bl" />
        <Corner place="br" />
        <button className="folio-close" type="button" aria-label={copy.ui.closeLabel} onClick={onClose}>×</button>
        <div className="folio-scroll">
          <div className="folio-head">
            <div className="medallion"><Medallion id={activeBook.id} /></div>
            <div>
              <div className="eyebrow">{activeBook.eyebrow}</div>
              <h2 id="folio-title">{activeBook.heading}</h2>
            </div>
          </div>
          <Rule />
          <div className="folio-body">
            <Page book={activeBook} copy={copy} />
          </div>
          <nav className="folio-nav" aria-label="Chapter navigation">
            <button type="button" onClick={() => onSelectBook(prevBook.id)}>
              <span className="nav-dir">← {copy.ui.prevChapter}</span>
              <strong>{prevBook.title}</strong>
            </button>
            <div className="folio-dots" aria-hidden="true">
              {books.map((item) => (
                <i key={item.id} className={item.id === activeBook.id ? "active" : ""} />
              ))}
            </div>
            <button type="button" className="next" onClick={() => onSelectBook(nextBook.id)}>
              <span className="nav-dir">{copy.ui.nextChapter} →</span>
              <strong>{nextBook.title}</strong>
            </button>
          </nav>
        </div>
      </article>
    </div>
  );
}
