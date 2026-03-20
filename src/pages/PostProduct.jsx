import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PostProduct({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    model: "",
    price: "",
    category: "",
    condition: "New",
    location: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      for (const key in form) formData.append(key, form[key]);
      if (image) formData.append("image", image);
      const endpoint = paymentMethod === "stripe" ? "/payment/stripe" : "/payment/chapa";
      const res = await API.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      window.location.href = res.data.url;
    } catch (error) {
      console.error(error);
      setMsg("❌ Failed to initialize payment. " + (error?.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "seller") {
      alert("This resource is not authorized");
      navigate("/");
    }
  }, [user, navigate]);

  // shared input class
  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 ${
    isDark
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500"
      : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400/40 focus:border-blue-400"
  }`;

  const labelCls = `block text-xs font-semibold mb-1 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className={`min-h-screen py-10 px-4 transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      <div className="max-w-2xl mx-auto">

        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-500"}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Post a Product</h1>
          <p className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Fill in the details, choose a payment method, and go live.
          </p>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* Card: Product Info */}
          <div className={`rounded-2xl border p-6 mb-5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-5 ${isDark ? "text-slate-400" : "text-slate-400"}`}>Product Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Product Name *</label>
                <input name="name" placeholder="e.g. iPhone 14 Pro" value={form.name} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Model</label>
                <input name="model" placeholder="e.g. A2650" value={form.model} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price (ETB) *</label>
                <input name="price" type="number" placeholder="e.g. 45000" value={form.price} onChange={handleChange} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input name="category" placeholder="e.g. Electronics" value={form.category} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Condition</label>
                <select name="condition" value={form.condition} onChange={handleChange} className={inputCls}>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Location *</label>
                <input name="location" placeholder="e.g. Addis Ababa" value={form.location} onChange={handleChange} required className={inputCls} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Description</label>
              <textarea
                name="description"
                placeholder="Describe your product in detail..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {/* Card: Image Upload */}
          <div className={`rounded-2xl border p-6 mb-5 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-5 ${isDark ? "text-slate-400" : "text-slate-400"}`}>Product Image</h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                dragOver
                  ? isDark ? "border-blue-400 bg-blue-500/10" : "border-blue-400 bg-blue-50"
                  : isDark ? "border-slate-700 hover:border-slate-500" : "border-slate-300 hover:border-slate-400"
              }`}
            >
              {preview ? (
                <div className="relative group">
                  <img src={preview} alt="preview" className="w-full h-52 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <label className="cursor-pointer text-white text-sm font-medium bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <svg className={`w-6 h-6 ${isDark ? "text-slate-400" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>Drop image here or <span className="text-blue-500">browse</span></p>
                  <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>PNG, JPG, WEBP up to 10MB</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Card: Payment */}
          <div className={`rounded-2xl border p-6 mb-6 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-5 ${isDark ? "text-slate-400" : "text-slate-400"}`}>Payment Method</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Chapa Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("chapa")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === "chapa"
                    ? isDark ? "border-blue-500 bg-blue-500/10" : "border-blue-500 bg-blue-50"
                    : isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {paymentMethod === "chapa" && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                <span className="text-2xl">🇪🇹</span>
                <span className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Chapa</span>
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Telebirr / Bank</span>
              </button>

              {/* Stripe Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === "stripe"
                    ? isDark ? "border-blue-500 bg-blue-500/10" : "border-blue-500 bg-blue-50"
                    : isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {paymentMethod === "stripe" && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                <span className="text-2xl">💳</span>
                <span className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>Stripe</span>
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Credit / Debit Card</span>
              </button>
            </div>

            {/* Fee notice */}
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
              <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                One-time promotion fee: <span className="font-bold text-amber-400">200 ETB</span>. Your listing goes live after payment.
              </p>
            </div>
          </div>

          {/* Error message */}
          {msg && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {msg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:opacity-90 active:scale-[0.98]"
            } bg-blue-600 text-white shadow-lg shadow-blue-500/20`}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay & Post Product
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
