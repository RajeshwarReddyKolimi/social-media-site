import React, { useState } from "react";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  return (
    <div>
      <SearchInput setSearchResults={setSearchResults} />
      <SearchResults searchResults={searchResults} />
    </div>
  );
}
