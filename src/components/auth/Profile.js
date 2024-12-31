import React, { useEffect } from "react";
import "./index.css";
import useAuth from "../../hooks/useAuth";
import Signin from "./Signin";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";
import Loader from "../../utils/loader/Loader";
import loadingState from "../../atoms/loadingState";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const { logout, getCurrentUser, signup, signin } = useAuth();
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
    </div>
  );
}
