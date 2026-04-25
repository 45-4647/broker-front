import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import HeroIllustration from "../components/HeroIllustration";
import HeroBanner from "../components/HeroBanner";

const categories = ["All","Electronics","Vehicles","Real Estate","Fashion","Furniture","Services","Other"];
const categoryIcons = { All:"🏪",Electronics:"📱",Vehicles:"🚗","Real Estate":"🏠",Fashion:"👗",Furniture:"🛋️",Services:"🔧",Other:"📦" };

const testimonials = [
  {
    name: "Abebe T.", role: "Seller", city: "Addis Ababa",
    text: "I sold my laptop in 2 days. The platform connected me with serious buyers instantly. Highly recommend for anyone selling electronics.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    product: "MacBook Pro", amount: "45,000 ETB",
  },
  {
    name: "Sara M.", role: "Buyer", city: "Hawassa",
    text: "Found exactly what I was looking for at a great price. The chat feature made negotiating super easy and fast.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    product: "iPhone 13", amount: "38,000 ETB",
  },
  {
    name: "Dawit K.", role: "Seller", city: "Dire Dawa",
    text: "Posted my car and got 5 inquiries the same day. The 3% fee is very fair compared to other platforms.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    product: "Toyota Corolla", amount: "850,000 ETB",
  },
  {
    name: "Meron H.", role: "Buyer", city: "Bahir Dar",
    text: "The AI recommendations showed me exactly what I needed. Bought a sofa set within 3 days of signing up.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    product: "Sofa Set", amount: "12,000 ETB",
  },
  {
    name: "Yonas B.", role: "Seller", city: "Mekelle",
    text: "Simple, fast, and effective. My products get seen by real buyers. Best marketplace in Ethiopia.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    product: "Samsung TV", amount: "22,000 ETB",
  },
];

const howItWorks = [
  { icon: "📝", step: "01", title: "Create Account", desc: "Sign up free as a buyer or seller in under a minute." },
  { icon: "📦", step: "02", title: "Post or Browse", desc: "Sellers post with images. Buyers search and filter listings." },
  { icon: "💬", step: "03", title: "Connect", desc: "Chat, call, or email the seller directly from the listing." },
  { icon: "🤝", step: "04", title: "Close the Deal", desc: "Meet, inspect, and finalize on your own terms." },
];

