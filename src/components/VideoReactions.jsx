import { DropletStore } from "@/store/DropletStore";
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";
import {
  Assistant,
  AssistantOutlined,
  BookmarkBorderRounded,
  BookmarkRounded,
  IosShareRounded,
  RepeatRounded,
  StarOutlineRounded,
  StarRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Button from "./Button";

const VideoReactions = ({ video }) => {
  const {
    setImgViewerSources,
    rippleDrawerOpen,
    setIsRippleDrawerOpen,
    setImgViewerIndex,
    setRippleDrawerDropletId,
    ripplesRefreshId,
    expectedVersion,
    setDropletIdToShare,
    setIsShareOptionsModalOpen,
    setDropletContentToShare
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

  const [stared, setStared] = useState(false);
  const [rippled, setRippled] = useState(false);
  const [gemmed, setGemmed] = useState(false);
  const [isStaring, setIsStaring] = useState(false);
  const [isGemming, setIsGemming] = useState(false);
  const [isRippleInitiated, setIsRippleInitiated] = useState(false);

  const checkIsDropletRippled = async (video_id) => {
    try {
      if (video_id) {
        const rippled = await CheckIsUserRippledDroplet(video_id);
        return setRippled(rippled);
      }
    } catch (error) {}
  };

  const handleStarADroplet = async (video_id) => {
    try {
      console.log("stared a droplet and id is", video_id);
      setIsStaring(true);
      if (video_id) {
        if (stared) {
          const isUnStared = await UnStarDroplet(video_id);
          setStared(!isUnStared);
        } else {
          const isStared = await StarDroplet(video_id);
          setStared(isStared);
        }
      }
    } catch (error) {
    } finally {
      setIsStaring(false);
    }
  };

  const handleGemDroplet = async (video_id) => {
    setIsGemming(true);
    console.log("finding video_id for gem a droplet", video);
    console.log("video_id for gem a droplet", video_id);
    try {
      if (video_id) {
        if (gemmed) {
          const isGemmed = await UnGemDroplet(video_id);
          setGemmed(!isGemmed);
        } else {
          const isGemmed = await GemDroplet(video_id);
          setGemmed(isGemmed);
        }
      }
    } catch (error) {
    } finally {
      setIsGemming(false);
    }
  };

  useEffect(() => {
    checkIsDropletRippled(video?.droplet_id);
  }, [ripplesRefreshId && isRippleInitiated]);

  useEffect(() => {
    if (!rippleDrawerOpen && isRippleInitiated) {
      setIsRippleInitiated(false);
      const checkRippled = async () => {
        await checkIsDropletRippled(video?.droplet_id);
      };
      checkRippled();
    }
  }, [rippleDrawerOpen]);

  const loadDropletData = async (video_id) => {
    try {
      if (video_id) {
        const [isStared, isGemmed, rippled] = await Promise.all([
          CheckIsDropletStaredByUser(video_id),
          CheckIsUserGemmedDroplet(video_id),
          CheckIsUserRippledDroplet(video_id),
        ]);
        setStared(isStared);
        setGemmed(isGemmed);
        setRippled(rippled);
      }
    } catch (error) {
      console.error("Error loading droplet data:", error);
    } finally {
    }
  };

  useEffect(() => {
    loadDropletData(video?.droplet_id);

    // Set up real-time subscription for updates
    const unsubscribe = subscribeToDropletChanges(video?.droplet_id);
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [video]);

  return (
    <div className="flex max-w-[700px] justify-between items-center text-white">
      <div className="flex items-center gap-2">
        <Button
          disabled={isStaring}
          onClick={() => handleStarADroplet(video?.droplet_id)}
          className="-ms-[6px] cursor-pointer hover:scale-110 active:scale-95"
          title="like"
        >
          {stared ? (
            <StarRounded className="size-[33px] text-amber-400 stroke-amber-500 translate-x-2" />
          ) : (
            <StarOutlineRounded className="size-[33px] translate-x-2" />
          )}
        </Button>
        <h1> {video?.stars} </h1>
      </div>
      {expectedVersion && (
        <div className="flex items-center gap-1">
          <RepeatRounded
            className="size-7 cursor-pointer hover:scale-110 active:scale-95"
            title="Repost"
          />
          <h1> {video?.redrops} </h1>
        </div>
      )}

      <div className="flex items-center gap-1">
        <Button
          onClick={() => {
            console.log("Droplet id", video?.droplet_id);
            setIsRippleInitiated(true);
            setIsRippleDrawerOpen(true);
            setRippleDrawerDropletId(video?.droplet_id);
          }}
          className="cursor-pointer"
        >
          {rippled ? (
            <Assistant
              className="size-7 text-sky-500 stroke-sky-700 dark:stroke-none "
              title="Comment"
            />
          ) : (
            <AssistantOutlined className="size-7" title="Comment" />
          )}
        </Button>
        <h1>{video?.ripples}</h1>
      </div>
      <Button
        onClick={() => {
          console.log("openig model..");
          setDropletIdToShare(video?.droplet_id);
          setDropletContentToShare(video?.content);
          setIsShareOptionsModalOpen(true);
        }}
        className="flex items-center cursor-pointer"
      >
        <IosShareRounded
          className="size-7 cursor-pointer hover:scale-110 active:scale-95"
          title="Share"
        />
      </Button>

      <Button
        disabled={isGemming}
        onClick={() => handleGemDroplet(video?.droplet_id)}
        className="cursor-pointer"
      >
        {gemmed ? (
          <BookmarkRounded
            className="size-7 text-emerald-500 stroke-emerald-600 "
            title="Save"
          />
        ) : (
          <BookmarkBorderRounded className="size-7" title="Save" />
        )}
      </Button>
    </div>
  );
};

export default VideoReactions;
