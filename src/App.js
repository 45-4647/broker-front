import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import ChatPage from "./pages/ChatPage";
import { useEffect, useState } from "react";
import AdminProducts from "./pages/AdminProducts";
import PaymentSuccess from "./pages/PaymentSuccess";
import { Toaster } from "react-hot-toast";



function AppLayout({ theme, toggleTheme, user }) {
  const location = useLocation();
  const isChat = location.pathname.startsWith("/chat");

  return (
    <div className={theme === "dark" ? "flex flex-col min-h-screen bg-slate-950 text-slate-50" : "flex flex-col min-h-screen bg-slate-100 text-slate-900"}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: "12px", fontSize: "14px" } }} />
      <main className={`flex-1 pt-16 ${isChat ? "overflow-hidden flex flex-col" : theme === "dark" ? "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-slate-900" : "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"}`}>
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
          <Route path="/payment-success" element={<PaymentSuccess theme={theme} />} />
          <Route path="/chat" element={<ChatPage theme={theme} />} />
          <Route path="/chat/:roomId" element={<ChatPage theme={theme} />} />
        </Routes>
      </main>
      {!isChat && <Footer theme={theme} />}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <Router>
      <AppLayout theme={theme} toggleTheme={toggleTheme} user={user} />
    </Router>
  );
}

export default App;


