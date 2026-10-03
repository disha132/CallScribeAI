import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function RecordingDetails() {
  const { id } = useParams();

  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recording?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/call-recordings/${id}`);

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to delete recording:", error);
      setError(
        error.response?.data?.message || "Failed to delete recording"
      );
    }
  };

  const handleEdit = () => {
    setEditedTitle(recording.title);
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditedTitle("");
    setIsEditing(false);
    setError("");
  };

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await api.put(`/call-recordings/${id}`, {
        title: editedTitle.trim(),
      });

      setRecording(response.data.callRecording);
      setIsEditing(false);
      setEditedTitle("");
    } catch (error) {
      console.error("Failed to update recording:", error);
      setError(
        error.response?.data?.message || "Failed to update recording"
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const response = await api.get(`/call-recordings/${id}`);

        setRecording(response.data.callRecording);
      } catch (error) {
        console.error("Failed to fetch recording:", error);
        setError(
          error.response?.data?.message || "Failed to load recording"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecording();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-slate-400">Loading recording...</p>
      </div>
    );
  }

  if (error && !recording) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-white">
        <p className="text-red-400">{error}</p>

        <Link
          to="/dashboard"
          className="mt-4 inline-block text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            to="/dashboard"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="flex max-w-xl gap-3">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(event) =>
                      setEditedTitle(event.target.value)
                    }
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={handleSaveTitle}
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="rounded-lg bg-slate-700 px-4 py-2 font-medium hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold">
                    {recording.title}
                  </h1>

                  <p className="mt-2 text-sm text-slate-400">
                    Status: {recording.status}
                  </p>
                </>
              )}
            </div>

            <span className="text-sm text-slate-500">
              {new Date(recording.createdAt).toLocaleDateString()}
            </span>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="mt-5 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
            >
              Edit Title
            </button>
          )}

          {/* AI Summary */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              AI Summary
            </h2>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-5">
              <p className="leading-7 text-slate-300">
                {recording.summary || "No summary available."}
              </p>
            </div>
          </div>

          {/* Key Points */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Key Points
            </h2>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-5">
              {recording.keyPoints?.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {recording.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">
                  No key points available.
                </p>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Action Items
            </h2>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-5">
              {recording.actionItems?.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {recording.actionItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">
                  No action items available.
                </p>
              )}
            </div>
          </div>

          {/* Decisions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Decisions
            </h2>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-5">
              {recording.decisions?.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {recording.decisions.map((decision, index) => (
                    <li key={index}>{decision}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">
                  No decisions available.
                </p>
              )}
            </div>
          </div>

          {/* Transcript */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">
              Transcript
            </h2>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950 p-5">
              {recording.transcript ? (
                <p className="whitespace-pre-wrap leading-7 text-slate-300">
                  {recording.transcript}
                </p>
              ) : (
                <p className="text-slate-500">
                  No transcript available.
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="mt-6 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Delete */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-5 py-3 font-medium hover:bg-red-500"
            >
              Delete Recording
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecordingDetails;