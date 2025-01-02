import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import { supabase } from "../../config/supabase";
import UserCardMin from "../posts/UserCardMin";
import followingsState from "../../atoms/followings";

export default function Followers() {
  const followings = useRecoilValue(followingsState);
  return (
    <div>
      {followings?.map((user, id) => (
        <UserCardMin user={user?.User} key={id} />
      ))}
    </div>
  );
}
