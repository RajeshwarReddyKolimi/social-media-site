import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import "./App.css";
import loadingState from "./atoms/loadingState";
import userState from "./atoms/userState";
import ChangePassword from "./components/auth/ChangePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Chats from "./components/messages/Chats";
import Messages from "./components/messages/Messages";
import Layout from "./components/navbar/Layout";
import NotFound from "./components/navbar/NotFound";
import CreatePost from "./components/posts/CreatePost";
import PostPage from "./components/posts/PostPage";
import LikedPosts from "./components/profile/LikedPosts";
import SavedPosts from "./components/profile/SavedPosts";
import UserProfile from "./components/users/UserProfile";
import useAuth from "./hooks/useAuth";
import useFollows from "./hooks/useFollows";
import useLikedPosts from "./hooks/useLikedPosts";
import useSavedPosts from "./hooks/useSavedPosts";
import Home from "./pages/home/Home";
import Loader from "./utils/loader/Loader";
import themeState from "./atoms/themeState";
import Posts from "./components/posts/Posts";

function App() {
  const currentUser = useRecoilValue(userState);
  const loading = useRecoilValue(loadingState);
  const [theme, setTheme] = useRecoilState(themeState);
  const { fetchSavedPosts } = useSavedPosts();
  const { fetchLikedPosts } = useLikedPosts();
  const { fetchFollowings, fetchFollowers } = useFollows();
  const { getCurrentUser } = useAuth();

  useEffect(() => {
    if (theme === "dark") document?.body?.classList?.remove("light-theme");
    else document?.body?.classList?.add("light-theme");
  }, [theme]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchSavedPosts();
    fetchLikedPosts();
    fetchFollowers(currentUser?.id);
    fetchFollowings(currentUser?.id);
  }, [currentUser?.id]);

  useEffect(() => {
    setTheme(localStorage?.getItem("theme") || "dark");
  }, []);
  return (
    <BrowserRouter>
      {loading !== 0 && <Loader />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Posts />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/chat" element={<Chats />} />
          <Route path="/chat/:id" element={<Messages />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/saved-posts" element={<SavedPosts />} />
          <Route path="/liked-posts" element={<LikedPosts />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
