"use client";
import { Close, Cyclone, EditNote } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";

import {
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { successToast } from "./ToasterProvider";
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";
import Image from "next/image";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const years = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i
);

const ProfileEditModal = ({ profileData }) => {
  const {
    isProfileEditModalOpen,
    setIsProfileEditModalOpen,
    setIsMediaFileUploading,
  } = UIStore();
  const { CreateProfile, FileUploader, CheckTakenUsernames } = UserStore();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const router = useRouter();

  const [name, setName] = useState(profileData?.name);
  const [username, setUsername] = useState(profileData?.username);

  const [posterData, setPosterData] = useState({
    currentSource: profileData?.poster?.split("<|>")[0],
    newSource: null,
    file: null,
    path: null,
    storageBucket: "posters",
  });
  const [avatarData, setAvatarData] = useState({
    currentSource: profileData?.avatar?.split("<|>")[0],
    newSource: null,
    file: null,
    path: null,
    storageBucket: "avatars",
  });

  const [day, setDay] = useState(Number(profileData?.dob?.split("-")[2]) || "");
  const [month, setMonth] = useState(
    Number(profileData?.dob?.split("-")[1]) || ""
  );
  const [year, setYear] = useState(
    Number(profileData?.dob?.split("-")[0]) || ""
  );
  const [gender, setGender] = useState(profileData?.gender || "");
  const [wave, setWave] = useState(profileData?.wave || "");
  const selectPoster = useRef();
  const selectAvatar = useRef();

  useEffect(() => {
    if (isProfileEditModalOpen) {
      setIsVisible(true); // Start the animation when modal opens
    }
  }, [isProfileEditModalOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsProfileEditModalOpen(false);
      setIsClosing(false);
      setIsVisible(false); // Reset visibility for future openings
    }, 500); // Match animation duration
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const fileUrl = URL.createObjectURL(file);
    type === "poster"
      ? setPosterData((prevData) => ({
          ...prevData,
          newSource: fileUrl,
          file: file,
        }))
      : setAvatarData((prevData) => ({
          ...prevData,
          newSource: fileUrl,
          file: file,
        }));
  };

  const checkUsername = async (value) => {
    setUsername(value);
    // This is a mock check. In reality, you'd make an API call to your backend here.
    if (value.length < 3) {
      setUsernameStatus("");
    } else if (value === profileData?.username) {
      setUsernameStatus("");
    } else if (value.length >= 3) {
      const isUserNameTaken = await CheckTakenUsernames(value);
      if (isUserNameTaken) {
        setUsernameStatus("error");
      } else {
        setUsernameStatus("success");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    setIsMediaFileUploading(true);

    const poster =
      posterData.file &&
      (await FileUploader(posterData.storageBucket, posterData.file));
    const avatar =
      avatarData.file &&
      (await FileUploader(avatarData.storageBucket, avatarData.file));

    setIsMediaFileUploading(false);

    const dob = new Date(Date.UTC(year, month - 1, day));

    const isProfileUpdated = await CreateProfile({
      name,
      dob,
      gender,
      wave,
      avatar: avatar ? `${avatar?.url}<|>${avatar?.path}` : profileData?.avatar,
      poster: poster ? `${poster?.url}<|>${poster?.path}` : profileData?.poster,
    });

    if (isProfileUpdated) {
      setIsProfileEditModalOpen(false);
      setIsSubmiting(false);
      successToast("Profile Updated Successfully.");
    }
  };

  return (
    <div>
      {isProfileEditModalOpen && (
        <div
          className={`w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-30 bg-background dark:bg-d_background lg:bg-opacity-40 lg:backdrop-blur-md dark:lg:bg-opacity-30 transition-opacity duration-500 ease-in-out ${
            isClosing || !isVisible ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[80%] max-w-[600px] m-auto h-[80%] border border-slate-700 shadow-md dark:shadow-sm shadow-d_ternary dark:shadow-ternary bg-primary dark:bg-d_primary text-xl relative py-5 text-text_clr dark:text-d_text_clr rounded-2xl transform transition-all duration-500 ease-out ${
              isClosing || !isVisible
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            }`}
          >
            <div className="flex justify-between items-center mx-5 ">
              <div className="text-2xl flex items-center gap-2">
                <h1>Profile</h1> <EditNote className=" size-8" />
              </div>
              <div className="flex">
                {/* <PlaylistAddCheck onClick={handleSubmit} className="size-8 cursor-pointer" /> */}
                <Close
                  onClick={handleClose}
                  className="size-7 cursor-pointer"
                />
              </div>
            </div>

            {/* PROFILE EDIT FORM STARTS HERE */}

            <div className=" overflow-y-auto my-2 h-[90%] customScrollbar px-4 mx-1">
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* PROFILE PIC AND BANNER STARTS HERE */}

                <div className="flex flex-col">
                  <div className="relative">
                    {/* Poster Image */}
                    <div className="w-full relative z-10">
                      {" "}
                      {/* z-index ensures this layer is above the background */}
                      <input
                        ref={selectPoster}
                        type="file"
                        name="poster"
                        accept="image/*" // Allow only images
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "poster")}
                      />
                      <img
                        onClick={() => {
                          selectPoster.current.click();
                        }}
                        src={posterData.newSource || posterData.currentSource}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/defaultPoster.png";
                        }}
                        alt="poster"
                        className="my-2 w-full max-h-[26vh] lg:max-h-72 rounded-xl border border-slate-700 object-cover "
                      />
                    </div>

                    <div className="absolute bord er border-slate-500 h-fit bottom-2 p-1 left-0 w-full z-20 pointer-events-none">
                      <input
                        ref={selectAvatar}
                        type="file"
                        name="avatar"
                        accept="image/*" // Allow only images
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "avatar")}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/jellyfishFallback.png";
                        }}
                      />
                      <img
                        onClick={(e) => {
                          e.stopPropagation(); // Stop click from propagating to the poster div
                          selectAvatar.current.click();
                        }}
                        src={avatarData.newSource || avatarData.currentSource}
                        alt="profile"
                        className="size-[22%] min-w-14 m-2 pointer-events-auto rounded-full border p-1 xs6:p-2 border-transparent bg-primary dark:bg-d_primary bg-opacity-70 backdrop-blur-sm shadow-sm shadow-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs mx-1 text-text_clr2 dark:text-gray-400">
                    Change avatar and poster by clicking on them
                  </p>
                </div>

                {/* PROFILE PIC AND BANNER ENDS HERE */}

                <TextField
                  fullWidth
                  label="Username"
                  type="text"
                  variant="outlined"
                  value={username}
                  onChange={(e) => checkUsername(e.target.value.trim())}
                  required
                  className="bg-gray-50 dark:bg-d_secondary py-0 rounded-xl !text-gray-900 !dark:text-gray-100"
                  slotProps={{
                    input: {
                      className:
                        "!text-slate-900 dark:!text-slate-100 !rounded-xl",
                    },
                    inputLabel: {
                      className: "!text-slate-700 dark:!text-slate-400",
                    },
                    select: {
                      className: " border border-slate-300",
                    },
                    htmlInput: {
                      autoComplete: "username",
                    },
                  }}
                />
                {usernameStatus && (
                  <p
                    className={`text-sm -my-2 ${
                      usernameStatus === "error"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {usernameStatus === "error"
                      ? "Username is already taken"
                      : "Username is available"}
                  </p>
                )}

                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-50 dark:bg-d_secondary py-0 rounded-xl !text-gray-900 !dark:text-gray-100"
                  slotProps={{
                    input: {
                      className:
                        "!text-slate-900 dark:!text-slate-100 !rounded-xl",
                    },
                    inputLabel: {
                      className: "!text-slate-700 dark:!text-slate-400",
                    },
                    select: {
                      className: " border border-slate-300",
                    },
                    htmlInput: {
                      autoComplete: "name",
                    },
                  }}
                />

                {/* DATE OF BIRTH SELECTOR STARTS HERE */}
                <div>
                  <div className="flex space-x-4">
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="!bg-gray-50 dark:!bg-d_secondary !text-slate-900 dark:!text-slate-100 rounded-lg"
                    >
                      <InputLabel className="!text-gray-700 dark:!text-gray-300">
                        Day
                      </InputLabel>
                      <Select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        label="Day"
                        required
                        className="!text-gray-900 dark:!text-gray-100"
                      >
                        {Array.from({ length: 31 }, (_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="!bg-gray-50 dark:!bg-d_secondary rounded-lg !text-slate-900 dark:!text-slate-100"
                    >
                      <InputLabel className="!text-gray-700 dark:!text-gray-300 ">
                        Month
                      </InputLabel>
                      <Select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        label="Month"
                        required
                        className="!text-gray-900 dark:!text-gray-100"
                      >
                        {months.map((m) => (
                          <MenuItem key={m.value} value={m.value} className="">
                            {m.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className="!bg-gray-50 dark:!bg-d_secondary rounded-lg !text-slate-900 dark:!text-slate-100"
                    >
                      <InputLabel className="!text-gray-700 dark:!text-gray-300">
                        Year
                      </InputLabel>
                      <Select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        label="Year"
                        required
                        className="text-gray-900 dark:text-gray-100"
                      >
                        {years.map((y) => (
                          <MenuItem key={y} value={y}>
                            {y}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <p className="text-xs mx-1 mt-2 -mb-1 text-text_clr2 dark:text-gray-400">
                    <b> Date of Birth </b> : This info will be only use for
                    calculating your age, which will help us to provide you
                    relatable content.
                  </p>
                </div>
                {/* DATE OF BIRTH SELECTOR ENDS HERE */}

                <div className="flex flex-col ">
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className="!bg-gray-50 dark:!bg-d_secondary rounded-lg !text-slate-900 dark:!text-slate-100"
                  >
                    <InputLabel className="!text-gray-700 dark:!text-gray-300">
                      Gender
                    </InputLabel>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      label="Gender"
                      required
                      className="text-gray-900 dark:text-gray-100"
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  <p className="text-xs mx-1 mt-2 -mb-1 text-text_clr2 dark:text-gray-400">
                    <b>Gender </b> : Your gender will be useful to you to find
                    and connect others.
                  </p>
                </div>

                <div className="flex flex-col">
                  <TextField
                    fullWidth
                    label="Wave"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={wave}
                    onChange={(e) => setWave(e.target.value)}
                    className="bg-gray-50 dark:bg-d_secondary py-0 rounded-xl !text-gray-900 !dark:text-gray-100"
                    slotProps={{
                      input: {
                        className:
                          "!text-slate-900 dark:!text-slate-100 !rounded-xl",
                      },
                      inputLabel: {
                        className: "!text-slate-700 dark:!text-slate-400",
                      },
                      select: {
                        className: " border border-slate-300",
                      },
                    }}
                  />
                  <p className="text-xs mx-1 mt-2 -mb-1 text-text_clr2 dark:text-gray-400">
                    <b>Create a Wave that defines you </b> : a snapshot of your
                    energy ,vibe and who you are.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  className="bg-blue-600 !text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 !rounded-xl !py-2 text-md"
                  disabled={usernameStatus === "error"}
                >
                  {isSubmiting ? (
                    <Cyclone className="animate-spin" />
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </form>
            </div>
            {/* PROFILE EDIT FORM STARTS HERE */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditModal;
