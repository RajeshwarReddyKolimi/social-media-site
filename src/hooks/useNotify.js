import { useRecoilValue } from "recoil";
import notifyState from "../atoms/notifyApi";

export default function useNotify() {
  const notifyApi = useRecoilValue(notifyState);
  const notify = ({ type, message, description }) => {
    notifyApi.open({
      type,
      duration: 10,
      message,
      description,
      className: "notify-popup",
    });
  };

  return notify;
}
