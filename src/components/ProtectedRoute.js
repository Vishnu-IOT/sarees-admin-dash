import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Wrap any route that should require login. If there's no auth token,
// bounce to the login page and remember where the user was trying to go
// so we can send them back after they sign in.
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
