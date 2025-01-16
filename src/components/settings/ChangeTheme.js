import React from "react";
import "./index.css";
import { Switch } from "antd";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
import themeState from "../../atoms/themeState";

export default function ChangeTheme() {
  const [theme, setTheme] = useRecoilState(themeState);
  return (
    <div className="change-theme">
      <span>Light Theme</span>
      <Switch
        style={{
          border: "1px solid var(--border-color-1)",
        }}
        defaultChecked={theme === "light"}
        onChange={(e) => {
          setTheme(e ? "light" : "dark");
          localStorage.setItem("theme", e ? "light" : "dark");
        }}
      />
    </div>
  );
}
