import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";
import "./profile.css";
import MyPosts from "./MyPosts";
import SavedPosts from "./SavedPosts";
import LikedPosts from "./LikedPosts";

export default function Profile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const { logout, getCurrentUser, signup, signin } = useAuth();
  const [showItem, setShowItem] = useState("myPosts");
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading]);
  return (
    <div className="profile">
      <div className="profile-header">
        <img src={user?.image} />
        <h1>{user?.name}</h1>
      </div>
      <button onClick={logout}>Logout</button>

      <button onClick={() => setShowItem("myPosts")}>My Posts</button>
      <button onClick={() => setShowItem("savedPosts")}>Saved Posts</button>
      <button onClick={() => setShowItem("likedPosts")}>Liked Posts</button>
      {showItem === "myPosts" ? (
        <MyPosts />
      ) : showItem === "savedPosts" ? (
        <SavedPosts />
      ) : (
        showItem === "likedPosts" && <LikedPosts />
      )}
    </div>
  );
}
