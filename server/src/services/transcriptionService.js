const fs = require("fs/promises");

const {
  downloadAudioToTempFile,
} = require("./storageService");

const {
  transcribeWithPython,
} = require("./pythonTranscriptionService");

const transcribeStoredAudio = async (audioPath) => {
  const tempFilePath = await downloadAudioToTempFile(audioPath);

  try {
    const transcript = await transcribeWithPython(tempFilePath);

    return transcript;
  } finally {
    try {
      await fs.unlink(tempFilePath);
    } catch (error) {
      console.error(
        "Failed to delete temporary audio file:",
        error.message
      );
    }
  }
};

module.exports = {
  transcribeStoredAudio,
};