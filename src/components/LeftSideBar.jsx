import React, { useState } from "react";
import UserMsgProfile from "./UserMsgProfile";
import AnchorIcon from "@mui/icons-material/Anchor";
import '../app/globals.css'
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";

const LeftSideBar = ({styles}) => {
  const { isMsgsOpen, isOCardOpen} = UIStore();
  const { anchoringsData } = UserStore();
    const [isOnline, setIsOnline] = useState(true);

  return (
    <div className={styles? styles : ` ${isMsgsOpen && !isOCardOpen ? "opacity-100 fixed" : "opacity-0 hidden"} lg:opacity-100 transition-opacity h-full lg:p-4 pb-[56px] ps-2 pt-2 pe-2 bg-background dark:bg-d_background lg:ps-3 z-10 lg:pe-1 left-0 w-full sm:ps-[12%] sm:pe-[13%] lg:left-auto lg:sticky rounded-xl top-0 lg:block lg:w-[40%] xl:w-[32%]`}>
      <div className="bg-primary dark:bg-d_primary rounded-xl h-full w-full overflow-y-hidden">
        <h1 className="sticky top-0 bg-primary dark:bg-d_primary py-2 rounded-t-xl z-10 text-lg shadow-sm shadow-blue-700 text-center">
          {" "}
          <AnchorIcon className="size-4" /> Anchorings
        </h1>
        <div
          className="flex flex-col divide-y divide-slate-700 pb-16 overflow-y-auto w-full h-full customScrollbar"
        >
          {/* USERS PROFILE IN MESSAGES STARTS HERE */}
          {
            anchoringsData?.map((anchoring) => { 
             return <UserMsgProfile key={anchoring.anchoring_id.id} avatar_url={anchoring?.anchoring_id?.avatar.split('<|>')[0]} name={anchoring?.anchoring_id.name} wave={anchoring?.anchoring_id?.wave} profile_id = { anchoring?.anchoring_id?.id } isOnline={anchoring?.anchoring_id?.is_online || false} />
             })
          }

          {/* USERS PROFILE IN MESSAGES ENDS HERE */}
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