export default function Home({ theme = "dark" }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [condition, setCondition] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const isDark = theme === "dark";
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data.allProducts || []);
        setFiltered(res.data.allProducts || []);
        setRecommended(res.data.recommended || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...products];
    if (category !== "All") list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    if (condition !== "All") list = list.filter(p => p.condition === condition);
    if (priceRange.min) list = list.filter(p => p.price >= parseFloat(priceRange.min));
    if (priceRange.max) list = list.filter(p => p.price <= parseFloat(priceRange.max));
    if (search.trim()) list = list.filter(p => [p.name, p.model, p.location].join(" ").toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "latest") list.sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt));
    else if (sortBy === "oldest") list.sort((a,b) => new Date(a.createdAt)-new Date(b.createdAt));
    else if (sortBy === "price-asc") list.sort((a,b) => a.price-b.price);
    else if (sortBy === "price-desc") list.sort((a,b) => b.price-a.price);
    setFiltered(list);
  }, [search, category, sortBy, condition, priceRange, products]);

  const hasFilters = search || category !== "All" || sortBy !== "latest" || condition !== "All" || priceRange.min || priceRange.max;
  const clearFilters = () => { setSearch(""); setCategory("All"); setSortBy("latest"); setCondition("All"); setPriceRange({ min:"", max:"" }); };

  const inputCls = isDark
    ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-none"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400 outline-none";

  const card = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>


      {/* ══ HERO ══ */}
      <div className={`relative overflow-hidden ${isDark ? "bg-[#0f1035]" : "bg-[#1a1f5e]"}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-300 text-sm font-medium">Ethiopia's #1 Marketplace</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
                The largest marketplace to{" "}
                <span className="text-blue-400">buy and sell</span>{" "}
                anything
              </h1>
              <p className="text-blue-100/80 text-lg mb-8 leading-relaxed">
                Join 3,500+ buyers and sellers closing deals every day. Electronics, vehicles, real estate, fashion and more — all in one place.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="#listings" className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-600/30">
                  View Listings →
                </Link>
                {!user ? (
                  <Link to="/register" className="px-7 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 text-white font-bold text-sm transition-all flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">▶</span>
                    Get Started Free
                  </Link>
                ) : user.role === "seller" ? (
                  <Link to="/post-product" className="px-7 py-3.5 rounded-xl border border-white/30 hover:bg-white/10 text-white font-bold text-sm transition-all">
                    + Post a Product
                  </Link>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                </div>
                <span className="text-white/60 text-xs">4.8 average rating based on 500+ reviews</span>
                <div className="flex -space-x-2 ml-2">
                  {["bg-blue-500","bg-indigo-500","bg-violet-500"].map((c,i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-[#0f1035]`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: animated illustration */}
            <div className="hidden lg:block h-[420px]">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>

      {/* ══ HERO BANNER SLIDER ══ */}
      <HeroBanner />

      {/* ══ STATS STRIP ══ */}
      <div className={`border-b ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "1,200+", label: "Active Listings" },
            { value: "3,500+", label: "Registered Users" },
            { value: "15+", label: "Cities Covered" },
            { value: "200+", label: "Daily Deals" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{s.value}</p>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <div className={`py-16 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">We make buying & selling{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">fast, safe, and easy</span>
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              From listing to deal — everything happens on Broker.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((s, i) => (
              <div key={s.step} className={`rounded-2xl border p-6 relative ${card}`}>
                <div className={`absolute top-4 right-4 text-xs font-black ${isDark ? "text-slate-700" : "text-slate-200"}`}>{s.step}</div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>{s.icon}</div>
                <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ SELLER / BUYER SPLIT ══ */}
      <div className={`py-16 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          {/* Sellers */}
          <div className={`rounded-2xl border p-8 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>🏪</div>
            <h3 className="text-xl font-extrabold mb-2">Sellers</h3>
            <p className={`text-sm mb-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Maximize your reach. Post your product and connect with thousands of buyers across Ethiopia.
            </p>
            <ul className={`space-y-2 text-sm mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {["Post in under 2 minutes","Pay only 3% of your product price","Reach buyers in 15+ cities","Manage listings from your profile"].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to={user?.role === "seller" ? "/post-product" : "/register"} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all">
              Start Selling →
            </Link>
          </div>
          {/* Buyers */}
          <div className={`rounded-2xl border p-8 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 ${isDark ? "bg-indigo-500/10" : "bg-indigo-50"}`}>🛒</div>
            <h3 className="text-xl font-extrabold mb-2">Buyers</h3>
            <p className={`text-sm mb-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Find your ideal product. Browse thousands of verified listings and contact sellers directly.
            </p>
            <ul className={`space-y-2 text-sm mb-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {["Browse thousands of listings","Filter by price, category & condition","Chat directly with sellers","AI-powered recommendations"].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="#listings" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all">
              Browse Listings →
            </Link>
          </div>
        </div>
      </div>

      {/* ══ TESTIMONIALS SLIDER ══ */}
      <div className={`py-16 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-3">
            What buyers and sellers say about{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Broker</span>
          </h2>
          <p className={`text-center text-sm mb-10 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Real stories from real users across Ethiopia</p>

          {/* Slider */}
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
              {testimonials.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-4">
                  <div className={`max-w-2xl mx-auto rounded-2xl border p-8 ${card}`}>
                    <div className="flex items-start gap-4 mb-5">
                      <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full object-cover shrink-0 border-2 border-blue-500/30" />
                      <div>
                        <p className="font-bold text-base">{t.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.role === "Seller" ? isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600" : isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>{t.role}</span>
                          <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>📍 {t.city}</span>
                        </div>
                      </div>
                      <div className={`ml-auto text-right shrink-0 ${isDark ? "bg-slate-800" : "bg-slate-100"} rounded-xl px-3 py-2`}>
                        <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.role === "Seller" ? "Sold" : "Bought"}</p>
                        <p className="font-bold text-sm">{t.product}</p>
                        <p className={`text-xs font-bold ${isDark ? "text-sky-400" : "text-sky-600"}`}>{t.amount}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(5)].map((_,i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>"{t.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots + arrows */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setActiveTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-600"}`}>
              ‹
            </button>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all duration-300 ${i === activeTestimonial ? "w-6 h-2 bg-blue-500" : "w-2 h-2 bg-slate-400/40"}`} />
            ))}
            <button onClick={() => setActiveTestimonial(p => (p + 1) % testimonials.length)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-200 hover:bg-slate-300 text-slate-600"}`}>
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ══ LISTINGS SECTION ══ */}
      <div id="listings" className={`py-12 ${isDark ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold">Latest Listings</h2>
              <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Fresh products added daily</p>
            </div>
          </div>

          {/* Filter bar */}
          <div className={`rounded-2xl border p-4 mb-6 ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <div className={`flex items-center gap-2 flex-1 rounded-xl border px-4 py-2.5 ${inputCls} ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <svg className="w-4 h-4 shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
                <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full" />
                {search && <button onClick={() => setSearch("")} className="text-xs opacity-40 hover:opacity-100">✕</button>}
              </div>
              <select value={category} onChange={e => setCategory(e.target.value)} className={`rounded-xl border px-3 py-2.5 text-sm ${inputCls} ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`rounded-xl border px-3 py-2.5 text-sm ${inputCls} ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <option value="latest">🕐 Latest</option>
                <option value="oldest">🕰 Oldest</option>
                <option value="price-asc">💰 Price: Low → High</option>
                <option value="price-desc">💎 Price: High → Low</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <select value={condition} onChange={e => setCondition(e.target.value)} className={`rounded-xl border px-3 py-2 text-xs ${inputCls} ${isDark ? "border-slate-700" : "border-slate-200"}`}>
                <option value="All">All Conditions</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </select>
              <input type="number" placeholder="Min ETB" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className={`rounded-xl border px-3 py-2 text-xs w-24 ${inputCls} ${isDark ? "border-slate-700" : "border-slate-200"}`} />
              <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>–</span>
              <input type="number" placeholder="Max ETB" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className={`rounded-xl border px-3 py-2 text-xs w-24 ${inputCls} ${isDark ? "border-slate-700" : "border-slate-200"}`} />
              {hasFilters && (
                <button onClick={clearFilters} className={`px-3 py-2 rounded-xl text-xs border transition ${isDark ? "border-slate-600 text-slate-400 hover:bg-slate-700" : "border-slate-300 text-slate-500 hover:bg-slate-100"}`}>
                  ✕ Clear
                </button>
              )}
              <span className={`ml-auto text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${category === c ? "bg-blue-600 text-white border-blue-600" : isDark ? "border-slate-700 text-slate-400 hover:border-slate-500" : "border-slate-200 text-slate-500 hover:border-slate-400"}`}>
                <span>{categoryIcons[c]}</span>{c}
              </button>
            ))}
          </div>

          {/* AI Picks */}
          {recommended.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span>🔮</span>
                <h3 className="font-bold text-base">AI Picks For You</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200"}`}>Recommended</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recommended.map(p => (
                  <Link key={p._id} to={`/product/${p._id}`} className={`group rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 ${isDark ? "bg-slate-900 border-blue-500/30 hover:border-blue-500/60" : "bg-white border-blue-200 hover:border-blue-400 shadow-sm"}`}>
                    <div className="relative overflow-hidden">
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className={`h-40 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}><span className="text-3xl opacity-30">📦</span></div>}
                      <span className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">AI Pick</span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1 mb-1">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</span>
                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{p.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? [...Array(8)].map((_,i) => <div key={i} className={`h-72 rounded-2xl animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />)
              : filtered.length
              ? filtered.map(p => (
                  <Link key={p._id} to={`/product/${p._id}`} className={`group rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 flex flex-col ${card}`}>
                    <div className="overflow-hidden relative">
                      {p.images?.[0]
                        ? <img src={p.images[0]} alt={p.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        : <div className={`h-44 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}><span className="text-4xl opacity-20">📦</span></div>
                      }
                      {p.condition && (
                        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.condition === "New" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>{p.condition}</span>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{p.name}</h3>
                      <p className={`text-xs mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{p.model || p.category || "—"}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className={`font-bold text-sm ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</span>
                      </div>
                      <p className={`text-xs mt-1 flex items-center gap-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {p.location}
                      </p>
                    </div>
                  </Link>
                ))
              : (
                <div className="col-span-full py-20 text-center">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>No products found</p>
                  {hasFilters && <button onClick={clearFilters} className="mt-3 text-blue-500 text-xs hover:underline">Clear filters</button>}
                </div>
              )
            }
          </div>
        </div>
      </div>

      {/* ══ CTA BANNER ══ */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to start?</h2>
          <p className="text-blue-100 text-sm mb-7">Join thousands of buyers and sellers on Broker today. It's free to sign up.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3.5 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all active:scale-95">
              Create Free Account →
            </Link>
            <Link to="#listings" className="px-8 py-3.5 rounded-xl border border-white/40 text-white font-bold text-sm hover:bg-white/10 transition-all">
              Browse Listings
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
