import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import UserPosts from "./UserPosts";
import Followers from "../profile/Followers";
import Followings from "../profile/Followings";
import "./../profile/profile.css";
import UserFollowers from "./UserFollowers";
import UserFollowings from "./UserFollowings";
import useFollows from "../../hooks/useFollows";
import { useRecoilValue } from "recoil";
import followersState from "../../atoms/followers";
import followingsState from "../../atoms/followings";

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
        {isFollowing ? (
          <button onClick={() => handleUnfollow({ userId: user?.id })}>
            Unfollow
          </button>
        ) : (
          <button onClick={() => handleFollow({ userId: user?.id })}>
            Follow
          </button>
        )}
      </div>

      <button onClick={() => setShowItem("followers")}>Followers</button>
      <button onClick={() => setShowItem("following")}>Following</button>
      <button onClick={() => setShowItem("userPosts")}>Posts</button>
      {showItem === "followers" ? (
        <UserFollowers user={user} />
      ) : showItem === "following" ? (
        <UserFollowings user={user} />
      ) : (
        showItem === "userPosts" && <UserPosts user={user} />
      )}
    </div>
  );
}
