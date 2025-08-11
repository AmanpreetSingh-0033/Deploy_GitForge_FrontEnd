import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import client from "../../utils/client.jsx";
import "./Navsearch.css";

const NavSearch = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repoError, setRepoError] = useState("");
  const [userError, setUserError] = useState("");
  useEffect(() => {
    if (!query) {
      setLoading(false);
      setRepoError("No search query provided.");
      setUserError("No search query provided.");
      return;
    }

    setLoading(true);
    setRepoError("");
    setUserError("");

    // Fetch repositories matching the query
    const fetchRepos = client
      .get(`/repo/name/${query}`)
      .then((res) => {
        if (
          res.data &&
          res.data.repositories &&
          res.data.repositories.length > 0
        ) {
          setRepos(res.data.repositories);
          setRepoError("");
        } else {
          setRepos([]);
          setRepoError("No repositories found matching your query.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setRepos([]);
          setRepoError("No repositories found matching your query.");
        } else {
          setRepos([]);
          setRepoError("Error fetching repositories.");
        }
      });

    // Fetch users matching the query
    const fetchUsers = client
      .get(`/user/name/${query}`)
      .then((res) => {
        if (res.data && res.data.users && res.data.users.length > 0) {
          setUsers(res.data.users);
          setUserError("");
        } else {
          setUsers([]);
          setUserError("No users found matching your query.");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setUsers([]);
          setUserError("No users found matching your query.");
        } else {
          setUsers([]);
          setUserError("Error fetching users.");
        }
      });

    // Wait for both
    Promise.all([fetchRepos, fetchUsers]).then(() => setLoading(false));
  }, [query]);
  // Navigation handlers
  const handleRepoClick = (repoId) => navigate(`/repo/user/${repoId}`);
  const handleUserClick = (userId) => navigate(`/profile/${userId}`);

  return (
    <>
      <div>
        <div>
          <Navbar />
          <div className="navsearch-main">
            <h2 className="navsearch-title">
              Search Results for:{" "}
              <span className="navsearch-query">{query}</span>
            </h2>
            <div className="navsearch-columns">
              {/* Repositories Section */}

              <div className="navsearch-column navsearch-repo-col">
                <div className="navsearch-section-title">Repositories</div>
                {loading ? (
                  <div className="navsearch-loading">Loading...</div>
                ) : repoError ? (
                  <div className="navsearch-error">{repoError}</div>
                ) : (
                  repos.map((repo) => (
                    <div
                      key={repo._id}
                      className="navsearch-repo-card"
                      onClick={() => handleRepoClick(repo._id)}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="navsearch-repo-header">
                        <span className="navsearch-repo-name">{repo.name}</span>
                      </div>
                      <div className="navsearch-repo-meta">
                        <span>
                          <span className="navsearch-repo-owner-label">
                            Owner:
                          </span>{" "}
                          <span className="navsearch-repo-owner">
                            {repo.owner?.username || "Unknown"}
                          </span>
                        </span>
                      </div>
                      <div className="navsearch-repo-description">
                        {repo.description || "No description provided."}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Users Section */}
              <div className="navsearch-column navsearch-user-col">
                <div className="navsearch-section-title">Users</div>
                {loading ? (
                  <div className="navsearch-loading">Loading...</div>
                ) : userError ? (
                  <div className="navsearch-error">{userError}</div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="navsearch-user-card"
                      onClick={() => handleUserClick(user._id)}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="navsearch-user-profile">
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="navsearch-user-avatar"
                        />
                        <span className="navsearch-user-username">
                          {user.username}
                        </span>
                      </div>
                      <div className="navsearch-user-meta">
                        <span className="navsearch-user-email">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
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

export default NavSearch;
