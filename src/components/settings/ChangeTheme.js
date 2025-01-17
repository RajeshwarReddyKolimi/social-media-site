import { Switch } from "antd";
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import "./index.css";
import useAuth from "../../hooks/useAuth";

export default function ChangeTheme() {
  const currentUser = useRecoilValue(userState);
  const { handleChangePrivacy } = useAuth();
  return (
    <div className="change-theme">
      <span>Private Account</span>
      <Switch
        style={{
          border: "1px solid var(--border-color-1)",
        }}
        defaultChecked={currentUser?.isPrivate}
        onChange={handleChangePrivacy}
      />
    </div>
  );
}
