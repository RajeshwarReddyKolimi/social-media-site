import React, { useState } from "react";
import "./index.css";
import { Button, Menu } from "antd";
import { Link, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import ChangeTheme from "../settings/ChangeTheme";
import themeState from "../../atoms/themeState";
import ChangePrivacy from "../settings/ChangePrivacy";
import useNotify from "../../hooks/useNotify";

export default function MoreItems() {
  const location = useLocation();
  const currentUser = useRecoilValue(userState);
  const theme = useRecoilValue(themeState);
  const { logout, handleInitiateChangePassword } = useAuth();
  const { notify, contextHolder } = useNotify();

  const initiateChangePassword = async (email) => {
    const { data, error } = await handleInitiateChangePassword(email);
    if (error)
      notify({
        type: "error",
        message: "Password Change Error",
        description: error?.code,
      });
    else
      notify({
        type: "success",
        message: "Password Change",
        description: "Email to change password has been sent",
      });
  };
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
      label: <button>Change Password</button>,
      onClick: () => initiateChangePassword(currentUser?.email),
    },
    {
      key: "3",
      label: <ChangePrivacy />,
    },
    {
      key: "4",
      label: <ChangeTheme />,
    },
    {
      key: "5",
      label: <button>Logout</button>,
      onClick: logout,
    },
  ];
  const selectedKey =
    location.pathname === "/saved-posts"
      ? "0"
      : location.pathname === "/liked-posts"
      ? "1"
      : location.pathname === "/settings" && "2";
  return (
    <nav>
      <Menu
        className="menu more-items"
        defaultSelectedKeys={["1"]}
        selectedKeys={[selectedKey]}
        theme={theme}
        defaultOpenKeys={["sub1"]}
        items={moreItems}
      />
      {contextHolder}
    </nav>
  );
}
