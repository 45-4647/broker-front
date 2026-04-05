import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Login({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const input = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 ${
    isDark
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400/40 focus:border-blue-400"
  }`;

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}>

      {/* Left visual panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-black text-sm">B</div>
            <span className="text-white font-extrabold text-xl">Broker</span>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            The marketplace<br />built for Ethiopia.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-8">
            Connect with buyers and sellers directly. No middlemen, no hidden fees.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Active Listings", value: "1,200+" },
              { label: "Registered Users", value: "3,500+" },
              { label: "Cities Covered", value: "15+" },
              { label: "Daily Deals", value: "200+" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <p className="text-white font-bold text-lg">{s.value}</p>
                <p className="text-blue-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-blue-200 text-xs">© {new Date().getFullYear()} Broker. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">B</div>
            <span className={`font-extrabold text-xl ${isDark ? "text-white" : "text-slate-900"}`}>Broker</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Sign in to your account to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={input}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className={`${input} pr-10`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>
                  {showPass
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Signing in...</>
              ) : "Sign In"}
            </button>
          </form>

          <p className={`text-sm text-center mt-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
