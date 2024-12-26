import React, { useEffect } from "react";
import "./index.css";
import useAuth from "../../hooks/useAuth";
import Signin from "./Signin";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";
import Loader from "../../utils/loader/Loader";
import loadingState from "../../atoms/loadingState";

export default function Profile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const { logout, getCurrentUser, signup, signin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user, loading]);
  return (
    <div className="profile">
      <h1>Profile</h1>
      <button onClick={signup}>signup</button>
      <button onClick={signin}>signin</button>
      <button onClick={getCurrentUser}>getCurrentUser</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
