const { transcribeStoredAudio } = require("../services/transcriptionService");
const { analyzeTranscript } = require("../services/geminiService");
const CallRecording = require("../models/CallRecording");
const {
  uploadAudio,
  deleteAudio,
} = require("../services/storageService");

const createCallRecording = async (req, res) => {
  try {
    const { title, duration } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Audio file is required" });
    }

    const fileExtension = req.file.originalname.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${fileExtension}`;

    const filePath = `${req.user.userId}/${fileName}`;

    await uploadAudio(req.file.buffer, filePath, req.file.mimetype);

    const callRecording = await CallRecording.create({
      user: req.user.userId,
      title,
      audioPath: filePath,
      duration: duration || 0,
      status: "uploaded",
    });

    callRecording.status = "processing";
    await callRecording.save();

    try {
      // Step 1: Transcribe audio
      const transcript = await transcribeStoredAudio(
        callRecording.audioPath
      );

      callRecording.transcript = transcript;

      // Step 2: Analyze transcript with Gemini
      const analysis = await analyzeTranscript(transcript);

      callRecording.summary = analysis.summary;
      callRecording.keyPoints = analysis.keyPoints;
      callRecording.actionItems = analysis.actionItems;
      callRecording.decisions = analysis.decisions;

      // Step 3: Mark processing as completed
      callRecording.status = "completed";

      await callRecording.save();
    } catch (error) {
      console.error("Transcription/AI analysis error:", error);

      callRecording.status = "failed";
      await callRecording.save();
    }

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

const getCallRecordings = async (req, res) => {
  try {
    const callRecordings = await CallRecording.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({ callRecordings });
  } catch (error) {
    console.error("Get call recordings error:", error);

    return res.status(500).json({
      message: "Failed to fetch call recordings",
    });
  }
};

const getCallRecording = async (req, res) => {
  try {
    const callRecording = await CallRecording.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!callRecording) {
      return res.status(404).json({
        message: "Call recording not found",
      });
    }

    return res.status(200).json({ callRecording });
  } catch (error) {
    console.error("Get call recording error:", error);

    return res.status(500).json({
      message: "Failed to fetch call recording",
    });
  }
};

const deleteCallRecording = async (req, res) => {
  try {
    const callRecording = await CallRecording.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!callRecording) {
      return res.status(404).json({
        message: "Call recording not found",
      });
    }

    await deleteAudio(callRecording.audioPath);

    await CallRecording.deleteOne({
      _id: callRecording._id,
    });

    return res.status(200).json({
      message: "Call recording deleted successfully",
    });
  } catch (error) {
    console.error("Delete call recording error:", error);

    return res.status(500).json({
      message: "Failed to delete call recording",
    });
  }
};

const updateCallRecording = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const callRecording = await CallRecording.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      { title },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!callRecording) {
      return res.status(404).json({
        message: "Call recording not found",
      });
    }

    return res.status(200).json({
      message: "Call recording updated successfully",
      callRecording,
    });
  } catch (error) {
    console.error("Update call recording error:", error);

    return res.status(500).json({
      message: "Failed to update call recording",
    });
  }
};

module.exports = {
  createCallRecording,
  getCallRecordings,
  getCallRecording,
  deleteCallRecording,
  updateCallRecording,
};