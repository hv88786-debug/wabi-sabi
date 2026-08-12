import { useState, useEffect, useRef, useMemo } from "react";
import { FadeImage } from "./media";
import { useCommerce } from "./commerce-store";
import {
  PRODUCTS,
  getProduct,
  formatINR,
  POPULAR_SEARCHES,
  FREE_SHIPPING_THRESHOLD,
} from "./commerce-data";
import { Stars, BackToTop } from "./commerce-ui";
import {
  CloseIcon,
  SearchIcon,
  BagIcon,
  HeartIcon,
  PlusIcon,
  MinusIcon,
  CheckIcon,
} from "./commerce-icons";

// ---------------------------------------------------------------------------
// Right-hand slide-over shell, shared by the cart and wishlist. Owns its own
// ESC handling and a Tab focus-trap; body-scroll lock lives in the store.
// ---------------------------------------------------------------------------

function SideDrawer({ open, onClose, labelledById, title, subtitle, children, footer }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-[#24211D]/40 transition-opacity duration-300 ease-out ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        className={`absolute top-0 right-0 h-full w-full max-w-[420px] bg-[#FAF7F2] flex flex-col shadow-[-8px_0_40px_-16px_rgba(36,33,29,0.28)] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-6 border-b border-[#E4DDD0]/70">
          <div>
            <h2 id={labelledById} className="font-serif text-2xl text-[#24211D] leading-none">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-[#6B6459] mt-2">{subtitle}</p>}
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            tabIndex={open ? 0 : -1}
            className="p-2 -mr-2 rounded-[4px] text-[#24211D] hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && <div className="border-t border-[#E4DDD0]/70 px-6 py-6">{footer}</div>}
      </div>
    </div>
  );
}

function QtyStepper({ qty, onDec, onInc, label }) {
  return (
    <div className="inline-flex items-center border border-[#E4DDD0] rounded-[4px]">
      <button
        type="button"
        onClick={onDec}
        aria-label={`Decrease quantity of ${label}`}
        className="grid place-items-center w-9 h-9 text-[#24211D] hover:bg-[#F1EAE0] transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#24211D] rounded-l-[4px]"
      >
        <MinusIcon size={13} />
      </button>
      <span className="w-9 text-center text-sm tabular-nums text-[#24211D]" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        aria-label={`Increase quantity of ${label}`}
        className="grid place-items-center w-9 h-9 text-[#24211D] hover:bg-[#F1EAE0] transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#24211D] rounded-r-[4px]"
      >
        <PlusIcon size={13} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cart drawer
// ---------------------------------------------------------------------------

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    closeCart,
    setQty,
    removeFromCart,
    cartSubtotal,
    cartCount,
    freeShippingRemaining,
    openSearch,
  } = useCommerce();

  const lines = cart
    .map((l) => ({ ...l, product: getProduct(l.id) }))
    .filter((l) => l.product);

  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifies = freeShippingRemaining <= 0 && cartSubtotal > 0;

  const empty = lines.length === 0;

  return (
    <SideDrawer
      open={cartOpen}
      onClose={closeCart}
      labelledById="cart-drawer-title"
      title="Your Bag"
      subtitle={empty ? undefined : `${cartCount} ${cartCount === 1 ? "item" : "items"}`}
      footer={
        empty ? null : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6B6459]">Subtotal</span>
              <span className="font-serif text-xl text-[#24211D]">{formatINR(cartSubtotal)}</span>
            </div>
            <p className="text-xs text-[#6B6459] mb-5">
              Taxes included. Shipping calculated at checkout.
            </p>
            <button
              type="button"
              className="w-full bg-[#B5502D] text-[#FAF7F2] text-base font-medium tracking-[0.01em] py-4 rounded-[4px] hover:bg-[#9c4325] transition-[background-color,transform] duration-200 ease-out active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              onClick={closeCart}
              className="w-full text-sm text-[#24211D] underline underline-offset-4 decoration-[#C9C2B4] hover:decoration-[#24211D] py-3 mt-1 transition-[text-decoration-color] duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
            >
              Continue shopping
            </button>
          </div>
        )
      }
    >
      {empty ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-[#F1EAE0] text-[#B5502D] mb-6">
            <BagIcon size={26} />
          </div>
          <p className="font-serif text-2xl text-[#24211D] mb-3">Your bag is empty</p>
          <p className="text-sm leading-7 text-[#6B6459] max-w-[260px] mb-8">
            Nothing here yet. Browse the collection and the pieces you love will gather here.
          </p>
          <button
            type="button"
            onClick={() => {
              closeCart();
              openSearch();
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#24211D] border border-[#24211D] px-7 py-3 rounded-[4px] hover:bg-[#24211D] hover:text-[#FAF7F2] transition-[background-color,color] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
          >
            <SearchIcon size={15} />
            Explore the collection
          </button>
        </div>
      ) : (
        <div className="px-6">
          {/* Free-shipping progress */}
          <div className="py-5 border-b border-[#E4DDD0]/70">
            <p className="text-sm text-[#4B473F] mb-2.5">
              {qualifies ? (
                <span className="inline-flex items-center gap-1.5 text-[#4B7A4E]">
                  <CheckIcon size={15} /> You&apos;ve unlocked complimentary shipping
                </span>
              ) : (
                <>
                  Add <span className="font-medium text-[#24211D]">{formatINR(freeShippingRemaining)}</span> more for
                  complimentary shipping
                </>
              )}
            </p>
            <div className="h-1.5 rounded-full bg-[#E4DDD0] overflow-hidden">
              <div
                className="h-full bg-[#B5502D] rounded-full transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-[#E4DDD0]/70">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex gap-4 py-5">
                <div className="w-20 h-24 shrink-0 rounded-[6px] overflow-hidden bg-[#F1EAE0]">
                  <FadeImage
                    src={product.img}
                    alt={product.alt}
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-serif text-base text-[#24211D] truncate">{product.name}</p>
                      <p className="text-xs text-[#6B6459] mt-0.5">{product.material}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      aria-label={`Remove ${product.name}`}
                      className="p-1 -mr-1 text-[#96907F] hover:text-[#B5502D] transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
                    >
                      <CloseIcon size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <QtyStepper
                      qty={qty}
                      label={product.name}
                      onDec={() => setQty(product.id, qty - 1)}
                      onInc={() => setQty(product.id, qty + 1)}
                    />
                    <span className="text-sm text-[#24211D]">{formatINR(product.price * qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </SideDrawer>
  );
}

// ---------------------------------------------------------------------------
// Wishlist drawer
// ---------------------------------------------------------------------------

export function WishlistDrawer() {
  const { wishlist, wishlistOpen, closeWishlist, toggleWishlist, moveToCart, openSearch } = useCommerce();

  const items = wishlist.map((id) => getProduct(id)).filter(Boolean);
  const empty = items.length === 0;

  return (
    <SideDrawer
      open={wishlistOpen}
      onClose={closeWishlist}
      labelledById="wishlist-drawer-title"
      title="Saved"
      subtitle={empty ? undefined : `${items.length} ${items.length === 1 ? "piece" : "pieces"}`}
    >
      {empty ? (
        <div className="h-full flex flex-col items-center justify-center text-center px-8 py-16">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-[#F1EAE0] text-[#B5502D] mb-6">
            <HeartIcon size={26} />
          </div>
          <p className="font-serif text-2xl text-[#24211D] mb-3">No saved pieces yet</p>
          <p className="text-sm leading-7 text-[#6B6459] max-w-[260px] mb-8">
            Tap the heart on anything you love to keep it here while you decide.
          </p>
          <button
            type="button"
            onClick={() => {
              closeWishlist();
              openSearch();
            }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#24211D] border border-[#24211D] px-7 py-3 rounded-[4px] hover:bg-[#24211D] hover:text-[#FAF7F2] transition-[background-color,color] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
          >
            <SearchIcon size={15} />
            Start browsing
          </button>
        </div>
      ) : (
        <ul className="px-6 divide-y divide-[#E4DDD0]/70">
          {items.map((product) => (
            <li key={product.id} className="flex gap-4 py-5">
              <div className="w-20 h-24 shrink-0 rounded-[6px] overflow-hidden bg-[#F1EAE0]">
                <FadeImage src={product.img} alt={product.alt} sizes="80px" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-base text-[#24211D] truncate">{product.name}</p>
                    <p className="text-sm text-[#24211D] mt-0.5">{formatINR(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={`Remove ${product.name} from saved`}
                    className="p-1 -mr-1 text-[#96907F] hover:text-[#B5502D] transition-colors duration-200 ease-out focus:outline-none focus-visible:text-[#B5502D]"
                  >
                    <CloseIcon size={15} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => moveToCart(product.id)}
                  className="mt-auto self-start inline-flex items-center gap-2 text-sm font-medium text-[#24211D] border border-[#24211D] px-4 py-2 rounded-[4px] hover:bg-[#24211D] hover:text-[#FAF7F2] transition-[background-color,color] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
                >
                  <BagIcon size={15} />
                  Move to bag
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </SideDrawer>
  );
}

// ---------------------------------------------------------------------------
// Quick view modal
// ---------------------------------------------------------------------------

export function QuickViewModal() {
  const { quickViewId, closeQuickView, addWithToast, toggleWishlist, isWishlisted } = useCommerce();
  const product = quickViewId ? getProduct(quickViewId) : null;
  const [qty, setQty] = useState(1);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    setQty(1);
  }, [quickViewId]);

  useEffect(() => {
    if (!product) return;
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e) => e.key === "Escape" && closeQuickView();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [product, closeQuickView]);

  const wished = product ? isWishlisted(product.id) : false;

  return (
    <div className={`fixed inset-0 z-[55] ${product ? "" : "pointer-events-none"}`} aria-hidden={!product}>
      <div
        onClick={closeQuickView}
        aria-hidden="true"
        className={`absolute inset-0 bg-[#24211D]/50 transition-opacity duration-300 ease-out ${
          product ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quickview-title"
          className={`relative w-full max-w-[860px] max-h-[90vh] overflow-hidden bg-[#FAF7F2] rounded-[12px] shadow-[0_30px_60px_-24px_rgba(36,33,29,0.5)] pointer-events-auto transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            product ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-3"
          }`}
        >
          <button
            ref={closeRef}
            onClick={closeQuickView}
            aria-label="Close quick view"
            className="absolute top-4 right-4 z-10 grid place-items-center w-9 h-9 rounded-full bg-[#FAF7F2]/90 text-[#24211D] hover:bg-[#F1EAE0] transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
          >
            <CloseIcon size={18} />
          </button>

          {product && (
            <div className="grid sm:grid-cols-2 max-h-[90vh] overflow-y-auto">
              <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full min-h-[280px] bg-[#F1EAE0]">
                <FadeImage
                  src={product.img}
                  alt={product.alt}
                  sizes="(min-width: 640px) 430px, 100vw"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 text-xs tracking-[0.1em] uppercase bg-[#FAF7F2] text-[#24211D] px-2.5 py-1 rounded-[4px]">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-7 sm:p-9 flex flex-col">
                <p className="text-xs tracking-[0.14em] uppercase text-[#6B6459] mb-3">{product.category}</p>
                <h3 id="quickview-title" className="font-serif text-3xl text-[#24211D] leading-tight mb-4">
                  {product.name}
                </h3>
                <div className="mb-5">
                  <Stars rating={product.rating} reviews={product.reviews} size={14} />
                </div>
                <p className="font-serif text-2xl text-[#24211D] mb-6">{formatINR(product.price)}</p>
                <p className="text-[15px] leading-7 text-[#4B473F] mb-6">{product.detail}</p>

                <dl className="text-sm text-[#6B6459] space-y-1.5 mb-8">
                  <div className="flex gap-2">
                    <dt className="text-[#96907F] w-24 shrink-0">Dimensions</dt>
                    <dd className="text-[#4B473F]">{product.dims}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-[#96907F] w-24 shrink-0">Material</dt>
                    <dd className="text-[#4B473F]">{product.material}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-[#96907F] w-24 shrink-0">Delivery</dt>
                    <dd className="text-[#4B473F]">{product.lead}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex items-center gap-3">
                  <QtyStepper
                    qty={qty}
                    label={product.name}
                    onDec={() => setQty((q) => Math.max(1, q - 1))}
                    onInc={() => setQty((q) => Math.min(20, q + 1))}
                  />
                  <button
                    type="button"
                    onClick={() => addWithToast(product.id, qty)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#B5502D] text-[#FAF7F2] text-sm font-medium tracking-[0.02em] py-3.5 rounded-[4px] hover:bg-[#9c4325] transition-[background-color,transform] duration-200 ease-out active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
                  >
                    <BagIcon size={16} />
                    Add to Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={wished ? "Remove from saved" : "Save to wishlist"}
                    aria-pressed={wished}
                    className={`grid place-items-center w-12 h-12 shrink-0 rounded-[4px] border transition-[background-color,color,border-color] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2 ${
                      wished
                        ? "bg-[#B5502D] border-[#B5502D] text-[#FAF7F2]"
                        : "border-[#24211D] text-[#24211D] hover:bg-[#F1EAE0]"
                    }`}
                  >
                    <HeartIcon filled={wished} size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search overlay
// ---------------------------------------------------------------------------

function SearchResultTile({ product, onPick }) {
  return (
    <button
      type="button"
      onClick={() => onPick(product.id)}
      className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-4 rounded-[4px]"
    >
      <div className="relative overflow-hidden rounded-[8px] bg-[#F1EAE0] aspect-[4/5] mb-3">
        <FadeImage
          src={product.img}
          alt={product.alt}
          sizes="(min-width: 640px) 25vw, 50vw"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        />
      </div>
      <p className="font-serif text-base text-[#24211D] leading-snug">{product.name}</p>
      <p className="text-sm text-[#6B6459] mt-0.5">{formatINR(product.price)}</p>
    </button>
  );
}

export function SearchOverlay() {
  const { searchOpen, closeSearch, openQuickView } = useCommerce();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSearch();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch]);

  const trimmed = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!trimmed) return [];
    return PRODUCTS.filter((p) =>
      [p.name, p.category, p.material].join(" ").toLowerCase().includes(trimmed)
    );
  }, [trimmed]);

  const pick = (id) => {
    closeSearch();
    openQuickView(id);
  };

  const popular = PRODUCTS.filter((p) => p.badge === "Bestseller").slice(0, 4);

  return (
    <div className={`fixed inset-0 z-[52] ${searchOpen ? "" : "pointer-events-none"}`} aria-hidden={!searchOpen}>
      <div
        onClick={closeSearch}
        aria-hidden="true"
        className={`absolute inset-0 bg-[#24211D]/40 transition-opacity duration-300 ease-out ${
          searchOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the shop"
        className={`absolute top-0 left-0 right-0 bg-[#FAF7F2] shadow-[0_24px_48px_-24px_rgba(36,33,29,0.35)] transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          searchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 py-6">
          <div className="flex items-center gap-4 border-b border-[#24211D] pb-4">
            <SearchIcon size={22} />
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <input
              id="shop-search"
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ceramics, textiles, lighting…"
              className="flex-1 bg-transparent text-xl sm:text-2xl font-serif text-[#24211D] placeholder:text-[#96907F] focus:outline-none"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="p-2 rounded-[4px] text-[#24211D] hover:opacity-60 transition-[opacity,box-shadow] duration-200 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto py-8">
            {!trimmed ? (
              <div>
                <p className="text-xs tracking-[0.14em] uppercase text-[#6B6459] mb-4">Popular searches</p>
                <div className="flex flex-wrap gap-2.5 mb-10">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="text-sm text-[#24211D] border border-[#E4DDD0] rounded-full px-4 py-2 hover:border-[#24211D] hover:bg-[#F1EAE0] transition-[background-color,border-color] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24211D] focus-visible:ring-offset-2"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <p className="text-xs tracking-[0.14em] uppercase text-[#6B6459] mb-5">Popular right now</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
                  {popular.map((p) => (
                    <SearchResultTile key={p.id} product={p} onPick={pick} />
                  ))}
                </div>
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-sm text-[#6B6459] mb-6">
                  {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query.trim()}&rdquo;
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
                  {results.map((p) => (
                    <SearchResultTile key={p.id} product={p} onPick={pick} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-serif text-2xl text-[#24211D] mb-3">
                  Nothing matched &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="text-sm leading-7 text-[#6B6459] max-w-[320px] mx-auto">
                  Try a material or a room — &ldquo;stoneware&rdquo;, &ldquo;brass&rdquo;, or &ldquo;cushion&rdquo; will
                  all bring something up.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast — confirms an add-to-cart, with a shortcut into the bag.
// ---------------------------------------------------------------------------

export function Toast() {
  const { toast, openCart } = useCommerce();
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none w-[calc(100%-2rem)] max-w-[380px]">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto flex items-center gap-3 bg-[#24211D] text-[#FAF7F2] rounded-[8px] px-4 py-3.5 shadow-[0_16px_40px_-16px_rgba(36,33,29,0.7)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <span className="grid place-items-center w-8 h-8 rounded-full bg-[#B5502D] text-[#FAF7F2] shrink-0">
          <CheckIcon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-tight">{toast?.title || "Added to your bag"}</p>
          {toast?.note && <p className="text-xs text-[#C9C2B4] truncate mt-0.5">{toast.note}</p>}
        </div>
        <button
          type="button"
          onClick={openCart}
          className="shrink-0 text-xs font-medium tracking-[0.04em] uppercase text-[#FAF7F2] border-b border-[#837D6E] pb-0.5 hover:border-[#FAF7F2] transition-[border-color] duration-200 ease-out focus:outline-none focus-visible:border-[#FAF7F2]"
        >
          View bag
        </button>
      </div>
    </div>
  );
}

// One mount point for every always-on commerce layer.
export function GlobalCommerceUI() {
  return (
    <>
      <SearchOverlay />
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <Toast />
      <BackToTop />
    </>
  );
}
