import mongoose from "mongoose";
import Book from "../models/book.model.js";
import Borrow from "../models/borrow.model.js";

const requestBook = async (req, res) => {
  try {
    const { bookId } = req.body || {};

    // 1. Validate book ID
    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    // 2. Find book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // 3. Check book availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }

    // 4. Check duplicate request
    const existingRequest = await Borrow.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ["pending", "issued"] },
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have an active request for this book",
      });
    }

    // 5. Create borrow request
    const borrow = await Borrow.create({
      user: req.user._id,
      book: bookId,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Book request submitted successfully",
      borrow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const issueBook = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate borrow request ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid borrow request ID",
      });
    }

    // 2. Find borrow request
    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow request not found",
      });
    }

    // 3. Check request status
    if (borrow.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending requests can be approved",
      });
    }

    // 4. Decrease available copies safely
    const book = await Book.findOneAndUpdate(
      {
        _id: borrow.book,
        availableCopies: { $gt: 0 },
      },
      {
        $inc: { availableCopies: -1 },
      },
      { new: true },
    );

    if (!book) {
      return res.status(400).json({
        success: false,
        message: "Book not found or no copies available",
      });
    }

    // 5. Set issue date and due date
    const issueDate = new Date();
    const dueDate = new Date(issueDate);

    dueDate.setDate(dueDate.getDate() + 14);

    borrow.issueDate = issueDate;
    borrow.dueDate = dueDate;
    borrow.status = "issued";

    await borrow.save();

    return res.status(200).json({
      success: true,
      message: "Book issued successfully",
      borrow,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { requestBook, issueBook };
