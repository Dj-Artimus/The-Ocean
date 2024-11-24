import React, { useState, useRef, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const VideosContentElement = ({ content, expanded, setExpanded }) => {
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      );
      const maxHeight = lineHeight * 2;
      setContentHeight(maxHeight);
      setShowToggle(contentRef.current.scrollHeight > maxHeight);
    }
    if (!expanded && contentRef.current) {
      contentRef.current.scrollTop = 0; // Reset scroll position to top on collapse
    }
  }, [content , expanded]);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className=" w-full mb-2 mx-auto">
      {/* <div className={`max-h-[60vh] overflow-y-auto `}> */}
      <div
        ref={contentRef}
        className={` ${
          expanded ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"
        } customScrollbar text-d_text_clr transition-all w-full duration-300`}
        style={{
          maxHeight: expanded ? `60vh` : `${contentHeight}px`,
        }}
      >
        <p>{content}</p>
      </div>
      {/* </div> */}

      <div className="flex justify-end">
        {showToggle && (
          <button
            onClick={toggleExpand}
            className="flex items-center gap-[1px] text-sm text-blue-600 -my-3 -mt-[2px] transition-all duration-300 hover:text-blue-700"
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
  );
};

export default VideosContentElement;
