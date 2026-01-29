import { useState } from "react";

export default function Contact({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg("Thank you for contacting us! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-10 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"
      }`}
    >
      <div
        className={`shadow-2xl rounded-3xl border p-8 w-full max-w-lg backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.25)] ${
          isDark
            ? "bg-slate-900/80 shadow-slate-950/80 border-slate-800/80"
            : "bg-white/80 shadow-slate-900/10 border-slate-200"
        }`}
      >
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className={`text-xs mb-6 text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Have a question or feedback about Broker? Send us a message.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${
              isDark
                ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            }`}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${
              isDark
                ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            }`}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className={`border p-2.5 rounded-2xl w-full h-32 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 ${
              isDark
                ? "border-slate-700/70 bg-slate-900/70 text-slate-100 placeholder:text-slate-500"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            }`}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500 hover:brightness-110 text-white p-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-900/40 transition"
          >
            Send Message
          </button>
        </form>

        {msg && (
          <p className={`text-center mt-4 text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
