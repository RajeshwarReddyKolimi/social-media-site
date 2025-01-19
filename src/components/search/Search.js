import React, { useState } from "react";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import "./index.css";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <section className="search-container">
      <SearchInput setSearchResults={setSearchResults} />
      <SearchResults searchResults={searchResults} />
    </section>
  );
}
