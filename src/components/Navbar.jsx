import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          Broker
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-gray-200 transition">Home</Link>
          

          {!token ? (
            <>
           
              <Link to="/login" className="hover:text-gray-200 transition">Login</Link>
              <Link to="/register" className="hover:text-gray-200 transition">Register</Link>
             
            </>
          ) : (
            <>
             <Link to="/post-product" className="hover:text-gray-200 transition">
            Post Product
          </Link>
              <Link to="/about" className="hover:text-gray-200 transition">about</Link>
              <Link to="/contact" className="hover:text-gray-200 transition">contact</Link>
              <Link to="/profile" className="hover:text-gray-200 transition">Profile</Link>
              <Link to="/admin" className="hover:text-gray-200 transition">Admin</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition"
              >
                Logout
              </button>
              <Link to="/chat" className="hover:text-gray-200 transition">chat</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 mt-3 rounded-lg shadow-lg py-3 px-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Home
         
          </Link>
           <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-300"
          >
          About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Contact
             </Link>
          

          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Register
              </Link>
              <Link to="/chats"  className="block hover:text-gray-300">Chats</Link>
            </>
          ) : (
            <>
            <Link
            to="/post-product"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-gray-300"
          >
            Post Product
          </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300"
              >
                Profile
              </Link>
              <Link
                to="/chat"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-gray-300"
              >
            chat
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block text-left w-full text-red-300 hover:text-red-400"
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
