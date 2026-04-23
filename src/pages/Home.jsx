import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const categories = ["All","Electronics","Vehicles","Real Estate","Fashion","Furniture","Services","Other"];

const categoryIcons = {
  All: "🏪", Electronics: "📱", Vehicles: "🚗", "Real Estate": "🏠",
  Fashion: "👗", Furniture: "🛋️", Services: "🔧", Other: "📦",
};

const stats = [
  { value: "1,200+", label: "Active Listings" },
  { value: "3,500+", label: "Registered Users" },
  { value: "15+", label: "Cities Covered" },
  { value: "200+", label: "Daily Deals" },
];

const features = [
  "🔒 Secure Payments", "💬 Real-time Chat", "🔮 AI Recommendations",
  "📍 Location Filtering", "⚡ Instant Listing", "🛡️ Verified Sellers",
  "📱 Mobile Friendly", "🌙 Dark Mode", "🔔 Instant Notifications",
];

export default function Home({ theme = "dark" }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data.allProducts);
        setFiltered(res.data.allProducts);
        setRecommended(res.data.recommended || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = products;
    if (category !== "All") list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    if (search.trim()) list = list.filter((p) => [p.name, p.model, p.location].join(" ").toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [search, category, products]);

  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";
  const card = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";
  const inputCls = isDark
    ? "bg-slate-900/80 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <div className={`relative overflow-hidden ${isDark ? "bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"}`}>
        {/* Background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-10">

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border ${isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Ethiopia's Smart Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            Buy & Sell{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Smarter
            </span>
            <br />
            <span className={isDark ? "text-slate-300" : "text-slate-600"}>No Middlemen. No Hassle.</span>
          </h1>

          <p className={`text-center text-base sm:text-lg max-w-2xl mx-auto mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Broker connects buyers and sellers directly across Ethiopia.
            Post a product, find a deal, chat in real-time — all in one place.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            {!user ? (
              <>
                <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 active:scale-95 text-center shadow-lg shadow-blue-600/20">
                  Start Buying Free →
                </Link>
                <Link to="/register" className={`w-full sm:w-auto px-8 py-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 active:scale-95 text-center ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-300 hover:bg-slate-50 text-slate-700"}`}>
                  Become a Seller
                </Link>
              </>
            ) : user.role === "seller" ? (
              <>
                <Link to="/post-product" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 active:scale-95 text-center shadow-lg shadow-blue-600/20">
                  + Post a Product
                </Link>
                <Link to="/profile" className={`w-full sm:w-auto px-8 py-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 active:scale-95 text-center ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-300 hover:bg-slate-50 text-slate-700"}`}>
                  My Listings
                </Link>
              </>
            ) : (
              <Link to="#listings" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 active:scale-95 text-center shadow-lg shadow-blue-600/20">
                Browse Listings ↓
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className={`rounded-2xl border px-4 py-3 text-center ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-200 shadow-sm"}`}>
                <p className="text-xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{s.value}</p>
                <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Buyer / Seller value props */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            <div className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-200 shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>🛒</div>
              <h3 className="font-bold text-sm mb-1">For Buyers</h3>
              <ul className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <li>✓ Browse thousands of verified listings</li>
                <li>✓ Filter by category, price & location</li>
                <li>✓ Chat directly with sellers</li>
                <li>✓ AI-powered recommendations</li>
              </ul>
            </div>
            <div className={`rounded-2xl border p-5 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-200 shadow-sm"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl ${isDark ? "bg-indigo-500/10" : "bg-indigo-50"}`}>🏪</div>
              <h3 className="font-bold text-sm mb-1">For Sellers</h3>
              <ul className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <li>✓ Post products in under 2 minutes</li>
                <li>✓ Pay only 3% of your product price</li>
                <li>✓ Reach buyers across Ethiopia</li>
                <li>✓ Manage listings from your profile</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className={`border-t border-b py-3 overflow-hidden ${isDark ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-white/60"}`}>
          <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {[...features, ...features].map((f, i) => (
              <span key={i} className={`text-xs font-medium shrink-0 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          LISTINGS SECTION
      ══════════════════════════════════════ */}
      <div id="listings" className="max-w-7xl mx-auto px-4 py-10">

        {/* Search bar */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-8 p-4 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
          <div className={`flex items-center gap-2 flex-1 rounded-xl border px-4 py-2.5 ${inputCls}`}>
            <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input type="text" placeholder="Search by name, model, location..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full" />
            {search && <button onClick={() => setSearch("")} className="text-xs opacity-50 hover:opacity-100">✕</button>}
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className={`rounded-xl border px-4 py-2.5 text-sm outline-none ${inputCls}`}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className={`rounded-xl border px-4 py-2.5 text-sm flex items-center justify-center min-w-[110px] font-medium ${isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`}>
            {filtered.length} results
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-7">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                category === c
                  ? "bg-blue-600 text-white border-blue-600"
                  : isDark ? "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200" : "border-slate-200 text-slate-500 hover:border-slate-400"
              }`}>
              <span>{categoryIcons[c]}</span>{c}
            </button>
          ))}
        </div>

        {/* AI Recommended */}
        {recommended.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">🔮</span>
              <h2 className="text-base font-bold">AI Picks For You</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200"}`}>Recommended</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recommended.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className={`group rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 ${isDark ? "bg-slate-900 border-blue-500/30 hover:border-blue-500/60" : "bg-white border-blue-200 hover:border-blue-400 shadow-sm"}`}>
                  <div className="relative overflow-hidden">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className={`h-40 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}><svg className="w-7 h-7 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    }
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

        {/* Section title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">
            {category === "All" ? "All Listings" : `${categoryIcons[category]} ${category}`}
            <span className={`ml-2 text-sm font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>({filtered.length})</span>
          </h2>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className={`h-72 rounded-2xl animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              ))
            : filtered.length
            ? filtered.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className={`group rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 flex flex-col ${card}`}>
                  <div className="overflow-hidden relative">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className={`h-44 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}><svg className="w-7 h-7 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    }
                    {p.condition && (
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.condition === "New" ? "bg-green-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
                        {p.condition}
                      </span>
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
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                  <svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                </div>
                <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>No products found</p>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>Try a different search or category</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
