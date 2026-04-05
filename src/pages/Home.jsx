import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Home({ theme = "dark" }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  const categories = ["All","Electronics","Vehicles","Real Estate","Fashion","Furniture","Services","Other"];

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
    ? "bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-blue-500"
    : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-400";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ── HERO ── */}
        <div className={`relative overflow-hidden rounded-3xl border p-8 mb-10 ${isDark ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700" : "bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-sm"}`}>
          {/* glow accent */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
              Smart Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Find Your Next{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Deal
              </span>
            </h1>
            <p className={`text-base mb-8 max-w-xl ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Browse thousands of listings. Connect directly with sellers. No middlemen.
            </p>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`flex items-center gap-2 flex-1 rounded-xl border px-4 py-3 ${inputCls}`}>
                <svg className="w-4 h-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, model, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`rounded-xl border px-4 py-3 text-sm outline-none ${inputCls}`}
              >
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <div className={`rounded-xl border px-4 py-3 text-sm flex items-center justify-center min-w-[120px] ${isDark ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                {filtered.length} results
              </div>
            </div>
          </div>
        </div>

        {/* ── AI RECOMMENDED ── */}
        {recommended.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">🔮</span>
              <h2 className="text-lg font-bold">AI Picks For You</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
                Recommended
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {recommended.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className={`group rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 ${isDark ? "bg-slate-900 border-blue-500/30 hover:border-blue-500/60" : "bg-white border-blue-200 hover:border-blue-400 shadow-sm"}`}>
                  <div className="relative overflow-hidden">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className={`h-44 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}><svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    }
                    <span className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">AI Pick</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{p.name}</h3>
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

        {/* ── CATEGORY PILLS ── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                category === c
                  ? "bg-blue-600 text-white border-blue-600"
                  : isDark ? "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200" : "border-slate-200 text-slate-500 hover:border-slate-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* ── PRODUCT GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className={`h-72 rounded-2xl animate-pulse ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              ))
            : filtered.length
            ? filtered.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className={`group rounded-2xl border overflow-hidden hover:-translate-y-1 transition-all duration-200 flex flex-col ${card}`}>
                  <div className="overflow-hidden">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className={`h-44 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}><svg className="w-8 h-8 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                    }
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{p.name}</h3>
                    <p className={`text-xs mb-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{p.model || "—"}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`font-bold text-sm ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{p.condition}</span>
                    </div>
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>{p.location}</p>
                  </div>
                </Link>
              ))
            : (
              <div className="col-span-full py-20 text-center">
                <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>No products found for "{search || category}"</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
