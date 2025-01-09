import {
  HomeOutlined,
  MenuOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import Logo from "../../assets/Logo";
import LogoMini from "../../assets/LogoMini";
import userState from "../../atoms/userState";
import Search from "../search/Search";
import "./index.css";
import MoreItems from "./MoreItems";
const Navbar = () => {
  const currentUser = useRecoilValue(userState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const location = useLocation();
  const [showItem, setShowItem] = useState();

  const largeScreenItems = [
    {
      key: "0",
      label: (
        <a href="/">
          <Logo />
        </a>
      ),
    },
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <a href="/">Home</a>,
    },
    {
      key: "2",
      icon: <SearchOutlined />,
      label: <button>Search</button>,
      onClick: () =>
        setShowItem((prev) => (prev === "search" ? null : "search")),
    },
    {
      key: "3",
      icon: <MessageOutlined />,
      label: <a href="/chat">Chats</a>,
    },
    {
      key: "4",
      label: <a href="/create">Create</a>,
      icon: <PlusCircleOutlined />,
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: <a href={`/user/${user?.id}`}>Profile</a>,
    },
    {
      key: "6",
      icon: <MenuOutlined />,
      label: <button>More</button>,
      onClick: () => setShowItem((prev) => (prev === "more" ? null : "more")),
    },
  ];
  const midScreenItems = [
    {
      key: "0",
      label: <LogoMini />,
      onClick: () => navigate("/"),
    },
    {
      key: "1",
      icon: <HomeOutlined />,
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      icon: <SearchOutlined />,
      onClick: () =>
        setShowItem((prev) => (prev === "search" ? null : "search")),
    },
    {
      key: "3",
      icon: <MessageOutlined />,
      onClick: () => navigate("/chat"),
    },
    {
      key: "4",
      icon: <PlusCircleOutlined />,
      onClick: () => navigate("/create"),
    },
    {
      key: "5",
      icon: <UserOutlined />,
      onClick: () => navigate(`/user/${user?.id}`),
    },
    {
      key: "6",
      icon: <MenuOutlined />,
      onClick: () => setShowItem((prev) => (prev === "more" ? null : "more")),
    },
  ];
  const smallScreenItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      icon: <SearchOutlined />,
      onClick: () =>
        setShowItem((prev) => (prev === "search" ? null : "search")),
    },
    {
      key: "3",
      icon: <MessageOutlined />,
      onClick: () => navigate("/chat"),
    },
    {
      key: "4",
      icon: <PlusCircleOutlined />,
      onClick: () => navigate("/create"),
    },
    {
      key: "5",
      icon: <UserOutlined />,
      onClick: () => navigate(`/user/${user?.id}`),
    },
    {
      key: "6",
      icon: <MenuOutlined />,
      onClick: () => setShowItem((prev) => (prev === "more" ? null : "more")),
    },
  ];
  const selectedKey =
    showItem === "search"
      ? "2"
      : showItem === "more"
      ? "6"
      : location.pathname === "/saved-posts"
      ? "6"
      : location.pathname === "/liked-posts"
      ? "6"
      : location.pathname === "/chat"
      ? "3"
      : location.pathname === "/create"
      ? "4"
      : location.pathname === `/user/${currentUser?.id}`
      ? "5"
      : location.pathname === "/" && "1";
  useEffect(() => {
    setShowItem();
  }, [location]);
  return (
    <>
      <Menu
        className="menu large-screen-menu"
        defaultSelectedKeys={["1"]}
        selectedKeys={[selectedKey]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={largeScreenItems}
      />
      <Menu
        className="menu mid-screen-menu"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={midScreenItems}
      />
      <Menu
        className="menu small-screen-menu"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={smallScreenItems}
      />
      {showItem === "search" ? (
        <Search />
      ) : (
        showItem === "more" && <MoreItems />
      )}
    </>
  );
};
export default Navbar;
