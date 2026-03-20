import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in.");
        navigate("/login");
        return;
      }
      try {
        const resUser = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);
        const resProducts = await API.get("/products/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(resProducts.data);
      } catch (err) {
        console.error("Error loading profile:", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
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
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Unauthorized.");
    setDeletingId(productId);
    const toastId = toast.loading("Deleting product...");
    try {
      await API.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Product deleted.", { id: toastId });
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product.", { id: toastId });
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-700"}`}>
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDark ? "bg-slate-950 text-slate-300" : "bg-slate-50 text-slate-700"}`}>
        <p>No user data found.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50" : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"}`}>
      <div className="w-full max-w-4xl">
        {/* Hero */}
        <div className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-8 mb-6 shadow-2xl ${isDark ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/70" : "bg-white/70 border-slate-200 shadow-slate-900/10"}`}>
          <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Account</p>
          <h1 className={`mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r ${isDark ? "from-blue-400 via-sky-400 to-indigo-400" : "from-sky-600 via-blue-600 to-indigo-600"} bg-clip-text text-transparent`}>
            Profile
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            View your information and manage your posted products.
          </p>
        </div>

        <div className={`shadow-2xl rounded-3xl p-6 sm:p-8 w-full border backdrop-blur-xl ${isDark ? "bg-slate-900/80 shadow-slate-950/80 border-slate-800/80" : "bg-white/80 shadow-slate-900/10 border-slate-200"}`}>
          {/* User Info */}
          <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6 ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-900/50">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
              <p className={`mb-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>{user.email}</p>
              <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                Joined on {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">
              Your Posted Products ({products?.length || 0})
            </h3>

            {products?.length === 0 ? (
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                You haven't posted any products yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className={`rounded-2xl shadow-md flex flex-col border transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden ${isDark ? "bg-slate-900/70 border-slate-800/80" : "bg-white/80 border-slate-200"}`}
                  >
                    {p.images?.length > 0 ? (
                      <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover" />
                    ) : (
                      <div className={`h-40 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                        <svg className={`w-8 h-8 ${isDark ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-semibold text-sm mb-0.5 line-clamp-1">{p.name}</h4>
                      <p className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{p.model || "—"}</p>
                      <p className={`font-bold mb-3 text-sm ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</p>

                      <Link
                        to={`/edit-product/${p._id}`}
                        className="w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-1.5 rounded-xl transition text-xs font-semibold mb-2"
                      >
                        Edit
                      </Link>

                      {confirmingId === p._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            className="flex-1 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition flex items-center justify-center gap-1"
                          >
                            {deletingId === p._id ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                            ) : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmingId(null)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmingId(p._id)}
                          className="w-full py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
