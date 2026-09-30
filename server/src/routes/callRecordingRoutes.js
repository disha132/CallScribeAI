const express = require("express");
const {
  createCallRecording,
} = require("../controllers/callRecordingController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("audio"),
  createCallRecording
);

module.exports = router;