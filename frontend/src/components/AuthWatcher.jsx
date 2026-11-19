import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { isTokenExpired, clearAuth } from "../utils/auth";

function AuthWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem("accessToken");

      if (!token) return;

      if (isTokenExpired(token)) {
        clearAuth();
        navigate("/login", { replace: true });
      }
    };

    checkToken();

    const interval = setInterval(checkToken, 10000);

    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  return null;
}

export default AuthWatcher;
