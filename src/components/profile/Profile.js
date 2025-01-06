import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import followersState from "../../atoms/followers";
import followingsState from "../../atoms/followings";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";
import Followers from "./Followers";
import Followings from "./Followings";
import "./index.css";
import LikedPosts from "./LikedPosts";
import MyPosts from "./MyPosts";
import SavedPosts from "./SavedPosts";

export default function Profile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const { logout, getCurrentUser, signup, signin } = useAuth();
  const [showItem, setShowItem] = useState("myPosts");
  const followers = useRecoilValue(followersState);
  const followings = useRecoilValue(followingsState);
  return (
    <div className="profile">
      <div className="profile-header">
        <img src={user?.image} />
        <h1>{user?.name}</h1>
      </div>
      <button onClick={logout}>Logout</button>

      <button onClick={() => setShowItem("followers")}>
        Followers {followers?.length}
      </button>
      <button onClick={() => setShowItem("following")}>
        Following {followings?.length}
      </button>
      <button onClick={() => setShowItem("myPosts")}>My Posts</button>
      <button onClick={() => setShowItem("savedPosts")}>Saved Posts</button>
      <button onClick={() => setShowItem("likedPosts")}>Liked Posts</button>
      {showItem === "followers" ? (
        <Followers />
      ) : showItem === "following" ? (
        <Followings />
      ) : showItem === "myPosts" ? (
        <MyPosts />
      ) : showItem === "savedPosts" ? (
        <SavedPosts />
      ) : (
        showItem === "likedPosts" && <LikedPosts />
      )}
    </div>
  );
}
