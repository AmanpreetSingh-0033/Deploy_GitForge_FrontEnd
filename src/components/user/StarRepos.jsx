import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import client from "../../utils/client.jsx";
import "./StarRepos.css";

const StarRepos = () => {
  const [repositories, setRepositories] = useState([]); // All starred repos
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [searchResults, setSearchResults] = useState([]); // Filtered repos
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch only the user's starred repositories
  useEffect(() => {
    const fetchStarredRepositories = async () => {
      try {
        // Get the user profile (starRepos is populated with repo objects)
        const response = await client.get(`/userProfile/${userId}`);
        const starredRepos = response.data?.user?.starRepos || [];
        setRepositories(starredRepos);
        setSearchResults(starredRepos); // Initialize search results
      } catch (err) {
        setRepositories([]);
        setSearchResults([]);
      }
    };
    if (userId) fetchStarredRepositories();
  }, [userId]);

  // Handle search input change and filter repositories
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(repositories);
    } else {
      const lower = searchQuery.toLowerCase();
      setSearchResults(
        repositories.filter(
          (repo) =>
            repo.name?.toLowerCase().includes(lower) ||
            repo.description?.toLowerCase().includes(lower) ||
            repo.owner?.username?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchQuery, repositories]);

  // Navigate to repo details page
  const handleRepoClick = (repoId) => {
    navigate(`/repo/user/${repoId}`);
  };

  return (
    <>
      <div>
        <div>
          <Navbar />
          <div className="star-repos-outer">
            <div className="star-repos-glow-container">
              <h2 className="star-repos-title">Starred Repositories</h2>
              <div className="star-repos-search-bar">
                <input
                  type="text"
                  placeholder="Search starred repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchResults.length === 0 ? (
                <div className="star-repos-empty">
                  {repositories.length === 0
                    ? "You have no starred repositories."
                    : "No repositories match your search."}
                </div>
              ) : (
                <div className="star-repos-list">
                  {searchResults.map((repo) => (
                    <div
                      key={repo._id}
                      className="star-repo-card"
                      onClick={() => handleRepoClick(repo._id)}
                      tabIndex={0}
                      role="button"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="star-repo-header">
                        <span className="star-repo-name">{repo.name}</span>
                      </div>
                      <div className="star-repo-meta">
                        <span className="star-repo-owner">
                          Owner: {repo.owner?.username || "Unknown"}
                        </span>
                        {/* <span className="star-repo-id">ID: {repo._id}</span> */}
                      </div>
                      <div className="star-repo-description">
                        {repo.description || "No description provided."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
};

export default StarRepos;
