import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";


export default function ProductDetails({ theme = "dark" }) {
  const isDark = theme === "dark";
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/detail/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Create or get chat room
  const handleChat = async () => {
    if (!user) {
      alert("You must be logged in to chat.");
      return;
    }

    try {
      const res = await API.post("/chatroom", {
        user1: user.id,
        user2: product.seller._id,
      });

      const roomId = res.data._id; // MongoDB ChatRoom ID
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error("Error creating/getting chat room:", err);
    }
  };

  if (loading)
    return (
      <p
        className={`flex justify-center items-center h-screen ${
          isDark ? "text-slate-300 bg-slate-950" : "text-slate-700 bg-slate-50"
        }`}
      >
        Loading product...
      </p>
    );
  if (!product)
    return (
      <p
        className={`flex justify-center items-center h-screen ${
          isDark ? "text-slate-300 bg-slate-950" : "text-slate-700 bg-slate-50"
        }`}
      >
        Product not found
      </p>
    );

  return (
    <div
      className={`min-h-screen p-4 flex flex-col items-center ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"
      }`}
    >
      <div className="w-full max-w-4xl">
        {/* Hero */}
        <div
          className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-8 mb-6 shadow-2xl ${
            isDark
              ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/70"
              : "bg-white/70 border-slate-200 shadow-slate-900/10"
          }`}
        >
          <p
            className={`text-xs uppercase tracking-[0.35em] ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Product
          </p>
          <h1
            className={`mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-blue-400 via-sky-400 to-indigo-400"
                : "from-sky-600 via-blue-600 to-indigo-600"
            } bg-clip-text text-transparent`}
          >
            {product.name}
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Review details, then contact the seller via email, SMS, call, or chat.
          </p>
        </div>

        <div
          className={`shadow-2xl rounded-3xl border p-6 sm:p-8 w-full backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 ${
            isDark
              ? "bg-slate-900/80 shadow-slate-950/80 border-slate-800/80 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
              : "bg-white/80 shadow-slate-900/10 border-slate-200 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"
          }`}
        >
        {/* Product Info */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 flex justify-center items-center">
            {product.images?.length > 0 ? (
              <img
                src={`https://broker-back.onrender.com${product.images[0]}`}
                alt={product.name}
                className="rounded-2xl object-cover w-full h-80 max-w-md border border-slate-700/70 shadow-lg shadow-slate-950/70"
              />
            ) : (
              <div className="w-full h-80 bg-slate-900/80 border border-slate-700/70 flex justify-center items-center rounded-2xl">
                <p className="text-slate-500 text-sm">No Image</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className={`${isDark ? "text-slate-400" : "text-slate-600"} mb-1`}>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Model:
              </span>{" "}
              {product.model || "N/A"}
            </p>
            <p className={`${isDark ? "text-sky-400" : "text-sky-600"} font-bold text-xl mb-2`}>
              ${product.price}
            </p>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Category:
              </span>{" "}
              {product.category || "N/A"}
            </p>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Condition:
              </span>{" "}
              {product.condition}
            </p>
            <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"} mb-2`}>
              <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Location:
              </span>{" "}
              {product.location}
            </p>
            <p className={`${isDark ? "text-slate-200" : "text-slate-700"} mt-3 text-sm leading-relaxed`}>
              {product.description}
            </p>
          </div>
        </div>

        {/* Seller Contact Section */}
        <div className={`mt-6 border-t pt-4 ${isDark ? "border-slate-800/80" : "border-slate-200"}`}>
          <h3 className="text-lg font-semibold mb-2">Contact Seller</h3>
          <p className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Seller:
            </span>{" "}
            {product.seller?.name}
          </p>
          <p className={`text-sm mb-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            <span className={`font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              Email:
            </span>{" "}
            {product.seller?.email}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${product.seller?.email}?subject=Interested in ${product.name}`}
              className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-4 py-2 rounded-full hover:brightness-110 text-sm font-medium shadow-lg shadow-blue-900/40 transition"
            >
              Send Email
            </a>
            <a
              href={`sms:+${product.seller?.phone}?body=Hi, I'm interested in ${product.name}`}
              className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 text-sm font-medium shadow-lg shadow-emerald-900/40 transition"
            >
              Send SMS
            </a>
            <a
              href={`tel:+${product.seller?.phone}`}
              className="bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 text-sm font-medium shadow-lg shadow-amber-900/40 transition"
            >
              Call Seller
            </a>
            <button
              onClick={handleChat}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full hover:brightness-110 text-sm font-medium shadow-lg shadow-blue-900/40 transition"
            >
              Chat with Seller
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
