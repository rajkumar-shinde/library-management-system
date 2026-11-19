import { Schema, model } from "mongoose";

const borrowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    issueDate: {
      type: Date,
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    returnDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "issued", "returned", "rejected"],
      default: "pending",
    },

    fineAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    fineStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true },
);

const Borrow = model("Borrow", borrowSchema);

export default Borrow;
