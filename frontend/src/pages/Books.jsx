import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [requestingId, setRequestingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const token = sessionStorage.getItem("accessToken");
  const isAdmin = user?.role === "admin";

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Student: Request Book
  const handleRequest = async (bookId) => {
    if (!token) {
      setMessage("Please login before requesting a book.");
      return;
    }

    setRequestingId(bookId);
    setMessage("");

    try {
      const response = await fetch("/api/borrows/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      setMessage(
        data.message ||
          (response.ok ? "Book requested successfully" : "Request failed"),
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    } finally {
      setRequestingId(null);
    }
  };

  // Admin: Delete Book
  const handleDelete = async (bookId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmDelete) return;

    setDeletingId(bookId);
    setMessage("");

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));

      setMessage("Book deleted successfully");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <h2>Loading books...</h2>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Library Books</h1>

      {message && <p role="status">{message}</p>}

      {!token && (
        <p>
          Please <Link to="/login">login</Link> to request books.
        </p>
      )}

      {isAdmin && (
        <p>
          <Link to="/admin/add-book">Add New Book</Link>
        </p>
      )}

      {books.length === 0 ? (
        <p>No books available</p>
      ) : (
        books.map((book) => (
          <div key={book._id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Available Copies: {book.availableCopies}</p>

            {/* Student: Request Book */}
            {!isAdmin && (
              <button
                onClick={() => handleRequest(book._id)}
                disabled={book.availableCopies <= 0 || requestingId !== null}
              >
                {requestingId === book._id ? "Requesting..." : "Request Book"}
              </button>
            )}

            {/* Admin: Edit and Delete Book */}
            {isAdmin && (
              <div>
                <Link to={`/admin/edit-book/${book._id}`}>
                  <button type="button">Edit Book</button>
                </Link>

                <button
                  onClick={() => handleDelete(book._id)}
                  disabled={deletingId !== null}
                >
                  {deletingId === book._id ? "Deleting..." : "Delete Book"}
                </button>
              </div>
            )}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Books;
