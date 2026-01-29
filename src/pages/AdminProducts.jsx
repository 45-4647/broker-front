import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminProducts({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching all products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);
  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("This resource is not authorized");
      navigate("/"); // redirect to home page
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/products/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully.");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  if (loading)
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-700"}`}>
        <p>Loading all products...</p>
      </div>
    );

  if (error)
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? "bg-slate-950 text-red-400" : "bg-slate-50 text-red-600"}`}>
        <p>{error}</p>
      </div>
    );

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50" : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"}`}>
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-8 mb-6 shadow-2xl ${isDark ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/70" : "bg-white/70 border-slate-200 shadow-slate-900/10"}`}>
          <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Admin</p>
          <h1 className={`mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r ${isDark ? "from-blue-400 via-sky-400 to-indigo-400" : "from-sky-600 via-blue-600 to-indigo-600"} bg-clip-text text-transparent`}>
            Admin Dashboard
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Manage and moderate products across the marketplace.
          </p>
        </div>

      {products.length === 0 ? (
        <p className={`text-center ${isDark ? "text-slate-500" : "text-slate-600"}`}>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className={`shadow-xl rounded-2xl p-4 flex flex-col border backdrop-blur-xl transform transition-all duration-300 hover:-translate-y-1 ${isDark ? "bg-slate-900/80 shadow-slate-950/70 border-slate-800/80 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]" : "bg-white/80 shadow-slate-900/10 border-slate-200 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"}`}
            >
              {p.images && p.images.length > 0 ? (
                <img
                  src={`https://broker-back.onrender.com${p.images[0]}`}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded-xl mb-3 border border-slate-700/70"
                />
              ) : (
                <div className="h-40 bg-slate-900/70 flex justify-center items-center rounded-xl mb-3 border border-slate-700/70">
                  <span className="text-slate-500 text-sm">No Image</span>
                </div>
              )}

              <h2 className="font-semibold text-sm sm:text-base">{p.name}</h2>
              <p className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {p.model || "—"}
              </p>
              <p className={`font-bold mb-1 text-sm ${isDark ? "text-sky-400" : "text-sky-600"}`}>${p.price}</p>
              <p className={`text-xs mb-2 ${isDark ? "text-slate-500" : "text-slate-600"}`}>
                Seller: {p.seller?.name || "Unknown"}
              </p>

              <button
                onClick={() => handleDelete(p._id)}
                className="mt-auto bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition text-xs font-semibold shadow-sm shadow-red-900/60"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
