import React, { useState } from "react";
import RippleContentElement from "./RippleContentElement";
import { UIStore, UserStore } from "@/store/OceanStore";
import { MoreVert } from "@mui/icons-material";

const Ripple = ({
  avatar_url,
  name,
  wave,
  rippleContent,
  echoes,
  ripple_id,
  droplet_id,
  user_id,
}) => {
  const {
    setContentToEdit,
    setContentEditId,
    setIsMoreOptionsModalOpen,
    setContentToEditType
  } = UIStore();
  const { profileData } = UserStore();
  const [isEchoesExpanded, setIsEchoesExpanded] = useState(false);

  return (
    <div author_id={user_id} className="my-2 border bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 rounded-2xl border-slate-700 w-full">
      <div className="">
        <div className="flex items-start fc gap-[5px] ms-[9px]">
          <div className="flex-shrink-0 cursor-pointer">
            <img
              src={avatar_url}
              alt="profile"
              className="size-10 my-2 rounded-xl border-2 border-slate-500"
            />
          </div>
          <div className="flex justify-center mx-1 mt-1 gap-1 flex-col w-full">
            <div className="flex">
              <div className="flex w-full justify-between flex-col items-center">
                <div className="flex w-full items-center cursor-pointer">
                  <h1 className="font-semibold line-clamp-1 break-all ">
                    {name}
                  </h1>
                </div>
                <div className="flex w-full items-center cursor-pointer">
                  {/* <h1 className="font-semibold line-clamp-1">{name}</h1> */}
                  <h1 className=" text-sm line-clamp-1 text-text_clr2 break-all dark:text-d_text_clr2">
                    {wave}
                  </h1>
                </div>
              </div>
              {user_id === profileData.id && (
                <div
                  onClick={() => {
                    console.log("openig model..");
                    setContentEditId(ripple_id);
                    setContentToEdit(rippleContent);
                    setContentToEditType('Ripple');
                    setIsMoreOptionsModalOpen(true);
                  }}
                  className="w-fit h-fit rounded-xl"
                >
                  <MoreVert className="rounded-xl mt-1 cursor-pointer" />
                </div>
              )}
            </div>
            {/* Content with expandable feature */}
            <RippleContentElement
              content={rippleContent}
              echoes={echoes ? true : false}
            />
            {isEchoesExpanded && (
              <div className="w-[110%] -ms-[10%] xs3:w-[105%] xs3:-ms-[5%] sm:w-full sm:-ms-0 rounded-xl overflow-hidden ">
                {echoes && echoes}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ripple;
