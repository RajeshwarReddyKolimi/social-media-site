import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import loadingState from "../../atoms/loadingState";
import userState from "../../atoms/userState";
import Navbar from "./Navbar";
import "./index.css";
import Signin from "../auth/Signin";

export default function Layout() {
  const currentUser = useRecoilValue(userState);

  if (!currentUser) return <Signin />;
  return (
    <div className="layout">
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
