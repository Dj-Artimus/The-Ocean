"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import AccordionBasic from "@/components/Accordion";
import "../globals.css";

import Navbar from "@/components/Navbar";
import ProfileRightSideBar from "@/components/ProfileRightSideBar";
import ProfilePanel from "@/components/ProfilePanel";
import OceanBoard from "@/components/OceanBoard";
import StreamConnectionsPanel from "@/components/StreamConnectionsPanel";
import ProfileEditModal from "@/components/ProfileEditModel";
import LeftSideBar from "@/components/LeftSideBar";
import { ArrowBack } from "@mui/icons-material";
import ProfileTreasureTabs from "@/components/ProfileTreasureTabs";
import UILoader from "@/components/UILoader";
import { UserStore } from "@/store/UserStore";
import { UIStore } from "@/store/UIStore";

export default function OceaniteProfile() {
  const {
    oceaniteProfileData,
    isProfileDataFetched,
    setupSubscriptionsForProfileData,
    subscribeToProfileChanges,
  } = UserStore();
  const {
    isProfileEditModalOpen,
    isMsgsOpen,
    setIsMsgsOpen,
    isOCardOpen,
    setIsOCardOpen,
    oceanVision,
    setIsPageLoading,
  } = UIStore();
  const treasureRef = useRef();

  const router = useRouter();

  useEffect(() => {
    setIsMsgsOpen(false);
    setIsOCardOpen(false);
    setIsPageLoading(false);
    if (!oceaniteProfileData?.id) router.push("/");
  }, [setIsMsgsOpen, setIsOCardOpen, oceaniteProfileData?.id, router, setIsPageLoading]);

  useEffect(() => {
    // Set up real-time subscription for updates

    const channel = subscribeToProfileChanges("oceanite-profile");
    // Cleanup subscription on unmount
    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [oceaniteProfileData, subscribeToProfileChanges]);

  if (!isProfileDataFetched) return <UILoader />;

  return (
    <div
      ref={treasureRef}
      className="w-screen flex h-screen relative overflow-x-hidden lg:px-[4%] xl:px-[10%] customScrollbar "
    >
      {isProfileEditModalOpen && (
        <ProfileEditModal profileData={oceaniteProfileData} />
      )}

      {/* NAVIGATION BAR STARTS HERE */}
      <Navbar
        navStyle={
          "fixed lg:backdrop-blur-xl -bottom-2 px-[2px] pb-2 sm:me-[3px] lg:me-0 flex w-full sm:w-[89%] md:w-[84%] lg:w-[68%] xl:w-[59%] sm:rounded-t-2xl z-30 lg:bg-opacity-70 border-t border-slate-700 translate-x-1/2 right-1/2 lg:translate-x-0 lg:right-[27.8%] xl:right-[30.8%] lg:top-0 lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
        }
      />
      {/* NAVIGATION BAR ENDS HERE */}
      {isMsgsOpen && (
        <div
          onClick={() => {
            setIsMsgsOpen(false);
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
      )}

      <LeftSideBar
        styles={` ${
          isMsgsOpen && !isOCardOpen ? "opacity-100 fixed" : "opacity-0 hidden"
        } lg:opacity-100 transition-opacity h-full z-20 lg:p-4 pb-[56px] ps-2 pt-2 pe-2 bg-background dark:bg-d_background lg:ps-3 lg:pe-1 left-0 w-full sm:ps-[12%] sm:pe-[13%] lg:left-auto rounded-xl top-0 lg:hidden lg:w-[40%] xl:w-[32%]`}
      />

      {/* MAIN CONTENT STARTS HERE */}
      {!oceaniteProfileData?.id ? (
        <div className="h-full w-full m-auto sm:w-[90%] md:w-[86%] lg:w-[75%] text-3xl px-5 text-center flex justify-center items-center">
          <h1>No data found ! Redirecting to Home.</h1>
        </div>
      ) : (
        <div className="h-full w-full m-auto sm:w-[90%] md:w-[86%] lg:w-[75%]">
          <div className=" xl:pe-2 pt-0 xl:pt-2 p-2 pb-0">
            <div className="mt-3 border relative bg-primary dark:bg-d_primary shadow-sm shadow-blue-600 rounded-3xl border-slate-700 lg:mt-14 p-3 pt-1">
              {/* PROFILE DETAILS STARTS HERE */}

              <ProfilePanel
                user_id={oceaniteProfileData?.id}
                name={oceaniteProfileData?.name}
                username={oceaniteProfileData?.username}
                email={oceaniteProfileData?.email}
                gender={oceaniteProfileData?.gender}
                age={
                  oceaniteProfileData?.dob
                    ? String(
                        new Date().getUTCFullYear() -
                          new Date(oceaniteProfileData?.dob).getUTCFullYear()
                      )
                    : ""
                }
                wave={oceaniteProfileData?.wave}
                avatar_url={oceaniteProfileData?.avatar?.split("<|>")[0]}
                poster_url={oceaniteProfileData?.poster?.split("<|>")[0]}
                anchors={oceaniteProfileData?.anchors}
                anchorings={oceaniteProfileData?.anchorings}
              />

              {oceanVision && (
                <>
                  {/* PROFILE DETAILS ENDS HERE */}
                  <hr className="m-2 border-slate-700" />
                  {/* CONNECTING SOCIAL PLATFORM STREAMS STARTS HERE */}
                  <StreamConnectionsPanel
                    avatar={oceaniteProfileData?.avatar?.split("<|>")[0]}
                  />
                  {/* CONNECTING SOCIAL PLATFORM STREAMS ENDS HERE */}
                  {/* OCEAN BOARD FOR SMALL DEVICES STARTS HERE */}
                  <div className="lg:hidden">
                    <hr className="m-2 border-slate-700" />
                    <AccordionBasic title={"Ocean Board"}>
                      <div className="xs4:w-fit w-full m-auto flex justify-center">
                        <OceanBoard username={oceaniteProfileData?.username} />
                      </div>
                    </AccordionBasic>
                  </div>
                  {/* OCEAN BOARD FOR SMALL DEVICES ENDS HERE */}
                </>
              )}
            </div>
          </div>
          <div className="my-1 relative px-2 shadow-blue-600 rounded-3xl border-slate-700">
            <ProfileTreasureTabs oceanite_id={oceaniteProfileData.id} />
            <div className="h-20 w-full"></div>
          </div>
        </div>
      )}
      {/* MAIN CONTENT ENDS HERE */}

      {/* RIGHT SIDE BAR STARTS HERE */}

      <ProfileRightSideBar />

      {/* RIGHT SIDE BAR ENDS HERE */}
    </div>
  );
}
