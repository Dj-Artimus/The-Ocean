import React from "react";
import AccordionBasic from "./Accordion";
import PlatformlinkCard from "./PlatformlinkCard";
import PlatformlinkedCard from "./PlatformlinkedCard";

const StreamConnectionsPanel = ({avatar}) => {
  return (
    <AccordionBasic title={"Stream Connections"}>
      <div className="flex gap-4 overflow-x-auto p-2 pb-5">
        <PlatformlinkedCard avatar_url={avatar} platform={"linkedin"} />
        <PlatformlinkedCard avatar_url={avatar} platform={"x"} />
        <PlatformlinkCard platform={"instagram"} />
        <PlatformlinkCard platform={"youtube"} />
        <PlatformlinkCard platform={"facebook"} />
      </div>
    </AccordionBasic>
  );
};

export default StreamConnectionsPanel;
