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
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import OceanVisionModal from "@/components/OceanVisionModal";
import { CommunicationStore } from "@/store/CommunicationStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NavigationStore } from "@/store/NavigationStore";
import toast from "react-hot-toast";

const ReactLayout = ({ children }) => {
  const {
    toggleDarkMode,
    isUILoading,
    setIsUILoading,
    isPageLoading,
    darkModeOn,
  } = UIStore();
  const {
    fetchProfileData,
    subscribeToProfileChanges,
    setupSubscriptionsForProfileData,
    isProfileDataFetched,
    updateOnlineStatus,
  } = UserStore();

  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Get the Next.js router (useRouter from next/navigation)

  const { history, currentIndex, AddPageToHistory, GoBack, GoForward } =
    NavigationStore();
  const { subscribeToMessages } = CommunicationStore();

  useEffect(() => {
    const originalConsoleError = console?.error;

    console.error = (...args) => {
      const [firstArg, ...restArgs] = args;

      // Check for bugs such as null pointer references, unhandled exceptions, and more
      if (firstArg instanceof Error) {
        const { message, stack } = firstArg;
        const messageStr =
          typeof message === "string" ? message : JSON.stringify(message);

        // Handle specific network errors
        if (
          messageStr?.includes("Failed to fetch") ||
          messageStr?.includes("AuthRetryableFetchError")
        ) {
          toast.error("Network error. Please check your internet connection.");
          return; // Skip logging this error to console
        }

        // Handle extension-related errors (e.g., TempMail, Grammarly, etc.)
        if (messageStr?.includes("autoCorrectionCache")) {
          console.warn(
            "An extension might be causing this error: ",
            messageStr
          );
          return; // Skip logging this error to console
        }

        // Log the error with its stack trace
        originalConsoleError(firstArg, stack, ...restArgs);
      } else {
        // Call the original console.error with its arguments for other cases
        originalConsoleError(firstArg, ...restArgs);
      }
    };
  });

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

  useEffect(() => {
    const messagesChannel = subscribeToMessages();
    return () => {
      if (messagesChannel) messagesChannel.unsubscribe();
    };
  }, [subscribeToMessages]);

  // Add page to history when navigating
  useEffect(() => {
    const page = {
      pathname,
    };
    AddPageToHistory(page);
  }, [pathname, AddPageToHistory]);

  // Handle browser popstate event (back/forward buttons)
  useEffect(() => {
    const onPopState = () => {
      if (history.length > 0) {
        if (currentIndex > 0) {
          GoBack();
          router.push(history[currentIndex - 1].pathname); // Use router.push for navigation
        } else {
          router.push("/"); // Fallback to home page if history is empty
        }
      }
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [history, currentIndex, GoBack, router]);

  // Handle custom mobile back button behavior for PWAs (standalone mode)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMobileBackButton = (event) => {
        // Prevent app exit or closing on back press
        event.preventDefault();
        if (history.length > 1 && currentIndex > 0) {
          GoBack();
          router.push(history[currentIndex - 1].pathname); // Use router.push for navigation
        } else {
          router.push("/"); // Navigate to home if history is empty
        }
      };

      // On Android in standalone mode (PWA), listen for back button
      window.addEventListener("popstate", handleMobileBackButton);

      return () => {
        window.removeEventListener("popstate", handleMobileBackButton);
      };
    }
  }, [history, currentIndex, GoBack, router]);

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
        <OceanVisionModal />
        <MoreOptionsModal />
        <ShareOptionsModal />
        {isPageLoading && <PageLoader />}
      </>
    </ErrorBoundary>
  );
};

export default ReactLayout;
