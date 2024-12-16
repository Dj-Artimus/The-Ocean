import React, { useState, useEffect, useRef } from "react";
import {
  Cyclone,
  Facebook,
  Instagram,
  LinkedIn,
  X,
  YouTube,
} from "@mui/icons-material";

const options = [
  { name: "ocean", icon: <Cyclone className="!size-8 sm:!size-10" /> },
  { name: "linkedin", icon: <LinkedIn className="!size-8 sm:!size-10" /> },
  { name: "facebook", icon: <Facebook className="!size-8 sm:!size-10" /> },
  { name: "instagram", icon: <Instagram className="!size-8 sm:!size-10" /> },
  { name: "x", icon: <X className="!size-7 sm:!size-9" /> },
  { name: "youtube", icon: <YouTube className="!size-8 sm:!size-10" /> },
];

const PlatformSelector = ({ dropletPlatform, setDropletPlatform }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option) => {
    setDropletPlatform(option.name); // Store the `name` of the platform
    setIsOpen(false); // Close the dropdown after selection
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener for closing dropdown on outside click
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Find the selected platform's icon for display
  const selectedPlatform = options.find(
    (option) => option.name === dropletPlatform
  )?.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selection Area */}
      <button
        onClick={toggleDropdown}
        className="transition-transform transform hover:scale-110 flex items-center gap-2"
      >
        {selectedPlatform || <Cyclone className="!size-8 sm:!size-10" />}
      </button>

      {/* Dropdown List */}
      <div
        className={`absolute bottom-full bg-transparent backdrop-blur-lg rounded-lg mb-2 flex flex-col items-center gap-2 left-0 z-10 transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleSelect(option)}
            className="hover:text-blue-600 cursor-pointer transition duration-500 ease-in-out flex items-center gap-2"
          >
            {option.icon}
            {/* <span className="capitalize">{option.name}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
