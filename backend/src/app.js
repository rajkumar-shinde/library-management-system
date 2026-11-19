import express from "express";
import bookRoutes from "./routes/book.routes.js";
import userRoutes from "./routes/user.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/borrows", borrowRoutes);

app.get("/", (req, res) => {
  res.send("Library Management API is running");
});

export default app;
