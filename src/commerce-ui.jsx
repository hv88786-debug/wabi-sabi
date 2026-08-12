import { useState, useEffect, useRef, useCallback } from "react";
import { FadeImage } from "./media";
import { useCommerce } from "./commerce-store";
import { formatINR, MEGA_MENU, NAV_LINKS, ANNOUNCEMENTS } from "./commerce-data";
import {
  HeartIcon,
  StarIcon,
  BagIcon,
  ChevronIcon,
  ArrowUpIcon,
} from "./commerce-icons";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

// True once the window has scrolled past `threshold` px. Used to shrink the
// header and reveal the back-to-top button.
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

// Mimics a first-paint fetch: returns `true` for `ms`, then `false`. Lets the
// product grids show skeletons briefly so the page feels like a live store.
export function useInitialLoad(ms = 650) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

// ---------------------------------------------------------------------------
// Rating stars
// ---------------------------------------------------------------------------

export function Stars({ rating, reviews, size = 13 }) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    if (rating >= i) return "full";
    if (rating >= i - 0.5) return "half";
    return "empty";
  });
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5 text-[#B5502D]" role="img" aria-label={`Rated ${rating} out of 5`}>
        {stars.map((f, i) => (
          <StarIcon key={i} fill={f} size={size} />
        ))}
      </span>
      {reviews != null && <span className="text-xs text-[#6B6459]">({reviews})</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Product card — the workhorse. Image opens quick view; heart toggles the
// wishlist; the button adds to cart. Layout mirrors the site's existing
// cards (serif name, muted meta, price on the right).
// ---------------------------------------------------------------------------

export function ProductCard({ product, sizes, className = "" }) {
  const { openQuickView, toggleWishlist, isWishlisted, addWithToast } = useCommerce();
  const wished = isWishlisted(product.id);

  return (
    <article className={`group ${className}`}>
      <div className="relative overflow-hidden rounded-[8px] bg-[#F1EAE0] aspect-[4/5] mb-5 transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_16px_32px_-14px_rgba(36,33,29,0.16)]">
        <FadeImage
          src={product.img}
          alt={product.alt}
          hoverScale
          sizes={sizes}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
        />

        {/* Quick-view: full-cover button so tapping the image opens the modal */}
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          aria-label={`Quick view: ${product.name}`}
          className="absolute inset-0 z-10 flex items-end justify-center pb-5 focus:outline-none"
        >
          <span className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#FAF7F2]/95 backdrop-blur-sm text-[#24211D] text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full shadow-[0_4px_16px_-6px_rgba(36,33,29,0.35)]">
            Quick View
          </span>
        </button>

        {product.badge && (
          <span className="absolute top-4 left-4 z-20 text-xs tracking-[0.1em] uppercase bg-[#FAF7F2] text-[#24211D] px-2.5 py-1 rounded-[4px] shadow-[0_1px_3px_rgba(36,33,29,0.08)]">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wished}
          className={`absolute top-3.5 right-3.5 z-20 grid place-items-center w-9 h-9 rounded-full transition-[background-color,color,transform,box-shadow] duration-200 ease-out active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 ${
            wished
              ? "bg-[#B5502D] text-[#FAF7F2]"
              : "bg-[#FAF7F2]/90 text-[#24211D] hover:bg-[#FAF7F2]"
          }`}
        >
          <HeartIcon filled={wished} size={17} />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          className="font-serif text-lg text-[#24211D] text-left hover:text-[#B5502D] transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
        >
          {product.name}
        </button>
        <p className="font-serif text-lg text-[#24211D] shrink-0">{formatINR(product.price)}</p>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <p className="text-sm text-[#6B6459]">{product.material}</p>
        <Stars rating={product.rating} reviews={product.reviews} />
      </div>

      <button
        type="button"
        onClick={() => addWithToast(product.id)}
        className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium tracking-[0.02em] text-[#24211D] border border-[#24211D] rounded-[4px] py-3 hover:bg-[#24211D] hover:text-[#FAF7F2] transition-[background-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
      >
        <BagIcon size={16} />
        Add to Bag
      </button>
    </article>
  );
}

// Skeleton placeholder shown while the "catalogue" loads.
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="rounded-[8px] bg-[#EFE7DA] aspect-[4/5] mb-5" />
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-1/2 rounded bg-[#EFE7DA]" />
        <div className="h-4 w-14 rounded bg-[#EFE7DA]" />
      </div>
      <div className="h-3 w-2/3 rounded bg-[#EFE7DA] mb-5" />
      <div className="h-11 w-full rounded-[4px] bg-[#EFE7DA]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Announcement slider — auto-rotating, pauses on hover, with manual arrows
// and a polite live region.
// ---------------------------------------------------------------------------

export function AnnouncementSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = ANNOUNCEMENTS.length;

  const go = useCallback((next) => setIndex((i) => (next + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 4200);
    return () => clearInterval(t);
  }, [paused, count]);

  return (
    <div
      className="bg-[#24211D] text-[#FAF7F2]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-9 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous announcement"
          className="hidden sm:grid place-items-center w-6 h-6 rounded-full text-[#C9C2B4] hover:text-[#FAF7F2] transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FAF7F2]"
        >
          <ChevronIcon dir="left" size={13} />
        </button>

        <div className="relative flex-1 sm:flex-none sm:min-w-[520px] h-9 overflow-hidden text-center">
          {ANNOUNCEMENTS.map((msg, i) => (
            <p
              key={i}
              aria-hidden={i !== index}
              className={`absolute inset-0 flex items-center justify-center text-xs tracking-[0.08em] font-medium transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === index
                  ? "opacity-100 translate-y-0"
                  : i < index
                  ? "opacity-0 -translate-y-2"
                  : "opacity-0 translate-y-2"
              }`}
            >
              {msg}
            </p>
          ))}
          <span className="sr-only" aria-live="polite">
            {ANNOUNCEMENTS[index]}
          </span>
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next announcement"
          className="hidden sm:grid place-items-center w-6 h-6 rounded-full text-[#C9C2B4] hover:text-[#FAF7F2] transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FAF7F2]"
        >
          <ChevronIcon dir="right" size={13} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop mega menu — hover/focus reveals a full-width panel with link
// columns and a featured promo. Closes on mouse-leave or Escape.
// ---------------------------------------------------------------------------

export function MegaMenu() {
  const [active, setActive] = useState(null);
  const closeTimer = useRef(null);

  const open = useCallback((label) => {
    clearTimeout(closeTimer.current);
    setActive(label);
  }, []);

  // Small delay on leave so diagonal mouse travel to the panel doesn't close it.
  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 120);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const menu = active ? MEGA_MENU[active] : null;

  return (
    <div
      className="hidden lg:block"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => clearTimeout(closeTimer.current)}
    >
      <nav className="flex items-center gap-10" aria-label="Categories">
        {NAV_LINKS.map((label) => (
          <button
            key={label}
            type="button"
            onMouseEnter={() => open(label)}
            onFocus={() => open(label)}
            aria-expanded={active === label}
            className={`relative text-sm tracking-[0.03em] py-6 transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D] ${
              active === label ? "text-[#B5502D]" : "text-[#24211D] hover:text-[#B5502D]"
            }`}
          >
            {label}
            <span
              className={`absolute left-0 -bottom-px h-px bg-[#B5502D] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active === label ? "w-full" : "w-0"
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Panel */}
      <div
        className={`absolute left-0 right-0 top-full bg-[#FAF7F2] border-t border-[#E4DDD0]/70 shadow-[0_24px_40px_-24px_rgba(36,33,29,0.25)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {menu && (
          <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-12 gap-10">
            <div className="col-span-7 grid grid-cols-2 gap-8">
              {menu.columns.map((col) => (
                <div key={col.heading}>
                  <p className="text-xs tracking-[0.14em] uppercase text-[#6B6459] mb-4">{col.heading}</p>
                  <ul className="space-y-3">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[15px] text-[#24211D] hover:text-[#B5502D] transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <a
              href="#"
              className="col-span-5 group relative overflow-hidden rounded-[8px] min-h-[240px] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
            >
              <FadeImage
                src={menu.featured.img}
                alt={menu.featured.alt}
                hoverScale
                sizes="40vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-serif text-2xl text-[#FAF7F2] mb-1">{menu.featured.label}</p>
                <p className="text-sm text-[#F1EAE0]/90">{menu.featured.copy}</p>
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Back to top — fades in after scrolling down a screen.
// ---------------------------------------------------------------------------

export function BackToTop() {
  const show = useScrolled(600);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-30 grid place-items-center w-12 h-12 rounded-full bg-[#24211D] text-[#FAF7F2] shadow-[0_10px_28px_-10px_rgba(36,33,29,0.6)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#B5502D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUpIcon size={18} />
    </button>
  );
}
