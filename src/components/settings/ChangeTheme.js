import { Switch } from "antd";
import React from "react";
import { useRecoilState } from "recoil";
import themeState from "../../atoms/themeState";
import "./index.css";

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
