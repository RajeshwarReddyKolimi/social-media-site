import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import userState from "../atoms/userState";
import loadingState from "../atoms/loadingState";
import { supabase } from "../config/supabase";
import validatePassword from "../utils/anon/validatePassword";
import { redirect, useNavigate } from "react-router";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [loading, setLoading] = useRecoilState(loadingState);

  async function fetchUserDetails(id) {
    try {
      setLoading((prev) => prev + 1);
      const data = await supabase
        .from("Users")
        .select(
          `*, 
          followers:Follows!following(*), 
          followings:Follows!follower(*), 
          posts:Posts!userId(*)`
        )
        .eq("id", id)
        .maybeSingle();
      return data;
    } catch (e) {
      console.log(e);
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
      console.log(e);
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
          image:
            "https://epiefagdengdqjzqxtbz.supabase.co/storage/v1/object/public/profileImages/user.png",
          email: values?.email,
        });
        if (detailsAdded?.error) return { error: detailsAdded?.error };
        const response = await fetchUserDetails(signupData?.user?.id);
        setCurrentUser(response?.data);
        return { data: signupData };
      }
    } catch (e) {
      console.log(e);
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
        return { data: signinData };
      } else {
        return { error: signinError };
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  }
  async function getCurrentUser({ setUserLoading }) {
    try {
      setUserLoading(true);
      const { data: currentUserData, error: currentUserError } =
        await supabase.auth.getUser();
      if (currentUserData?.user) {
        const response = await fetchUserDetails(currentUserData?.user?.id);
        setCurrentUser(response?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setUserLoading(false);
    }
  }
  const handleInitiateChangePassword = async (email) => {
    try {
      setLoading((prev) => prev + 1);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/change-password",
      });
      return { data, error };
    } catch (e) {
      return e;
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleChangePassword = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      if (!validatePassword(values?.password)) {
        return { error: "Invalid password" };
      }
      const { data, error } = await supabase.auth.updateUser({
        password: values?.password,
      });
      return { data, error };
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleChangePrivacy = async (value) => {
    try {
      setLoading((prev) => prev + 1);
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
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleChangeUsername = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      if (!values?.username?.trim()) return;
      const { data, error } = await supabase
        .from("Users")
        .update({ name: values?.username?.trim() })
        .eq("id", currentUser?.id)
        .select()
        .maybeSingle();
      if (error) return;
      setCurrentUser((prev) => {
        return { ...prev, name: data?.name };
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  const handleChangeDp = async (values) => {
    try {
      setLoading((prev) => prev + 1);
      const image = values?.file;
      console.log(image);
      const imageName = Date.now() + image?.name;
      const r1 = await supabase.storage
        .from("profileImages")
        .upload(imageName, image?.originFileObj);
      if (r1.error) return;
      const { data, error } = await supabase.storage
        .from("profileImages")
        .getPublicUrl(imageName);
      if (error) return;
      else {
        const res = await supabase
          .from("Users")
          .update({ image: data?.publicUrl })
          .eq("id", currentUser?.id)
          .select()
          .maybeSingle();
        setCurrentUser((prev) => {
          return { ...prev, image: res?.data?.image };
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading((prev) => prev - 1);
    }
  };
  async function logout() {
    try {
      setLoading((prev) => prev + 1);
      const { data: logoutData, error: logoutError } =
        await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (e) {
      console.log(e);
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
    handleChangeUsername,
    handleChangeDp,
  };
}
