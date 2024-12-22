import React, { useCallback, useState } from "react";
import VideoElement from "./VideoElement";
import ContentElement from "./ContentElement";
import { Router } from "next/router";
import { useSwipeable } from "react-swipeable";
import { UIStore } from "@/store/UIStore";

const ContentAndMediaElement = ({ content, images, videos }) => {
  const { setImgViewerSources, setImgViewerIndex } = UIStore();
  const [currentImage, setCurrentImage] = useState(0); // For image slider navigation
  const [currentVideo, setCurrentVideo] = useState(0); // For video slider navigation
  // Handles image slider navigation
  const handleImageChange = useCallback(
    (index) => {
      setCurrentImage(index);
    },
    [setCurrentImage]
  );

  // Handles video slider navigation
  const handleVideoChange = useCallback(
    (index) => {
      setCurrentVideo(index);
    },
    [setCurrentVideo]
  );

  // Swipe handlers
  const swipeHandlersForImages = useSwipeable({
    onSwipedLeft: () => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    },
    onSwipedRight: () => {
      setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    },
  });

  const swipeHandlersForVideos = useSwipeable({
    onSwipedLeft: () =>
      setCurrentVideo((prev) => Math.min(videos.length - 1, prev + 1)),
    onSwipedRight: () => setCurrentVideo((prev) => Math.max(0, prev - 1)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div>
      {/*  DROPLET CONTENT STARTS HERE  */}
      <ContentElement key={Router.asPath} content={content} />
      {/*  DROPLET CONTENT ENDS HERE  */}
      {/* Image Gallery or Slider */}
      <div className="relative">
        {/* Slider image display */}
        {images?.length > 0 && (
          <img
            src={images[currentImage]?.split("<|>")[0]}
            alt={`Image ${currentImage + 1}`}
            onClick={() => {
              setImgViewerIndex(currentImage);
              setImgViewerSources(images);
            }}
            {...swipeHandlersForImages}
            className="rounded-xl shadow shadow-slate-500 p-[2px] m-auto mb-4"
          />
        )}
        {/* Dot navigation */}
        {images?.length > 1 && (
          <div className="flex justify-center space-x-2 -mt-2 mb-1">
            {images?.map((_, index) => (
              <span
                key={index}
                onClick={() => handleImageChange(index)}
                className={`h-2 w-2 rounded-full cursor-pointer ${
                  index === currentImage ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Video Gallery or Slider */}
      {videos?.length > 1 ? (
        <div className="relative">
          {/* Slider video display */}
          <VideoElement
            videos={videos}
            currentVideo={currentVideo}
            swipeHandlers={swipeHandlersForVideos}
          />
          {/* Dot navigation for video */}
          <div className="flex justify-center -mt-2 mb-1 space-x-2">
            {videos?.map((_, index) => (
              <span
                key={index}
                onClick={() => handleVideoChange(index)}
                className={`h-2 w-2 rounded-full cursor-pointer ${
                  index === currentVideo ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Single video display
        videos?.length === 1 && (
          <VideoElement videos={videos} currentVideo={currentVideo} />
        )
      )}
    </div>
  );
};

export default ContentAndMediaElement;
