import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function Dashboard() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchMyBorrows = async () => {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("/api/borrows/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch borrow history");
        }

        setBorrows(data.borrows || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBorrows();
  }, [navigate]);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-IN") : "-";
  };

  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div>
      <h1>My Dashboard</h1>
      <LogoutButton />

      <h3>Welcome, {user?.name || "Student"}</h3>

      <Link to="/books">Browse Books</Link>

      <h2>My Borrow History</h2>

      {error && <p>{error}</p>}

      {!error && borrows.length === 0 && (
        <p>You haven't requested any books yet.</p>
      )}

      {borrows.map((borrow) => (
        <div key={borrow._id}>
          <h3>{borrow.book?.title || "Book unavailable"}</h3>

          <p>Author: {borrow.book?.author || "-"}</p>
          <p>Status: {borrow.status}</p>
          <p>Issue Date: {formatDate(borrow.issueDate)}</p>
          <p>Due Date: {formatDate(borrow.dueDate)}</p>
          <p>Return Date: {formatDate(borrow.returnDate)}</p>
          <p>Fine: ₹{borrow.fineAmount || 0}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
