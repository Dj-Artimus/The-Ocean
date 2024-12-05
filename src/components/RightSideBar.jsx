import React from "react";
import ProfileCard from "./ProfileCard";
import OceanBoard from "./OceanBoard";
import OceanScore from "./OceanScore";
import Footer from "./Footer";
import "../app/globals.css";
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";

const RightSideBar = ({ styles }) => {
  const { profileData } = UserStore();
  const { isMsgsOpen, isOCardOpen } = UIStore();

  return (
    <div
      className={
        styles
          ? styles
          : ` ${
              !isMsgsOpen && isOCardOpen
                ? "opacity-100 fixed"
                : "opacity-0 hidden"
            } h-full p-5 pb-16 sm:px-[15%] xl:opacity-100 lg:px-2 lg:py-2 lg:hidden lg:pe-1 xl:p-4 xl:pb-4 xl:pe-3 w-full lg:w-[33%] bg-background dark:bg-d_background xl:sticky top-0 xl:ps-1 xl:w-[25%] xl:block`
      }
    >
      <div className="bg-primary customScrollbar dark:bg-d_primary p-3 rounded-xl h-full overflow-y-auto">
        <div className="flex justify-center flex-col gap-3 text-center items-center">
          <ProfileCard
            name={profileData?.name}
            avatar_url={profileData?.avatar}
            wave={profileData?.wave}
          />

          <OceanBoard />

          <OceanScore anchors={"43k"} anchorings={"492"} />

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
