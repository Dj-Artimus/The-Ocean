import React, { useState } from "react";
import SailingRoundedIcon from "@mui/icons-material/SailingRounded";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CycloneIcon from "@mui/icons-material/Cyclone";
import AnchorIcon from "@mui/icons-material/Anchor";
import { UIStore } from "@/store/OceanStore";

const ProfilePanel = ({
  poster_url,
  avatar_url,
  name,
  username,
  gender,
  age,
  wave,
  anchors,
  anchorings,
}) => {
  const { setIsProfileEditModalOpen } = UIStore();

  return (
    <div>
      {/* PROFILE PIC AND BANNER STARTS HERE */}
      <div className="relative">
        <div className="w-full ">
          <img
            src={ poster_url }
            alt="profile"
            className=" my-2 w-full object-cover max-h-[50vw] sm:max-h-[40vw] lg:max-h-[30vw] rounded-xl border border-slate-700"
          />
        </div>
        <div className="absolute bottom-0 left-0 w-full p-2">
          <img
            src={avatar_url}
            alt="profile"
            className="size-[22%] min-w-14 m-2 rounded-full border p-1 xs6:p-2 border-transparent bg-primary dark:bg-d_primary bg-opacity-70 backdrop-blur-sm shadow-sm shadow-blue-500"
          />
        </div>
        <div
          onClick={() => {
            setIsProfileEditModalOpen(true);
          }}
          className="p-1 px-4 pe-3 flex text-sm items-center gap-1 border backdrop-blur-sm bg-opacity-50 dark:bg-opacity-10 border-slate-600 shadow-sm shadow-blue-600 rounded-full hover:bg-foreground dark:hover:bg-d_foreground absolute right-4 bottom-4 xs6:-bottom-14 bg-primary dark:bg-d_primary cursor-pointer z-10 scale-75 xs1:scale-100"
        >
          Profile
          <EditNoteIcon className=" size-7" />
        </div>
      </div>
      {/* PROFILE PIC AND BANNER ENDS HERE */}
      {/* NAMING BAR STARTS HERE */}
      <div className="flex flex-col w-full px-2 justify-between relative">
        <div className="flex gap-2">
          <div className="mx-1 leading-snug my-1 hidden xs:block max-w-96">
            <div className="flex justify-center flex-col">
              <h1 className="font-semibold text-2xl">{name}</h1>
              <p className="text-[14px] md:w-full">{wave}</p>
              <div className="text-text_clr2 gap-3 items-center dark:text-d_text_clr2 font-semibold text-[15px] mt-1 xs:hidden xs1:flex">
                <h1>
                  <CycloneIcon /> {username}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <span>•</span>
                  <span>{age}</span>
                  <img src={`images/${gender == "other" ? "jellyfish" : gender == "male" ? "shark" : "dolphin" }.png`} alt={gender} className="size-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col xs3:flex-row xs3:gap-2 xs3:items-center text-blue-500 font-semibold">
          <div className="flex gap-1 hover:bg-foreground dark:hover:bg-d_foreground hover:text-blue-400 p-2 rounded-xl cursor-pointer">
            <h1>{anchors}</h1>
            <AnchorIcon className="size-6" />
            <h1>Anchors</h1>
          </div>
          <span className="text-slate-500 -mx-2 xs4:mx-0 hidden xs3:block">
            •
          </span>
          <div className="flex gap-1 hover:bg-foreground dark:hover:bg-d_foreground hover:text-blue-400 p-2 rounded-xl cursor-pointer">
            <h1>{anchorings}</h1>
            <SailingRoundedIcon className="size-6" />
            <h1>Anchorings</h1>
          </div>
        </div>
      </div>
      {/* NAMING BAR ENDS HERE */}
    </div>
  );
};

export default ProfilePanel;
