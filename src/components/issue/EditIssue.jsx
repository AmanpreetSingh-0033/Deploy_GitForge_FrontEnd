import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../utils/client.jsx";
import "./EditIssue.css";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

export default function EditIssue() {
  const navigate = useNavigate();
  const { id: issueId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [repoId, setRepoId] = useState("");

  useEffect(() => {
    async function fetchIssue() {
      setError("");
      setLoading(true);
      try {
        const res = await client.get(`/issue/${issueId}`);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setStatus(res.data.status);
        setRepoId(res.data.repository);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to fetch issue.");
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [issueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim()) {
      setError("Issue title is required.");
      return;
    }
    if (title.trim().length > 15) {
      setError("Title must be at most 15 characters.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (description.trim().length > 150) {
      setError("Description must be at most 150 characters.");
      return;
    }
    setLoading(true);
    try {
      await client.put(`/issue/update/${issueId}`, {
        title,
        description,
        status,
      });
      setSuccess("Issue updated successfully!");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to update issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <div className="edit-issue-main-wrapper">
            <Navbar />
            <main className="edit-issue-content">
              <h1 className="edit-issue-title">Edit Issue</h1>
              <form className="edit-issue-form" onSubmit={handleSubmit}>
                {/* Title Field */}
                <label htmlFor="issue-title" className="edit-issue-label">
                  Issue Title <span className="required">*</span>
                </label>
                <input
                  id="issue-title"
                  className="edit-issue-input"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 15) setTitle(value);
                  }}
                  placeholder="Enter issue title (max 15 chars)"
                  autoComplete="off"
                  disabled={loading}
                />
                <small style={{ color: "#e0e1dd", textAlign: "right" }}>
                  {title.length}/15
                </small>

                {/* Description Field */}
                <label htmlFor="issue-desc" className="edit-issue-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="issue-desc"
                  className="edit-issue-input"
                  value={description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 150) setDescription(value);
                  }}
                  placeholder="Enter description (max 150 chars)"
                  rows={3}
                  disabled={loading}
                />
                <small style={{ color: "#e0e1dd", textAlign: "right" }}>
                  {description.length}/150
                </small>

                {/* Status Field */}
                <label htmlFor="issue-status" className="edit-issue-label">
                  Status <span className="required">*</span>
                </label>
                <select
                  id="issue-status"
                  className="edit-issue-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
                {/* Error/Success Messages */}
                {error && <div className="edit-issue-error">{error}</div>}
                {success && <div className="edit-issue-success">{success}</div>}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="edit-issue-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Issue"}
                </button>
              </form>
            </main>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
