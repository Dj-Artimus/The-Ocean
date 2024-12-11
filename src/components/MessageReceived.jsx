import { Done, DoneAll } from "@mui/icons-material";
import React from "react";
import ContentAndMediaElement from "./ContentAndMediaElement";

const MessageReceived = ({ content, images, videos, created_at, isRead }) => {
  return (
    <div className="w-full">
      <div className=" bg-secondary shadow-sm shadow-rose-500 dark:shadow-blue-500 dark:bg-d_foreground max-w-[70%] pt-2 px-3 float-start mb-3 rounded-xl rounded-tl-none ">
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
        <div className="clear-both">
          <ContentAndMediaElement
            content={content}
            images={images}
            videos={videos}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageReceived;
