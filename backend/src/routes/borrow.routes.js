import express from "express";

import { requestBook, issueBook } from "../controllers/borrow.controller.js";

import { verifyJWT, authorizeAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Student requests a book
router.post("/request", verifyJWT, requestBook);

// Admin approves and issues a book
router.patch("/:id/issue", verifyJWT, authorizeAdmin, issueBook);

export default router;


// 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZmVlZWY3NmI0OTllYzJlYzQyMWJmZiIsImlhdCI6MTc5NTA5MzU1MCwiZXhwIjoxNzk1MTc5OTUwfQ.Ll1gUvdv2FM1loEESF3rVah4ShPrKyrevOCx1Tee2u0