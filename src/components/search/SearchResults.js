import React from "react";
import UserProfileCard from "../users/UserProfileCard";
import { Link } from "react-router";
import UserSearchCard from "../users/UserSearchCard";
import { Empty } from "antd";

export default function SearchResults({ searchResults }) {
  return (
    <div>
      {searchResults?.map((user, id) => (
        <UserSearchCard user={user} key={id} />
      ))}
      {searchResults?.length == 0 && (
        // <p className="empty-message">No results</p>
        <Empty
          description={false}
          style={{ description: { color: "white" } }}
        />
      )}
    </div>
  );
}
