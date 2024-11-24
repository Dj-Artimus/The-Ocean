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
import { DropletStore, UIStore, UserStore } from "@/store/OceanStore";
import VideoElement from "./VideoElement";
import DropletContentElement from "./DropletContentElement";
import { Router } from "next/router";
import { CycloneRounded, MoreVert } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";

const DropletLoader = () => {
  return (
    <div className="absolute bg-slate-950 bg-opacity-10 w-full h-full backdrop-blur-[0.5px] rounded-3xl z-20 overflow-hidden flex justify-center">
      <div className="translate-y-14 mt-1 animate-pulse">
        <CycloneRounded className=" text-blue-200 animate-spin  size-10" />
      </div>
    </div>
  );
};

const Droplet = ({
  droplet_id,
  author_id,
  avatar_url,
  name,
  username,
  wave,
  platform,
  time,
  content,
  images = [],
  videos = [],
  dropletStars,
  dropletRipples,
  redrops,
}) => {
  const {
    setImgViewerSources,
    isRippleDrawerOpen,
    setIsRippleDrawerOpen,
    setImgViewerIndex,
    setRippleDrawerDropletId,
    ripplesRefreshId,
    setContentToEdit,
    setContentEditId,
    setIsMoreOptionsModalOpen,
    setContentToEditType,
  } = UIStore();
  const {
    StarDroplet,
    UnStarDroplet,
    GetDropletStars,
    CheckIsDropletStaredByUser,
    GemDroplet,
    UnGemDroplet,
    CheckIsUserGemDroplet,
    CheckIsUserRippleDroplet,
    GetRipples,
  } = DropletStore();
  const { profileData } = UserStore();
  const [gemmed, setGemmed] = useState(false);
  const [stared, setStared] = useState(false);
  const [stars, setStars] = useState(dropletStars || 0);
  const [ripples, setRipples] = useState(dropletRipples || 0);
  const [isRippled, setIsRippled] = useState(false);
  const [isRippleInitiated, setIsRippleInitiated] = useState(false);
  const [currentImage, setCurrentImage] = useState(0); // For image slider navigation
  const [currentVideo, setCurrentVideo] = useState(0); // For video slider navigation

  const [isDropletLoading, setIsDropletLoading] = useState(true);

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

  const getStars = async (droplet_id) => {
    try {
      if (droplet_id) {
        const stars = await GetDropletStars(droplet_id);
        const isStared = await CheckIsDropletStaredByUser(droplet_id);
        setStared(isStared);
        return setStars(stars?.length);
      }
    } catch (error) {}
  };

  const checkIsDropletGemmed = async (droplet_id) => {
    try {
      if (droplet_id) {
        const isGemmed = await CheckIsUserGemDroplet(droplet_id);
        return setGemmed(isGemmed);
      }
    } catch (error) {}
  };

  const checkIsDropletRippled = async (droplet_id) => {
    try {
      if (droplet_id) {
        const isRippled = await CheckIsUserRippleDroplet(droplet_id);
        const getRipplesCount = await GetRipples(droplet_id);
        setRipples(getRipplesCount?.length);
        return setIsRippled(isRippled);
      }
    } catch (error) {}
  };

  const handleStarADroplet = async (droplet_id) => {
    try {
      if (droplet_id) {
        if (stared) {
          const isUnStared = await UnStarDroplet(droplet_id);
          setStared(!isUnStared);
        } else {
          const isStared = await StarDroplet(droplet_id);
          setStared(isStared);
        }
      }
    } catch (error) {}
  };

  const handleGemDroplet = async (droplet_id) => {
    try {
      if (droplet_id) {
        if (gemmed) {
          const isGemmed = await UnGemDroplet(droplet_id);
          setGemmed(!isGemmed);
        } else {
          const isGemmed = await GemDroplet(droplet_id);
          setGemmed(isGemmed);
        }
      }
    } catch (error) {}
  };

  const setLoaderStatus = (status) => {
    setIsDropletLoading(status);
   }

  useEffect(() => {
    setLoaderStatus(true);
    getStars(droplet_id);
    setLoaderStatus(false);
  }, [stared]);

  useEffect(() => {
    setLoaderStatus(true);
    checkIsDropletGemmed(droplet_id);
    setLoaderStatus(false);
  }, [gemmed]);

  useEffect(() => {
    setLoaderStatus(true);
    checkIsDropletRippled(droplet_id);
    setLoaderStatus(false);
  }, [ripplesRefreshId && isRippleInitiated]);

  useEffect(() => {
    setLoaderStatus(true);
    if (!isRippleDrawerOpen && isRippleInitiated) setIsRippleInitiated(false);
    setLoaderStatus(false);
  }, [isRippleDrawerOpen]);

  // useEffect(() => {
  //   setIsDropletLoading(false);
  // }, [])

  const loadDropletData = async () => {
    try {
      setIsDropletLoading(true);
      if (droplet_id) {
        const [starsCount, isStared, isGemmed, isRippled , ripplesCount] =
          await Promise.all([
            GetDropletStars(droplet_id),
            CheckIsDropletStaredByUser(droplet_id),
            CheckIsUserGemDroplet(droplet_id),
            CheckIsUserRippleDroplet(droplet_id),
            GetRipples(droplet_id),
          ]);
          
          setStars(starsCount?.length || 0);
          setStared(isStared);
          setGemmed(isGemmed);
          setIsRippled(isRippled);
          setRipples(ripplesCount?.length || 0);
      }
    } catch (error) {
      console.error("Error loading droplet data:", error);
    } finally {
      setIsDropletLoading(false);
    }
  };

  useEffect(() => {
    loadDropletData();
  }, [droplet_id]);

  if (droplet_id)
    return (
      <div className="">
        <div className="my-3 border bg-foreground dark:bg-d_foreground relative shadow-sm shadow-blue-600 rounded-3xl border-slate-700">
          {isDropletLoading && <DropletLoader />}

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
                    <h1 className="font-semibold leading-non truncate xs:w-[44vw] xs2:w-[49vw] xs3:w-[52vw] xs4:w-[58vw] xs5:w-[62vw] sm:w-[45vw] md:w-[52vw] break-all">
                      {name}
                    </h1>
                    <p className="text-[14px] truncate xs:w-[44vw] xs2:w-[49vw] xs3:w-[52vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw] max-w-96 md:w-[52vw] break-all ">
                      {wave}
                    </p>
                    <div className="flex items-center gap-1 truncate xs:w-[44vw] xs2:w-[49vw] xs3:w-[52vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw] max-w-fit md:w-[52vw] ">
                      <h1 className="text-text_clr2 dark:text-d_text_clr2 font-semibold text-[14px] xs:hidden xs1:block truncate xs:w-[40vw] xs2:w-[45vw] xs3:w-[50vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw] md:w-[35vw] max-w-fit break-all ">
                        <span className="font-sans text-[15px]">@</span>
                        {username}
                      </h1>
                      <span className="mx-1 text-slate-500 xs:hidden xs3:block">
                        •
                      </span>
                      {getPlatformIcon(platform)}
                      <span className="mx-1 text-slate-500 hidden xs2:block">
                        •
                      </span>
                      <h1 className="text-sm">{getTime(time)}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                {author_id === profileData.id ? (
                  <div
                    onClick={() => {
                      console.log("openig model..");
                      setContentEditId(droplet_id);
                      setContentToEdit(content);
                      setContentToEditType("Droplet");
                      setIsMoreOptionsModalOpen(true);
                    }}
                    className="w-fit h-fit rounded-xl -mt-6 -me-1 cursor-pointer"
                  >
                    <MoreVert />
                  </div>
                ) : (
                  <div className="xs1:flex flex-col items-center p-2 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary hover:text-blue-400">
                    <AnchorIcon /> <h1>Anchor</h1>
                  </div>
                )}
              </div>
            </div>
            {/* HEADING BAR ENDS HERE */}
          </div>
          <hr className="mx-4 mt-1 border-slate-700" />
          <div className="px-4 py-3 pb-4">
            {/*  DROPLET CONTENT STARTS HERE  */}
            <DropletContentElement key={Router.asPath} content={content} />
            {/*  DROPLET CONTENT ENDS HERE  */}
            {/* Image Gallery or Slider */}
            {images?.length > 1 ? (
              <div className="relative">
                {/* Slider image display */}
                <img
                  src={images[currentImage]?.split("<|>")[0]}
                  alt={`Image ${currentImage + 1}`}
                  onClick={() => {
                    setImgViewerIndex(currentImage);
                    setImgViewerSources(images);
                  }}
                  {...swipeHandlersForImages}
                  className="rounded-xl shadow shadow-slate-500 p-[2px] xl:max-h-96 xs4:max-h-[80vh] m-auto"
                />
                {/* Dot navigation */}
                <div className="flex justify-center mt-2 space-x-2">
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
              </div>
            ) : (
              // Single image display
              images[0] && (
                <img
                  src={images[0]?.split("<|>")[0]}
                  alt="Image"
                  onClick={() => {
                    setImgViewerSources([images[0]]);
                  }}
                  className="rounded-xl shadow shadow-slate-500 p-[2px] xl:max-h-96 xs4:max-h-[80vh] m-auto"
                />
              )
            )}
            {/* Video Gallery or Slider */}
            {videos?.length > 1 ? (
              <div className="relative mt-2">
                {/* Slider video display */}
                <VideoElement
                  videos={videos}
                  currentVideo={currentVideo}
                  swipeHandlers={swipeHandlersForVideos}
                />
                {/* Dot navigation for video */}
                <div className="flex justify-center mt-2 space-x-2">
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
              videos[0] && (
                <VideoElement videos={videos} currentVideo={currentVideo} />
              )
            )}
          </div>
          <hr className="mx-4 mt-1 border-slate-700" />
          <div className="flex w-full justify-between items-center px-5 sm:px-10 py-4">
            <div className="flex items-center gap-2">
              <div
                onClick={() => handleStarADroplet(droplet_id)}
                className="-ms-[6px] cursor-pointer hover:scale-110 active:scale-95"
                title="like"
              >
                {stared ? (
                  <StarRoundedIcon className="size-[33px] text-amber-400 stroke-amber-500 translate-x-2" />
                ) : (
                  <StarOutlineRoundedIcon className="size-[33px] translate-x-2" />
                )}
              </div>
              <h1>{stars}</h1>
            </div>
            <div className="flex items-center gap-1">
              <div
                onClick={() => {
                  setIsRippleInitiated(!isRippleInitiated);
                  setIsRippleDrawerOpen(!isRippleDrawerOpen);
                  setRippleDrawerDropletId(droplet_id);
                }}
                className="cursor-pointer hover:scale-110 active:scale-95"
              >
                {isRippled ? (
                  <AssistantIcon
                    className="size-7 text-sky-500 stroke-sky-700 dark:stroke-none "
                    title="Comment"
                  />
                ) : (
                  <AssistantOutlinedIcon className="size-7" title="Comment" />
                )}
              </div>
              <h1> {ripples} </h1>
            </div>
            <div className="flex items-center gap-1">
              <RepeatRoundedIcon
                className="size-7 cursor-pointer hover:scale-110 active:scale-95"
                title="Repost"
              />
              <h1> {redrops} </h1>
            </div>
            <IosShareRoundedIcon
              className="size-7 cursor-pointer hover:scale-110 active:scale-95"
              title="Share"
            />
            <div
              onClick={() => handleGemDroplet(droplet_id)}
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
        </div>
      </div>
    );
};

export default Droplet;
