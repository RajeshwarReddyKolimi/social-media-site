import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import useAuth from "../../hooks/useAuth";
import useFollows from "../../hooks/useFollows";
import "./../profile/index.css";
import UserFollowers from "./UserFollowers";
import UserFollowings from "./UserFollowings";
import UserPosts from "./UserPosts";
import { Button, Upload } from "antd";
import userState from "../../atoms/userState";
import { MdEdit } from "react-icons/md";
import { supabase } from "../../config/supabase";
import EditUsername from "../profile/EditUsername";

export default function UserProfile() {
  const { handleFollow, handleUnfollow } = useFollows();
  const followings = useRecoilValue(followingsState);
  const [user, setUser] = useState();
  const { id } = useParams();
  const currentUser = useRecoilValue(userState);
  const { fetchUserDetails } = useAuth();
  const [showItem, setShowItem] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { getCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleChangeDp = async (values) => {
    try {
      const image = values?.file;
      const imageName = Date.now() + image?.name;
      const r1 = await supabase.storage
        .from("profileImages")
        .upload(imageName, image?.originFileObj);
      if (r1.error) return;
      const { data, error } = await supabase.storage
        .from("profileImages")
        .getPublicUrl(imageName);
      if (error) return;
      else {
        const res = await supabase
          .from("Users")
          .update({ image: data?.publicUrl })
          .eq("id", currentUser?.id)
          .select();
        await getCurrentUser();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchChatId = async () => {
    try {
      if (currentUser?.id == user?.id) return;
      const { data, error } = await supabase
        .from("Chats")
        .select(
          `*,
        user1:user1Id (id, name, image),
        user2:user2Id (id, name, image)`
        )
        .or(`user1Id.eq.${currentUser?.id}, user2Id.eq.${currentUser?.id}`)
        .or(`user1Id.eq.${user?.id}, user2Id.eq.${user?.id}`)
        .maybeSingle();
      if (data) navigate(`/chat/${data?.id}`);
      else {
        const { data, error } = await supabase
          .from("Chats")
          .upsert({
            user1Id: currentUser?.id,
            user2Id: user?.id,
          })
          .select()
          .single();
        if (data) navigate(`/chat/${data?.id}`);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setIsFollowing(!!followings?.find((fuser) => fuser?.following === id));
  }, [followings, id]);

  const fetchUser = async () => {
    const { data, error } = await fetchUserDetails(id);
    setUser(data);
  };

  useEffect(() => {
    setIsMe(currentUser?.id == id);
    if (currentUser?.id != id) fetchUser();
    else setUser(currentUser);
  }, [id, currentUser]);

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-dp">
          <img src={user?.image} />
          {isMe && (
            <Upload
              className="profile-dp-edit"
              listType="picture-card"
              fileList={fileList}
              onChange={handleChangeDp}
            >
              <Button>
                <MdEdit className="icon-2" />
              </Button>
            </Upload>
          )}
        </div>
        <div className="profile-username">
          {!isMe && <h1>{user?.name}</h1>}
          {isMe && !showEditUsername && <h1>{user?.name}</h1>}

          {showEditUsername && (
            <EditUsername setShowEditUsername={setShowEditUsername} />
          )}
          {isMe && !showEditUsername && (
            <Button
              onClick={() => setShowEditUsername((prev) => !prev)}
              type="text"
              className="profile-edit-username-button"
            >
              <MdEdit className="icon-3" />
            </Button>
          )}
        </div>
        <div className="flex-buffer" />
        {!isMe &&
          (isFollowing ? (
            <Button
              className="follow-button"
              onClick={(e) => {
                e.preventDefault();
                handleUnfollow({ userId: user?.id });
              }}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              className="follow-button"
              onClick={(e) => {
                e.preventDefault();
                handleFollow({ userId: user?.id });
              }}
            >
              Unfollow
            </Button>
          ))}
      </div>
      {!isMe && (
        // <Link to={`/chat/${user?.id}`} className="profile-message-button">
        //   Message
        // </Link>
        <Button
          type="text"
          onClick={fetchChatId}
          className="profile-message-button"
        >
          Message
        </Button>
      )}
      <div className="profile-button-container">
        <button
          onClick={() => setShowItem("followers")}
          className={`profile-button ${
            showItem === "followers" && "profile-button-selected"
          }`}
        >
          <span>Followers</span>
          <span>{user?.followers?.length}</span>
        </button>
        <button
          onClick={() => setShowItem("followings")}
          className={`profile-button ${
            showItem == "followings" && "profile-button-selected"
          }`}
        >
          <span>Following</span>
          <span>{user?.followings?.length}</span>
        </button>
        <button
          onClick={() => setShowItem("posts")}
          className={`profile-button ${
            showItem == "posts" && "profile-button-selected"
          }`}
        >
          <span>Posts</span>
          <span>{user?.posts?.length}</span>
        </button>
      </div>
      {showItem === "followers" ? (
        <UserFollowers user={user} />
      ) : showItem === "followings" ? (
        <UserFollowings user={user} />
      ) : (
        <UserPosts user={user} isMe={isMe} />
      )}
    </div>
  );
}
