"use client";

import {
  Close,
  ContentCopy,
  Delete,
  EditNoteRounded,
  EditRounded,
  Facebook,
  Instagram,
  LinkedIn,
  Share,
  WhatsApp,
  X,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { errorToast, successToast } from "./ToasterProvider";
import { UIStore } from "@/store/UIStore";
import { DropletStore } from "@/store/DropletStore";
import Button from "./Button";

const ShareOptionsModal = () => {
  const {
    isShareOptionsModalOpen,
    setIsShareOptionsModalOpen,
    dropletIdToShare,
    setDropletIdToShare,
    dropletContentToShare,
    setDropletContentToShare,
  } = UIStore();

  const [isVisible, setIsVisible] = useState(false); // For opening animation
  const [isClosing, setIsClosing] = useState(false); // For closing animation

  useEffect(() => {
    if (isShareOptionsModalOpen) {
      setIsVisible(true); // Trigger opening animation
    }
  }, [isShareOptionsModalOpen]);

  const shareLinks = () => {
    const dropletURL = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/droplet/${dropletIdToShare}`
    );
    return {
      whatsapp: `https://wa.me/?text=Check out this Droplet! ${encodeURIComponent(
        dropletURL
      )}`,
      x: `https://twitter.com/intent/tweet?text=Check out this Droplet!&url=${encodeURIComponent(
        dropletURL
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        dropletURL
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        dropletURL
      )}`,
      instagram: `https://www.instagram.com/?url=${encodeURIComponent(
        dropletURL
      )}`,
    };
  };

  const copyURLToShare = () => {
    const dropletURL = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/droplet/${dropletIdToShare}`;
    navigator.clipboard.writeText(dropletURL).then(() => {
      successToast("Link copied to clipboard! Share it anywhere.");
    });
  };

  const shareDroplet = () => {
    const dropletURL = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/droplet/${dropletIdToShare}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this Droplet!",
          text: dropletContentToShare,
          url: dropletURL,
        })
        .then(() => console.log("Droplet shared successfully!",dropletContentToShare))
        .catch((error) => console.error("Error sharing droplet:", error));
    } else {
      errorToast(
        "Sharing is not supported natively in your browser. Please use one of these links."
      );
    }
  };

  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setIsShareOptionsModalOpen(false); // Fully hide modal
      setDropletIdToShare("");
      setDropletContentToShare("");
      setIsClosing(false); // Reset closing state
      setIsVisible(false); // Reset visibility
    }, 500); // Match animation duration
  };

  return (
    <div>
      {isShareOptionsModalOpen && (
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
              <h1 className="text-xl">Share</h1>
              <Close
                onClick={handleClose}
                className="size-7 cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              />
            </div>

            <div className="flex gap-2 sm:gap-5 my-4 justify-between items-center text-lg h-10">
              <div onClick={copyURLToShare} className="w-full">
                <Button className="flex justify-center items-center rounded-xl w-full bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600">
                  <ContentCopy className="m-2 ms-0" />
                  Copy
                </Button>
              </div>
              <div onClick={shareDroplet} className="w-full">
              <Button className="flex justify-center items-center w-full rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 ">
                <Share className="m-2 ms-0" />
                Share
              </Button>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-5 justify-between items-center overflow-x-auto customScrollbar text-lg p-2 -my-2">
              <a
                className=" cursor-pointer"
                href={shareLinks().whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex justify-center items-center rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600">
                  <WhatsApp className="m-2" />
                </Button>
              </a>

              <a
                className=" cursor-pointer"
                href={shareLinks().linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex justify-center items-center rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 ">
                  <LinkedIn className="m-2" />
                </Button>
              </a>
              <a
                className=" cursor-pointer"
                href={shareLinks().instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex justify-center items-center rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 ">
                  <Instagram className="m-2" />
                </Button>
              </a>
              <a
                className=" cursor-pointer"
                href={shareLinks().facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex justify-center items-center rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 ">
                  <Facebook className="m-2" />
                </Button>
              </a>
              <a
                className=" cursor-pointer"
                href={shareLinks().x}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="flex justify-center items-center rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 ">
                  <X className="m-2 size-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareOptionsModal;
