import { useEffect, useState } from "react";

const listings = [
  { label: "Electronics", name: "iPhone 14 Pro", price: "45,000 ETB", tag: "New", color: "bg-blue-500" },
  { label: "Vehicles", name: "Toyota Corolla", price: "850,000 ETB", tag: "Used", color: "bg-indigo-500" },
  { label: "Real Estate", name: "2BR Apartment", price: "1,200,000 ETB", tag: "New", color: "bg-violet-500" },
];

export default function HeroIllustration() {
  const [active, setActive] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [lineProgress, setLineProgress] = useState(0);

  // Cycle through listings
  useEffect(() => {
    const t = setInterval(() => {
      setPulse(true);
      setLineProgress(0);
      setTimeout(() => {
        setActive(p => (p + 1) % listings.length);
        setPulse(false);
      }, 400);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Animate line progress
  useEffect(() => {
    setLineProgress(0);
    const start = Date.now();
    const duration = 2800;
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setLineProgress(progress);
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [active]);

  const item = listings[active];

  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center select-none">

      {/* ── SELLER CARD (top-left) ── */}
      <div className={`absolute top-4 left-0 w-52 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-2xl transition-all duration-500 ${pulse ? "opacity-60 scale-95" : "opacity-100 scale-100"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            S
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Seller</p>
            <p className="text-white/50 text-[10px]">Posts listing</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        {/* Mock listing card */}
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-[10px]">{item.label}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.tag === "New" ? "bg-green-500/30 text-green-300" : "bg-amber-500/30 text-amber-300"}`}>{item.tag}</span>
          </div>
          <div className="h-12 bg-white/10 rounded-lg mb-2 flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg">
              {item.label === "Electronics" ? "📱" : item.label === "Vehicles" ? "🚗" : "🏠"}
            </div>
          </div>
          <p className="text-white text-xs font-semibold truncate">{item.name}</p>
          <p className="text-blue-300 text-xs font-bold mt-0.5">{item.price}</p>
        </div>
      </div>

      {/* ── ANIMATED SVG LINES ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 420" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Line: Seller → Platform */}
        <path
          d="M 160 80 C 200 80, 200 210, 200 210"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="1.5"
          strokeDasharray="200"
          strokeDashoffset={200 - lineProgress * 200}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
        {/* Animated dot on line 1 */}
        {lineProgress > 0.1 && lineProgress < 0.9 && (
          <circle r="4" fill="#3b82f6">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M 160 80 C 200 80, 200 210, 200 210" />
          </circle>
        )}

        {/* Line: Platform → Buyer */}
        <path
          d="M 200 210 C 200 210, 200 320, 240 340"
          fill="none"
          stroke="url(#lineGrad2)"
          strokeWidth="1.5"
          strokeDasharray="160"
          strokeDashoffset={lineProgress > 0.5 ? 160 - (lineProgress - 0.5) * 2 * 160 : 160}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
        {lineProgress > 0.5 && lineProgress < 0.95 && (
          <circle r="4" fill="#8b5cf6">
            <animateMotion dur="1.4s" repeatCount="indefinite" path="M 200 210 C 200 210, 200 320, 240 340" />
          </circle>
        )}

        {/* Decorative circles at nodes */}
        <circle cx="200" cy="210" r="6" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="200" cy="210" r="3" fill="white" fillOpacity="0.4" />
      </svg>

      {/* ── PLATFORM HUB (center) ── */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 p-3 shadow-2xl text-center transition-all duration-500 ${pulse ? "scale-110" : "scale-100"}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-2 text-white font-black text-sm shadow-lg">
          B
        </div>
        <p className="text-white text-[10px] font-bold">Broker</p>
        <p className="text-white/50 text-[9px]">Marketplace</p>
        <div className="flex justify-center gap-1 mt-2">
          {listings.map((_, i) => (
            <span key={i} className={`rounded-full transition-all duration-300 ${i === active ? "w-3 h-1.5 bg-blue-400" : "w-1.5 h-1.5 bg-white/30"}`} />
          ))}
        </div>
      </div>

      {/* ── BUYER CARD (bottom-right) ── */}
      <div className={`absolute bottom-4 right-0 w-52 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 shadow-2xl transition-all duration-500 ${pulse ? "opacity-60 scale-95" : "opacity-100 scale-100"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            B
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Buyer</p>
            <p className="text-white/50 text-[10px]">Finds & contacts</p>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        </div>
        {/* Mock chat bubble */}
        <div className="space-y-1.5">
          <div className="bg-white/10 rounded-xl rounded-tl-sm px-3 py-2">
            <p className="text-white/80 text-[10px]">Hi, is this still available?</p>
          </div>
          <div className={`${item.color} bg-opacity-40 rounded-xl rounded-tr-sm px-3 py-2 ml-4`}>
            <p className="text-white text-[10px]">Yes! Come see it today 👍</p>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex-1 h-6 bg-white/10 rounded-lg" />
            <div className={`w-6 h-6 rounded-lg ${item.color} flex items-center justify-center`}>
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING STAT BADGES ── */}
      <div className="absolute top-1/3 right-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-center">
        <p className="text-white font-extrabold text-sm">1,200+</p>
        <p className="text-white/50 text-[9px]">Listings</p>
      </div>
      <div className="absolute bottom-1/3 left-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-center">
        <p className="text-white font-extrabold text-sm">3,500+</p>
        <p className="text-white/50 text-[9px]">Users</p>
      </div>

    </div>
  );
}
