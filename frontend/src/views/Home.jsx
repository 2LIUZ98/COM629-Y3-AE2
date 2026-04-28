import { useEffect, useState } from "react";
import ResetButtons from "../components/filterApplyButton";

export default function ProductFeed() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const filterOptions = [
    { key: 0, title: "All", value: null },
    { key: 1, title: "Phones", value: 2 },
    { key: 2, title: "Laptops", value: 1 },
    { key: 3, title: "Accessories", value: 3 },
  ];

  const checkTag = (value) => {
  setSelectedTags((prev) =>
    prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value]
    );
  };

  const fetchTags = async () => {
    try {
      const res = await fetch("https://com629-y3-ae2.onrender.com/all/tags");
      const data = await res.json();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTags([]);
    }
  };

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

    if (selectedTags.length > 0) {
      params.push("tags=" + selectedTags.join(","));
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
    fetchTags()
    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, selectedTags]);

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

  const handleSearch = () => {
      setHasSearched(true);
      fetchProducts();
    };   

    const handleReset = async () => {
      setKeyword("");
      setSelectedCategory(null);
      setMinPrice("");
      setMaxPrice("");
      setSelectedTags([]);
      setHasSearched(false);

      setTimeout(() => {
        fetchProducts();
      }, 0);
    };

    return (
  <div className="p-5 flex flex-col gap-6">

    <h1 className="text-2xl font-bold">
      Product Search System with Filtering Options
    </h1>

    <div className="flex gap-6">
      <h2 className="font-semibold mb-2">Filters</h2>

      <div className="w-64 flex-shrink-0">
        <div className="mb-4">
          <button
            onClick={() => {
              setKeyword("");
              setSelectedCategory(null);
              setMinPrice("");
              setMaxPrice("");
              setSelectedTags([]);
              fetchProducts();
            }}
            className="w-full bg-white text-[#05339C] px-3 py-2 rounded border border-[#05339C] 
                      transition hover:bg-[#05339C] hover:text-white"
          >
            Reset All Filters
          </button>
        </div>

        <h2 className="font-semibold mb-2">Categories</h2>

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
                    ? "bg-[#05339C] text-white"
                    : "bg-white text-[#05339C] hover:bg-gray-100"
                  }
                `}
              >
                {f.title}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold mb-2">Price</h2>
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

          <ResetButton
            onReset={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold mb-2">Tags</h2>
          <div className="mb-4 flex flex-col gap-2">
            {tags.map((tag) => {
              const isChecked = selectedTags.includes(tag.tag_id);

              return (
                <label
                  key={tag.tag_id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => checkTag(tag.tag_id)}
                    className="accent-[#05339C] w-4 h-4"
                  />

                  <span className="text-[#05339C]">
                    {tag.tag_name}
                  </span>
                </label>
              );
            })}
          </div>
          <ResetButton
            onReset={() => {
              setSelectedTags([]);
            }}
          />
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
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />

          <button
            onClick={handleSearch}
            className="bg-[#05339C] text-white px-4 py-2 rounded border border-[#05339C] transition hover:bg-white hover:text-[#05339C]"
          >
            Search
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {hasSearched && products.length > 0 && (
            <div className="text-right">
              <p className="text-[#05339C] font-semibold">
                ⭐ {rating ?? "No rating"}
              </p>
              <p className="text-gray-600 text-sm">
                {rateNumber} reviews
              </p>
            </div>
          )}

          <p className="text-gray-600 text-sm">
            {products.length} results
          </p>

          <button
            onClick={() => {
              handleReset();
            }}
            className="bg-white text-[#05339C] px-4 py-2 rounded border border-[#05339C] hover:bg-[#05339C] hover:text-white transition"
          >
            Reset
          </button>

        </div>

        <div className="mt-4">
          {loading && <p>Loading...</p>}

          {!loading && (
            <>
              {products.length === 0 && (
                <p className="text-gray-500">No results</p>
              )}

              {products.map((p, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded p-3 mt-3 flex gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{p.product_name}</h3>

                    <p className="text-gray-800">£{p.price}</p>

                    <p className="text-gray-500 text-sm">{p.seller_name}</p>
                  </div>

                  <div className="w-40 text-sm flex justify-between items-start">
                    
                    <div>
                      {p.stock > 0 ? (
                        <p className="text-green-700">
                          Stock available
                        </p>
                      ) : (
                        <p className="text-red-500 font-semibold">
                          No stock available!
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-gray-700">
                        Stock: {p.stock ?? 0}
                      </p>

                      <div className="mt-2 text-[#05339C]">
                        ⭐ {p.avg_rate ? Number(p.avg_rate).toFixed(1) : "No rating"}
                        <span className="text-gray-500 block">
                          ({p.c_rate || 0} reviews)
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="w-40 text-sm text-gray-600">
                    {p.attributes?.length > 0 ? (
                      p.attributes.map((a, idx) => (
                        <div key={idx}>
                          <span className="font-semibold">{a.name}:</span>{" "}
                          {a.value}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No attributes</span>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  </div>
);}