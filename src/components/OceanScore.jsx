import React from "react";
import AnchorIcon from "@mui/icons-material/Anchor";
import SailingRoundedIcon from "@mui/icons-material/SailingRounded";
import { useRouter } from "next/navigation";

const OceanScore = ({anchors, anchorings}) => {
  const router = useRouter();
  return (
    <div className="w-full max-w-80 mb-5 items-center shadow-sm shadow-blue-500 rounded-xl bg-foreground dark:bg-d_foreground p-1">
      <div className="flex w-full items-center">
        <div onClick={() => {router.push("/anchors")}} className="xs1:flex flex-col items-center p-2 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary w-full hover:text-blue-400">
          <AnchorIcon />
          <h1 className="-mb-1">{anchors}</h1>
          <h1>Anchorers</h1>
        </div>
        <div onClick={() => {router.push("/anchorings")}} className="xs1:flex flex-col items-center p-2 rounded-xl text-blue-500 font-semibold hidden cursor-pointer hover:bg-primary dark:hover:bg-d_primary w-full hover:text-blue-400">
          <SailingRoundedIcon />
          <h1 className="-mb-1">{anchorings}</h1>
          <h1>Anchorings</h1>
        </div>
      </div>
      <div className='text-xl font-bold text-blue-600 dark:text-blue-400' >
        ocean score
      </div>
    </div>
  );
};

export default OceanScore;
