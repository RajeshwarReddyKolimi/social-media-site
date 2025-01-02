import { atom } from "recoil";

const savedPostsState = atom({
  key: "savedPostsState",
  default: [],
});
export default savedPostsState;
