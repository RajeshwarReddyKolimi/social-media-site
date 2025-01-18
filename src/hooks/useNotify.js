import { notification } from "antd";
import React from "react";

export default function useNotify() {
  const [notifyApi, contextHolder] = notification.useNotification();
  const notify = ({ type, message, description }) => {
    notifyApi.open({
      type,
      duration: "10",
      message,
      description,
      className: "notify-popup",
    });
  };

  return { notify, contextHolder };
}
