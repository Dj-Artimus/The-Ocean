"use client";

import React, { useState, useEffect } from "react";
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

  const { CreateProfile } = UserStore();

  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [wave, setWave] = useState("");
  const [isLoadingPage, setIsLoadingPage] = useState(true);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dob = new Date(Date.UTC(year, month - 1, day));

    const isProfileCreated = await CreateProfile(
      { name, dob, gender, wave }
    );

    console.log("Profile created:", {
      name,
      dob,
      gender,
      wave,
    });

    if (isProfileCreated) {
      redirect.push("/");
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg",
                },
                inputLabel: {
                  className:
                    "text-gray-700 dark:text-gray-300 rounded-lg pt-[2.5px]",
                },
              }}
            />

            <div className="flex space-x-4">
              <FormControl
                fullWidth
                variant="outlined"
                className="bg-gray-50 dark:bg-d_secondary rounded-lg"
              >
                <InputLabel className="text-gray-700 dark:text-gray-300">
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
                className="bg-gray-50 dark:bg-d_secondary rounded-lg"
              >
                <InputLabel className="text-gray-700 dark:text-gray-300">
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
                className="bg-gray-50 dark:bg-d_secondary rounded-lg"
              >
                <InputLabel className="text-gray-700 dark:text-gray-300">
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

            <FormControl
              fullWidth
              variant="outlined"
              className="bg-gray-50 dark:bg-d_secondary rounded-lg"
            >
              <InputLabel className="text-gray-700 dark:text-gray-300">
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

            {/* <FormControl fullWidth variant="outlined" className="bg-gray-50 dark:bg-d_secondary rounded-lg">
              <InputLabel className="text-gray-700 dark:text-gray-300">Nationality</InputLabel>
              <Select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                label="Nationality"
                required
                className="text-gray-900 dark:text-gray-100"
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            <TextField
              fullWidth
              label="Wave"
              variant="outlined"
              multiline
              rows={3}
              className="bg-gray-50 dark:bg-d_secondary rounded-lg"
              value={wave}
              onChange={(e) => setWave(e.target.value)}
              slotProps={{
                input: {
                  className: "text-gray-900 dark:text-gray-100 rounded-lg ",
                },
                inputLabel: {
                  className:
                    "text-gray-700 dark:text-gray-300 rounded-lg pt-[2.5px]",
                },
              }}
            />
            <p className="text-xs mx-2 -translate-y-2 text-text_clr2 dark:text-gray-400">
              Create a Wave that defines you: a snapshot of your energy ,vibe
              and who you are.
            </p>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg py-2 text-md"
            >
              Create Profile
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;
