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

function App() {
  const [user, setUser] = useRecoilState(userState);
  const { getCurrentUser } = useAuth();
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
