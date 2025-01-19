import React from "react";
import { Outlet } from "react-router";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import Auth from "../auth/Auth";
import Navbar from "./Navbar";
import "./index.css";

export default function Layout() {
  const currentUser = useRecoilValue(userState);
  if (!currentUser) return <Auth />;
  return (
    <div className="layout">
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
