import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TABS = ["Overview", "My Listings", "Settings"];

export default function Profile({ theme = "dark", toggleTheme }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Edit profile state
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [editLoading, setEditLoading] = useState(false);

  // Password state
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { toast.error("Please log in."); navigate("/login"); return; }
    const load = async () => {
      try {
        const [uRes, pRes] = await Promise.all([
          API.get("/auth/me", { headers }),
          API.get("/products/my", { headers }),
        ]);
        setUser(uRes.data);
        setEditForm({ name: uRes.data.name || "", phone: uRes.data.phone || "" });
        setProducts(pRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired."); localStorage.removeItem("token"); navigate("/login");
        }
      } finally { setLoading(false); }
    };
    load();
  }, [navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const tid = toast.loading("Saving...");
    try {
      const res = await API.put("/auth/me", editForm, { headers });
      setUser(res.data);
      // update localStorage
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: res.data.name }));
      toast.success("Profile updated.", { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update.", { id: tid });
    } finally { setEditLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords don't match."); return; }
    if (pwForm.newPassword.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    setPwLoading(true);
    const tid = toast.loading("Updating password...");
    try {
      await API.put("/auth/me/password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }, { headers });
      toast.success("Password updated.", { id: tid });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.", { id: tid });
    } finally { setPwLoading(false); }
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingId(productId);
    const tid = toast.loading("Deleting...");
    try {
      await API.delete(`/products/${productId}`, { headers });
      setProducts(p => p.filter(x => x._id !== productId));
      toast.success("Product deleted.", { id: tid });
    } catch {
      toast.error("Failed to delete.", { id: tid });
    } finally { setDeletingId(null); setConfirmingId(null); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    toast.success("Logged out."); navigate("/login");
  };

  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";
  const card = `rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`;
  const input = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400/40 focus:border-blue-400"}`;
  const label = `block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`;

  if (loading) return (
    <div className={`${bg} min-h-screen flex items-center justify-center`}>
      <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  );

  if (!user) return null;

  const initials = user.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";
  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" });

  return (
    <div className={`${bg} min-h-screen transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* ── LEFT: Profile card ── */}
          <div className="lg:col-span-1 space-y-4">
            <div className={`${card} p-6 text-center`}>
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold mx-auto shadow-lg">
                  {initials}
                </div>
                <div className={`absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 flex items-center justify-center ${isDark ? "bg-slate-800 border-slate-900" : "bg-white border-slate-100"}`}>
                  <span className="text-xs">✏️</span>
                </div>
              </div>
              <h2 className="font-extrabold text-lg">{user.name}</h2>
              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{user.email}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize border ${
                  user.role === "admin" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                  user.role === "seller" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  isDark ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>{user.role}</span>
              </div>
              <p className={`text-xs mt-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Member since {joinDate}</p>
            </div>

            {/* Stats */}
            <div className={`${card} p-5`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Stats</h3>
              <div className="space-y-3">
                {[
                  { label: "Total Listings", value: products.length, icon: "📦" },
                  { label: "Active Listings", value: products.filter(p => p.paymentStatus === "paid").length, icon: "✅" },
                  { label: "Account Type", value: user.role, icon: "🏷️" },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className={`text-xs flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      <span>{s.icon}</span>{s.label}
                    </span>
                    <span className="text-sm font-bold capitalize">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className={`${card} p-5`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Quick Actions</h3>
              <div className="space-y-1">
                {user.role === "seller" && (
                  <Link to="/post-product" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-600"}`}>
                    <span>📦</span> Post a Product
                  </Link>
                )}
                <Link to="/chat" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-600"}`}>
                  <span>💬</span> My Messages
                </Link>
                <Link to="/" className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-600"}`}>
                  <span>🏪</span> Browse Listings
                </Link>
                <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 transition ${isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}>
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Tabs ── */}
          <div className="lg:col-span-3">
            {/* Tab bar */}
            <div className={`flex gap-1 p-1 rounded-xl mb-6 w-fit ${isDark ? "bg-slate-900" : "bg-slate-200"}`}>
              {TABS.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t ? isDark ? "bg-slate-700 text-white shadow" : "bg-white text-slate-900 shadow" : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW ── */}
            {tab === "Overview" && (
              <div className="space-y-5">
                <div className={`${card} p-6`}>
                  <h3 className="font-bold text-base mb-4">Account Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: user.name },
                      { label: "Email", value: user.email },
                      { label: "Phone", value: user.phone || "Not set" },
                      { label: "Role", value: user.role },
                      { label: "Member Since", value: joinDate },
                      { label: "Total Products", value: products.length },
                    ].map(f => (
                      <div key={f.label} className={`rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{f.label}</p>
                        <p className="text-sm font-semibold capitalize">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent listings preview */}
                {products.length > 0 && (
                  <div className={`${card} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-base">Recent Listings</h3>
                      <button onClick={() => setTab("My Listings")} className="text-xs text-blue-500 hover:underline">View all →</button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {products.slice(0, 3).map(p => (
                        <Link key={p._id} to={`/product/${p._id}`} className={`rounded-xl border overflow-hidden hover:-translate-y-0.5 transition-all ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-28 w-full object-cover" /> : <div className={`h-28 flex items-center justify-center text-3xl ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>📦</div>}
                          <div className="p-2.5">
                            <p className="text-xs font-semibold line-clamp-1">{p.name}</p>
                            <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── MY LISTINGS ── */}
            {tab === "My Listings" && (
              <div className={`${card} p-6`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-base">My Products ({products.length})</h3>
                  {user.role === "seller" && (
                    <Link to="/post-product" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition">+ Post New</Link>
                  )}
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-4xl mb-3">📦</p>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>No products yet.</p>
                    {user.role === "seller" && <Link to="/post-product" className="mt-3 inline-block text-blue-500 text-sm hover:underline">Post your first product →</Link>}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map(p => (
                      <div key={p._id} className={`rounded-2xl border overflow-hidden flex flex-col ${isDark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-36 w-full object-cover" /> : <div className={`h-36 flex items-center justify-center text-4xl ${isDark ? "bg-slate-700" : "bg-slate-200"}`}>📦</div>}
                        <div className="p-3 flex flex-col flex-1">
                          <p className="font-semibold text-sm line-clamp-1 mb-0.5">{p.name}</p>
                          <p className={`text-xs mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{p.category} · {p.condition}</p>
                          <p className={`font-bold text-sm mb-3 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</p>
                          <div className="flex gap-2 mt-auto">
                            <Link to={`/edit-product/${p._id}`} className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-center bg-amber-500 hover:bg-amber-600 text-white transition">Edit</Link>
                            {confirmingId === p._id ? (
                              <div className="flex gap-1 flex-1">
                                <button onClick={() => handleDeleteProduct(p._id)} disabled={deletingId === p._id}
                                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition flex items-center justify-center">
                                  {deletingId === p._id ? <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : "✓"}
                                </button>
                                <button onClick={() => setConfirmingId(null)} className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${isDark ? "border-slate-600 hover:bg-slate-700" : "border-slate-300 hover:bg-slate-100"}`}>✕</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmingId(p._id)} className="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent transition">Delete</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SETTINGS ── */}
            {tab === "Settings" && (
              <div className="space-y-5">

                {/* Edit profile */}
                <div className={`${card} p-6`}>
                  <h3 className="font-bold text-base mb-5">Edit Profile</h3>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={label}>Full Name</label>
                        <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Your name" className={input} />
                      </div>
                      <div>
                        <label className={label}>Phone Number</label>
                        <input value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="+251 9XX XXX XXX" className={input} />
                      </div>
                    </div>
                    <div>
                      <label className={label}>Email</label>
                      <input value={user.email} disabled className={`${input} opacity-50 cursor-not-allowed`} />
                      <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Email cannot be changed.</p>
                    </div>
                    <button type="submit" disabled={editLoading}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition disabled:opacity-60 flex items-center gap-2">
                      {editLoading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                      Save Changes
                    </button>
                  </form>
                </div>

                {/* Change password */}
                <div className={`${card} p-6`}>
                  <h3 className="font-bold text-base mb-5">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                      { key: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                      { key: "newPassword", label: "New Password", placeholder: "Min. 6 characters" },
                      { key: "confirm", label: "Confirm New Password", placeholder: "Repeat new password" },
                    ].map(f => (
                      <div key={f.key}>
                        <label className={label}>{f.label}</label>
                        <div className="relative">
                          <input type={showPw[f.key] ? "text" : "password"} value={pwForm[f.key]}
                            onChange={e => setPwForm({...pwForm, [f.key]: e.target.value})}
                            placeholder={f.placeholder} className={`${input} pr-10`} />
                          <button type="button" onClick={() => setShowPw({...showPw, [f.key]: !showPw[f.key]})}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>
                            {showPw[f.key] ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="submit" disabled={pwLoading}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition disabled:opacity-60 flex items-center gap-2">
                      {pwLoading && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Appearance */}
                <div className={`${card} p-6`}>
                  <h3 className="font-bold text-base mb-5">Appearance</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">Theme</p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Switch between dark and light mode</p>
                    </div>
                    <button onClick={toggleTheme}
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isDark ? "bg-blue-600" : "bg-slate-300"}`}>
                      <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 flex items-center justify-center text-xs ${isDark ? "left-7" : "left-0.5"}`}>
                        {isDark ? "🌙" : "☀️"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className={`${card} p-6`}>
                  <h3 className="font-bold text-base mb-5">Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { label: "New message from buyer", desc: "Get notified when a buyer messages you", key: "msg" },
                      { label: "Product inquiry", desc: "When someone is interested in your listing", key: "inquiry" },
                      { label: "Platform updates", desc: "News and feature announcements", key: "updates" },
                    ].map(n => (
                      <div key={n.key} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{n.label}</p>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{n.desc}</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full bg-blue-600 relative cursor-pointer`}>
                          <span className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger zone */}
                <div className={`rounded-2xl border p-6 ${isDark ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-200"}`}>
                  <h3 className={`font-bold text-base mb-2 ${isDark ? "text-red-400" : "text-red-600"}`}>Danger Zone</h3>
                  <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Once you log out, you'll need your credentials to sign back in.
                  </p>
                  <button onClick={handleLogout}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition">
                    Logout from Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

