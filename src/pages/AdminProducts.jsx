import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
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
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-200">
        <p>Loading all products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-red-400">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-50">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Admin Dashboard
      </h1>
      <p className="text-xs text-slate-400 text-center mb-6">
        Manage all products on the Broker marketplace.
      </p>

      {products.length === 0 ? (
        <p className="text-slate-500 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-slate-900/80 shadow-xl shadow-slate-950/70 rounded-2xl p-4 flex flex-col border border-slate-800/80 backdrop-blur-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
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
              <p className="text-slate-400 text-xs mb-1">
                {p.model || "—"}
              </p>
              <p className="text-sky-400 font-bold mb-1 text-sm">${p.price}</p>
              <p className="text-xs text-slate-500 mb-2">
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
  );
}
