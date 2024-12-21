import React, { useState } from "react";
import AnchorIcon from "@mui/icons-material/Anchor";
import { getPlatformIcon } from "@/utils/PlatformIconGetter";

import {
  Anchor,
  Cyclone,
  Facebook,
  Instagram,
  LinkedIn,
  Sailing,
  SailingRounded,
  X,
  YouTube,
} from "@mui/icons-material";
import Button from "./Button";
import { UserStore } from "@/store/UserStore";
import { redirect } from "next/navigation";
import Image from "next/image";
import { UIStore } from "@/store/UIStore";
import { formatCount } from "@/utils/TimeAndCountFormater";

const OceaniteCard = ({
  oceaniteData,
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
    profileData,
    AnchorOceanite,
    UnAnchorOceanite,
    anchoringsIds,
    setOceaniteProfileData,
  } = UserStore();
  const { oceanVision } = UIStore();
  const [isAnchoring, setIsAnchoring] = useState(false);

  const handleAnchor = async (anchoring_id) => {
    setIsAnchoring(true);
    try {
      if (anchoring_id) {
        if (anchoringsIds.includes(anchoring_id)) {
          await UnAnchorOceanite(anchoring_id);
        } else {
          await AnchorOceanite(anchoring_id);
        }
      }
    } catch (error) {
    } finally {
      setIsAnchoring(false);
    }
  };

  return (
    <div className="my-3 border bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-500 dark:shadow-blue-900 rounded-3xl border-slate-700">
      <div className="flex justify-between items-center px-3 pt-1 rounded-2xl">
        {/* HEADING BAR STARTS HERE */}
        <div className="flex items-center w-full justify-between">
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <img
                src={avatar_url}
                alt="profile"
                className="!size-14 !object-cover my-2 rounded-2xl border-2 border-slate-500"
              />
            </div>
            <div className="mx-1 leading-snug mt-1 hidden xs:block max-w-96">
              <div
                onClick={() => {
                  setOceaniteProfileData(oceaniteData);
                  redirect("/oceanite-profile");
                }}
                className="flex justify-center flex-col"
              >
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
                  {platform && (
                    <>
                      <span className="mx-1 text-slate-500 xs:hidden xs3:block">
                        •
                      </span>
                      {getPlatformIcon(platform)}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="">
            {user_id === profileData.id ? (
              <Button className="xs1:flex text-lg flex-col items-center p-4 rounded-xl text-slate-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary hover:text-blue-400">
                You
              </Button>
            ) : (
              <div
                onClick={() => {
                  handleAnchor(user_id);
                }}
              >
                {anchoringsIds.includes(user_id) ? (
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
      <div className="flex w-full items-center px-4 sm:px-10 py-4">
        {/* OCEAN SCORE STARTS HERE */}
        <div className="rounded-xl  shadow-sm shadow-blue-400 dark:shadow-blue-800 overflow-hidden w-full">
          <div
            className="flex w-full gap-2 divide-slate-600 items-center  bg-foreground dark:bg-d_foreground p-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex justify-between w-full items-center">
              <div className="xs1:flex justify-center gap-1 p-1 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary w-full hover:text-blue-400">
                <Anchor />
                <h1 className="-mb-1">{formatCount(anchors)}</h1>
              </div>
              <div className="xs1:flex justify-center gap-2 p-1 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary w-full hover:text-blue-400">
                <SailingRounded />
                <h1 className="-mb-1">{formatCount(anchorings)}</h1>
              </div>
            </div>
            <span className="text-slate-600"> • </span>
            <div className="flex justify-center gap-2 items-center w-full">
              <Cyclone sx={{ width: "26px", height: "26px" }} />

              {oceanVision && (
                <>
                  <LinkedIn sx={{ width: "26px", height: "26px" }} />
                  <Instagram sx={{ width: "26px", height: "26px" }} />
                  <Facebook sx={{ width: "26px", height: "26px" }} />
                  <X />
                  <YouTube sx={{ width: "26px", height: "26px" }} />
                </>
              )}
            </div>
          </div>
        </div>
        {/* OCEAN SCORE ENDS HERE */}
      </div>
    </div>
  );
};

export default OceaniteCard;
