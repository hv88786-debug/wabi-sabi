// ---------------------------------------------------------------------------
// Static commerce data. A small, believable catalogue with real prices,
// materials, ratings and copy — no placeholders. Prices are numbers so the
// cart can do maths; formatINR renders them the Indian way (₹4,200).
// ---------------------------------------------------------------------------

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatINR = (n) => inr.format(n);

export const FREE_SHIPPING_THRESHOLD = 4999;

export const PRODUCTS = [
  {
    id: "kochi-rattan-pendant",
    name: "Kochi Rattan Pendant",
    price: 4200,
    material: "Rattan, jute cord",
    category: "Lighting",
    img: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=800&q=80&auto=format&fit=crop",
    alt: "Handwoven rattan pendant lamp hanging above a reading corner",
    rating: 4.8,
    reviews: 42,
    badge: "New",
    detail:
      "A wide, airy dome woven by hand in Kerala over three days. The open weave throws a soft, dappled light — best over a dining table or a reading corner.",
    dims: "Ø 38 cm · H 32 cm · 1.2 m cord",
    lead: "Ships in 2–3 days",
  },
  {
    id: "carved-walnut-servers",
    name: "Carved Walnut Servers",
    price: 1850,
    material: "Solid walnut",
    category: "Kitchen & Dining",
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80&auto=format&fit=crop",
    alt: "Set of hand-carved walnut serving spoons",
    rating: 4.9,
    reviews: 76,
    badge: "New",
    detail:
      "A pair of serving spoons carved from a single block of Kashmiri walnut, then rubbed with food-safe oil. The grain runs differently through every set.",
    dims: "L 30 cm · set of 2",
    lead: "Ships in 2–3 days",
  },
  {
    id: "sarasa-cushion-cover",
    name: "Sarasa Cushion Cover",
    price: 1150,
    material: "Block-printed cotton",
    category: "Textiles",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80&auto=format&fit=crop",
    alt: "Block-printed cotton cushion covers in indigo and rust",
    rating: 4.7,
    reviews: 58,
    badge: "New",
    detail:
      "Hand block-printed in Bagru with natural indigo and madder-root rust. Concealed zip, and a cover that only softens with washing. Insert not included.",
    dims: "45 × 45 cm",
    lead: "Ships in 2–3 days",
  },
  {
    id: "bhuj-dinner-set",
    name: "Bhuj Dinner Set, 6-piece",
    price: 6400,
    material: "Hand-glazed stoneware",
    category: "Ceramics",
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80&auto=format&fit=crop",
    alt: "Hand-glazed ceramic dinner set stacked on a wooden counter",
    rating: 4.9,
    reviews: 134,
    badge: "Bestseller",
    detail:
      "Two dinner plates, two side plates and two bowls, each thrown and glazed by hand in Kutch. Dishwasher-safe, though a rinse keeps the glaze at its best.",
    dims: "Dinner Ø 26 cm · Side Ø 19 cm · Bowl Ø 14 cm",
    lead: "Ships in 3–4 days",
  },
  {
    id: "undyed-wool-runner",
    name: "Undyed Wool Runner",
    price: 2600,
    material: "Hand-knotted wool",
    category: "Textiles",
    img: "https://images.unsplash.com/photo-1616627981276-b48d485ecf24?w=800&q=80&auto=format&fit=crop",
    alt: "Hand-knotted wool table runner in natural undyed tones",
    rating: 4.8,
    reviews: 91,
    badge: "Bestseller",
    detail:
      "Knotted from the natural fleece of Deccani sheep — no dye, just the wool's own greys and creams. A quiet layer for a dining or console table.",
    dims: "L 180 cm · W 40 cm",
    lead: "Ships in 2–3 days",
  },
  {
    id: "mysore-brass-lamp",
    name: "Mysore Brass Lamp",
    price: 5100,
    material: "Cast brass, linen shade",
    category: "Lighting",
    img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80&auto=format&fit=crop",
    alt: "Brass table lamp with a linen drum shade",
    rating: 4.9,
    reviews: 63,
    badge: "Bestseller",
    detail:
      "A sand-cast brass base, hand-finished so it will patina gently over the years, topped with an unbleached linen drum shade. Takes a standard E27 bulb.",
    dims: "H 46 cm · Shade Ø 28 cm",
    lead: "Ships in 3–4 days",
  },
  {
    id: "sheesham-fruit-bowl",
    name: "Sheesham Fruit Bowl",
    price: 1650,
    material: "Solid sheesham",
    category: "Kitchen & Dining",
    img: "https://images.unsplash.com/photo-1616486338815-1ff81b3b3a1e?w=800&q=80&auto=format&fit=crop",
    alt: "Hand-carved wooden fruit bowl with a natural grain finish",
    rating: 4.7,
    reviews: 48,
    badge: "Bestseller",
    detail:
      "Turned from a single piece of sheesham (Indian rosewood) and finished with beeswax. Deep enough for a week's fruit, light enough to move with one hand.",
    dims: "Ø 28 cm · H 11 cm",
    lead: "Ships in 2–3 days",
  },
  {
    id: "jaisalmer-pitcher",
    name: "Jaisalmer Stoneware Pitcher",
    price: 3400,
    material: "Hand-thrown stoneware",
    category: "Ceramics",
    img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80&auto=format&fit=crop",
    alt: "Sand-toned stoneware pitcher from the Jaisalmer series",
    rating: 4.8,
    reviews: 37,
    detail:
      "The signature piece of the Jaisalmer Series — a generous sand-glazed pitcher for water, wine or a fistful of stems. Each one is glazed a little differently.",
    dims: "H 24 cm · 1.4 L",
    lead: "Ships in 3–4 days",
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const NEW_ARRIVALS = PRODUCTS.filter((p) => p.badge === "New");
export const BEST_SELLERS = PRODUCTS.filter((p) => p.badge === "Bestseller");

export const ANNOUNCEMENTS = [
  "Complimentary shipping over ₹4,999 · Handmade, made to last",
  "New in: The Jaisalmer Series — sand-toned stoneware, in small batches",
  "15-day easy returns · Plastic-free packaging on every order",
  "Now delivering to 20 countries, wrapped by hand",
];

export const POPULAR_SEARCHES = [
  "Stoneware",
  "Cushion covers",
  "Brass lamp",
  "Wool runner",
  "Dinner set",
];

// Desktop mega-menu structure. Each category gets link columns plus a
// featured promo card with a real image.
export const MEGA_MENU = {
  Ceramics: {
    columns: [
      { heading: "Shop", links: ["Dinner Sets", "Bowls & Plates", "Mugs & Cups", "Vases & Vessels"] },
      { heading: "Collections", links: ["The Jaisalmer Series", "Everyday Stoneware", "The Glazed Edit"] },
    ],
    featured: {
      img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=700&q=80&auto=format&fit=crop",
      alt: "Glazed ceramic bowls and mugs on an open wooden shelf",
      label: "The Jaisalmer Series",
      copy: "Sand-toned, small-batch stoneware.",
    },
  },
  Textiles: {
    columns: [
      { heading: "Shop", links: ["Cushion Covers", "Throws & Blankets", "Rugs & Runners", "Table Linen"] },
      { heading: "By Craft", links: ["Block Print", "Hand-Knotted Wool", "Natural Dye", "Handloom Cotton"] },
    ],
    featured: {
      img: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=700&q=80&auto=format&fit=crop",
      alt: "Woven jute and cotton rugs stacked in a studio",
      label: "Undyed & Natural",
      copy: "Wool and cotton in their own colours.",
    },
  },
  Lighting: {
    columns: [
      { heading: "Shop", links: ["Pendants", "Table Lamps", "Floor Lamps", "Wall Sconces"] },
      { heading: "By Material", links: ["Rattan & Cane", "Cast Brass", "Terracotta", "Linen Shades"] },
    ],
    featured: {
      img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=700&q=80&auto=format&fit=crop",
      alt: "Brass and terracotta table lamps with linen shades",
      label: "Warm Light",
      copy: "Brass that patinas as the years pass.",
    },
  },
  Furniture: {
    columns: [
      { heading: "Shop", links: ["Tables", "Seating", "Storage", "Accents"] },
      { heading: "By Wood", links: ["Sheesham", "Reclaimed Teak", "Mango Wood", "Walnut"] },
    ],
    featured: {
      img: "https://images.unsplash.com/photo-1616486338815-1ff81b3b3a1e?w=700&q=80&auto=format&fit=crop",
      alt: "Hand-carved wooden bowl on a timber surface",
      label: "Solid & Reclaimed",
      copy: "Timber with a past, built to last.",
    },
  },
};

export const NAV_LINKS = Object.keys(MEGA_MENU);
