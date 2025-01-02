import { atom } from "recoil";

const likedPostsState = atom({
  key: "likedPostsState",
  default: [],
});

export default likedPostsState;
