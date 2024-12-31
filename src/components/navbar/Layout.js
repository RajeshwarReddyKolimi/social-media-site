import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import "./navbar.css";
import { useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import Loader from "../../utils/loader/Loader";
import userState from "../../atoms/userState";
import { useEffect } from "react";

export default function Layout() {
  const loading = useRecoilValue(loadingState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!user) {
      navigate(`/signin?redirect=${location?.pathname}`);
    }
  }, [user]);

  if (loading !== 0) return <Loader />;

  return (
    <div className="layout">
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
