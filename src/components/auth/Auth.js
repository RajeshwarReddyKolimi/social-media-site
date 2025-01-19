import React, { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";

export default function Auth() {
  const [showItem, setShowItem] = useState("signin");
  return showItem === "signin" ? (
    <Signin setShowItem={setShowItem} />
  ) : (
    <Signup setShowItem={setShowItem} />
  );
}
