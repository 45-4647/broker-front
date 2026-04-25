import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const messages = [
  { text: "🏪 Are you a Seller?", highlight: "Post your product today", sub: "— reach 3,500+ buyers across Ethiopia", link: "/post-product", cta: "Start Selling →", color: "from-blue-600 to-indigo-600" },
  { text: "🛒 Are you a Buyer?", highlight: "Browse 1,200+ listings", sub: "— find the best deals near you", link: "/#listings", cta: "Browse Now →", color: "from-indigo-600 to-violet-600" },
  { text: "💬 Real-time Chat", highlight: "Talk directly with sellers", sub: "— no middlemen, no delays", link: "/register", cta: "Join Free →", color: "from-violet-600 to-blue-600" },
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setAnimating(false);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const msg = messages[current];

  return (
    <div className={`relative z-50 bg-gradient-to-r ${msg.color} transition-all duration-500`}>
      <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
        {/* Animated text */}
        <div className={`flex-1 flex items-center justify-center gap-2 text-xs text-white transition-all duration-400 ${animating ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}
          style={{ transition: "opacity 0.4s, transform 0.4s" }}>
          <span className="font-medium opacity-80">{msg.text}</span>
          <span className="font-bold">{msg.highlight}</span>
          <span className="opacity-70 hidden sm:inline">{msg.sub}</span>
          <Link to={msg.link} className="ml-2 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 font-bold transition text-white text-[11px]">
            {msg.cta}
          </Link>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1 shrink-0 ml-3">
          {messages.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"}`} />
          ))}
          <button onClick={() => setVisible(false)} className="ml-2 text-white/60 hover:text-white text-xs leading-none">✕</button>
        </div>
      </div>
    </div>
  );
}
