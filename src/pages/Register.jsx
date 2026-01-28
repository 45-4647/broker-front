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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800/80 p-8 rounded-3xl shadow-2xl shadow-slate-950/80 w-full max-w-sm backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.9)]">
        <h2 className="text-2xl font-semibold mb-1 text-center text-slate-50">Create account</h2>
        <p className="text-xs text-slate-400 mb-6 text-center">
          Join Broker as a buyer or seller to start trading.
        </p>
        <input className="w-full p-2.5 mb-2 border border-slate-700/70 rounded-2xl bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm" type="text" placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full p-2.5 mb-2 border border-slate-700/70 rounded-2xl bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm" type="email" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2.5 mb-2 border border-slate-700/70 rounded-2xl bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm" type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input className="w-full p-2.5 mb-2 border border-slate-700/70 rounded-2xl bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm" type="text" placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select className="w-full p-2.5 mb-4 border border-slate-700/70 rounded-2xl bg-slate-900/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm"
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="w-full bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 text-white p-2.5 rounded-full hover:brightness-110 text-sm font-semibold shadow-lg shadow-blue-900/40 transition">Register</button>
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

