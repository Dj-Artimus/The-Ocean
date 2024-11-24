import { getPlatformIcon } from "@/utils/PlatformIconGetter";
import React from "react";

const NotificationMsg = ({
  avatar_url,
  name,
  platform,
  notificationMsg,
  timeOfNotification,
}) => {
  return (
    <div className="my-2 border bg-foreground dark:bg-d_foreground cursor-pointer shadow-sm shadow-blue-600 rounded-2xl border-slate-700 w-full">
      <div className="flex items-start gap-[5px] ms-[9px]">
        <div className="flex-shrink-0">
          <img
            src={avatar_url}
            alt="profile"
            className="size-14 my-2 rounded-xl border-2 border-slate-500"
          />
        </div>
        <div className="flex justify-center mx-1 mt-1 flex-col w-full">
          <div className="flex w-full justify-between items-center">
            <div className="flex w-full items-center">
              <h1 className="font-semibold line-clamp-1">{name}</h1>
            </div>
            <div className="flex items-center">
              <span className="mx-1 text-slate-500 xs:hidden xs1:block">•</span>
              {getPlatformIcon(platform)}
              <h1 className="mx-2"> {timeOfNotification} </h1>
            </div>
          </div>
          <p className="text-[15px] line-clamp-2 leading-5 text-text_clr2 dark:text-d_text_clr2">
            {notificationMsg}
          </p>
          {/* <h1 className="text-slate-400">4h ago</h1> */}
        </div>
      </div>
    </div>
  );
};

export default NotificationMsg;
