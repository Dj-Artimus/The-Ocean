"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "../globals.css";
import { ArrowBack, Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import OceaniteCard from "@/components/OceaniteCard";
import LeftSideBar from "@/components/LeftSideBar";
import { UserStore } from "@/store/UserStore";
import { UIStore } from "@/store/UIStore";
import InputTextarea from "@/components/InputTextArea";
import { useEffect, useState } from "react";

const OceaniteAtolls = () => {
  const { SearchOceanites, oceanitesData, GetInitialOceanites } = UserStore();
  const { isMsgsOpen, setIsMsgsOpen, isOCardOpen } = UIStore();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSubmit = async () => {
    await SearchOceanites(searchKeyword);
  };

  useEffect(() => {
    const getOceanites = async () => {
      await GetInitialOceanites();
    };
    getOceanites();
  }, [GetInitialOceanites]);

  const router = useRouter();

  return (
    <div>
      <div className="w-screen flex h-screen relative overflow-x-hidden">
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
        <div className="h-full w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 p-2 lg:pt-[54px]">
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

          {/* OCEANITES ENDS HERE */}

          <div className="h-1 w-full my-20"></div>
        </div>
        {/* MAIN CONTENT ENDS HERE */}
      </div>
    </div>
  );
};

export default OceaniteAtolls;
