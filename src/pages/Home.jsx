import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";



export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Electronics",
    "Vehicles",
    "Real Estate",
    "Fashion",
    "Furniture",
    "Services",
    "Other",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let filteredList = products;

    // Filter by category
    if (category !== "All") {
      filteredList = filteredList.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name, model, or location
    if (search.trim() !== "") {
      filteredList = filteredList.filter((p) =>
        [p.name, p.model, p.location]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFiltered(filteredList);
  }, [category, search, products]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-600 text-center sm:text-left">
            Browse Products
          </h1>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by name, model or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg w-full sm:w-1/2"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition flex flex-col"
              >

                 {p.images && p.images.length > 0 ? (
              <img
                src={`https://broker-back.onrender.com${p.images[0]}`}
                alt={p.name}
                className="rounded-xl object-cover w-full h-80 max-w-md"
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex justify-center items-center rounded-xl">
                <p className="text-gray-400">No Image</p>
              </div>
            )}
                {/* <img
                  src={p.images && p.images[0] ? `http://localhost:4000/${p.images[0]}` : "/placeholder.png"}
                  alt={p.name}
                  className="h-48 w-full object-cover rounded-lg mb-4"
                /> */}
                <h2 className="text-xl font-semibold text-gray-800">{p.name}</h2>
                <p className="text-gray-600">{p.model}</p>
                <p className="font-bold text-blue-600 mt-1">${p.price}</p>
                <p className="text-gray-500 text-sm">{p.location}</p>

                <Link
                  to={`/product/${p._id}`}
                  className=" bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg py-2 mt-3"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 w-full col-span-full">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
