import React, { useState } from "react";
import "./userMin.css";
export default function UserCardMin({ user }) {
  console.log(user);
  return (
    <div className="user-card-min">
      <img src={user?.image} /> <p>{user?.name}</p>
    </div>
  );
}
