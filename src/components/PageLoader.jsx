import { Cyclone } from '@mui/icons-material'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='bg-background bg-opacity-15 dark:bg-opacity-15 backdrop-blur-sm transition-colors duration-150 dark:bg-d_background w-screen h-screen fixed z-50 flex justify-center items-center'>
        <div className=' animate-pulse' >
            <Cyclone className='size-20 animate-spin' />
        </div>
    </div>
  )
}

export default PageLoader