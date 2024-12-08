import React, { useEffect, useState } from "react";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import { redirect } from "next/navigation";
import { UIStore } from "@/store/UIStore";
import { CommunicationStore } from "@/store/CommunicationStore";
import { UserStore } from "@/store/UserStore";
import { Badge } from "@mui/material";
import CustomizedBadges from "./CustomizedBadge";
import Image from "next/image";

const UserMsgProfile = ({ profile_id, avatar_url, name, wave }) => {
  const { setIsMsgsOpen, expectedVersion } = UIStore();
  const { setCommunicatorId, FetchUnreadMessagesCount } = CommunicationStore();
  const { subscribeToOnlineStatus } = UserStore();
  const [isOnline, setIsOnline] = useState(false);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  useEffect(() => {
    if (!profile_id) return;
    // Subscribe to online status
    const unsubscribe = subscribeToOnlineStatus(profile_id, setIsOnline);
    // Cleanup on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [profile_id, subscribeToOnlineStatus]);

  useEffect(() => {
    FetchUnreadMessagesCount(profile_id).then((count) => {
      setUnreadMsgCount(count);
    });
  }, [FetchUnreadMessagesCount, setUnreadMsgCount, profile_id]);

  return (
    <div
      onClick={() => {
        setTimeout(() => {
          setCommunicatorId(profile_id);
          setIsMsgsOpen(false);
        }, 500);
        redirect("/chat");
      }}
      className="flex px-3 py-1 items-center w-full justify-between hover:bg-primary dark:hover:bg-d_foreground"
    >
      <div
        onClick={() => {
          
          console.log("profile_id clicked from the usermsgprofile", profile_id);
        }}
        className="flex gap-2 items-center cursor-pointer"
      >
        <CustomizedBadges count={unreadMsgCount}>
          {/* count={0}> */}
          <div className="flex-shrink-0 relative">
            <img
              src={avatar_url}
              alt="profile"
              className={` size-10 lg:size-12 rounded-xl border-2 ${
                isOnline && "shadow-sm"
              } shadow-green-500 border-slate-600 `}
            />
            {/* Ripple Effect */}
            {isOnline && (
              <div className="relative bottom-2">
                <span className="absolute -bottom-[2px] -right-[2px] size-[14px] bg-green-500 rounded-full border-2"></span>
                <span className="absolute -bottom-[2px] -right-[2px] size-[14px] bg-green-500 rounded-full opacity-75 animate-ping"></span>
              </div>
            )}
          </div>
        </CustomizedBadges>
        <div className="mx-1 leading-snug mt-[2px] hidden xs:block max-w-96">
          <div className="flex justify-center flex-col truncate w-full">
            {/* <div className="flex justify-center flex-col truncate xs:w-[40vw] xs2:w-[45vw] xs3:w-[50vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw]  md:w-[35vw] lg:w-[19vw] xl:w-[13vw]"> */}
            <h1 className="font-semibold leading-non truncate">{name}</h1>
            <p className="text-[14px] truncate">{wave}</p>
            {/* <h1 className="text-text_clr2 dark:text-d_text_clr2">4h ago</h1> */}
          </div>
        </div>
      </div>
      {expectedVersion && (
        <div className="xs1:flex gap-1 translate-x-1 items-center p-1 rounded-xl font-semibold hidden ">
          <VoiceChatIcon
            title="VoiceChat"
            className="size-7 hover:text-blue-500 cursor-pointer"
          />
          <VideoChatIcon
            title="VideoChat"
            className="size-7 hover:text-blue-500 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default UserMsgProfile;
