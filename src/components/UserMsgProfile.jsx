import React from "react";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import { redirect } from "next/navigation";
import { UIStore } from "@/store/OceanStore";

const UserMsgProfile = ({ avatar_url, name, wave, isOnline }) => {
  const { setIsMsgsOpen } = UIStore();
  return (
    <div
      onClick={() => {
        setTimeout(() => {
          setIsMsgsOpen(false);
        }, 500);
        redirect("/chat");
      }}
      className="flex px-3 py-1 items-center w-full justify-between hover:bg-primary dark:hover:bg-d_foreground"
    >
      <div className="flex gap-2 items-center cursor-pointer">
        <div className="flex-shrink-0 relative">
          <img
            src={avatar_url}
            alt="profile"
            className={` size-10 lg:size-12 my-2 rounded-xl border-2 ${
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
        <div className="mx-1 leading-snug mt-1 hidden xs:block max-w-96">
          <div className="flex justify-center flex-col truncate xs:w-[40vw] xs2:w-[45vw] xs3:w-[50vw] xs4:w-[58vw] xs5:w-[62vw] xs6:w-[70vw] sm:w-[45vw]  md:w-[35vw] lg:w-[19vw] xl:w-[13vw]">
            <h1 className="font-semibold leading-non truncate">{name}</h1>
            <p className="text-[14px] truncate">{wave}</p>
            {/* <h1 className="text-text_clr2 dark:text-d_text_clr2">4h ago</h1> */}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default UserMsgProfile;
