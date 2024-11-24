"use client";
import ShieldTwoToneIcon from '@mui/icons-material/ShieldTwoTone';
import { Typography } from '@mui/material';
import Link from "next/link";

const VerifyEmail = () => {

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 dark:bg-d_foreground p-4">
        <div className="w-full max-w-md bg-white flex flex-col items-center gap-4  dark:bg-d_primary rounded-lg shadow-md dark:shadow-sm p-6 shadow-blue-300 dark:shadow-blue-800">
          <ShieldTwoToneIcon className='size-44' />
          <Typography
            variant="h4"
            className="text-center font-semibold  text-gray-800 dark:text-gray-200"
          >
            Verify Your Email
          </Typography>

          <Typography
            variant="body1"
            className="text-center text-xl text-gray-600 dark:text-gray-400"
          >
            An email has been sent to you with a verification link.
          </Typography>
        </div>
    </div>
  );
};

export default VerifyEmail;
