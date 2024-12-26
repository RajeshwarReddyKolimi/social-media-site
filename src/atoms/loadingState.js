import { atom } from "recoil";

const loadingState = atom({
  key: "loadingState",
  default: 0,
});
export default loadingState;
