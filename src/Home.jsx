import { useState, useEffect, useRef, useCallback, memo } from "react";

const HERO_IMAGE_SRC =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=80&auto=format&fit=crop";

// Builds a responsive srcset from an Unsplash-style URL by varying its
// `w=` query param, so the browser can request a size that matches the
// viewport instead of always downloading the single largest variant.
function buildSrcSet(src) {
  const match = src.match(/[?&]w=(\d+)/);
  const baseWidth = match ? parseInt(match[1], 10) : 1200;
  const candidates = [400, 600, 800, 1000, 1200, 1600, 2000, 2400].filter(
    (w) => w <= baseWidth * 2
  );
  return candidates
    .map((w) => `${src.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`)
    .join(", ");
}

// Fades images in gently once loaded, and (optionally) carries the
// crop-zoom transform on hover — both animated on one shared,
// decelerating timing curve so nothing ever feels mechanical.
// `priority` skips the fade and forces eager/high-priority loading for
// the one image that matters for LCP (the hero); everything else stays
// lazy, async-decoded, and gets a `srcset` sized to how it's actually
// laid out. Memoized so a re-render elsewhere on the page (e.g. typing
// in the newsletter field) doesn't re-run every image's render logic.
const FadeImage = memo(function FadeImage({
  src,
  alt,
  className = "",
  hoverScale = false,
  priority = false,
  sizes = "100vw",
  ...rest
}) {
  const [loaded, setLoaded] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, []);

  const srcSet = buildSrcSet(src);

  const transitionClasses = priority
    ? ""
    : `${hoverScale ? "transition-[opacity,transform]" : "transition-opacity"} duration-[550ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        loaded ? "opacity-100" : "opacity-0"
      }`;

  return (
    <img
      ref={imgRef}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onLoad={() => setLoaded(true)}
      className={`${className} ${transitionClasses}`}
      {...rest}
    />
  );
});

const NAV_LINKS = ["Ceramics", "Textiles", "Lighting", "Furniture"];

// Static content, hoisted out of Home() so it's created once at module
// load instead of being reconstructed on every render (e.g. each
// newsletter-field keystroke re-renders Home and previously rebuilt
// every one of these arrays from scratch).
const NEW_ARRIVALS = [
  {
    img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80&auto=format&fit=crop",
    alt: "Handwoven rattan pendant lamp hanging above a reading corner",
    name: "Kochi Rattan Pendant",
    material: "Rattan, jute cord",
    price: "₹4,200",
  },
  {
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format&fit=crop",
    alt: "Set of hand-carved walnut serving spoons",
    name: "Carved Walnut Servers",
    material: "Solid walnut",
    price: "₹1,850",
  },
  {
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop",
    alt: "Block-printed cotton cushion covers in indigo and rust",
    name: "Sarasa Cushion Cover",
    material: "Block-printed cotton",
    price: "₹1,150",
  },
];

const BEST_SELLERS = [
  {
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80&auto=format&fit=crop",
    alt: "Hand-glazed ceramic dinner set stacked on a wooden counter",
    name: "Bhuj Dinner Set, 6-piece",
    price: "₹6,400",
  },
  {
    img: "https://images.unsplash.com/photo-1616627981276-b48d485ecf24?w=700&q=80&auto=format&fit=crop",
    alt: "Hand-knotted wool table runner in natural undyed tones",
    name: "Undyed Wool Runner",
    price: "₹2,600",
  },
  {
    img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=700&q=80&auto=format&fit=crop",
    alt: "Brass table lamp with a linen drum shade",
    name: "Mysore Brass Lamp",
    price: "₹5,100",
  },
  {
    img: "https://images.unsplash.com/photo-1616486338815-1ff81b3b3a1e?w=700&q=80&auto=format&fit=crop",
    alt: "Hand-carved wooden fruit bowl with a natural grain finish",
    name: "Sheesham Fruit Bowl",
    price: "₹1,650",
  },
];

