export default function Medallion({ id }) {
  if (id === "about") {
    return (
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <path d="M42 12a18 18 0 1 0 2 34 14 14 0 1 1-2-34z" fill="#ffe7b5" />
      </svg>
    );
  }
  if (id === "projects") {
    return (
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <circle cx="18" cy="40" r="6" fill="#ff8ea0" />
        <circle cx="32" cy="28" r="7" fill="#7eb6ff" />
        <circle cx="48" cy="18" r="5" fill="#7ee0c6" />
      </svg>
    );
  }
  if (id === "craft") {
    return (
      <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
        <path d="M32 10v10" stroke="#ffe7b5" strokeWidth="3" />
        <ellipse cx="32" cy="34" rx="12" ry="16" fill="#7ee0c6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width="40" height="40" aria-hidden="true">
      <rect x="14" y="20" width="36" height="26" rx="3" fill="#fff6e4" />
      <circle cx="32" cy="33" r="7" fill="#e25b4a" />
    </svg>
  );
}
