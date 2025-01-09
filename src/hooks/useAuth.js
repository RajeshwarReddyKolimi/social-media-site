import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import userState from "../atoms/userState";
import loadingState from "../atoms/loadingState";
import { supabase } from "../config/supabase";

export default function useAuth() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);
  async function fetchUserDetails(id) {
    try {
      setLoading((prev) => prev + 1);
      const data = await supabase
        .from("Users")
        .select(
          `*, followers:Follows!following(following), followings:Follows!follower(follower), posts:Posts!userId(userId)`
        )
        .eq("id", id)
        .single();
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  async function putUserDetails({ id, name, image, email }) {
    try {
      setLoading((prev) => prev + 1);
      const data = await supabase.from("Users").insert({
        id,
        name,
        image,
        email,
      });
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  async function signup(values) {
    try {
      setLoading((prev) => prev + 1);
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: values?.email,
          password: values?.password,
        });
      if (signupData) {
        const detailsAdded = await putUserDetails({
          id: signupData?.user?.id,
          name: values?.name,
          image: "",
          email: values?.email,
        });
        if (detailsAdded?.error) return;
        const response = await fetchUserDetails(signupData?.user?.id);
        setUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  async function signin(values) {
    try {
      setLoading((prev) => prev + 1);
      const { data: signinData, error: signinError } =
        await supabase.auth.signInWithPassword(values);
      if (signinData) {
        const response = await fetchUserDetails(signinData?.user?.id);
        setUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  async function getCurrentUser() {
    try {
      setLoading((prev) => prev + 1);
      const { data: currentUserData, error: currentUserError } =
        await supabase.auth.getUser();
      if (currentUserData?.user) {
        const response = await fetchUserDetails(currentUserData?.user?.id);
        setUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  async function logout() {
    try {
      setLoading((prev) => prev + 1);
      const { data: logoutData, error: logoutError } =
        await supabase.auth.signOut();
      setUser(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  return { signup, signin, getCurrentUser, logout, fetchUserDetails };
}
