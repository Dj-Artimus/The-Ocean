"use client";

import {
  Close,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { errorToast, successToast } from "./ToasterProvider";
import { UIStore } from "@/store/UIStore";
import Button from "./Button";

const ExpectedVersionModal = () => {
  const {
    isExpectedVersionModalOpen,
    setIsExpectedVersionModalOpen,
    setExpectedVersion,
    expectedVersion,
  } = UIStore();

  const [isVisible, setIsVisible] = useState(false); // For opening animation
  const [isClosing, setIsClosing] = useState(false); // For closing animation

  useEffect(() => {
    if (isExpectedVersionModalOpen) {
      setIsVisible(true); // Trigger opening animation
    }
  }, [isExpectedVersionModalOpen]);

  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setIsExpectedVersionModalOpen(false); // Fully hide modal
      setIsClosing(false); // Reset closing state
      setIsVisible(false); // Reset visibility
    }, 500); // Match animation duration
  };

  return (
    <div>
      {isExpectedVersionModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-d_ternary bg-opacity-40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            isClosing || !isVisible ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[80%] max-w-[600px] m-auto border border-slate-700 shadow-md dark:shadow-sm bg-foreground dark:bg-d_foreground p-5 text-text_clr dark:text-d_text_clr rounded-2xl transform transition-all duration-500 ease-out ${
              isClosing || !isVisible
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-xl">Expected Version</h1>
              <Close
                onClick={handleClose}
                className="size-7 cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              />
            </div>
            <div className="">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusamus, quam iste provident quod explicabo reiciendis
                architecto ipsam est qui! At molestias repudiandae qui
                obcaecati, voluptate voluptatibus, nemo aut vitae soluta et
                assumenda! Libero, quod.
              </p>
              <div
                onClick={() => {
                  setExpectedVersion(false);
                  setIsExpectedVersionModalOpen(false);
                  successToast(`Expected Versioin Activated`)
                }}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl py-3 text-md">
                  {" "}
                  {expectedVersion ? "Deactivate" : "Activate"}{" "}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpectedVersionModal;
