export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = token.split(".")[1];

    if (!payload) return true;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    const decoded = JSON.parse(atob(base64));

    if (typeof decoded.exp !== "number") {
      return true;
    }

    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
}

export function clearAuth() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
}
