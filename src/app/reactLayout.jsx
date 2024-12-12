"use client";
import { useEffect } from "react";
import "./globals.css";
import UILoader from "@/components/UILoader";
import DropletModal from "@/components/DropletModal";
import { ToasterProvider } from "@/components/ToasterProvider";
import FilesUploadingLoader from "@/components/FilesUploadingLoader";
import ImageViewer from "@/components/ImageViewer";
import VideoViewer from "@/components/VideoViewer";
import MoreOptionsModal from "@/components/MoreOptionsModal";
import RippleDrawer from "@/components/SwipeableRippleDrawer";
import ErrorBoundary from "@/components/ErrorBoundary";
import ShareOptionsModal from "@/components/ShareOptionsModal";
import "./globals.css";
import { initializeTheme } from "@/utils/ThemeToggle";
import { errorToast } from "@/components/ToasterProvider";
import { UIStore } from "@/store/UIStore";
import { UserStore } from "@/store/UserStore";
import PageLoader from "@/components/PageLoader";
import { CssBaseline } from "@mui/material";
import ExpectedVersionModal from "@/components/ExpectedVersionModal";

const ReactLayout = ({ children }) => {
  const { toggleDarkMode, isUILoading, setIsUILoading, isPageLoading } =
    UIStore();
  const {
    fetchProfileData,
    subscribeToProfileChanges,
    setupSubscriptionsForProfileData,
    isProfileDataFetched,
    updateOnlineStatus,
  } = UserStore();

  const originalConsoleError = console?.error;

  console.error = (message, ...args) => {
    // Convert non-string messages to strings for safe handling
    const messageStr =
      typeof message === "string" ? message : JSON.stringify(message);

    // Handle specific network errors
    if (
      messageStr?.includes("Failed to fetch") ||
      messageStr?.includes("AuthRetryableFetchError")
    ) {
      errorToast("Network error. Please check your internet connection.");
      return; // Skip logging this error to console
    }

    // Handle extension-related errors (e.g., TempMail, Grammarly, etc.)
    if (messageStr?.includes("autoCorrectionCache")) {
      console.warn("An extension might be causing this error: ", messageStr);
      return; // Skip logging this error to console
    }

    // Call the original console.error with its arguments for other cases
    originalConsoleError(message, ...args);
  };

  useEffect(() => {
    const cleanup = initializeTheme(toggleDarkMode);
    return cleanup; // Cleanup event listener on component unmount
  }, [toggleDarkMode]);

  useEffect(() => {
    const subscribeToProfileData = async () => {
      await setupSubscriptionsForProfileData("user-profile");
    };
    subscribeToProfileData();
  }, [
    fetchProfileData,
    subscribeToProfileChanges,
    setupSubscriptionsForProfileData,
  ]);

  useEffect(() => {
    setInterval(() => {
      updateOnlineStatus(true);
    }, 1500);
    // Update to offline when user disconnects
    window.addEventListener("beforeunload", () => updateOnlineStatus(false));
  }, [updateOnlineStatus]);

  return (
    <ErrorBoundary>
        <>
          <CssBaseline />
          <ToasterProvider />
          <DropletModal />
          <ImageViewer />
          <VideoViewer />
          <FilesUploadingLoader />
          {children}
          <RippleDrawer />
          <ExpectedVersionModal />
          <MoreOptionsModal />
          <ShareOptionsModal />
          {isPageLoading && <PageLoader />}
        </>
    </ErrorBoundary>
  );
};

export default ReactLayout;
