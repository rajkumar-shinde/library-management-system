import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = sessionStorage.getItem("accessToken");

    try {
      if (token) {
        await fetch("/api/users/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("user");

      navigate("/login", { replace: true });
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
