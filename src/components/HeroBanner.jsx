import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    tag: "For Sellers",
    headline: "Reach thousands of buyers.",
    sub: "Post your product in minutes and start getting inquiries today.",
    cta: "Start Selling →",
    ctaLink: "/post-product",
    accent: "#3b82f6",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=600&fit=crop&crop=center",
  },
  {
    tag: "For Buyers",
    headline: "Endless deals. Epic prices.",
    sub: "Browse thousands of listings across Ethiopia and find exactly what you need.",
    cta: "Browse Listings →",
    ctaLink: "/#listings",
    accent: "#8b5cf6",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=600&fit=crop&crop=center",
  },
  {
    tag: "Real-time Chat",
    headline: "Talk directly with sellers.",
    sub: "No middlemen. Message, call, or meet — close deals on your own terms.",
    cta: "Learn More →",
    ctaLink: "/about",
    accent: "#10b981",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1600&h=600&fit=crop&crop=center",
  },
  {
    tag: "AI Powered",
    headline: "Smart recommendations for you.",
    sub: "Our AI surfaces the most relevant listings based on what's trending near you.",
    cta: "Explore Now →",
    ctaLink: "/#listings",
    accent: "#f59e0b",
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&h=600&fit=crop&crop=center",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(false);

  const go = useCallback((idx) => {
    const next = (idx + slides.length) % slides.length;
    if (next === current) return;
    setPrev(current);
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setPrev(null);
      setFading(false);
    }, 600);
  }, [current]);

  useEffect(() => {
    const t = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(t);
  }, [current, go]);

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "50vh", minHeight: 260, maxHeight: 480 }}>

      {/* Background images — crossfade */}
      {slides.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
          <img src={s.img} alt="" className="w-full h-full object-cover" loading="lazy" />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <div
            key={current}
            className="max-w-xl"
            style={{ animation: "slideUp 0.5s ease-out" }}
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border"
              style={{ color: slide.accent, borderColor: slide.accent + "60", background: slide.accent + "20" }}
            >
              {slide.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              {slide.headline}
            </h2>
            <p className="text-white/70 text-sm sm:text-base mb-6 leading-relaxed">{slide.sub}</p>
            <a
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: slide.accent }}
            >
              {slide.cta}
            </a>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? slide.accent : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
        <div
          key={current}
          className="h-full"
          style={{ background: slide.accent, animation: "progress 5s linear" }}
        />
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
