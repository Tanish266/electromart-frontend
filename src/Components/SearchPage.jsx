import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (query) {
      console.log("Searching for:", query);
      fetch(`/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setSearchResults(data))
        .catch((err) => console.error(err));
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for: {query}</h2>
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
  );
};

export default SearchPage;
