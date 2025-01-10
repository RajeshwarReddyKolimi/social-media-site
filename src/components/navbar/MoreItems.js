import React, { useState } from "react";
import "./index.css";
import { Menu } from "antd";
import { Link, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function MoreItems() {
  const location = useLocation();
  const { logout } = useAuth();
  const moreItems = [
    {
      key: "0",
      label: <Link to="/saved-posts">SavedPosts</Link>,
    },
    {
      key: "1",
      label: <Link to="/liked-posts">LikedPosts</Link>,
    },
    {
      key: "2",
      label: <button>Logout</button>,
      onClick: logout,
    },
  ];
  const selectedKey =
    location.pathname === "/saved-posts"
      ? "0"
      : location.pathname === "/liked-posts" && "1";
  return (
    <Menu
      className="menu more-items"
      defaultSelectedKeys={["1"]}
      selectedKeys={[selectedKey]}
      theme="dark"
      defaultOpenKeys={["sub1"]}
      items={moreItems}
    />
  );
}
