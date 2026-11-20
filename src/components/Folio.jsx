import { themes } from "../data/content.js";
import Medallion from "./Medallion.jsx";

function Corner({ place }) {
  return <i className={`corner ${place}`} aria-hidden="true" />;
}

function Rule() {
  return (
    <div className="rule" aria-hidden="true">
      <i />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M8 1l1.6 4.2L14 6.2 11 9l.8 4.6L8 11.4 4.2 13.6 5 9 2 6.2l4.4-1z" fill="#e6bd66" />
      </svg>
      <i />
    </div>
  );
}

function Page({ book, copy }) {
  if (book.id === "about") {
    return (
      <>
        <img className="about-photo" src="/logo.jpg" alt="Amico" />
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
    return copy.projects.map((item) => (
      <div className="project" key={item.title}>
        <b>{item.title}</b>
        <div className="tech">{item.tech}</div>
        <p>{item.body}</p>
        <a href={item.href} target="_blank" rel="noopener noreferrer">{item.cta} →</a>
      </div>
    ));
  }
  if (book.id === "craft") {
    return copy.skills.map((item) => (
      <div className="skill" key={item.title}>
        <b>{item.title}</b>
        <p>{item.body}</p>
      </div>
    ));
  }
  return (
    <>
      <p>{copy.ui.contactLead}</p>
      <div className="chips">
        <a href={`mailto:${copy.site.email}`}>{copy.site.email}</a>
        <a href={copy.site.github} target="_blank" rel="noopener noreferrer">github.com/Tom-kkk</a>
      </div>
      <div className="wechat-card">
        <img src="/wechat.jpg" alt={copy.ui.wechatAlt} />
        <small>{copy.ui.wechatCaption}</small>
      </div>
    </>
  );
}

export default function Folio({ book, copy, onClose }) {
  if (!book) return null;
  return (
    <div id="page" onClick={(event) => { if (event.target.id === "page") onClose(); }}>
      <article className="folio" role="dialog" aria-modal="true" aria-labelledby="folio-title" style={{ "--cloth": themes[book.id].cloth }}>
        <Corner place="tl" />
        <Corner place="tr" />
        <Corner place="bl" />
        <Corner place="br" />
        <button className="folio-close" type="button" aria-label={copy.ui.closeLabel} onClick={onClose}>×</button>
        <div className="folio-scroll">
          <div className="folio-head">
            <div className="medallion"><Medallion id={book.id} /></div>
            <div>
              <div className="eyebrow">{book.eyebrow}</div>
              <h2 id="folio-title">{book.heading}</h2>
            </div>
          </div>
          <Rule />
          <div className="folio-body">
            <Page book={book} copy={copy} />
          </div>
        </div>
      </article>
    </div>
  );
}
