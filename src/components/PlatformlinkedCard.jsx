import { getPlatformIcon } from "@/utils/PlatformIconGetter";
import Image from "next/image";
import React from "react";

const PlatformlinkedCard = ({ avatar_url, platform }) => {
  return (
    <div className="flex-shrink-0 bg-foreground dark:bg-d_foreground bg-opacity-50 p-2 rounded-xl relative flex flex-col items-center justify-between w-24 shadow-md dark:shadow-sm shadow-teal-800 dark:shadow-teal-500 hover:bg-ternary dark:hover:bg-d_ternary hover:scale-105 transition-transform duration-300">
      <Image
        fill
        src={avatar_url}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/jellyfishFallback.png";
        }}
        alt="profile"
        className="w-[74px] rounded-full my-1 border-2 border-slate-500"
      />
      {/* <h1 className="ml-2 text-xs">Not Connected</h1> */}
      <button className="p-1 relative bg-blue-600 rounded-xl mt-2 mb-1 text-sky -500 flex items-end w-f ull text-center">
        <div className="text-white ">
          {getPlatformIcon(
            platform,
            platform === "x" ? `size-6 p-[1px]` : "size-7"
          )}
        </div>
      </button>
    </div>
  );
};

export default PlatformlinkedCard;
