import { Done, DoneAll, MoreHoriz, MoreVert } from "@mui/icons-material";
import React from "react";

const MessageReceived = ({ content, created_at, isRead }) => {
  return (
    <div className="w-full">
      <div className=" bg-secondary shadow-sm shadow-rose-500 dark:shadow-blue-500 dark:bg-d_foreground max-w-[70%] p-2 px-3 float-start mb-3 rounded-xl rounded-tl-none ">
        <div className="flex justify-between text-text_clr2 dark:text-d_text_clr2  clear-both">
          <div className="flex">
            <p className="text-[10px]">{new Date(created_at).toLocaleString()}</p>
            {isRead ? (
              <DoneAll
                sx={{
                  width: "16px",
                  height: "16px",
                  margin: "-3px 2px",
                  color: "cyan",
                }}
              />
            ) : (
              <Done
                sx={{
                  width: "16px",
                  height: "16px",
                  margin: "-3px 2px",
                  color: "skyblue",
                }}
              />
            )}
          </div>
        </div>
        <p className="float-end">{content} </p>
      </div>
    </div>
  );
};

export default MessageReceived;
