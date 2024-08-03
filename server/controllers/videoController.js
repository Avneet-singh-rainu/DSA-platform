const path = require("path");

// Upload Video
const uploadVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send({ filePath: `/uploads/${req.file.filename}` });
};

// Stream Video
const streamVideo = (req, res) => {
  const filePath = path.join(__dirname, "..", "uploads", req.params.filename);
  res.sendFile(filePath);
};

module.exports = {
  uploadVideo,
  streamVideo,
};
