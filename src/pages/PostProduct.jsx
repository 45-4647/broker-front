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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md sm:max-w-lg lg:max-w-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Post Product</h2>

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

        {/* Image upload */}
        <div className="mt-4">
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 rounded-lg shadow-md w-40 h-40 object-cover mx-auto"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
        >
          Post Product
        </button>

        {msg && <p className="text-center mt-3 text-sm text-gray-600">{msg}</p>}
      </form>
    </div>
  );
}
