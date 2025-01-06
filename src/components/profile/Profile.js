import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import followersState from "../../atoms/followers";
import followingsState from "../../atoms/followings";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import Followers from "./Followers";
import Followings from "./Followings";
import "./index.css";
import MyPosts from "./MyPosts";

export default function Profile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [showItem, setShowItem] = useState("myPosts");
  const followers = useRecoilValue(followersState);
  const followings = useRecoilValue(followingsState);
  return (
    <div className="profile">
      <div className="profile-header">
        <img src={user?.image} />
        <h1>{user?.name}</h1>
      </div>
      <div className="profile-button-container">
        <button
          onClick={() => setShowItem("followers")}
          className={`profile-button ${
            showItem == "followers" && "profile-button-selected"
          }`}
        >
          <span>Followers</span>
          <span>{followers?.length}</span>
        </button>
        <button
          onClick={() => setShowItem("followings")}
          className={`profile-button ${
            showItem == "followings" && "profile-button-selected"
          }`}
        >
          <span>Following</span>
          <span>{followings?.length}</span>
        </button>

        <button
          onClick={() => setShowItem("myPosts")}
          className={`profile-button ${
            showItem == "myPosts" && "profile-button-selected"
          }`}
        >
          <span>Posts</span>
          <span>{user?.posts?.length}</span>
        </button>
      </div>
      {showItem === "followers" ? (
        <Followers />
      ) : showItem === "followings" ? (
        <Followings />
      ) : (
        showItem === "myPosts" && <MyPosts />
      )}
    </div>
  );
}
