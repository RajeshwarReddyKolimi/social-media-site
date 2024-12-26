import React, { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import "./navbar.css";
import Loader from "../../utils/loader/Loader";
import loadingState from "../../atoms/loadingState";
import { useRecoilState } from "recoil";

export default function Layout() {
  const [loading, setLoading] = useRecoilState(loadingState);
  return (
    <div>
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
