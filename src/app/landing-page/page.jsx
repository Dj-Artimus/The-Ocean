'use client'
import { redirect } from 'next/navigation'
import React from 'react'

const LandingPage = () => {
    const handleNavigation = (dir) => { 
        redirect(dir);
     }

  return (
    <div className='w-screen h-screen flex justify-center gap-3 items-center bg-background dark:bg-d_background'>
        <button onClick={() => handleNavigation('/signup')} className='p-4 px-6 text-xl bg-blue-500 rounded-xl'>SignUp</button>
        <button onClick={() => handleNavigation('/login')} className='p-4 px-6 text-xl bg-blue-500 rounded-xl'>Login</button>
    </div>
  )
}

export default LandingPage