import React from "react";
import { useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import UserPostCard from "./UserPostCard";

export default function Followers() {
  const followings = useRecoilValue(followingsState);
  return (
    <div>
      {followings?.map((user, id) => (
        <UserPostCard user={user?.User} key={id} />
      ))}
    </div>
  );
}
