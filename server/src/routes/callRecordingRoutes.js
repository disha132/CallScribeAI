const express = require("express");

const {
  createCallRecording,
  getCallRecordings,
  getCallRecording,
  deleteCallRecording,
  updateCallRecording,
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

router.get(
  "/",
  authMiddleware,
  getCallRecordings
);

router.get(
  "/:id",
  authMiddleware,
  getCallRecording
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCallRecording
);

router.put(
  "/:id",
  authMiddleware,
  updateCallRecording
);

module.exports = router;