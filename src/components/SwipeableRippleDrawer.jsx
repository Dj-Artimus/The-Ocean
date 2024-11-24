"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DropletStore, UIStore } from "@/store/OceanStore";
import { Close } from "@mui/icons-material";
import RipplesAnimation from "./RipplesAnimation";
import Ripple from "./Ripple";
import Echo from "./Echoes";
import InputTextarea from "./InputTextArea";

const RippleDrawer = () => {
  const {
    isRippleDrawerOpen,
    setIsRippleDrawerOpen,
    rippleDrawerDropletId,
    ripplesRefreshId,
    setRipplesRefreshId,
  } = UIStore();
  const { RippleDroplet, GetRipples } = DropletStore();
  const [drawerHeight, setDrawerHeight] = useState("50%"); // Starting height
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [rippleInput, setRippleInput] = useState("");
  const [ripplesData, setRipplesData] = useState([]);

  const handleRippleSubmit = async () => {
    const ripple = await RippleDroplet(rippleDrawerDropletId, rippleInput);
    setRipplesRefreshId(ripple);
    if (isRippleDrawerOpen) {
        await getRipplesData(rippleDrawerDropletId);
    }
    setRippleInput("");
  };

  const getRipplesData = async (droplet_id) => {
    const data = await GetRipples(droplet_id);
    setRipplesData(data);
  };

  useEffect(() => {
    if (isRippleDrawerOpen) {
      getRipplesData(rippleDrawerDropletId);
    } else if ( !isRippleDrawerOpen ){
      setRipplesData([]);
    }
  }, [rippleDrawerDropletId, ripplesRefreshId, isRippleDrawerOpen]);

  const toggleDrawer = () => {
    setIsRippleDrawerOpen(!isRippleDrawerOpen);
    if (isRippleDrawerOpen) setRippleInput("");
    setDrawerHeight("50%");
  };

  const handleDrag = (event, info) => {
    const offsetY = info.offset.y;

    if (offsetY < 0) {
      // Expanding the drawer by increasing its height when dragged upwards
      setDrawerHeight((prevHeight) => {
        const newHeight = Math.min(
          parseInt(prevHeight) + Math.abs(offsetY) / 5,
          90
        ); // Limit to 90% height
        return `${newHeight}%`;
      });
    } else {
      setDragOffsetY(offsetY); // Allow dragging down to close
      //   setDrawerHeight("50%");
    }
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 80) {
      setIsRippleDrawerOpen(false); // Close drawer if dragged down by 150px or more
      setDrawerHeight("50%");
    } else if (info.offset.y > 30) {
      setDrawerHeight("50%");
    }
    setDragOffsetY(0); // Reset position
  };

  const handleOutsideClick = () => {
    setIsRippleDrawerOpen(false);
    setRippleInput("");
    setDrawerHeight("50%");
  };

  return (
    <>
      {isRippleDrawerOpen && (
        <>
          {/* Overlay for outside click detection */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 w-full backdrop-blur-sm z-30"
            onClick={handleOutsideClick}
          />

          {/* Comment Drawer */}
          <div className="flex justify-center">
            <motion.div
              className="fixed bottom-0 w-full h-full max-w-[800px] bg-foreground text-text_clr dark:text-d_text_clr dark:bg-d_foreground shadow-lg rounded-t-xl z-50 overflow-hidden"
              style={{ height: drawerHeight, y: dragOffsetY }}
              initial={{ y: "100%" }}
              animate={{ y: isRippleDrawerOpen ? 0 : "100%" }}
              transition={{ type: "spring", damping: 20 }}
              dragConstraints={{ top: 0, bottom: 0 }}
              drag="y"
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              {/* Header */}
              <div className="bg-sky-600 p-4 py-3 flex justify-between items-center cursor-pointer relative">
                {/* Ripple effect container */}
                {/* <RipplesAnimation /> */}

                {/* Comment section Puller */}
                <div className="w-10 h-2 bg-sky-900 top-2 rounded-full left-1/2 -translate-x-1/2 absolute"></div>

                <h2 className="text-xl text-white tracking-wide font-semibold">
                  Ripples
                </h2>
                <button onClick={toggleDrawer} className=" text-white text-xl">
                  <Close />
                </button>
              </div>

              <div className="h-full flex flex-col">
                {/* RIPPLE CONTENT STARTS HERE */}
                <div className="py-2 p-1 mb-28 overflow-y-auto customScrollbar">
                  {ripplesData.map((ripple) => {
                    return (
                      <Ripple
                        key={ripple?.id}
                        ripple_id={ripple?.id}
                        droplet_id={ripple?.droplet_id}
                        user_id={ripple?.user_id?.id}
                        avatar_url={ripple?.user_id?.avatar?.split("<|>")[0]}
                        name={ripple?.user_id?.name}
                        wave={ripple?.user_id?.wave}
                        rippleContent={ripple?.content}
                      />
                    );
                  })}

                  {/* <Ripple
                    avatar_url={"/images/profileImg.png"}
                    name={"Jan David Don Full stack developer on the rise "}
                    wave={
                      "Building skills in mern stack Building skills in mern stack"
                    }
                    rippleContent={
                      "Full stack developer on the pkills iin mern stack"
                    }
                    echoes={
                      <div className="divide-y divide-slate-800">
                        <Echo
                          avatar_url={"/images/profileImg.png"}
                          name={
                            "Jan David Don Full stack developer on the rise | Building skills in mern stack Building skills in mern stack"
                          }
                          rippleContent={
                            "Another RERipple Full stack developer on the pkills iin mern stack"
                          }
                        />
                        <Echo
                          avatar_url={"/images/profileImg.png"}
                          name={
                            "Jan David Don Full stack developer on the rise | Building skills in mern stack Building skills in mern stack"
                          }
                          rippleContent={
                            "Another RERipple Full stack developer on the pkills iin mern stack"
                          }
                        />
                      </div>
                    }
                  /> */}
                </div>
                {/* RIPPLE CONTENT ENDS HERE */}

                <div className="bg-foreground flex-shrink-0 absolute bottom-0 dark:bg-d_foreground w-full p-1">
                  <InputTextarea
                    placeholder={"Ripple your thoughts"}
                    input={rippleInput}
                    setInput={setRippleInput}
                    handleSubmit={handleRippleSubmit}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
};

export default RippleDrawer;
