import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme = "dark", toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isDark = theme === "dark";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // DESKTOP LINK COLORS
  const linkBase = "transition font-medium";
  const linkColor = isDark
    ? "text-slate-200 hover:text-red-400"
    : "text-gray-700 hover:text-red-600";

  // MOBILE LINK COLORS
  const mobileLinkColor = isDark
    ? "text-slate-100 hover:text-red-400"
    : "text-gray-800 hover:text-red-600";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b ${
        isDark ? "bg-slate-950/80 border-slate-800" : "bg-white border-red-100 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

        {/* LOGO */}
        <Link to="/" className="font-bold text-xl">
          <span
            className={
              isDark
                ? "bg-gradient-to-r from-red-400 via-rose-400 to-red-500 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent"
            }
          >
            Broker
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">

          {/* PUBLIC ROUTES */}
          <Link to="/" className={`${linkBase} ${linkColor}`}>Home</Link>
          <Link to="/about" className={`${linkBase} ${linkColor}`}>About</Link>

          {!token ? (
            <>
              <Link to="/login" className={`${linkBase} ${linkColor}`}>Login</Link>
              <Link to="/register" className={`${linkBase} ${linkColor}`}>Register</Link>
            </>
          ) : (
            <>
              {user?.role === "seller" && (
                <Link to="/post-product" className={`${linkBase} ${linkColor}`}>Post Product</Link>
              )}
              <Link to="/contact" className={`${linkBase} ${linkColor}`}>Contact</Link>
              <Link to="/chat" className={`${linkBase} ${linkColor}`}>Chat</Link>
             

              {/* USER AVATAR DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block group-hover:text-red-500">
                    {user?.name || "Account"}
                  </span>
                </div>

                {dropdownOpen && (
                  <div className={`absolute right-0 mt-3 w-48 rounded-xl shadow-lg py-2 text-sm ${
                    isDark ? "bg-slate-900 border border-slate-700 text-slate-200" : "bg-white border border-red-100 text-gray-700"
                  }`}>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-red-500">Profile</Link>
                    {user?.role === "admin" && (
                <Link to="/admin" className={`${linkBase} ${linkColor}`}>Manage Products</Link>
              )}
                    <Link to="/about" className="block px-4 py-2 hover:bg-red-500">About</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {toggleTheme && (
                <button
                  onClick={toggleTheme}
                  className="ml-2 px-3 py-1 rounded-full text-xs border border-red-200 hover:border-red-400"
                >
                  {isDark ? "Light" : "Dark"}
                </button>
              )}
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <div className="flex items-center gap-2 md:hidden">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="px-2 py-1 text-xs border rounded-full border-red-200"
            >
              {isDark ? "Light" : "Dark"}
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="space-y-1">
            <span className="block w-6 h-0.5 bg-red-500"></span>
            <span className="block w-6 h-0.5 bg-red-500"></span>
            <span className="block w-6 h-0.5 bg-red-500"></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className={`md:hidden px-4 py-4 space-y-3 text-sm shadow-lg rounded-xl border ${
          isDark
            ? "bg-slate-950/95 text-slate-100 border-slate-800"
            : "bg-white text-gray-800 border-red-100"
        }`}>
          {/* PUBLIC LINKS */}
          <Link to="/" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>About</Link>

          {!token ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Register</Link>
            </>
          ) : (
            <>
              {user?.role === "seller" && (
                <Link to="/post-product" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Post Product</Link>
              )}
              <Link to="/contact" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Contact</Link>
              <Link to="/chat" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Chat</Link>
              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Admin</Link>
              )}
              <Link to="/profile" onClick={() => setMenuOpen(false)} className={`block ${mobileLinkColor}`}>Profile</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className={`block text-left w-full ${isDark ? "text-slate-200 hover:text-red-400" : "text-red-600 hover:text-red-700"}`}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
