export default function Medallion({ id }) {
  if (id === "about") {
    return (
      <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" fill="none">
        <circle cx="32" cy="32" r="24" stroke="#f2d488" strokeWidth="1.6" strokeDasharray="3 3" />
        <circle cx="32" cy="32" r="18" stroke="#f2d488" strokeWidth="1.2" opacity="0.7" />
        <path d="M35 19a13 13 0 1 0 4 24 10 10 0 1 1-4-24z" fill="#fae19c" />
        <path d="M43 22l1.4 3.6L48 27l-3.6 1.4L43 32l-1.4-3.6L38 27l3.6-1.4z" fill="#fae19c" />
      </svg>
    );
  }
  if (id === "projects") {
    return (
      <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" fill="none">
        <circle cx="32" cy="32" r="22" stroke="#f2d488" strokeWidth="1.4" opacity="0.7" />
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(-28 32 32)" stroke="#f2d488" strokeWidth="1.4" />
        <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(28 32 32)" stroke="#f2d488" strokeWidth="1.4" />
        <path d="M19 39L45 37L33 17Z" stroke="#fae19c" strokeWidth="1.5" />
        <circle cx="19" cy="39" r="3.5" fill="#fae19c" />
        <circle cx="45" cy="37" r="3.5" fill="#fae19c" />
        <circle cx="33" cy="17" r="4" fill="#fae19c" />
      </svg>
    );
  }
  if (id === "craft") {
    return (
      <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" fill="none">
        <polygon points="32,9 52,20.5 52,43.5 32,55 12,43.5 12,20.5" stroke="#f2d488" strokeWidth="1.5" opacity="0.75" />
        <path d="M20 24L32 18L44 24M20 24L32 32L44 24M20 40L32 32L44 40M20 40L32 46L44 40" stroke="#fae19c" strokeWidth="1.3" opacity="0.8" />
        <circle cx="20" cy="24" r="2.8" fill="#fae19c" />
        <circle cx="20" cy="40" r="2.8" fill="#fae19c" />
        <circle cx="32" cy="18" r="2.8" fill="#fae19c" />
        <circle cx="32" cy="32" r="3.4" fill="#fae19c" />
        <circle cx="32" cy="46" r="2.8" fill="#fae19c" />
        <circle cx="44" cy="24" r="2.8" fill="#fae19c" />
        <circle cx="44" cy="40" r="2.8" fill="#fae19c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true" fill="none">
      <circle cx="32" cy="32" r="22" stroke="#f2d488" strokeWidth="1.6" />
      <ellipse cx="32" cy="32" rx="11" ry="22" stroke="#f2d488" strokeWidth="1.2" opacity="0.65" />
      <line x1="10" y1="32" x2="54" y2="32" stroke="#f2d488" strokeWidth="1.2" opacity="0.65" />
      <circle cx="32" cy="32" r="10" fill="#59321b" stroke="#fae19c" strokeWidth="1.8" />
      <text x="32" y="37" textAnchor="middle" fill="#fae19c" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">A</text>
    </svg>
  );
}
