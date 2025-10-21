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
      <div className="flex justify-center items-center h-screen">
        <p>Loading all products...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Admin Dashboard - Manage Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-600 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-xl p-4 flex flex-col"
            >
              {p.images && p.images.length > 0 ? (
                <img
                  src={`https://broker-back.onrender.com${p.images[0]}`}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded-lg mb-2"
                />
              ) : (
                <div className="h-40 bg-gray-200 flex justify-center items-center rounded-lg mb-2">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-gray-600 text-sm mb-1">{p.model || "—"}</p>
              <p className="text-blue-600 font-bold mb-2">${p.price}</p>
              <p className="text-sm text-gray-500 mb-2">
                Seller: {p.seller?.name || "Unknown"}
              </p>

              <button
                onClick={() => handleDelete(p._id)}
                className="mt-auto bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
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
