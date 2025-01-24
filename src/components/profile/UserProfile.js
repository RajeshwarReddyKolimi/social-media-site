import { Button, Image, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import followingsState from "../../atoms/followings";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";
import useFollows from "../../hooks/useFollows";
import useMessages from "../../hooks/useMessages";
import NotFound from "../navbar/NotFound";
import EditUsername from "../profile/EditUsername";
import "./../profile/index.css";
import UserFollowers from "../users/UserFollowers";
import UserFollowings from "../users/UserFollowings";
import UserPosts from "../users/UserPosts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "../../utils/loader/Loader";
import ImgCrop from "antd-img-crop";

export default function UserProfile() {
  const { handleFollow, handleUnfollow } = useFollows();
  const [followings, setFollowings] = useRecoilState(followingsState);
  const [user, setUser] = useState();
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const { fetchUserDetails, handleChangeDp } = useAuth();
  const [showItem, setShowItem] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [error, setError] = useState();
  const { fetchChatId } = useMessages({});
  const queryClient = useQueryClient();
  const [shouldGetChatId, setShouldGetChatId] = useState(false);

  const {
    data: chatId,
    isLoading: chatIdLoading,
    error: chatIdError,
  } = useQuery({
    queryKey: ["chatId", currentUser?.id, user?.id],
    queryFn: () => fetchChatId(user?.id),
    enabled: shouldGetChatId,
    onSuccess: (chatId) => {
      navigate(`/chat/${chatId}`);
    },
  });

  const fetchUser = async () => {
    const { data, error } = await fetchUserDetails(id);
    if (data?.id !== id) setError("Invalid url");
    if (error) setError(error);
    setUser(data);
  };

  const followMutation = useMutation({
    mutationFn: () => handleFollow(user?.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["followings", currentUser?.id]);
      queryClient.setQueryData(["followings", currentUser?.id], (prev) => [
        data,
        ...prev,
      ]);
      queryClient.invalidateQueries(["homePosts", currentUser?.id]);

      setFollowings((prev) => [data, ...prev]);
      setCurrentUser((prev) => {
        return {
          ...prev,
          followings: [...prev?.followings, { following: data?.following }],
        };
      });
      setUser((prev) => {
        return {
          ...prev,
          followers: [...prev?.followers, { following: data?.following }],
        };
      });
    },
    onError: (error) => {
      console.log("Error following user:", error.message);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => handleUnfollow(user?.id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["followings", currentUser?.id]);
      queryClient.setQueryData(["followings", currentUser?.id], (prev) => {
        return prev.filter((f) => f.id !== data?.id);
      });
      queryClient.invalidateQueries(["homePosts", currentUser?.id]);

      setFollowings((prev) => prev?.filter((f) => f.id !== data?.id));
      setCurrentUser((prev) => {
        return {
          ...prev,
          followings: prev?.followings?.filter(
            (follower) => follower?.following !== data?.following
          ),
        };
      });
      setUser((prev) => {
        return {
          ...prev,
          followers: prev?.followers?.filter(
            (follower) => follower?.following !== data?.following
          ),
        };
      });
    },
    onError: (error) => {
      console.log("Error unfollowing user:", error.message);
    },
  });

  useEffect(() => {
    setIsFollowing(!!followings?.find((fuser) => fuser?.following === id));
  }, [followings, id]);

  useEffect(() => {
    setIsMe(currentUser?.id == id);
    if (currentUser?.id != id) fetchUser();
    else setUser(currentUser);
  }, [id, currentUser]);

  useEffect(() => {
    setShowItem("posts");
  }, [id, currentUser?.id]);

  if (error) return <NotFound />;

  return (
    <main className="profile">
      {(followMutation?.isLoading ||
        unfollowMutation?.isLoading ||
        chatIdLoading) && <Loader />}
      <div className="profile-header">
        <div className="profile-dp">
          <Image src={user?.image} />
          {isMe && (
            <Upload
              className="profile-dp-edit"
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
              type="text"
              className="follow-button"
              onClick={unfollowMutation.mutate}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              type="text"
              className="follow-button"
              onClick={followMutation.mutate}
            >
              Follow
            </Button>
          ))}
      </div>
      {!isMe && (!user?.isPrivate || isFollowing) && (
        <Button
          type="text"
          onClick={() => setShouldGetChatId(true)}
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
      {isMe || !user?.isPrivate || isFollowing ? (
        showItem === "followers" ? (
          <UserFollowers user={user} />
        ) : showItem === "followings" ? (
          <UserFollowings user={user} />
        ) : (
          <UserPosts user={user} isMe={isMe} />
        )
      ) : (
        <p>Follow to view</p>
      )}
    </main>
  );
}
