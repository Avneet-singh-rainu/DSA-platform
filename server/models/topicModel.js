const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    desc: String,
difficulty: String ,
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    videoUrl: String,
    //isBookmarked: Boolean,
    //isCompleted: Boolean,
    tags: [String],
    link:String,
    code: [String],
    exampleImages :[String],
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
