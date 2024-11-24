import { useEffect, useState } from "react";
import Droplet from "./Droplet";
import { DropletStore, UIStore } from "@/store/OceanStore";

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

export default function ProfileTreasureTabs() {
  const {
    GetUserDroplets,
    GetUserStaredDroplets,
    GetUserGemmedDroplets,
    GetUserRippledDroplets,
  } = DropletStore();

  const {
    dropletsRefreshId,
    profileTreasureTabIndex,
    setProfileTreasureTabIndex,
  } = UIStore();
  const [dropletsData, setDropletsData] = useState([]);

  const getDropletData = async (index = profileTreasureTabIndex) => {
    switch (index) {
      case 0:
        // return setDropletsData(await GetUserDroplets());
        console.log("treasure");
        return setDropletsData([]);
      case 1:
        return setDropletsData(await GetUserDroplets());
      case 2:
        const gemmedDropletData = await GetUserGemmedDroplets();
        console.log("gemmed Data: ", gemmedDropletData);
        return setDropletsData(
          gemmedDropletData?.map((data) => {
            return data.droplet_id;
          })
        );
      case 3:
        const staredDropletData = await GetUserStaredDroplets();
        return setDropletsData(
          staredDropletData?.map((data) => {
            return data.droplet_id;
          })
        );
      case 4:
        const RippledDropletData = await GetUserRippledDroplets();
        return setDropletsData(
          RippledDropletData?.map((data) => {
            return data.droplet_id;
          })
        );
    }
  };

  // useEffect(() => {
  //   getDropletData();
  // }, []);

  useEffect(() => {
    getDropletData();
  }, [dropletsRefreshId]);

  const handleChange = (index) => {
    setProfileTreasureTabIndex(index);
    getDropletData(index);
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
          {dropletsData?.map((droplet, index) => {
            return (
              <Droplet
                key={index}
                droplet_id={droplet?.id}
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
              />
            );
          })}
        </div>
      </CustomprofileTreasureTabIndexPanel>
    </div>
  );
}
