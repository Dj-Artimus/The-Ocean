import React, { useState } from "react";
import { redirect } from "next/navigation";
import {
  AddBox,
  BadgeRounded,
  Diversity1,
  ForumRounded,
  Houseboat,
  Notifications,
  OndemandVideo,
} from "@mui/icons-material";
import ProfileMenu from "./ProfileMenu";
import { UserStore } from "@/store/UserStore";
import { UIStore } from "@/store/UIStore";
import Image from "next/image";

const Navbar = ({ navStyle }) => {
  const { setIsMsgsOpen, setIsOCardOpen, setIsCreateDropletModalOpen } =
    UIStore();
  const { profileData } = UserStore();
  return (
    <div className={`${navStyle} bg-primary dark:bg-d_primary`}>
      {/* HOME NAVIGATION STARTS HERE */}
      <div
        onClick={() => {
          redirect("/");
        }}
        className="dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full "
      >
        <Houseboat className="size-9 xl:size-11" />
      </div>
      {/* HOME NAVIGATION ENDS HERE */}

      {/* VIDEOS NAVIGATION STARTS HERE */}
      <div
        onClick={() => {
          redirect("/videos");
        }}
        className="dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full "
      >
        <OndemandVideo className="size-8 xl:size-10" />
      </div>
      {/* VIDEOS NAVIGATION ENDS HERE */}

      {/* CREATE DROPLET STARTS HERE */}
      <div
        onClick={() => {
          setIsCreateDropletModalOpen(true);
        }}
        className="dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full "
      >
        <AddBox className="size-8 xl:size-10" />
      </div>
      {/* CREATE DROPLET ENDS HERE */}

      {/* MESSAGES NAVIGATION STARTS HERE */}
      <div
        className=" lg:hidden dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full "
        onClick={() => {
          try {
            setIsMsgsOpen(true);
            setIsOCardOpen(false);
          } catch (error) {}
          redirect("/chat");
        }}
      >
        <ForumRounded className="size-8 xl:size-10" />
      </div>
      {/* MESSAGES NAVIGATION ENDS HERE */}

      {/* OCEANITES NAVIGATION STARTS HERE */}
      <div
        className=" hidden lg:flex dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer items-center hover:text-blue-500 justify-center w-full "
        onClick={() => {
          redirect("/oceanites");
        }}
      >
        <Diversity1 className="size-8 xl:size-10" />
      </div>
      {/* OCEANITES NAVIGATION ENDS HERE */}

      {/* NOTIFICATION NAVIGATION STARTS HERE */}
      <div
        className=" hidden lg:flex dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer items-center hover:text-blue-500 justify-center w-full "
        onClick={() => {
          redirect("/notifications");
        }}
      >
        <Notifications className="size-8 xl:size-10" />
      </div>
      {/* NOTIFICATION NAVIGATION ENDS HERE */}

      {/* PROFILE NAVIGATION STARTS HERE */}
      <div
        onClick={() => {
          try {
            setIsMsgsOpen(false);
            setIsOCardOpen(false);
          } catch (error) {}
          redirect("/profile");
        }}
        className="dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl mt-[2px] -mb-[1px] lg:mt-[4px] lg:-mb-[2px] cursor-pointer w-full flex justify-center items-center"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ProfileMenu>
            <Image
              fill
              src={profileData?.avatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/jellyfishFallback.png";
              }}
              alt="profile"
              className="size-8 xl:size-10 rounded-xl border-2 border-slate-400 hover:border-blue-500 hover:border-4"
            />
          </ProfileMenu>
        </div>
      </div>
      {/* PROFILE NAVIGATION ENDS HERE */}
    </div>
  );
};

export default Navbar;
