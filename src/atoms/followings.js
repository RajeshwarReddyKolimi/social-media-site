import { atom } from "recoil";

const followingsState = atom({
  key: "followingsState",
  default: [],
});

export default followingsState;
