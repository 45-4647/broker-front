import { useEffect, useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
    //   console.log(token)
      if (!token) {
        alert("You must be logged in");
        navigate("/login");
        return;
      }

      try {
        // Get user info
        const resUser = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(resUser.data);

        // Get user's products
        const resProducts = await API.get("/products/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(resProducts.data);
      } catch (err) {
        console.error("Error loading profile:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      await API.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No user data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl">
        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
            <p className="text-gray-700 mb-1">{user.email}</p>
            <p className="text-sm text-gray-500">
              Joined on {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* User Products */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            Your Posted Products ({products?.length || 0})
          </h3>

          {products?.length === 0 ? (
            <p className="text-gray-600 text-sm">
              You haven’t posted any products yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-gray-50 rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col"
                >
                  {p.images?.length > 0 ? (
                    <img
                      src={`https://broker-back.onrender.com${p.images[0]}`}
                      alt={p.name}
                      className="rounded-lg h-40 object-cover mb-3"
                    />
                  ) : (
                    <div className="h-40 bg-gray-200 flex items-center justify-center rounded-lg mb-3">
                      <p className="text-gray-400 text-sm">No Image</p>
                    </div>
                  )}
                  <h4 className="font-semibold text-lg">{p.name}</h4>
                  <p className="text-gray-600 text-sm mb-1">{p.model || "—"}</p>
                  <p className="text-blue-600 font-bold mb-2">${p.price}</p>

                  <Link
                    to={`/edit-product/${p._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition text-sm mb-2 text-center"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="mt-auto bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
