import { useEffect, useState } from "react";
import Folio from "./components/Folio.jsx";
import ShelfCanvas from "./components/ShelfCanvas.jsx";
import { locales, readLocale, storeLocale } from "./data/content.js";

export default function App() {
  const [locale, setLocale] = useState(readLocale);
  const [bookId, setBookId] = useState(null);
  const [ready, setReady] = useState(false);
  const [shelf, setShelf] = useState(null);
  const copy = locales[locale];
  const book = copy.books.find((item) => item.id === bookId) || null;

  useEffect(() => {
    document.body.classList.toggle("open", Boolean(book));
    if (!book) shelf?.close();
  }, [book, shelf]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    document.title = copy.ui.pageTitle;
  }, [locale, copy.ui.pageTitle]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setBookId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const switchLocale = () => {
    const next = locale === "en" ? "zh" : "en";
    storeLocale(next);
    setLocale(next);
  };

  return (
    <>
      <ShelfCanvas books={copy.books} onOpen={(item) => setBookId(item.id)} onReady={(api) => { setShelf(api); setReady(true); }} />
      <header>
        <div className="brand">
          <img className="portrait" src="/logo.jpg" alt="" />
          <div>
            <h1>{copy.site.name}</h1>
            <p>{copy.site.tagline}</p>
          </div>
        </div>
        <div className="head-side">
          <div className="head-actions">
            <div className="badge">{copy.site.badge}</div>
            <button className="lang" type="button" onClick={switchLocale} aria-label={copy.ui.switchLabel}>
              {copy.ui.switchText}
            </button>
          </div>
          <p className="hint">{copy.site.hint}</p>
        </div>
      </header>
      <footer>
        <a href={`mailto:${copy.site.email}`}>{copy.site.email}</a>
        {" · "}
        <a href={copy.site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
      <Folio book={book} copy={copy} onClose={() => setBookId(null)} />
      <div id="loading" className={ready ? "hide" : ""}>
        <div className="loading-card">
          <div className="eyebrow">AMICO · A SHELF</div>
          <h2>{copy.ui.loading}</h2>
          <div className="bar"><i /></div>
        </div>
      </div>
    </>
  );
}
