import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
    //   console.log(token)
      if (!token) {
        alert("You must be logged in");
        navigate("/login");
        return;
      }

      try {
        // Get user info
        const resUser = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        // Get user's products
        const resProducts = await API.get("/products/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(resProducts.data);
      } catch (err) {
        console.error("Error loading profile:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      await API.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-200">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-300">
        <p>No user data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex flex-col items-center text-slate-50">
      <div className="bg-slate-900/80 shadow-2xl shadow-slate-950/80 rounded-3xl p-6 sm:p-8 w-full max-w-4xl border border-slate-800/80 backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-800/80 pb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/50">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
            <p className="text-slate-300 mb-1 text-sm">{user.email}</p>
            <p className="text-xs text-slate-500">
              Joined on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* User Products */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            Your Posted Products ({products?.length || 0})
          </h3>

          {products?.length === 0 ? (
            <p className="text-slate-400 text-sm">
              You haven’t posted any products yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-slate-900/70 rounded-2xl shadow-md shadow-slate-950/70 p-4 hover:shadow-xl transition flex flex-col border border-slate-800/80"
                >
                  {p.images?.length > 0 ? (
                    <img
                      src={`https://broker-back.onrender.com${p.images[0]}`}
                      alt={p.name}
                      className="rounded-xl h-40 object-cover mb-3 border border-slate-700/70"
                    />
                  ) : (
                    <div className="h-40 bg-slate-900/80 flex items-center justify-center rounded-xl mb-3 border border-slate-700/70">
                      <p className="text-slate-500 text-sm">No Image</p>
                    </div>
                  )}
                  <h4 className="font-semibold text-sm sm:text-base">{p.name}</h4>
                  <p className="text-slate-400 text-xs mb-1">{p.model || "—"}</p>
                  <p className="text-sky-400 font-bold mb-2 text-sm">${p.price}</p>

                  <Link
                    to={`/edit-product/${p._id}`}
                    className="bg-amber-500 text-white px-3 py-1.5 rounded-full hover:bg-amber-600 transition text-xs font-semibold mb-2 text-center shadow-sm shadow-amber-900/60"
                  >
                    Edit
                  </Link>

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
    </div>
  );
}
