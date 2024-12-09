"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { ArrowBack, Cyclone } from "@mui/icons-material";
import VideosContentElement from "@/components/VideosContentElement";
import { DropletStore } from "@/store/DropletStore";
import { UIStore } from "@/store/UIStore";
import VideoReactions from "@/components/VideoReactions";
import Image from "next/image";

const ReactVideosPage = () => {
  const router = useRouter();
  const { GetFeedVideos, feedVideos, setDropletDataType } = DropletStore();
  const { setIsMsgsOpen, setIsOCardOpen } = UIStore();

  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const controls = useAnimation();
  const videoRef = useRef(null);
  // const [videos, setVideos] = useState([]);

  const getVideos = useCallback(async () => {
    // const videoData =
    if (!hasMore) return;
    const newVideos = await GetFeedVideos(page, 5);
    if (newVideos?.length < 5 || newVideos === "end") {
      setHasMore(false); // Stop fetching if fewer than limit
    }
  }, [hasMore, GetFeedVideos]);

  useEffect(() => {
    setIsMsgsOpen(false);
    setIsOCardOpen(false);
    setDropletDataType("feedVideos");
  }, [setIsMsgsOpen, setIsOCardOpen, setDropletDataType]);

  useEffect(() => {
    getVideos();
  }, [page, getVideos]);

  const videoCount = feedVideos?.length;

  const SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger a swipe

  const handlers = useSwipeable({
    onSwipedUp: (eventData) => {
      if (eventData.deltaY <= -SWIPE_THRESHOLD && !expanded) {
        changeVideo("up");
      }
    },
    onSwipedDown: (eventData) => {
      if (eventData.deltaY >= SWIPE_THRESHOLD && !expanded) {
        changeVideo("down");
      }
    },
    preventDefaultTouchmoveEvent: !expanded,
  });

  const changeVideo = (direction) => {
    setCurrentVideo(
      (prev) => (prev + (direction === "up" ? 1 : -1) + videoCount) % videoCount
    );
    setIsPlaying(true);
    setExpanded(false);
    setCurrentTime(0);
  };

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }

    if (currentVideo === videoCount - 2) {
      setPage((prev) => prev + 1);
    }
  }, [currentVideo, controls, videoCount]);

  useEffect(() => {
    let interval;
    if (isPlaying && videoRef.current) {
      interval = setInterval(() => {
        setCurrentTime(videoRef.current.currentTime);
      }, 500);
    } else if (!isPlaying) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime =
        (e.nativeEvent.offsetX / e.target.clientWidth) *
        videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVideoClick = () => {
    if (expanded) return setExpanded(false);
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <>
      <div
        className="relative w-full h-screen bg-black overflow-hidden"
        {...handlers}
      >
        <div
          onClick={() => {
            router.push("/");
          }}
          className="fixed top-[1px] left-[1px] z-30 text-white bg-blue-700 bg-opacity-80 rounded-tl-none rounded-xl p-[2px] cursor-pointer"
        >
          <ArrowBack className="size-7" />
        </div>

        <motion.div
          className="w-full h-full flex justify-center items-center"
          animate={controls}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            key={feedVideos[currentVideo]?.droplet_id}
            autoPlay
            loop
            muted={false}
            playsInline
            src={feedVideos[currentVideo]?.url}
            className="w-full h-full rounded-lg p-1 object-contain"
          />
        </motion.div>

        {showControls && (
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl bg-black bg-opacity-50 rounded-full p-2"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <PauseIcon fontSize="inherit" />
            ) : (
              <PlayArrowIcon fontSize="inherit" />
            )}
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center mb-2">
            <img
              src={feedVideos[currentVideo]?.avatar}
              alt={feedVideos[currentVideo]?.author_name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/jellyfishFallback.png";
              }}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <h3 className="text-white font-semibold">
                {feedVideos[currentVideo]?.author_name}
              </h3>
              <p className="text-slate-300 flex justify-center gap-[2px] text-sm">
                <Cyclone className="size-[18px]" />{" "}
                {feedVideos[currentVideo]?.username}
              </p>
            </div>
          </div>
          <VideosContentElement
            content={feedVideos[currentVideo]?.content}
            expanded={expanded}
            setExpanded={setExpanded}
          />

          <VideoReactions video={feedVideos[currentVideo]} />

          <div
            className="mt-2 h-1 bg-gray-600 cursor-pointer rounded-md bg-opacity-40"
            onClick={handleSeek}
          >
            <div
              className="h-full rounded-md bg-blue-600 bg-opacity-50"
              style={{
                width: `${
                  (currentTime / videoRef.current?.duration) * 100 || 0
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div className="hidden lg:block">
          <button
            className="absolute top-[25%] right-4 text-white text-4xl z-10"
            onClick={() => changeVideo("up")}
          >
            <KeyboardArrowUpRoundedIcon fontSize="inherit" />
          </button>
          <button
            className="absolute bottom-[25%] right-4 text-white text-4xl z-10"
            onClick={() => changeVideo("down")}
          >
            <KeyboardArrowDownRoundedIcon fontSize="inherit" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ReactVideosPage;
