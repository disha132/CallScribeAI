const CallRecording = require("../models/CallRecording");
const { uploadAudio } = require("../services/storageService");

const createCallRecording = async (req, res) => {
  try {
    const { title, duration } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Audio file is required",
      });
    }

    const fileExtension = req.file.originalname.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${fileExtension}`;

    const filePath = `${req.user.userId}/${fileName}`;

    await uploadAudio(
      req.file.buffer,
      filePath,
      req.file.mimetype
    );

    const callRecording = await CallRecording.create({
      user: req.user.userId,
      title,
      audioPath: filePath,
      duration: duration || 0,
      status: "uploaded",
    });

    return res.status(201).json({
      message: "Call recording uploaded successfully",
      callRecording,
    });
  } catch (error) {
    console.error("Create call recording error:", error);

    return res.status(500).json({
      message: "Failed to create call recording",
    });
  }
};

module.exports = {
  createCallRecording,
};