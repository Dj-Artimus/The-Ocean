"use client";
import Image from "next/image";
// import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import "../globals.css";
import MessageSent from "@/components/MessageSent";
import MessageReceived from "@/components/MessageReceived";
import { UIStore } from "@/store/OceanStore";
import { ArrowBack } from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import InputTextarea from "@/components/InputTextArea";

export default function Chat() {
  const router = useRouter();
  const { isMsgsOpen, setIsMsgsOpen, isOCardOpen, setIsOCardOpen, setIsUILoading } = UIStore();

  return (
    <div className="w-screen flex h-screen relative overflow-hidden">
      {/* NAVIGATION BAR STARTS HERE */}
      {isMsgsOpen && (
        <Navbar
          navStyle={
            "fixed -bottom-2 pb-2 px-[2px] sm:me-1 lg:me-0 flex w-full sm:w-[74%] md:w-[79%] lg:w-[65.7%] xl:w-[51%] xl1:w-[51.4%] sm:rounded-t-2xl z-20 bg-primary dark:bg-d_primary border-t border-slate-700 translate-x-1/2 right-1/2 lg:right-[1%] lg:translate-x-0 xl:right-auto xl:left-[26.25%] xl1:left-[26.8%] lg:-top-[3px] lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
          }
        />
      )}
      {/* NAVIGATION BAR ENDS HERE */}

      {(isMsgsOpen || isOCardOpen) && (
        <div
          onClick={() => {
            router.push("/");
            setTimeout(() => { 
              setIsMsgsOpen(false);
              setIsOCardOpen(false);
            },1000);
          }}
          className="fixed top-[1px] left-[1px] z-30 bg-blue-500 dark:bg-blue-700 bg-opacity-50 backdrop-blur-sm rounded-tl-none rounded-xl p-[2px] cursor-pointer"
        >
          <ArrowBack className="size-7" />
        </div>
      )}

      {/* LEFT SIDE BAR STARTS HERE */}

      <LeftSideBar />

      {/* LEFT SIDE BAR ENDS HERE */}

      {/* MAIN CONTENT STARTS HERE */}
      <div className="h-full relative overflow-x-hidden bg-background dark:bg-d_background lg:bg-transparent flex flex-col w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 p-2 pt-0 lg:pt-[6px] ">
        <div className="my-3 border flex flex-col min-h-[50%] h-[90%] bg-foreground overflow-x-hidden dark:bg-d_foreground shadow-sm shadow-blue-600 rounded-xl border-slate-700 customScrollbar">
          {/* HEADING BAR STARTS HERE */}
          <div className=" bg-foreground dark:bg-d_foreground rounded-t-3xl shadow-md shadow-foreground dark:shadow-d_foreground">
            <div className="flex items-center w-full  px-3 pt-1  justify-between">
              <div className="flex gap-2 w-full">
                <div className="flex-shrink-0">
                  <img
                    src="/images/profileImg.png"
                    alt="profile"
                    className="size-12 my-2 rounded-xl border-2 border-slate-500"
                  />
                </div>
                <div className="mx-1 leading-snug mt-[9px] w-full hidden xs:block">
                  <div className="flex justify-center flex-col w-full">
                    <h1 className="font-semibold leading-non  max-w-[80%] truncate">
                      Dj Artimus Jana lorem
                    </h1>
                    <p className="text-[14px] truncate  max-w-[80%]">offline</p>
                    {/* <h1 className="text-text_clr2 dark:text-d_text_clr2">4h ago</h1> */}
                  </div>
                </div>
              </div>
              <div className="xs1:flex gap-2 sm:gap-3 lg:gap-4 translate-x-1 items-center rounded-xl font-semibold hidden ">
                <div
                  onClick={() => {
                    setIsMsgsOpen(true);
                  }}
                  className="mb-1 lg:hidden cursor-pointer"
                >
                  <ArrowBack
                    title="VideoChat"
                    className="size-7 hover:text-blue-500 "
                  />
                </div>
                <div
                  onClick={() => {
                    router.push("/");
                  }}
                  className="mb-1 hidden lg:block cursor-pointer"
                >
                  <ArrowBack
                    title="VideoChat"
                    className="size-7 hover:text-blue-500 "
                  />
                </div>
                <VoiceChatIcon
                  title="VoiceChat"
                  className="size-7 hidden xs2:block hover:text-blue-500 cursor-pointer"
                />
                <VideoChatIcon
                  title="VideoChat"
                  className="size-7 hidden xs2:block hover:text-blue-500 cursor-pointer"
                />
                <MoreVertRoundedIcon
                  title="VideoChat"
                  className="size-7 hover:text-blue-500 mb-1 cursor-pointer"
                />
              </div>
              {/* HEADING BAR ENDS HERE */}
            </div>
            <hr className="mx-4 mt-[2px] border-slate-700" />
          </div>
          <div className="px-4 py-3 h-full overflow-y-auto customScrollbar ">
            {/* MESSAGES START HERE  */}

            <MessageSent
              content={
                " Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, doloremque, officiis fuga dolorem sapiente unde error deserunt, cumque assumenda facilis id. "
              }
            />

            <MessageReceived
              content={
                " Lorem ip Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, doloremque, officiis fuga dolorem sapiente unde error deserunt, cumque assumenda facilis id.sum dolor sit amet consectetur adipisicing elit. Eos, doloremque, officiis fuga dolorem sapiente unde error deserunt, cumque assumenda facilis id.  "
              }
            />

            {/* MESSAGES END HERE  */}

            <div className="h-3 w-full my-4 float-start"></div>
          </div>
        </div>

        <div className=" overflow-hidden rounded-xl flex-shrink-0 mb-3">
          <InputTextarea placeholder={"Write a Message..."} />
        </div>
      </div>
      {/* MAIN CONTENT ENDS HERE */}

      {/* RIGHT SIDE BAR STARTS HERE */}

      <RightSideBar />

      {/* RIGHT SIDE BAR ENDS HERE */}
    </div>
  );
}
