import React, { useState } from "react";
import { useAuth } from "../../authContext";
import client from "../../utils/client";
import {
  Snackbar,
  Alert,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const { setCurrentUser } = useAuth();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic empty field checks
    if (!username.trim()) {
      setSnackbar({
        open: true,
        message: "Username is required",
        severity: "warning",
      });
      return;
    }

    if (!email.trim()) {
      setSnackbar({
        open: true,
        message: "Email is required",
        severity: "warning",
      });
      return;
    }

    if (!password) {
      setSnackbar({
        open: true,
        message: "Password is required",
        severity: "warning",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbar({
        open: true,
        message: "Invalid email format",
        severity: "error",
      });
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await client.post(`/signup`, {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);

      setSnackbar({
        open: true,
        message: res.data.message || "Signup successful!",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Signup Failed!",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-logo-container">
          <Link to="/" className="gitforge-logo">
            <span>GitForge</span>
          </Link>
        </div>

        <Paper elevation={6} className="signup-box">
          <Typography variant="h5" className="signup-title">
            Sign Up
          </Typography>

          <form className="signup-form" onSubmit={handleSignup}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              type="email"
              required
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />

            <Button
              variant="contained"
              color="success"
              type="submit"
              fullWidth
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <Typography variant="body2" className="login-link">
            Already have an account?{" "}
            <Link to="/auth" className="link-text">
              Login
            </Link>
          </Typography>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          className="snackbar"
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            className="alert-message"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Signup;
