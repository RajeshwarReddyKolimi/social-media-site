import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";
import "./navbar.css";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}
