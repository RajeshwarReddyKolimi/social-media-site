import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { useRecoilValue } from "recoil";
import "./App.css";
import loadingState from "./atoms/loadingState";
import userState from "./atoms/userState";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Chats from "./components/messages/Chats";
import Messages from "./components/messages/Messages";
import Layout from "./components/navbar/Layout";
import NotFound from "./components/navbar/NotFound";
import CreatePost from "./components/posts/CreatePost";
import LikedPosts from "./components/profile/LikedPosts";
import SavedPosts from "./components/profile/SavedPosts";
import UserProfile from "./components/users/UserProfile";
import useAuth from "./hooks/useAuth";
import useFollows from "./hooks/useFollows";
import useLikedPosts from "./hooks/useLikedPosts";
import useSavedPosts from "./hooks/useSavedPosts";
import Home from "./pages/home/Home";
import Loader from "./utils/loader/Loader";
import { GiConsoleController } from "react-icons/gi";
import PostPage from "./components/posts/PostPage";

function App() {
  const currentUser = useRecoilValue(userState);
  const loading = useRecoilValue(loadingState);
  const { fetchSavedPosts } = useSavedPosts();
  const { fetchLikedPosts } = useLikedPosts();
  const { fetchFollowings, fetchFollowers } = useFollows();
  const { getCurrentUser } = useAuth();

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchSavedPosts(currentUser);
    fetchLikedPosts(currentUser);
    fetchFollowers(currentUser);
    fetchFollowings(currentUser);
  }, [currentUser]);

  return (
    <BrowserRouter>
      {loading !== 0 && <Loader />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/chat" element={<Chats />} />
          <Route path="/chat/:id" element={<Messages />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/saved-posts" element={<SavedPosts />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
