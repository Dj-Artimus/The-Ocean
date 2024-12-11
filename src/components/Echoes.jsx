import React, { useState, useRef, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentElement from "./ContentElement";
import RippleContentElement from "./RippleContentElement";
import Image from "next/image";

const Echo = ({ avatar_url, name, rippleContent }) => {
  const [showMoreContent, setShowMoreContent] = useState(false);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [contentHeight, setContentHeight] = useState("auto");
  const contentRef = useRef(null);

  // Check if content overflows beyond 2 lines on component mount
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowed(contentRef.current.scrollHeight > 40);
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [rippleContent]);

  return (
    <div className=" bg-foreground dark:bg-d_foreground w-full">
      <div className="">
        <div className="flex items-start fc gap-[5px] ms-[9px]">
          <div className="flex-shrink-0 cursor-pointer">
<img
              src={avatar_url}
              alt="profile"
              className="size-10 my-2 rounded-xl border-2 border-slate-500"
            />
          </div>
          <div className="flex justify-center mx-1 mt-1 gap-1 flex-col w-full">
            <div className="flex w-full justify-between flex-col items-center">
              <div className="flex w-full items-center cursor-pointer">
                <h1 className="font-semibold line-clamp-1">{name}</h1>
              </div>
              <div className="flex w-full items-center cursor-pointer">
                {/* <h1 className="font-semibold line-clamp-1">{name}</h1> */}
                <h1 className=" text-sm line-clamp-1 text-text_clr2 dark:text-d_text_clr2">
                  explicitly exclude it from the paths that the matcher
                  evaluates.
                </h1>
              </div>
            </div>
            {/* Content with expandable feature */}
            <RippleContentElement content={rippleContent} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Echo;
