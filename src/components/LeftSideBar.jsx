import React, { useEffect, useState } from "react";
import UserMsgProfile from "./UserMsgProfile";
import AnchorIcon from "@mui/icons-material/Anchor";
import "../app/globals.css";
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";
import { Close, Insights, Search } from "@mui/icons-material";
import { CommunicationStore } from "@/store/CommunicationStore";
import InputTextarea from "./InputTextArea";

const LeftSideBar = ({ styles }) => {
  const { isMsgsOpen, isOCardOpen } = UIStore();
  const { harborMatesData, SubscribeToAnchors } = UserStore();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = async () => {
    // const arr = [];
    // arr.filter( data => data.name.includes(searchKeyword) )
    return;
  };

  const handleOpenCloseAnimation = async () => {
    // return `${isSearchOpen ? }`
  }

  useEffect(() => {
    const anchorsChannel = SubscribeToAnchors();
    return () => {
      if (anchorsChannel) anchorsChannel.unsubscribe();
    };
  }, [SubscribeToAnchors]); // Add 'subscribeToanchors' as a dependency

  return (
    <div
      className={
        styles
          ? styles
          : ` ${
              isMsgsOpen && !isOCardOpen
                ? "opacity-100 fixed"
                : "opacity-0 hidden"
            } lg:opacity-100 transition-opacity h-full lg:p-4 pb-[56px] ps-2 pt-2 pe-2 bg-background dark:bg-d_background lg:ps-3 z-10 lg:pe-1 left-0 w-full sm:ps-[12%] sm:pe-[13%] lg:left-auto lg:sticky rounded-xl top-0 lg:block lg:w-[40%] xl:w-[32%]`
      }
    >
      <div className="bg-primary dark:bg-d_primary rounded-xl h-full w-full overflow-y-hidden">
        <h1 className="sticky top-0 bg-primary dark:bg-d_primary py-2 rounded-t-xl z-10 text-lg shadow-sm shadow-blue-700 text-center">
          {" "}
          <Insights sx={{ width: "26px", height: "26px" }} /> HarborMates
          <div
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
            }}
            className="absolute right-2 pt-[1px] w-7 h-7 rounded-lg bottom-2"
          >
            <Close
              sx={{ width: "26px", height: "26px" }}
              className={` text-text_clr2 transition-all absolute right-0 dark:text-d_text_clr2 ${
                isSearchOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
              } `}
            />
            <Search
              sx={{ width: "26px", height: "26px" }}
              className={` text-text_clr2 transition-all absolute right-0 dark:text-d_text_clr2 ${
                !isSearchOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
              } `}
            />
          </div>
        </h1>
        <div className="flex flex-col divide-y divide-slate-700 pb-16 overflow-y-auto w-full h-full customScrollbar">
          <div
            className={`w-full transition-all p-2 px-2 mx-auto ${
              !isSearchOpen
                ? " translate-y-0 scale-100 opacity-100 "
                : "-translate-y-14 scale-0 opacity-0"
            }`}
          >
            <InputTextarea
              placeholder={"Search HarborMate..."}
              input={searchKeyword}
              setInput={setSearchKeyword}
              handleSubmit={handleSearch}
              type={"search"}
              submitBtn={
                <Search className="absolute right-3 bottom-[18px] size-7" />
              }
            />
          </div>
          {/* USERS PROFILE IN anchors STARTS HERE */}
          {searchKeyword
            ? harborMatesData
                ?.filter((data) => data.name.includes(searchKeyword))
                ?.map((data) => (
                  <UserMsgProfile
                    key={data?.id}
                    avatar_url={data?.avatar?.split("<|>")[0]}
                    name={data.name}
                    wave={data?.wave}
                    profile_id={data?.id}
                  />
                ))
            : harborMatesData?.map((data) => (
                <UserMsgProfile
                  key={data?.id}
                  avatar_url={data?.avatar?.split("<|>")[0]}
                  name={data.name}
                  wave={data?.wave}
                  profile_id={data?.id}
                />
              ))}

          {/* USERS PROFILE IN anchors ENDS HERE */}
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
