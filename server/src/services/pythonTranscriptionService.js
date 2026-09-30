const { spawn } = require("child_process");
const path = require("path");

const transcribeWithPython = (audioPath) => {
  return new Promise((resolve, reject) => {
    const projectRoot = path.resolve(__dirname, "../../../");

    const pythonPath = path.join(
      projectRoot,
      "whisper-env",
      "Scripts",
      "python.exe"
    );

    const scriptPath = path.join(
      projectRoot,
      "transcribe.py"
    );

    const pythonProcess = spawn(
      pythonPath,
      [scriptPath, audioPath]
    );

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(
            `Python transcription failed: ${errorOutput}`
          )
        );
      }

      resolve(output.trim());
    });
  });
};

module.exports = {
  transcribeWithPython,
};