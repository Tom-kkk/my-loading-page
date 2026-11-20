import { useEffect, useRef } from "react";
import { mountShelf } from "../scene/mountShelf.js";

export default function ShelfCanvas({ books, onOpen, onReady }) {
  const canvasRef = useRef(null);
  const booksRef = useRef(books);
  const apiRef = useRef(null);
  const onOpenRef = useRef(onOpen);
  const onReadyRef = useRef(onReady);
  booksRef.current = books;
  onOpenRef.current = onOpen;
  onReadyRef.current = onReady;

  useEffect(() => {
    apiRef.current?.applyBooks(books);
  }, [books]);

  useEffect(() => {
    let api;
    let cancelled = false;
    mountShelf(canvasRef.current, {
      books: booksRef.current,
      onOpen: (book) => onOpenRef.current(book),
    }).then((next) => {
      if (cancelled) {
        next.dispose();
        return;
      }
      api = next;
      apiRef.current = next;
      next.applyBooks(booksRef.current);
      onReadyRef.current(next);
    }).catch((error) => {
      const title = document.querySelector("#loading h2");
      if (title) title.textContent = error?.message || String(error);
    });
    return () => {
      cancelled = true;
      api?.dispose();
    };
  }, []);

  return <canvas id="gl" ref={canvasRef} />;
}
