import { getPlatformIcon } from "@/utils/PlatformIconGetter";
import React from "react";
import AnchorIcon from "@mui/icons-material/Anchor";
import SailingRoundedIcon from "@mui/icons-material/SailingRounded";

const PlatformScoreCard = ({ username, platform, anchors, anchorings }) => {
  return (
    <div className="flex items-center justify-between gap-1 py-1">
    <h1 className="text-text_clr2 dark:text-d_text_clr2 font-sans text-[14px] cursor-pointer truncate ">
      @{username}
    </h1>
    <div className="flex items-center gap-1">
      <span className="text-slate-500 xs:hidden xs3:block">
        •
      </span>
      <div className="text-text_clr dark:text-d_text_clr ">{getPlatformIcon(platform)}</div>
      <div className="text-text_clr2 w-16 bg-slate -600 dark:text-d_text_clr2">
        <div className="flex gap-1">
          <AnchorIcon className="size-4" /> <h1 className=" text-text_clr dark:text-d_text_clr" > {anchors} </h1>
        </div>
        <div className="flex gap-1">
          <SailingRoundedIcon className="size-4" /> <h1 className=" text-text_clr dark:text-d_text_clr" > {anchorings} </h1>
        </div>
      </div>
    </div>
  </div>
  );
};

export default PlatformScoreCard;
