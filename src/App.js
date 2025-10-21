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
      {/* ✅ Sticky Navbar */}
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />

        {/* ✅ Main Content Area with Scroll */}
        <main className="flex-1 pt-20 pb-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post-product" element={<PostProduct />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminProducts />} />
            <Route path="/chat" element={<ChatList userId={user?._id} />} />
            <Route path="/chat/:roomId" element={<ChatWrapper />} />
          </Routes>
        </main>

        {/* ✅ Footer stays at bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;


