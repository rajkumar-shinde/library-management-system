import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function AdminDashboard() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Fetch all borrow requests
  const fetchBorrows = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Please login as admin");
      }

      const response = await fetch("/api/borrows/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load requests");
      }

      setBorrows(data.borrows || []);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  // Issue or Return Book
  const handleAction = async (borrowId, action) => {
    const token = sessionStorage.getItem("accessToken");

    setProcessingId(borrowId);
    setMessage("");

    try {
      const response = await fetch(`/api/borrows/${borrowId}/${action}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Action failed");
      }

      setMessage(data.message || "Action successful");

      // Reload updated borrow records
      await fetchBorrows();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <h2>Loading requests...</h2>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <LogoutButton />

      <Link to="/admin/add-book">Add New Book</Link>

      <br />

      <Link to="/books">Browse Books</Link>

      <h2>All Borrow Requests</h2>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      {!error && borrows.length === 0 && <p>No borrow requests found.</p>}

      {borrows.map((borrow) => (
        <div key={borrow._id}>
          <h3>{borrow.book?.title || "Book unavailable"}</h3>

          <p>Student: {borrow.user?.name || "-"}</p>
          <p>Email: {borrow.user?.email || "-"}</p>
          <p>Status: {borrow.status}</p>
          <p>Fine: ₹{borrow.fineAmount || 0}</p>

          {borrow.status === "pending" && (
            <button
              disabled={processingId !== null}
              onClick={() => handleAction(borrow._id, "issue")}
            >
              {processingId === borrow._id ? "Processing..." : "Issue Book"}
            </button>
          )}

          {borrow.status === "issued" && (
            <button
              disabled={processingId !== null}
              onClick={() => handleAction(borrow._id, "return")}
            >
              {processingId === borrow._id ? "Processing..." : "Return Book"}
            </button>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
