import { Button, Form, Input } from "antd";
import React from "react";
import { supabase } from "../../config/supabase";
import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";
import { MdClose } from "react-icons/md";

export default function EditUsername({ setShowEditUsername }) {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const handleChangeUsername = async (values) => {
    try {
      if (!values?.username?.trim()) return;
      const { data, error } = await supabase
        .from("Users")
        .update({ name: values?.username?.trim() })
        .eq("id", currentUser?.id)
        .select();
      if (error) return;
      setCurrentUser((prev) => {
        return { ...prev, name: data?.[0]?.name };
      });
      setShowEditUsername(false);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Form onFinish={handleChangeUsername} className="edit-username-form">
      <Form.Item name="username">
        <Input defaultValue={currentUser?.name} autoFocus />
      </Form.Item>
      <Button
        onClick={() => setShowEditUsername(false)}
        htmlType="button"
        type="text"
      >
        <MdClose className="icon-3" />
      </Button>
    </Form>
  );
}
