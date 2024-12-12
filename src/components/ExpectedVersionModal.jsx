"use client";

import {
  Close,
  Delete,
  EditNoteRounded,
  EditRounded,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { errorToast } from "./ToasterProvider";
import InputTextarea from "./InputTextArea";
import { UIStore } from "@/store/UIStore";
import { DropletStore } from "@/store/DropletStore";

const ExpectedVersionModal = () => {
  const {
    isExpectedVersionModalOpen,
    setIsExpectedVersionModalOpen,
    setExpectedVersion,
  } = UIStore();

  const [isVisible, setIsVisible] = useState(false); // For opening animation
  const [isClosing, setIsClosing] = useState(false); // For closing animation

  useEffect(() => {
    if (isExpectedVersionModalOpen) {
      setIsVisible(true); // Trigger opening animation
    }
  }, [isExpectedVersionModalOpen]);

  const handleEditToggle = () => {
    if (!isEdit) {
      setIsEdit(true);
      setTimeout(() => setIsEditVisible(true), 50); // Slight delay for smooth entry
    } else {
      setIsEditVisible(false);
      setTimeout(() => {
        setIsEdit(false);
      }, 180); // Slight delay for smooth entry
    }
  };

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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus,
            quam iste provident quod explicabo reiciendis architecto ipsam est
            qui! At molestias repudiandae qui obcaecati, voluptate voluptatibus,
            nemo aut vitae soluta et assumenda! Libero, quod.
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpectedVersionModal;
