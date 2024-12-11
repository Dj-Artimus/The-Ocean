import { Done, DoneAll, MoreHoriz } from "@mui/icons-material";
import React from "react";

const MessageSent = ({
  content,
  created_at,
  isRead,
  handleMoreOptionsClick,
}) => {
  return (
    <div className=" bg-primary shadow-sm shadow-red-500 dark:shadow-blue-500 dark:bg-d_primary max-w-[70%] p-2 px-3 float-end rounded-xl mb-3 rounded-tr-none ">
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
        <div onClick={handleMoreOptionsClick} className="h-fit -my-2">
          <MoreHoriz
            sx={{
              width: "30px",
              height: "30px",
            }}
          />
        </div>
      </div>
      <p className=" clear-both">{content}</p>
    </div>
  );
};

export default MessageSent;
