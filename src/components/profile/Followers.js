import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import UserPostCard from "./UserPostCard";
import followersState from "../../atoms/followers";

export default function Followers() {
  const followers = useRecoilValue(followersState);
  return (
    <div>
      {followers?.map((user, id) => (
        <UserPostCard user={user?.User} key={id} />
      ))}
    </div>
  );
}
