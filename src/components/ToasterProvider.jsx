'use client'

import toast, { Toaster } from "react-hot-toast"


export const ToasterProvider = () => { 
    return(
        <Toaster />
    )
 }

export const successToast = (msg) => { 
    toast.success(msg)
 }

 export const errorToast = (msg) => { 
    toast.error(msg)
 }
 
 export const loadingToast = (msg) => { 
    toast.loading(msg)
 }