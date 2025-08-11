import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../../utils/client";
import Navbar from "../Navbar";
import Footer from "../Footer";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import "./profile.css";
import ActivityHeatMap from "./HeatMap";
import GetAllUsers from "./GetAllUsers";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    username: "",
    followedUsers: [],
    followingUsers: [],
    profileImage: "",
  });

  const [repositories, setRepositories] = useState([]);

  const fetchUserDetails = async () => {
    try {
      const res = await client.get(`/userProfile/${userId}`);
      setUserDetails(res.data.user);
    } catch (err) {
      console.error("Error fetching user details:", err.message);
    }
  };

  const fetchUserRepositories = async () => {
    try {
      const res = await client.get(`/repo/user/${userId}`);
      setRepositories(res.data.repositories || []);
    } catch (err) {
      console.error("Error fetching user repositories:", err.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
      fetchUserRepositories();
    }
  }, [userId]);

  const handleEditProfile = async () => {
    console.log("Navigate to Edit Profile Page");
    navigate("/EditProfile");
  };

  return (
    <div className="profile-root">
      <Navbar />

      <div className="top-panel">
        <Link to="/profile">Overview</Link>
        <Link to="/yourRepos">Repositories</Link>
        <Link to="/starRepos">Star Repositories</Link>
      </div>

      <div>
        <div>
          <div className="profile-container">
            {/* Left Panel */}
            <aside className="profile-left">
              <img
                className="profile-avatar"
                src={
                  userDetails.profileImage ||
                  "https://t4.ftcdn.net/jpg/05/42/07/27/360_F_542072730_eT4Upgmwp5JlN1YnyBOtoKNm0N5mzIVO.jpg"
                }
                alt="user"
              />
              <div className="profile-info">
                <h2>
                  <PersonIcon
                    style={{ marginRight: "8px", fontSize: "24px" }}
                  />
                  {userDetails.username}
                </h2>
                <p onClick={() => navigate("viewFollowing")}>
                  <GroupIcon fontSize="small" style={{ marginRight: "6px" }} />
                  Following:{" "}
                  <span style={{ color: "#e0e1dd" }}>
                    {userDetails.followingUsers?.length || 0}
                  </span>
                </p>
                <p onClick={() => navigate("viewFollowers")}>
                  <GroupIcon fontSize="small" style={{ marginRight: "6px" }} />
                  Followers:{" "}
                  <span style={{ color: "#e0e1dd" }}>
                    {userDetails.followedUsers?.length || 0}
                  </span>
                </p>
              </div>

              {/* 🔧 Added Edit Profile button */}
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  className="neon-btn edit-profile-btn"
                  onClick={handleEditProfile}
                >
                  ✎ Edit Profile
                </button>
              </div>
            </aside>

            {/* Right Panel */}
            <div className="profile-right">
              <div className="upperRightContainer">
                <h3>Your Repositories</h3>
                <div className="repo-list">
                  {repositories.length > 0 ? (
                    repositories.map((repo) => (
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
                              marginLeft: 12,
                              fontSize: "0.92em",
                              fontWeight: 600,
                              color: repo.visibility ? "#00ff88" : "#ff6b6b",
                              background: repo.visibility
                                ? "rgba(0,255,136,0.10)"
                                : "rgba(255,107,107,0.10)",
                              border: `1.2px solid ${
                                repo.visibility ? "#00ff88" : "#ff6b6b"
                              }`,
                              borderRadius: 8,
                              padding: "2px 10px",
                              marginRight: 4,
                              marginTop: 2,
                              display: "inline-block",
                              letterSpacing: 0.5,
                            }}
                          >
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </h4>
                        <p>{repo.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-repos">No repositories found.</p>
                  )}
                </div>
              </div>

              <div className="lowerRightContainer">
                <ActivityHeatMap userId={`${userId}`}></ActivityHeatMap>
              </div>
            </div>
          </div>
        </div>
        <div>
          <GetAllUsers></GetAllUsers>
        </div>
        <div>
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
};

export default Profile;
