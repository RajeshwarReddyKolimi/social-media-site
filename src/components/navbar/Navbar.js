import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo";
import Search from "../search/Search";
import "./index.css";
import { useLocation, useNavigate } from "react-router";
import LogoMini from "../../assets/LogoMini";
import MoreItems from "./MoreItems";
const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoreItems, setShowMoreItems] = useState(false);

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
      label: (
        <button onClick={() => setShowSearch((prev) => !prev)}>Search</button>
      ),
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
      label: <a href="/profile">Profile</a>,
    },
    {
      key: "6",
      icon: <MenuOutlined />,
      label: (
        <button
          onClick={() => {
            setShowMoreItems((prev) => !prev);
          }}
          style={{
            marginBottom: 16,
          }}
        >
          More
        </button>
      ),
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
      onClick: () => setShowSearch((prev) => !prev),
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
      onClick: () => navigate("/profile"),
    },
    {
      key: "6",
      icon: <MenuOutlined />,
      onClick: () => console.log("More clicked"),
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
      onClick: () => setShowSearch((prev) => !prev),
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
      onClick: () => navigate("/profile"),
    },
    {
      key: "6",
      icon: <MenuOutlined />,
      onClick: () => console.log("More clicked"),
    },
  ];
  console.log(showMoreItems);
  useEffect(() => {
    setShowSearch(false);
    setShowMoreItems(false);
  }, [location]);
  return (
    <>
      <Menu
        className="menu large-screen-menu"
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={largeScreenItems}
      />
      <Menu
        className="menu mid-screen-menu"
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={midScreenItems}
      />
      <Menu
        className="menu small-screen-menu"
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={smallScreenItems}
      />
      {showSearch && <Search />}
      {showMoreItems && <MoreItems />}
    </>
  );
};
export default Navbar;
