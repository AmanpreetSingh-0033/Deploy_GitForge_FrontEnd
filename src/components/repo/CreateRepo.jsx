import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import client from "../../utils/client.jsx";
import "./CreateRepo.css";

export default function CreateRepo() {
  const navigate = useNavigate();
  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public, false = private
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validation: name required, description required and max 10 words
    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount > 100) {
      setError("Description must be at most 100 words.");
      return;
    }
    if (!userId) {
      setError("User not logged in.");
      return;
    }
    setLoading(true);
    try {
      // Debug log
      console.log("Submitting repo:", {
        name,
        description,
        visibility,
        owner: userId,
      });
      const res = await client.post("/repo/create", {
        name,
        description,
        visibility,
        owner: userId,
      });
      setSuccess("Repository created successfully!");
      setName("");
      setDescription("");
      setVisibility(true);
      // Redirect to profile page after short delay
      setTimeout(() => navigate("/profile"), 700);
      console.log("Repo created:", res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create repository.");
      console.error("Repo creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Visibility toggle handler
  const handleToggle = () => {
    setVisibility((v) => !v);
    console.log("Visibility toggled:", !visibility);
  };

  return (
    <>
      <div>
        <div>
          <div className="create-repo-main-wrapper">
            <Navbar />
            <main className="create-repo-content">
              <h1 className="create-repo-title">Create New Repository</h1>
              <form className="create-repo-form" onSubmit={handleSubmit}>
                {/* Name Field */}
                <label htmlFor="repo-name" className="create-repo-label">
                  Repository Name <span className="required">*</span>
                </label>
                <input
                  id="repo-name"
                  className="create-repo-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter repository name"
                  autoComplete="off"
                  disabled={loading}
                />
                {/* Description Field */}
                <label htmlFor="repo-desc" className="create-repo-label">
                  Description <span className="required">*</span>
                  <span className="desc-hint"></span>
                </label>
                <textarea
                  id="repo-desc"
                  className="create-repo-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter description (max 100 words)"
                  rows={2}
                  disabled={loading}
                />
                {/* Visibility Toggle */}
                <div className="create-repo-toggle-row">
                  <span className="create-repo-label">Visibility:</span>
                  <div
                    className={`toggle-switch ${visibility ? "on" : "off"}`}
                    onClick={handleToggle}
                  >
                    <div className="toggle-knob" />
                    <span className="toggle-label">
                      {visibility ? "Public" : "Private"}
                    </span>
                  </div>
                </div>
                {/* Hidden Owner Field for Debug */}
                <input type="hidden" value={userId} name="owner" />
                {/* Error/Success Messages */}
                {error && <div className="create-repo-error">{error}</div>}
                {success && (
                  <div className="create-repo-success">{success}</div>
                )}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="create-repo-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Repository"}
                </button>
              </form>
            </main>
          </div>
        </div>
        <div style={{ marginTop: "4rem" }}>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
}
