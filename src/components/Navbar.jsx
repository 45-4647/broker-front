import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ theme = "dark", toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isDark = theme === "dark";

  // Re-read user from localStorage when it changes (e.g. after profile image upload)
  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener("storage", onStorage);
    // also poll on focus so same-tab updates work
    window.addEventListener("focus", onStorage);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", onStorage); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`relative text-sm font-medium transition-colors duration-200 ${
        isActive(to)
          ? isDark ? "text-blue-400" : "text-blue-600"
          : isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
      {isActive(to) && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled
        ? isDark ? "bg-slate-950/95 backdrop-blur-xl border-slate-800 shadow-lg shadow-slate-950/50" : "bg-white/95 backdrop-blur-xl border-slate-200 shadow-sm"
        : isDark ? "bg-slate-950/80 backdrop-blur-xl border-slate-800/50" : "bg-white/80 backdrop-blur-xl border-slate-200/50"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">B</div>
          <span className={isDark ? "text-white" : "text-slate-900"}>Broker</span>
        </Link>

        {/* Desktop nav + right controls — all on the right */}
        <div className="hidden md:flex items-center gap-6">
          {navLink("/", "Home")}
          {navLink("/about", "About")}
          {token && navLink("/contact", "Contact")}
          {token && navLink("/chat", "Messages")}
          {token && user?.role === "seller" && navLink("/post-product", "Post Product")}

          {/* divider */}
          <span className={`w-px h-4 ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
          >
            {isDark
              ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            }
          </button>

          {!token ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className={`text-sm font-medium px-4 py-1.5 rounded-xl transition ${isDark ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>Login</Link>
              <Link to="/register" className="text-sm font-semibold px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition">Register</Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {user?.profileImage
                    ? <img src={user.profileImage} alt={user.name} className="w-8 h-8 object-cover" />
                    : user?.name?.charAt(0).toUpperCase() || "U"
                  }
                </div>
                <svg className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""} ${isDark ? "text-slate-400" : "text-slate-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-52 rounded-2xl border shadow-xl py-1.5 text-sm overflow-hidden ${isDark ? "bg-slate-900 border-slate-700 text-slate-200" : "bg-white border-slate-200 text-slate-700 shadow-slate-200/50"}`}>
                  <div className={`px-4 py-2.5 border-b flex items-center gap-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                      {user?.profileImage
                        ? <img src={user.profileImage} alt={user.name} className="w-9 h-9 object-cover" />
                        : user?.name?.charAt(0).toUpperCase() || "U"
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user?.name}</p>
                      <p className={`text-xs mt-0.5 capitalize ${isDark ? "text-slate-400" : "text-slate-500"}`}>{user?.role}</p>
                    </div>
                  </div>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className={`flex items-center gap-2 px-4 py-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                    <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className={`flex items-center gap-2 px-4 py-2 transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}>
                      <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Admin Panel
                    </Link>
                  )}
                  <div className={`border-t my-1 ${isDark ? "border-slate-800" : "border-slate-100"}`} />
                  <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-4 py-2 text-red-500 transition ${isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggleTheme} className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
            {isDark
              ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            }
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`w-8 h-8 rounded-xl flex flex-col items-center justify-center gap-1.5 ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
            <span className={`block w-5 h-0.5 rounded-full transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""} ${isDark ? "bg-slate-300" : "bg-slate-700"}`} />
            <span className={`block w-5 h-0.5 rounded-full transition-all ${menuOpen ? "opacity-0" : ""} ${isDark ? "bg-slate-300" : "bg-slate-700"}`} />
            <span className={`block w-5 h-0.5 rounded-full transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""} ${isDark ? "bg-slate-300" : "bg-slate-700"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden border-t px-4 py-4 space-y-1 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            ...(token ? [
              { to: "/contact", label: "Contact" },
              { to: "/chat", label: "Messages" },
              ...(user?.role === "seller" ? [{ to: "/post-product", label: "Post Product" }] : []),
              ...(user?.role === "admin" ? [{ to: "/admin", label: "Admin Panel" }] : []),
              { to: "/profile", label: "Profile" },
            ] : [
              { to: "/login", label: "Login" },
              { to: "/register", label: "Register" },
            ])
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive(to)
                  ? isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                  : isDark ? "text-slate-300 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {label}
            </Link>
          ))}
          {token && (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 transition ${isDark ? "hover:bg-red-500/10" : "hover:bg-red-50"}`}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
