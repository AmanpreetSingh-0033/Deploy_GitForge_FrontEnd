import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import client from "../../utils/client";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Email is required");
      setOpen(true);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await client.post("/auth/send-otp", { email });

      if (response.data.success) {
        // Save email in localStorage for use in subsequent steps
        localStorage.setItem("resetEmail", email);
        setSuccess("OTP sent to your email. Redirecting...");
        setOpen(true);

        // Navigate to verify OTP page after a short delay
        setTimeout(() => {
          navigate("/verify-otp");
        }, 1500);
      } else {
        setError(response.data.message || "Failed to send OTP");
        setOpen(true);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      const errorMsg =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMsg);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    // Clear error after snackbar closes
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 300);
  };

  return (
    <Box className="forgot-password-container">
      <Button
        startIcon={<ArrowBackIosNewIcon />}
        onClick={() => navigate("/login")}
        className="back-button"
      >
        Back to Login
      </Button>
      <Paper elevation={3} className="forgot-password-paper">
        <Typography variant="h4" className="forgot-password-title">
          Forgot Password
        </Typography>

        <Typography variant="body1" className="forgot-password-subtitle">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </Typography>

        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="forgot-password-input"
          disabled={loading}
          onKeyPress={(e) => e.key === "Enter" && handleSendOtp()}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={
            loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
          onClick={handleSendOtp}
          className="send-otp-button"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Verification Code"}
        </Button>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPassword;
