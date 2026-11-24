import { useEffect, useRef, useState } from "react";
import { mountShelf } from "../scene/mountShelf.js";

export default function ShelfCanvas({ books, onOpen, onLampToggle, onHoverChange, onProgress, onReady }) {
  const [canvasKey, setCanvasKey] = useState(0);
  const canvasRef = useRef(null);
  const booksRef = useRef(books);
  const apiRef = useRef(null);
  const onOpenRef = useRef(onOpen);
  const onLampToggleRef = useRef(onLampToggle);
  const onHoverChangeRef = useRef(onHoverChange);
  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);
  booksRef.current = books;
  onOpenRef.current = onOpen;
  onLampToggleRef.current = onLampToggle;
  onHoverChangeRef.current = onHoverChange;
  onProgressRef.current = onProgress;
  onReadyRef.current = onReady;

  useEffect(() => {
    apiRef.current?.applyBooks(books);
  }, [books]);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    let api;
    let cancelled = false;
    mountShelf(canvasRef.current, {
      books: booksRef.current,
      onOpen: (book) => onOpenRef.current(book),
      onLampToggle: (on) => onLampToggleRef.current?.(on),
      onHoverChange: (info) => onHoverChangeRef.current?.(info),
      onProgress: (ratio) => onProgressRef.current?.(ratio),
      onContextLost: () => {
        if (!cancelled) setCanvasKey((k) => k + 1);
      },
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
  }, [canvasKey]);

  return <canvas key={canvasKey} id="gl" ref={canvasRef} />;
}
