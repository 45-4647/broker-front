import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    model: "",
    price: "",
    category: "",
    condition: "New",
    location: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // For showing current or new image
  const [msg, setMsg] = useState("");

  // Fetch product data on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/products/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setPreview(`http://localhost:4000${res.data.images[0]}`);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setMsg("Failed to load product data");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file)); // Preview new image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      for (const key in form) formData.append(key, form[key]);
      if (image) formData.append("image", image);

      await API.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("Product updated successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Error updating product:", err);
      setMsg("Failed to update product");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg sm:max-w-2xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Product</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded w-full mt-4"
          rows="4"
        />

        <div className="mt-4">
          <label className="block mb-2 text-gray-700 font-medium">
            Product Image
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-full object-cover rounded-lg mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
        >
          Update Product
        </button>

        {msg && <p className="text-center mt-3 text-sm text-gray-600">{msg}</p>}
      </form>
    </div>
  );
}
