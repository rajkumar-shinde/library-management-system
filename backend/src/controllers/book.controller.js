import Book from "../models/book.model.js";

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

export { createBook };
