import React, { useState, useEffect, useRef } from "react";
import {
  BadgeRounded,
  Cyclone,
  Diversity1,
  Notifications,
} from "@mui/icons-material";
import { redirect } from "next/navigation";
import Button from "./Button";
import { UIStore } from "@/store/UIStore";

const actions = [

  { icon: <BadgeRounded className="size-7" />, name: "o-card" },
  { icon: <Notifications className="size-7" />, name: "notifications" },
  { icon: <Diversity1 className="size-7" />, name: "oceanites" },
];

export default function OceanSpeedDial() {
  const {
    setIsMsgsOpen,
    isOCardOpen,
    setIsOCardOpen,
    isCreateDropletModalOpen,
  } = UIStore();
  const [isOpen, setIsOpen] = useState(false);
  const speedDialRef = useRef(null);

  // Toggle Speed Dial
  const toggleSpeedDial = () => {
    setIsOpen(!isOpen);
  };

  // Close Speed Dial when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        speedDialRef.current &&
        !speedDialRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close Speed Dial when clicking an action button
  const handleActionClick = (btn) => {
    setIsOpen(false);

    switch (btn) {
      case "oceanites":
        setIsOCardOpen(false);
        setIsMsgsOpen(false);
        return redirect("/oceanites");
      case "notifications":
        setIsOCardOpen(false);
        setIsMsgsOpen(false);
        return redirect("/notifications");
      case "o-card":
        setIsMsgsOpen(false);
        setIsOCardOpen(!isOCardOpen);
        return null;
    }
  };

  return (
    <div
      ref={speedDialRef}
      className="fixed flex lg:hidden flex-col items-end bottom-[45px] right-[1px] sm:right-2 z-30"
    >
      {/* Speed Dial Actions with Smooth Transition */}
      <div
        className={`flex flex-col items-center gap-2 p-1 rounded-2xl bg-opacity-90 transition-all duration-300 ${
          isOpen
            ? "opacity-100 -translate-y-5"
            : "opacity-0 hidden translate-y-0 pointer-events-none"
        }`}
      >
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={() => {
              handleActionClick(action.name);
            }}
            className="bg-blue-600 text-white p-1 shadow-blue-400 rounded-xl flex items-center justify-center shadow-sm transition-transform transform hover:scale-110 focus:outline-none"
            aria-label={action.name}
            title={action.name}
          >
            {action.icon}
          </Button>
        ))}
      </div>
      {/* Speed Dial Button */}
      { !isCreateDropletModalOpen && (
        <Button
          onClick={toggleSpeedDial}
          className={`bg-blue-600 text-white rounded-xl rounded-br-none flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 focus:outline-none p-1`}
        >
          <Cyclone
            className={`size-6 transition-all ${isOpen ? "rotate-45" : ""}`}
          />
        </Button>
      )}
    </div>
  );
}
