import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load book");
        }

        const book = data.book || data;

        setForm({
          title: book.title || "",
          author: book.author || "",
          isbn: book.isbn || "",
          category: book.category || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = sessionStorage.getItem("accessToken");

      const response = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      alert("Book updated successfully!");
      navigate("/books");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h2>Loading book...</h2>;

  return (
    <div>
      <h1>Edit Book</h1>

      {error && <p role="alert">{error}</p>}

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

        <button type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update Book"}
        </button>
      </form>

      <p>
        <Link to="/books">Back to Books</Link>
      </p>
    </div>
  );
}

export default EditBook;
