"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import {
  CheckBoxRounded,
  Cyclone,
  GitHub,
  Google,
  MarkEmailReadRounded,
} from "@mui/icons-material";
import Link from "next/link";
import { AuthStore } from "@/store/AuthStore";

const ForgotPassword = () => {
  const { ForgotPassword } = AuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (email) {
      // Proceed with form submission
      setIsSubmiting(true);
      setIsSubmitted(await ForgotPassword(email));
      console.log("Form submitted successfully");
      setIsSubmiting(false);
      // Reset the form or redirect the user as necessary
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-d_foreground p-8">
      {isLoadingPage ? (
        <div className="w-full h-full flex justify-center items-center bg-transparent">
          <CircularProgress />
        </div>
      ) : isSubmitted ? (
        <div className="w-full max-w-md bg-white dark:bg-d_primary rounded-xl shadow-md dark:shadow-sm p-6 shadow-blue-300 dark:shadow-blue-800">
          <div className="mb-3">
            <Typography
              variant="h4"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Email Sent Successfully !
            </Typography>
          </div>

          <div className="mb-4 text-gray-800 dark:text-gray-300 text-sm text-center">
            Follow the instructions and reset your password.
          </div>

          <div className="w-full flex justify-center">
            <MarkEmailReadRounded className="size-20 text-text_clr2 dark:text-d_text_clr2" />
          </div>

          <div className="mt-4">
            <Typography
              variant="body2"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Go back to{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Login
              </Link>
            </Typography>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-d_primary rounded-xl shadow-md dark:shadow-sm p-6 shadow-blue-300 dark:shadow-blue-800">
          <div className="mb-3">
            <Typography
              variant="h4"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Forgot <br /> Password !
            </Typography>
          </div>

          <div className="mb-6 text-gray-800 dark:text-gray-300 text-sm text-center">
            Enter your registered email to get the password reset link and
            instructions.
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email&nbsp;"
              type="email"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-2xl py-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete: "username", // Set the autocomplete attribute
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
              {isSubmiting ? (
                <Cyclone className="animate-spin" />
              ) : (
                "Send Email"
              )}
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

          <div className="mt-4">
            <Typography
              variant="body2"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Go back to{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Login
              </Link>
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
