
export default function Footer({ theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <footer
      className={`pt-6 pb-6 border-t ${
        isDark
          ? "bg-slate-950/95 text-slate-200 border-slate-800/80"
          : "bg-white text-slate-700 border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Section 1: Brand Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            <span
              className={
                isDark
                  ? "bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent"
              }
            >
              Broker
            </span>
          </h2>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Broker is a marketplace platform that connects sellers and buyers
            directly — post your product, find interested buyers, and make deals
            without intermediaries.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className={`transition ${
                  isDark ? "hover:text-sky-400" : "hover:text-sky-600"
                }`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/post-product"
                className={`transition ${
                  isDark ? "hover:text-sky-400" : "hover:text-sky-600"
                }`}
              >
                Post Product
              </a>
            </li>
            <li>
              <a
                href="/about"
                className={`transition ${
                  isDark ? "hover:text-sky-400" : "hover:text-sky-600"
                }`}
              >
                About
              </a>
            </li>
             
            <li>
              <a
                href="/contact"
                className={`transition ${
                  isDark ? "hover:text-sky-400" : "hover:text-sky-600"
                }`}
              >
                Contact
              </a>
            </li>
           
            <li>
              <a
                href="/about"
                className={`transition ${
                  isDark ? "hover:text-sky-400" : "hover:text-sky-600"
                }`}
              >
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Email: support@broker.com
          </p>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Phone: +251 900 000 000
          </p>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Location: Addis Ababa, Ethiopia
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 mt-8 pt-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Broker. All rights reserved.
      </div>
    </footer>
  );
}
