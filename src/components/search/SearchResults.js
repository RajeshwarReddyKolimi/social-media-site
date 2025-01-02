import React from "react";
import UserCardMin from "../posts/UserCardMin";

export default function SearchResults({ searchResults }) {
  return (
    <div>
      {searchResults?.map((user, id) => (
        <UserCardMin key={id} user={user} />
      ))}
    </div>
  );
}
