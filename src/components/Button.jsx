import React from 'react'
import {motion} from 'framer-motion'

const Button = ({text , type , color }) => {
  return (
    <motion.button 
    whileHover = {{
        scale : 1.025
    }}
    whileTap={{
        scale : 0.975
    }}
     type={type ? type : "submit"} 
      className= {`${ color ? color : "bg-blue-800" } p-2 w-full rounded-lg text-xl font-semibold text-white`}  >{text}</motion.button>
  )
}

export default Button