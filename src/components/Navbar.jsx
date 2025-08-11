import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../authContext";
import client from "../utils/client";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

var userId = localStorage.getItem("userId");

const Navbar = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const [owner, setOwner] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [query, setQuery] = useState();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // console.log("current owner id is : ", userId);
        if (!userId) return;

        const res = await client.get(`/userProfile/${userId}`);
        setOwner(res.data.user); // ✅ sets owner correctly (asynchronously)
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchCurrentUser();
  }, [userId]);

  //  owner after it updates
  useEffect(() => {
    if (owner) {
      // console.log("OWNER UPDATED: ", owner);
      // console.log("");
    }
  }, [owner]);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No user ID found in localStorage.");
      return;
    }

    try {
      console.log("Deleting account with ID:", userId);
      const result = await client.delete(`/deleteProfile/${userId}`);
      console.log("Account deleted:", result);

      // Show snackbar with message
      setSnackbarMessage("Account deleted successfully.");
      setSnackbarOpen(true);

      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      setCurrentUser(null);

      // Redirect after a short delay so user can see snackbar
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left" style={{ marginRight: "1rem" }}>
        <div className="nav-logo-container">
          <Link to="/" className="nav-logo">
            <span>GitForge</span>
          </Link>
        </div>
      </div>

      <div className="nav-links hide-on-mobile">
        <Link to="/docs" className="nav-link">
          Documentation
        </Link>
      </div>

      <div className="nav-center">
        <div className="search-container">
          <SearchIcon
            className="search-icon"
            style={{ position: "absolute", left: "4px", top: "20px" }}
            onClick={() => {
              if (query.trim()) {
                navigate(`/navSearch/${encodeURIComponent(query)}`);
              }
            }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="nav-search"
            style={{ marginRight: "1rem" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                navigate(`/navSearch/${encodeURIComponent(query)}`);
              }
            }}
          />
        </div>
      </div>

      <div className="nav-right" style={{ marginLeft: "1rem" }}>
        <div className="nav-links hide-on-mobile">
          <Link to="/about" className="nav-link">
            About
          </Link>
        </div>
      </div>

      <div className="nav-right" style={{ marginLeft: "1rem" }}>
        <div className="nav-links hide-on-mobile">
          <Link to="/yourRepos" className="nav-link">
            Repositories
          </Link>
        </div>

        <button
          className="create-btn hide-on-mobile"
          onClick={() => navigate("/repo/create")}
        >
          + Create Repository
        </button>

        <img
          src={
            owner?.profileImage ||
            "https://t4.ftcdn.net/jpg/05/42/07/27/360_F_542072730_eT4Upgmwp5JlN1YnyBOtoKNm0N5mzIVO.jpg"
          }
          alt="Profile"
          className="profile-img"
          onClick={toggleMenu}
        />

        {menuOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item">
              Your Profile
            </Link>
            <div className="dropdown-divider" />

            <Link to="/yourRepos" className="dropdown-item">
              Your Repositories
            </Link>

            <Link to="/repo/create" className="dropdown-item">
              Create New Repository
            </Link>
            <Link to="/docs" className="dropdown-item">
              GitForge Documentation
            </Link>

            <Link to="/about" className="dropdown-item">
              About us
            </Link>

            <Link to="/docs" className="dropdown-item">
              Help
            </Link>
            <div className="dropdown-divider" />

            <button
              className="dropdown-item signout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setCurrentUser(null);
                window.location.href = "/auth";
              }}
            >
              Sign Out
            </button>

            <button
              className="dropdown-item signout-btn"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        )}
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </nav>
  );
};

export default Navbar;
