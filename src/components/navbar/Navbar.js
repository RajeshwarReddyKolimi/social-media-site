import {
  HomeOutlined,
  InstagramOutlined,
  MenuOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "./navbar.css";
import React, { useState } from "react";
import Logo from "../../utils/Logo";
import Search from "../search/Search";
const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const items = [
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
      label: <button>More</button>,
    },
  ];
  return (
    <>
      <Menu
        className="menu"
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={items}
      />
      {showSearch && <Search />}
    </>
  );
};
export default Navbar;
