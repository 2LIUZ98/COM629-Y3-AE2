import { useEffect, useState } from "react";

export default function ProductFeed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filterOptions = [
    { key: 0, title: "All", value: null },
    { key: 1, title: "Phones", value: 1 },
    { key: 2, title: "Laptops", value: 2 },
    { key: 3, title: "Accessories", value: 3 },
  ];

  const buildQuery = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (selectedCategory) params.append("category", selectedCategory);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    return params.toString();
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const query = buildQuery();
      const url = `http://localhost:3000/search/products${
        query ? `?${query}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = async (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Product Search</h1>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchProducts();
          }}
          style={{ padding: 8, width: 250 }}
        />

        <button onClick={fetchProducts} style={{ marginLeft: 10 }}>
          Search
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilter(f.value)}
            style={{
              marginRight: 10,
              padding: "6px 12px",
              background:
                selectedCategory === f.value ? "#333" : "#ddd",
              color:
                selectedCategory === f.value ? "#fff" : "#000",
            }}
          >
            {f.title}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 15 }}>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ padding: 5, marginRight: 10 }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ padding: 5, marginRight: 10 }}
        />

        <button onClick={fetchProducts}>Apply Price</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => {
            setKeyword("");
            setSelectedCategory(null);
            setMinPrice("");
            setMaxPrice("");
            fetchProducts();
          }}
        >
          Reset Filters
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.length === 0 ? (
            <p>No results found</p>
          ) : (
            products.map((p, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  marginBottom: 10,
                  padding: 10,
                }}
              >
                <h3>{p.product_name}</h3>
                <p>Price: £{p.price ?? "N/A"}</p>
                <p>Seller: {p.seller_name ?? "N/A"}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}