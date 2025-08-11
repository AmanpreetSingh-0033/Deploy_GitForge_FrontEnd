import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import client from "../../utils/client.jsx";
import "./EditRepo.css";

// Snackbar for feedback messages
function Snackbar({ open, message, onClose }) {
  if (!open) return null;
  const isSuccess = message.toLowerCase().includes("success");
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 36,
        transform: "translateX(-50%)",
        background: isSuccess ? "#00ff88" : "#ff6b6b",
        color: "#111",
        border: `2px solid ${isSuccess ? "#00ff88" : "#ff6b6b"}`,
        borderRadius: 8,
        padding: "14px 32px",
        fontSize: "1.07rem",
        fontWeight: 600,
        zIndex: 9999,
        boxShadow: `0 0 18px ${isSuccess ? "#00ff8850" : "#ff6b6b40"}`,
        minWidth: 240,
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.18s",
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

// Main EditRepo component
export default function EditRepo() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public
  const [content, setContent] = useState([""]); // array of strings
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [initialVisibility, setInitialVisibility] = useState(true);

  // Fetch repo data on mount
  useEffect(() => {
    async function fetchRepo() {
      setLoading(true);
      try {
        const res = await client.get(`/repo/${id}`);
        setName(res.data.name);
        setDescription(res.data.description || "");
        setVisibility(res.data.visibility !== false);
        setInitialVisibility(res.data.visibility !== false);
        setContent(Array.isArray(res.data.content) ? res.data.content : [""]);
      } catch (err) {
        setSnackbar({ open: true, message: "Failed to load repository data" });
      } finally {
        setLoading(false);
      }
    }
    fetchRepo();
  }, [id]);

  // Handle content change for a specific index
  const handleContentChange = (idx, value) => {
    setContent((prev) => prev.map((c, i) => (i === idx ? value : c)));
  };

  // Add new content field
  const handleAddContent = () => {
    setContent((prev) => [...prev, ""]);
  };

  // Remove a content field
  const handleRemoveContent = (idx) => {
    setContent((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update name, description, and content (send only non-empty content)
      await client.put(`/repo/update/${id}`, {
        name,
        description,
        content: content.filter((c) => c.trim() !== ""),
      });
      // Update visibility if changed
      if (visibility !== initialVisibility) {
        await client.patch(`/repo/toggle/${id}`);
      }
      setSnackbar({ open: true, message: "Repository updated successfully!" });
      setTimeout(() => navigate(-1), 900);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.error || "Failed to update repository.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          {" "}
          <Navbar />
          <div className="edit-repo-main-wrapper">
            <div className="edit-repo-content">
              <div className="edit-repo-title">Edit Repository</div>
              <form className="edit-repo-form" onSubmit={handleSubmit}>
                {/* Name Field */}
                <label className="edit-repo-label">Repository Name</label>
                <input
                  className="edit-repo-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
                {/* Description Field */}
                <label className="edit-repo-label">Description</label>
                <textarea
                  className="edit-repo-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  disabled={loading}
                />
                {/* Content Field (Array of Strings) */}
                <label className="edit-repo-label">Content</label>
                {content.map((c, idx) => (
                  <div className="edit-repo-content-row" key={idx}>
                    <textarea
                      className="edit-repo-input"
                      value={c}
                      onChange={(e) => handleContentChange(idx, e.target.value)}
                      rows={2}
                      disabled={loading}
                      placeholder={`Content #${idx + 1}`}
                    />
                    {content.length > 1 && (
                      <button
                        type="button"
                        className="edit-repo-remove-content-btn"
                        onClick={() => handleRemoveContent(idx)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="edit-repo-add-content-btn"
                  onClick={handleAddContent}
                  disabled={loading}
                >
                  + Add Content
                </button>
                {/* Visibility Field */}
                <label className="edit-repo-label">Visibility</label>
                <select
                  className="edit-repo-input"
                  value={visibility ? "public" : "private"}
                  onChange={(e) => setVisibility(e.target.value === "public")}
                  disabled={loading}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                {/* Submit Button */}
                <button
                  type="submit"
                  className="edit-repo-submit-btn"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </form>
            </div>
            <Snackbar
              open={snackbar.open}
              message={snackbar.message}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
          </div>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
}
