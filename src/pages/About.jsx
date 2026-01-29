export default function About({ theme = "dark" }) {
  const isDark = theme === "dark";
  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50"
          : "bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50 text-slate-900"
      }`}
    >
      <div className="w-full max-w-6xl animate-[fadeIn_0.6s_ease-out]">
        <div className="mb-8 text-center">
          <p
            className={`text-xs uppercase tracking-[0.35em] mb-3 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Platform Overview
          </p>
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${
              isDark
                ? "from-blue-400 via-sky-400 to-indigo-400"
                : "from-sky-500 via-blue-500 to-indigo-500"
            } bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]`}
          >
            About Broker Marketplace
          </h1>
          <p
            className={`mt-4 max-w-2xl mx-auto text-sm sm:text-base ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            A streamlined, real-time marketplace experience that keeps buyers and sellers
            in full control of how they communicate and close deals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10">
          <div
            className={`md:col-span-2 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.35)] border ${
              isDark
                ? "bg-slate-900/70 border-slate-800/80 shadow-slate-950/60"
                : "bg-white/80 border-slate-200 shadow-slate-900/10"
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              What is{" "}
              <span className={isDark ? "text-blue-400" : "text-sky-600"}>
                Broker
              </span>
              ?
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed mb-4 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <strong>Broker</strong> is a modern online marketplace platform that connects buyers
              and sellers directly — without involving delivery or payment gateways. Sellers can
              publish rich product listings including name, price, model, condition, location, and
              images; buyers can then search, explore, and contact them instantly.
            </p>
            <p
              className={`text-sm sm:text-base leading-relaxed mb-4 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              The platform is built using the <strong>MERN stack</strong> (MongoDB, Express, React,
              and Node.js) for web and React Native for mobile, ensuring a smooth and consistent
              experience across devices.
            </p>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Whether you are buying or selling, Broker focuses on clarity, speed, and trust.
              Real-time chat and direct contact options empower users to negotiate and finalize
              transactions on their own terms.
            </p>
          </div>

          <div className="space-y-4">
            <div
              className={`rounded-3xl p-5 shadow-xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.35)] border ${
                isDark
                  ? "bg-slate-900/70 border-slate-800/80 shadow-slate-950/60"
                  : "bg-white/80 border-slate-200 shadow-slate-900/10"
              }`}
            >
              <h3
                className={`text-sm font-semibold mb-2 tracking-wide ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Technology Stack
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Backend services powered by Node.js and Express with MongoDB as the data layer.
                The web client is built in React, while React Native provides a native-feeling
                mobile application.
              </p>
            </div>
            <div
              className={`rounded-3xl p-5 shadow-xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.35)] border ${
                isDark
                  ? "bg-slate-900/70 border-slate-800/80 shadow-slate-950/60"
                  : "bg-white/80 border-slate-200 shadow-slate-900/10"
              }`}
            >
              <h3
                className={`text-sm font-semibold mb-2 tracking-wide ${
                  isDark ? "text-slate-200" : "text-slate-800"
                }`}
              >
                Communication First
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Real-time chat, email, phone, and SMS options give buyers and sellers multiple
                channels to build trust and close deals faster.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(15,23,42,0.35)] border ${
            isDark
              ? "bg-slate-900/70 border-slate-800/80 shadow-slate-950/60"
              : "bg-white/80 border-slate-200 shadow-slate-900/10"
          }`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Key Capabilities
          </h2>
          <div
            className={`grid md:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            <ul className="space-y-2 list-disc list-inside">
              <li>Post detailed products with images, model, condition, and location.</li>
              <li>Browse and search listings by category, price range, or condition.</li>
              <li>Contact sellers directly through in-app chat, email, call, or SMS.</li>
            </ul>
            <ul className="space-y-2 list-disc list-inside">
              <li>Secure user authentication and profile management.</li>
              <li>Admin tools for managing users, products, and platform content.</li>
              <li>Responsive design optimized for both desktop and mobile devices.</li>
            </ul>
          </div>

          <p
            className={`mt-6 text-sm sm:text-base leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            <strong>Broker</strong> is designed as a final-year level project with industry-style
            architecture and UX. The focus is on a clean, trustworthy marketplace experience that
            can be extended with additional modules such as analytics, recommendations, or
            verification workflows.
          </p>
        </div>
      </div>
    </div>
  );
}
