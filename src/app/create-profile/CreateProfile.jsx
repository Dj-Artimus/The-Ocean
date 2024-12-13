"use client";

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
import { UserStore } from "@/store/UserStore";
import { UIStore } from "@/store/UIStore";

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "RU", name: "Russia" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "MX", name: "Mexico" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "KR", name: "South Korea" },
  { code: "ZA", name: "South Africa" },
  { code: "AR", name: "Argentina" },
  { code: "IE", name: "Ireland" },
  { code: "NO", name: "Norway" },
  { code: "FI", name: "Finland" },
  { code: "PH", name: "Philippines" },
  // Add more countries as needed
];

const CreateProfile = () => {
  const redirect = useRouter();

  const { setIsMediaFileUploading } = UIStore();
  const { CreateProfile, FileUploader, profileData } = UserStore();
  const [nationality, setNationality] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

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
  const [name, setName] = useState(profileData?.name);
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

  useEffect(() => {
    setIsLoadingPage(false);
  }, []);

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

    const isProfileCreated = await CreateProfile({
      name,
      dob,
      gender,
      wave,
      avatar: avatar ? `${avatar?.url}<|>${avatar?.path}` : profileData?.avatar,
      poster: poster ? `${poster?.url}<|>${poster?.path}` : profileData?.poster,
    });

    if (isProfileCreated) {
      redirect.push("/");
      setIsSubmiting(false);
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
              variant="h4"
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              Create Your Profile
            </Typography>
          </div>

          {/* PROFILE EDIT FORM STARTS HERE */}

          <div className=" overflow-y-auto my-2 h-[90%] customScrollbar px-1">
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
                      className="my-2 w-full max-h-[26vh] min-h-36 lg:max-h-72 lg:min-h-56 rounded-xl border border-slate-700 object-cover "
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
                      className="size-[22%] min-w-14 min-h-14 m-2 pointer-events-auto rounded-full border p-1 xs6:p-2 border-transparent bg-primary dark:bg-d_primary bg-opacity-70 backdrop-blur-sm shadow-sm shadow-blue-500"
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
                    className="!bg-gray-50 dark:!bg-d_secondary rounded-lg"
                  >
                    <InputLabel className="!text-gray-700 dark:!text-gray-300">
                      Day
                    </InputLabel>
                    <Select
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      label="Day"
                      required
                      className="text-gray-900 dark:text-gray-100"
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
                    className="!bg-gray-50 dark:!bg-d_secondary rounded-lg"
                  >
                    <InputLabel className="!text-gray-700 dark:!text-gray-300">
                      Month
                    </InputLabel>
                    <Select
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      label="Month"
                      required
                      className="text-gray-900 dark:text-gray-100"
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
                    className="!bg-gray-50 dark:!bg-d_secondary rounded-lg"
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
                  className="!bg-gray-50 dark:!bg-d_secondary rounded-lg"
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
                  <b>Gender </b> : Your gender will be useful to you to find and
                  connect others.
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
              >
                Save Profile
              </Button>
            </form>
          </div>
          {/* PROFILE EDIT FORM STARTS HERE */}
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
