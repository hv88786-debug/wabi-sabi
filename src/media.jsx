import { useState, useEffect, useRef, memo } from "react";

// Builds a responsive srcset from an Unsplash-style URL by varying its
// `w=` query param, so the browser can request a size that matches the
// viewport instead of always downloading the single largest variant.
export function buildSrcSet(src) {
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
// laid out.
export const FadeImage = memo(function FadeImage({
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
