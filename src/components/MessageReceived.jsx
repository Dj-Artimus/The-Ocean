import React from 'react'

const MessageReceived = ({content}) => {
  return (
    <div className=" bg-background shadow-sm shadow-rose-500 dark:shadow-blue-500 dark:bg-d_background w-[70%] p-2 px-3 float-start mb-3 rounded-xl rounded-tl-none ">
    {content}
  </div>
  )
}

export default MessageReceived