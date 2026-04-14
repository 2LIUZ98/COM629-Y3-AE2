import { useEffect, useState } from "react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/search");
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/search/products?keyword=${keyword}`
      );
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setKeyword("");
    fetchAllProducts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Product Search</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: 8, width: 250, marginRight: 10 }}
        />

        <button onClick={handleSearch}>Search</button>

        <button onClick={handleReset} style={{ marginLeft: 10 }}>
          Reset
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {products.map((p, i) => (
        <div key={i} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{p.product_name}</h3>
          <p>£{p.price ?? "N/A"}</p>
          <p>£{p.seller_name ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );
}