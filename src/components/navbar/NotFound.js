import React from "react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>The page you are looking for does not exist.</h2>
      <Link to="/">Go back to home</Link>
    </div>
  );
}
