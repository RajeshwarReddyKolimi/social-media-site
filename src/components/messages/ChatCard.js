import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import UserProfileCard from "../users/UserProfileCard";
import "./index.css";
import { Link } from "react-router";
import UserChatCard from "../users/UserChatCard";
export default function ChatCard({ chat }) {
  const user = useRecoilValue(userState);
  return (
    <UserChatCard
      chat={chat}
      user={user?.id == chat?.user1Id ? chat?.User2 : chat?.User1}
    />
  );
}
