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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/80 shadow-2xl shadow-slate-950/80 rounded-3xl p-6 sm:p-8 w-full max-w-lg sm:max-w-2xl border border-slate-800/80 backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
      >
        <h2 className="text-2xl font-semibold mb-1 text-center">Edit Product</h2>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Update details and images for your listing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            required
          />
          <input
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 p-2.5 rounded-2xl w-full mt-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
          rows="4"
        />

        <div className="mt-4">
          <label className="block mb-2 text-slate-200 font-medium text-sm">
            Product Image
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-full object-cover rounded-xl mb-2 border border-slate-700/70"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-slate-700/70 bg-slate-900/70 text-slate-100 p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:brightness-110 text-white p-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-900/40 transition"
        >
          Update Product
        </button>

        {msg && <p className="text-center mt-3 text-xs text-slate-400">{msg}</p>}
      </form>
    </div>
  );
}
