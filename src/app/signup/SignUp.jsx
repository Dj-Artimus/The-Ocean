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

  // refactor the Code, check for bugs and null pointers , make this code strongly typed and make it more faster and more efficient. understand the logic and implement another approach if u have better than this one.

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
      signUp && router.push("/verify-email");

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
              className="bg-gray-50 dark:bg-d_secondary py-0 rounded-xl !text-gray-900 !dark:text-gray-100"
              slotProps={{
                input: {
                  className: "!text-slate-900 dark:!text-slate-100 !rounded-xl",
                },
                inputLabel: {
                  className: "!text-slate-700 dark:!text-slate-400",
                },
                select: {
                  className: " border border-slate-300",
                },
                htmlInput: {
                  autoComplete: "email",
                },
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password&nbsp;"
              type="password"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary py-0 rounded-xl !text-gray-900 !dark:text-gray-100"
              slotProps={{
                input: {
                  className: "!text-slate-900 dark:!text-slate-100 !rounded-xl",
                },
                inputLabel: {
                  className: "!text-slate-700 dark:!text-slate-400",
                },
                select: {
                  className: " border border-slate-300",
                },
                htmlInput: {
                  autoComplete: "new-password",
                },
              }}
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
            />
            {isPasswordFocused && <PasswordMeter password={password} />}
            {isSubmiting ? (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="bg-blue-600 !text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 !rounded-xl !py-2 text-md"
              >
                <Cyclone className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<Email />}
                className="bg-blue-600 !text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 !rounded-xl !py-2 text-md"
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
              className="!border-gray-300 !text-gray-700 !rounded-xl !py-3 !shadow !shadow-blue-600 hover:!bg-gray-50 dark:!border-gray-600 dark:!text-gray-200 dark:hover:!bg-gray-700"
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
              className="!border-gray-300 !text-gray-700 !rounded-xl !py-3 !shadow !shadow-blue-600 hover:!bg-gray-50 dark:!border-gray-600 dark:!text-gray-200 dark:hover:!bg-gray-700"
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
