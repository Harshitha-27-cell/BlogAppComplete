import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://blogappcomplete.onrender.com/user-api/articles/search/${search}`
      );

      console.log("API Response:", res.data);

      // safe handling
      setResults(res.data.payload || []);
    } catch (err) {
      console.log(err);
      setResults([]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Search Articles
      </h2>

      {/* 🔍 Search Box */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* 📄 Results */}
      <div>
        {results?.length > 0 ? (
          results.map((article) => (
            <div
              key={article._id}
              style={{
                border: "1px solid #e0e0e0",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "10px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{article.title}</h3>
              <p style={{ color: "#555" }}>
                {article.content?.slice(0, 100)}...
              </p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            No results found
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;