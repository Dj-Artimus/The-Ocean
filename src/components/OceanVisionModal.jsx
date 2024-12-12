"use client";

import {
  Close,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { errorToast, successToast } from "./ToasterProvider";
import { UIStore } from "@/store/UIStore";
import Button from "./Button";

const OceanVisionModal = () => {
  const {
    isOceanVisionModalOpen,
    setIsOceanVisionModalOpen,
    setOceanVision,
    oceanVision,
  } = UIStore();

  const [isVisible, setIsVisible] = useState(false); // For opening animation
  const [isClosing, setIsClosing] = useState(false); // For closing animation

  useEffect(() => {
    if (isOceanVisionModalOpen) {
      setIsVisible(true); // Trigger opening animation
    }
  }, [isOceanVisionModalOpen]);

  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setIsOceanVisionModalOpen(false); // Fully hide modal
      setIsClosing(false); // Reset closing state
      setIsVisible(false); // Reset visibility
    }, 500); // Match animation duration
  };

  return (
    <div>
      {isOceanVisionModalOpen && (
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
              <h1 className="text-xl">Ocean Vision</h1>
              <Close
                onClick={handleClose}
                className="size-7 cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              />
            </div>
            <div className="mt-4">
              {/* CONTENT OF THE MODAL STARTS HERE */}
              <p className="mb-4 text-sm">
                Welcome to the <strong>Ocean Vision</strong>, a glimpse into the features and future potential of what &apos;The Ocean&apos; aims to achieve. While the project started as a bold attempt to create a unified social media platform, limitations such as API restrictions, subscription requirements, and data privacy policies posed significant challenges.
              </p>
              <p className="mb-4 text-sm">
                The &apos;Ocean Vision&apos; unlocks the following features:
              </p>
              <ul className="list-disc list-inside mb-4 text-sm">
                <li><strong>Stream Connections:</strong> A beautifully designed UI that provides insights into the user&apos;s connected social media platforms, including LinkedIn, X (Twitter), Instagram, and more.</li>
                <li><strong>Ocean Board:</strong> A dynamic scoreboard displaying the user&apos;s followers and followings across connected platforms, offering a consolidated view of their social media presence.</li>
                <li><strong>Redrop:</strong> A feature similar to reposting, allowing users to reshare existing droplets effortlessly.</li>
                <li>...and many more exciting features are in the pipeline!</li>
              </ul>
              <p className="mb-4 text-sm">
                While this is a fully functional MVP of another social media platform, it reflects the vision of unifying social media experiences. Despite challenges, this is just the beginning. With more resources and collaboration, &apos;The Ocean&apos; could realize its full potential.
              </p>
              <p className="mb-4 text-sm">
                Thank you for being part of this journey and exploring the possibilities of &apos;Ocean Vision.&apos; Together, let&apos;s make waves!
              </p>
              {/* CONTENT OF THE MODAL ENDS HERE */}
              <div
                onClick={() => {
                  setOceanVision(true);
                  setIsOceanVisionModalOpen(false);
                  successToast(`Ocean Vision Activated`);
                }}
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-4 text-md">
                  {oceanVision ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OceanVisionModal;