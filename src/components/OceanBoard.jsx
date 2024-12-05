import React from "react";
import PlatformScoreCard from "./PlatformScoreCard";
import { formatCount, getRandomNumber } from "@/utils/TimeAndCountFormater";

const OceanBoard = ({username}) => {
  return (
    <div className="text-[14px] max-w-[278px] w-[90%] text-text_clr2 dark:text-d_text_clr2  flex flex-col divide-y divide-slate-700 shadow-sm shadow-blue-600 bg-foreground dark:bg-d_primary rounded-lg px-2">
        <PlatformScoreCard username={username} platform={"linkedin"} anchors={formatCount(getRandomNumber(1,9999999))} anchorings={formatCount(getRandomNumber(1,9999999))} />
        <PlatformScoreCard username={username} platform={"facebook"} anchors={formatCount(getRandomNumber(1,9999999))} anchorings={formatCount(getRandomNumber(1,9999999))} />
        <PlatformScoreCard username={username} platform={"instagram"} anchors={formatCount(getRandomNumber(1,9999999))} anchorings={formatCount(getRandomNumber(1,9999999))} />
        <PlatformScoreCard username={username} platform={"x"} anchors={formatCount(getRandomNumber(1,9999999))} anchorings={formatCount(getRandomNumber(1,9999999))} />
        <PlatformScoreCard username={username} platform={"youtube"} anchors={formatCount(getRandomNumber(1,9999999))} anchorings={formatCount(getRandomNumber(1,9999999))} />
    </div>
  );
};

export default OceanBoard;
