import { useEffect, useState } from "react";

export default function ProductFeed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [tag, setTag] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const buildQuery = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (tag) params.append("tag", tag);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    return params.toString();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const query = buildQuery();
      const url = `http://localhost:3000/all/products${query ? `?${query}` : ""}`;

      const res = await fetch(url);
      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Product Search</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchProducts();
          }}
          className="border p-2 flex-1"
        />

        <button
          onClick={fetchProducts}
          className="bg-blue-500 text-white px-4"
        >
          Search
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Tag ID"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={fetchProducts}
          className="bg-green-500 text-white px-4"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.map((p, index) => (
            <div key={index} className="border p-3 mb-2">
              <h2 className="font-bold">{p.product_name}</h2>
              <p>Price: £{p.price}</p>
              <p>Seller: {p.seller_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}