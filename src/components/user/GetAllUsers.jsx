// src/components/GetAllUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./GetAllUsers.css";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/allUsers");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="users-container">
      <h2 className="users-title">More GitForge Users</h2>
      <div className="users-grid">
        {users
          .filter((user) => user._id !== localStorage.getItem("userId"))
          .map((user) => (
            <div className="user-card" key={user._id}>
              <img
                src={
                  
                  user.profileImage ||
                  "https://t4.ftcdn.net/jpg/05/42/07/27/360_F_542072730_eT4Upgmwp5JlN1YnyBOtoKNm0N5mzIVO.jpg"
                }
                alt="User Avatar"
                className="user-avatar"
              />
              <div className="user-name">
                <PersonIcon className="user-icon" />
                {user.username}
              </div>
              <Link to={`/profile/${user._id}`} className="view-profile-button">
                View Profile
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GetAllUsers;
