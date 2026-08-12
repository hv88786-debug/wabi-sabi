# Kalaa Home

A Vite + React + Tailwind CSS project containing the `Home` page component
(handmade-goods storefront: hero, categories, product grids, editorial
sections, testimonials, Instagram gallery, and newsletter signup).

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
kalaa-home/
├── index.html          # HTML entry, loads Fraunces + Inter from Google Fonts
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx         # React root, renders <Home />
    ├── index.css        # Tailwind directives
    └── Home.jsx         # The page component (from your uploaded file)
```

## Notes

- All images are loaded from Unsplash URLs — replace `Home.jsx`'s image
  constants with your own assets/CDN links when ready.
- The design uses two fonts: **Fraunces** (serif, headings) and **Inter**
  (sans, body) — both are wired up in `index.html` and `tailwind.config.js`.
- Tailwind's arbitrary-value classes (e.g. `bg-[#24211D]`) are used
  throughout, so no extra Tailwind color theme setup is required.
