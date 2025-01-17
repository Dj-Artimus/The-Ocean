"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import LeftSideBar from "@/components/LeftSideBar";
import RightSideBar from "@/components/RightSideBar";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import "../globals.css";
import MessageSent from "@/components/MessageSent";
import MessageReceived from "@/components/MessageReceived";
import {
  AddCircle,
  ArrowBack,
  CycloneRounded,
  Forum,
  Houseboat,
  ImageRounded,
  Movie,
} from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import InputTextarea from "@/components/InputTextArea";
import { UIStore } from "@/store/UIStore";
import { CommunicationStore } from "@/store/CommunicationStore";
import { UserStore } from "@/store/UserStore";
import { errorToast } from "@/components/ToasterProvider";
import { debounce } from "lodash";

/**
 * The main chat page for the app.
 * Handles the main chat window, messages, and attachments.
 * The main chat page element.
 */
export default function ChatPage() {
  const router = useRouter();
  const {
    isMsgsOpen,
    setIsMsgsOpen,
    isOCardOpen,
    oceanVision,
    setIsPageLoading,
    setContentToEdit,
    setContentEditId,
    setIsMoreOptionsModalOpen,
    setContentToEditType,
    setIsMediaFileUploading,
    isProcessing,
    setIsProcessing,
    setImgViewerSources,
    setVidViewerSources,
    setVidViewerIndex,
    setImgViewerIndex,
  } = UIStore();

  const {
    communicatorId,
    setCommunicatorId,
    communicatorDetails,
    MarkMessagesAsRead,
    SendMessage,
    FetchCommunicationMessages,
    setUnreadMsgsCountRefresher,
  } = CommunicationStore();

  const {
    profileData,
    subscribeToOnlineStatus,
    setOceaniteProfileData,
    UploadMedia,
  } = UserStore();

  const [isMediaAttacherOpen, setIsMediaAttacherOpen] = useState(false);

  const [isMsgSending, setIsMsgSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messageImages, setMessageImages] = useState([]);
  const [messageVideos, setMessageVideos] = useState([]);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [isOnline, setIsOnline] = useState(false);

  const messagesRef = useRef(null);
  const messagesBottomRef = useRef(null);
  const selectImages = useRef();
  const selectVideos = useRef();

  const revokeURLs = () => {
    if (messageImages) {
      messageImages.forEach((image) => {
        if (image.source) URL.revokeObjectURL(image.source);
      });
    }

    if (messageVideos) {
      messageVideos.forEach((video) => {
        if (video.source) URL.revokeObjectURL(video.source);
      });
    }
  };

  const handleFileChange = async (e, type) => {
    if (type === "images") {
      setMessageImages([]);
    } else {
      setMessageVideos([]);
    }
    const files = Array.from(e.target.files);
    if (!files?.length) return;

    const updatedFiles = files.map((file) => ({
      source: URL.createObjectURL(file),
      file,
      path: null,
      storageBucket: type === "images" ? "messages_Images" : "messages_Videos",
    }));

    if (type === "images") {
      setMessageImages((prev) => [...prev, ...updatedFiles]);
    } else if (type === "videos") {
      setMessageVideos((prev) => [...prev, ...updatedFiles]);
    }
  };

  const handleSendMessage = async () => {
    setIsMsgSending(true);
    setIsMediaFileUploading(true);

    const images = await UploadMedia(messageImages, setMessageImages);
    const videos = await UploadMedia(messageVideos, setMessageImages);

    setIsMediaFileUploading(false);

    const isSend = await SendMessage({
      content: messageInput.trim(),
      images: images?.map((img) => `${img.url}<|>${img.path}`) || [],
      videos: videos?.map((vid) => `${vid.url}<|>${vid.path}`) || [],
    });

    if (isSend) {
      revokeURLs();
      setMessageImages([]);
      setMessageVideos([]);
    } else {
      errorToast("Failed to send the message.");
    }
    setIsMsgSending(false);
    setMessageInput("");
  };

  const handleMoreOptionsClick = (msg) => {
    setContentEditId(msg.id);
    setContentToEdit(msg.content);
    setContentToEditType("Message");
    setIsMoreOptionsModalOpen(true);
  };

  useEffect(() => {
    !communicatorId && setIsMsgsOpen(true);
  }, [setIsMsgsOpen, communicatorId]);

  useEffect(() => {
    if (communicatorId) {
      const handleMsgs = async () => {
        await MarkMessagesAsRead(communicatorId);
        return await FetchCommunicationMessages();
      };
      handleMsgs();
    }
  }, [
    communicatorId,
    isMsgsOpen,
    MarkMessagesAsRead,
    FetchCommunicationMessages,
  ]);

  const scrollToBottom = useCallback(() => {
    messagesBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [communicatorId, messagesBottomRef]);

  useEffect(() => {
    if (communicatorId && communicatorDetails[communicatorId]?.messages) {
      scrollToBottom();
    }
  }, [communicatorId, communicatorDetails, scrollToBottom]);

  const handleScroll = useCallback(
    debounce(async () => {
      const element = messagesRef.current;
      if (element) {
        const { scrollTop } = element;

        if (scrollTop === 0 && !isLoadingOlderMessages && hasMore) {
          setIsLoadingOlderMessages(true);

          const olderMessages = await FetchCommunicationMessages();

          if (olderMessages?.length) {
            const currentHeight = messagesRef.current.scrollHeight;

            setTimeout(() => {
              const newScrollHeight = messagesRef.current.scrollHeight;
              messagesRef.current.scrollTop = newScrollHeight - currentHeight;
            }, 100); // Adjust the delay if necessary
          }
          // Update pagination state
          if (olderMessages?.length < 12) setHasMore(false); // No more older messages

          setIsLoadingOlderMessages(false);
        }
      }
    }, 300),
    [FetchCommunicationMessages, isLoadingOlderMessages, hasMore]
  );

  useEffect(() => {
    const element = messagesRef.current;

    if (!element) {
      console.warn("messagesRef is not yet initialized.");
      return;
    }

    const listener = debounce(handleScroll, 1000);
    element.addEventListener("scroll", listener);

    return () => {
      element.removeEventListener("scroll", listener);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!communicatorId) return;
    const unsubscribe = subscribeToOnlineStatus(communicatorId, setIsOnline);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [communicatorId, subscribeToOnlineStatus]);

  return (
    <div className="w-screen flex h-screen relative overflow-hidden">
      {/* NAVIGATION BAR STARTS HERE */}
      {isMsgsOpen && (
        <Navbar
          navStyle={
            "fixed lg:hidden -bottom-2 pb-2 px-[2px] sm:me-1 lg:me-0 flex w-full sm:w-[74%] md:w-[79%] lg:w-[65.7%] xl:w-[51%] xl1:w-[51.5%] sm:rounded-t-2xl z-20 bg-primary dark:bg-d_primary border-t border-slate-700 translate-x-1/2 right-1/2 lg:right-[0.3%] lg:translate-x-0 xl:right-auto xl:left-[26.25%] xl1:left-[27.2%] lg:-top-[3px] lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
          }
        />
      )}
      {/* NAVIGATION BAR ENDS HERE */}

      {(isMsgsOpen || isOCardOpen) && (
        <div
          onClick={() => {
            setCommunicatorId("");
            router.push("/");
          }}
          className="fixed top-[1px] left-[1px] z-30 bg-blue-500 dark:bg-blue-700 bg-opacity-50 backdrop-blur-sm rounded-tl-none rounded-xl p-[2px] cursor-pointer lg:hidden"
        >
          <ArrowBack
            sx={{
              width: "30px",
              height: "30px",
            }}
            className="size-7"
          />
        </div>
      )}

      {/* LEFT SIDE BAR STARTS HERE */}

      <LeftSideBar />

      {/* LEFT SIDE BAR ENDS HERE */}

      {/* MAIN CONTENT STARTS HERE */}

      <div className="h-full relative overflow-x-hidden bg-background dark:bg-d_background lg:bg-transparent flex flex-col w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 p-2 pt-0 lg:pt-[6px] ">
        {!communicatorId ? (
          <div className="my-3 border flex flex-col justify-center min-h-[50%] h-full bg-background overflow-x-hidden dark:bg-d_background shadow-sm shadow-blue-600 rounded-xl border-slate-700 customScrollbar">
            {/* Empty State */}

            <div
              className="left-1/2 -translate-x-1/2  absolute top-10"
              onClick={() => router.push("/")}
            >
              <Houseboat className="!w-12 !h-12 hover:text-blue-500 hover:scale-105 active:scale-95 transition-transform duration-300 " />
            </div>

            <div className="flex flex-col items-center animate-pulse justify-center text-center text-gray-500 dark:text-gray-300">
              <div className="mb-4">
                <Forum className="!w-48 !h-48" />
              </div>
              <p className="text-lg font-medium">
                Select a HarborMate to start chatting
              </p>
              <p className="text-sm mt-2 text-gray-400">
                Pick a conversation from the left to begin.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="my-3 border flex flex-col min-h-[50%] h-[90%] bg-foreground overflow-x-hidden dark:bg-d_foreground shadow-sm shadow-blue-600 rounded-xl border-slate-700 customScrollbar">
              {/* HEADING BAR STARTS HERE */}
              <div className=" bg-foreground dark:bg-d_foreground rounded-t-3xl shadow-md shadow-foreground dark:shadow-d_foreground">
                <div className="flex items-center w-full  px-3 pt-1  justify-between">
                  <div className="flex gap-2 w-full">
                    <div className="flex-shrink-0">
                      <img
                        src={
                          communicatorDetails[communicatorId]?.avatar?.split(
                            "<|>"
                          )[0]
                        }
                        alt="profile"
                        className="size-12 my-2 rounded-xl border-2 border-slate-500"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setOceaniteProfileData(
                          communicatorDetails[communicatorId]
                        );
                        setIsPageLoading(true);
                        router.push("/oceanite-profile");
                      }}
                      className="mx-1 leading-snug mt-[9px] w-full cursor-pointer hidden xs:block"
                    >
                      <div className="flex justify-center flex-col w-full">
                        <h1 className="font-semibold leading-non  max-w-[80%] truncate">
                          {communicatorDetails[communicatorId]?.name}
                        </h1>
                        {isOnline ? (
                          <p className="text-[14px] truncate  max-w-[80%] text-blue-700 dark:text-blue-400">
                            online
                          </p>
                        ) : (
                          <p className="text-[14px] truncate  max-w-[80%] text-slate-800 dark:text-slate-400">
                            offline
                          </p>
                        )}
                        {/* <h1 className="text-text_clr2 dark:text-d_text_clr2">4h ago</h1> */}
                      </div>
                    </div>
                  </div>
                  <div className="xs1:flex gap-2 sm:gap-3 lg:gap-4 translate-x-1 items-center rounded-xl font-semibold hidden ">
                    <div
                      onClick={() => {
                        setCommunicatorId("");
                        setUnreadMsgsCountRefresher(new Date().getTime());
                        revokeURLs();
                        setIsMsgsOpen(true);
                      }}
                      className="mb-1 me-1 lg:hidden cursor-pointer"
                    >
                      <ArrowBack
                        title="Back"
                        sx={{
                          width: "30px",
                          height: "30px",
                        }}
                        className="size-7 hover:text-blue-500 "
                      />
                    </div>
                    <div
                      onClick={() => {
                        setCommunicatorId("");
                        setUnreadMsgsCountRefresher(new Date().getTime());
                        revokeURLs();
                        router.push("/");
                      }}
                      className="mb-1 hidden lg:block cursor-pointer"
                    >
                      <ArrowBack
                        sx={{
                          width: "30px",
                          height: "30px",
                        }}
                        title="Back"
                        className="size-7 hover:text-blue-500 "
                      />
                    </div>
                    {oceanVision && (
                      <>
                        {" "}
                        <VoiceChatIcon
                          title="VoiceChat"
                          className="size-7 hidden xs2:block hover:text-blue-500 cursor-pointer"
                        />
                        <VideoChatIcon
                          title="VideoChat"
                          className="size-7 hidden xs2:block hover:text-blue-500 cursor-pointer"
                        />
                        <div>
                          <MoreVertRoundedIcon
                            title="VideoChat"
                            className="size-7 hover:text-blue-500 mb-1 cursor-pointer"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {/* HEADING BAR ENDS HERE */}
                </div>
                <hr className="mx-4 mt-[2px] border-slate-700" />
              </div>
              <div
                ref={messagesRef}
                className="px-4 py-3 h-full w-full overflow-y-auto customScrollbar "
              >
                {/* MESSAGES START HERE  */}

                {communicatorDetails[communicatorId]?.messages?.length ===
                (0 || undefined) ? (
                  <div className=" w-full text-center text-2xl mt-10 text-slate-600 animate-pulse">
                    Say hi 👋 to start the conversation.
                  </div>
                ) : (
                  <div className="flex flex-col-reverse w-full">
                    {communicatorDetails[communicatorId]?.messages?.map((msg) =>
                      msg.sender_id === profileData.id ? (
                        <MessageSent
                          key={msg.id}
                          id={msg.id}
                          content={msg.content}
                          images={msg.images}
                          videos={msg.videos}
                          created_at={msg.created_at}
                          isRead={msg.is_read}
                          handleMoreOptionsClick={handleMoreOptionsClick}
                          msg={msg}
                        />
                      ) : (
                        <MessageReceived
                          key={msg.id}
                          id={msg.id}
                          content={msg.content}
                          images={msg.images}
                          videos={msg.videos}
                          created_at={msg.created_at}
                          isRead={msg.is_read}
                        />
                      )
                    )}
                    {isLoadingOlderMessages && (
                      <div className="animate-pulse w-full flex justify-center items-center">
                        <CycloneRounded className="animate-spin size-8" />
                      </div>
                    )}
                  </div>
                )}
                {/* MESSAGES END HERE  */}

                <div
                  ref={messagesBottomRef}
                  className="h-3 w-full my-4 float-start"
                ></div>
              </div>
            </div>
            <div className=" overflow-hidden rounded-xl flex-shrink-0 mb-3 flex items-center gap-2">
              <div className="">
                <div
                  className={`absolute bottom-0 flex gap-1 xs1:gap-2 xs2:gap-4 text-slate-800 dark:text-slate-200 bg-blue-600 bg-opacity-40 backdrop-blur-md rounded-lg p-2 pt-14 transition-all duration-500 ${
                    isMediaAttacherOpen
                      ? "scale-100 -translate-y-24 translate-x-[11px] opacity-100"
                      : "scale-0 opacity-0 -translate-x-10"
                  } `}
                >
                  <div className="relative">
                    {messageImages[0]?.source && (
                      <img
                        alt="attached img"
                        src={messageImages[0]?.source}
                        onClick={() => {
                          const images = messageImages.map((img) => {
                            return img.source;
                          });
                          setImgViewerSources(images);
                          setImgViewerIndex(0);
                        }}
                        className=" absolute rounded-md h-10 bottom-12 right-1/2 translate-x-1/2"
                      />
                    )}
                    <ImageRounded
                      sx={{
                        width: "44px",
                        height: "44px",
                      }}
                      onClick={() => {
                        selectImages.current.click();
                      }}
                    />
                    <input
                      ref={selectImages}
                      type="file"
                      multiple
                      name="images"
                      accept="image/*" // Allow only images
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "images")}
                    />
                  </div>
                  <div className="relative">
                    {messageVideos[0]?.source && (
                      <video
                        src={messageVideos[0]?.source}
                        onClick={() => {
                          const videos = messageVideos.map((vid) => {
                            return vid.source;
                          });
                          setVidViewerSources(videos);
                          setVidViewerIndex(0);
                        }}
                        controls={false}
                        className=" absolute rounded-lg h-10 bottom-12 right-1/2 translate-x-1/2"
                      />
                    )}
                    <Movie
                      onClick={() => {
                        selectVideos.current.click();
                      }}
                      sx={{
                        width: "44px",
                        height: "44px",
                      }}
                    />
                    <input
                      ref={selectVideos}
                      type="file"
                      multiple
                      name="videos"
                      accept="video/*" // Allow only images
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "videos")}
                    />
                  </div>
                </div>
                <div
                  className="text-blue-500"
                  onClick={() => {
                    setIsMediaAttacherOpen(!isMediaAttacherOpen);
                    if (isMediaAttacherOpen) {
                      revokeURLs();
                      setMessageImages([]);
                      setMessageVideos([]);
                    }
                  }}
                >
                  <AddCircle
                    sx={{
                      width: "36px",
                      height: "36px",
                      marginLeft: "2px",
                    }}
                  />
                </div>
              </div>
              <div className="w-full">
                <InputTextarea
                  input={messageInput}
                  setInput={setMessageInput}
                  handleSubmit={handleSendMessage}
                  isProcessing={isMsgSending}
                  placeholder={"Write a Message..."}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {/* MAIN CONTENT ENDS HERE */}

      {/* RIGHT SIDE BAR STARTS HERE */}

      <RightSideBar />

      {/* RIGHT SIDE BAR ENDS HERE */}
    </div>
  );
}