const WHY_KALAA_ITEMS = [
  {
    n: "01",
    title: "Made by hand, not machine",
    copy: "Every piece passes through human hands more than once. Small imperfections are proof of that, not a flaw.",
  },
  {
    n: "02",
    title: "Sourced with the artisan in mind",
    copy: "We pay studios fairly and upfront, long before a piece reaches your home. No middlemen, no pressure batches.",
  },
  {
    n: "03",
    title: "Packed to travel, built to stay",
    copy: "Plastic-free packaging, cushioned in offcut fabric from our own textile partners. It arrives whole, and it stays that way.",
  },
];

const INSTAGRAM_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80&auto=format&fit=crop",
    alt: "Hand-carved walnut serving spoons, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80&auto=format&fit=crop",
    alt: "Glazed ceramic bowls and mugs, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80&auto=format&fit=crop",
    alt: "Brass and terracotta table lamps, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=500&q=80&auto=format&fit=crop",
    alt: "Woven jute and cotton rugs, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80&auto=format&fit=crop",
    alt: "Block-printed cotton cushion covers, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80&auto=format&fit=crop",
    alt: "Sand-toned stoneware pitcher from the Jaisalmer series, shared on Instagram by a customer",
  },
];

// Slide-over mobile navigation drawer. Self-contained: owns its own
// focus trap, ESC handling, and body-scroll lock, and is driven purely
// by the isOpen/onClose props so the open state stays reusable wherever
// it's triggered from. Memoized against re-renders from unrelated Home
// state (e.g. the newsletter input) as long as its props stay stable.
const MobileNavDrawer = memo(function MobileNavDrawer({ isOpen, onClose, triggerRef }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isFirstRender = useRef(true);

  // Body scroll lock while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Move focus into the drawer on open, and back to the trigger on
  // close — skipped on first mount so the trigger isn't focused
  // on initial page load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isOpen) {
      closeButtonRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // ESC to close, and a manual focus trap for Tab / Shift+Tab.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay — click to close */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-[#24211D]/40 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        id="mobile-nav-drawer"
        className={`absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-[#FAF7F2] shadow-[8px_0_40px_-16px_rgba(36,33,29,0.25)] flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#E4DDD0]/70">
          <span className="font-serif text-2xl tracking-[0.01em] text-[#24211D]">Kalaa</span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={isOpen ? 0 : -1}
            className="p-2 -mr-2 rounded-[4px] hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
              <path d="M4 4L14 14M14 4L4 14" stroke="#24211D" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Categories">
          <ul className="space-y-1">
            {NAV_LINKS.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  onClick={onClose}
                  tabIndex={isOpen ? 0 : -1}
                  className="block py-3 font-serif text-xl text-[#24211D] hover:text-[#B5502D] transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-6 py-6 border-t border-[#E4DDD0]/70 flex items-center gap-6">
          <a
            href="#"
            onClick={onClose}
            aria-label="Search"
            tabIndex={isOpen ? 0 : -1}
            className="p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
              <circle cx="8" cy="8" r="6" stroke="#24211D" strokeWidth="1.3" />
              <path d="M12.5 12.5L16 16" stroke="#24211D" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </a>
          <a
            href="#"
            onClick={onClose}
            aria-label="Account"
            tabIndex={isOpen ? 0 : -1}
            className="p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
              <circle cx="9" cy="6" r="3.2" stroke="#24211D" strokeWidth="1.3" />
              <path d="M3 16c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="#24211D" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // A calmer, more deliberate scroll feel site-wide.
  useEffect(() => {
    const previous = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = previous;
    };
  }, []);

  return (
    <div className="bg-[#FAF7F2] text-[#24211D] antialiased overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-[#24211D] focus:text-[#FAF7F2] focus:px-4 focus:py-2 focus:rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF7F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24211D]"
      >
        Skip to main content
      </a>

      {/* ============================== */}
      {/* ANNOUNCEMENT BAR */}
      {/* ============================== */}
      <div className="bg-[#24211D] text-[#FAF7F2]">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5 text-center">
          <p className="text-xs tracking-[0.08em] font-medium">
            Complimentary shipping over ₹4,999 · Handmade, made to last
          </p>
        </div>
      </div>

      {/* ============================== */}
      {/* NAVBAR */}
      {/* ============================== */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E4DDD0]/70">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button
              ref={menuButtonRef}
              onClick={openMenu}
              className="lg:hidden -ml-2 p-2 rounded-[4px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] transition-shadow duration-150 ease-out"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="block">
                <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="#24211D" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>

            <nav className="hidden lg:flex items-center gap-10" aria-label="Categories">
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm tracking-[0.03em] text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
                >
                  {label}
                </a>
              ))}
            </nav>

            <a href="#" className="font-serif text-2xl tracking-[0.01em] text-[#24211D] transition-opacity duration-200 ease-out focus:outline-none focus-visible:opacity-70">
              Kalaa
            </a>

            <div className="flex items-center gap-6">
              <button aria-label="Search" className="hidden sm:block p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
                  <circle cx="8" cy="8" r="6" stroke="#24211D" strokeWidth="1.3" />
                  <path d="M12.5 12.5L16 16" stroke="#24211D" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
              <button aria-label="Account" className="hidden sm:block p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
                  <circle cx="9" cy="6" r="3.2" stroke="#24211D" strokeWidth="1.3" />
                  <path d="M3 16c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="#24211D" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
              <button aria-label="Cart, 0 items" className="p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out relative focus:outline-none focus-visible:opacity-60">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
                  <path d="M4 6h10l-1 9H5L4 6Z" stroke="#24211D" strokeWidth="1.3" strokeLinejoin="round" />
                  <path d="M6.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#24211D" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavDrawer isOpen={menuOpen} onClose={closeMenu} triggerRef={menuButtonRef} />

      <main id="main-content">
      {/* ============================== */}
      {/* HERO — asymmetric split, image left large / copy right */}
      {/* ============================== */}
      <section className="relative">
        <div className="grid lg:grid-cols-12 lg:min-h-[86vh]">
          <div className="lg:col-span-8 relative min-h-[64vh] lg:min-h-full">
            <FadeImage
              src={HERO_IMAGE_SRC}
              alt="Hand-thrown stoneware vases arranged on a linen-covered table in natural light"
              priority
              sizes="(min-width: 1024px) 67vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-4 flex items-center bg-[#F1EAE0] px-8 py-20 lg:px-16 lg:py-0">
            <div>
              <p className="text-sm tracking-[0.14em] uppercase text-[#6B6459] mb-6">
                The Autumn Edit
              </p>
              <h1 className="font-serif text-4xl lg:text-6xl xl:text-7xl leading-[1.05] text-[#24211D] mb-10">
                Objects made
                <br />
                by hand, for
                <br />
                a slower home.
              </h1>
              <p className="text-[17px] leading-8 text-[#4B473F] mb-11 max-w-[320px]">
                Each piece is thrown, woven, or carved by an artisan we know by name — nothing here comes off an assembly line.
              </p>
              <a
                href="#"
                className="inline-block bg-[#B5502D] text-[#FAF7F2] text-base font-medium tracking-[0.01em] px-9 py-4 rounded-[4px] hover:bg-[#9c4325] transition-[background-color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1EAE0]"
              >
                Shop the Collection
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* EDITORIAL STRIP — brand philosophy, quiet, centered */}
      {/* ============================== */}
      <section className="max-w-[720px] mx-auto px-6 py-28 lg:py-40 text-center">
        <p className="font-serif text-3xl sm:text-4xl leading-[1.6] text-[#24211D]">
          We work with fewer than forty artisan studios across the country — small batches,
          real materials, pieces built to outlast a trend cycle.
        </p>
      </section>

      {/* ============================== */}
      {/* FEATURED CATEGORIES — asymmetric grid: one large + two stacked */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 pb-28 lg:pb-40">
        <div className="flex items-end justify-between mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D]">Shop by Craft</h2>
          <a href="#" className="hidden sm:block text-sm text-[#24211D] border-b border-[#24211D] pb-0.5 hover:text-[#B5502D] hover:border-[#B5502D] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D] focus-visible:border-[#B5502D]">
            See the Full Range
          </a>
        </div>

        <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
          <a href="#" className="lg:col-span-7 group relative overflow-hidden rounded-[8px] min-h-[420px] lg:min-h-[520px] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_40px_-16px_rgba(36,33,29,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2">
            <FadeImage
              src="https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&q=80&auto=format&fit=crop"
              alt="Woven jute and cotton floor rugs stacked in a sunlit studio"
              hoverScale
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute bottom-7 left-7 font-serif text-3xl text-[#FAF7F2]">Textiles &amp; Rugs</span>
          </a>

          <div className="lg:col-span-5 grid gap-4 lg:gap-5">
            <a href="#" className="group relative overflow-hidden rounded-[8px] min-h-[200px] lg:min-h-[247px] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_40px_-16px_rgba(36,33,29,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2">
              <FadeImage
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&q=80&auto=format&fit=crop"
                alt="Brass and terracotta table lamps with linen shades"
                hoverScale
                sizes="(min-width: 1024px) 41vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 font-serif text-2xl text-[#FAF7F2]">Lighting</span>
            </a>
            <a href="#" className="group relative overflow-hidden rounded-[8px] min-h-[200px] lg:min-h-[247px] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_40px_-16px_rgba(36,33,29,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2">
              <FadeImage
                src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80&auto=format&fit=crop"
                alt="Glazed ceramic bowls and mugs on an open wooden shelf"
                hoverScale
                sizes="(min-width: 1024px) 41vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 font-serif text-2xl text-[#FAF7F2]">Ceramics</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FEATURED COLLECTION — editorial split, image right, text left */}
      {/* ============================== */}
      <section className="bg-[#F1EAE0]">
        <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-0">
          <div className="grid lg:grid-cols-12 lg:min-h-[600px]">
            <div className="lg:col-span-5 flex items-center order-2 lg:order-1 mt-12 lg:mt-0">
              <div className="lg:pr-12">
                <p className="text-sm tracking-[0.14em] uppercase text-[#6B6459] mb-6">The Edit</p>
                <h2 className="font-serif text-5xl sm:text-6xl leading-[1.15] text-[#24211D] mb-10">
                  The Jaisalmer Series
                </h2>
                <p className="text-[17px] leading-8 text-[#4B473F] mb-10 max-w-[380px]">
                  Sand-toned stoneware, hand-turned in small batches by a third-generation potter family. Twelve pieces. No two glazed exactly alike.
                </p>
                <a
                  href="#"
                  className="inline-block text-base font-medium tracking-[0.01em] text-[#24211D] border border-[#24211D] px-8 py-3.5 rounded-[4px] hover:bg-[#24211D] hover:text-[#FAF7F2] transition-[background-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1EAE0]"
                >
                  Explore the Series
                </a>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 relative min-h-[380px] lg:min-h-full lg:-mr-6">
              <FadeImage
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1300&q=80&auto=format&fit=crop"
                alt="Sand-toned stoneware pitcher and cups from the Jaisalmer series"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* NEW ARRIVALS — clean 3-col product grid */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 py-28 lg:py-40">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-sm tracking-[0.14em] uppercase text-[#6B6459] mb-3">Newly Made</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D]">Just Arrived</h2>
          </div>
          <a href="#" className="hidden sm:block text-sm text-[#24211D] border-b border-[#24211D] pb-0.5 hover:text-[#B5502D] hover:border-[#B5502D] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D] focus-visible:border-[#B5502D]">
            See What's New
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {NEW_ARRIVALS.map((product, i) => (
            <a
              href="#"
              key={product.name}
              className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-4 rounded-[4px] ${i === 1 ? "sm:mt-12 lg:mt-16" : ""}`}
            >
              <div className="relative overflow-hidden rounded-[8px] bg-[#F1EAE0] aspect-[4/5] mb-6 transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_16px_32px_-14px_rgba(36,33,29,0.16)]">
                <FadeImage
                  src={product.img}
                  alt={product.alt}
                  hoverScale
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
                />
                <span className="absolute top-4 left-4 text-xs tracking-[0.1em] uppercase bg-[#FAF7F2] text-[#24211D] px-2.5 py-1 rounded-[4px] shadow-[0_1px_3px_rgba(36,33,29,0.08)]">
                  New
                </span>
              </div>
              <h3 className="font-serif text-lg text-[#24211D] mb-3">{product.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B6459]">{product.material}</p>
                <p className="text-sm text-[#24211D]">{product.price}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ============================== */}
      {/* BEST SELLERS — Linen background, horizontal scroll rhythm change */}
      {/* ============================== */}
      <section className="bg-[#F1EAE0] py-28 lg:py-40">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <p className="text-sm tracking-[0.14em] uppercase text-[#6B6459] mb-3">Most Loved</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D]">The Favourites</h2>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto pl-6">
          <div className="flex gap-8 overflow-x-auto pb-4 pr-6 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {BEST_SELLERS.map((product) => (
              <a href="#" key={product.name} className="group flex-shrink-0 w-[260px] sm:w-[300px] snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-4 rounded-[4px]">
                <div className="relative overflow-hidden rounded-[8px] aspect-[4/5] mb-6 transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_16px_32px_-14px_rgba(36,33,29,0.16)]">
                  <FadeImage
                    src={product.img}
                    alt={product.alt}
                    hoverScale
                    sizes="(min-width: 640px) 300px, 260px"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="font-serif text-lg text-[#24211D] mb-3">{product.name}</h3>
                <p className="text-sm text-[#24211D]">{product.price}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* EDITORIAL STORY — full-bleed image, text overlay bottom-left */}
      {/* ============================== */}
      <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-end">
        <FadeImage
          src="https://images.unsplash.com/photo-1509391618207-30dbdca94c99?w=1800&q=80&auto=format&fit=crop"
          alt="Artisan shaping clay on a pottery wheel in a workshop lit by afternoon sun"
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="relative max-w-[1280px] mx-auto px-6 pb-20 lg:pb-28 w-full">
          <div className="max-w-[500px]">
            <p className="text-sm tracking-[0.14em] uppercase text-[#F1EAE0] mb-6">The Studio Journal</p>
            <h2 className="font-serif text-5xl sm:text-6xl leading-[1.2] text-[#FAF7F2] mb-10">
              Meet Radha, who has thrown pots for thirty-one years.
            </h2>
            <a
              href="#"
              className="inline-block text-base font-medium text-[#FAF7F2] border-b border-[#FAF7F2] pb-1 hover:text-[#F1EAE0] hover:border-[#F1EAE0] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#F1EAE0] focus-visible:border-[#F1EAE0]"
            >
              Read her story
            </a>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* WHY CHOOSE KALAA — alternating line-item layout, not an icon grid */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 py-28 lg:py-40">
        <div className="max-w-[560px] mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D] mb-7">Why Kalaa</h2>
          <p className="text-[17px] leading-8 text-[#4B473F]">
            We don't chase trends or fast turnarounds. Every decision, from the clay we source to the way we pack a box, is made in favour of the object outliving you.
          </p>
        </div>

        <div className="divide-y divide-[#E4DDD0]/70 border-t border-b border-[#E4DDD0]/70">
          {WHY_KALAA_ITEMS.map((item, i) => (
            <div
              key={item.n}
              className={`grid sm:grid-cols-12 gap-4 sm:gap-8 py-12 ${i === 1 ? "sm:pl-16" : ""}`}
            >
              <span className="sm:col-span-2 font-serif text-base text-[#6B6459]">{item.n}</span>
              <h3 className="sm:col-span-4 font-serif text-2xl sm:text-3xl text-[#24211D] leading-snug">{item.title}</h3>
              <p className="sm:col-span-6 text-base leading-8 text-[#4B473F] max-w-[440px]">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== */}
      {/* CUSTOMER HOMES — masonry-feel image grid with quotes */}
      {/* ============================== */}
      <section className="bg-[#F1EAE0] py-28 lg:py-40">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D] mb-14">At Home With Kalaa</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:mt-0">
              <div className="rounded-[8px] overflow-hidden mb-5 aspect-[3/4]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80&auto=format&fit=crop"
                  alt="Living room styled with Kalaa ceramics and a woven rug"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-serif text-xl text-[#24211D] leading-snug mb-2">
                "The vase looks like it's always lived here."
              </p>
              <p className="text-sm text-[#6B6459]">Meera, Bengaluru</p>
            </div>

            <div className="lg:mt-16">
              <div className="rounded-[8px] overflow-hidden mb-5 aspect-[3/4]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80&auto=format&fit=crop"
                  alt="Dining table set with handmade stoneware and brass accents"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-serif text-xl text-[#24211D] leading-snug mb-2">
                "Guests always ask where the bowls are from."
              </p>
              <p className="text-sm text-[#6B6459]">Arjun, Pune</p>
            </div>

            <div className="lg:mt-0 sm:col-span-2 lg:col-span-1">
              <div className="rounded-[8px] overflow-hidden mb-5 aspect-[3/4]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80&auto=format&fit=crop"
                  alt="Reading nook with a rattan pendant lamp and textile cushions"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-serif text-xl text-[#24211D] leading-snug mb-2">
                "Slower shipping, but worth every day of the wait."
              </p>
              <p className="text-sm text-[#6B6459]">Farah, Ahmedabad</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* INSTAGRAM GALLERY — tight grid, full width feel */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 py-28 lg:py-40">
        <div className="flex items-end justify-between mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#24211D]">@kalaa.home</h2>
          <a href="#" className="hidden sm:block text-sm text-[#24211D] border-b border-[#24211D] pb-0.5 hover:text-[#B5502D] hover:border-[#B5502D] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D] focus-visible:border-[#B5502D]">
            Follow along
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INSTAGRAM_PHOTOS.map((photo, i) => (
            <a href="#" key={i} className="group relative aspect-square overflow-hidden rounded-[8px] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2">
              <FadeImage
                src={photo.src}
                alt={photo.alt}
                hoverScale
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05]"
              />
            </a>
          ))}
        </div>
      </section>

      {/* ============================== */}
      {/* NEWSLETTER — signature large-radius panel */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 pb-28 lg:pb-40">
        <div className="bg-[#24211D] rounded-[20px] px-8 py-20 sm:px-16 sm:py-24 text-center">
          <p className="text-sm tracking-[0.14em] uppercase text-[#B5502D] mb-6">The Studio Notes</p>
          <h2 className="font-serif text-4xl sm:text-5xl leading-[1.25] text-[#FAF7F2] max-w-[560px] mx-auto mb-6">
            A short letter on new work and the studios behind it. Once a month, nothing more.
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 bg-transparent border border-[#837D6E] rounded-[4px] px-4 py-3.5 text-base text-[#FAF7F2] placeholder:text-[#96907F] focus:outline-none focus:border-[#FAF7F2] transition-colors duration-200 ease-out"
            />
            <button
              type="submit"
              className="bg-[#B5502D] text-[#FAF7F2] text-base font-medium tracking-[0.01em] px-8 py-3.5 rounded-[4px] hover:bg-[#9c4325] transition-[background-color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAF7F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#24211D]"
            >
              Join the List
            </button>
          </form>
        </div>
      </section>
      </main>

      {/* ============================== */}
      {/* FOOTER */}
      {/* ============================== */}
      <footer className="border-t border-[#E4DDD0]/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 mb-20">
            <div className="lg:col-span-2">
              <a href="#" className="font-serif text-2xl text-[#24211D] transition-opacity duration-200 ease-out focus:outline-none focus-visible:opacity-70">Kalaa</a>
              <p className="text-base leading-7 text-[#6B6459] mt-4 max-w-[280px]">
                Handmade objects from independent artisan studios across India.
              </p>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.1em] uppercase text-[#6B6459] mb-4">Shop</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Ceramics</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Textiles</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Lighting</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Furniture</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.1em] uppercase text-[#6B6459] mb-4">Studio</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Our Story</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">The Artisans</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Journal</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.1em] uppercase text-[#6B6459] mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Shipping &amp; Returns</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Care Guide</a></li>
                <li><a href="#" className="text-sm text-[#24211D] hover:text-[#B5502D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E4DDD0]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B6459]">© 2026 Kalaa Home. Made across India.</p>
            <div className="flex items-center gap-5">
              <a href="#" aria-label="Instagram" className="text-[#6B6459] hover:text-[#24211D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#24211D]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="block">
                  <rect x="1" y="1" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="12.5" cy="4.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="Pinterest" className="text-[#6B6459] hover:text-[#24211D] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#24211D]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="block">
                  <circle cx="8.5" cy="8.5" r="7.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6.5 12.5c.5-1.5 1-3 1.3-4.3M8.5 5.2c1.8 0 3 1 3 2.6 0 1.9-1 3.4-2.6 3.4-.6 0-1.1-.3-1.3-.7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
