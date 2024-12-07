"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { GitHub, Google } from "@mui/icons-material";
import Link from "next/link";
import { AuthStore } from "@/store/AuthStore";

const LoginPage = () => {
  const { Login, OAuthLogin } = AuthStore();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitted(true);

    if (email && password) {
      // Proceed with form submission
      await Login(email,password)
      console.log("Form submitted successfully");
      // Reset the form or redirect the user as necessary
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-d_foreground p-4">
      {isLoadingPage ? (
        <div
          className="w-full h-full flex justify-center items-center bg-transparent"
        >
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-d_primary rounded-lg shadow-md dark:shadow-sm p-10 shadow-blue-300 dark:shadow-blue-800">
          <div className="mb-6">
            <Typography
              variant="h4"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Welcome Back !
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email&nbsp;"
              type="email"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg py-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg",
                },
                inputLabel: {
                  className: "text-gray-700 dark:text-gray-300 rounded-lg pt-[2.5px]",
                },
                htmlInput: {
                  autoComplete: "username", // Set the autocomplete attribute
                }
              }}
            />
            <TextField
              fullWidth
              label="Password&nbsp;"
              type="password"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              error={isSubmitted && !!passwordError}
              helperText={isSubmitted && passwordError}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg",
                },
                inputLabel: {
                  className: "text-gray-700 dark:text-gray-300 rounded-lg pt-[2.5px]",
                },
                htmlInput: {
                  autoComplete: "current-password", // Set the autocomplete attribute
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg py-2 text-md"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            >
              Login
            </Button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <Typography
              variant="body2"
              className="mx-4 text-gray-500 dark:text-gray-400"
            >
              OR
            </Typography>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <div className="space-y-3">
            <Button
              variant="text"
              fullWidth
              startIcon={<GitHub />}
              onClick={ async () => { await OAuthLogin('github') }}
              className="border-gray-300 text-gray-700 rounded-lg py-[9px] shadow shadow-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Sign in with GitHub
            </Button>
            <Button
              variant="text"
              fullWidth
              startIcon={<Google />}
              onClick={ async () => { await OAuthLogin('google') }}
              className="border-gray-300 text-gray-700 rounded-lg py-2 shadow shadow-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Sign in with Google
            </Button>
          </div>

          <div className="mt-4">
            <Typography
              variant="body2"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign Up
              </Link>
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
