import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { getProduct, FREE_SHIPPING_THRESHOLD } from "./commerce-data";

const CommerceContext = createContext(null);

export function useCommerce() {
  const ctx = useContext(CommerceContext);
  if (!ctx) throw new Error("useCommerce must be used within CommerceProvider");
  return ctx;
}

export function CommerceProvider({ children }) {
  // cart: [{ id, qty }] · wishlist: [id] · recentlyViewed: [id] newest-first
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Which overlay is open. quickViewId doubles as "modal open".
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);

  // Transient toast: { id, title, note }
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((title, note) => {
    setToast({ id: Date.now(), title, note });
  }, []);

  useEffect(() => {
    if (!toast) return;
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(toastTimer.current);
  }, [toast]);

  // ---- cart actions -------------------------------------------------------
  const addToCart = useCallback((id, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) {
        return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 20) } : l));
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 20) } : l))
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ---- wishlist -----------------------------------------------------------
  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  const moveToCart = useCallback(
    (id) => {
      addToCart(id, 1);
      setWishlist((prev) => prev.filter((x) => x !== id));
    },
    [addToCart]
  );

  // ---- recently viewed ----------------------------------------------------
  const recordView = useCallback((id) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 6));
  }, []);

  // ---- overlay open/close -------------------------------------------------
  const openCart = useCallback(() => {
    setSearchOpen(false);
    setWishlistOpen(false);
    setCartOpen(true);
  }, []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const openWishlist = useCallback(() => {
    setSearchOpen(false);
    setCartOpen(false);
    setWishlistOpen(true);
  }, []);
  const closeWishlist = useCallback(() => setWishlistOpen(false), []);

  const openSearch = useCallback(() => {
    setCartOpen(false);
    setWishlistOpen(false);
    setSearchOpen(true);
  }, []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const openQuickView = useCallback(
    (id) => {
      recordView(id);
      setQuickViewId(id);
    },
    [recordView]
  );
  const closeQuickView = useCallback(() => setQuickViewId(null), []);

  const addWithToast = useCallback(
    (id, qty = 1) => {
      const p = getProduct(id);
      addToCart(id, qty);
      showToast("Added to your bag", p ? p.name : undefined);
    },
    [addToCart, showToast]
  );

  // ---- derived ------------------------------------------------------------
  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const p = getProduct(l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0),
    [cart]
  );
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // ---- body scroll lock while any layer is open ---------------------------
  const anyLayerOpen = cartOpen || wishlistOpen || searchOpen || quickViewId != null;
  useEffect(() => {
    if (!anyLayerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [anyLayerOpen]);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      recentlyViewed,
      cartOpen,
      wishlistOpen,
      searchOpen,
      quickViewId,
      toast,
      cartCount,
      cartSubtotal,
      freeShippingRemaining,
      addToCart,
      addWithToast,
      setQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      moveToCart,
      recordView,
      openCart,
      closeCart,
      openWishlist,
      closeWishlist,
      openSearch,
      closeSearch,
      openQuickView,
      closeQuickView,
      showToast,
    }),
    [
      cart,
      wishlist,
      recentlyViewed,
      cartOpen,
      wishlistOpen,
      searchOpen,
      quickViewId,
      toast,
      cartCount,
      cartSubtotal,
      freeShippingRemaining,
      addToCart,
      addWithToast,
      setQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      moveToCart,
      recordView,
      openCart,
      closeCart,
      openWishlist,
      closeWishlist,
      openSearch,
      closeSearch,
      openQuickView,
      closeQuickView,
      showToast,
    ]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}
