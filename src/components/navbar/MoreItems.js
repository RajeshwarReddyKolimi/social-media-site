import React, { useState } from "react";
import "./index.css";
import { Menu } from "antd";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function MoreItems() {
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
      label: <button onClick={logout}>Logout</button>,
    },
  ];
  return (
    <Menu
      className="menu more-items"
      defaultSelectedKeys={["1"]}
      theme="dark"
      defaultOpenKeys={["sub1"]}
      items={moreItems}
    />
  );
}
