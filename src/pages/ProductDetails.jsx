import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function ProductDetails({ theme = "dark" }) {
  const isDark = theme === "dark";
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setSellerProducts([]);
    setRelatedProducts([]);

    API.get(`/products/detail/${id}`)
      .then((res) => {
        const p = res.data;
        setProduct(p);
        // fetch seller's other products + related in parallel
        Promise.all([
          p.seller?._id
            ? API.get(`/products/seller/${p.seller._id}?exclude=${id}`).then(r => r.data).catch(() => [])
            : [],
          p.category
            ? API.get(`/products/related/${p.category}?exclude=${id}`).then(r => r.data).catch(() => [])
            : [],
        ]).then(([sp, rp]) => {
          setSellerProducts(sp);
          setRelatedProducts(rp);
        });
      })
      .catch(() => toast.error("Failed to load product."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChat = async () => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    const currentUser = user || JSON.parse(localStorage.getItem("user"));
    if (!currentUser) { navigate("/login"); return; }
    if (!product.seller?._id) { toast.error("This seller is no longer available."); return; }

    setChatLoading(true);
    try {
      const res = await API.post("/chatroom", {
        user1: currentUser.id,
        user2: product.seller._id,
        productId: product._id,
      });
      if (!res.data?._id) { toast.error("Could not open chat. Please try again."); return; }
      navigate(`/chat/${res.data._id}`);
    } catch {
      toast.error("Could not open chat. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";
  const card = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";

  if (loading) return (
    <div className={`${bg} min-h-screen flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Loading product...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className={`${bg} min-h-screen flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-semibold">Product not found</p>
        <Link to="/" className="mt-4 inline-block text-blue-500 text-sm hover:underline">← Back to listings</Link>
      </div>
    </div>
  );

  const MiniCard = ({ p }) => (
    <Link to={`/product/${p._id}`} className={`group rounded-xl border overflow-hidden hover:-translate-y-0.5 transition-all duration-200 flex flex-col ${card}`}>
      {p.images?.[0]
        ? <img src={p.images[0]} alt={p.name} className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        : <div className={`h-32 flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
            <svg className="w-6 h-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
      }
      <div className="p-2.5">
        <p className="text-xs font-semibold line-clamp-1">{p.name}</p>
        <p className={`text-xs font-bold mt-0.5 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{p.price?.toLocaleString()} ETB</p>
      </div>
    </Link>
  );

  return (
    <div className={`${bg} min-h-screen transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-xs mb-6 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          <Link to="/" className="hover:text-blue-500 transition">Home</Link>
          <span>/</span>
          {product.category && <><span className="hover:text-blue-500 cursor-pointer" onClick={() => navigate(`/?category=${product.category}`)}>{product.category}</span><span>/</span></>}
          <span className={isDark ? "text-slate-300" : "text-slate-700"}>{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT: Image + details ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Wide image */}
            <div className={`rounded-2xl border overflow-hidden ${card}`}>
              {product.images?.length > 0 ? (
                <img src={product.images[0]} alt={product.name}
                  className="w-full h-80 sm:h-[480px] object-cover" />
              ) : (
                <div className={`w-full h-80 sm:h-[480px] flex flex-col items-center justify-center gap-4 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                  <svg className={`w-24 h-24 ${isDark ? "text-slate-600" : "text-slate-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className={`text-sm ${isDark ? "text-slate-500" : "text-slate-400"}`}>No image available</p>
                </div>
              )}
            </div>

            {/* Product info card */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.condition && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.condition === "New" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>
                        {product.condition}
                      </span>
                    )}
                    {product.category && (
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${isDark ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-3xl font-extrabold ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                    {product.price?.toLocaleString()} ETB
                  </p>
                </div>
              </div>

              {/* Specs grid */}
              <div className={`grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                {[
                  { label: "Model", value: product.model || "N/A" },
                  { label: "Condition", value: product.condition },
                  { label: "Category", value: product.category || "N/A" },
                  { label: "Location", value: product.location },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</p>
                    <p className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Description</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>{product.description}</p>
                </div>
              )}
            </div>

            {/* How it works illustration */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h3 className="font-bold text-sm mb-5">How to buy on Broker</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { step: "1", icon: "🔍", title: "Browse", desc: "Find the product you want" },
                  { step: "2", icon: "💬", title: "Contact", desc: "Chat or call the seller" },
                  { step: "3", icon: "🤝", title: "Deal", desc: "Meet & close the deal" },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>{s.icon}</div>
                    <p className="text-xs font-bold mb-0.5">{s.title}</p>
                    <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Seller card + actions ── */}
          <div className="space-y-5">

            {/* Price + CTA */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <p className={`text-3xl font-extrabold mb-1 ${isDark ? "text-sky-400" : "text-sky-600"}`}>
                {product.price?.toLocaleString()} ETB
              </p>
              <p className={`text-xs mb-5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                Posted {new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </p>

              <div className="space-y-2.5">
                <button onClick={handleChat} disabled={chatLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60">
                  {chatLoading
                    ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  }
                  Chat with Seller
                </button>

                <a href={`tel:${product.seller?.phone}`}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Call Seller
                </a>

                <a href={`mailto:${product.seller?.email}?subject=Interested in ${product.name}`}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Send Email
                </a>

                <a href={`sms:${product.seller?.phone}?body=Hi, I'm interested in ${product.name}`}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border ${isDark ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                  Send SMS
                </a>
              </div>
            </div>

            {/* Seller card */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Seller</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {product.seller?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-sm">{product.seller?.name || "Unknown Seller"}</p>
                  <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{product.seller?.email}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Verified Seller on Broker
              </div>
            </div>

            {/* Safety tips */}
            <div className={`rounded-2xl border p-5 ${isDark ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
              <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-amber-400" : "text-amber-600"}`}>Safety Tips</h3>
              <ul className={`text-xs space-y-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <li>✓ Meet in a public place</li>
                <li>✓ Inspect before paying</li>
                <li>✓ Don't pay in advance</li>
                <li>✓ Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Seller's other listings ── */}
        {sellerProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">More from {product.seller?.name}</h2>
              <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{sellerProducts.length} listing{sellerProducts.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {sellerProducts.map((p) => <MiniCard key={p._id} p={p} />)}
            </div>
          </div>
        )}

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Related in {product.category}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {relatedProducts.map((p) => <MiniCard key={p._id} p={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
