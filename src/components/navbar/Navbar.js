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
import React from "react";
import Logo from "../../utils/Logo";
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
    label: <button>Search</button>,
  },
  {
    key: "3",
    icon: <MessageOutlined />,
    label: <a href="/messages">Messages</a>,
  },
  {
    key: "4",
    label: <button>Create</button>,
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
const Navbar = () => {
  return (
    <>
      <Menu
        className="menu"
        defaultSelectedKeys={["1"]}
        theme="dark"
        defaultOpenKeys={["sub1"]}
        items={items}
      />
    </>
  );
};
export default Navbar;
