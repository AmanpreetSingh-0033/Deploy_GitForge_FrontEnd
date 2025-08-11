import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import client from "../../utils/client.jsx";
import "./YourRepositories.css";

const YourRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await client.get(`/repo/user/${userId}`);
        setRepositories(response.data?.repositories || []);
      } catch (err) {
        console.error("Error fetching repositories:", err);
      }
    };
    if (userId) fetchRepositories();
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
        <div
          style={{
            display: "flex",

            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Navbar />
          <main className="repo-main-wrapper">
            <section className="repo-content">
              <h1 className="repo-title">Your Repositories</h1>
              <div className="repo-search-bar">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search repositories..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchResults.length === 0 ? (
                <div className="repo-empty">No repositories found!</div>
              ) : (
                <div className="repo-list">
                  {searchResults.map((repo) => (
                    <div
                      className="repo-item"
                      key={repo._id}
                      onClick={() => navigate(`/repo/user/${repo._id}`)}
                    >
                      <div className="repo-item-header">{repo.name}</div>
                      <div className="repo-item-desc">{repo.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    </>
  );
};

export default YourRepositories;
