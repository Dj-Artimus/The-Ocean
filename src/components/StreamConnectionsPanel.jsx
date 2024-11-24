import React from "react";
import AccordionBasic from "./Accordion";
import PlatformlinkCard from "./PlatformlinkCard";
import PlatformlinkedCard from "./PlatformlinkedCard";

const StreamConnectionsPanel = () => {
  return (
    <AccordionBasic title={"Stream Connections"}>
      <div className="flex gap-4 overflow-x-auto p-2 pb-5">
        <PlatformlinkedCard avatar_url={"/images/profileImg.png"} platform={"linkedin"} />
        <PlatformlinkedCard avatar_url={"/images/profileImg.png"} platform={"x"} />
        <PlatformlinkCard platform={"x"} />
        <PlatformlinkCard platform={"facebook"} />
        <PlatformlinkCard platform={"instagram"} />
      </div>
    </AccordionBasic>
  );
};

export default StreamConnectionsPanel;
