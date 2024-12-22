"use client";
import React, { useState, useEffect, useCallback } from "react";
import AnchorIcon from "@mui/icons-material/Anchor";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import AssistantIcon from "@mui/icons-material/Assistant";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import IosShareRoundedIcon from "@mui/icons-material/IosShareRounded";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import AssistantOutlinedIcon from "@mui/icons-material/AssistantOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { getPlatformIcon } from "@/utils/PlatformIconGetter";
import { MoreVert, Sailing } from "@mui/icons-material";
import { DropletStore } from "@/store/DropletStore";
import { UserStore } from "@/store/UserStore";
import UILoader from "./UILoader";
import { UIStore } from "@/store/UIStore";
import Button from "./Button";
import DropletLoader from "./DropletLoader";
import { useRouter } from "next/navigation";
import { formatCount, getTime } from "@/utils/TimeAndCountFormater";
import Image from "next/image";
import ContentAndMediaElement from "./ContentAndMediaElement";

const Droplet = ({
  droplet_id,
  author_id,
  avatar_url,
  authorData,
  name,
  username,
  wave,
  platform,
  time,
  content,
  images = [],
  videos = [],
  stars,
  ripples,
  redrops,
}) => {
  const {
    rippleDrawerOpen,
    setIsRippleDrawerOpen,

    setRippleDrawerDropletId,
    ripplesRefreshId,
    setContentToEdit,
    setContentEditId,
    setIsMoreOptionsModalOpen,
    setIsShareOptionsModalOpen,
    setDropletIdToShare,
    setContentToEditType,
    oceanVision,
    setDropletContentToShare,
  } = UIStore();
  const {
    StarDroplet,
    UnStarDroplet,
    CheckIsDropletStaredByUser,
    GemDroplet,
    UnGemDroplet,
    CheckIsUserGemmedDroplet,
    CheckIsUserRippledDroplet,
    subscribeToDropletChanges,
    dropletsData,
  } = DropletStore();
  const {
    profileData,
    AnchorOceanite,
    UnAnchorOceanite,
    anchoringsIds,
    setOceaniteProfileData,
  } = UserStore();
  const [gemmed, setGemmed] = useState(false);
  const [stared, setStared] = useState(false);
  const [rippled, setRippled] = useState(false);
  const [isStaring, setIsStaring] = useState(false);
  const [isGemming, setIsGemming] = useState(false);
  const [isRippleInitiated, setIsRippleInitiated] = useState(false);
  const [isAnchoring, setIsAnchoring] = useState(false);

  const [isDropletLoading, setIsDropletLoading] = useState(true);

  const redirect = useRouter();

  const handleAnchor = useCallback(
    async (anchoring_id) => {
      setIsAnchoring(true);
      try {
        if (anchoring_id) {
          if (anchoringsIds.includes(anchoring_id)) {
            const isAnchoring = await UnAnchorOceanite(anchoring_id);
            // setAnchoring(!isAnchoring);
          } else {
            const isAnchoring = await AnchorOceanite(anchoring_id);
            // setAnchoring(isAnchoring);
          }
        }
      } catch (error) {
      } finally {
        setIsAnchoring(false);
      }
    },
    [setIsAnchoring, anchoringsIds, UnAnchorOceanite, AnchorOceanite]
  );

  const checkIsDropletRippled = useCallback(
    async (droplet_id) => {
      try {
        if (droplet_id) {
          const rippled = await CheckIsUserRippledDroplet(droplet_id);
          return setRippled(rippled);
        }
      } catch (error) {}
    },
    [setRippled, CheckIsUserRippledDroplet]
  );

  const handleStarADroplet = useCallback(
    async (droplet_id) => {
      try {
        setIsStaring(true);
        if (droplet_id) {
          if (stared) {
            const isUnStared = await UnStarDroplet(droplet_id);
            setStared(!isUnStared);
          } else {
            const isStared = await StarDroplet(droplet_id);
            setStared(isStared);
          }
        }
      } catch (error) {
      } finally {
        setIsStaring(false);
      }
    },
    [stared, setIsStaring, UnStarDroplet, StarDroplet, setStared]
  );

  const handleGemDroplet = useCallback(
    async (droplet_id) => {
      setIsGemming(true);
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
      } catch (error) {
      } finally {
        setIsGemming(false);
      }
    },
    [UnGemDroplet, GemDroplet, setGemmed, setIsGemming, gemmed]
  );

  useEffect(() => {
    checkIsDropletRippled(droplet_id);
  }, [ripplesRefreshId, isRippleInitiated, checkIsDropletRippled, droplet_id]);

  useEffect(() => {
    if (!rippleDrawerOpen && isRippleInitiated) {
      setIsRippleInitiated(false);
      const checkRippled = async () => {
        await checkIsDropletRippled(droplet_id);
      };
      checkRippled();
    }
  }, [rippleDrawerOpen, isRippleInitiated, droplet_id, checkIsDropletRippled]);

  const loadDropletData = useCallback(async () => {
    try {
      setIsDropletLoading(true);
      if (droplet_id) {
        const [isStared, isGemmed, rippled] = await Promise.all([
          CheckIsDropletStaredByUser(droplet_id),
          CheckIsUserGemmedDroplet(droplet_id),
          CheckIsUserRippledDroplet(droplet_id),
        ]);
        setStared(isStared);
        setGemmed(isGemmed);
        setRippled(rippled);
      }
    } catch (error) {
      console.error("Error loading droplet data:", error);
    } finally {
      setIsDropletLoading(false);
    }
  }, [
    setIsDropletLoading,
    droplet_id,
    CheckIsDropletStaredByUser,
    CheckIsUserGemmedDroplet,
    CheckIsUserRippledDroplet,
    setStared,
    setGemmed,
    setRippled,
  ]);

  useEffect(() => {
    loadDropletData();
    // Set up real-time subscription for updates
    const unsubscribe = subscribeToDropletChanges(droplet_id);
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [droplet_id, loadDropletData, subscribeToDropletChanges]);

  return (
    <div className="">
      <div className="my-3 border bg-foreground dark:bg-d_foreground relative shadow-sm shadow-blue-300 dark:shadow-blue-950 rounded-3xl border-slate-700">
        {isDropletLoading && <DropletLoader />}
        <div className="flex justify-between items-center px-3 pt-1 rounded-2xl">
          {/* HEADING BAR STARTS HERE */}
          <div className="flex items-center w-full justify-between">
            <div className="flex gap-2">
              <div className="flex-shrink-0 my-2 ">
                <Image
                  width={56}
                  height={56}
                  src={avatar_url}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/jellyfishFallback.png";
                  }}
                  alt="profile"
                  className="!size-14 !object-cover rounded-2xl border-2 border-slate-500"
                />
              </div>
              <div className="mx-1 leading-snug mt-1 hidden xs:block max-w-96">
                <div
                  onClick={() => {
                    setOceaniteProfileData(authorData);
                    redirect.push("/oceanite-profile");
                  }}
                  className="flex justify-center flex-col"
                >
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
                <Button
                  onClick={() => {
                    setContentEditId(droplet_id);
                    setContentToEdit(content);
                    setContentToEditType("Droplet");
                    setIsMoreOptionsModalOpen(true);
                  }}
                  className="w-fit h-fit rounded-xl -mt-6 -me-1 cursor-pointer"
                >
                  <MoreVert
                    sx={{
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </Button>
              ) : (
                <div
                  onClick={() => {
                    handleAnchor(author_id);
                  }}
                >
                  {anchoringsIds.includes(author_id) ? (
                    <Button
                      disabled={isAnchoring}
                      className="xs1:flex text-xs flex-col items-center p-2 rounded-xl text-slate-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary hover:text-blue-400"
                    >
                      <Sailing className="text-blue-500" /> <h1>Anchoring</h1>
                    </Button>
                  ) : (
                    <Button
                      disabled={isAnchoring}
                      className="xs1:flex flex-col items-center p-2 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary hover:text-blue-400"
                    >
                      <AnchorIcon /> <h1>Anchor</h1>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* HEADING BAR ENDS HERE */}
        </div>
        <hr className="mx-4 mt-1 border-slate-700" />

        <div className="px-4 pt-3">
          {/*  DROPLET CONTENT AND MEDIA STARTS HERE  */}
          <ContentAndMediaElement
            content={content}
            images={images}
            videos={videos}
          />
          {/*  DROPLET CONTENT AND MEDIA ENDS HERE  */}
        </div>

        <hr className="mx-4 border-slate-700" />
        <div className="flex w-full justify-between items-center px-4 sm:px-10 py-3">
          <div className="flex items-center">
            <Button
              disabled={isStaring}
              onClick={() => handleStarADroplet(droplet_id)}
              className="cursor-pointer"
              title="like"
            >
              {stared ? (
                <StarRoundedIcon className="!size-[34px] text-amber-400 stroke-amber-500 " />
              ) : (
                <StarOutlineRoundedIcon className="!size-[34px] " />
              )}
            </Button>
            <h1>{formatCount(stars)}</h1>
          </div>

          {oceanVision && (
            <div className="flex items-center gap-[1px]">
              <Button>
                <RepeatRoundedIcon
                  className="!size-7 cursor-pointer"
                  title="Repost"
                />
              </Button>
              <h1> {formatCount(redrops)} </h1>
            </div>
          )}
          <div className="flex items-center gap-[1px]">
            <Button
              onClick={() => {
                setIsRippleInitiated(true);
                setIsRippleDrawerOpen(true);
                setRippleDrawerDropletId(droplet_id);
              }}
              className="cursor-pointer"
            >
              {rippled ? (
                <AssistantIcon
                  className="!size-7 text-sky-500 stroke-sky-700 dark:stroke-none "
                  title="Comment"
                />
              ) : (
                <AssistantOutlinedIcon className="!size-7" title="Comment" />
              )}
            </Button>
            <h1> {formatCount(ripples)} </h1>
          </div>
          <Button
            onClick={() => {
              setDropletIdToShare(droplet_id);
              setDropletContentToShare(content);
              setIsShareOptionsModalOpen(true);
            }}
            className="flex items-center cursor-pointer"
          >
            <IosShareRoundedIcon
              className="!size-7 cursor-pointer mb-[1px]"
              title="Share"
            />
          </Button>
          <Button
            disabled={isGemming}
            onClick={() => handleGemDroplet(droplet_id)}
            className="cursor-pointer"
          >
            {gemmed ? (
              <BookmarkRoundedIcon
                className="!size-[30px] text-emerald-500 stroke-emerald-600 "
                title="Save"
              />
            ) : (
              <BookmarkBorderRoundedIcon
                className="!size-[30px]"
                title="Save"
              />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Droplet;
