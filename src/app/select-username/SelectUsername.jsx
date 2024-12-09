"use client";

import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserStore } from "@/store/UserStore";

const UsernameSelectionPage = () => {
  const { CheckTakenUsernames, UpdateUsername } = UserStore();
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [usernameStatus, setUsernameStatus] = useState("");

  const redirect = useRouter()

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const isUsernameUpdated = await UpdateUsername(username);
    console.log("Username submitted:", username);
    if(isUsernameUpdated){
      redirect.push('create-profile');
    }
  };

  const checkUsername = async (value) => {
    setUsername(value);
    // This is a mock check. In reality, you'd make an API call to your backend here.
    if (value.length < 3) {
      setUsernameStatus("");
    } else if (value.length >= 3) {
      const isUserNameTaken = await CheckTakenUsernames(value);
      console.log(isUserNameTaken);
      if (isUserNameTaken) {
        setUsernameStatus("error");
      } else {
        setUsernameStatus("success");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-d_foreground p-4">
      {isLoadingPage ? (
        <div className="w-full h-full flex justify-center items-center bg-transparent">
          <CircularProgress />
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-d_primary rounded-lg shadow-md dark:shadow-sm p-6 shadow-blue-300 dark:shadow-blue-800">
          <div className="mb-6">
            <Typography
              variant="h5"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Choose Your Username
            </Typography>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              type="text"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg py-0"
              value={username}
              onChange={(e) => checkUsername(e.target.value)}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg",
                },
                inputLabel: {
                  className:
                    "text-gray-700 dark:text-gray-300 rounded-lg pt-[2.25px]",
                },
                htmlInput: {
                  autoComplete: "username",
                },
              }}
            />
            {usernameStatus && (
              <p
                className={`text-sm ${
                  usernameStatus === "error" ? "text-red-500" : "text-green-500"
                }`}
              >
                {usernameStatus === "error"
                  ? "Username is already taken"
                  : "Username is available"}
              </p>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg py-3 text-md"
              onMouseDown={(e) => e.preventDefault()}
              disabled={usernameStatus !== "success"}
            >
              Continue
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsernameSelectionPage;
