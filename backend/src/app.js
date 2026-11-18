import express from "express";
const app = express();

// Temporary book data
const books = [
  { id: 1, title: "Atomic Habits", author: "James Clear" },
  { id: 2, title: "Clean Code", author: "Robert Martin" },
];

// Get all books
app.get("/api/books", (req, res) => {
  res.json(books);
});

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
