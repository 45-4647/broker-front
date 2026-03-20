import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ROLES = ["buyer", "seller", "admin"];
const ROLE_COLORS = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  seller: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  buyer: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function StatCard({ label, value, color, isDark }) {
  return (
    <div className={`rounded-2xl border px-5 py-4 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
    </div>
  );
}

export default function AdminProducts({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, uRes] = await Promise.all([
          API.get("/admin/products", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
          API.get("/admin/users", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
        ]);
        setProducts(pRes.data);
        setUsers(uRes.data);
      } catch {
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteProduct = async (id) => {
    setDeletingId(id);
    const tid = toast.loading("Deleting product...");
    try {
      await API.delete(`/admin/products/${id}`, { headers });
      setProducts((p) => p.filter((x) => x._id !== id));
      toast.success("Product deleted.", { id: tid });
    } catch {
      toast.error("Failed to delete product.", { id: tid });
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    setDeletingId(id);
    const tid = toast.loading("Deleting user...");
    try {
      await API.delete(`/admin/users/${id}`, { headers });
      setUsers((u) => u.filter((x) => x._id !== id));
      toast.success("User deleted.", { id: tid });
    } catch {
      toast.error("Failed to delete user.", { id: tid });
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRoleId(userId);
    const tid = toast.loading("Updating role...");
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole }, { headers });
      setUsers((u) => u.map((x) => (x._id === userId ? res.data : x)));
      toast.success(`Role updated to ${newRole}.`, { id: tid });
    } catch {
      toast.error("Failed to update role.", { id: tid });
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const card = `rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`;
  const base = `min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`;

  const filteredProducts = products.filter((p) =>
    [p.name, p.category, p.seller?.name, p.location].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.role].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className={`${base} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading admin data...</p>
      </div>
    </div>
  );

  return (
    <div className={`${base} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? "text-purple-400" : "text-purple-500"}`}>Admin Panel</p>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Logged in as <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>{user?.name}</span>
            </p>
          </div>
          <div className={`flex items-center rounded-xl border px-3 py-2 gap-2 w-full sm:w-72 ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
            <svg className={`w-4 h-4 shrink-0 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`bg-transparent text-sm outline-none w-full ${isDark ? "text-slate-100 placeholder-slate-500" : "text-slate-800 placeholder-slate-400"}`}
            />
            {search && <button onClick={() => setSearch("")} className={`text-xs ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>✕</button>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total Products" value={products.length} color="text-blue-500" isDark={isDark} />
          <StatCard label="Paid Listings" value={products.filter(p => p.paymentStatus === "paid").length} color="text-green-500" isDark={isDark} />
          <StatCard label="Total Users" value={users.length} color="text-purple-500" isDark={isDark} />
          <StatCard label="Sellers" value={users.filter(u => u.role === "seller").length} color="text-amber-500" isDark={isDark} />
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 p-1 rounded-xl mb-6 w-fit ${isDark ? "bg-slate-900" : "bg-slate-200"}`}>
          {["products", "users"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSearch(""); setConfirmingId(null); }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                tab === t
                  ? isDark ? "bg-slate-700 text-white shadow" : "bg-white text-slate-900 shadow"
                  : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t} {t === "products" ? `(${products.length})` : `(${users.length})`}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          filteredProducts.length === 0 ? (
            <div className={`${card} p-12 text-center`}>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {search ? `No products match "${search}"` : "No products found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((p) => (
                <div key={p._id} className={`${card} flex flex-col overflow-hidden hover:-translate-y-0.5 transition-transform duration-200`}>
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
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="font-semibold text-sm line-clamp-1">{p.name}</h2>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${p.paymentStatus === "paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {p.paymentStatus || "pending"}
                      </span>
                    </div>
                    <p className={`text-xs mb-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{p.category || "—"} · {p.condition}</p>
                    <p className={`text-sm font-bold mb-1 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</p>
                    <p className={`text-xs mb-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Seller: <span className={isDark ? "text-slate-300" : "text-slate-600"}>{p.seller?.name || "Unknown"}</span>
                    </p>
                    {confirmingId === p._id ? (
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          disabled={deletingId === p._id}
                          className="flex-1 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition flex items-center justify-center"
                        >
                          {deletingId === p._id
                            ? <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                            : "Confirm"}
                        </button>
                        <button onClick={() => setConfirmingId(null)} className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmingId(p._id)} className="mt-auto w-full py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          filteredUsers.length === 0 ? (
            <div className={`${card} p-12 text-center`}>
              <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {search ? `No users match "${search}"` : "No users found."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredUsers.map((u) => (
                <div key={u._id} className={`${card} flex flex-col sm:flex-row sm:items-center gap-4 p-4`}>
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm">{u.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                      {u._id === user?.id && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">You</span>}
                    </div>
                    <p className={`text-xs truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>{u.email}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Role selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={u.role}
                      disabled={updatingRoleId === u._id || u._id === user?.id}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-xl border outline-none transition ${
                        isDark
                          ? "bg-slate-800 border-slate-700 text-slate-200 disabled:opacity-40"
                          : "bg-slate-50 border-slate-200 text-slate-700 disabled:opacity-40"
                      }`}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>

                    {updatingRoleId === u._id && (
                      <svg className="w-4 h-4 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    )}
                  </div>

                  {/* Delete user */}
                  {u._id !== user?.id && (
                    confirmingId === u._id ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={deletingId === u._id}
                          className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition flex items-center gap-1"
                        >
                          {deletingId === u._id
                            ? <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                            : "Confirm"}
                        </button>
                        <button onClick={() => setConfirmingId(null)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}>Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmingId(u._id)}
                        className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition"
                      >
                        Delete
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
}
