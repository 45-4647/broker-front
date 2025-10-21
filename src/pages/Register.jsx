import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer", phone: "0937184393" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);

      // Show success toast
      toast.success("Registered successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate("/login");
    } catch (err) {
      // Show error toast
      toast.error(err.response?.data?.message || "Error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full p-2 mb-2 border rounded" type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 mb-2 border rounded" type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="w-full p-2 mb-2 border rounded" type="text" placeholder="phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
      </form>

      {/* Toast container (important to have only one) */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

