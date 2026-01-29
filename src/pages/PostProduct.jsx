import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PostProduct({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate=useNavigate()
  
  const user = JSON.parse(localStorage.getItem("user"));

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
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState("");
 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // preview image before upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }
      if (image) formData.append("image", image);

      const res = await API.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMsg("✅ Product posted successfully!");
      console.log(res.data);

      // Reset form
      setForm({
        name: "",
        model: "",
        price: "",
        category: "",
        condition: "New",
        location: "",
        description: "",
      });
      setImage(null);
      setPreview(null);
      navigate("/")
    } catch (error) {
      setMsg("❌ Error posting product");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "seller") {
      alert("This resource is not authorized");
      navigate("/"); // redirect to home page
    }
  }, [user, navigate]);
  return (
    <div className={`min-h-screen p-4 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50" : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"}`}>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-8 mb-6 shadow-2xl ${isDark ? "bg-slate-900/60 border-slate-800/80 shadow-slate-950/70" : "bg-white/70 border-slate-200 shadow-slate-900/10"}`}>
          <p className={`text-xs uppercase tracking-[0.35em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Seller</p>
          <h1 className={`mt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r ${isDark ? "from-blue-400 via-sky-400 to-indigo-400" : "from-sky-600 via-blue-600 to-indigo-600"} bg-clip-text text-transparent`}>
            Post a Product
          </h1>
          <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Create a clean listing with accurate details to attract the right buyers.
          </p>
        </div>

      <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className={`shadow-2xl rounded-3xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg lg:max-w-2xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 border ${isDark ? "bg-slate-900/80 shadow-slate-950/80 border-slate-800/80 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]" : "bg-white/80 shadow-slate-900/10 border-slate-200 hover:shadow-[0_25px_80px_rgba(15,23,42,0.18)]"}`}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold mb-1 text-center">Post Product</h2>
        <p className={`text-xs mb-6 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Share a new item with buyers on Broker.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            required
          />
          <input
            name="model"
            placeholder="Model"
            value={form.model}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
          />
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className={`border p-2.5 rounded-2xl w-full mt-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500" : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"}`}
          rows="4"
        />

        {/* Image upload */}
        <div className="mt-4">
          <label className={`block font-medium mb-1 text-sm ${isDark ? "text-slate-200" : "text-slate-700"}`}>
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`w-full border p-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${isDark ? "border-slate-700/70 bg-slate-900/70 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 rounded-xl shadow-md w-40 h-40 object-cover mx-auto border border-slate-700/70"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:brightness-110 text-white p-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-900/40 transition"
        >
          Post Product
        </button>

        {msg && <p className={`text-center mt-3 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>{msg}</p>}
      </form>
      </div>
      </div>
    </div>
  );
}
