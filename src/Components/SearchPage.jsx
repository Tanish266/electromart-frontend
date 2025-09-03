import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get the search query from the URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q");
  };

  useEffect(() => {
    const query = getSearchQuery();
    if (query) {
      setLoading(true);
      const token = localStorage.getItem("token"); // login ke baad save hota hai

      fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${query}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setSearchResults(data))
        .catch((err) => console.error("Search error:", err))
        .finally(() => setLoading(false));
    }
  }, [location.search]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Results for: {getSearchQuery()}</h2>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : searchResults.length > 0 ? (
        <div className="search-grid">
          {searchResults.map((item) => (
            <div
              key={item.id}
              className="search-card"
              onClick={() =>
                navigate(`/Single-Product-View/${item.Category}/${item.id}`)
              }
            >
              <img
                src={
                  item.MainImage
                    ? `${import.meta.env.VITE_API_URL}/p_image/${
                        item.MainImage
                      }`
                    : "/placeholder.png"
                }
                alt={item.ProductName}
                className="search-image"
              />
              <h3>{item.ProductName}</h3>
              {item.Price && <p>₹{item.Price}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchPage;
