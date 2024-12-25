import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import userState from "../atoms/userState";

export const supabase = createClient(
  "https://bspiizmczisjkgtgcqik.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcGlpem1jemlzamtndGdjcWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTU3MTIsImV4cCI6MjA0OTk5MTcxMn0.Pef7hj6Fy0aJHC3Y8DGswosxJvMfsJxDy6V3lwBDfqU"
);

export default function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const [currentUser, setCurrentUser] = useState(null);
  console.log(currentUser);
  async function fetchUserDetails(id) {
    try {
      const data = await supabase
        .from("Users")
        .select("*")
        .eq("id", id)
        .single();
      return data;
    } catch (e) {
      console.error(e);
    }
  }
  async function signup() {
    try {
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: "a@a.com",
          password: "1",
        });
      if (signupData) {
        const response = await fetchUserDetails(signupData?.user?.id);
        setCurrentUser(response?.data);
        setUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function signin(values) {
    try {
      const { data: signinData, error: signinError } =
        await supabase.auth.signInWithPassword(values);
      if (signinData) {
        const response = await fetchUserDetails(signinData?.user?.id);
        setCurrentUser(response?.data);
        setUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function getCurrentUser() {
    try {
      const { data: currentUserData, error: currentUserError } =
        await supabase.auth.getUser();
      if (currentUserData?.user) {
        const response = await fetchUserDetails(currentUserData?.user?.id);
        setCurrentUser(response?.data);
        setUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function logout() {
    try {
      const { data: logoutData, error: logoutError } =
        await supabase.auth.signOut();
      setCurrentUser(null);
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  }
  return { signup, signin, getCurrentUser, logout, currentUser };
}
