import { useEffect, useRef, useState } from "react";
import Droplet from "./Droplet";
import { DropletStore } from "@/store/DropletStore";
import { UIStore } from "@/store/UIStore";
import { CrisisAlertRounded, CycloneRounded } from "@mui/icons-material";

function CustomprofileTreasureTabIndexPanel({ children, value, index }) {
  return (
    <div
      role="profileTreasureTabIndexpanel"
      hidden={value !== index}
      className=""
    >
      {value === index && <div className="">{children}</div>}
    </div>
  );
}

const treasureTabs = ["Treasure", "Droplets", "Gems", "Stars", "Ripples"];

export default function ProfileTreasureTabs({treasureRef}) {
  const {
    GetTreasureDroplets,
    GetUserDroplets,
    GetUserStaredDroplets,
    GetUserGemmedDroplets,
    GetUserRippledDroplets,
    treasureDroplets,
    userDroplets,
    userStaredDroplets,
    userGemmedDroplets,
    userRippledDroplets,
    userReDroppedDroplets,
    setDropletDataType,
    dropletsData,
  } = DropletStore();

  const { dropletsRefreshId } = UIStore();

  const [profileTreasureTabIndex, setProfileTreasureTabIndex] = useState(1);
  const [droplets, setDroplets] = useState(userDroplets);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dropletDataTypes = [
    { type: "treasureDroplets", data: treasureDroplets },
    { type: "userDroplets", data: userDroplets },
    { type: "userGemmedDroplets", data: userGemmedDroplets },
    { type: "userStaredDroplets", data: userStaredDroplets },
    { type: "userRippledDroplets", data: userRippledDroplets },
  ];

  const fetchData = async (GetData) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const newDroplets = await GetData(page, 5);
    if (newDroplets.length < 5 || newDroplets === "end") {
      setHasMore(false); // Stop fetching if fewer than limit
    } else if (newDroplets) {
      setPage((prevPage) => prevPage + 1);
    }
    setIsLoading(false);
  };

  const getDropletData = async (index = profileTreasureTabIndex) => {
    switch (index) {
      case 0:
        return await fetchData(GetTreasureDroplets);
      case 1:
        return await fetchData(GetUserDroplets);
      case 2:
        return await fetchData(GetUserGemmedDroplets);
      case 3:
        return await fetchData(GetUserStaredDroplets);
      case 4:
        return await fetchData(GetUserRippledDroplets);
    }
  };

  useEffect(() => {
    setDropletDataType(dropletDataTypes[profileTreasureTabIndex].type);
    getDropletData();
  }, []);

  const handleChange = (index) => {
    setPage(1);
    setProfileTreasureTabIndex(index);
    getDropletData(index);
    setDropletDataType(dropletDataTypes[index].type);
    // setDroplets(dropletDataTypes[profileTreasureTabIndex].data);
  };

  const handleInfiniteScroll = async () => {
    const element = treasureRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      console.log('scrollTop', scrollTop)
      console.log('scrollHeight', scrollHeight)
      console.log('clientHeight', clientHeight)
      if (
        hasMore &&
        clientHeight + 100 < scrollHeight &&
        scrollTop + clientHeight >= scrollHeight - 100
      ) {
        console.log("Fetch more data!");
        if (page > 1) await getDropletData();
      }
    }
  };

  useEffect(() => {
    const element = treasureRef.current;
    if (element) {
      element.addEventListener("scroll", handleInfiniteScroll);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", handleInfiniteScroll);
      }
    };
  }, [handleInfiniteScroll]);

  return (
    <div className="w-full">
      <div className="z-20 mt-3">
        <div className="border rounded-2xl mb-[10px] border-slate-600 overflow-hidden backdrop-blur-xl bg-foreground dark:bg-d_foreground bg-opacity-70">
          <nav className="flex space-x-4 p-2 overflow-x-auto">
            {treasureTabs.map((name, index) => {
              return (
                <button
                  key={index}
                  className={`px-4 py-2 text-xl font-semibold ${
                    profileTreasureTabIndex === index
                      ? "bg-primary dark:bg-d_primary shadow-sm shadow-blue-500 rounded-xl  text-blue-500"
                      : "hover:text-blue-500"
                  }`}
                  onClick={() => handleChange(index)}
                >
                  {name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <CustomprofileTreasureTabIndexPanel
        value={profileTreasureTabIndex}
        index={profileTreasureTabIndex}
      >
        <div>
          {/* {dropletsData.map((droplet, index) => { */}

          {dropletDataTypes[profileTreasureTabIndex]?.data?.map(
            (droplet, index) => {
              return (
                <Droplet
                  key={index}
                  droplet_id={droplet?.id}
                  dropletDataType={
                    dropletDataTypes[profileTreasureTabIndex].type
                  }
                  tabIndex={profileTreasureTabIndex}
                  author_id={droplet?.user_id?.id}
                  avatar_url={droplet?.user_id?.avatar}
                  name={droplet?.user_id?.name}
                  username={droplet?.user_id?.username}
                  wave={droplet?.user_id?.wave}
                  platform={droplet?.platform}
                  time={"5h"}
                  content={droplet?.content}
                  images={droplet?.images}
                  videos={droplet?.videos}
                  stars={droplet?.stars}
                  ripples={droplet?.ripples}
                  redrops={droplet?.redrops}
                />
              );
            }
          )}
          {isLoading && (
            <div className="animate-pulse w-full flex justify-center items-center">
              <CycloneRounded className="animate-spin size-8" />
            </div>
          )}
          {!hasMore && (
            <div className="text-cyan-500 animate-pulse w-full flex justify-center items-center gap-1">
              No more data to show ...
            </div>
          )}
        </div>
      </CustomprofileTreasureTabIndexPanel>
    </div>
  );
}
