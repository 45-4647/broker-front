import { useState } from "react";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "support@broker.com",
    href: "mailto:support@broker.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "+251 900 000 000",
    href: "tel:+251900000000",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Location",
    value: "Addis Ababa, Ethiopia",
    href: null,
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Working Hours",
    value: "Mon – Fri, 9am – 6pm EAT",
    href: null,
  },
];

const faqs = [
  { q: "How do I post a product?", a: "Register as a seller, go to Post Product, fill in the details, pay the 200 ETB promotion fee, and your listing goes live." },
  { q: "Is Broker free to use?", a: "Browsing and buying is completely free. Sellers pay a one-time 200 ETB listing fee per product." },
  { q: "How do I contact a seller?", a: "Open any product listing and use the Chat, Email, SMS, or Call buttons to reach the seller directly." },
  { q: "What payment methods are supported?", a: "We support Chapa (Telebirr, bank transfer) and Stripe (credit/debit card) for listing fees." },
];

export default function Contact({ theme = "dark" }) {
  const isDark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const bg = isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900";
  const card = isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";
  const input = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 ${
    isDark
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-blue-500/40 focus:border-blue-500"
      : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-blue-400/40 focus:border-blue-400"
  }`;
  const label = `block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`;

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-5 border ${isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            We're here to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">help</span>
          </h1>
          <p className={`text-base max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Have a question, feedback, or need support? Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 mb-16">

          {/* Contact info sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h2 className="font-bold text-base mb-5">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                      {c.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className={`text-sm font-medium hover:underline ${isDark ? "text-slate-200 hover:text-blue-400" : "text-slate-700 hover:text-blue-600"}`}>
                          {c.value}
                        </a>
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}>{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className={`rounded-2xl border p-6 ${card}`}>
              <h2 className="font-bold text-base mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Browse Products", href: "/", icon: "🛒" },
                  { label: "Post a Product", href: "/post-product", icon: "📦" },
                  { label: "View Profile", href: "/profile", icon: "👤" },
                ].map((l) => (
                  <a key={l.label} href={l.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-600"}`}>
                    <span>{l.icon}</span>
                    {l.label}
                    <svg className="w-3.5 h-3.5 ml-auto opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className={`lg:col-span-3 rounded-2xl border p-8 ${card}`}>
            <h2 className="font-bold text-base mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Your Name</label>
                  <input name="name" type="text" placeholder="Abebe Kebede" value={form.name} onChange={handleChange} required className={input} />
                </div>
                <div>
                  <label className={label}>Email Address</label>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required className={input} />
                </div>
              </div>

              <div>
                <label className={label}>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} required className={input}>
                  <option value="">Select a topic...</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing / Payment</option>
                  <option value="report">Report a Problem</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div>
                <label className={label}>Message</label>
                <textarea name="message" placeholder="Describe your question or issue in detail..." value={form.message} onChange={handleChange} required rows={5}
                  className={`${input} resize-none`} />
              </div>

              <button type="submit" disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                {loading ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className={`text-sm mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Quick answers to common questions.</p>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className={`rounded-2xl border overflow-hidden ${card}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold transition ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                >
                  <span>{f.q}</span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""} ${isDark ? "text-slate-400" : "text-slate-400"}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className={`px-6 pb-4 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
