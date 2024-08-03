const express = require("express");
const { uploadVideo, streamVideo } = require("../controllers/videoController");
const router = express.Router();
const upload = require("../middlewares/multerMiddleware");

// Upload video
router.post("/upload", upload.single("video"), uploadVideo);

// Stream video
router.get("/:filename", streamVideo);

module.exports = router;
