"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, CircularProgress } from "@mui/material";
import { Cyclone, Email } from "@mui/icons-material";
import Link from "next/link";
import { AuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";

const VerifyEmail = () => {
  const { VerifyUser, ResendOtp } = AuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const router = useRouter();

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (!isNaN(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter 6-digit OTP");
    } else {
      // Add your OTP verification logic here
      setIsSubmiting(true);
      const verify = await VerifyUser(otpString);
      setIsSubmiting(false);
      verify && router.push("/select-username");
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
          <div className=" mb-6">
            <Typography
              variant="h4"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Verify Your Email
            </Typography>
          </div>

          <div className=" mb-4">
            <Typography
              variant="body1"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Enter the 6-digit OTP provided in the email
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex justify-between mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => {
                    const pastedData = e.clipboardData.getData("text");
                    if (pastedData.length === 6) {
                      handlePaste(e);
                    }
                  }}
                  className="min-w-8 min-h-10 w-12 h-12 mx-1 text-center text-gray-700 text-2xl border-2 border-slate-400 dark:border-slate-700 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-d_secondary dark:text-gray-100"
                />
              ))}
            </div>
            {error && (
              <Typography
                variant="body2"
                className="text-center text-red-500 mb-2"
              >
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 text-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 !rounded-xl py-2 text-md"
              onMouseDown={(e) => e.preventDefault()}
            >
              {isSubmiting ? <Cyclone className="animate-spin" /> : "Verify"}
            </Button>
          </form>

          <div className=" mt-4">
            <Typography
              variant="body2"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Didn&apos;t receive the OTP?{" "}
              <Link
                onClick={async () => {
                  await ResendOtp();
                }}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Resend OTP
              </Link>
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
