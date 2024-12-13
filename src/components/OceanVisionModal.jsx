"use client";

import { Close } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { successToast } from "./ToasterProvider";
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

  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOceanVisionModalOpen) {
      setIsVisible(true);
    }
  }, [isOceanVisionModalOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOceanVisionModalOpen(false);
      setIsClosing(false);
      setIsVisible(false);
    }, 500);
  };

  return (
    <div>
      {isOceanVisionModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-bl from-blue-800 via-blue-900 to-indigo-950 bg-opacity-90 backdrop-blur-sm transition-opacity duration-500 ${
            isClosing || !isVisible ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-[90%] max-w-[850px] flex flex-col shadow-2xl rounded-3xl bg-gradient-to-br from-indigo-700 to-blue-900 text-white overflow-hidden transform transition-transform duration-500 ease-in-out ${
              isClosing || !isVisible ? "scale-95" : "scale-100"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 rounded-t-3xl shadow-md">
              <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide">
                🌊 Ocean Vision
              </h1>
              <Close
                onClick={handleClose}
                className="cursor-pointer text-white hover:text-gray-300 transition duration-300"
              />
            </div>

            {/* Modal Body */}
            <div className="relative z-10 mt-4 rounded-2xl p-2 overflow-y-auto customScrollbar h-full w-full">
              {/* CONTENT OF THE MODAL STARTS HERE */}
              <div className="">
                <p className="mb-4">
                  Welcome to the <strong>Ocean Vision</strong>, a glimpse into
                  the features and future potential of what &apos;The
                  Ocean&apos; aims to achieve. While the project started as a
                  bold attempt to create a unified social media platform,
                  limitations such as API restrictions, subscription
                  requirements, and data privacy policies posed significant
                  challenges.
                </p>
                <p className="mb-4">
                  The &apos;Ocean Vision&apos; unlocks the following UI
                  features:
                </p>
                <ul className="list-disc list-inside mb-4">
                  <li>
                    <strong>Stream Connections:</strong> A beautifully designed
                    UI that provides insights into the user&apos;s connected
                    social media platforms, including LinkedIn, X (Twitter),
                    Instagram, and more.
                  </li>
                  <li>
                    <strong>Ocean Board:</strong> A dynamic scoreboard
                    displaying the user&apos;s followers and followings across
                    connected platforms, offering a consolidated view of their
                    social media presence.
                  </li>
                  <li>
                    <strong>Redrop:</strong> A feature similar to reposting,
                    allowing users to reshare existing droplets effortlessly.
                  </li>
                  <li>
                    ...and many more exciting features are in the pipeline!
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
                  let&apos;s make waves!
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-center items-center bg-gradient-to-r from-indigo-700 to-blue-800 px-6 py-4 rounded-b-3xl">
              <Button
                onClick={() => {
                  setOceanVision(!oceanVision);
                  successToast(
                    `Ocean Vision ${oceanVision ? "Deactivated" : "Activated"}!`
                  );
                  handleClose();
                }}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-300 hover:to-blue-400 text-white font-semibold rounded-full px-6 py-3 shadow-lg transform hover:scale-105 transition-all"
              >
                {oceanVision ? "Deactivate Vision" : "Activate Vision"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OceanVisionModal;
