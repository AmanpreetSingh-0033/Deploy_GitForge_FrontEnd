import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import "./SpecificRepo.css";
import client from "../../utils/client.jsx";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import JSZip from "jszip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

// Snackbar for feedback messages
function Snackbar({ open, message, onClose }) {
  if (!open) return null;
  const isSuccess =
    message.toLowerCase().includes("success") ||
    message.toLowerCase().includes("deleted");
  return (
    <div
      className={`snackbar ${
        isSuccess ? "snackbar-success" : "snackbar-error"
      }`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

// Helper: recursively build a tree from FileList
function buildFileTree(files) {
  const root = {};
  for (const file of files) {
    const parts = file.webkitRelativePath
      ? file.webkitRelativePath.split("/")
      : [file.name];
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        node[part] = { file };
      } else {
        node[part] = node[part] || {};
        node = node[part];
      }
    }
  }
  return root;
}

// Helper: render file/folder tree with toggles
function FileTree({
  tree,
  onFileClick,
  path = "",
  expandedFolders,
  setExpandedFolders,
}) {
  return (
    <ul className="file-tree-list">
      {Object.entries(tree).map(([name, value]) => {
        const thisPath = path + name + "/";
        if (value.file) {
          return (
            <li
              className="file-tree-file"
              key={path + name}
              onClick={() => onFileClick(value.file, name)}
              title={name}
            >
              <span className="file-icon" role="img" aria-label="file">
                📄
              </span>
              <span className="file-name">{name}</span>
            </li>
          );
        } else {
          const isExpanded = !!expandedFolders[thisPath];
          return (
            <li className="file-tree-folder" key={thisPath}>
              <div className="folder-header">
                <span
                  className="folder-toggle"
                  onClick={() =>
                    setExpandedFolders((prev) => ({
                      ...prev,
                      [thisPath]: !prev[thisPath],
                    }))
                  }
                >
                  {isExpanded ? "▼" : "▶"}
                </span>
                <span className="folder-icon" role="img" aria-label="folder">
                  📁
                </span>
                <span className="folder-name">{name}</span>
              </div>
              {isExpanded && (
                <FileTree
                  tree={value}
                  onFileClick={onFileClick}
                  path={thisPath}
                  expandedFolders={expandedFolders}
                  setExpandedFolders={setExpandedFolders}
                />
              )}
            </li>
          );
        }
      })}
    </ul>
  );
}

export default function SpecificRepo() {
  const userId = localStorage.getItem("userId");
  const { id: repoId } = useParams();
  const { id: id } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  // Repo and issues state
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [issueLoading, setIssueLoading] = useState(true);
  const [error, setError] = useState("");
  const [issueError, setIssueError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [downloading, setDownloading] = useState(false);

  // State for star functionality
  const [starred, setStarred] = useState(false);
  const [starLoading, setStarLoading] = useState(true);
  const [starInitialized, setStarInitialized] = useState(false);

  // Upload state
  const [cloudFileTree, setCloudFileTree] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});

  // 1. Fetch current uploaded folder from S3 on mount
  useEffect(() => {
    async function fetchCloudFolder() {
      if (!repo || !repo.owner) return;
      try {
        const res = await client.get(
          `/repo/list-upload/${repo.owner._id}/${repoId}`
        );
        setCloudFileTree(res.data.tree);
        setFileTree(res.data.tree);
        setUploadedFiles([]);
        setExpandedFolders({});
        console.log("Fetched cloud folder:", res.data.tree);
      } catch (err) {
        setCloudFileTree({});
        setFileTree({});
        setUploadedFiles([]);
        setExpandedFolders({});
        console.log("No uploaded folder found or error:", err);
      }
    }
    fetchCloudFolder();
  }, [repo, repoId]);

  // 2. When user uploads a new folder, replace local state (UI)
  const handleUploadChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
    setFileTree(buildFileTree(files));
    setExpandedFolders({});
    console.log("New folder uploaded locally:", files);
  };

  // 3. On "Save changes", upload to backend and refresh cloud view
  const handleSaveChanges = async () => {
    if (!uploadedFiles.length) return;
    setLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((f) =>
      formData.append("files", f, f.webkitRelativePath || f.name)
    );
    try {
      await client.post(`/repo/upload/${userId}/${repoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Files uploaded to cloud.");
      const res = await client.get(`/repo/list-upload/${userId}/${repoId}`);
      setCloudFileTree(res.data.tree);
      setFileTree(res.data.tree);
      setUploadedFiles([]);
      setExpandedFolders({});
    } catch (err) {
      console.log("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to recursively add files to zip
  const addFilesToZipAsync = async (zip, tree, path = "") => {
    for (const [name, value] of Object.entries(tree)) {
      if (value.file) {
        if (value.file instanceof File || value.file instanceof Blob) {
          zip.file(path + name, value.file);
        } else {
          try {
            const res = await client.get(
              `/repo/get-uploaded-file/${
                repo.owner._id
              }/${repoId}?filePath=${encodeURIComponent(path + name)}`,
              { responseType: "blob" }
            );
            zip.file(path + name, res.data);
          } catch (err) {
            zip.file(
              path + name + ".error.txt",
              "Failed to fetch file from server."
            );
          }
        }
      } else {
        const folder = zip.folder(path + name);
        await addFilesToZipAsync(folder, value, "");
      }
    }
  };

  const handleDownloadAllFiles = async () => {
    if (!fileTree || Object.keys(fileTree).length === 0) {
      setSnackbar({ open: true, message: "No files to download!" });
      return;
    }
    setDownloading(true);
    try {
      const zip = new JSZip();
      await addFilesToZipAsync(zip, fileTree);

      const repoName = repo?.name || "repository";
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${repoName}.zip`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      setSnackbar({ open: true, message: "Files downloaded successfully!" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to download files." });
    } finally {
      setDownloading(false);
    }
  };

  // Fetch repo data
  useEffect(() => {
    async function fetchRepo() {
      setLoading(true);
      setError("");
      try {
        const res = await client.get(`/repo/${id}`);
        setRepo(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Failed to fetch repository details."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRepo();
  }, [id]);

  // Fetch issues
  useEffect(() => {
    async function fetchIssues() {
      setIssueLoading(true);
      setIssueError("");
      try {
        const res = await client.get(`/issue/all/${id}`);
        setIssues(res.data.issues || []);
      } catch (err) {
        setIssueError(
          err?.response?.data?.error ||
            "Failed to fetch issues for this repository."
        );
        setIssues([]);
      } finally {
        setIssueLoading(false);
      }
    }
    fetchIssues();
  }, [id]);

  // Check if repo is starred by current user
  const checkIfStarred = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !repo?._id) {
      setStarred(false);
      setStarLoading(false);
      setStarInitialized(true);
      return;
    }

    try {
      const res = await client.get(`/userProfile/${userId}`);
      const isStarred = res.data.user.starRepos.some((id) => id === repo._id);
      setStarred(isStarred);
    } catch (err) {
      console.error("Error checking star status:", err);
      setStarred(false);
    } finally {
      setStarLoading(false);
      setStarInitialized(true);
    }
  }, [repo?._id]);

  // Check star status when component mounts or repo changes
  useEffect(() => {
    if (repo?._id) {
      checkIfStarred();
    }
  }, [repo?._id, checkIfStarred]);

  // Handle star/unstar action
  const handleStarClick = async (e) => {
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSnackbar({
        open: true,
        message: "Please log in to star repositories.",
        error: true,
      });
      return;
    }

    if (!repo?._id) return;

    setStarLoading(true);
    try {
      const res = await client.patch(`/starrepo/${userId}/${repo._id}`);
      const newStarred = res.data.action === "starred";
      setStarred(newStarred);

      setSnackbar({
        open: true,
        message: newStarred ? "Repository starred!" : "Repository unstarred.",
        error: false,
      });
    } catch (err) {
      console.error("Error toggling star:", err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.error || "Failed to update star status.",
        error: true,
      });
    } finally {
      setStarLoading(false);
    }
  };

  // Handle Edit Repo
  const handleEditRepo = () => {
    navigate(`/repo/update/${id}`);
  };

  // Handle Delete Repo
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this repository? This action cannot be undone."
      )
    )
      return;
    setDeleting(true);
    try {
      const res = await client.delete(`/repo/delete/${id}`);
      setSnackbar({
        open: true,
        message: res.data.message || "Repository deleted successfully!",
      });
      setTimeout(() => {
        setSnackbar({ open: false, message: "" });
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to delete repository.",
      });
      setTimeout(() => setSnackbar({ open: false, message: "" }), 2200);
    } finally {
      setDeleting(false);
    }
  };

  // Handle File Click in Tree
  const handleFileClick = async (file, name, path) => {
    path = path || "";

    if (file instanceof Blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedFileContent(e.target.result);
        setSelectedFileName(name);
      };
      reader.readAsText(file);
    } else {
      setSelectedFileContent("Loading...");
      try {
        const res = await client.get(
          `/repo/get-uploaded-file/${
            repo.owner._id
          }/${repoId}?filePath=${encodeURIComponent(path + name)}`
        );
        setSelectedFileContent(
          res.data.content || res.data || "No content found."
        );
        setSelectedFileName(name);
      } catch (err) {
        console.log(err);
        setSelectedFileContent(
          "Cannot preview this file (failed to fetch from cloud)."
        );
        setSelectedFileName(name);
      }
    }
  };

  const copyToClipboard = (text, callback) => {
    navigator.clipboard.writeText(text).then(() => callback());
  };

  const handleCreateIssue = () => {
    navigate(`/issue/create/${id}`);
  };

  const handleEditIssue = (issueId) => {
    navigate(`/issue/update/${issueId}`);
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await client.delete(`/issue/delete/${issueId}`);
      setIssues((prevIssues) =>
        prevIssues.filter((issue) => issue._id !== issueId)
      );
      setSnackbar({
        open: true,
        message: res.data?.message || "Issue deleted successfully!",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.error || "Failed to delete issue.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <div className="specific-repo-container">
            <Navbar />
            <div className="specific-repo-wrapper">
              {/* LEFT MAIN PANEL */}
              <div className="specific-repo-left">
                {/* Owner Panel */}
                <div className="specific-repo-owner-panel">
                  {loading ? (
                    <span className="loading-text">Loading owner...</span>
                  ) : error ? (
                    <span className="specific-repo-empty">{error}</span>
                  ) : repo && repo.owner ? (
                    <>
                      <span className="owner-label">Owner:</span>
                      <span className="owner-name">
                        {repo.owner.username ||
                          repo.owner.name ||
                          repo.owner.email ||
                          "Unknown"}
                      </span>
                    </>
                  ) : (
                    <span className="specific-repo-empty">
                      Owner info not available.
                    </span>
                  )}
                </div>

                {/* Content Panel */}
                <div className="specific-repo-content-panel">
                  <div className="repo-header">
                    {loading ? (
                      <span className="loading-text">
                        Loading repository...
                      </span>
                    ) : error ? (
                      <span className="specific-repo-empty">{error}</span>
                    ) : repo ? (
                      <>
                        <div className="repo-name-section">
                          <span className="repo-name">{repo.name}</span>
                          <div className="repo-actions">
                            {starInitialized && (
                              <button
                                onClick={handleStarClick}
                                disabled={starLoading}
                                className="star-button"
                                title={
                                  starred
                                    ? "Unstar this repository"
                                    : "Star this repository"
                                }
                              >
                                {starred ? (
                                  <StarIcon className="star-icon starred" />
                                ) : (
                                  <StarBorderIcon className="star-icon" />
                                )}
                                <span className="star-text">
                                  {starred ? "Starred" : "Star"}
                                </span>
                              </button>
                            )}
                            {repo.owner &&
                              String(repo.owner._id) ===
                                String(localStorage.getItem("userId")) && (
                                <div className="owner-actions">
                                  <button
                                    className="repo-action-btn repo-edit-btn"
                                    onClick={handleEditRepo}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="repo-action-btn repo-delete-btn"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                  >
                                    {deleting ? "Deleting..." : "Delete"}
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="specific-repo-empty">
                        Repository not found.
                      </span>
                    )}
                  </div>

                  <div className="repo-content-area">
                    {loading ? (
                      <span className="loading-text">Loading content...</span>
                    ) : error ? (
                      <span className="specific-repo-empty">{error}</span>
                    ) : repo && repo.content && repo.content.length > 0 ? (
                      repo.content.map((c, idx) => (
                        <div key={idx} className="content-item">
                          {c}
                        </div>
                      ))
                    ) : (
                      <span className="specific-repo-empty">
                        No content found for this repository.
                      </span>
                    )}
                  </div>
                </div>

                {/* Upload Files/Folders Panel */}
                <div className="specific-repo-upload-panel">
                  <div className="upload-panel-header">
                    <span className="upload-panel-title">Uploaded Files</span>
                    {repo &&
                      repo.owner &&
                      String(repo.owner._id) ===
                        String(localStorage.getItem("userId")) && (
                        <button
                          className="save-changes-btn"
                          onClick={handleSaveChanges}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save changes"}
                        </button>
                      )}
                  </div>

                  {repo &&
                    repo.owner &&
                    String(repo.owner._id) ===
                      String(localStorage.getItem("userId")) && (
                      <label className="upload-btn-label">
                        <input
                          type="file"
                          multiple
                          webkitdirectory="true"
                          directory="true"
                          className="upload-btn-input"
                          onChange={handleUploadChange}
                          disabled={loading}
                        />
                        <span
                          className={`upload-btn${loading ? " disabled" : ""}`}
                        >
                          Upload Files or Folders
                        </span>
                      </label>
                    )}

                  {/* File tree and download */}
                  {fileTree &&
                    typeof fileTree === "object" &&
                    Object.keys(fileTree).length > 0 && (
                      <div className="file-tree-wrapper">
                        <div className="file-tree-container">
                          <FileTree
                            tree={fileTree}
                            onFileClick={handleFileClick}
                            expandedFolders={expandedFolders}
                            setExpandedFolders={setExpandedFolders}
                          />
                        </div>
                        <button
                          className="download-all-btn"
                          onClick={handleDownloadAllFiles}
                          disabled={downloading}
                          title={
                            downloading
                              ? "Downloading..."
                              : "Download all files as zip"
                          }
                        >
                          <DownloadIcon className="download-icon" />
                        </button>
                      </div>
                    )}

                  {/* File preview */}
                  {selectedFileContent && (
                    <div className="file-preview-container">
                      <div className="file-preview-header">
                        <span className="file-preview-title">
                          {selectedFileName}
                        </span>
                        <button
                          className="copy-btn"
                          onClick={() => {
                            copyToClipboard(selectedFileContent, () =>
                              setSnackbar({
                                open: true,
                                message: "File content copied!",
                              })
                            );
                          }}
                          title="Copy file content"
                        >
                          <ContentCopyIcon className="copy-icon" />
                        </button>
                      </div>
                      <pre className="file-preview-content">
                        {selectedFileContent}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="specific-repo-right">
                {/* Description Panel */}
                <div className="specific-repo-description-panel">
                  <div className="desc-title">Description</div>
                  <div className="desc-content">
                    {loading
                      ? "Loading..."
                      : repo && repo.description
                      ? repo.description
                      : "No description provided."}
                  </div>
                </div>

                {/* Issues Panel */}
                <div className="specific-repo-issues-panel">
                  <div className="issues-header">
                    <span className="issues-title">Issues</span>
                    <button
                      className="create-issue-btn"
                      onClick={handleCreateIssue}
                      title="Create new issue"
                    >
                      <AddIcon className="add-icon" />
                    </button>
                  </div>

                  <div className="specific-repo-issues-list">
                    {issueLoading ? (
                      <span className="loading-text">Loading issues...</span>
                    ) : issueError ? (
                      <span className="specific-repo-empty">{issueError}</span>
                    ) : issues.length > 0 ? (
                      issues.map((issue, idx) => (
                        <div
                          className="specific-repo-issue"
                          key={issue._id || idx}
                        >
                          <div className="issue-action-icons">
                            {currentUserId === String(issue.owner._id) && (
                              <button
                                className="issue-action-btn"
                                onClick={() => handleEditIssue(issue._id)}
                                title="Edit issue"
                              >
                                <EditIcon className="issue-edit-icon" />
                              </button>
                            )}
                            {(currentUserId === String(issue.owner._id) ||
                              (repo &&
                                repo.owner &&
                                currentUserId === String(repo.owner._id))) && (
                              <button
                                className="issue-action-btn"
                                onClick={() => handleDeleteIssue(issue._id)}
                                title="Delete issue"
                              >
                                <DeleteIcon className="issue-delete-icon" />
                              </button>
                            )}
                          </div>

                          <div
                            className="issue-content"
                            onClick={() => navigate(`/issue/${issue._id}`)}
                          >
                            <div className="issue-title">{issue.title}</div>
                            <div className="issue-desc">
                              {issue.description}
                            </div>
                            <div className="issue-status">
                              Status: {issue.status}
                            </div>
                            <div className="issue-creator">
                              Created by:{" "}
                              {issue.owner &&
                              (issue.owner.name || issue.owner.username)
                                ? issue.owner.name || issue.owner.username
                                : "Unknown"}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="specific-repo-empty">
                        No issues found for this repository.
                      </span>
                    )}
                  </div>
                </div>
              </div>
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
