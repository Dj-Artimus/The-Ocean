'use client'
import { useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { initializeTheme } from "@/utils/ThemeToggle";
import { UIStore, UserStore } from "@/store/OceanStore";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/reactQueryClient';
import UILoader from "@/components/UILoader";
import DropletModal from "@/components/DropletModal";
import { errorToast, ToasterProvider } from "@/components/ToasterProvider";
import FilesUploadingLoader from "@/components/FilesUploadingLoader";
import ImageViewer from "@/components/ImageViewer";
import VideoViewer from "@/components/VideoViewer";
import MoreOptionsModal from "@/components/MoreOptionsModal";
import RippleDrawer from "@/components/SwipeableRippleDrawer";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {

  const { toggleDarkMode, isUILoading, setIsUILoading } = UIStore();
  const { GetUserProfile, setProfileData } = UserStore();

  const originalConsoleError = console.error;

  console.error = (message, ...args) => {
    // Convert non-string messages to strings for safe handling
    const messageStr = typeof message === "string" ? message : JSON.stringify(message);

    // Handle specific network errors
    if (messageStr.includes("Failed to fetch") || messageStr.includes("AuthRetryableFetchError")) {
      errorToast("Network error. Please check your internet connection.");
      return; // Skip logging this error to console
    }

    // Handle extension-related errors (e.g., TempMail, Grammarly, etc.)
    if (messageStr.includes("autoCorrectionCache")) {
      console.warn("An extension might be causing this error: ", messageStr);
      return; // Skip logging this error to console
    }

    // Call the original console.error with its arguments for other cases
    originalConsoleError(message, ...args);
  };

  const setUserProfileData = async () => {
    try {
      const data = await GetUserProfile();
      console.log(data)
      setProfileData(data);
    } catch (error) { }
  }

  useEffect(() => {

    const cleanup = initializeTheme(toggleDarkMode);

    setUserProfileData();
    // Initialize theme and handle cleanup of event listeners
    return cleanup; // Cleanup event listener on component unmount

  }, []);

  return (
    <ErrorBoundary>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background dark:bg-d_background text-text_clr dark:text-d_text_clr `}
        >

          <QueryClientProvider client={queryClient} >


              {
                // isUILoading ?
                // <UILoader />
                // :
                <>
                  <ToasterProvider />
                  <DropletModal />
                  <ImageViewer />
                  <VideoViewer />
                  <FilesUploadingLoader />
                  {children}
                  <RippleDrawer />
                  <MoreOptionsModal />
                </>
              }
          </QueryClientProvider>
        </body>
      </html>
    </ErrorBoundary>
  );
}
