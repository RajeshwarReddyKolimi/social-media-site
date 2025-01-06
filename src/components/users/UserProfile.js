import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import useAuth from "../../hooks/useAuth";
import useFollows from "../../hooks/useFollows";
import "./../profile/index.css";
import UserFollowers from "./UserFollowers";
import UserFollowings from "./UserFollowings";
import UserPosts from "./UserPosts";
import { Button } from "antd";

export default function OthersProfile() {
  const { handleFollow, handleUnfollow } = useFollows();
  const followings = useRecoilValue(followingsState);
  const [user, setUser] = useState();
  const { id } = useParams();
  const { fetchUserDetails } = useAuth();
  const [showItem, setShowItem] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(!!followings?.find((fuser) => fuser?.following === id));
  }, [followings]);

  const fetchUser = async () => {
    const { data, error } = await fetchUserDetails(id);
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="profile">
      <div className="profile-header">
        <img src={user?.image} />
        <h1>{user?.name}</h1>
        <div className="flex-buffer" />
        {isFollowing ? (
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
        )}
      </div>
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
          onClick={() => setShowItem("userPosts")}
          className={`profile-button ${
            showItem == "posts" && "profile-button-selected"
          }`}
        >
          <span>Posts</span>
          <span>{user?.posts?.length}</span>
        </button>
      </div>
      {showItem == "followers" ? (
        <UserFollowers user={user} />
      ) : showItem === "followings" ? (
        <UserFollowings user={user} />
      ) : (
        showItem === "userPosts" && <UserPosts user={user} />
      )}
    </div>
  );
}
