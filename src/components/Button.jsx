import React from 'react'
import {motion} from 'framer-motion'

const Button = ( props ) => {
  return (
    <motion.button 
    whileHover = {{
        scale : 1.1
    }}
    whileTap={{
        scale : 0.9
    }}
     type={props.type ? props.type : "submit"} 
     {...props}
       >{props.children}</motion.button>
  )
}

export default Button