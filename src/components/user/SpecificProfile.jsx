import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import client from "../../utils/client";
import Navbar from "../Navbar";
import Footer from "../Footer";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import "./profile.css";
import ActivityHeatMap from "./HeatMap";
import GetAllUsers from "./GetAllUsers";
import { useNavigate } from "react-router-dom";

const SpecificProfile = () => {
  // ID of the user whose profile is being visited
  const { id } = useParams();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    _id: "",
    username: "",
    followedUsers: [],
    followingUsers: [],
    profileImage: "",
  });

  const [currentUser, setCurrentUser] = useState({
    _id: "",
    username: "",
    followedUsers: [],
    followingUsers: [],
  });

  const [isFollow, setIsFollow] = useState(false); // State to toggle follow/unfollow

  const [repositories, setRepositories] = useState([]);

  const fetchUserDetails = async () => {
    try {
      const res = await client.get(`/userProfile/${id}`);
      setUserDetails(res.data.user);
      console.log("Visited user details fetched:", res.data.user);
    } catch (err) {
      console.error("Error fetching specific user details:", err.message);
    }
  };

  const fetchUserRepositories = async () => {
    try {
      const res = await client.get(`/repo/user/${id}`);
      setRepositories(res.data.repositories || []);
    } catch (err) {
      console.error("Error fetching specific user repositories:", err.message);
    }
  };

  // Fetch details of the currently logged-in user
  const fetchCurrentUser = async () => {
    try {
      const loggedInId = localStorage.getItem("userId");
      if (!loggedInId) return;

      const res = await client.get(`/userProfile/${loggedInId}`);
      setCurrentUser(res.data.user);
      console.log("Current user fetched:", res.data.user);

      // Check if current user is already following the visited profile
      const alreadyFollowing = res.data.user.followingUsers.includes(id);
      setIsFollow(alreadyFollowing);
      console.log("Already following:", alreadyFollowing);
    } catch (err) {
      console.error("Error fetching current user:", err.message);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        console.log("User not logged in.");
        return;
      }

      console.log("Current User ID:", currentUserId);
      console.log("Visited Profile ID:", id);

      // Determine action
      const isCurrentlyFollowing = currentUser.followingUsers.includes(id);
      console.log("Already following?", isCurrentlyFollowing);

      // Create updated lists
      const updatedCurrentFollowing = isCurrentlyFollowing
        ? currentUser.followingUsers.filter((userId) => userId !== id)
        : [...currentUser.followingUsers, id];

      const updatedVisitedFollowers = isCurrentlyFollowing
        ? userDetails.followedUsers.filter((userId) => userId !== currentUserId)
        : [...userDetails.followedUsers, currentUserId];

      //   Update current user
      await client.put(`/updateProfile/${currentUserId}`, {
        followingUsers: updatedCurrentFollowing,
      });
      console.log("Updated current user's followingUsers.");

      // Update visited user
      await client.put(`/updateProfile/${id}`, {
        followedUsers: updatedVisitedFollowers,
      });
      console.log("Updated visited user's followedUsers.");

      // Update UI states
      setIsFollow(!isCurrentlyFollowing);
      fetchUserDetails(); // Refresh visited user info
      fetchCurrentUser(); // Refresh current user info

      console.log(
        `Follow toggle successful. Now following? ${!isCurrentlyFollowing}`
      );
    } catch (error) {
      console.error("Error toggling follow:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails();
      fetchUserRepositories();
      fetchCurrentUser();
    }
  }, [id]);

  return (
    <div className="profile-root">
      <Navbar />

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
                <p>
                  <GroupIcon fontSize="small" style={{ marginRight: "6px" }} />
                  Following: {userDetails.followingUsers?.length || 0}
                </p>
                <p>
                  <GroupIcon fontSize="small" style={{ marginRight: "6px" }} />
                  Followers: {userDetails.followedUsers?.length || 0}
                </p>
              </div>
              <button
                className={`follow-btn ${isFollow ? "unfollow" : "follow"}`}
                onClick={handleFollowToggle}
              >
                {isFollow ? "Unfollow" : "Follow"}
              </button>
            </aside>

            {/* Right Panel */}
            <div className="profile-right">
              <div className="upperRightContainer">
                <h3>{userDetails.username}'s Repositories</h3>
                <div className="repo-list">
                  {repositories.filter((repo) => repo.visibility).length > 0 ? (
                    repositories
                      .filter((repo) => repo.visibility)
                      .map((repo) => (
                        <div
                          key={repo._id}
                          className="repo-card"
                          onClick={() => navigate(`/repo/user/${repo._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <h4>{repo.name}</h4>
                          <p>{repo.description}</p>
                        </div>
                      ))
                  ) : (
                    <p className="no-repos">No repositories found.</p>
                  )}
                </div>
              </div>

              <div className="lowerRightContainer">
                <ActivityHeatMap userId={id} />
              </div>
            </div>
          </div>
        </div>

        <div>
          <GetAllUsers />
        </div>

        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SpecificProfile;
