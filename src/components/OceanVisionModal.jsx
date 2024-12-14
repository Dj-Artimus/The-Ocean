"use client";

import { Close } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { errorToast, successToast } from "./ToasterProvider";
import { UIStore } from "@/store/UIStore";
import "../app/globals.css";
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
            className={`w-[80%] max-w-[600px] h-[60%] flex flex-col m-auto border border-slate-700 shadow-md dark:shadow-sm bg-foreground dark:bg-d_foreground p-5 text-text_clr dark:text-d_text_clr rounded-2xl transform transition-all duration-500 ease-out ${
              isClosing || !isVisible
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            }`}
          >
            <div className="flex flex-shrink-0 justify-between items-center">
              <h1 className="text-xl">Ocean Vision</h1>
              <Close
                onClick={handleClose}
                className="size-7 cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              />
            </div>
            <div className="mt-4 rounded-2xl p-2 overflow-y-auto customScrollbar h-full w-full">
              {/* CONTENT OF THE MODAL STARTS HERE */}
              <div className="">
                <p className="mb-4">
                  Welcome to <strong>🌊 Ocean Vision</strong>, a glimpse into
                  the features and future potential of what &apos;The
                  Ocean&apos; aims to achieve. While the project started as a
                  bold attempt to create a unified social media platform,
                  limitations such as API restrictions, subscription
                  requirements, and data privacy policies posed significant
                  challenges.
                </p>
                <p className="mb-4">🌟 Highlights of Ocean Vision:</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li className="hover:scale-105 transition-transform">
                    <strong>🌐 Stream Connections:</strong> A beautifully
                    designed UI that provides insights into the user&apos;s
                    connected social media platforms, including LinkedIn, X
                    (Twitter), Instagram, and more.
                  </li>
                  <li className="hover:scale-105 transition-transform">
                    <strong>📊 Ocean Board:</strong> A dynamic scoreboard
                    displaying the user&apos;s followers and followings across
                    connected platforms, offering a consolidated view of their
                    social media presence.
                  </li>
                  <li className="hover:scale-105 transition-transform">
                    🚀 ...and many more exciting features are in the pipeline!
                  </li>
                </ul>
                <p className="mb-4">
                  While this is a fully functional MVP of another social media
                  platform, it reflects the vision of unifying social media
                  experiences. Despite challenges, this is just the beginning.
                  With more resources and collaboration, &apos;The Ocean&apos;
                  could realize its full potential.
                </p>
                <p className="mb-4">
                  Thank you for being part of this journey and exploring the
                  possibilities of &apos;Ocean Vision.&apos; Together,
                  let&apos;s make waves! 🌊
                </p>
              </div>
            </div>
            {/* CONTENT OF THE MODAL ENDS HERE */}
            <div
              onClick={() => {
                setOceanVision(true);
                setIsOceanVisionModalOpen(false);
                successToast(`🌊 Ocean Vision Activated!`);
              }}
              className="w-full -mb-5 py-3 flex justify-center flex-shrink-0"
            >
              <Button className=" bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 px-4 text-md">
                {oceanVision ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OceanVisionModal;
