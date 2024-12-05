import React, { useState, useRef, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Assistant,
  AssistantOutlined,
  BubbleChart,
  StarOutlineRounded,
  StarRounded,
} from "@mui/icons-material";
import { UIStore } from "@/store/UIStore";

const RippleContentElement = ({ content, echoes }) => {
  const { expectedVersion } = UIStore();
  const [expanded, setExpanded] = useState(false);
  const [isEchoesAvailabel, setIsEchoesAvailabel] = useState(echoes);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [stared, setStared] = useState(false);
  const [commented, setCommented] = useState(false);
  const [stars, setStars] = useState(0);
  const [ripples, setRippes] = useState(0);

  const ripple_id = "98";

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      );
      const maxHeight = lineHeight * 3;
      setContentHeight(maxHeight);
      setShowToggle(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content]);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const toggleEchoesExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleStarARipple = async (id) => {
    setStared(!stared);
    console.log(id);
  };

  return (
    <div className=" w-full mb-3 mx-auto">
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-300`}
        style={{
          maxHeight: expanded
            ? `${contentRef.current.scrollHeight}px`
            : `${contentHeight}px`,
        }}
      >
        <p>{content}</p>
      </div>

      <div className="flex justify-between items-center -mb-1 ">
        {expectedVersion && (
          <div className="flex items-center justify-between gap-2 ">
            <div className="flex items-end gap-[10px]">
              <div
                onClick={() => handleStarARipple(ripple_id)}
                className="-ms-[6px] cursor-pointer hover:scale-110 active:scale-95"
                title="like"
              >
                {stared ? (
                  <StarRounded className="size-6 text-amber-400 stroke-amber-500 translate-x-2" />
                ) : (
                  <StarOutlineRounded className="size-6 translate-x-2" />
                )}
              </div>
              {/* <h1>{getStars(droplet_id)}</h1> */}
              <h1>{stars}</h1>
            </div>
            <div className="flex items-center gap-1">
              <div
                onClick={() => {
                  setCommented(!commented);
                  // setIsCommentDrawerOpen(!isCommentDrawerOpen);
                }}
                className="cursor-pointer hover:scale-110 active:scale-95"
              >
                {commented ? (
                  <Assistant
                    className="size-5 text-sky-500 stroke-sky-700 dark:stroke-none "
                    title="Comment"
                  />
                ) : (
                  <AssistantOutlined className="size-5" title="Comment" />
                )}
              </div>
              <h1 className="mt-[2px]"> {ripples} </h1>
            </div>
          </div>
        )}
        <div className="flex justify-between gap-3">
          {isEchoesAvailabel && (
            <button
              onClick={toggleEchoesExpand}
              className="flex items-center gap-[2px] text-sm text-blue-500 -my-2 -mt-[2px] transition-all duration-300 hover:text-blue-600"
            >
              {expanded ? "Hide" : "Show"}
              <Assistant
                className={`transform size-4 transition-transform duration-300 ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}
          {showToggle && (
            <button
              onClick={toggleExpand}
              className="flex items-center gap-[1px] text-sm text-blue-500 -my-2 -mt-[2px] transition-all duration-300 hover:text-blue-600"
            >
              {expanded ? "Less" : "More"}
              <ExpandMoreIcon
                className={`transform transition-transform duration-300 ${
                  expanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RippleContentElement;
