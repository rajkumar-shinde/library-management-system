import express from "express";

import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";

import { verifyJWT, authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Anyone can view books
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Only admin can modify books
router.post("/", verifyJWT, authorizeAdmin, createBook);
router.patch("/:id", verifyJWT, authorizeAdmin, updateBook);
router.delete("/:id", verifyJWT, authorizeAdmin, deleteBook);

export default router;
