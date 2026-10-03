const supabase = require("../config/supabase");

const uploadAudio = async (fileBuffer, filePath, contentType) => {
  const { data, error } = await supabase.storage
    .from("call-recordings")
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  return data;
};

const downloadAudio = async (filePath) => {
  const { data, error } = await supabase.storage
    .from("call-recordings")
    .download(filePath);

  if (error) {
    throw new Error(`Supabase download failed: ${error.message}`);
  }

  const arrayBuffer = await data.arrayBuffer();

  return Buffer.from(arrayBuffer);
};

const fs = require("fs");
const path = require("path");
const os = require("os");

const downloadAudioToTempFile = async (filePath) => {
  const audioBuffer = await downloadAudio(filePath);

  const extension = path.extname(filePath) || ".mp3";

  const tempFilePath = path.join(
    os.tmpdir(),
    `callscribe-${Date.now()}${extension}`
  );

  fs.writeFileSync(tempFilePath, audioBuffer);

  return tempFilePath;
};

const deleteAudio = async (filePath) => {
  const { data, error } = await supabase.storage
    .from("call-recordings")
    .remove([filePath]);

  if (error) {
    throw new Error(`Supabase delete failed: ${error.message}`);
  }

  return data;
};

module.exports = {
  uploadAudio,
  downloadAudio,
  downloadAudioToTempFile,
  deleteAudio,
};