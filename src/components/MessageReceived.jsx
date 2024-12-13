import { Done, DoneAll } from "@mui/icons-material";
import React from "react";
import ContentAndMediaElement from "./ContentAndMediaElement";
import { formaterDateAndTime } from "@/utils/TimeAndCountFormater";

const MessageReceived = ({ content, images, videos, created_at, isRead }) => {
  return (
    <div className="w-full">
      <div
        className={` bg-blue-200 bg-opacity-50 shadow-sm shadow-blue-400 dark:shadow-blue-950 dark:bg-d_secondary max-w-[70%] pt-1 px-3 float-start mb-3 rounded-xl rounded-tl-none ${
          (images.length !== 0 || videos.length !== 0) && "pb-3"
        } `}
      >
        <div className="flex justify-between text-text_clr2 dark:text-d_text_clr2  clear-both">
          <div className="flex">
            <p className="text-[10px]">{formaterDateAndTime(created_at)}</p>
            {isRead ? (
              <DoneAll
                sx={{
                  width: "16px",
                  height: "16px",
                  margin: "-3px 4px",
                }}
                className='text-blue-500'
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
        <div className="clear-both pb-[3px]">
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
