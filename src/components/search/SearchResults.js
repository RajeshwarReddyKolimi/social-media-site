import React from "react";
import UserProfileCard from "../users/UserProfileCard";
import { Link } from "react-router";
import UserSearchCard from "../users/UserSearchCard";

export default function SearchResults({ searchResults }) {
  return (
    <div>
      {searchResults?.map((user, id) => (
        <UserSearchCard user={user} key={id} />
      ))}
    </div>
  );
}
