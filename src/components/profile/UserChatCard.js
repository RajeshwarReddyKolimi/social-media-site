import React, { useEffect, useState } from "react";
import useFollows from "../../hooks/useFollows";
import followingsState from "../../atoms/followings";
import { useRecoilValue } from "recoil";
import "./index.css";
import { Button } from "antd";

export default function UserChatCard({ user }) {
  return (
    <div className="user-post-card">
      <img src={user?.image} />
      <p>{user?.name}</p>
    </div>
  );
}
