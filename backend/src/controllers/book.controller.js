import Book from "../models/book.model.js";
import mongoose from "mongoose";

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies } = req.body;

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies,
      availableCopies: totalCopies,
    });

    return res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      totalBooks: books.length,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Check valid ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // Step 2: Find book
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Step 3: Update book details
    const { title, author, isbn, category } = req.body;

    if (title !== undefined) {
      book.title = title;
    }

    if (author !== undefined) {
      book.author = author;
    }

    if (isbn !== undefined) {
      book.isbn = isbn;
    }

    if (category !== undefined) {
      book.category = category;
    }

    // Step 4: Save updated book
    await book.save();

    // Step 5: Send response
    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // Find book
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Delete book from MongoDB
    await Book.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { createBook, getAllBooks, getBookById, updateBook, deleteBook };

//
// API          Method	        Status
// Create        Book	        POST	✅
// Get           All Books     	GET	✅
// Get           Single Book	GET	✅
// Update        Book	        PATCH	✅
// Delete        Book	        DELETE	✅
//
