
import { UIStore } from "@/store/UIStore";
import React, { useEffect, useRef, useState } from "react";

// To track mute/unmute across all videos

const VideoElement = ({ videos, currentVideo, swipeHandlers }) => {
  const { isVideoMuted, setIsVideoMuted } = UIStore();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement
            .play()
            .catch((error) => console.warn("Autoplay blocked:", error.message));
          setIsPlaying(true);
        } else {
          videoElement.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.9 } // Trigger when 90% of the video is in view
    );

    if (videoElement) observer.observe(videoElement);

    return () => {
      if (videoElement) observer.unobserve(videoElement);
    };
  }, [currentVideo]);

  const handleUnmute = () => {
    setIsVideoMuted(false); // Update the global mute state
  };

  return (
    <div className="w-full flex justify-center mb-4">
      <div {...swipeHandlers} className="relative">
        {/* Display "Unmute" button only if the video is muted */}
        {isVideoMuted && (
          <button
            onClick={handleUnmute}
            className="absolute top-2 left-2 z-10 shadow-slate-600 bg-gray-800 text-white p-2 rounded-xl bg-opacity-10 backdrop-blur-sm shadow-sm"
          >
            Unmute
          </button>
        )}
        <video
          ref={videoRef}
          controls
          muted={isVideoMuted}
          autoPlay={isPlaying}
          preload="auto"
          src={videos[currentVideo]?.split("<|>")[0]}
          className="rounded-xl shadow shadow-slate-500 p-[2px]"
          onVolumeChange={() => {
            if (videoRef.current && !videoRef.current.muted) {
              handleUnmute(); // Sync unmute across all videos
            }
          }}
        />
      </div>
    </div>
  );
};

export default VideoElement;
