import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  // Function to get the search query from the URL
  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q");
  };

  useEffect(() => {
    const query = getSearchQuery();
    if (query) {
      console.log("Searching for:", query);
      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((err) => console.error(err));
    }
  }, [location.search]);

  return (
    <div>
      <h2>Search Results for: {getSearchQuery()}</h2>
      <div>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
