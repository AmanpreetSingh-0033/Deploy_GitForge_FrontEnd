import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import client from "../../utils/client";
import "./VerifyOtp.css";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Get email from localStorage and start timer
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (!savedEmail) {
      navigate("/forgot-password");
      return;
    }
    setEmail(savedEmail);

    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      if (timer <= 1) setCanResend(true);
    }, 1000);

    return () => clearInterval(countdown);
  }, [navigate, timer]);

  const handleVerifyOtp = useCallback(
    async (otpValue) => {
      if (!otpValue) {
        otpValue = otp.join("");
      }

      if (otpValue.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }

      setLoading(true);
      try {
        const response = await client.post("/auth/verify-otp", {
          email,
          otp: otpValue,
        });

        if (response.data.success) {
          localStorage.setItem("resetOtp", otpValue);
          setSuccess("OTP verified successfully! Redirecting...");
          setTimeout(() => {
            navigate("/reset-password", {
              state: { email },
              replace: true,
            });
          }, 1500);
        } else {
          setError(response.data.message || "Invalid OTP. Please try again.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to verify OTP. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [email, navigate, otp]
  );

  const handleOtpChange = useCallback(
    (e, index) => {
      const value = e.target.value;

      // Only allow numbers
      if (value && isNaN(value)) return;

      // Update the OTP array
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      // Move to next input if there's a value
      if (value && index < 5) {
        const nextInput = document.querySelector(
          `input[name=otp-${index + 1}]`
        );
        if (nextInput) nextInput.focus();
      }

      // Auto submit if last digit is entered
      if (value && index === 5) {
        const otpValue = newOtp.join("");
        if (otpValue.length === 6) {
          setTimeout(() => handleVerifyOtp(otpValue), 50);
        }
      }
    },
    [otp, handleVerifyOtp]
  );

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await client.post("/auth/send-otp", { email });

      if (response.data.success) {
        setTimer(60);
        setCanResend(false);
        setOtp(Array(6).fill(""));
        setSuccess("New OTP sent to your email!");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSuccess("");
  };

  // Auto focus first input on mount
  useEffect(() => {
    const firstInput = document.querySelector("input[name=otp-0]");
    if (firstInput) firstInput.focus();
  }, []);

  return (
    <Box className="verify-otp-container">
      <Paper elevation={3} className="verify-otp-paper">
        <Button
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back
        </Button>

        <VerifiedIcon className="verify-otp-icon" />
        <Typography variant="h4" className="verify-otp-title">
          Verify OTP
        </Typography>
        <Typography variant="body1" className="verify-otp-subtitle">
          We've sent a 6-digit verification code to {email}
        </Typography>

        <Box className="otp-input-container">
          {otp.map((_, index) => (
            <TextField
              key={index}
              name={`otp-${index}`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp[index] || ""}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !otp[index] && index > 0) {
                  const prevInput = document.querySelector(
                    `input[name=otp-${index - 1}]`
                  );
                  if (prevInput) prevInput.focus();
                }
              }}
              className="otp-input"
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center" },
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              disabled={loading}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => handleVerifyOtp()}
          disabled={loading || otp.some((digit) => !digit)}
          className="verify-button"
          endIcon={loading && <CircularProgress size={24} color="inherit" />}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>

        <Box className="resend-otp-container">
          <Typography variant="body2" className="resend-timer">
            {!canResend
              ? `Resend code in ${timer}s`
              : "Didn't receive the code?"}
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={handleResendOtp}
            disabled={!canResend || loading}
            className="resend-button"
          >
            Resend OTP
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={!!error || !!success}
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

export default VerifyOtp;
