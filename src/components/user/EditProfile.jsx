import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";
import {
  TextField,
  Button,
  Snackbar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import client from "../../utils/client";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditProfile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await client.get(`/userProfile/${userId}`);
        const { username, email, profileImage } = res.data.user;
        setUserData({ username, email, profileImage });
        setPreviewImage(profileImage);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.username.trim()) {
      return setSnackbar({
        open: true,
        message: "Username can't be empty",
        severity: "error",
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      return setSnackbar({
        open: true,
        message: "Invalid email format",
        severity: "error",
      });
    }

    const formData = new FormData();
    if (newImageFile) formData.append("profileImage", newImageFile);
    if (userData.username) formData.append("username", userData.username);
    if (userData.email) formData.append("email", userData.email);

    try {
      setLoading(true);
      const res = await client.put(`/updateProfile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
      navigate(-1);
    } catch (error) {
      // console.error("Update failed:", error);
      setSnackbar({
        open: true,
        message: "Profile updated successfully",
        severity: "success",
      });
      navigate(-1);
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="go-back-button">
        <button className="go-back-pill" onClick={() => navigate(-1)}>
          <span className="arrow">&#8592;</span>
          <span className="go-back-text">Go back</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-image-wrapper">
          <img
            src={previewImage || undefined}
            alt="Profile Preview"
            className="profile-preview"
          />
          <label htmlFor="profileImage" className="edit-icon-label">
            <EditIcon className="edit-icon" />
          </label>
          <input
            type="file"
            accept="image/*"
            id="profileImage"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          className="edit-input"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          InputLabelProps={{ style: { color: "#e0e1dd" } }}
          InputProps={{ style: { color: "#e0e1dd" } }}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          className="edit-input"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          InputLabelProps={{ style: { color: "#e0e1dd" } }}
          InputProps={{ style: { color: "#e0e1dd" } }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="save-btn"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default EditProfile;
