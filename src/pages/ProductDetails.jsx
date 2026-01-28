import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";


export default function ProductDetails() {
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

  if (loading) return <p className="flex justify-center items-center h-screen text-slate-300 bg-slate-950">Loading product...</p>;
  if (!product) return <p className="flex justify-center items-center h-screen text-slate-300 bg-slate-950">Product not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex flex-col items-center text-slate-50">
      <div className="bg-slate-900/80 shadow-2xl shadow-slate-950/80 rounded-3xl border border-slate-800/80 p-6 sm:p-8 w-full max-w-4xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
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
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-slate-400 mb-1"><span className="font-semibold text-slate-200">Model:</span> {product.model || "N/A"}</p>
            <p className="text-sky-400 font-bold text-xl mb-2">${product.price}</p>
            <p className="text-sm text-slate-300"><span className="font-semibold text-slate-200">Category:</span> {product.category || "N/A"}</p>
            <p className="text-sm text-slate-300"><span className="font-semibold text-slate-200">Condition:</span> {product.condition}</p>
            <p className="text-sm text-slate-300 mb-2"><span className="font-semibold text-slate-200">Location:</span> {product.location}</p>
            <p className="text-slate-200 mt-3 text-sm leading-relaxed">{product.description}</p>
          </div>
        </div>

        {/* Seller Contact Section */}
        <div className="mt-6 border-t border-slate-800/80 pt-4">
          <h3 className="text-lg font-semibold mb-2">Contact Seller</h3>
          <p className="text-slate-300 text-sm"><span className="font-semibold text-slate-200">Seller:</span> {product.seller?.name}</p>
          <p className="text-slate-300 text-sm mb-3"><span className="font-semibold text-slate-200">Email:</span> {product.seller?.email}</p>

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
  );
}
