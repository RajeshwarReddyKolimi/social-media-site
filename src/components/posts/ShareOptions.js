import React, { useState } from "react";
import { useRecoilState } from "recoil";
import followersState from "../../atoms/followers";
import followingsState from "../../atoms/followings";
import UserSharePostCard from "../users/UserSharePostCard";

export default function ShareOptions({ handleSharePost, setShowShareOptions }) {
  const [followings, setShowFollowings] = useRecoilState(followingsState);
  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target.className != "overlay") return;
        setShowShareOptions(false);
      }}
    >
      <div className="share-container">
        <h1>Share</h1>
        <div className="share">
          {followings?.map((following, id) => (
            <UserSharePostCard
              key={id}
              user={following}
              handleSharePost={handleSharePost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
