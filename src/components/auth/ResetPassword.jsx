import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import client from "../../utils/client";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const locationState = location.state;
    if (locationState?.email) {
      setEmail(locationState.email);
      setOtp(localStorage.getItem("resetOtp") || "");
      return;
    }

    const savedEmail = localStorage.getItem("resetEmail");
    const savedOtp = localStorage.getItem("resetOtp");

    if (!savedEmail || !savedOtp) {
      navigate("/forgot-password");
      return;
    }

    setEmail(savedEmail);
    setOtp(savedOtp);
  }, [navigate, location.state]);

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      setError("New password is required");
      setOpen(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setOpen(true);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setOpen(true);
      return;
    }

    try {
      setLoading(true);
      await client.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      localStorage.removeItem("reset-email");
      localStorage.removeItem("reset-otp");

      setError("Password reset successfully! Redirecting to login...");
      setOpen(true);

      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password";
      setError(msg);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Box className="reset-password-wrapper">
      <Button
        onClick={() => navigate(-1)}
        startIcon={<ArrowBackIosNewIcon />}
        className="back-button"
      >
        Go Back
      </Button>

      <Paper elevation={6} className="reset-password-box">
        <Typography variant="h5" className="reset-password-title">
          Reset Your Password
        </Typography>
        <Typography variant="body1" className="reset-password-subtitle">
          Create a new password for your account
        </Typography>

        <Box className="reset-password-form">
          <TextField
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            margin="normal"
            inputProps={{
              minLength: 6,
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            disabled={loading || !newPassword || !confirmPassword}
            className="submit-button"
            endIcon={<LockResetIcon />}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={error.includes("success") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPassword;
