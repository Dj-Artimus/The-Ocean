import React, { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import AnchorIcon from "@mui/icons-material/Anchor";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import AssistantIcon from "@mui/icons-material/Assistant";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { getPlatformIcon } from "@/utils/PlatformIconGetter";
import { UIStore } from "@/store/OceanStore";
import VideoElement from "./VideoElement";
import DropletContentElement from "./DropletContentElement";
import OceanScore from "./OceanScore";
import { Anchor, Facebook, Instagram, LinkedIn, SailingRounded, X, YouTube } from "@mui/icons-material";

const OceaniteCard = ({
  ocean_id,
  user_id,
  avatar_url,
  name,
  username,
  wave,
  platform,
  anchors,
  anchorings,
}) => {
  const {
    setImgViewerSources,
    isCommentDrawerOpen,
    setIsCommentDrawerOpen,
    setImgViewerIndex,
  } = UIStore();
  const [bookmarked, setbookmarked] = useState(false);
  const [stared, setStared] = useState(false);
  const [commented, setCommented] = useState(false);
  const [currentImage, setCurrentImage] = useState(0); // For image slider navigation
  const [currentVideo, setCurrentVideo] = useState(0); // For video slider navigation

  const getTime = (time) => {
    return time;
  };

  // Handles image slider navigation
  const handleImageChange = (index) => {
    setCurrentImage(index);
  };

  // Handles video slider navigation
  const handleVideoChange = (index) => {
    setCurrentVideo(index);
  };

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
    <div className="my-3 border bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 rounded-3xl border-slate-700">
      <div className="flex justify-between items-center px-3 pt-1 rounded-2xl">
        {/* HEADING BAR STARTS HERE */}
        <div className="flex items-center w-full justify-between">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <img
                src={avatar_url}
                alt="profile"
                className="size-14 my-2 rounded-2xl border-2 border-slate-500"
              />
            </div>
            <div className="mx-1 leading-snug mt-1 hidden xs:block max-w-96">
              <div className="flex justify-center flex-col">
                <h1 className="font-semibold leading-non truncate xs:w-[44vw] xs2:w-[49vw] xs3:w-[52vw] xs4:w-[58vw] xs5:w-[62vw] sm:w-[45vw] md:w-[52vw]">
                  {name}
                </h1>
                <p className="text-[14px] truncate xs:w-[44vw] xs2:w-[49vw] xs3:w-[52vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw] max-w-96 md:w-[52vw]">
                  {wave}
                </p>
                <div className="flex items-center gap-1 truncate xs:w-[44vw] xs2:w-[49vw] xs3:w-[52vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw] max-w-fit md:w-[52vw] ">
                  <h1 className="text-text_clr2 dark:text-d_text_clr2 font-semibold text-[14px] xs:hidden xs1:block truncate xs:w-[40vw] xs2:w-[45vw] xs3:w-[50vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw] md:w-[35vw] max-w-fit">
                    <span className="font-sans text-[15px]">@</span>
                    {username}
                  </h1>
                  <span className="mx-1 text-slate-500 xs:hidden xs3:block">
                    •
                  </span>
                  {getPlatformIcon(platform)}
                </div>
              </div>
            </div>
          </div>
          <div className="xs1:flex flex-col items-center p-2 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary hover:text-blue-400">
            <AnchorIcon />
            <h1>Anchor</h1>
          </div>
        </div>
        {/* HEADING BAR ENDS HERE */}
      </div>
      <hr className="mx-4 mt-1 border-slate-700" />
      <div className="flex w-full items-center px-4 sm:px-10 py-4">

        {/* OCEAN SCORE STARTS HERE */}
        <div className="rounded-xl  shadow-sm shadow-blue-500 overflow-hidden w-full">
          <div className="flex w-full gap-2 divide-slate-600 items-center  bg-foreground dark:bg-d_foreground p-1 overflow-x-auto" style={{scrollbarWidth:'none'}} >
            <div className="flex justify-between w-full items-center" >
              <div className="xs1:flex justify-center gap-1 p-1 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary w-full hover:text-blue-400">
                <Anchor />
                <h1 className="-mb-1">{anchors}</h1>
              </div>
              <div className="xs1:flex justify-center gap-2 p-1 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary w-full hover:text-blue-400">
                <SailingRounded />
                <h1 className="-mb-1">{anchorings}</h1>
              </div>
            </div>
            <span className="text-slate-600" > • </span>
            <div className="flex justify-center gap-2 items-center w-full" >
              <LinkedIn className="size-7" />
              <Instagram className="size-7" />
              <Facebook className="size-7" />
              <X />
              <YouTube className="size-7" />
            </div>
          </div>
        </div>
        {/* OCEAN SCORE ENDS HERE */}

      </div>
    </div>
  );
};

export default OceaniteCard;
