import React from "react";
import CycloneIcon from "@mui/icons-material/Cyclone";

const Footer = () => {
  return (
    <div className="flex items-center flex-col">
      <div className="flex items-center font-bold tracking-widest">
        <CycloneIcon className="text-blue-500 size-8" />
        <h1>OCEAN</h1>
      </div>
      <h1 className="text-sm">Your Unified Social Media Platform</h1>
      <h1 className="text-text_clr2 dark:text-d_text_clr2 font-bold">
        {" "}
        The Ocean &copy; 2024{" "}
      </h1>
      <h1 className="text-slate-500 text-sm font-semibold">
        Developed by DjArtimus 💖{" "}
      </h1>
    </div>
  );
};

export default Footer;
