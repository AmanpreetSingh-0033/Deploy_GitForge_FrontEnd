import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../utils/client.jsx";
import "./CreateIssue.css";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

export default function CreateIssue() {
  const navigate = useNavigate();
  const { id: repoId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title.trim()) {
      setError("Issue title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (description.trim().split(/\s+/).length > 100) {
      setError("Description must be at most 100 words.");
      return;
    }
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await client.post(`/issue/create/${repoId}`, {
        title,
        description,
        owner: userId,
      });
      setSuccess("Issue created successfully!");
      setTitle("");
      setDescription("");
      setTimeout(() => navigate(-1), 1000);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <div>
          <div className="create-issue-main-wrapper">
            <main className="create-issue-content">
              <h1 className="create-issue-title">Create New Issue</h1>
              <form className="create-issue-form" onSubmit={handleSubmit}>
                {/* Title Field */}
                <label htmlFor="issue-title" className="create-issue-label">
                  Issue Title <span className="required">*</span>
                </label>
                <input
                  id="issue-title"
                  className="create-issue-input"
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
                <label htmlFor="issue-desc" className="create-issue-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="issue-desc"
                  className="create-issue-input"
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

                {/* Error/Success Messages */}
                {error && <div className="create-issue-error">{error}</div>}
                {success && (
                  <div className="create-issue-success">{success}</div>
                )}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="create-issue-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Issue"}
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
