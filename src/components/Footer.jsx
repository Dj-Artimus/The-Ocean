import React from "react";
import CycloneIcon from "@mui/icons-material/Cyclone";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="flex items-center gap-1 flex-col">
      <div className="flex items-center font-bold tracking-widest">
        <CycloneIcon sx={{height:'40px',width:'40px'}} className="text-blue-500 " />
        <h1 className="text-4xl" >OCEAN</h1>
      </div>
      <h1 className="">Your Unified Social Media Platform</h1>
      <h1 className="text-text_clr2 dark:text-d_text_clr2 font-bold">
        {" "}
        The Ocean &copy; {year}{" "}
      </h1>
      <h1 className="text-slate-500 font-semibold">
        Developed by DjArtimus 💖{" "}
      </h1>
    </div>
  );
};

export default Footer;
