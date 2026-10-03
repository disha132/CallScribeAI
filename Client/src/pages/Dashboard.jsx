import { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchRecordings = async () => {
    try {
      const response = await api.get("/call-recordings");

      setRecordings(response.data.callRecordings);
    } catch (error) {
      console.error("Failed to fetch recordings:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load recordings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setUploadError("Please enter a meeting title.");
      return;
    }

    if (!audioFile) {
      setUploadError("Please select an audio file.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("audio", audioFile);

      await api.post("/call-recordings", formData);

      setTitle("");
      setAudioFile(null);

      document.getElementById("audio").value = "";

      await fetchRecordings();
    } catch (error) {
      console.error("Upload failed:", error);

      setUploadError(
        error.response?.data?.message ||
          "Failed to upload recording."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">
            CallScribe AI
          </h1>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold">
          Your Meetings
        </h2>

        <p className="mt-2 text-slate-400">
          Upload, transcribe, and analyze your conversations.
        </p>

        {/* Upload section */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">
            Upload Recording
          </h3>

          <form
            onSubmit={handleUpload}
            className="mt-5 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Meeting Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Team Meeting"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Audio File
              </label>

              <input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={(event) =>
                  setAudioFile(event.target.files[0])
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm"
              />
            </div>

            {uploadError && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {uploadError}
              </p>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading & Transcribing..."
                : "Upload Recording"}
            </button>
          </form>
        </div>

        {/* Recordings */}
        {loading && (
          <p className="mt-8 text-slate-400">
            Loading recordings...
          </p>
        )}

        {error && (
          <p className="mt-8 rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          recordings.length === 0 && (
            <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
              <h3 className="text-lg font-semibold">
                No recordings yet
              </h3>

              <p className="mt-2 text-slate-400">
                Upload your first meeting recording to
                get started.
              </p>
            </div>
          )}

        {!loading && recordings.length > 0 && (
          <div className="mt-8 grid gap-4">
            {recordings.map((recording) => (
              <div
                key={recording._id}
                onClick={() =>
                  (window.location.href = `/recordings/${recording._id}`)
                }
                className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {recording.title}
                    </h3>

                    <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        recording.status === "completed"
                        ? "bg-green-500/10 text-green-400"
                        : recording.status === "processing"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : recording.status === "failed"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-slate-700 text-slate-300"
                    }`}
                    >
                    {recording.status}
                    </span>
                    {recording.summary && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                            {recording.summary}
                        </p>
                    )}
                  </div>

                  <span className="text-sm text-slate-500">
                    {new Date(
                      recording.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;