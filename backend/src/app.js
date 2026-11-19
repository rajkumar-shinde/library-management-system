import express from "express";
import bookRoutes from "./routes/book.routes.js";

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

export default app;
