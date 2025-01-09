import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar";
import "./index.css";
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
    if (!loading) {
      if (!user) {
        const curLocation = location?.pathname;
        if (curLocation != "signin" || curLocation != "signup")
          navigate(`/signin?redirect=${location?.pathname}`);
        else navigate(`/signin?redirect=/}`);
      }
    }
  }, [user, loading]);

  return (
    <div className="layout">
      {loading !== 0 && <Loader />}
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
