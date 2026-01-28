import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";



export default function Home({ theme = "dark" }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-2">
              Marketplace
            </p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
              Browse Products
            </h1>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name, model or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 rounded-2xl px-4 py-2.5 w-full sm:w-1/2 shadow-inner shadow-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 backdrop-blur-md ${
                category === cat
                  ? "bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 text-white border-transparent shadow-lg shadow-blue-900/50"
                  : "bg-slate-900/60 text-slate-300 border-slate-700/70 hover:border-blue-500/60 hover:text-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <div
                key={p._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col shadow-xl shadow-slate-950/60 backdrop-blur-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
              >
                {p.images && p.images.length > 0 ? (
                  <img
                    src={`https://broker-back.onrender.com${p.images[0]}`}
                    alt={p.name}
                    className="rounded-xl object-cover w-full h-56 mb-4"
                  />
                ) : (
                  <div className="w-full h-56 bg-slate-800/80 flex justify-center items-center rounded-xl mb-4 border border-slate-700/70">
                    <p className="text-slate-500 text-sm">No Image</p>
                  </div>
                )}

                <h2 className="text-lg font-semibold text-slate-50">{p.name}</h2>
                <p className="text-slate-400 text-sm">{p.model}</p>
                <p className="font-bold text-sky-400 mt-1">${p.price}</p>
                <p className="text-slate-500 text-xs mt-1">{p.location}</p>

                <Link
                  to={`/product/${p._id}`}
                  className="mt-4 inline-flex items-center justify-center bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:brightness-110 text-white text-sm font-medium text-center rounded-full py-2 px-4 shadow-lg shadow-blue-900/40 transition"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 w-full col-span-full">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
