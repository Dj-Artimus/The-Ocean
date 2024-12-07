"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Droplet from "@/components/Droplet";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import "./globals.css";
import {
  ArrowBack,
  ConnectWithoutContactRounded,
  CrisisAlertRounded,
  CycloneRounded,
  Diversity1,
  Warning,
} from "@mui/icons-material";
import OceanSpeedDial from "@/components/OceanSpeedDial";
import { DropletStore } from "@/store/DropletStore";
import UILoader from "@/components/UILoader";
import { UIStore } from "@/store/UIStore";
import Button from "@/components/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import DropletLoader from "@/components/DropletLoader";

export default function ReactHomePage() {
  const router = useRouter();
  const {
    isMsgsOpen,
    setIsMsgsOpen,
    isOCardOpen,
    setIsOCardOpen,
    setIsCreateDropletModalOpen,
  } = UIStore();

  const {
    feedDroplets,
    setFeedDroplets,
    GetFeedDroplets,
    isFeedDropletsFetched,
    subscribeToDropletChanges,
    setDropletDataType,
    dropletsData,
  } = DropletStore();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [feedDroplets, setFeedDroplets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const feedRef = useRef();

  const fetchFeedData = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newDroplets = await GetFeedDroplets(page, 5);
    console.log('newDroplets', newDroplets)
    if (newDroplets?.length < 5 || newDroplets === "end") {
      setHasMore(false); // Stop fetching if fewer than limit
    } else if (newDroplets) {
      setPage((prevPage) => prevPage + 1);
    }
    setIsLoading(false);
  }, [isLoading, hasMore, GetFeedDroplets, page]);

  const handleRefresh = async () => {
    setPage(0); // Reset pagination
    setHasMore(true); // Allow fetching more
    setFeedDroplets([]);
    await GetFeedDroplets(0, 6); // Fetch initial data again
  };

  useEffect(() => {
    console.log("Has More:", hasMore);
    console.log("Current Page:", page);
  }, [hasMore, page]);

  useEffect(() => {
    // Fetch initial droplets
    setIsMsgsOpen(false);
    setIsOCardOpen(false);
    setDropletDataType("feedDroplets");
    fetchFeedData();
  }, [setIsMsgsOpen,setIsOCardOpen,setDropletDataType,fetchFeedData]);

  const handleInfiniteScroll = useCallback(async () => {
    const element = feedRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (
        hasMore &&
        clientHeight + 100 < scrollHeight &&
        scrollTop + clientHeight >= scrollHeight - 100
      ) {
        console.log("Fetch more data!", page);
        if (page > 1) await fetchFeedData();
      }
    }
  },[feedRef, page, fetchFeedData, hasMore]);

  useEffect(() => {
    const element = feedRef.current;
    if (element) {
      element.addEventListener("scroll", handleInfiniteScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleInfiniteScroll);
      }
    };
  }, [handleInfiniteScroll, feedRef]);

  if (!isFeedDropletsFetched) return <UILoader />;
  return (
    <div className="">
      <div
        ref={feedRef}
        className="w-screen h-screen flex relative overflow-x-hidden overflow-y-auto"
      >
        {(isMsgsOpen || isOCardOpen) && (
          <Button
            onClick={() => {
              setIsMsgsOpen(false);
              setIsOCardOpen(false);
            }}
            className="fixed top-[1px] left-[1px] z-30 bg-blue-500 dark:bg-blue-700 bg-opacity-50 backdrop-blur-sm rounded-tl-none rounded-xl p-[2px] cursor-pointer"
          >
            <ArrowBack className="size-7" />
          </Button>
        )}
        <OceanSpeedDial />
        {/* NAVIGATION BAR STARTS HERE */}
        <Navbar
          navStyle={
            "fixed -bottom-2 pb-2 px-[2px] sm:me-1 lg:me-0 flex w-full sm:w-[74%] md:w-[79%] lg:w-[65.7%] xl:w-[51%] xl1:w-[51.4%] sm:rounded-t-2xl z-30 bg-primary dark:bg-d_primary border-t border-slate-700 translate-x-1/2 right-1/2 lg:right-[1%] lg:translate-x-0 xl:right-auto xl:left-[26.25%] xl1:left-[26.8%] lg:-top-[3px] lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
          }
        />
        {/* NAVIGATION BAR ENDS HERE */}
        {/* LEFT SIDE BAR STARTS HERE */}
        <LeftSideBar />
        {/* LEFT SIDE BAR ENDS HERE */}

        {/* MAIN CONTENT STARTS HERE */}
          <div
            className={`  ${
              isMsgsOpen || isOCardOpen ? "hidden" : ""
            } h-full w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 relative pe p-2`}
          >
            {/* GREETINGS SECTIONS STARTS HERE */}
            <div className=" lg:mt-14 flex flex-col gap-2 sm:gap-3">
              {/* OCEANITES FINDER AND CONNECTOR STARTS HERE */}
              <div className="bg-ternary dark:bg-blue-950 dark:bg-opacity-70 w-full items-center  p-3 px-4  rounded-2xl flex justify-between">
                <div className="text-lg flex flex-col sm:flex-row sm:gap-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm sm:text-lg ">Looking for New</h1>{" "}
                    <h1>Oceanites ?</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <Diversity1 />
                    <h1>Lets connect !</h1>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    router.push("/oceanites");
                  }}
                  className="bg-blue-500 text-d_text_clr px-2 w-12 rounded-full h-8"
                >
                  <ConnectWithoutContactRounded className="size-7" />
                </Button>
              </div>
              {/* OCEANITES FINDER AND CONNECTOR ENDS HERE */}
              {/* DROPLET DROPER GREETING STARTS HERE */}
              <div className="bg-ternary dark:bg-d_ternary w-full  p-3 px-4  items-center rounded-2xl flex justify-between">
                <div className="text-lg flex flex-col sm:flex-row sm:gap-2">
                  <h1>Whats Happening ?</h1>
                  <h1>Whats on your mind!</h1>
                </div>
                <Button
                  onClick={() => {
                    setIsCreateDropletModalOpen(true);
                  }}
                  className="bg-blue-500 text-d_text_clr px-2 rounded-full h-8"
                >
                  Drop
                </Button>
              </div>
              {/* DROPLET DROPER GREETING ENDS HERE */}
            </div>
            {/* GREETINGS SECTIONS ENDS HERE */}
            {/* DROPLETS START HERE */}
            <div>
              {feedDroplets?.map((droplet) => {
                {
                  /* {dropletsData?.map((droplet) => { */
                }
                return (
                  <Droplet
                    key={droplet?.id}
                    droplet_id={droplet?.id}
                    author_id={droplet?.user_id?.id}
                    avatar_url={droplet?.user_id?.avatar}
                    authorData={droplet?.user_id}
                    name={droplet?.user_id?.name}
                    username={droplet?.user_id?.username}
                    wave={droplet?.user_id?.wave}
                    platform={droplet?.platform}
                    time={droplet?.created_at}
                    content={droplet?.content}
                    images={droplet?.images}
                    videos={droplet?.videos}
                    stars={droplet?.stars}
                    ripples={droplet?.ripples}
                    redrops={droplet?.redrops}
                  />
                );
              })}
            </div>
            {/* DROPLETS ENDS HERE */}
            {isLoading && (
              <div className="animate-pulse w-full flex justify-center items-center">
                <CycloneRounded className="animate-spin size-8" />
              </div>
            )}
            {!hasMore && (
              <div className="text-cyan-500 animate-pulse w-full flex justify-center items-center gap-1">
                <CrisisAlertRounded className="size-6 animate-spin" />
                Increase Anchorings to See more...
              </div>
            )}
            <div className="h-1 w-full my-20"></div>
          </div>
        {/* MAIN CONTENT ENDS HERE */}

        {/* RIGHT SIDE BAR STARTS HERE */}
        <RightSideBar />
        {/* RIGHT SIDE BAR ENDS HERE */}
      </div>
    </div>
  );
}
