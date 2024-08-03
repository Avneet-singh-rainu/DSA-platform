const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    bookmarks: [String],
    completed: [String],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
