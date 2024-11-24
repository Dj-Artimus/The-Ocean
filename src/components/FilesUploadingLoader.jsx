import { UIStore } from "@/store/OceanStore";
import { Cyclone } from "@mui/icons-material";
import { Box, LinearProgress } from "@mui/material";
import React from "react";

const FilesUploadingLoader = () => {
  const { isMediaFileUploading } = UIStore();

  return (
    <>
      {isMediaFileUploading && (
        <div className="bg-d_background bg-opacity-10 backdrop-blur-sm w-screen h-screen fixed px-5 z-50 flex flex-col justify-center items-center  ">
          <div className="w-full">
            <h1 className="text-xl my-3">
              Uploading Media Files{" "}
              <span className=" animate-lodingDot1">.</span>{" "}
              <span className=" animate-lodingDot2">.</span>{" "}
              <span className=" animate-lodingDot3">.</span>{" "}
            </h1>
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          </div>
          <div className=" absolute bottom-6 animate-pulse">
            <Cyclone className="size-12  animate-spin" />
          </div>
        </div>
      )}
    </>
  );
};

export default FilesUploadingLoader;
