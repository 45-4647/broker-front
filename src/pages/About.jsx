import { Link } from "react-router-dom";

const features = [
  { icon: "🛒", title: "Buy Anything", desc: "Browse thousands of listings across electronics, vehicles, real estate, fashion, and more." },
  { icon: "🏪", title: "Sell Fast", desc: "Post your product in minutes. Pay a small promotion fee and go live instantly." },
  { icon: "💬", title: "Real-time Chat", desc: "Message sellers directly inside the platform. No phone number needed to start." },
  { icon: "🔮", title: "AI Recommendations", desc: "Our AI surfaces the most relevant listings for you based on what's trending." },
  { icon: "🔒", title: "Secure Auth", desc: "JWT-based authentication keeps your account and data safe at all times." },
  { icon: "📍", title: "Location Aware", desc: "Filter by city or region to find deals near you across Ethiopia." },
];

const stack = [
  { name: "React", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { name: "Node.js", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { name: "MongoDB", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { name: "Socket.io", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { name: "Tailwind CSS", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
  { name: "Cloudinary", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { name: "Chapa", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { name: "Stripe", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
];

export default function About({ theme = "dark" }) {
  const isDark = theme === "dark";
  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";
  const card = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 border ${isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
            About Broker
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">
            Ethiopia's{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Smart Marketplace
            </span>
          </h1>
          <p className={`text-base max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Broker connects buyers and sellers directly — no middlemen, no delivery hassle.
            Post a product, find a buyer, close the deal on your terms.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Link to="/register" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition">
              Get Started Free
            </Link>
            <Link to="/" className={`px-6 py-3 rounded-xl border font-semibold text-sm transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}>
              Browse Listings
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { value: "1,200+", label: "Active Listings" },
            { value: "3,500+", label: "Registered Users" },
            { value: "15+", label: "Cities Covered" },
            { value: "200+", label: "Daily Deals" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-5 text-center ${card}`}>
              <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{s.value}</p>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-2">What Broker offers</h2>
          <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Everything you need to buy and sell with confidence.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className={`rounded-2xl border p-5 hover:-translate-y-0.5 transition-transform duration-200 ${card}`}>
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className={`rounded-2xl border p-8 mb-16 ${card}`}>
          <h2 className="text-2xl font-bold mb-8 text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Create an account", desc: "Sign up as a buyer or seller in under a minute." },
              { step: "02", title: "Post or browse", desc: "Sellers post products with images and details. Buyers search and filter." },
              { step: "03", title: "Connect & deal", desc: "Chat directly, call, or email. Close the deal on your terms." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-lg ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                  {s.step}
                </div>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Built with</h2>
          <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Modern, production-grade technologies.</p>
          <div className="flex flex-wrap gap-2">
            {stack.map((t) => (
              <span key={t.name} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${t.bg} ${t.color}`}>
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`rounded-2xl border p-10 text-center ${isDark ? "bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"}`}>
          <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
          <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Join Broker today and start buying or selling in minutes.</p>
          <Link to="/register" className="inline-block px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition active:scale-95">
            Create Free Account
          </Link>
        </div>

      </div>
    </div>
  );
}
