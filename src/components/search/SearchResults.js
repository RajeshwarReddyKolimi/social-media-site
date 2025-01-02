import React from "react";
import UserCardMin from "../posts/UserCardMin";
import { Link } from "react-router";

export default function SearchResults({ searchResults }) {
  return (
    <div>
      {searchResults?.map((user, id) => (
        <Link to={`/user/${user?.id}`} key={id}>
          <UserCardMin user={user} />
        </Link>
      ))}
    </div>
  );
}
