import React, { useState } from "react";
import { supabase } from "../../config/supabase";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";

export default function SearchInput({ setSearchResults }) {
  const [searchInput, setSearchInput] = useState("");
  const user = useRecoilValue(userState);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .ilike("name", `%${searchInput}%`)
        .neq("id", user?.id)
        .limit(10);
      setSearchResults(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" onChange={(e) => setSearchInput(e.target.value)} />
        <button typoe="submit">Search</button>
      </form>
    </div>
  );
}
