import React, { useState } from "react";
import { supabase } from "../../config/supabase";

export default function SearchInput({ setSearchResults }) {
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = async (e) => {
    // e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .ilike("name", `%${e.target.value}%`)
        .limit(10);
      setSearchResults(data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" onChange={handleSearch} />
        <button typoe="submit">Search</button>
      </form>
    </div>
  );
}
