import { useEffect, useState } from "react";
import Droplet from "./Droplet";
import { DropletStore } from "@/store/DropletStore";
import { UIStore } from "@/store/UIStore";

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

export default function ProfileTreasureTabs({oceanite_id}) {
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

  const dropletDataTypes = [
    { type: "treasureDroplets", data: treasureDroplets },
    { type: "userDroplets", data: userDroplets },
    { type: "userGemmedDroplets", data: userGemmedDroplets },
    { type: "userStaredDroplets", data: userStaredDroplets },
    { type: "userRippledDroplets", data: userRippledDroplets },
  ];

  const getDropletData = async (index = profileTreasureTabIndex) => {
    switch (index) {
      case 0:
        return await GetTreasureDroplets(oceanite_id && oceanite_id );
      case 1:
        return await GetUserDroplets(oceanite_id && oceanite_id );
      case 2:
        return await GetUserGemmedDroplets(oceanite_id && oceanite_id );
      case 3:
        return await GetUserStaredDroplets(oceanite_id && oceanite_id );
      case 4:
        return await GetUserRippledDroplets(oceanite_id && oceanite_id );
    }
  };

  useEffect(() => {
    setDropletDataType(dropletDataTypes[profileTreasureTabIndex].type);
    getDropletData();
  }, []);

  const handleChange = (index) => {
    setProfileTreasureTabIndex(index);
    getDropletData(index);
    setDropletDataType(dropletDataTypes[index].type);
    setDroplets(dropletDataTypes[profileTreasureTabIndex].data);
  };

  

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

          {dropletDataTypes[profileTreasureTabIndex]?.data?.map((droplet, index) => {
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
                  time={droplet?.created_at}
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
        </div>
      </CustomprofileTreasureTabIndexPanel>
    </div>
  );
}
