// Small, consistent line icons (1.3 stroke) matching the existing set in
// Home.jsx. Every icon inherits `currentColor` so colour is set by the
// parent's text colour.

export function HeartIcon({ filled = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="block" aria-hidden="true">
      <path
        d="M10 16.5S3 12.4 3 7.9A3.4 3.4 0 0 1 10 6a3.4 3.4 0 0 1 7 1.9c0 4.5-7 8.6-7 8.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

export function StarIcon({ fill = "full", size = 13 }) {
  // fill: "full" | "half" | "empty"
  const id = `half-${Math.random().toString(36).slice(2, 8)}`;
  const solid = fill === "full" ? "currentColor" : fill === "empty" ? "none" : `url(#${id})`;
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="block" aria-hidden="true">
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M10 1.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.9 5.2 17.5l.9-5.4L2.2 8.3l5.4-.8L10 1.8Z"
        fill={solid}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className="block" aria-hidden="true">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className="block" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function BagIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className="block" aria-hidden="true">
      <path d="M4 6h10l-1 9H5L4 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function ChevronIcon({ dir = "down", size = 14 }) {
  const d =
    dir === "down"
      ? "M3 6l5 5 5-5"
      : dir === "up"
      ? "M3 10l5-5 5 5"
      : dir === "left"
      ? "M10 3L5 8l5 5"
      : "M6 3l5 5-5 5";
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="block" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="block" aria-hidden="true">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function MinusIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="block" aria-hidden="true">
      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="block" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className="block" aria-hidden="true">
      <path d="M9 15V3M4 8l5-5 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
