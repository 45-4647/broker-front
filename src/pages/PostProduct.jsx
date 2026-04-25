import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CATEGORIES = ["Electronics","Vehicles","Real Estate","Fashion","Furniture","Services","Other"];

const tips = [
  { icon: "📸", title: "Add a clear photo", desc: "Listings with photos get 5x more views. Use good lighting and a clean background." },
  { icon: "💰", title: "Price it right", desc: "Research similar listings. Competitive pricing gets you buyers faster." },
  { icon: "📝", title: "Write a detailed description", desc: "Include age, condition, reason for selling, and any defects. Honesty builds trust." },
  { icon: "📍", title: "Set your location", desc: "Buyers prefer local sellers. Accurate location increases serious inquiries." },
];

const advantages = [
  { icon: "👁️", value: "3,500+", label: "Active buyers browsing daily" },
  { icon: "⚡", value: "< 2 min", label: "Average time to go live" },
  { icon: "💬", value: "Real-time", label: "Chat with interested buyers" },
  { icon: "📊", value: "3%", label: "Fair promotion fee" },
];

export default function PostProduct({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [step, setStep] = useState(1); // 1=details, 2=image, 3=payment
  const [form, setForm] = useState({
    name: "", model: "", price: "", category: "", condition: "New", location: "", description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [loading, setLoading] = useState(false);

  const fee = form.price ? Math.max(Math.round(parseFloat(form.price) * 0.03), 10) : null;

  useEffect(() => {
    if (!user || user.role !== "seller") {
      toast.error("Only sellers can post products.");
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } catch (err) {
      toast.error("Failed to initialize payment. " + (err?.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Step validation
  const step1Valid = form.name && form.price && form.category && form.location && form.condition;
  const step2Valid = true; // image optional

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 ${
    isDark ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500"
           : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400/40 focus:border-blue-400"
  }`;
  const labelCls = `block text-xs font-bold mb-1.5 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`;
  const card = `rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-1 space-y-5">

            {/* Why post here */}
            <div className={`${card} p-6`}>
              <h2 className="font-bold text-base mb-4">Why sell on Broker?</h2>
              <div className="grid grid-cols-2 gap-3">
                {advantages.map(a => (
                  <div key={a.label} className={`rounded-xl p-3 text-center ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                    <p className="text-lg mb-1">{a.icon}</p>
                    <p className={`font-extrabold text-sm ${isDark ? "text-blue-400" : "text-blue-600"}`}>{a.value}</p>
                    <p className={`text-[10px] mt-0.5 leading-tight ${isDark ? "text-slate-400" : "text-slate-500"}`}>{a.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className={`${card} p-6`}>
              <h2 className="font-bold text-base mb-4">Tips for a great listing</h2>
              <div className="space-y-4">
                {tips.map(t => (
                  <div key={t.title} className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{t.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{t.title}</p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fee calculator */}
            <div className={`rounded-2xl border p-5 ${isDark ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
              <h2 className={`font-bold text-sm mb-3 ${isDark ? "text-amber-400" : "text-amber-600"}`}>💰 Fee Calculator</h2>
              <p className={`text-xs mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Your promotion fee is <strong>3% of your product price</strong> (min 10 ETB).
              </p>
              {fee ? (
                <div className={`rounded-xl p-3 text-center ${isDark ? "bg-slate-800" : "bg-white"}`}>
                  <p className={`text-2xl font-extrabold ${isDark ? "text-amber-400" : "text-amber-600"}`}>{fee} ETB</p>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    3% of {parseFloat(form.price).toLocaleString()} ETB
                  </p>
                </div>
              ) : (
                <p className={`text-xs italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>Enter your price to see the fee</p>
              )}
            </div>
          </div>

          {/* ── MAIN FORM ── */}
          <div className="lg:col-span-2">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold mb-1">Post a Product</h1>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Fill in the details below, pay the promotion fee, and your listing goes live instantly.
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { n: 1, label: "Product Details" },
                { n: 2, label: "Photo" },
                { n: 3, label: "Payment" },
              ].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2 flex-1">
                  <button
                    onClick={() => { if (s.n < step || (s.n === 2 && step1Valid) || (s.n === 3 && step1Valid)) setStep(s.n); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      step === s.n ? "bg-blue-600 text-white scale-110" :
                      step > s.n ? "bg-green-500 text-white" :
                      isDark ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-500"
                    }`}>
                    {step > s.n ? "✓" : s.n}
                  </button>
                  <span className={`text-xs font-medium hidden sm:block ${step === s.n ? isDark ? "text-white" : "text-slate-900" : isDark ? "text-slate-500" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                  {i < 2 && <div className={`flex-1 h-0.5 ${step > s.n ? "bg-green-500" : isDark ? "bg-slate-800" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── STEP 1: Details ── */}
              {step === 1 && (
                <div className={`${card} p-6 space-y-5`}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Product Name *
                        <span className={`ml-1 normal-case font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>— be specific (e.g. "iPhone 14 Pro 256GB")</span>
                      </label>
                      <input name="name" placeholder="e.g. iPhone 14 Pro 256GB Space Black" value={form.name} onChange={handleChange} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Model / Brand
                        <span className={`ml-1 normal-case font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>— optional but helps buyers search</span>
                      </label>
                      <input name="model" placeholder="e.g. Apple A2650" value={form.model} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Price (ETB) *
                        <span className={`ml-1 normal-case font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>— set a fair market price</span>
                      </label>
                      <input name="price" type="number" placeholder="e.g. 45000" value={form.price} onChange={handleChange} required className={inputCls} />
                      {fee && <p className={`text-xs mt-1 ${isDark ? "text-amber-400" : "text-amber-600"}`}>Promotion fee: <strong>{fee} ETB</strong></p>}
                    </div>
                    <div>
                      <label className={labelCls}>Category *</label>
                      <select name="category" value={form.category} onChange={handleChange} required className={inputCls}>
                        <option value="">Select a category...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Condition *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["New", "Used"].map(c => (
                          <button key={c} type="button" onClick={() => setForm({ ...form, condition: c })}
                            className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                              form.condition === c
                                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                : isDark ? "border-slate-700 text-slate-400 hover:border-slate-500" : "border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}>
                            {c === "New" ? "✨ New" : "🔄 Used"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Location *
                        <span className={`ml-1 normal-case font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>— city or area</span>
                      </label>
                      <input name="location" placeholder="e.g. Addis Ababa, Bole" value={form.location} onChange={handleChange} required className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Description
                      <span className={`ml-1 normal-case font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}>— include age, specs, reason for selling, any defects</span>
                    </label>
                    <textarea name="description" placeholder="Describe your product in detail. The more you write, the more trust you build with buyers..." value={form.description} onChange={handleChange} rows={4} className={`${inputCls} resize-none`} />
                    <p className={`text-xs mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{form.description.length} characters — aim for 100+</p>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" disabled={!step1Valid} onClick={() => setStep(2)}
                      className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all active:scale-95">
                      Next: Add Photo →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Image ── */}
              {step === 2 && (
                <div className={`${card} p-6 space-y-5`}>
                  <div>
                    <h3 className="font-bold text-base mb-1">Product Photo</h3>
                    <p className={`text-xs mb-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Listings with a photo get <strong>5x more views</strong>. Use good lighting and a clean background.
                    </p>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
                        dragOver
                          ? isDark ? "border-blue-400 bg-blue-500/10" : "border-blue-400 bg-blue-50"
                          : isDark ? "border-slate-700 hover:border-slate-500" : "border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {preview ? (
                        <div className="relative group">
                          <img src={preview} alt="preview" className="w-full h-64 object-cover rounded-2xl" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <label className="cursor-pointer text-white text-sm font-semibold bg-white/20 px-5 py-2.5 rounded-xl backdrop-blur-sm">
                              Change Photo
                              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                          </div>
                          <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold hover:bg-red-600 transition">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                            <svg className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className={`text-sm font-semibold mb-1 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                            Drop your photo here or <span className="text-blue-500">browse</span>
                          </p>
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>PNG, JPG, WEBP — max 10MB</p>
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Photo tips */}
                  <div className={`rounded-xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                    <p className={`text-xs font-bold mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>📸 Photo tips</p>
                    <ul className={`text-xs space-y-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      <li>✓ Take the photo in natural daylight</li>
                      <li>✓ Use a plain white or neutral background</li>
                      <li>✓ Show the product from the front</li>
                      <li>✓ Avoid blurry or dark images</li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(1)} className={`px-6 py-3 rounded-xl border text-sm font-semibold transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                      ← Back
                    </button>
                    <button type="button" onClick={() => setStep(3)}
                      className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all active:scale-95">
                      Next: Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Payment ── */}
              {step === 3 && (
                <div className={`${card} p-6 space-y-5`}>
                  <div>
                    <h3 className="font-bold text-base mb-1">Choose Payment Method</h3>
                    <p className={`text-xs mb-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      Pay the promotion fee to publish your listing. Your product goes live immediately after payment.
                    </p>

                    {/* Summary */}
                    <div className={`rounded-xl p-4 mb-5 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}>
                      <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Listing Summary</p>
                      <div className="flex items-start gap-3">
                        {preview && <img src={preview} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{form.name || "Your Product"}</p>
                          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>{form.category} · {form.condition} · {form.location}</p>
                          <p className={`font-bold text-sm mt-1 ${isDark ? "text-sky-400" : "text-sky-600"}`}>{parseFloat(form.price || 0).toLocaleString()} ETB</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Promotion fee</p>
                          <p className={`font-extrabold text-lg ${isDark ? "text-amber-400" : "text-amber-600"}`}>{fee || 0} ETB</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment options */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { id: "chapa", emoji: "🇪🇹", name: "Chapa", sub: "Telebirr / Bank Transfer" },
                        { id: "stripe", emoji: "💳", name: "Stripe", sub: "Credit / Debit Card" },
                      ].map(p => (
                        <button key={p.id} type="button" onClick={() => setPaymentMethod(p.id)}
                          className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 ${
                            paymentMethod === p.id
                              ? isDark ? "border-blue-500 bg-blue-500/10" : "border-blue-500 bg-blue-50"
                              : isDark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                          }`}>
                          {paymentMethod === p.id && (
                            <span className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            </span>
                          )}
                          <span className="text-3xl">{p.emoji}</span>
                          <span className="font-bold text-sm">{p.name}</span>
                          <span className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>{p.sub}</span>
                        </button>
                      ))}
                    </div>

                    {/* Info box */}
                    <div className={`flex items-start gap-3 rounded-xl p-4 mb-5 ${isDark ? "bg-blue-500/5 border border-blue-500/20" : "bg-blue-50 border border-blue-200"}`}>
                      <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        After payment, your listing goes <strong>live immediately</strong> and will be visible to all buyers. You'll be redirected back to confirm.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button type="button" onClick={() => setStep(2)} className={`px-6 py-3 rounded-xl border text-sm font-semibold transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
                      ← Back
                    </button>
                    <button type="submit" disabled={loading}
                      className={`px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                      {loading ? (
                        <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing...</>
                      ) : (
                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>Pay {fee} ETB & Publish</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
