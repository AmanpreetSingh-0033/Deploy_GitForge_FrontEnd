import "./login.css";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import client from "../../utils/client.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validate = () => {
    if (!email.trim()) {
      setSnackbar({
        open: true,
        message: "Email is required",
        severity: "warning",
      });
      return false;
    }

    if (!password.trim()) {
      setSnackbar({
        open: true,
        message: "Password is required",
        severity: "warning",
      });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await client.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);

      setSnackbar({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      setSnackbar({
        open: true,
        message: "Invalid credentials",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo-container">
          <Link to="/" className="gitforge-logo">
            <span>GitForge</span>
          </Link>
        </div>

        <Paper elevation={6} className="login-box">
          <Typography variant="h5" className="login-title">
            Login
          </Typography>

          <form className="login-form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />

            <Button
              variant="contained"
              color="success"
              type="submit"
              fullWidth
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>

          <Typography variant="body2" className="forgot-password">
            <Link to="/forgot-password" className="link-text">
              Forgot Password?
            </Link>
          </Typography>

          <Typography variant="body2" className="signup-link">
            Don't have an account?{" "}
            <Link to="/signup" className="link-text">
              Signup
            </Link>
          </Typography>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          className="snackbar"
        >
          <Alert
            severity={snackbar.severity}
            onClose={handleSnackbarClose}
            className="alert-message"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Login;
