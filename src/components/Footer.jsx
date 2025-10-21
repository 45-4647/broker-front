
export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Section 1: Brand Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Broker</h2>
          <p className="text-sm text-gray-200">
            Broker is a marketplace platform that connects sellers and buyers
            directly — post your product, find interested buyers, and make deals
            without intermediaries.
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-gray-300 transition">Home</a>
            </li>
            <li>
              <a href="/post-product" className="hover:text-gray-300 transition">Post Product</a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-300 transition">About</a>
            </li>
             
            <li>
              <a href="/contact" className="hover:text-gray-300 transition">Contact</a>
            </li>
           
            <li>
              <a href="/about" className="hover:text-gray-300 transition">About</a>
            </li>
          </ul>
        </div>

        {/* Section 3: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p className="text-sm text-gray-200">Email: support@broker.com</p>
          <p className="text-sm text-gray-200">Phone: +251 900 000 000</p>
          <p className="text-sm text-gray-200 mt-2">
            Location: Addis Ababa, Ethiopia
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-500 mt-8 pt-4 text-center text-sm text-gray-200">
        © {new Date().getFullYear()} Broker. All rights reserved.
      </div>
    </footer>
  );
}
