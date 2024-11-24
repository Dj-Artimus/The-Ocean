import React from 'react'

const MessageSent = ({content}) => {
  return (
    <div className=" bg-primary shadow-sm shadow-red-500 dark:shadow-blue-500 dark:bg-d_ternary w-[70%] p-2 px-3 float-end rounded-xl mb-3 rounded-tr-none ">
    {content}
  </div>
  )
}

export default MessageSent