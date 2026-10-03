const mongoose = require("mongoose");

const callRecordingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    audioPath: {
        type: String,
        required: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },

    transcript: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    keyPoints: {
      type: [String],
      default: [],
    },

    actionItems: {
      type: [String],
      default: [],
    },

    decisions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CallRecording", callRecordingSchema);