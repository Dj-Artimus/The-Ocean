"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { GitHub, Google, Email, Cyclone } from "@mui/icons-material";
import Link from "next/link";
import PasswordMeter from "@/components/PasswordMeter";
import "../globals.css";
import { AuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const { UpdatePassword, InitiatePasswordReset } = AuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    setIsLoadingPage(false);
    InitiatePasswordReset();
  }, []);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    else if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    else if (!/[a-z]/.test(pwd))
      return "Password must contain at least one lowercase letter";
    else if (!/[0-9]/.test(pwd))
      return "Password must contain at least one number";
    else if (!/[^A-Za-z0-9]/.test(pwd))
      return "Password must contain at least one special character";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitted(true);
    const error = validatePassword(password.trim());

    setPasswordError(error);

    if (password.trim() !== confirmPassword.trim() || error ) {
      console.log('password', password)
      console.log('confirmPassword', confirmPassword)
      setConfirmPasswordError("Password did not match with confirm password");
      return
    }

    if (!error && password.trim() === confirmPassword.trim()) {
      // Proceed with form submission
      setIsSubmiting(true);
      const reset = await UpdatePassword(password.trim());
      e.target.reset();
      setIsSubmiting(false);
      router.push('/login')
      // Reset the form or redirect the user as necessary
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-d_foreground p-8">
      {isLoadingPage ? (
        <div className="w-full h-full flex justify-center items-center bg-transparent">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-d_primary rounded-xl shadow-md dark:shadow-sm p-6 shadow-blue-300 dark:shadow-blue-800">
          <div className="mb-2">
            <Typography
              variant="h4"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Reset Password
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="hidden"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              slotProps={{
                htmlInput: {
                  autoComplete: "username", // Set the autocomplete attribute
                },
              }}
            />

            <TextField
              fullWidth
              label="Password&nbsp;"
              type="password"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-2xl"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setConfirmPasswordError('');
                setIsSubmitted(false);
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              error={isSubmitted && !!passwordError}
              helperText={isSubmitted && passwordError}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-2xl",
                },
                inputLabel: {
                  className:
                    "text-gray-700 dark:text-gray-300 rounded-2xl pt-[2.5px]",
                },
                htmlInput: {
                  autoComplete: "current-password", // Set the autocomplete attribute
                },
              }}
              sx={{
                // Customize helper text
                "& .MuiFormHelperText-root": {
                  backgroundColor: "#0f172a", // Make helper text background transparent\
                  width: "101%",
                  padding: "4px 14px 0", // Adjust padding as needed
                  margin: "0px 0px 0px -2px", // Remove margin between helper text and input field
                },
              }}
            />
            {isPasswordFocused && <PasswordMeter password={password} />}
            <TextField
              fullWidth
              label="Confirm Password&nbsp;"
              type="password"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-2xl"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError('');
                setIsSubmitted(false);
              }}
              error={isSubmitted && !!confirmPasswordError}
              helperText={isSubmitted && confirmPasswordError}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-2xl",
                },
                inputLabel: {
                  className:
                    "text-gray-700 dark:text-gray-300 rounded-2xl pt-[2.5px]",
                },
                htmlInput: {
                  autoComplete: "current-password", // Set the autocomplete attribute
                },
              }}
              sx={{
                // Customize helper text
                "& .MuiFormHelperText-root": {
                  backgroundColor: "#0f172a", // Make helper text background transparent\
                  width: "101%",
                  padding: "4px 14px 0", // Adjust padding as needed
                  margin: "0px 0px 0px -2px", // Remove margin between helper text and input field
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-xl py-3 text-md"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            >
              {isSubmiting ? <Cyclone className="animate-spin" /> : "Reset"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
