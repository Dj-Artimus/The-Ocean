"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Close, CycloneRounded } from "@mui/icons-material";
import RipplesAnimation from "./RipplesAnimation";
import Ripple from "./Ripple";
import Echo from "./Echoes";
import InputTextarea from "./InputTextArea";
import { UIStore } from "@/store/UIStore";
import { DropletStore } from "@/store/DropletStore";

const RippleDrawer = () => {
  const {
    isRippleDrawerOpen,
    setIsRippleDrawerOpen,
    setRipplesRefreshId,
    rippleDrawerDropletId,
  } = UIStore();
  const {
    RippleDroplet,
    dropletRipples,
    setDropletRipples,
    GetRipples,
    setupSubscriptionsForRipplesData,
    subscribeToRippleChanges,
  } = DropletStore();
  const [drawerHeight, setDrawerHeight] = useState("50%"); // Starting height
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [rippleInput, setRippleInput] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const rippleRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  const handleRippleSubmit = useCallback(async () => {
    const ripple = await RippleDroplet(rippleInput);
    setRipplesRefreshId(ripple);
    setRippleInput("");
  }, [RippleDroplet, setRipplesRefreshId, setRippleInput, rippleInput]);

  useEffect(() => {
    let unsubscribe;

    const manageRippleSubscriptions = async () => {
      if (isRippleDrawerOpen) {
        // Fetch ripples when the drawer is opened
        await GetRipples();
        unsubscribe = await setupSubscriptionsForRipplesData(); // Fetch and subscribe
      } else {
        // console.log("Ripple drawer closed.");
        setDropletRipples([]); // Clear ripple state when the drawer is closed
        if (unsubscribe) unsubscribe(); // Cleanup subscription
      }
    };

    manageRippleSubscriptions();

    return () => {
      if (unsubscribe) unsubscribe(); // Cleanup on unmount
    };
  }, [
    isRippleDrawerOpen,
    GetRipples,
    setupSubscriptionsForRipplesData,
    setDropletRipples,
  ]); // Depend only on the drawer state

  const toggleDrawer = useCallback(() => {
    setIsRippleDrawerOpen(!isRippleDrawerOpen);
    if (isRippleDrawerOpen) setRippleInput("");
    setDrawerHeight("50%");
  }, [
    setIsRippleDrawerOpen,
    isRippleDrawerOpen,
    setRippleInput,
    setDrawerHeight,
  ]);

  const handleDrag = useCallback(
    (event, info) => {
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
    },
    [setDrawerHeight, setIsRippleInitiated]
  );

  const handleDragEnd = useCallback(
    (event, info) => {
      if (info.offset.y > 80) {
        setIsRippleDrawerOpen(false); // Close drawer if dragged down by 150px or more
        setDrawerHeight("50%");
      } else if (info.offset.y > 30) {
        setDrawerHeight("50%");
      }
      setDragOffsetY(0); // Reset position
    },
    [setIsRippleDrawerOpen, setDrawerHeight, setDragOffsetY]
  );

  const handleOutsideClick = useCallback(() => {
    setIsRippleDrawerOpen(false);
    setRippleInput("");
    setDrawerHeight("50%");
    setDropletRipples([]);
  }, [
    setIsRippleDrawerOpen,
    setRippleInput,
    setDrawerHeight,
    setDropletRipples,
  ]);

  const handleInfiniteScroll = useCallback(async () => {
    const element = rippleRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (
        hasMore &&
        clientHeight + 100 < scrollHeight &&
        scrollTop + clientHeight >= scrollHeight - 100
      ) {
        console.log("Fetch more data!");
        if (page > 1) await GetRipples();
      }
    }
  }, [rippleRef, GetRipples, hasMore, page]);

  useEffect(() => {
    const element = rippleRef.current;
    if (element) {
      element.addEventListener("scroll", handleInfiniteScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleInfiniteScroll);
      }
    };
  }, [handleInfiniteScroll, rippleRef]);

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
                <div
                  ref={rippleRef}
                  className="py-2 p-1 mb-28 overflow-y-auto customScrollbar"
                >
                  {dropletRipples.length === 0 ? (
                    <div className="w-full px-5 py-3 text-lg text-center text-text_clr2 dark:text-d_text_clr2">
                      <h1>Guess What No-One Rippled this Droplet!,</h1>
                      <h1>Be the First Oceanite to Ripple it... 😎</h1>
                    </div>
                  ) : (
                    dropletRipples.map((ripple) => {
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
                    })
                  )}
                  {isLoading && (
                    <div className="animate-pulse w-full flex justify-center items-center">
                      <CycloneRounded className="animate-spin size-8" />
                    </div>
                  )}
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
