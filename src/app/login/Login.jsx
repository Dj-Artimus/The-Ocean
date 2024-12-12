"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { Cyclone, GitHub, Google } from "@mui/icons-material";
import Link from "next/link";
import { AuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";

const Login = () => {
  const { Login, OAuthLogin } = AuthStore();
  const { fetchProfileData } = UserStore();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitted(true);

    if (email && password) {
      // Proceed with form submission
      setIsSubmiting(true);
      const login = await Login(email, password);
      console.log("Form submitted successfully");
      setIsSubmiting(false);
      login && await fetchProfileData();
      login && router.push('/');
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
              className="bg-gray-50 dark:bg-d_secondary py-0 rounded-lg text-gray-900 dark:text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg",
                },
                inputLabel: {
                  className: 
                    "text-gray-700 dark:text-gray-300 pt-[2.5px] rounded-lg",
                },
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
              className="bg-gray-50 dark:bg-d_secondary rounded-lg text-gray-900 dark:text-gray-100 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={isSubmitted && !!passwordError}
              helperText={isSubmitted && passwordError}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg",
                },
                inputLabel: {
                  className:
                    "text-gray-700 dark:text-gray-300 pt-[2.5px] rounded-lg",
                },
                htmlInput: {
                  autoComplete: "current-password", // Set the autocomplete attribute
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg py-3 text-md"
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
            >
              {isSubmiting ? <Cyclone className="animate-spin" /> : "Login"}
            </Button>
            <div className="mt-2 text-sm">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot Password
              </Link>
            </div>
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

          <div className="w-full flex flex-col xs2:flex-row justify-center items-center gap-4">
            <Button
              variant="text"
              fullWidth
              startIcon={<GitHub />}
              onClick={() => {
                OAuthLogin("github");
              }}
              className="border-gray-300 text-gray-700 rounded-2xl py-3 shadow shadow-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              GitHub
            </Button>
            <Button
              variant="text"
              fullWidth
              startIcon={<Google />}
              onClick={() => {
                OAuthLogin("google");
              }}
              className="border-gray-300 text-gray-700 rounded-2xl py-3 shadow shadow-blue-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Google
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

export default Login;
