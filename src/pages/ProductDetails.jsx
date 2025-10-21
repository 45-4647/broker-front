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

  if (loading) return <p className="flex justify-center items-center h-screen">Loading product...</p>;
  if (!product) return <p className="flex justify-center items-center h-screen">Product not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl">
        {/* Product Info */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 flex justify-center items-center">
            {product.images?.length > 0 ? (
              <img
                src={`https://broker-back.onrender.com${product.images[0]}`}
                alt={product.name}
                className="rounded-xl object-cover w-full h-80 max-w-md"
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex justify-center items-center rounded-xl">
                <p className="text-gray-400">No Image</p>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Model:</span> {product.model || "N/A"}</p>
            <p className="text-blue-600 font-bold text-xl mb-2">${product.price}</p>
            <p className="text-sm text-gray-700"><span className="font-semibold">Category:</span> {product.category || "N/A"}</p>
            <p className="text-sm text-gray-700"><span className="font-semibold">Condition:</span> {product.condition}</p>
            <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Location:</span> {product.location}</p>
            <p className="text-gray-700 mt-3">{product.description}</p>
          </div>
        </div>

        {/* Seller Contact Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Contact Seller</h3>
          <p className="text-gray-700"><span className="font-semibold">Seller:</span> {product.seller?.name}</p>
          <p className="text-gray-700 mb-3"><span className="font-semibold">Email:</span> {product.seller?.email}</p>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${product.seller?.email}?subject=Interested in ${product.name}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send Email
            </a>
            <a
              href={`sms:+${product.seller?.phone}?body=Hi, I'm interested in ${product.name}`}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Send SMS
            </a>
            <a
              href={`tel:+${product.seller?.phone}`}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Call Seller
            </a>
            <button
              onClick={handleChat}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Chat with Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
