"use client";
import { TextareaAutosize } from "@mui/base";
import { Close, ImageRounded, Movie, WaterDrop } from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import PlatformSelector from "./PlatformSelector";
import { errorToast, successToast } from "./ToasterProvider";
import { Box, CircularProgress } from "@mui/material";
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";
import { DropletStore } from "@/store/DropletStore";
import Image from "next/image";

const DropletModal = () => {
  const {
    isCreateDropletModalOpen,
    setIsCreateDropletModalOpen,
    setIsMediaFileUploading,
    isProcessing,
    setIsProcessing,
    setImgViewerSources,
    setVidViewerSources,
    setVidViewerIndex,
    setImgViewerIndex,
  } = UIStore();
  const { FileUploader } = UserStore();
  const { DropDroplet } = DropletStore();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [dropletContent, setDropletContent] = useState("");
  const [dropletImages, setDropletImages] = useState([]);
  const [dropletVideos, setDropletVideos] = useState([]);
  const [dropletPlatform, setDropletPlatform] = useState("ocean");

  const [maxRows, setMaxRows] = useState(17);
  const selectImages = useRef();
  const selectVideos = useRef();

  // Calculate dynamic maxRows based on available height
  useEffect(() => {
    const calculateMaxRows = () => {
      const availableHeight = window.innerHeight * 0.45; // 74% of viewport height
      const lineHeight = 24; // Approximate line height in px
      const rows = Math.floor(availableHeight / lineHeight);
      setMaxRows(rows > 2 ? rows : 2); // Ensure a minimum of 2 rows
    };

    calculateMaxRows(); // Initial calculation

    // Recalculate on window resize
    window.addEventListener("resize", calculateMaxRows);
    return () => {
      window.removeEventListener("resize", calculateMaxRows);
    };
  }, [dropletContent]);

  useEffect(() => {
    if (isCreateDropletModalOpen) {
      setIsVisible(true); // Start the animation when modal opens
    }
  }, [isCreateDropletModalOpen]);

  const revokeURLs = () => {
    // Revoke URLs for images
    dropletImages &&
      dropletImages.forEach((image) => {
        if (image.source) URL.revokeObjectURL(image.source);
      });

    // Revoke URLs for videos
    dropletVideos &&
      dropletVideos.forEach((video) => {
        if (video.source) URL.revokeObjectURL(video.source);
      });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCreateDropletModalOpen(false);
      setIsClosing(false);
      setIsVisible(false); // Reset visibility for future openings
    }, 500); // Match animation duration
    setDropletContent("");
    setDropletImages([]);
    setDropletVideos([]);
    setDropletPlatform("ocean");
  };

  const handleFileChange = async (e, type) => {
    type === "images" ? setDropletImages([]) : setDropletVideos([]);
    const files = Array.from(e.target.files); // Convert FileList to an array
    if (!files.length) return;

    const updatedFiles = files.map((file) => ({
      source: URL.createObjectURL(file), // Temporary URL for preview
      file,
      path: null, // Set later
      storageBucket: type === "images" ? "droplet_Images" : "droplet_Videos",
    }));

    if (type === "images") {
      setDropletImages((prev) => [...prev, ...updatedFiles]);
    } else if (type === "videos") {
      setDropletVideos((prev) => [...prev, ...updatedFiles]);
    }
  };

  const uploadMedia = async (media, setMedia) => {
    if (media.length === 0) return;

    const uploadFile = media.map(async (fileData) => {
      if (!fileData.file) return null; // Skip if no file

      const uploadedFile = await FileUploader(
        fileData.storageBucket,
        fileData.file
      );

      return {
        ...fileData,
        path: uploadedFile?.path,
        url: uploadedFile?.url,
      };
    });

    const uploadedAllFiles = await Promise.all(uploadFile); // Wait for all uploads
    setMedia(uploadedAllFiles); // Update state with uploaded paths/URLs
    return uploadedAllFiles;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (dropletContent.trim().length === 0) {
      errorToast("Droplet cannot be empty !");
      setIsProcessing(false);
      return null;
    }

    setIsMediaFileUploading(true);

    const images = await uploadMedia(dropletImages, setDropletImages);
    const videos = await uploadMedia(dropletVideos, setDropletImages);

    setIsMediaFileUploading(false);

    const isDropletDropped = await DropDroplet({
      content: dropletContent.trim(),
      platform: dropletPlatform,
      images: images?.map((img) => `${img.url}<|>${img.path}`) || [],
      videos: videos?.map((vid) => `${vid.url}<|>${vid.path}`) || [],
    });

    if (isDropletDropped) {
      successToast("Droplet Successfully Dropped in the Ocean");
      setDropletContent("");
      revokeURLs();
      setDropletImages([]);
      setDropletVideos([]);
      setDropletPlatform("ocean");
      setIsCreateDropletModalOpen(false);
    } else {
      errorToast("Failed to drop the droplet.");
    }
    setIsProcessing(false);
  };

  return (
    <div>
      {isCreateDropletModalOpen && (
        <div
          className={`w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-30 bg-background dark:bg-d_background lg:bg-opacity-40 lg:backdrop-blur-md dark:lg:bg-opacity-30 transition-opacity duration-500 ease-in-out ${
            isClosing || !isVisible ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[80%] max-w-[600px] m-auto h-[80%] border border-slate-700 shadow-md dark:shadow-sm shadow-d_ternary dark:shadow-ternary bg-primary dark:bg-d_primary text-xl relative p-5 text-text_clr dark:text-d_text_clr rounded-2xl transform transition-all duration-500 ease-out ${
              isClosing || !isVisible
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-2xl flex items-center gap-2">
                <h1>Droplet</h1> <WaterDrop />
              </div>
              <Close onClick={handleClose} className="size-7 cursor-pointer" />
            </div>
            <TextareaAutosize
              value={dropletContent}
              onChange={(e) => {
                setDropletContent(e.target.value);
              }}
              className="font-sans mt-1 font-normal text-xl p-1 xs2:p-2 xs3:p-3 xs5:p-4 max-h-[75%] rounded-xl bg-transparent py- resize-none w-full overflow-auto text-slate-900 dark:text-slate-300 focus-visible:outline-0 bor der border-slate-700 box-border customScrollbar"
              placeholder="Write a Message..."
              maxRows={maxRows}
              minRows={8}
            />
            <div className="flex justify-between w-full px-5 left-0 items-center absolute bottom-5">
              <div className="flex gap-1 xs1:gap-2 xs2:gap-4 text-slate-800 dark:text-slate-200">
                <div className="relative">
                  {dropletImages[0]?.source && (
                    <img
                      alt='attached img'
                      src={dropletImages[0]?.source}
                      onClick={() => {
                        console.log(dropletImages);
                        const images = dropletImages.map((img) => {
                          return img.source;
                        });
                        setImgViewerSources(images);
                        setImgViewerIndex(0);
                      }}
                      className=" absolute rounded-md h-10 sm:bottom-10 sm:h-12 bottom-8 right-1/2 translate-x-1/2"
                    />
                  )}
                  <ImageRounded
                    onClick={() => {
                      selectImages.current.click();
                    }}
                    className="size-8 sm:size-10"
                  />
                  <input
                    ref={selectImages}
                    type="file"
                    multiple
                    name="images"
                    accept="image/*" // Allow only images
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "images")}
                  />
                </div>
                <div className="relative">
                  {dropletVideos[0]?.source && (
                    <video
                      src={dropletVideos[0]?.source}
                      onClick={() => {
                        const videos = dropletVideos.map((vid) => {
                          return vid.source;
                        });
                        setVidViewerSources(videos);
                        setVidViewerIndex(0);
                      }}
                      controls={false}
                      className=" absolute rounded-lg h-10 sm:bottom-10 sm:h-12 bottom-8 right-1/2 translate-x-1/2"
                    />
                  )}
                  <Movie
                    onClick={() => {
                      selectVideos.current.click();
                    }}
                    className="size-8 sm:size-10"
                  />
                  <input
                    ref={selectVideos}
                    type="file"
                    multiple
                    name="videos"
                    accept="video/*" // Allow only images
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "videos")}
                  />
                </div>
                <PlatformSelector
                  dropletPlatform={dropletPlatform}
                  setDropletPlatform={setDropletPlatform}
                />
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="bg-blue-600 text-white rounded-full text-xl tracking-wide w-20 p-4 py-1 hover:scale-105 flex justify-center items-center active:scale-95 "
              >
                {isProcessing ? (
                  <Box sx={{ display: "flex", marginY: "4px" }}>
                    <CircularProgress size={"22px"} color="white" />
                  </Box>
                ) : (
                  "Drop"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropletModal;
