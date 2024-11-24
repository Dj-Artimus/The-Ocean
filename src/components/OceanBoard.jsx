import React from "react";
import PlatformScoreCard from "./PlatformScoreCard";

const OceanBoard = () => {
  return (
    <div className="text-[14px] max-w-[278px] w-[90%] text-text_clr2 dark:text-d_text_clr2  flex flex-col divide-y divide-slate-700 shadow-sm shadow-blue-600 bg-foreground dark:bg-d_primary rounded-lg px-2">
        <PlatformScoreCard username={"DjArtimusDjArtimus"} platform={"linkedin"} anchors={"520"} anchorings={"4k"} />
        <PlatformScoreCard username={"DjArtimus.x"} platform={"facebook"} anchors={"50"} anchorings={"7k"} />
        <PlatformScoreCard username={"DjArtimusDon"} platform={"instagram"} anchors={"5k"} anchorings={"88k"} />
        <PlatformScoreCard username={"DjArtimusJaan"} platform={"x"} anchors={"50"} anchorings={"9k"} />
    </div>
  );
};

export default OceanBoard;
