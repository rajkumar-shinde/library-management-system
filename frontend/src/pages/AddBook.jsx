import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = sessionStorage.getItem("accessToken");

      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          totalCopies: Number(form.totalCopies),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      alert("Book added successfully!");
      navigate("/books");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Book</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Book Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />

        <input
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="totalCopies"
          min="1"
          value={form.totalCopies}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <Link to="/admin">Back to Admin Dashboard</Link>
    </div>
  );
}

export default AddBook;
