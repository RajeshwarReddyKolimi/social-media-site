import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Profile from "./components/auth/Profile";
import Layout from "./components/navbar/Layout";
import NotFound from "./components/navbar/NotFound";
import Home from "./pages/home/Home";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import { RecoilRoot, useRecoilState } from "recoil";
import userState from "./atoms/userState";
import useAuth from "./hooks/useAuth";
import { useEffect } from "react";
import Loader from "./utils/loader/Loader";
import loadingState from "./atoms/loadingState";
import CreatePost from "./components/posts/CreatePost";
import Chats from "./components/messages/Chats";
import Messages from "./components/messages/Messages";

function App() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const { getCurrentUser } = useAuth();
  async function fetchUser() {
    await getCurrentUser();
  }
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chats />} />
          <Route path="/chat/:id" element={<Messages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
