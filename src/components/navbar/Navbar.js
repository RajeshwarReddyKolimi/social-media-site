import {
  HomeOutlined,
  MenuOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useRecoilValue } from "recoil";
import Logo from "../../assets/Logo";
import LogoMini from "../../assets/LogoMini";
import userState from "../../atoms/userState";
import Search from "../search/Search";
import "./index.css";
import MoreItems from "./MoreItems";
import themeState from "../../atoms/themeState";
const Navbar = () => {
  const currentUser = useRecoilValue(userState);
  const user = useRecoilValue(userState);
  const theme = useRecoilValue(themeState);
  const navigate = useNavigate();
  const location = useLocation();
  const [showItem, setShowItem] = useState();

  const largeScreenItems = [
    {
      key: "0",
      label: (
        <Link to="/">
          <Logo />
        </Link>
      ),
    },
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: "2",
      icon: <SearchOutlined />,
      label: (
        <Button type="text" style={{ padding: "0" }} htmlType="button">
          Search
        </Button>
      ),
      onClick: () =>
        setShowItem((prev) => (prev === "search" ? null : "search")),
    },
    {
      key: "3",
      icon: <MessageOutlined />,
      label: <Link to="/chat">Chats</Link>,
    },
    {
      key: "4",
      label: <Link to="/create">Create</Link>,
      icon: <PlusCircleOutlined />,
    },
    {
      key: "5",
      icon: <UserOutlined />,
      label: <Link to={`/user/${user?.id}`}>Profile</Link>,
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
    <nav>
      <Menu
        className="menu large-screen-menu"
        defaultSelectedKeys={["1"]}
        selectedKeys={[selectedKey]}
        theme={theme}
        items={largeScreenItems}
      />
      <Menu
        className="menu mid-screen-menu"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["1"]}
        theme={theme}
        items={midScreenItems}
      />
      <Menu
        className="menu small-screen-menu"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["1"]}
        theme={theme}
        items={smallScreenItems}
      />
      {showItem === "search" ? (
        <Search />
      ) : (
        showItem === "more" && <MoreItems />
      )}
    </nav>
  );
};
export default Navbar;
