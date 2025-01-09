import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import Navbar from "./Navbar";
import "./index.css";

export default function Layout() {
  const loading = useRecoilValue(loadingState);
  const currentUser = useRecoilValue(userState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading == 0) {
      if (!currentUser) {
        const curLocation = location.pathname;
        if (curLocation != "signin" || curLocation != "signup")
          navigate(`/signin?redirect=${location?.pathname}`);
        else navigate(`/signin?redirect=/}`);
      }
    }
  }, [currentUser, loading]);

  return (
    <div className="layout">
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
