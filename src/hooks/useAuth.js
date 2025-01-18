import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import userState from "../atoms/userState";
import loadingState from "../atoms/loadingState";
import { supabase } from "../config/supabase";
import validatePassword from "../utils/anon/validatePassword";
import { redirect } from "react-router";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
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
        .maybeSingle();
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
      const userExists = await supabase
        ?.from("Users")
        .select()
        .eq("name", values?.name)
        .maybeSingle();
      if (userExists?.data)
        return { error: { code: "Username already taken" } };
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: values?.email,
          password: values?.password,
        });
      if (signupError) return { error: signupError };
      if (signupData) {
        const detailsAdded = await putUserDetails({
          id: signupData?.user?.id,
          name: values?.name,
          image: "",
          email: values?.email,
        });
        if (detailsAdded?.error) return { error: detailsAdded?.error };
        const response = await fetchUserDetails(signupData?.user?.id);
        setCurrentUser(response?.data);
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

      if (signinData?.user) {
        const response = await fetchUserDetails(signinData?.user?.id);
        setCurrentUser(response?.data);
      } else {
        console.log(signinError);
        return { error: signinError };
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
        setCurrentUser(response?.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  const handleInitiateChangePassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/change-password",
      });
      console.log(data, error);
      if (data) alert("Password reset link is set to email");
    } catch (e) {
      console.log(e);
    }
  };
  const handleChangePassword = async (values) => {
    try {
      if (!validatePassword(values?.password)) {
        alert("Invalid password");
        return;
      }
      const { data, error } = await supabase.auth.updateUser({
        password: values?.password,
      });
      if (data?.user) {
        alert("Password reset successful");
        return true;
      } else if (error) {
        console.log(error?.status);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleChangePrivacy = async (value) => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .update({ isPrivate: value })
        .eq("id", currentUser?.id);
      if (!error)
        setCurrentUser((prev) => {
          return { ...prev, isPrivate: value };
        });
    } catch (e) {
      console.log(e);
    }
  };
  async function logout() {
    try {
      setLoading((prev) => prev + 1);
      const { data: logoutData, error: logoutError } =
        await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  return {
    signup,
    signin,
    getCurrentUser,
    logout,
    fetchUserDetails,
    handleInitiateChangePassword,
    handleChangePassword,
    handleChangePrivacy,
  };
}
