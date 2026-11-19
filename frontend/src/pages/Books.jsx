import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [requestingId, setRequestingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const token = sessionStorage.getItem("accessToken");

  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isAdmin = Boolean(token && user?.role === "admin");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        setBooks(Array.isArray(data) ? data : data.books || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

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

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage(data.message || "Book requested successfully!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setRequestingId(null);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

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

      setBooks((prev) => prev.filter((book) => book._id !== bookId));

      setMessage("Book deleted successfully!");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBooks = books.filter((book) => {
    const query = search.toLowerCase();

    return (
      (book.title || "").toLowerCase().includes(query) ||
      (book.author || "").toLowerCase().includes(query) ||
      (book.category || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="books-page">
      <div className="books-header">
        <div>
          <h1>Library Books</h1>
          <p>Explore and manage our library collection.</p>
        </div>

        {isAdmin && (
          <Link className="primary-link" to="/admin/add-book">
            + Add New Book
          </Link>
        )}
      </div>

      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}

      <input
        className="book-search"
        type="search"
        placeholder="Search by title, author or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {!token && (
        <p>
          Please <Link to="/login">login</Link> to request books.
        </p>
      )}

      {loading ? (
        <p>Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div className="book-card" key={book._id}>
              <div className="book-icon">📖</div>

              <h3>{book.title}</h3>

              <p>
                <strong>Author:</strong> {book.author}
              </p>

              <p>
                <strong>Category:</strong> {book.category}
              </p>

              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>

              <p>
                <strong>Available:</strong> {book.availableCopies}
              </p>

              <span
                className={
                  book.availableCopies > 0
                    ? "availability available"
                    : "availability unavailable"
                }
              >
                {book.availableCopies > 0 ? "Available" : "Out of Stock"}
              </span>

              <div className="book-actions">
                {!isAdmin && (
                  <button
                    onClick={() => handleRequest(book._id)}
                    disabled={
                      book.availableCopies <= 0 || requestingId !== null
                    }
                  >
                    {requestingId === book._id
                      ? "Requesting..."
                      : "Request Book"}
                  </button>
                )}

                {isAdmin && (
                  <>
                    <Link
                      className="edit-btn"
                      to={`/admin/edit-book/${book._id}`}
                    >
                      Edit Book
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(book._id)}
                      disabled={deletingId !== null}
                    >
                      {deletingId === book._id ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;
