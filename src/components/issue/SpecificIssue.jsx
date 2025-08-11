import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import client from "../../utils/client";
import "./SpecificIssue.css";

export default function SpecificIssue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchIssue() {
      setLoading(true);
      setError("");
      try {
        const res = await client.get(`/issue/${id}`);
        setIssue(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Failed to fetch issue details."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="specific-issue-main">
        <div className="specific-issue-main-content">
          {loading ? (
            <div className="specific-issue-loading">Loading issue...</div>
          ) : error ? (
            <div className="specific-issue-error">{error}</div>
          ) : issue ? (
            <div className="specific-issue-card">
              <div className="specific-issue-card-header">
                <h2 className="specific-issue-title">{issue.title}</h2>
                <span className={`specific-issue-status ${issue.status}`}>
                  {issue.status}
                </span>
              </div>
              <div className="specific-issue-meta">
                <span>
                  <b>Created by:</b>{" "}
                  <span className="specific-issue-owner">
                    {issue.owner?.username || "Unknown"}
                  </span>
                </span>
                <span>
                  <b>Issue ID:</b>{" "}
                  <span className="specific-issue-id">{issue._id}</span>
                </span>
              </div>
              <div className="specific-issue-description">
                {issue.description}
              </div>
              <button
                className="specific-issue-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
