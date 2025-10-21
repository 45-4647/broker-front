export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl p-10 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">About Broker</h1>

        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          <strong>Broker</strong> is a modern online marketplace platform that connects buyers and sellers
          directly — without involving delivery or payment systems. Our goal is to simplify product trading
          by allowing sellers to post detailed listings (including product name, price, model, location, condition,
          and images) while buyers can easily find and contact sellers through chat, email, call, or SMS.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          The platform is built using the <strong>MERN stack</strong> (MongoDB, Express, React, and Node.js)
          for the web and React Native for mobile — ensuring a fast, secure, and responsive experience across devices.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          Whether you're buying or selling, Broker helps you make better connections in a simple, trusted,
          and efficient way. With real-time communication via chat and direct contact options, our users
          can negotiate and finalize transactions quickly.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          <strong>Key Features:</strong>
        </p>
        <ul className="text-gray-700 leading-relaxed text-lg mb-6 list-disc list-inside space-y-2 text-left max-w-2xl mx-auto">
          <li>Post products with full details including images and location</li>
          <li>Browse and search products by category, price, or condition</li>
          <li>Direct communication with sellers via chat, email, call, or SMS</li>
          <li>User authentication and profile management</li>
          <li>Admin dashboard for managing products and users</li>
        </ul>

        <p className="text-gray-700 leading-relaxed text-lg">
          Broker is designed to create a seamless, trustworthy environment for trading products. We
          continuously work on improving the platform to make buying and selling easier, faster, and
          more transparent for everyone.
        </p>
      </div>
    </div>
  );
}
