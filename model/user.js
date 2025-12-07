// model/user.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    isAdmin: {
      type: Boolean,
      default: false,           
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
