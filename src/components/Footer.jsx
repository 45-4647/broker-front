import { Link } from "react-router-dom";

export default function Footer({ theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <footer className={`border-t transition-colors duration-300 ${isDark ? "bg-slate-950 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">B</div>
            <span className={`font-extrabold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Broker</span>
          </div>
          <p className="text-sm leading-relaxed">
            A marketplace that connects sellers and buyers directly — no middlemen, no fees beyond listing.
          </p>
          <p className="text-xs mt-3">📍 Addis Ababa, Ethiopia</p>
        </div>

        {/* Links */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Quick Links</p>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/post-product", label: "Post a Product" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className={`transition hover:underline ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? "text-slate-300" : "text-slate-700"}`}>Contact</p>
          <ul className="space-y-2 text-sm">
            <li>✉️ support@broker.com</li>
            <li>📞 +251 900 000 000</li>
          </ul>
        </div>
      </div>

      <div className={`border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${isDark ? "border-slate-800" : "border-slate-100"}`}>
        <p>© {new Date().getFullYear()} Broker. All rights reserved.</p>
        <p className={isDark ? "text-slate-600" : "text-slate-400"}>Built for Ethiopian marketplace</p>
      </div>
    </footer>
  );
}
