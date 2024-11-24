import { getPlatformIcon } from '@/utils/PlatformIconGetter'
import React from 'react'

const PlatformlinkCard = ({platform}) => {
  return (
    <div className="bg-foreground dark:bg-d_foreground bg-opacity-50 p-2 rounded-xl flex flex-col items-center justify-between w-24 shadow-md dark:shadow-sm shadow-rose-800 dark:shadow-red-500 hover:bg-ternary dark:hover:bg-d_ternary hover:scale-105 transition-transform duration-300 ">
        {getPlatformIcon(platform, platform === "x" ? "w-[70px] h-[70px] mx-2 mt-[4px]" : "size-20")}
    {/* <h1 className="ml-2 text-xs">Not Connected</h1> */}
    <button className="p-1 px-3 text-xl text-white bg-blue-600 rounded-xl mt-2 mb-1">
      Link
      {/* <Link/> */}
    </button>
  </div>
  )
}

export default PlatformlinkCard