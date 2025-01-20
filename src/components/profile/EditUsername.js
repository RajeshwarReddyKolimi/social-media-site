import { Button, Form, Input } from "antd";
import React from "react";
import { MdClose } from "react-icons/md";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/userState";
import useAuth from "../../hooks/useAuth";

export default function EditUsername({ setShowEditUsername }) {
  const currentUser = useRecoilValue(userState);
  const { handleChangeUsername } = useAuth();
  return (
    <Form
      onFinish={(values) => {
        handleChangeUsername(values);
        setShowEditUsername(false);
      }}
      className="edit-username-form"
    >
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
