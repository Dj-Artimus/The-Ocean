import React from 'react'
import Footer from './Footer'
import OceanScore from './OceanScore'
import OceanBoard from './OceanBoard'
import { UIStore } from '@/store/UIStore'

const ProfileRightSideBar = ({anchorings, anchors}) => {
  const { oceanVision } = UIStore();

  return (
    <div className="h-full p-4 pe-3 sticky top-0 ps-1 hidden lg:w-[25%] lg:block">
    <div
      className="bg-secondary dark:bg-d_secondary p-3 rounded-xl h-full overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex justify-center flex-col gap-3 text-center items-center">
        {/* HEADING BAR STARTS HERE */}
        <div className=" w-full flex flex-col bg-foreground dark:bg-d_foreground p-2 rounded-lg items-center shadow-sm shadow-blue-700">
          <h1 className=" text-2xl font-semibold leading-non">
            Ocean Board
          </h1>
        </div>
        {/* HEADING BAR ENDS HERE */}

        { oceanVision && <OceanBoard />}

        <OceanScore anchors={anchors} anchorings={anchorings} />

        <Footer />

      </div>
    </div>
  </div>
  )
}

export default ProfileRightSideBar