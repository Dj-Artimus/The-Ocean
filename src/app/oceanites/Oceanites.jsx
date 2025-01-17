"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "../globals.css";
import {
  ArrowBack,
  Close,
  CrisisAlertRounded,
  Cyclone,
  CycloneRounded,
  Search,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import OceaniteCard from "@/components/OceaniteCard";
import LeftSideBar from "@/components/LeftSideBar";
import { UserStore } from "@/store/UserStore";
import { UIStore } from "@/store/UIStore";
import InputTextarea from "@/components/InputTextArea";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchDataForInfiniteScroll,
  setInfiniteScroll,
  setScrollListener,
} from "@/utils/InfiniteScrollSetUp";

const OceaniteAtolls = () => {
  const { SearchOceanites, oceanitesData, GetOceanites } = UserStore();
  const { isMsgsOpen, setIsMsgsOpen, isOCardOpen } = UIStore();
  const [searchKeyword, setSearchKeyword] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const oceanitesRef = useRef();
  const router = useRouter();

  // const handleSubmi  = useCallback(async () => {
  //   await SearchOceanites(searchKeyword);
  // }, [SearchOceanites, searchKeyword]);

  const getSearchedOceanites = useCallback(
    async (searchPage, initialHasMore) => {
      const limit = 10;
      const isHasMore = initialHasMore || hasMore;
      if (isLoading || !isHasMore) return;
      setIsLoading(true);
      try {
        const newData = await SearchOceanites(
          searchPage ? searchPage : page,
          limit,
          searchKeyword.trim()
        );
        if (newData?.length === limit)
          return setPage(searchPage ? searchPage + 1 : (prev) => prev + 1);
        if (newData?.length < limit || newData === null) {
          setHasMore(false);
          setPage(1);
        }
      } catch (error) {
        console.error("Error fetching oceanites:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [SearchOceanites, searchKeyword, isLoading, hasMore, page]
  );

  const handleSubmit = useCallback(async () => {
    setHasMore(true);
    setIsSearching(true);
    setIsSearched(true);
    await getSearchedOceanites(1, true);
    setIsSearching(false);
  }, [SearchOceanites, searchKeyword, getSearchedOceanites]);

  const getOceanites = () => {
    if (searchKeyword.trim().length > 0)
      fetchDataForInfiniteScroll(
        isLoading,
        setIsLoading,
        hasMore,
        setHasMore,
        page,
        setPage,
        10,
        getSearchedOceanites
      );
    else getAllOceanites();
  };

  const getAllOceanites = useCallback(async (initialPage, initialHasMore) => {
    return fetchDataForInfiniteScroll(
      isLoading,
      setIsLoading,
      initialHasMore || hasMore,
      setHasMore,
      initialPage || page,
      setPage,
      10,
      GetOceanites
    );
  });

  const handleScroll = () =>
    setInfiniteScroll(oceanitesRef, hasMore, page, isLoading, getOceanites);

  useEffect(() => {
    getOceanites();
  }, []);

  useEffect(() => {
    setScrollListener(oceanitesRef, handleScroll);
  }, [setScrollListener, handleScroll]);

  return (
    <div>
      <div className="w-screen flex h-screen relative overflow-x-hidden">
        {isSearching && (
          <div className="bg-background bg-opacity-5 dark:bg-opacity-5 backdrop-blur-sm transition-colors duration-150 dark:bg-d_background w-screen h-screen fixed z-50 flex justify-center items-center">
            <div className=" animate-pulse">
              <Cyclone className="size-20 animate-spin" />
            </div>
          </div>
        )}

        <div
          onClick={() => {
            isMsgsOpen ? setIsMsgsOpen(false) : router.push("/");
          }}
          className="fixed lg:hidden top-[1px] left-[1px] z-30 text-white bg-blue-700 bg-opacity-80 rounded-tl-none rounded-xl p-[2px] cursor-pointer"
        >
          <ArrowBack
            sx={{
              width: "30px",
              height: "30px",
            }}
            className="size-7"
          />
        </div>

        {isSearched && (
          <div
            onClick={() => {
              setHasMore(true);
              setIsSearching(true);
              setSearchKeyword("");
              setIsSearched(false);
              getAllOceanites(1, true);
              setIsSearching(false);
            }}
            className="fixed lg:hidden top-[1px] right-[1px] z-30 text-white bg-blue-700 bg-opacity-80 rounded-tr-none rounded-xl p-[2px] cursor-pointer"
          >
            <Close
              sx={{
                width: "30px",
                height: "30px",
              }}
              className="size-7"
            />
          </div>
        )}

        {/* NAVIGATION BAR STARTS HERE */}
        <Navbar
          navStyle={
            "fixed -bottom-2 pb-2 sm:me-1 px-[2px] flex w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[62%] sm:rounded-t-2xl z-20 border-t border-slate-700 translate-x-1/2 right-1/2 lg:top-0 lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
          }
        />
        {/* NAVIGATION BAR ENDS HERE */}

        <LeftSideBar
          styles={` ${
            isMsgsOpen && !isOCardOpen
              ? "opacity-100 fixed"
              : "opacity-0 hidden"
          } lg:opacity-100 transition-opacity z-10 h-full lg:p-4 pb-[56px] ps-2 pt-2 pe-2 bg-background dark:bg-d_background lg:ps-3 lg:pe-1 left-0 w-full sm:ps-[12%] sm:pe-[13%] lg:left-auto rounded-xl top-0 lg:hidden lg:w-[40%] xl:w-[32%]`}
        />

        {/* MAIN CONTENT STARTS HERE */}
        <div
          ref={oceanitesRef}
          className="h-full w-full m-auto overflow-x-hidden sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 p-2 lg:pt-[54px] overflow-y-auto customScrollbar"
        >
          {/* OCEANITES STARTS HERE */}

          <div className="lg:mt-3 mt-2 max-w-3xl mx-auto">
            <InputTextarea
              placeholder={"Search Oceanite..."}
              input={searchKeyword}
              setInput={setSearchKeyword}
              handleSubmit={handleSubmit}
              type={"search"}
              submitBtn={
                <Search className="absolute right-3 bottom-[18px] size-7" />
              }
            />
          </div>
          <div className=" max-w-2xl m-auto ">
            {oceanitesData?.map((profileData) => {
              return (
                <OceaniteCard
                  key={profileData?.id}
                  oceaniteData={profileData}
                  user_id={profileData?.id}
                  ocean_id={profileData?.user_id}
                  name={profileData?.name}
                  username={profileData?.username}
                  wave={profileData?.wave}
                  avatar_url={profileData?.avatar?.split("<|>")[0]}
                  anchors={profileData?.anchors}
                  anchorings={profileData?.anchorings}
                />
              );
            })}
          </div>
          {isLoading && (
            <div className="animate-pulse w-full flex justify-center items-center">
              <CycloneRounded className="animate-spin size-8" />
            </div>
          )}
          {!hasMore && (
            <div className="text-cyan-500 animate-pulse w-full flex justify-center items-center mt-2 gap-1">
              <CrisisAlertRounded className="size-6 animate-spin" />
              No more Oceanites, we are still Growing...
            </div>
          )}

          {/* OCEANITES ENDS HERE */}

          <div className="h-1 w-full my-7"></div>
        </div>
        {/* MAIN CONTENT ENDS HERE */}
      </div>
    </div>
  );
};

export default OceaniteAtolls;
