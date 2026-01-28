import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function PostProduct() {
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 text-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900/80 shadow-2xl shadow-slate-950/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg lg:max-w-2xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold mb-1 text-center">Post Product</h2>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Share a new item with buyers on Broker.
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

        {/* Image upload */}
        <div className="mt-4">
          <label className="block font-medium mb-1 text-sm text-slate-200">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-slate-700/70 bg-slate-900/70 text-slate-100 p-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
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

        {msg && <p className="text-center mt-3 text-xs text-slate-400">{msg}</p>}
      </form>
    </div>
  );
}
