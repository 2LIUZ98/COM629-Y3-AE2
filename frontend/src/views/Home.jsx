import { useEffect, useState } from "react";

export default function ProductFeed() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const filterOptions = [
    { key: 0, title: "All", value: null },
    { key: 1, title: "Phones", value: 2 },
    { key: 2, title: "Laptops", value: 1 },
    { key: 3, title: "Accessories", value: 3 },
  ];

  const fetchProducts = async () => {
    setLoading(true);

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
    <div style={{ padding: 20 }}>
      <h1>Product Search</h1>
      <h2 className="sr-only">Search results</h2>

      <input
        type="text"
        placeholder="Search..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchProducts();
          }
        }}
      />

      <button onClick={fetchProducts}>Search</button>

      <div style={{ marginTop: 10 }}>
        {filterOptions.map((f) => {
          return (
            <button
              key={f.key}
              onClick={() => setSelectedCategory(f.title)}
              style={{
                marginRight: 5,
                background: selectedCategory === f.title ? "black" : "gray",
                color: "#05339C",
              }}
            >
              {f.title}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <button onClick={fetchProducts}>Apply</button>
      </div>

      <button
        onClick={() => {
          setKeyword("");
          setSelectedCategory(null);
          setMinPrice("");
          setMaxPrice("");
        }}
        style={{ marginTop: 10 }}
      >
        Reset
      </button>

      {loading && <p>Loading...</p>}

      {!loading && (
        <div>
          {products.length === 0 && <p>No results</p>}
          
          {products.length > 0 && (
           <>
            <p>⭐ {rating ?? "No rating"}</p>
            <p>{rateNumber} reviews</p>
          </>
          )}

          {products.map((p, i) => {
            return (
              <div key={i} style={{ border: "1px solid #ccc", marginTop: 10 }}>
                <h3>{p.product_name}</h3>
                <p>£{p.price}</p>
                <p>{p.seller_name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}