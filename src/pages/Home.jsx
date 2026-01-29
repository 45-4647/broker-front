import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";



export default function Home({ theme = "dark" }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  const categories = [
    "All",
    "Electronics",
    "Vehicles",
    "Real Estate",
    "Fashion",
    "Furniture",
    "Services",
    "Other",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filteredList = products;

    // Filter by category
    if (category !== "All") {
      filteredList = filteredList.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name, model, or location
    if (search.trim() !== "") {
      filteredList = filteredList.filter((p) =>
        [p.name, p.model, p.location]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFiltered(filteredList);
  }, [category, search, products]);

  return (
    <div
      className={`min-h-screen py-10 px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto animate-[fadeIn_0.6s_ease-out]">
        {/* Hero */}
        <div
          className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-10 mb-8 shadow-2xl transform transition-all duration-500 hover:-translate-y-1 ${
            isDark
              ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/70 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
              : "bg-white/70 border-slate-200 shadow-slate-900/10 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"
          }`}
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <p
                className={`text-xs uppercase tracking-[0.35em] mb-3 ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Broker Marketplace
              </p>
              <h1
                className={`text-3xl sm:text-4xl font-bold leading-tight bg-gradient-to-r ${
                  isDark
                    ? "from-blue-400 via-sky-400 to-indigo-400"
                    : "from-sky-600 via-blue-600 to-indigo-600"
                } bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]`}
              >
                Discover products. Connect instantly. Negotiate faster.
              </h1>
              <p
                className={`mt-4 text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                A clean, real-time marketplace experience. Filter by category, search by
                model or location, and reach sellers through chat when you find the right
                listing.
              </p>

              {/* Search */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label
                    className={`text-[11px] uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, model or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition shadow-inner ${
                      isDark
                        ? "border-slate-700/70 bg-slate-950/40 text-slate-100 placeholder:text-slate-500 shadow-slate-950"
                        : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-slate-200"
                    }`}
                  />
                </div>

                <div className="sm:w-56">
                  <label
                    className={`text-[11px] uppercase tracking-wide ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`mt-2 w-full rounded-2xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition ${
                      isDark
                        ? "border-slate-700/70 bg-slate-950/40 text-slate-100"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark ? "border-slate-800/80 bg-slate-950/30" : "border-slate-200 bg-white/70"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Listings
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                    {products.length}
                  </p>
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark ? "border-slate-800/80 bg-slate-950/30" : "border-slate-200 bg-white/70"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Categories
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                    {categories.length - 1}
                  </p>
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3 ${
                    isDark ? "border-slate-800/80 bg-slate-950/30" : "border-slate-200 bg-white/70"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Showing
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                    {filtered.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Cinematic highlight panel */}
            <div className="lg:col-span-5">
              <div
                className={`relative overflow-hidden rounded-3xl border p-6 ${
                  isDark ? "border-slate-800/80 bg-slate-950/30" : "border-slate-200 bg-white/70"
                }`}
              >
                <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/40 via-sky-500/30 to-indigo-500/40 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-500/30 via-sky-500/20 to-blue-500/30 blur-3xl" />
                <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Tips
                </p>
                <h2 className={`mt-2 text-lg font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                  Make your listing stand out
                </h2>
                <ul className={`mt-4 space-y-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                  <li>Use clear photos with good lighting.</li>
                  <li>Add model, condition, and exact location.</li>
                  <li>Respond quickly via chat to close faster.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Category pills (quick filter) */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 backdrop-blur-md ${
                category === cat
                  ? "bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 text-white border-transparent shadow-lg shadow-blue-900/50"
                  : isDark
                  ? "bg-slate-900/60 text-slate-300 border-slate-700/70 hover:border-blue-500/60 hover:text-slate-50"
                  : "bg-white/70 text-slate-700 border-slate-200 hover:border-sky-400 hover:text-sky-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 border animate-pulse ${
                  isDark
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-white/70 border-slate-200"
                }`}
              >
                <div className={`h-56 w-full rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
                <div className={`mt-4 h-4 w-3/4 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
                <div className={`mt-2 h-3 w-1/2 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
                <div className={`mt-3 h-4 w-1/3 rounded ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
                <div className={`mt-4 h-9 w-full rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              </div>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((p) => (
              <div
                key={p._id}
                className={`rounded-2xl p-4 flex flex-col backdrop-blur-xl transform transition-all duration-300 hover:-translate-y-1 border ${
                  isDark
                    ? "bg-slate-900/70 border-slate-800/80 shadow-xl shadow-slate-950/60 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
                    : "bg-white/80 border-slate-200 shadow-xl shadow-slate-900/10 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"
                }`}
              >
                <div className="relative overflow-hidden rounded-xl">
                  {p.images && p.images.length > 0 ? (
                    <img
                      src={`https://broker-back.onrender.com${p.images[0]}`}
                      alt={p.name}
                      className="object-cover w-full h-56 transition-transform duration-500 hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      className={`w-full h-56 flex justify-center items-center border ${
                        isDark
                          ? "bg-slate-800/80 border-slate-700/70"
                          : "bg-slate-100 border-slate-200"
                      }`}
                    >
                      <p className={`${isDark ? "text-slate-500" : "text-slate-400"} text-sm`}>
                        No Image
                      </p>
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-1 rounded-full border ${
                      isDark
                        ? "bg-slate-950/50 border-slate-700/70 text-slate-200"
                        : "bg-white/80 border-slate-200 text-slate-700"
                    }`}
                  >
                    {p.category || "Other"}
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <h2 className={`text-base font-semibold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                    {p.name}
                  </h2>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {p.model || "Model not specified"}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className={`text-sm font-bold ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                      ${p.price}
                    </p>
                    <p className={`text-[11px] truncate ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      {p.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/product/${p._id}`}
                  className="mt-4 inline-flex items-center justify-center bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:brightness-110 text-white text-sm font-medium text-center rounded-full py-2 px-4 shadow-lg shadow-blue-900/25 transition"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div
                className={`rounded-3xl border p-10 text-center ${
                  isDark ? "border-slate-800/80 bg-slate-900/50" : "border-slate-200 bg-white/70"
                }`}
              >
                <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  No products found
                </p>
                <p className={`mt-2 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                  Try changing the category or searching with a different keyword.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
