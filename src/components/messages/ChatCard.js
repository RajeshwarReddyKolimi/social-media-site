import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import UserPostCard from "../profile/UserPostCard";
import "./index.css";
import { Link } from "react-router";
import UserChatCard from "../profile/UserChatCard";
export default function ChatCard({ chat }) {
  const user = useRecoilValue(userState);
  return (
    <Link to={`/chat/${chat?.id}`} className="chat-card">
      <UserChatCard
        user={user?.id == chat?.user1Id ? chat?.User2 : chat?.User1}
      />
    </Link>
  );
}
