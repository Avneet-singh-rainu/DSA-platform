const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: String,
        bookmarks: [String],
        completed: [
            {
                questionId: String,
                completedAt: { type: Date, default: Date.now() },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
