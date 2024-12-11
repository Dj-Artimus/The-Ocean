"use client";
import Image from "next/image";
// import { supabase } from "@/lib/supabase";
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
import { ArrowBack } from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import InputTextarea from "@/components/InputTextArea";
import { UIStore } from "@/store/UIStore";
import { CommunicationStore } from "@/store/CommunicationStore";
import { UserStore } from "@/store/UserStore";

export default function ChatPage() {
  const router = useRouter();
  const {
    isMsgsOpen,
    setIsMsgsOpen,
    isOCardOpen,
    expectedVersion,
    setIsPageLoading,
    setContentToEdit,
    setContentEditId,
    setIsMoreOptionsModalOpen,
    setContentToEditType,
  } = UIStore();

  const {
    communicatorId,
    setCommunicatorId,
    setCommunicatorDetails,
    communicatorDetails,
    MarkMessagesAsRead,
    subscribeToMessages,
    SendMessage,
    FetchCommunicationMessages,
  } = CommunicationStore();

  const { profileData, subscribeToOnlineStatus, setOceaniteProfileData } =
    UserStore();

  const [messageInput, setMessageInput] = useState("");
  const [isMsgSending, setIsMsgSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const messagesRef = useRef(null);

  const handleClick = () => {
    console.log("communicatorId", communicatorId);
    console.log("communicatorDetails", communicatorDetails);
  };

  const handleSendMessage = async () => {
    setIsMsgSending(true);
    const send = await SendMessage(messageInput);
    console.log(" message sent successfully", send);
    setIsMsgSending(false);
    setMessageInput("");
  };

  useEffect(() => {
    setIsMsgsOpen(true);
  }, [setIsMsgsOpen]); // Add 'setIsMsgsOpen' as a dependency

  useEffect(() => {
    if (communicatorId) {
      MarkMessagesAsRead(communicatorId);
      const getMsgs = async () => {
        await FetchCommunicationMessages();
      };
      getMsgs();
    }
  }, [
    communicatorId,
    isMsgsOpen,
    MarkMessagesAsRead,
    FetchCommunicationMessages,
  ]); // Add all relevant dependencies

  const handleMoreOptionsClick = (msg) => {
    console.log("openig model..");
    setContentEditId(msg.id);
    setContentToEdit(msg.content);
    setContentToEditType("Message");
    setIsMoreOptionsModalOpen(true);
  };

  const scrollToBottom = useCallback(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesRef]);

  useEffect(() => {
    scrollToBottom();
    const messagesChannel = subscribeToMessages();
    return () => {
      if (messagesChannel) messagesChannel.unsubscribe();
    };
  }, [communicatorDetails, subscribeToMessages, scrollToBottom]); // Add 'subscribeToMessages' as a dependency

  useEffect(() => {
    if (!communicatorId) return;
    // Subscribe to online status
    const unsubscribe = subscribeToOnlineStatus(communicatorId, setIsOnline);
    // Cleanup on component unmount
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
            "fixed -bottom-2 pb-2 px-[2px] sm:me-1 lg:me-0 flex w-full sm:w-[74%] md:w-[79%] lg:w-[65.7%] xl:w-[51%] xl1:w-[51.2%] sm:rounded-t-2xl z-20 bg-primary dark:bg-d_primary border-t border-slate-700 translate-x-1/2 right-1/2 lg:right-[1%] lg:translate-x-0 xl:right-auto xl:left-[26.25%] xl1:left-[26.8%] lg:-top-[3px] lg:bottom-auto lg:rounded-b-2xl lg:pb-0 lg:rounded-t-none lg:border-b lg:border-t-0 justify-between overflow-y-hidden"
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
          <div className="my-3 border flex flex-col min-h-[50%] h-full bg-foreground overflow-x-hidden dark:bg-d_foreground shadow-sm shadow-blue-600 rounded-xl border-slate-700 customScrollbar"></div>
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
                    {expectedVersion && (
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
                        <div onClick={handleClick}>
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
              <div className="px-4 py-3 h-full w-full overflow-y-auto customScrollbar ">
                {/* MESSAGES START HERE  */}

                {communicatorDetails[communicatorId]?.messages?.length ===
                (0 || undefined) ? (
                  <div className=" w-full text-center text-2xl mt-10 text-slate-600 animate-pulse">
                    Say hi 👋 to start the conversation.{" "}
                  </div>
                ) : (
                  <div className="min-w-full flex flex-col">
                    {communicatorDetails[communicatorId]?.messages?.map((msg) =>
                      msg.sender_id === profileData.id ? (
                        <MessageSent
                          content={msg.content}
                          key={msg.id}
                          created_at={msg.created_at}
                          isRead={msg.is_read}
                          handleMoreOptionsClick={handleMoreOptionsClick}
                          msg={msg}
                        />
                      ) : (
                        <MessageReceived
                          key={msg.id}
                          content={msg.content}
                          created_at={msg.created_at}
                          isRead={msg.is_read}
                        />
                      )
                    )}
                  </div>
                )}

                {/* MESSAGES END HERE  */}

                <div
                  ref={messagesRef}
                  className="h-3 w-full my-4 float-start"
                ></div>
              </div>
            </div>
            <div className=" overflow-hidden rounded-xl flex-shrink-0 mb-3">
              <InputTextarea
                input={messageInput}
                setInput={setMessageInput}
                handleSubmit={handleSendMessage}
                isProcessing={isMsgSending}
                placeholder={"Write a Message..."}
              />
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
