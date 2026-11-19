import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Library Management System</h1>
      <p>Welcome to our digital library.</p>

      <Link to="/login">Login</Link>
      {" | "}
      <Link to="/register">Register</Link>
      {" | "}
      <Link to="/books">Browse Books</Link>
    </div>
  );
}

export default Home;
