import { useEffect, useState } from "react";

export default function ProductFeed() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filterOptions = [
    { key: 0, title: "All", value: null },
    { key: 1, title: "Phones", value: 2 },
    { key: 2, title: "Laptops", value: 1 },
    { key: 3, title: "Accessories", value: 3 },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    setHasSearched(true);

    let url = "https://com629-y3-ae2.onrender.com/search/products";
    let params = [];

    if (keyword !== "") {
      params.push("keyword=" + keyword);
    }

    if (selectedCategory !== null) {
      params.push("category=" + selectedCategory);
    }

    if (minPrice !== "") {
      params.push("minPrice=" + minPrice);
    }

    if (maxPrice !== "") {
      params.push("maxPrice=" + maxPrice);
    }

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    try {
      const res = await fetch(url);
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setProducts([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const rating =
  Array.isArray(products) && products.length > 0
    ? (
        products.reduce((sum, p) => sum + (p.avg_rate || 0), 0) /
        products.length
      ).toFixed(1)
    : null;

const rateNumber =
  Array.isArray(products)
    ? products.reduce((sum, p) => sum + (p.c_rate || 0), 0)
    : 0;

    return (
  <div className="p-5 flex flex-col gap-6">
    
    <h1 className="text-2xl font-bold">
      Product Search
    </h1>

    <div className="flex gap-6">

      <div className="w-64 flex-shrink-0">
        <h2 className="font-semibold mb-2">Filters</h2>

        <div className="mb-4">
          {filterOptions.map((f) => {
            const isSelected = selectedCategory === f.value;

            return (
              <button
                key={f.key}
                onClick={() => setSelectedCategory(f.value)}
                className={`
                  block w-full mb-2 px-3 py-1 border rounded
                  border-[#05339C] transition
                  ${isSelected
                    ? "bg-white text-[#05339C]"
                    : "bg-[#05339C] text-white hover:opacity-80"
                  }
                `}
              >
                {f.title}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />

          <button
            onClick={fetchProducts}
            className="bg-[#05339C] text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="flex-1">

        <h2 className="sr-only">Search results</h2>

        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchProducts();
            }}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />

          <button
            onClick={fetchProducts}
            className="bg-[#05339C] text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        <button
          onClick={() => {
            setKeyword("");
            setSelectedCategory(null);
            setMinPrice("");
            setMaxPrice("");
            fetchProducts();
          }}
          className="mt-4 bg-gray-200 text-[#05339C] px-4 py-2 rounded border border-[#05339C]"
        >
          Reset
        </button>

        <div className="mt-4">
          {loading && <p>Loading...</p>}

          {!loading && (
            <>
              {products.length === 0 && (
                <p className="text-gray-500">No results</p>
              )}

              {hasSearched && products.length > 0 && (
                <div className="mb-4">
                  <p className="text-[#05339C] font-semibold">
                    ⭐ {rating ?? "No rating"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {rateNumber} reviews
                  </p>
                </div>
              )}

              {products.map((p, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded p-3 mt-3"
                >
                  <h3 className="font-semibold text-lg">{p.product_name}</h3>
                  <p>£{p.price}</p>
                  <p className="text-gray-500 text-sm">{p.seller_name}</p>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  </div>
);}