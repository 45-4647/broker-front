import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Register({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer", phone: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const input = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 ${
    isDark
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400/40 focus:border-blue-400"
  }`;
  const label = `block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>

      {/* Left visual panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-sm">B</div>
            <span className="text-white font-extrabold text-xl">Broker</span>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Start selling or<br />buying today.
          </h2>
          <p className="text-indigo-100 text-sm leading-relaxed mb-8">
            Join thousands of users already trading on Broker. It's free to join.
          </p>
          <div className="space-y-3">
            {[
              { icon: "🛒", title: "Buyers", desc: "Browse thousands of listings and contact sellers directly." },
              { icon: "🏪", title: "Sellers", desc: "Post your products and reach buyers across Ethiopia." },
              { icon: "💬", title: "Real-time Chat", desc: "Negotiate and close deals with built-in messaging." },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <span className="text-xl shrink-0">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-indigo-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-indigo-200 text-xs">© {new Date().getFullYear()} Broker. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm">B</div>
            <span className={`font-extrabold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>Broker</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Join as a buyer or seller — it's free.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={label}>Full Name</label>
              <input type="text" placeholder="Abebe Kebede" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required className={input} />
            </div>

            <div>
              <label className={label}>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required className={input} />
            </div>

            <div>
              <label className={label}>Phone</label>
              <input type="text" placeholder="+251 9XX XXX XXX" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
            </div>

            <div>
              <label className={label}>Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required className={`${input} pr-10`} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <div>
              <label className={label}>I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {["buyer", "seller"].map((r) => (
                  <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                    className={`py-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 ${
                      form.role === r
                        ? "border-blue-500 bg-blue-500/10 text-blue-500"
                        : isDark ? "border-slate-700 text-slate-400 hover:border-slate-500" : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}>
                    {r === "buyer" ? "🛒 Buy" : "🏪 Sell"}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Creating account...</>
              ) : "Create Account"}
            </button>
          </form>

          <p className={`text-sm text-center mt-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
