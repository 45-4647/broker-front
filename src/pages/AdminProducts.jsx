import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const ROLES = ["buyer", "seller", "admin"];
const ROLE_COLORS = {
  admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  seller: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  buyer: "bg-slate-700/30 text-slate-400 border-slate-600/30",
};
const PIE_COLORS = ["#64748b", "#3b82f6", "#8b5cf6"];
const CATEGORIES = ["Electronics","Vehicles","Real Estate","Fashion","Furniture","Services","Other"];
const CAT_COLORS = ["#3b82f6","#10b981","#f59e0b","#ec4899","#8b5cf6","#06b6d4","#64748b"];

const NAV = [
  { id: "overview",  label: "Overview"  },
  { id: "products",  label: "Products"  },
  { id: "users",     label: "Users"     },
  { id: "sellers",   label: "Sellers"   },
  { id: "reports",   label: "Reports"   },
];

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: accent }} />
      <div className="relative">
        <p className="text-3xl font-extrabold text-white">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
  );
}
export default function AdminProducts({ theme = "dark" }) {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("user"));
  const [activeNav, setActiveNav] = useState("overview");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  const authH = () => ({ Authorization: "Bearer " + localStorage.getItem("token") });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, uRes] = await Promise.all([
        API.get("/admin/products", { headers: authH() }),
        API.get("/admin/users", { headers: authH() }),
      ]);
      setProducts(pRes.data);
      setUsers(uRes.data);
    } catch { toast.error("Failed to load admin data."); }
    finally { setLoading(false); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!adminUser || adminUser.role !== "admin") { navigate("/"); return; }
    fetchAll();
  }, [navigate, fetchAll]); // eslint-disable-line react-hooks/exhaustive-deps

  const delItem = async (url, setter, id) => {
    setDeletingId(id);
    const tid = toast.loading("Deleting...");
    try {
      await API.delete(url, { headers: authH() });
      setter(prev => prev.filter(x => x._id !== id));
      toast.success("Deleted.", { id: tid });
    } catch { toast.error("Failed.", { id: tid }); }
    finally { setDeletingId(null); setConfirmingId(null); }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRoleId(userId);
    const tid = toast.loading("Updating...");
    try {
      const res = await API.put("/admin/users/" + userId + "/role", { role: newRole }, { headers: authH() });
      setUsers(u => u.map(x => x._id === userId ? res.data : x));
      toast.success("Role updated to " + newRole, { id: tid });
    } catch { toast.error("Failed.", { id: tid }); }
    finally { setUpdatingRoleId(null); }
  };

  const sellers = users.filter(u => u.role === "seller");
  const buyers = users.filter(u => u.role === "buyer");
  const admins = users.filter(u => u.role === "admin");
  const paidProducts = products.filter(p => p.paymentStatus === "paid");
  const revenue = Math.round(paidProducts.reduce((s, p) => s + (parseFloat(p.price) * 0.03), 0));

  const fp = products.filter(p => [p.name, p.category, p.seller?.name].join(" ").toLowerCase().includes(search.toLowerCase()));
  const fu = users.filter(u => [u.name, u.email, u.role].join(" ").toLowerCase().includes(search.toLowerCase()));
  const fs = sellers.filter(s => [s.name, s.email].join(" ").toLowerCase().includes(search.toLowerCase()));

  const roleData = [
    { name: "Buyers", value: buyers.length },
    { name: "Sellers", value: sellers.length },
    { name: "Admins", value: admins.length },
  ];

  const catData = CATEGORIES.map(cat => ({
    name: cat.length > 8 ? cat.slice(0, 8) + "." : cat,
    count: products.filter(p => p.category === cat).length,
  }));

  const card = "rounded-2xl border border-slate-800 bg-slate-900";

  const ConfirmBtns = ({ onConfirm, id }) => (
    <div className="flex gap-1.5">
      <button onClick={onConfirm} disabled={deletingId === id}
        className="flex-1 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition flex items-center justify-center">
        {deletingId === id ? <Spinner /> : "Confirm"}
      </button>
      <button onClick={() => setConfirmingId(null)}
        className="flex-1 py-1.5 rounded-xl text-xs font-semibold border border-slate-700 hover:bg-slate-800 transition">
        Cancel
      </button>
    </div>
  );

  if (loading) return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center">
      <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex">

      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 border-r border-slate-800 bg-slate-900 flex-col hidden lg:flex">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-black text-sm">B</div>
            <div>
              <p className="font-extrabold text-sm text-white">Broker Admin</p>
              <p className="text-xs text-slate-400">Control Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(n => (
            <button key={n.id} onClick={() => { setActiveNav(n.id); setSearch(""); setConfirmingId(null); }}
              className={"w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all " + (activeNav === n.id ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
              <span>{n.label}</span>
              {n.id === "products" && <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded-full">{products.length}</span>}
              {n.id === "users" && <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded-full">{users.length}</span>}
              {n.id === "sellers" && <span className="text-xs bg-slate-700 px-1.5 py-0.5 rounded-full">{sellers.length}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
              {adminUser?.profileImage ? <img src={adminUser.profileImage} alt="" className="w-8 h-8 object-cover" /> : adminUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{adminUser?.name}</p>
              <p className="text-[10px] text-purple-400 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="font-extrabold text-lg text-white capitalize">{activeNav === "overview" ? "Dashboard" : activeNav}</h1>
            <p className="text-xs text-slate-400">Broker Marketplace Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 w-52">
              <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-xs outline-none w-full text-slate-200 placeholder-slate-500" />
            </div>
            <Link to="/" className="text-xs text-slate-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-slate-800">Back to Site</Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW */}
          {activeNav === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Products" value={products.length} sub="All time" accent="#3b82f6" />
                <StatCard label="Paid Listings" value={paidProducts.length} sub="Active" accent="#10b981" />
                <StatCard label="Total Users" value={users.length} sub="Registered" accent="#8b5cf6" />
                <StatCard label="Est. Revenue" value={revenue.toLocaleString() + " ETB"} sub="3% fees collected" accent="#f59e0b" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Sellers" value={sellers.length} sub="Active sellers" accent="#3b82f6" />
                <StatCard label="Buyers" value={buyers.length} sub="Registered buyers" accent="#06b6d4" />
                <StatCard label="Pending" value={products.filter(p => p.paymentStatus !== "paid").length} sub="Unpaid listings" accent="#f59e0b" />
                <StatCard label="Admins" value={admins.length} sub="Admin accounts" accent="#8b5cf6" />
              </div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pie chart - user roles */}
                <div className={card + " p-6"}>
                  <h3 className="font-bold text-base text-white mb-4">User Role Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={roleData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"} labelLine={false}>
                        {roleData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {roleData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                        <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar chart - categories */}
                <div className={card + " p-6"}>
                  <h3 className="font-bold text-base text-white mb-4">Products by Category</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={catData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {catData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent listings */}
              <div className={card + " p-6"}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-white">Recent Listings</h3>
                  <button onClick={() => setActiveNav("products")} className="text-xs text-blue-400 hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {products.slice(0, 5).map(p => (
                    <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800">
                      {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" /> : <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-500 shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.seller?.name} · {p.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-sky-400">{p.price?.toLocaleString()} ETB</p>
                        <span className={"text-[10px] px-1.5 py-0.5 rounded-full font-medium " + (p.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400")}>{p.paymentStatus || "pending"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* PRODUCTS */}
          {activeNav === "products" && (
            <div>
              <p className="text-sm text-slate-400 mb-5">{fp.length} product{fp.length !== 1 ? "s" : ""} found</p>
              {fp.length === 0 ? (
                <div className={card + " p-12 text-center text-slate-500 text-sm"}>No products found.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {fp.map(p => (
                    <div key={p._id} className={card + " flex flex-col overflow-hidden hover:-translate-y-0.5 transition-transform"}>
                      {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-40 w-full object-cover" /> : <div className="h-40 bg-slate-800 flex items-center justify-center text-slate-600"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h2 className="font-semibold text-sm text-white line-clamp-1">{p.name}</h2>
                          <span className={"shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium border " + (p.paymentStatus === "paid" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20")}>{p.paymentStatus || "pending"}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{p.category} · {p.condition}</p>
                        <p className="text-sm font-bold text-sky-400 mb-1">{p.price?.toLocaleString()} ETB</p>
                        <p className="text-xs text-slate-500 mb-3">Seller: <span className="text-slate-300">{p.seller?.name || "Unknown"}</span></p>
                        <div className="mt-auto">
                          {confirmingId === p._id
                            ? <ConfirmBtns onConfirm={() => delItem("/admin/products/" + p._id, setProducts, p._id)} id={p._id} />
                            : <button onClick={() => setConfirmingId(p._id)} className="w-full py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition">Delete</button>
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS */}
          {activeNav === "users" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-400 mb-4">{fu.length} user{fu.length !== 1 ? "s" : ""} found</p>
              {fu.map(u => (
                <div key={u._id} className={card + " flex flex-col sm:flex-row sm:items-center gap-4 p-4"}>
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                    {u.profileImage ? <img src={u.profileImage} alt="" className="w-11 h-11 object-cover" /> : u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-white">{u.name}</p>
                      <span className={"text-xs px-2 py-0.5 rounded-full border font-medium " + (ROLE_COLORS[u.role] || "")}>{u.role}</span>
                      {u._id === adminUser?.id && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">You</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select value={u.role} disabled={updatingRoleId === u._id || u._id === adminUser?.id} onChange={e => handleRoleChange(u._id, e.target.value)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 outline-none disabled:opacity-40">
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {updatingRoleId === u._id && <svg className="w-4 h-4 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                  </div>
                  {u._id !== adminUser?.id && (
                    confirmingId === u._id
                      ? <ConfirmBtns onConfirm={() => delItem("/admin/users/" + u._id, setUsers, u._id)} id={u._id} />
                      : <button onClick={() => setConfirmingId(u._id)} className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition">Delete</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* SELLERS */}
          {activeNav === "sellers" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-400 mb-4">{fs.length} seller{fs.length !== 1 ? "s" : ""}</p>
              {fs.map(s => {
                const sp = products.filter(p => p.seller?._id === s._id || p.seller === s._id);
                const sr = Math.round(sp.filter(p => p.paymentStatus === "paid").reduce((sum, p) => sum + parseFloat(p.price) * 0.03, 0));
                return (
                  <div key={s._id} className={card + " p-5"}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">
                        {s.profileImage ? <img src={s.profileImage} alt="" className="w-12 h-12 object-cover" /> : s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-sm text-white">{s.name}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Seller</span>
                        </div>
                        <p className="text-xs text-slate-400">{s.email}</p>
                        {s.phone && <p className="text-xs text-slate-500">{s.phone}</p>}
                        <p className="text-xs text-slate-500 mt-0.5">Joined {new Date(s.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 shrink-0">
                        <div className="text-center bg-slate-800 rounded-xl px-3 py-2">
                          <p className="text-lg font-extrabold text-white">{sp.length}</p>
                          <p className="text-[10px] text-slate-400">Listings</p>
                        </div>
                        <div className="text-center bg-slate-800 rounded-xl px-3 py-2">
                          <p className="text-sm font-extrabold text-amber-400">{sr.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">ETB fees</p>
                        </div>
                      </div>
                    </div>
                    {sp.length > 0 && (
                      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                        {sp.slice(0, 4).map(p => (
                          <Link key={p._id} to={"/product/" + p._id} className="shrink-0 w-20 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition">
                            {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-20 h-16 object-cover" /> : <div className="w-20 h-16 bg-slate-700 flex items-center justify-center text-slate-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>}
                            <p className="text-[9px] text-slate-400 px-1.5 py-1 truncate">{p.name}</p>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleRoleChange(s._id, "buyer")} className="px-3 py-1.5 rounded-xl text-xs border border-slate-700 hover:bg-slate-800 text-slate-400 transition">Demote to Buyer</button>
                      {confirmingId === s._id
                        ? <ConfirmBtns onConfirm={() => delItem("/admin/users/" + s._id, setUsers, s._id)} id={s._id} />
                        : <button onClick={() => setConfirmingId(s._id)} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition">Remove Seller</button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* REPORTS */}
          {activeNav === "reports" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className={card + " p-6"}>
                  <h3 className="font-bold text-base text-white mb-4">Platform Summary</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Total Products", value: products.length },
                      { label: "Paid / Active", value: paidProducts.length + " / " + products.length },
                      { label: "Total Users", value: users.length },
                      { label: "Sellers", value: sellers.length },
                      { label: "Buyers", value: buyers.length },
                      { label: "Admins", value: admins.length },
                      { label: "Est. Revenue (ETB)", value: revenue.toLocaleString() },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                        <span className="text-xs text-slate-400">{r.label}</span>
                        <span className="text-sm font-bold text-white">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={card + " p-6"}>
                  <h3 className="font-bold text-base text-white mb-4">Revenue by Category</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={catData.filter(c => c.count > 0)} cx="50%" cy="50%" outerRadius={90} dataKey="count" label={({ name, percent }) => percent > 0.05 ? name : ""} labelLine={false}>
                        {catData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className={card + " p-6"}>
                <h3 className="font-bold text-base text-white mb-4">Admin Responsibilities</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { title: "User Management", desc: "Add, remove, or change roles. Promote buyers to sellers or demote sellers." },
                    { title: "Product Moderation", desc: "Review and remove inappropriate or fraudulent listings." },
                    { title: "Revenue Tracking", desc: "Monitor promotion fees collected from sellers (3% per listing)." },
                    { title: "Seller Oversight", desc: "View all seller profiles, their listings, and revenue contribution." },
                    { title: "Platform Security", desc: "Manage admin accounts and ensure only trusted users have elevated access." },
                    { title: "Analytics", desc: "Track platform growth, category trends, and user registration patterns." },
                  ].map(r => (
                    <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-sm text-white mb-0.5">{r.title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}