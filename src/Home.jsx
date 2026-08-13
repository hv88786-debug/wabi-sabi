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

// Small line-icon set shared across the redesigned product cards — kept
// in the same stroke-based visual language as the rest of the site
// (1.3 stroke weight, currentColor) rather than introducing a new
// icon style.
function StarIcon({ className = "" }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} aria-hidden="true">
      <path
        d="M6.5 1.2 8.02 4.6l3.68.38-2.75 2.5.78 3.62-3.23-1.9-3.23 1.9.78-3.62-2.75-2.5 3.68-.38L6.5 1.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TruckIcon({ className = "" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 22 22" fill="none" className={className} aria-hidden="true">
      <path d="M2 15h11V6H2v9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M13 9h4l3 3v3h-7V9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="6" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="16.5" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function HeartIcon({ filled = false, className = "" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 15.5S2.5 11.6 2.5 6.9A3.4 3.4 0 0 1 9 5.3a3.4 3.4 0 0 1 6.5 1.6c0 4.7-6.5 8.6-6.5 8.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

// Small bordered stamp, drawn from the logo's red kanji seal — a single
// rule-framed mark rather than an icon set, used sparingly as a signature
// wherever the page wants to feel signed rather than decorated.
function SealMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect x="1.4" y="1.4" width="21.2" height="21.2" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 16.4c1.1-3.3 1.9-6.6 2.3-9.9M8.2 10.6c2.6-.7 5.2-1 7.8-.9M13.4 7c.4 3.1.4 6.2 0 9.4"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// A single uneven, hand-drawn brushstroke rule — echoes the ink arc in the
// wordmark. Used in place of a straight <hr> under a few key headings so
// the page's own typography carries a trace of the logo's brushwork.
function BrushRule({ className = "", width = 96 }) {
  return (
    <svg
      width={width}
      height="10"
      viewBox={`0 0 ${width} 10`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d={`M1 6.5c${width * 0.18} -4 ${width * 0.4} -4 ${width * 0.55} -1.5s${width * 0.3} 3 ${width * 0.44} 0.5`}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// The wide, open ink arc from the logo — never the full mark, just its
// gesture — reused faintly as a background presence behind a handful of
// quiet, text-only moments so the brand's hand stays felt throughout,
// not only at the top of the page.
function InkArc({ className = "" }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden="true">
      <path
        d="M330 130c14 34 18 74 4 116-24 72-96 120-172 112-64-7-118-52-136-112"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Static content, hoisted out of Home() so it's created once at module
// load instead of being reconstructed on every render (e.g. each
// newsletter-field keystroke re-renders Home and previously rebuilt
// every one of these arrays from scratch).
const NEW_ARRIVALS = [
  {
    img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80&auto=format&fit=crop",
    hoverImg: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80&auto=format&fit=crop",
    alt: "Hand-woven cane pendant lamp hanging above a reading corner",
    name: "Aravalli Cane Pendant",
    collection: "Aravalli Weave",
    material: "Cane, jute cord",
    price: "₹4,200",
    rating: "4.8",
    reviews: 24,
    delivery: "Ships in 5–7 days",
    badge: "New Arrival",
  },
  {
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format&fit=crop",
    hoverImg: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80&auto=format&fit=crop",
    alt: "Set of hand-carved sheesham wood serving spoons",
    name: "Carved Sheesham Servers",
    collection: "Rajasthani Sheesham",
    material: "Solid sheesham",
    price: "₹1,850",
    rating: "4.9",
    reviews: 61,
    delivery: "Ships in 2–4 days",
    badge: "New Arrival",
  },
  {
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop",
    hoverImg: "https://images.unsplash.com/photo-1528283648649-33347faa5d9e?w=800&q=80&auto=format&fit=crop",
    alt: "Block-printed cotton cushion covers in indigo and rust",
    name: "Bagru Cushion Cover",
    collection: "Bagru Print",
    material: "Block-printed cotton",
    price: "₹1,150",
    rating: "4.7",
    reviews: 38,
    delivery: "Ships in 3–5 days",
    badge: "New Arrival",
  },
];

const BEST_SELLERS = [
  {
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=700&q=80&auto=format&fit=crop",
    hoverImg: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80&auto=format&fit=crop",
    alt: "Hand-glazed blue pottery dinner set stacked on a wooden counter",
    name: "Jaipur Blue Pottery Set, 6-piece",
    collection: "Jaipur Blue Pottery",
    material: "Hand-glazed blue pottery",
    price: "₹6,400",
    rating: "4.9",
    reviews: 142,
    delivery: "Ships in 4–6 days",
    badge: "Bestseller",
  },
  {
    img: "https://images.unsplash.com/photo-1616627981276-b48d485ecf24?w=700&q=80&auto=format&fit=crop",
    hoverImg: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=700&q=80&auto=format&fit=crop",
    alt: "Hand-knotted wool table runner in natural undyed tones",
    name: "Bikaner Wool Runner",
    collection: "The Bikaner Loom",
    material: "Hand-knotted wool",
    price: "₹2,600",
    rating: "4.8",
    reviews: 76,
    delivery: "Made to order · 2–3 weeks",
    badge: "Limited Edition",
  },
  {
    img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=700&q=80&auto=format&fit=crop",
    hoverImg: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&q=80&auto=format&fit=crop",
    alt: "Brass table lamp with a linen drum shade",
    name: "Jodhpur Brass Lamp",
    collection: "Jodhpur Series",
    material: "Brass, linen shade",
    price: "₹5,100",
    rating: "4.9",
    reviews: 98,
    delivery: "Ships in 3–5 days",
    badge: "Bestseller",
  },
  {
    img: "https://images.unsplash.com/photo-1616486338815-1ff81b3b3a1e?w=700&q=80&auto=format&fit=crop",
    alt: "Hand-carved wooden fruit bowl with a natural grain finish",
    name: "Sheesham Fruit Bowl",
    collection: "The Desert Table",
    material: "Solid sheesham",
    price: "₹1,650",
    rating: "4.7",
    reviews: 53,
    delivery: "Ships in 2–4 days",
    badge: null,
  },
];

const WHY_WABI_SABI_ITEMS = [
  {
    n: "01",
    title: "Made by hand, not machine",
    copy: "Every piece passes through human hands more than once. Small imperfections are proof of that, not a flaw — this is wabi-sabi, not a defect.",
  },
  {
    n: "02",
    title: "Sourced with the artisan in mind",
    copy: "We pay our Rajasthan studios fairly and upfront, long before a piece reaches your home. No middlemen, no pressure batches.",
  },
  {
    n: "03",
    title: "Packed to travel, built to stay",
    copy: "Plastic-free packaging, cushioned in offcut fabric from our own textile partners. It leaves Ajmer whole, and it stays that way.",
  },
];

const SERVICE_ITEMS = [
  {
    title: "Shipped across India",
    copy: "Complimentary over ₹4,999, packed plastic-free from our Ajmer studio.",
    icon: (
      <>
        <path d="M2 15h11V6H2v9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M13 9h4l3 3v3h-7V9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="6" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="16.5" cy="17.5" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      </>
    ),
  },
  {
    title: "15-day returns",
    copy: "Not the right fit at home? Send it back within a fortnight, no questions.",
    icon: (
      <>
        <path d="M4 8a8 8 0 1 1-1.2 4.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M2 4v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Secure checkout",
    copy: "UPI, cards and net banking, encrypted end to end at checkout.",
    icon: (
      <>
        <rect x="2.5" y="4.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.5 8.5h17" stroke="currentColor" strokeWidth="1.3" />
        <path d="M5.5 13.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "A person, not a bot",
    copy: "Message us on WhatsApp, Mon–Sat, 10am to 7pm IST.",
    icon: (
      <>
        <path d="M11 2.5a8.5 8.5 0 0 0-7.3 12.8L2.5 19.5l4.4-1.1A8.5 8.5 0 1 0 11 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M8 8.5c0 3 2.5 5.5 5.5 5.5l1-1.4-1.9-1-.9.9c-1-.4-1.8-1.2-2.2-2.2l.9-.9-1-1.9L8 8.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </>
    ),
  },
];

const SHOP_BY_ROOM = [
  {
    img: "https://images.unsplash.com/photo-1616486338815-1ff81b3b3a1e?w=900&q=80&auto=format&fit=crop",
    alt: "Living room with a low wooden table, stoneware and a woven cotton rug",
    name: "The Living Room",
    count: "48 pieces",
  },
  {
    img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80&auto=format&fit=crop",
    alt: "Kitchen shelf styled with handmade blue pottery plates and bowls",
    name: "Kitchen & Table",
    count: "63 pieces",
  },
  {
    img: "https://images.unsplash.com/photo-1616627981276-b48d485ecf24?w=900&q=80&auto=format&fit=crop",
    alt: "Bedroom with block-printed linen and a brass bedside lamp",
    name: "The Bedroom",
    count: "37 pieces",
  },
  {
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80&auto=format&fit=crop",
    alt: "Study desk with carved wooden accessories and a reading lamp",
    name: "Study & Corner",
    count: "24 pieces",
  },
];

const CRAFT_PROCESS = [
  {
    n: "01",
    title: "Sourcing the raw",
    copy: "Clay from the Aravalli foothills, cotton from Bagru, timber reclaimed from old Rajasthani havelis.",
  },
  {
    n: "02",
    title: "Shaping by hand",
    copy: "Thrown on the wheel, block-printed by hand, or carved with a chisel — the maker's mark stays visible.",
  },
  {
    n: "03",
    title: "Firing & finishing",
    copy: "Wood-fired kilns and natural dyes. Each glaze is mixed in the studio, never bought by the barrel.",
  },
  {
    n: "04",
    title: "Checked & wrapped",
    copy: "Inspected twice, cushioned in offcut fabric, and boxed without a scrap of plastic before it leaves Ajmer.",
  },
];

const JOURNAL_POSTS = [
  {
    img: "https://images.unsplash.com/photo-1509391618207-30dbdca94c99?w=800&q=80&auto=format&fit=crop",
    alt: "Potter's hands centring clay on a spinning wheel",
    category: "Craft Notes",
    title: "Why no two of our blue pottery glazes ever match",
    excerpt: "The short answer is quartz, ash and a kiln that no one fully controls. The longer answer is more interesting.",
    read: "6 min read",
  },
  {
    img: "https://images.unsplash.com/photo-1528283648649-33347faa5d9e?w=800&q=80&auto=format&fit=crop",
    alt: "Indigo-dyed cotton drying on a line in the sun",
    category: "The Makers",
    title: "A morning in Bagru with the block-print family",
    excerpt: "Three generations, one vat of indigo, and a printing block cut by hand in the 1970s that is still in daily use.",
    read: "8 min read",
  },
  {
    img: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80&auto=format&fit=crop",
    alt: "Styled shelf with layered ceramics, books and a small plant",
    category: "At Home",
    title: "Styling a shelf the wabi-sabi way",
    excerpt: "A few rules we keep returning to: odd numbers, room to breathe, and one thing whose only job is to be looked at.",
    read: "5 min read",
  },
];

const PRESS_MENTIONS = [
  { name: "Architectural Digest", quote: "No two Aravalli glazes leave the kiln the same — and Wabi Sabi wants it that way." },
  { name: "Elle Decor India", quote: "Ajmer's answer to the maker's mark: every runner numbered, every potter named." },
  { name: "Vogue India", quote: "The rare catalogue where the packaging is as considered as what's inside it." },
  { name: "Design Pataki", quote: "Bagru indigo and Aravalli clay, styled with a restraint most decor labels skip." },
  { name: "The Voice of Fashion", quote: "A studio that will tell you which artisan's hands made your bowl." },
];

const STORE_LOCATIONS = [
  {
    city: "Ajmer",
    label: "Flagship Studio",
    address: "12 Nalla Bazaar, Ajmer, Rajasthan 305001",
    hours: "Tue–Sun · 11am–8pm",
  },
  {
    city: "Jaipur",
    label: "Wabi Sabi Jaipur",
    address: "C-42 Bapu Bazaar, Jaipur, Rajasthan 302003",
    hours: "Mon–Sun · 11am–9pm",
  },
  {
    city: "Udaipur",
    label: "The Lake Studio",
    address: "9 Gangaur Ghat Road, Udaipur, Rajasthan 313001",
    hours: "Tue–Sun · 11am–8pm",
  },
];

const FAQS = [
  {
    q: "How long will my order take to arrive?",
    a: "Most in-stock pieces ship from Ajmer within two working days and reach you in four to seven. Made-to-order items carry their timeline on the product page, usually two to four weeks.",
  },
  {
    q: "Are the imperfections a defect?",
    a: "No — they're the point. Slight variations in glaze, weave and grain are the signature of handwork and the heart of wabi-sabi. We only set aside pieces with structural faults — everything you receive has passed a two-stage check.",
  },
  {
    q: "Can I return something that isn't right?",
    a: "Yes. You have 15 days from delivery to return unused pieces in their original packaging for a full refund. We arrange the pickup ourselves.",
  },
  {
    q: "Do you ship outside India?",
    a: "We ship to 20 countries. International rates and duties are calculated at checkout, and everything travels in the same plastic-free packaging, wherever it's headed.",
  },
];

const INSTAGRAM_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&q=80&auto=format&fit=crop",
    alt: "Hand-carved sheesham serving spoons, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80&auto=format&fit=crop",
    alt: "Glazed blue pottery bowls and mugs, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80&auto=format&fit=crop",
    alt: "Brass and terracotta table lamps, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=500&q=80&auto=format&fit=crop",
    alt: "Handwoven cotton and wool rugs, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80&auto=format&fit=crop",
    alt: "Bagru block-printed cotton cushion covers, shared on Instagram by a customer",
  },
  {
    src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&q=80&auto=format&fit=crop",
    alt: "Sand-toned stoneware pitcher from the Aravalli series, shared on Instagram by a customer",
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
        className={`absolute inset-0 bg-[#2A2620]/40 transition-opacity duration-300 ease-out ${
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
        className={`absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-[#F7F2E7] shadow-[8px_0_40px_-16px_rgba(35,30,22,0.25)] flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#E2D5B8]/70">
          <span className="font-display text-xl tracking-[0.22em] uppercase text-[#2A2620]">Wabi Sabi</span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={isOpen ? 0 : -1}
            className="p-2 -mr-2 rounded-[4px] hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2E7]"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
              <path d="M4 4L14 14M14 4L4 14" stroke="#2A2620" strokeWidth="1.3" strokeLinecap="round" />
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
                  className="block py-3 font-display text-xl text-[#2A2620] hover:text-[#A8582F] transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-6 py-6 border-t border-[#E2D5B8]/70 flex items-center gap-6">
          <a
            href="#"
            onClick={onClose}
            aria-label="Search"
            tabIndex={isOpen ? 0 : -1}
            className="p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
              <circle cx="8" cy="8" r="6" stroke="#2A2620" strokeWidth="1.3" />
              <path d="M12.5 12.5L16 16" stroke="#2A2620" strokeWidth="1.3" strokeLinecap="round" />
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
              <circle cx="9" cy="6" r="3.2" stroke="#2A2620" strokeWidth="1.3" />
              <path d="M3 16c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="#2A2620" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
});

// Premium product card used by both "Just Arrived" and "The Favourites".
// Two images are layered and cross-faded on hover (product shot →
// in-room lifestyle shot) rather than a single static photo, which is
// the pattern most premium D2C catalogues use to sell the object and
// the room it belongs in with one interaction. Kept as a single
// component so both sections stay visually identical.
const ProductCard = memo(function ProductCard({ product, sizes, imgWidth = "33vw" }) {
  return (
    <a
      href="#"
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-4 rounded-[4px]"
    >
      <div className="relative overflow-hidden rounded-[10px] bg-[#EDE2CC] aspect-[4/5] mb-5 ring-1 ring-inset ring-black/[0.05] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_24px_44px_-18px_rgba(35,30,22,0.28)]">
        {/* base shot */}
        <div className="absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0">
          <FadeImage
            src={product.img}
            alt={product.alt}
            sizes={sizes}
            className="w-full h-full object-cover"
          />
        </div>
        {/* in-room lifestyle shot, revealed on hover */}
        {product.hoverImg && (
          <div className="absolute inset-0 opacity-0 scale-[1.045] transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100">
            <FadeImage
              src={product.hoverImg}
              alt=""
              aria-hidden="true"
              sizes={sizes}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          {product.badge ? (
            <span className="text-[10px] tracking-[0.12em] uppercase font-medium bg-[#F7F2E7] text-[#2A2620] px-2.5 py-1.5 rounded-[3px] shadow-[0_1px_4px_rgba(35,30,22,0.1)]">
              {product.badge}
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="shrink-0 w-8 h-8 rounded-full bg-[#F7F2E7] text-[#2A2620] flex items-center justify-center shadow-[0_1px_4px_rgba(35,30,22,0.1)] transition-[color,transform] duration-200 ease-out hover:text-[#A8582F] active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620]"
          >
            <HeartIcon />
          </button>
        </div>
      </div>

      <p className="font-display italic text-[13px] text-[#A8582F] mb-2">{product.collection}</p>
      <h3 className="font-display text-lg sm:text-xl text-[#2A2620] mb-3 leading-snug">{product.name}</h3>

      <p className="text-xs text-[#6B5D4A] mb-3.5 pl-2.5 border-l border-[#E2D5B8]">
        {product.material}
      </p>

      <div className="flex items-center gap-1.5 mb-4">
        <StarIcon className="text-[#A8582F]" />
        <span className="text-xs text-[#2A2620]">{product.rating}</span>
        <span className="text-xs text-[#96876F]">({product.reviews})</span>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E2D5B8]/70">
        <span className="text-base font-medium text-[#2A2620]">{product.price}</span>
        <span className="flex items-center gap-1.5 text-xs text-[#6B5D4A]">
          <TruckIcon />
          {product.delivery}
        </span>
      </div>
    </a>
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
    <div className="bg-[#F7F2E7] text-[#2A2620] antialiased overflow-x-hidden">
      {/* Display type: Shippori Mincho — a Mincho serif rather than a
          default web-serif fallback. It's the same brush-and-ink logic as
          the seal mark and ink arc, carried into the type itself, so the
          wordmark isn't the only place the studio's hand shows. Loaded
          once, scoped via .font-display (a drop-in replacement for
          Tailwind's font-serif token used throughout the page). */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Shippori Mincho', Georgia, 'Noto Serif', serif; }
      `}</style>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-[#2A2620] focus:text-[#F7F2E7] focus:px-4 focus:py-2 focus:rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F2E7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2620]"
      >
        Skip to main content
      </a>

      {/* ============================== */}
      {/* ANNOUNCEMENT BAR */}
      {/* ============================== */}
      <div className="bg-[#2A2620] text-[#F7F2E7]">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5 text-center">
          <p className="text-xs tracking-[0.08em] font-medium">
            Handcrafted in small batches, Ajmer · Complimentary shipping over ₹4,999
          </p>
        </div>
      </div>

      {/* ============================== */}
      {/* NAVBAR */}
      {/* ============================== */}
      <header className="sticky top-0 z-40 bg-[#F7F2E7]/95 backdrop-blur-sm border-b border-[#E2D5B8]/70">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <button
              ref={menuButtonRef}
              onClick={openMenu}
              className="lg:hidden -ml-2 p-2 rounded-[4px] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2E7] transition-shadow duration-150 ease-out"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="block">
                <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="#2A2620" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>

            <nav className="hidden lg:flex items-center gap-10" aria-label="Categories">
              {NAV_LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-sm tracking-[0.03em] text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]"
                >
                  {label}
                </a>
              ))}
            </nav>

            <a
              href="#"
              aria-label="Wabi Sabi — home"
              className="flex flex-col items-center leading-[1.05] transition-opacity duration-200 ease-out focus:outline-none focus-visible:opacity-70"
            >
              <span className="font-display text-lg sm:text-xl tracking-[0.28em] uppercase text-[#2A2620]">Wabi Sabi</span>
              <span className="w-5 h-px bg-[#A8582F]/60 my-1.5 hidden sm:block" aria-hidden="true" />
              <span className="text-[9px] tracking-[0.18em] uppercase text-[#8F8064] hidden sm:block">Handcrafted Decor</span>
            </a>

            <div className="flex items-center gap-6">
              <button aria-label="Search" className="hidden sm:block p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
                  <circle cx="8" cy="8" r="6" stroke="#2A2620" strokeWidth="1.3" />
                  <path d="M12.5 12.5L16 16" stroke="#2A2620" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
              <button aria-label="Account" className="hidden sm:block p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:opacity-60">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
                  <circle cx="9" cy="6" r="3.2" stroke="#2A2620" strokeWidth="1.3" />
                  <path d="M3 16c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="#2A2620" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
              <button aria-label="Cart, 0 items" className="p-1 hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out relative focus:outline-none focus-visible:opacity-60">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="block">
                  <path d="M4 6h10l-1 9H5L4 6Z" stroke="#2A2620" strokeWidth="1.3" strokeLinejoin="round" />
                  <path d="M6.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="#2A2620" strokeWidth="1.3" />
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
          <div className="lg:col-span-7 relative min-h-[64vh] lg:min-h-full">
            <FadeImage
              src={HERO_IMAGE_SRC}
              alt="Hand-thrown stoneware vases arranged on a linen-covered table in natural light"
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-8 flex items-center gap-2.5">
              <SealMark className="w-4 h-4 text-[#F7F2E7]/85" />
              <p className="text-[11px] tracking-[0.1em] uppercase text-[#F7F2E7]/85">
                Ajmer Studio, Rajasthan
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 flex items-center bg-[#EDE2CC] px-8 py-20 lg:px-14 xl:px-20 lg:py-0">
            <div>
              <div className="flex items-center gap-3 mb-7">
                <BrushRule width={40} className="text-[#A8582F]" />
                <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A]">
                  From the Ajmer Studio
                </p>
              </div>
              <h1 className="font-display text-4xl lg:text-6xl xl:text-[4.75rem] leading-[1.06] tracking-[-0.01em] text-[#2A2620] mb-10">
                Beauty in what's
                <br />
                imperfect, made
                <br />
                <span className="italic">slowly</span>, by hand.
              </h1>
              <p className="text-[17px] leading-8 text-[#4A4032] mb-11 max-w-[320px]">
                Each piece is thrown, block-printed, or carved by an artisan in Ajmer — never smoothed of its character, never rushed to a shelf.
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  href="#"
                  className="inline-block bg-[#A8582F] text-[#F7F2E7] text-base font-medium tracking-[0.01em] px-9 py-4 rounded-[4px] hover:bg-[#8F492A] transition-[background-color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE2CC]"
                >
                  Explore the Collection
                </a>
                <a
                  href="#"
                  className="inline-block text-base text-[#2A2620] border-b border-[#2A2620]/40 pb-0.5 hover:text-[#A8582F] hover:border-[#A8582F] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F] focus-visible:border-[#A8582F]"
                >
                  Our Story in Ajmer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* SERVICE STRIP — quiet trust row under the hero */}
      {/* ============================== */}
      <section aria-label="Our promises" className="border-b border-[#E2D5B8]/70">
        <div className="max-w-[1280px] mx-auto px-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2D5B8]/70">
            {SERVICE_ITEMS.map((item) => (
              <li key={item.title} className="flex items-start gap-4 py-8 sm:px-8 lg:px-10 first:pl-0 last:pr-0">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="block shrink-0 mt-0.5 text-[#A8582F]" aria-hidden="true">
                  {item.icon}
                </svg>
                <div>
                  <h3 className="text-sm font-medium tracking-[0.02em] text-[#2A2620] mb-1.5">{item.title}</h3>
                  <p className="text-sm leading-6 text-[#6B5D4A] max-w-[240px]">{item.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================== */}
      {/* EDITORIAL STRIP — brand philosophy, calm & handcrafted */}
      {/* ============================== */}
      <section className="pt-32 pb-28 lg:pt-48 lg:pb-40">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <p className="font-display italic text-base sm:text-lg tracking-[0.02em] text-[#8F8064] mb-16 lg:mb-20">
            Nothing Perfect. Nothing Finished.
          </p>

          <p className="font-display text-[1.75rem] sm:text-[2.35rem] leading-[1.9] tracking-[0.002em] text-[#2A2620] max-w-[680px] mx-auto">
            A small circle of Rajasthan studios.
            <br />
            Clay, wood, cloth — shaped <em className="italic font-normal text-[#A8582F]">the slow way</em>.
            <br />
            Imperfection, left where it falls.
          </p>

          <div className="flex flex-col items-center mt-16 lg:mt-20">
            <BrushRule width={56} className="text-[#A8582F]/40 mb-5" />
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#96876F]">
              Crafted in Ajmer, Rajasthan
            </p>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FEATURED CATEGORIES — asymmetric grid: one large + two stacked */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 pb-28 lg:pb-40">
        <div className="flex items-end justify-between mb-14">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] tracking-[-0.01em] text-[#2A2620]">Shop by Craft</h2>
          <a href="#" className="hidden sm:block text-sm text-[#2A2620] border-b border-[#2A2620] pb-0.5 hover:text-[#A8582F] hover:border-[#A8582F] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F] focus-visible:border-[#A8582F]">
            See Every Craft
          </a>
        </div>

        <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
          <a href="#" className="lg:col-span-7 group relative overflow-hidden rounded-[10px] min-h-[420px] lg:min-h-[520px] ring-1 ring-inset ring-black/[0.05] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_24px_48px_-18px_rgba(35,30,22,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2">
            <FadeImage
              src="https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&q=80&auto=format&fit=crop"
              alt="Hand-woven cotton and wool floor rugs stacked in a sunlit studio"
              hoverScale
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
              <span className="font-display text-3xl text-[#F7F2E7]">Textiles &amp; Rugs</span>
              <span className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-[#F7F2E7]/50 text-[#F7F2E7] shrink-0 transition-[transform,background-color] duration-300 ease-out group-hover:bg-[#F7F2E7] group-hover:text-[#2A2620]">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 12 12 2M12 2H4M12 2v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </a>

          <div className="lg:col-span-5 grid gap-4 lg:gap-5">
            <a href="#" className="group relative overflow-hidden rounded-[10px] min-h-[200px] lg:min-h-[247px] ring-1 ring-inset ring-black/[0.05] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_24px_48px_-18px_rgba(35,30,22,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2">
              <FadeImage
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&q=80&auto=format&fit=crop"
                alt="Brass and terracotta table lamps with linen shades"
                hoverScale
                sizes="(min-width: 1024px) 41vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <span className="font-display text-2xl text-[#F7F2E7]">Lighting</span>
                <span className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-[#F7F2E7]/50 text-[#F7F2E7] shrink-0 transition-[transform,background-color] duration-300 ease-out group-hover:bg-[#F7F2E7] group-hover:text-[#2A2620]">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 12 12 2M12 2H4M12 2v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
            <a href="#" className="group relative overflow-hidden rounded-[10px] min-h-[200px] lg:min-h-[247px] ring-1 ring-inset ring-black/[0.05] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_24px_48px_-18px_rgba(35,30,22,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2">
              <FadeImage
                src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=80&auto=format&fit=crop"
                alt="Glazed ceramic bowls and mugs on an open wooden shelf"
                hoverScale
                sizes="(min-width: 1024px) 41vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <span className="font-display text-2xl text-[#F7F2E7]">Ceramics</span>
                <span className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-[#F7F2E7]/50 text-[#F7F2E7] shrink-0 transition-[transform,background-color] duration-300 ease-out group-hover:bg-[#F7F2E7] group-hover:text-[#2A2620]">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 12 12 2M12 2H4M12 2v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* SHOP BY ROOM — four vertical portals */}
      {/* ============================== */}
      <section className="bg-[#EDE2CC] py-32 lg:py-44">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[560px] mb-14">
            <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-3">Room by Room</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2A2620] mb-6">Find Each Room Its Quiet Corner</h2>
            <p className="text-[17px] leading-8 text-[#4A4032]">
              Start where you spend your time. Each edit is styled in our Ajmer studio, so the pieces sit together the way they will at home.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {SHOP_BY_ROOM.map((room) => (
              <a
                href="#"
                key={room.name}
                className="group relative overflow-hidden rounded-[10px] aspect-[3/4] block ring-1 ring-inset ring-black/[0.05] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_24px_48px_-18px_rgba(35,30,22,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE2CC]"
              >
                <FadeImage
                  src={room.img}
                  alt={room.alt}
                  hoverScale
                  sizes="(min-width: 1024px) 23vw, 50vw"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-display text-xl sm:text-2xl text-[#F7F2E7] mb-1">{room.name}</h3>
                  <p className="text-xs tracking-[0.08em] uppercase text-[#EDE2CC]/85">{room.count}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FEATURED COLLECTION — editorial split, image right, text left */}
      {/* ============================== */}
      <section className="bg-[#EDE2CC]">
        <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-0">
          <div className="grid lg:grid-cols-12 lg:min-h-[600px]">
            <div className="lg:col-span-5 flex items-center order-2 lg:order-1 mt-12 lg:mt-0">
              <div className="lg:pr-12">
                <div className="flex items-center gap-3 mb-8">
                  <SealMark className="w-6 h-6 text-[#A8582F]" />
                  <span className="text-[10px] tracking-[0.16em] uppercase font-medium text-[#A8582F]">
                    Limited Edition · No. 12
                  </span>
                </div>
                <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-4">The Edit</p>
                <h2 className="font-display text-5xl sm:text-6xl leading-[1.15] tracking-[-0.01em] text-[#2A2620] mb-10">
                  The Aravalli Series
                </h2>
                <p className="text-[17px] leading-8 text-[#4A4032] mb-6 max-w-[380px]">
                  Sand-toned stoneware, hand-turned in small batches by a third-generation potter family outside Ajmer. Twelve pieces. No two glazed exactly alike.
                </p>
                <p className="text-sm leading-7 text-[#6B5D4A] mb-10 max-w-[380px] italic font-display">
                  "Each piece is numbered by hand before it leaves the kiln." — Ramesh Prajapati, Master Potter
                </p>
                <a
                  href="#"
                  className="inline-block text-base font-medium tracking-[0.01em] text-[#2A2620] border border-[#2A2620] px-8 py-3.5 rounded-[4px] hover:bg-[#2A2620] hover:text-[#F7F2E7] transition-[background-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE2CC]"
                >
                  Explore the Series
                </a>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 relative min-h-[380px] lg:min-h-full lg:-mr-6">
              <FadeImage
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1300&q=80&auto=format&fit=crop"
                alt="Sand-toned stoneware pitcher and cups from the Aravalli series"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover rounded-[10px] ring-1 ring-inset ring-black/[0.05]"
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
            <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-3">Newly Made</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2A2620]">Latest <span className="italic">Finds</span></h2>
          </div>
          <a href="#" className="hidden sm:block text-sm text-[#2A2620] border-b border-[#2A2620] pb-0.5 hover:text-[#A8582F] hover:border-[#A8582F] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F] focus-visible:border-[#A8582F]">
            See What's New
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {NEW_ARRIVALS.map((product, i) => (
            <div key={product.name} className={i === 1 ? "sm:mt-12 lg:mt-16" : ""}>
              <ProductCard product={product} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      </section>

      {/* ============================== */}
      {/* CRAFTSMANSHIP PROCESS — image left, numbered steps right */}
      {/* ============================== */}
      <section className="border-t border-[#E2D5B8]/70">
        <div className="max-w-[1280px] mx-auto px-6 py-32 lg:py-44">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-4">From Earth to Shelf</p>
              <h2 className="font-display text-3xl sm:text-4xl leading-[1.15] tracking-[-0.01em] text-[#2A2620] mb-3">
                How a Wabi Sabi piece is made
              </h2>
              <BrushRule width={56} className="text-[#A8582F] mb-7" />
              <p className="text-[17px] leading-8 text-[#4A4032] mb-10 max-w-[400px]">
                Nothing here is rushed. A single stoneware jug can pass through four sets of hands over eleven days before it earns a box.
              </p>
              <div className="relative overflow-hidden rounded-[10px] aspect-[4/3] ring-1 ring-inset ring-black/[0.05]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1000&q=80&auto=format&fit=crop"
                  alt="Artisan's hands smoothing the rim of a freshly thrown clay bowl"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-[#96876F] italic font-display mt-4">
                The studio floor, Ajmer — handcrafted, not moulded.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 divide-y divide-[#E2D5B8]/70 border-t border-[#E2D5B8]/70">
              {CRAFT_PROCESS.map((step) => (
                <div key={step.n} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 py-9">
                  <span className="font-display text-2xl text-[#3A4560] leading-none pt-1">{step.n}</span>
                  <div>
                    <h3 className="font-display text-2xl text-[#2A2620] mb-3">{step.title}</h3>
                    <p className="text-base leading-8 text-[#4A4032] max-w-[440px]">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* BEST SELLERS — Linen background, horizontal scroll rhythm change */}
      {/* ============================== */}
      <section className="bg-[#EDE2CC] py-28 lg:py-36">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="mb-14">
            <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-3">Most Loved</p>
            <h2 className="font-display text-4xl sm:text-5xl tracking-[-0.01em] text-[#2A2620]">Collected Favorites</h2>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto pl-6">
          <div className="flex gap-8 overflow-x-auto pb-4 pr-6 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {BEST_SELLERS.map((product) => (
              <div key={product.name} className="flex-shrink-0 w-[260px] sm:w-[300px] snap-start">
                <ProductCard product={product} sizes="(min-width: 640px) 300px, 260px" />
              </div>
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
            <p className="text-sm tracking-[0.14em] uppercase text-[#EDE2CC] mb-6">The Studio Journal</p>
            <h2 className="font-display text-5xl sm:text-6xl leading-[1.2] text-[#F7F2E7] mb-10">
              Meet Kamla Devi, who has thrown pots for thirty-one years.
            </h2>
            <a
              href="#"
              className="inline-block text-base font-medium text-[#F7F2E7] border-b border-[#F7F2E7] pb-1 hover:text-[#EDE2CC] hover:border-[#EDE2CC] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#EDE2CC] focus-visible:border-[#EDE2CC]"
            >
              Read her story
            </a>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* WHY WABI SABI — alternating line-item layout, not an icon grid */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 py-28 lg:py-40">
        <div className="max-w-[560px] mb-20">
          <h2 className="font-display text-3xl sm:text-4xl text-[#2A2620] mb-7">Why Wabi Sabi</h2>
          <p className="text-[17px] leading-8 text-[#4A4032]">
            We don't chase trends or fast turnarounds. Every decision, from the clay we source to the way we pack a box, favours the object outliving you.
          </p>
        </div>

        <div className="divide-y divide-[#E2D5B8]/70 border-t border-b border-[#E2D5B8]/70">
          {WHY_WABI_SABI_ITEMS.map((item, i) => (
            <div
              key={item.n}
              className={`grid sm:grid-cols-12 gap-4 sm:gap-8 py-12 ${i === 1 ? "sm:pl-16" : ""}`}
            >
              <span className="sm:col-span-2 font-display text-base text-[#3A4560]">{item.n}</span>
              <h3 className="sm:col-span-4 font-display text-2xl sm:text-3xl text-[#2A2620] leading-snug">{item.title}</h3>
              <p className="sm:col-span-6 text-base leading-8 text-[#4A4032] max-w-[440px]">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== */}
      {/* JOURNAL — three editorial article cards */}
      {/* ============================== */}
      <section className="border-t border-[#E2D5B8]/70">
        <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-36">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-3">The Journal</p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#2A2620]">Notes from the Studio</h2>
            </div>
            <a href="#" className="hidden sm:block text-sm text-[#2A2620] border-b border-[#2A2620] pb-0.5 hover:text-[#A8582F] hover:border-[#A8582F] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F] focus-visible:border-[#A8582F]">
              All Stories
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {JOURNAL_POSTS.map((post) => (
              <a
                href="#"
                key={post.title}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-4 rounded-[4px]"
              >
                <div className="relative overflow-hidden rounded-[10px] aspect-[3/2] mb-6 ring-1 ring-inset ring-black/[0.05] transition-shadow duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_20px_40px_-16px_rgba(35,30,22,0.2)]">
                  <FadeImage
                    src={post.img}
                    alt={post.alt}
                    hoverScale
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs tracking-[0.1em] uppercase text-[#6B5D4A] mb-3">
                  <span className="text-[#A8582F]">{post.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.read}</span>
                </div>
                <h3 className="font-display text-2xl text-[#2A2620] leading-snug mb-3 group-hover:text-[#A8582F] transition-colors duration-200 ease-out">
                  {post.title}
                </h3>
                <p className="text-base leading-7 text-[#4A4032] max-w-[380px]">{post.excerpt}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* CUSTOMER HOMES — masonry-feel image grid with quotes */}
      {/* ============================== */}
      <section className="bg-[#EDE2CC] py-28 lg:py-40">
        <div className="max-w-[1280px] mx-auto px-6">
          <h2 className="font-display text-3xl sm:text-4xl text-[#2A2620] mb-14">At Home With Wabi Sabi</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:mt-0">
              <div className="rounded-[10px] overflow-hidden mb-5 aspect-[3/4] ring-1 ring-inset ring-black/[0.05]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1616137466211-f939a420be84?w=800&q=80&auto=format&fit=crop"
                  alt="Living room styled with handmade stoneware and a woven rug"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-xl text-[#2A2620] leading-snug mb-2">
                "The vase looks like it's always lived here."
              </p>
              <p className="text-sm text-[#6B5D4A]">Meera, Jaipur</p>
            </div>

            <div className="lg:mt-16">
              <div className="rounded-[10px] overflow-hidden mb-5 aspect-[3/4] ring-1 ring-inset ring-black/[0.05]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80&auto=format&fit=crop"
                  alt="Dining table set with handmade stoneware and brass accents"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-xl text-[#2A2620] leading-snug mb-2">
                "Guests always ask where the bowls are from."
              </p>
              <p className="text-sm text-[#6B5D4A]">Arjun, Udaipur</p>
            </div>

            <div className="lg:mt-0 sm:col-span-2 lg:col-span-1">
              <div className="rounded-[10px] overflow-hidden mb-5 aspect-[3/4] ring-1 ring-inset ring-black/[0.05]">
                <FadeImage
                  src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800&q=80&auto=format&fit=crop"
                  alt="Reading nook with a rattan pendant lamp and textile cushions"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-display text-xl text-[#2A2620] leading-snug mb-2">
                "Slower shipping, but worth every day of the wait."
              </p>
              <p className="text-sm text-[#6B5D4A]">Farah, Mumbai</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* PRESS — quiet band of mentions with pull-quotes */}
      {/* ============================== */}
      <section aria-label="Press mentions" className="border-t border-[#E2D5B8]/70">
        <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
          <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] text-center mb-14">As Seen In</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
            {PRESS_MENTIONS.map((item) => (
              <div key={item.name} className="text-center">
                <p className="font-display text-xl text-[#2A2620] mb-3">{item.name}</p>
                <p className="text-sm leading-6 text-[#6B5D4A] max-w-[200px] mx-auto">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* STORE LOCATIONS — three physical studios */}
      {/* ============================== */}
      <section className="bg-[#2A2620] text-[#F7F2E7]">
        <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-40">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="text-sm tracking-[0.14em] uppercase text-[#A8582F] mb-6">Come Say Hello</p>
              <h2 className="font-display text-3xl sm:text-4xl leading-[1.15] text-[#F7F2E7] mb-8">
                Three studios, each stocked a little differently
              </h2>
              <p className="text-[17px] leading-8 text-[#C7BC9F] mb-10 max-w-[380px]">
                Handle the pieces, meet the team, and see the current collection in the same desert light it was made in.
              </p>
              <a
                href="#"
                className="inline-block text-base font-medium text-[#F7F2E7] border-b border-[#F7F2E7] pb-1 hover:text-[#EDE2CC] hover:border-[#EDE2CC] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#EDE2CC] focus-visible:border-[#EDE2CC]"
              >
                Get directions
              </a>
            </div>

            <div className="lg:col-span-7 lg:col-start-6 grid sm:grid-cols-3 gap-10 sm:gap-8">
              {STORE_LOCATIONS.map((store) => (
                <div key={store.city} className="border-t border-[#4A4032] pt-6">
                  <h3 className="font-display text-2xl text-[#F7F2E7] mb-1">{store.city}</h3>
                  <p className="text-sm text-[#A8582F] mb-5">{store.label}</p>
                  <p className="text-sm leading-7 text-[#C7BC9F]">{store.address}</p>
                  <p className="text-sm leading-7 text-[#96876F] mt-3">{store.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* FAQ — two-column, heading left, answers right */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 py-24 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-sm tracking-[0.14em] uppercase text-[#6B5D4A] mb-3">Good to Know</p>
            <h2 className="font-display text-3xl sm:text-4xl leading-[1.15] text-[#2A2620] mb-8">
              Questions we&apos;re asked most
            </h2>
            <p className="text-[17px] leading-8 text-[#4A4032] mb-8 max-w-[340px]">
              Can&apos;t find your answer? Our team replies to every message, usually within a few hours.
            </p>
            <a
              href="#"
              className="inline-block text-base font-medium tracking-[0.01em] text-[#2A2620] border border-[#2A2620] px-8 py-3.5 rounded-[4px] hover:bg-[#2A2620] hover:text-[#F7F2E7] transition-[background-color,color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2"
            >
              Read all FAQs
            </a>
          </div>

          <dl className="lg:col-span-7 lg:col-start-6 divide-y divide-[#E2D5B8]/70 border-t border-b border-[#E2D5B8]/70">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-8">
                <dt className="font-display text-xl sm:text-2xl text-[#2A2620] mb-4 leading-snug">{faq.q}</dt>
                <dd className="text-base leading-8 text-[#4A4032] max-w-[560px]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================== */}
      {/* INSTAGRAM GALLERY — tight grid, full width feel */}
      {/* ============================== */}
      <section className="max-w-[1280px] mx-auto px-6 py-24 lg:py-32">
        <div className="flex items-end justify-between mb-14">
          <h2 className="font-display text-2xl sm:text-3xl tracking-[0.01em] text-[#2A2620]">@wabisabi.home</h2>
          <a href="#" className="hidden sm:block text-sm text-[#2A2620] border-b border-[#2A2620] pb-0.5 hover:text-[#A8582F] hover:border-[#A8582F] transition-[color,border-color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F] focus-visible:border-[#A8582F]">
            Follow along
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INSTAGRAM_PHOTOS.map((photo, i) => (
            <a href="#" key={i} className="group relative aspect-square overflow-hidden rounded-[10px] block ring-1 ring-inset ring-black/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A2620] focus-visible:ring-offset-2">
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
        <div className="relative bg-[#2A2620] rounded-[20px] px-8 py-20 sm:px-16 sm:py-24 text-center overflow-hidden">
          <InkArc className="absolute -right-24 -top-24 w-[420px] h-[420px] opacity-[0.06] pointer-events-none hidden sm:block text-[#F7F2E7]" />
          <p className="relative text-sm tracking-[0.14em] uppercase text-[#A8582F] mb-6">The Studio Notes</p>
          <h2 className="relative font-display text-4xl sm:text-5xl leading-[1.25] text-[#F7F2E7] max-w-[560px] mx-auto mb-6">
            A short letter on new work and the hands behind it. Once a month, from Ajmer, nothing more.
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative mt-10 flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto"
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
              className="flex-1 bg-transparent border border-[#7D7259] rounded-[4px] px-4 py-3.5 text-base text-[#F7F2E7] placeholder:text-[#96876F] focus:outline-none focus:border-[#F7F2E7] transition-colors duration-200 ease-out"
            />
            <button
              type="submit"
              className="bg-[#A8582F] text-[#F7F2E7] text-base font-medium tracking-[0.01em] px-8 py-3.5 rounded-[4px] hover:bg-[#8F492A] transition-[background-color,transform,box-shadow] duration-200 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7F2E7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A2620]"
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
      <footer className="border-t border-[#E2D5B8]/70">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 mb-20">
            <div className="lg:col-span-2">
              <a href="#" className="flex flex-col leading-[1.05] transition-opacity duration-200 ease-out focus:outline-none focus-visible:opacity-70">
                <span className="font-display text-2xl tracking-[0.02em] text-[#2A2620]">Wabi</span>
                <span className="font-display text-2xl tracking-[0.02em] text-[#2A2620]">Sabi</span>
                <span className="w-7 h-px bg-[#A8582F]/60 mt-3 mb-1" aria-hidden="true" />
                <span className="text-[10px] tracking-[0.16em] uppercase text-[#8F8064]">Handcrafted Decor &amp; Gifts</span>
              </a>
              <p className="text-base leading-7 text-[#6B5D4A] mt-4 max-w-[280px]">
                Handcrafted decor and gifts from independent artisan studios across Rajasthan. Founded in Ajmer, 2016.
              </p>
              <div className="mt-6 space-y-2">
                <a href="mailto:hello@wabisabi.home" className="block text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">
                  hello@wabisabi.home
                </a>
                <a href="tel:+911452453210" className="block text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">
                  +91 145 245 3210
                </a>
                <p className="text-sm text-[#6B5D4A] pt-1 max-w-[280px] leading-7">
                  12 Nalla Bazaar, Ajmer, Rajasthan 305001
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.1em] uppercase text-[#6B5D4A] mb-4">Shop</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Ceramics</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Textiles</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Lighting</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Furniture</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.1em] uppercase text-[#6B5D4A] mb-4">Studio</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Our Story</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">The Artisans</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Journal</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm tracking-[0.1em] uppercase text-[#6B5D4A] mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Shipping &amp; Returns</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Care Guide</a></li>
                <li><a href="#" className="text-sm text-[#2A2620] hover:text-[#A8582F] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#A8582F]">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#E2D5B8]/70 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <p className="text-xs text-[#6B5D4A]">© 2026 Wabi Sabi Home. Crafted in Ajmer, Rajasthan.</p>
              <div className="flex items-center gap-2.5" aria-label="Accepted payment methods">
                <span className="text-[10px] tracking-[0.06em] text-[#6B5D4A] uppercase">Secure payments</span>
                {["UPI", "Visa", "Mastercard", "Amex"].map((m) => (
                  <span
                    key={m}
                    className="text-[10px] tracking-[0.04em] text-[#6B5D4A] border border-[#E2D5B8] rounded-[3px] px-2 py-1 leading-none"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-5">
              <a href="#" aria-label="Instagram" className="text-[#6B5D4A] hover:text-[#2A2620] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#2A2620]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className="block">
                  <rect x="1" y="1" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="8.5" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
                  <circle cx="12.5" cy="4.5" r="0.8" fill="currentColor" />
                </svg>
              </a>
              <a href="#" aria-label="Pinterest" className="text-[#6B5D4A] hover:text-[#2A2620] transition-[color,box-shadow] duration-200 ease-out focus:outline-none focus-visible:text-[#2A2620]">
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
