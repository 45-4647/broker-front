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
        setProducts(res.data.allProducts);
        setFiltered(res.data.allProducts);
        setRecommended(res.data.recommended || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let list = products;

    if (category !== "All") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      list = list.filter((p) =>
        [p.name, p.model, p.location]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFiltered(list);
  }, [search, category, products]);

  return (
    <div
      className={`min-h-screen px-4 py-10 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* ===== HERO ===== */}
        <div className="mb-10 rounded-3xl border p-8 backdrop-blur-xl shadow-xl border-slate-800/70 bg-slate-900/60">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Smart Marketplace
          </h1>
          <p className="mt-3 text-slate-300">
            Discover listings faster with AI-powered recommendations.
          </p>

          {/* SEARCH */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name, model, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl px-4 py-3 bg-slate-950/40 border border-slate-700 focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl px-4 py-3 bg-slate-950/40 border border-slate-700"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div className="rounded-xl border border-slate-700 bg-slate-950/40 flex items-center justify-center">
              <span className="text-sm text-slate-400">
                Showing {filtered.length} results
              </span>
            </div>
          </div>
        </div>

        {/* ===== AI RECOMMENDED ===== */}
        {recommended.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4">
              🔮 AI Recommended For You
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommended.map((p) => (
                <div
                  key={p._id}
                  className="rounded-2xl border border-blue-500/40 bg-slate-900/70 p-4 shadow-xl"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-slate-800">
                        No Image
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-xs bg-blue-600 px-2 py-1 rounded-full">
                      AI Pick
                    </span>
                  </div>

                  <h3 className="mt-3 font-semibold">{p.name}</h3>
                  <p className="text-sky-400 font-bold">${p.price}</p>

                  <Link
                    to={`/product/${p._id}`}
                    className="mt-3 block text-center rounded-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRODUCT GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-slate-800 animate-pulse"
              />
            ))
          ) : filtered.length ? (
            filtered.map((p) => (
              <div
                key={p._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 hover:-translate-y-1 transition"
              >
                <div className="rounded-xl overflow-hidden">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="h-52 bg-slate-800 flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="mt-3 font-semibold">{p.name}</h3>
                <p className="text-sm text-slate-400">
                  {p.model || "No model"}
                </p>

                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sky-400 font-bold">${p.price}</span>
                  <span className="text-xs text-slate-500">
                    {p.location || "N/A"}
                  </span>
                </div>

                <Link
                  to={`/product/${p._id}`}
                  className="mt-4 block text-center rounded-full py-2 bg-gradient-to-r from-blue-500 to-indigo-500"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-400">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
