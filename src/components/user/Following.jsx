import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Followers.css";
import { Button, CircularProgress } from "@mui/material";
import client from "../../utils/client";

const Following = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        // Fetch current user to get followedUsers array
        const res = await client.get(`/userProfile/${userId}`);
        const followingIds = res.data.user.followingUsers || [];
        if (!followingIds.length) {
          setFollowingUsers([]);
          setLoading(false);
          return;
        }
        // Fetch each followed user details
        const userPromises = followingIds.map((id) =>
          client.get(`/userProfile/${id}`)
        );
        const usersRes = await Promise.all(userPromises);
        const users = usersRes.map((r) => r.data.user);
        setFollowingUsers(users);
      } catch (err) {
        setFollowingUsers([]);
      }
      setLoading(false);
    };
    fetchFollowingUsers();
  }, [userId]);

  return (
    <div className="followers-container">
      <div className="go-back-button">
        <button className="go-back-pill" onClick={() => navigate(-1)}>
          <span className="arrow">&#8592;</span>
          <span className="go-back-text">Go back</span>
        </button>
      </div>
      <h2 className="followers-title">People You Follow</h2>
      {loading ? (
        <div className="followers-loading">
          <CircularProgress style={{ color: "#00ff88" }} />
        </div>
      ) : followingUsers.length === 0 ? (
        <div className="followers-empty">You are not following anyone yet.</div>
      ) : (
        <div className="followers-list">
          {followingUsers.map((user) => (
            <div className="follower-card" key={user._id}>
              <img
                src={
                  user.profileImage ||
                  "https://t4.ftcdn.net/jpg/05/42/07/27/360_F_542072730_eT4Upgmwp5JlN1YnyBOtoKNm0N5mzIVO.jpg"
                }
                alt={user.username}
                className="follower-avatar"
              />
              <div className="follower-info">
                <div className="follower-username">{user.username}</div>
                <div className="follower-counts">
                  <span>
                    <strong>{user.followedUsers?.length || 0}</strong> Followers
                  </span>
                  <span>
                    <strong>{user.followingUsers?.length || 0}</strong>{" "}
                    Following
                  </span>
                </div>
                <Button
                  className="view-profile-btn"
                  variant="contained"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Following;
