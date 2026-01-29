import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ theme = "dark", toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isDark = theme === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b ${
        isDark
          ? "bg-slate-950/80 border-slate-800/80"
          : "bg-white/80 border-slate-200/80 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl tracking-tight">
          <span
            className={
              isDark
                ? "bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
            }
          >
            Broker
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center text-sm">
          <Link
            to="/"
            className={`transition ${
              isDark
                ? "text-slate-200 hover:text-sky-400"
                : "text-slate-700 hover:text-sky-600"
            }`}
          >
            Home
          </Link>
          

          {!token ? (
            <>
           
              <Link
                to="/login"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Register
              </Link>
             
            </>
          ) : (
            <>
          {user.role==="seller" &&<Link
                to="/post-product"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Post Product
              </Link>}
              <Link
                to="/about"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Contact
              </Link>
              <Link
                to="/profile"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Profile
              </Link>
              {user.role==="admin" && <Link
                to="/admin"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Admin
              </Link>}
              <button
                onClick={handleLogout}
                className="bg-red-500/90 hover:bg-red-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm shadow-red-900/60 transition"
              >
                Logout
              </button>
              <Link
                to="/chat"
                className={`transition ${
                  isDark
                    ? "text-slate-200 hover:text-sky-400"
                    : "text-slate-700 hover:text-sky-600"
                }`}
              >
                Chat
              </Link>
              {toggleTheme && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                    isDark
                      ? "border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-400"
                      : "border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-600"
                  }`}
                >
                  {isDark ? "Light" : "Dark"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="flex items-center gap-2 md:hidden">
          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className={`px-2 py-1 rounded-full text-[10px] font-semibold border transition ${
                isDark
                  ? "border-slate-700 text-slate-200 hover:border-sky-500 hover:text-sky-400"
                  : "border-slate-300 text-slate-700 hover:border-sky-500 hover:text-sky-600"
              }`}
            >
              {isDark ? "Light" : "Dark"}
            </button>
          )}
          <button
            className="md:hidden flex flex-col space-y-1 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span
              className={`block w-6 h-0.5 rounded-full ${
                isDark ? "bg-slate-100" : "bg-slate-800"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 rounded-full ${
                isDark ? "bg-slate-100" : "bg-slate-800"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 rounded-full ${
                isDark ? "bg-slate-100" : "bg-slate-800"
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`md:hidden mt-2 rounded-2xl shadow-2xl py-4 px-4 space-y-3 border ${
            isDark
              ? "bg-slate-950/95 shadow-slate-950/80 border-slate-800/80"
              : "bg-white shadow-slate-900/10 border-slate-200"
          }`}
        >
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`block text-sm transition ${
              isDark
                ? "text-slate-100 hover:text-sky-400"
                : "text-slate-800 hover:text-sky-600"
            }`}
          >
            Home
         
          </Link>
           <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={`block text-sm transition ${
              isDark
                ? "text-slate-100 hover:text-sky-400"
                : "text-slate-800 hover:text-sky-600"
            }`}
          >
          About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={`block text-sm transition ${
              isDark
                ? "text-slate-100 hover:text-sky-400"
                : "text-slate-800 hover:text-sky-600"
            }`}
          >
            Contact
             </Link>
          

          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={`block text-sm transition ${
                  isDark
                    ? "text-slate-100 hover:text-sky-400"
                    : "text-slate-800 hover:text-sky-600"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className={`block text-sm transition ${
                  isDark
                    ? "text-slate-100 hover:text-sky-400"
                    : "text-slate-800 hover:text-sky-600"
                }`}
              >
                Register
              </Link>
             
            </>
          ) : (
            <>
         {user.role==="seller" &&<Link
              to="/post-product"
              onClick={() => setMenuOpen(false)}
              className={`block text-sm transition ${
                isDark
                  ? "text-slate-100 hover:text-sky-400"
                  : "text-slate-800 hover:text-sky-600"
              }`}
          >
            Post Product
          </Link>}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={`block text-sm transition ${
                  isDark
                    ? "text-slate-100 hover:text-sky-400"
                    : "text-slate-800 hover:text-sky-600"
                }`}
              >
                Profile
              </Link>
              <Link
                to="/chat"
                onClick={() => setMenuOpen(false)}
                className={`block text-sm transition ${
                  isDark
                    ? "text-slate-100 hover:text-sky-400"
                    : "text-slate-800 hover:text-sky-600"
                }`}
              >
            chat
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block text-left w-full text-xs text-red-300 hover:text-red-400 mt-1"
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
