import React, { useEffect } from "react";
import "./index.css";
import useAuth from "../../hooks/useAuth";
import Signin from "./Signin";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";

export default function Profile() {
  const [user, setUser] = useRecoilState(userState);
  console.log(user);
  const { logout, getCurrentUser, signup, signin, currentUser } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  useEffect(() => {
    if (!user) {
      navigate("/signin");
    }
  }, [user]);
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
