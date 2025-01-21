import { Switch } from "antd";
import React from "react";
import { useRecoilValue } from "recoil";
import useAuth from "../../hooks/useAuth";
import "./index.css";
import userState from "../../atoms/userState";

export default function ChangePrivacy() {
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
