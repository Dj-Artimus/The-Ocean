import React, { useEffect, useState } from "react";
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
// import { useRouter } from "next/router";
import { usePathname, useRouter } from "next/navigation";
import { CommunicationStore } from "@/store/CommunicationStore";

const Navbar = ({ navStyle }) => {
  const { setIsMsgsOpen, setIsOCardOpen, setIsCreateDropletModalOpen, setIsProfileEditModalOpen } =
    UIStore();
  const { profileData } = UserStore();
  const { setUnreadMsgsCountRefresher } = CommunicationStore();

  const router = useRouter();
  const pathname = usePathname();

  const getActiveClass = (path) =>
    pathname === path ? "text-blue-500" : "text-inherit";

  return (
    <div className={`${navStyle} bg-primary dark:bg-d_primary`}>
      {/* HOME NAVIGATION STARTS HERE */}
      <div
        onClick={() => {
          router?.push("/");
        }}
        className={`dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full ${getActiveClass(
          "/"
        )} `}
      >
        <Houseboat
          sx={{
            width: { xs: "35px", lg: "43px" },
            height: { xs: "35px", lg: "43px" },
          }}
        />
      </div>
      {/* HOME NAVIGATION ENDS HERE */}

      {/* VIDEOS NAVIGATION STARTS HERE */}
      <div
        onClick={() => {
          router?.push("/videos");
        }}
        className={`dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full ${getActiveClass(
          "/videos"
        )} `}
      >
        <OndemandVideo
          sx={{
            width: { xs: "32px", lg: "40px" },
            height: { xs: "32px", lg: "40px" },
          }}
        />
      </div>
      {/* VIDEOS NAVIGATION ENDS HERE */}

      {/* CREATE DROPLET STARTS HERE */}
      <div
        onClick={() => {
          setIsProfileEditModalOpen(false);
          setIsCreateDropletModalOpen(true);
        }}
        className="dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full "
      >
        <AddBox
          sx={{
            width: { xs: "32px", lg: "40px" },
            height: { xs: "32px", lg: "40px" },
          }}
        />
      </div>
      {/* CREATE DROPLET ENDS HERE */}

      {/* MESSAGES NAVIGATION STARTS HERE */}
      <div
        className={` lg:hidden dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer flex items-center hover:text-blue-500 justify-center w-full ${getActiveClass(
          "/chat"
        )}`}
        onClick={() => {
          try {
            setIsMsgsOpen(true);
            setIsOCardOpen(false);
            setUnreadMsgsCountRefresher(new Date().getTime())
          } catch (error) {}
          // router?.push("/chat");
        }}
      >
        <ForumRounded
          sx={{
            width: { xs: "32px", lg: "40px" },
            height: { xs: "32px", lg: "40px" },
          }}
        />
      </div>
      {/* MESSAGES NAVIGATION ENDS HERE */}

      {/* OCEANITES NAVIGATION STARTS HERE */}
      <div
        className={` hidden lg:flex dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer items-center hover:text-blue-500 justify-center w-full ${getActiveClass(
          "/oceanites"
        )}`}
        onClick={() => {
          router?.push("/oceanites");
        }}
      >
        <Diversity1
          sx={{
            width: { xs: "32px", lg: "40px" },
            height: { xs: "32px", lg: "40px" },
          }}
        />
      </div>
      {/* OCEANITES NAVIGATION ENDS HERE */}

      {/* NOTIFICATION NAVIGATION STARTS HERE */}
      <div
        className={` hidden lg:flex dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl m-[2px] cursor-pointer items-center hover:text-blue-500 justify-center w-full ${getActiveClass(
          "/notifications"
        )} `}
        onClick={() => {
          router?.push("/notifications");
        }}
      >
        <Notifications
          sx={{
            width: { xs: "32px", lg: "40px" },
            height: { xs: "32px", lg: "40px" },
          }}
        />
      </div>
      {/* NOTIFICATION NAVIGATION ENDS HERE */}

      {/* PROFILE NAVIGATION STARTS HERE */}
      <div
        onClick={() => {
          try {
            setIsMsgsOpen(false);
            setIsOCardOpen(false);
          } catch (error) {}
          router?.push("/profile");
        }}
        className="dark:hover:bg-d_secondary hover:bg-foreground hover:rounded-xl mt-[2px] -mb-[1px] lg:mt-[4px] lg:-mb-[2px] cursor-pointer w-full flex justify-center items-center"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <ProfileMenu>
            <img
              src={profileData?.avatar}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/jellyfishFallback.png";
              }}
              alt="profile"
              className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl border-2 hover:border-blue-500 hover:border-4 ${
                pathname === "/profile" ? "border-blue-600" : "border-slate-400"
              }`}
            />
          </ProfileMenu>
        </div>
      </div>
      {/* PROFILE NAVIGATION ENDS HERE */}
    </div>
  );
};

export default Navbar;
