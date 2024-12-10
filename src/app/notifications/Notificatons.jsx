"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import NotificationMsg from "@/components/NotificationMsg";
import "../globals.css";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import LeftSideBar from "@/components/LeftSideBar";
import { UIStore } from "@/store/UIStore";
import { DropletStore } from "@/store/DropletStore";
import { useEffect } from "react";

const Notifications = () => {
  const { isMsgsOpen, setIsMsgsOpen, isOCardOpen, setNotificationsCount } =
    UIStore();
  const { notificationsData } = DropletStore();

  useEffect(() => {
    setNotificationsCount(0);
    console.log("notificationsData", notificationsData);
  }, [setNotificationsCount]);

  const router = useRouter();

  return (
    <div>
      <div className="w-screen flex h-screen relative overflow-x-hidden customScrollbar">
        <div
          onClick={() => {
            isMsgsOpen ? setIsMsgsOpen(false) : router.push("/");
          }}
          className="fixed lg:hidden top-[1px] left-[1px] z-30 text-white bg-blue-700 bg-opacity-80 rounded-tl-none rounded-xl p-[2px] cursor-pointer"
        >
          <ArrowBack className="size-7" />
        </div>

        {/* NAVIGATION BAR STARTS HERE */}
        <Navbar
          navStyle={
            "fixed -bottom-2 pb-2 sm:me-1 px-[2px] flex w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[62%] sm:rounded-t-2xl z-20 border-t border-slate-700 translate-x-1/2 right-1/2 lg:top-0 lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
          }
        />
        {/* NAVIGATION BAR ENDS HERE */}

        <LeftSideBar
          styles={` ${
            isMsgsOpen && !isOCardOpen
              ? "opacity-100 fixed"
              : "opacity-0 hidden"
          } lg:opacity-100 transition-opacity h-full lg:p-4 pb-[56px] ps-2 pt-2 pe-2 bg-background dark:bg-d_background lg:ps-3 lg:pe-1 left-0 w-full sm:ps-[12%] sm:pe-[13%] lg:left-auto rounded-xl top-0 lg:hidden lg:w-[40%] xl:w-[32%]`}
        />

        {/* MAIN CONTENT STARTS HERE */}
        <div className="h-full w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 p-2 lg:pt-[54px]">
          {/* NOTIFICATION MESSAGES STARTS HERE */}

          {notificationsData?.length > 0 ? (
            notificationsData.map((notification) => (
              <NotificationMsg
                avatar_url={notification?.user_id?.avatar.split("<|>")[0]}
                name={notification?.user_id?.name}
                platform={notification?.platform}
                notificationMsg={notification?.content}
                timeOfNotification={notification?.created_at}
              />
            ))
          ) : (
            <div className="w-full h-[80%] overflow-hidden flex justify-center items-center text-2xl">
              {" "}
              <h1>No notifications found!</h1>{" "}
            </div>
          )}
          {/* NOTIFICATION MESSAGES ENDS HERE */}

          <div className="h-1 w-full my-20"></div>
        </div>
        {/* MAIN CONTENT ENDS HERE */}
      </div>
    </div>
  );
};

export default Notifications;
