"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AssistantIcon from "@mui/icons-material/Assistant";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { ArrowBack, Cyclone } from "@mui/icons-material";
import { DropletStore } from "@/store/OceanStore";
import VideosContentElement from "@/components/VideosContentElement";

const VideosPage = () => {
  const router = useRouter();
  const { GetFeedVideos } = DropletStore();

  const [stared, setStared] = useState(false);
  const [rippled, setRippled] = useState(false);
  const [gemmed, setGemmed] = useState(false);

  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const controls = useAnimation();
  const videoRef = useRef(null);
  const [videos, setVideos] = useState([]);

  const getVideos = async () => {
    const videoData = await GetFeedVideos();
    const organizedData = videoData?.map((data) => {
        return data?.videos?.map((url) => {
          return {
            url: url?.split("<|>")[0],
            author_name: data?.user_id?.name,
            username: data?.user_id?.username,
            avatar: data?.user_id?.avatar?.split("<|>")[0],
            author_id: data?.user_id?.id,
            droplet_id: data?.id,
            content: data?.content,
            stars: data?.stars,
            ripples: data?.ripples,
            redrops: data?.redrops,
          };
        });
      })
      ?.flat();

    // Fisher-Yates Shuffle Algorithm
    const shuffleVideos = (array) => {
      for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index
        [array[i], array[j]] = [array[j], array[i]]; // Swap
      }
      return array;
    };

    // Shuffle the organizedData array
    const shuffledVideos = shuffleVideos(organizedData);

    console.log("organizedData", organizedData);
    console.log("shuffledVideos", shuffledVideos);
    setVideos(shuffledVideos);
  };

  useEffect(() => {
    getVideos();
  }, []);

  const videoCount = videos?.length;

  const handlers = useSwipeable({
    onSwipedUp: () => !expanded && changeVideo("up"),
    onSwipedDown: () => !expanded && changeVideo("down"),
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
  }, [currentVideo, controls]);

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

  const handleLike = () =>
    console.log("Liked video:", videos[currentVideo]?.droplet_id);
  const handleComment = () =>
    console.log("rippled on video:", videos[currentVideo]?.droplet_id);
  const handleShare = () =>
    console.log("Shared video:", videos[currentVideo]?.droplet_id);

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
            key={videos[currentVideo]?.droplet_id}
            autoPlay
            loop
            muted={false}
            playsInline
            src={videos[currentVideo]?.url}
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
              src={videos[currentVideo]?.avatar}
              alt={videos[currentVideo]?.author_name}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <h3 className="text-white font-semibold">
                {videos[currentVideo]?.author_name}
              </h3>
              <p className="text-slate-300 flex justify-center gap-[2px] text-sm">
                <Cyclone className="size-[18px]" />{" "}
                {videos[currentVideo]?.username}
              </p>
            </div>
          </div>
          <VideosContentElement
            content={videos[currentVideo]?.content}
            expanded={expanded}
            setExpanded={setExpanded}
          />

          <div className="flex max-w-[700px] justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div
                onClick={() => setStared(!stared)}
                className="-ms-[6px] cursor-pointer hover:scale-110 active:scale-95"
                title="like"
              >
                {stared ? (
                  <StarRoundedIcon className="size-[33px] text-amber-400 stroke-amber-500 translate-x-2" />
                ) : (
                  <StarOutlineRoundedIcon className="size-[33px] translate-x-2" />
                )}
              </div>
              <h1> {videos[currentVideo]?.stars} </h1>
            </div>
            <div className="flex items-center gap-1">
              <div
                onClick={() => setRippled(!rippled)}
                className="cursor-pointer hover:scale-110 active:scale-95"
              >
                {rippled ? (
                  <AssistantIcon
                    className="size-7 text-sky-500 stroke-sky-700 dark:stroke-none "
                    title="Comment"
                  />
                ) : (
                  <AssistantOutlinedIcon className="size-7" title="Comment" />
                )}
              </div>
              <h1>{videos[currentVideo]?.ripples}</h1>
            </div>
            <div className="flex items-center gap-1">
              <RepeatRoundedIcon
                className="size-7 cursor-pointer hover:scale-110 active:scale-95"
                title="Repost"
              />
              <h1> {videos[currentVideo]?.redrops} </h1>
            </div>
            <IosShareRoundedIcon
              className="size-7 cursor-pointer hover:scale-110 active:scale-95"
              title="Share"
            />
            <div
              onClick={() => setGemmed(!gemmed)}
              className="cursor-pointer hover:scale-110 active:scale-95"
            >
              {gemmed ? (
                <BookmarkRoundedIcon
                  className="size-7 text-emerald-500 stroke-emerald-600 "
                  title="Save"
                />
              ) : (
                <BookmarkBorderRoundedIcon className="size-7" title="Save" />
              )}
            </div>
          </div>

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

export default VideosPage;
