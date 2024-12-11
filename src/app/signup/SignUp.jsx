"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { GitHub, Google, Email, Cyclone } from "@mui/icons-material";
import Link from "next/link";
import PasswordMeter from "@/components/PasswordMeter";
import "../globals.css";
import { AuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();

  const { SignUpUser, OAuthLogin } = AuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    setIsLoadingPage(false);
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
    const error = validatePassword(password);
    setPasswordError(error);

    if (!error) {
      // Proceed with form submission
      setIsSubmiting(true);
      const signUp = await SignUpUser(email, password);
      e.target.reset();
      setIsSubmiting(false);
      router.push('/verify-email');

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
              Create Account
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email&nbsp;"
              type="email"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg text-gray-900 dark:text-gray-100"
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
              sx={{
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'secondary.main' : '#f8f9fa',
                borderRadius: '18px',
                input: {
                  color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
                },
                '.MuiInputLabel-root': {
                  color: (theme) => theme.palette.mode === 'dark' ? '#bbb' : '#333',
                },
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: (theme) => theme.palette.mode === 'dark' ? '#444' : '#ccc',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: (theme) => theme.palette.primary.main,
                },
              }}
            />
            <TextField
              fullWidth
              label="Password&nbsp;"
              type="password"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg text-gray-900 dark:text-gray-100"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsSubmitted(false);
              }}
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
                  className:
                    "text-gray-700 dark:text-gray-300 pt-[2.5px] rounded-lg",
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
            {isSubmiting ? (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="bg-blue-600 bg-sl hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-xl py-3 text-md"
              >
                <Cyclone className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<Email />}
                className="bg-blue-600 bg-sl hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-xl py-3 text-md"
                onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
              >
                SignUp
              </Button>
            )}
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

          <div className=" mt-4">
            <Typography
              variant="body2"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Log in
              </Link>
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
