import { Navigate } from "react-router-dom";
import { isTokenExpired, clearAuth } from "../utils/auth";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = sessionStorage.getItem("accessToken");

  let user = null;

  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isTokenExpired(token)) {
    clearAuth();
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
