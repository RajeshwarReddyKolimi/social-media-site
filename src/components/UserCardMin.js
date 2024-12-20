import React, { useState } from "react";
import "./userMin.css";
export default function UserCardMin({ userId, username, userDp }) {
  return (
    <div className="user-card-min">
      <img src={userDp} /> <p>{username}</p>
    </div>
  );
}
