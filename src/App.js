import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostProduct from "./pages/PostProduct";
import ProductDetails from "./pages/ProductDetails";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import EditProduct from "./pages/EditProduct";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ChatList from "./pages/ChatList";
import { useEffect, useState } from "react";
import AdminProducts from "./pages/AdminProducts";
import ChatWrapper from "./pages/ChatPage";


function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };
console.log(user)
  useEffect(() => {
    // Load user from localStorage when app starts
    const storedUser = localStorage.getItem("user");
    // console.log(storedUser)
    if (storedUser) {
      const userData=JSON.parse(storedUser)
      setUser(userData);
      console.log(JSON.parse(storedUser))
    }
  }, []);
 return (
    <Router>
      {/* ✅ Layout with theme support */}
      <div
        className={
          theme === "dark"
            ? "flex flex-col min-h-screen bg-slate-950 text-slate-50"
            : "flex flex-col min-h-screen bg-slate-100 text-slate-900"
        }
      >
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* ✅ Main Content Area with Scroll */}
        <main
          className={
            theme === "dark"
              ? "flex-1 pt-16 pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-slate-900"
              : "flex-1 pt-16 pb-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
          }
        >
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/product/:id" element={<ProductDetails theme={theme} />} />
            <Route path="/login" element={<Login theme={theme} />} />
            <Route path="/register" element={<Register theme={theme} />} />
            <Route path="/post-product" element={<PostProduct theme={theme} />} />
            <Route path="/profile" element={<Profile theme={theme} />} />
            <Route path="/edit-product/:id" element={<EditProduct theme={theme} />} />
            <Route path="/about" element={<About theme={theme} />} />
            <Route path="/contact" element={<Contact theme={theme} />} />
            <Route path="/admin" element={<AdminProducts theme={theme} />} />
            <Route path="/chat" element={<ChatList theme={theme} userId={user?._id} />} />
            <Route
              path="/chat/:roomId"
              element={<ChatWrapper theme={theme} />}
            />
          </Routes>
        </main>

        {/* ✅ Footer stays at bottom */}
        <Footer theme={theme} />
      </div>
    </Router>
  );
}

export default App;


