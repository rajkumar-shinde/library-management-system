import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);

export default User;
