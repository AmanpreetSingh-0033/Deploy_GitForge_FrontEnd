import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import client from "../../utils/client.jsx";

const Dashboard = () => {
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [showSuggested, setShowSuggested] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await client.get(`/repo/user/${userId}`);
        setRepositories(response.data?.repositories || []);
      } catch (err) {
        console.error("Error fetching repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await client.get("/repo/all");
        setSuggestedRepositories(response.data?.repositories || []);
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, [userId]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <div>
        <Navbar />
        <section id="dashboard">
          <aside className="dashboard-left">
            <h3
              onClick={() => setShowSuggested(!showSuggested)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Suggested Repositories
              {showSuggested ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </h3>

            {showSuggested && (
              <div>
                {suggestedRepositories
                  .filter((repo) => {
                    const ownerId =
                      typeof repo.owner === "object" && repo.owner !== null
                        ? repo.owner._id
                        : repo.owner;
                    const isNotMine = String(ownerId) !== String(userId);
                    const isPublic = repo.visibility;
                    return isPublic && isNotMine;
                  })
                  .map((repo) => (
                    <div
                      className="repo-card"
                      key={repo._id}
                      onClick={() => navigate(`/repo/user/${repo._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <h4>{repo.name}</h4>
                      <p>{repo.description}</p>
                    </div>
                  ))}
              </div>
            )}
          </aside>

          <main className="dashboard-main">
            <h2>Your Repositories</h2>
            <div className="search-box">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search repositories..."
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.6rem 1rem",
                  fontSize: "1rem",
                  border: "1px solid #415a7744",
                  borderRadius: "6px",
                  background: "#1b263b",
                  color: "#e0e1dd",
                  outline: "none",
                  boxShadow: "0 0 6px #415a7722",
                  transition: "all 0.2s ease-in-out",
                }}
              />
            </div>
            {searchResults.length === 0 && (
              <div
                style={{
                  color: "rgba(224, 225, 221, 0.6)",
                  fontStyle: "italic",
                  padding: "1rem 0",
                }}
              >
                No repositories found!
              </div>
            )}
            {searchResults.map((repo) => (
              <div
                className="repo-card"
                key={repo._id}
                onClick={() => navigate(`/repo/user/${repo._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h4>
                  {repo.name}
                  <span
                    style={{
                      marginLeft: "12px",
                      fontSize: "0.92em",
                      fontWeight: 600,
                      color: repo.visibility
                        ? "rgb(79 171 88)"
                        : "rgb(230 57 70)",
                      background: repo.visibility
                        ? "rgba(64, 155, 75, 0.1)"
                        : "rgba(230, 57, 70, 0.1)",
                      border: `1.2px solid ${
                        repo.visibility ? "rgb(119 169 139)" : "rgb(230 57 70)"
                      }`,
                      borderRadius: "8px",
                      padding: "2px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      height: "24px",
                      lineHeight: "1",
                      // marginLeft: "12px",
                      marginTop: "4px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {repo.visibility ? "Public" : "Private"}
                  </span>
                </h4>
                <div className="repo-description">
                  <p>{repo.description}</p>
                </div>
              </div>
            ))}
          </main>

          <aside className="dashboard-right">
            <h3
              onClick={() => setShowEvents(!showEvents)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Upcoming Events
              <span>
                {showEvents ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </span>
            </h3>

            {showEvents && (
              <div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "8px 0 0 0",
                  }}
                >
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #415a7733",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#e0e1dd",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      📅 Tech Conference - Dec 15
                    </p>
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #415a7733",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#e0e1dd",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      👥 Developer Meetup - Dec 25
                    </p>
                  </li>
                  <li
                    style={{
                      padding: "8px 0",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#e0e1dd",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      ⚛️ React Summit - Jan 5
                    </p>
                  </li>
                </ul>
              </div>
            )}
          </aside>
        </section>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
