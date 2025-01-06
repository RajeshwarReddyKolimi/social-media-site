import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { useRecoilValue } from "recoil";
import "./App.css";
import userState from "./atoms/userState";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Chats from "./components/messages/Chats";
import Messages from "./components/messages/Messages";
import Layout from "./components/navbar/Layout";
import NotFound from "./components/navbar/NotFound";
import CreatePost from "./components/posts/CreatePost";
import useAuth from "./hooks/useAuth";
import useFollows from "./hooks/useFollows";
import useLikedPosts from "./hooks/useLikedPosts";
import useSavedPosts from "./hooks/useSavedPosts";
import Home from "./pages/home/Home";
import SavedPosts from "./components/profile/SavedPosts";
import LikedPosts from "./components/profile/LikedPosts";
import UserProfile from "./components/users/UserProfile";

function App() {
  const user = useRecoilValue(userState);
  const { fetchSavedPosts } = useSavedPosts();
  const { fetchLikedPosts } = useLikedPosts();
  const { fetchFollowings, fetchFollowers } = useFollows();
  const { getCurrentUser } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchSavedPosts(user);
    fetchLikedPosts(user);
    fetchFollowers(user);
    fetchFollowings(user);
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chats />} />
          <Route path="/chat/:id" element={<Messages />} />
          <Route path="/saved-posts" element={<SavedPosts />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
