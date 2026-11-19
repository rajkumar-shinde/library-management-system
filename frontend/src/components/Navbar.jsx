import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";

function Navbar() {
  const location = useLocation();

  const token = sessionStorage.getItem("accessToken");

  let user = null;

  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token && user);
  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <Link className="nav-brand" to="/">
        📚 LibraryMS
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/books">Books</Link>

        {isLoggedIn ? (
          <>
            <Link to={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>

            {isAdmin && <Link to="/admin/add-book">Add Book</Link>}

            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
