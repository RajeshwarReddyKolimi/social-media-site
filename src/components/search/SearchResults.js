import React from "react";
import UserPostCard from "../profile/UserPostCard";
import { Link } from "react-router";

export default function SearchResults({ searchResults }) {
  return (
    <div>
      {searchResults?.map((user, id) => (
        <Link to={`/user/${user?.id}`} key={id}>
          <UserPostCard user={user} />
        </Link>
      ))}
    </div>
  );
}
