import React from "react";
import "./index.css";

export default function Loader({ userLoading }) {
  return (
    <div className={`loader ${userLoading && "user-loader"}`}>
      <div className={`loader-inner`}></div>
    </div>
  );
}
