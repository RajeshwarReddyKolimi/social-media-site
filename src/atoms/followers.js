import { atom } from "recoil";

const followersState = atom({
  key: "followersState",
  default: [],
});

export default followersState;
