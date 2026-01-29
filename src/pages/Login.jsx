// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [msg, setMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const res = await API.post("/auth/login", form);
      
//       const { token, user } = res.data;

//       // Save auth data
//       // console.log(token)
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       setMsg("Login successful!");
//       // Redirect after login
//       setTimeout(() => navigate("/"), 1000);
//     } catch (err) {
       
//       setMsg(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-xl shadow-md w-80"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
//         <input
//           className="w-full p-2 mb-3 border rounded"
//           type="email"
//           placeholder="Email"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           className="w-full p-2 mb-3 border rounded"
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Login
//         </button>
//         <p className="text-center text-sm mt-3 text-gray-600">{msg}</p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify

export default function Login({ theme = "dark" }) {
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Show success toast
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000, // Adjust as needed
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect after login
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      // Show error toast
      toast.error(err.response?.data?.message || "Login failed", {
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
    <div
      className={`flex justify-center items-center min-h-screen px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-3xl shadow-2xl w-full max-w-sm backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.25)] border ${
          isDark
            ? "bg-slate-900/80 border-slate-800/80 shadow-slate-950/80"
            : "bg-white/80 border-slate-200 shadow-slate-900/10"
        }`}
      >
        <h2 className="text-2xl font-semibold mb-1 text-center">
          Welcome back
        </h2>
        <p className={`text-xs mb-6 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Sign in to continue to your Broker account.
        </p>
        <input
          className={`w-full p-2.5 mb-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm ${
            isDark
              ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className={`w-full p-2.5 mb-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 text-sm ${
            isDark
              ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 text-white p-2.5 rounded-full hover:brightness-110 text-sm font-semibold shadow-lg shadow-blue-900/40 transition"
        >
          Login
        </button>
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
