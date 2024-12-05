"use client";

import {
  Close,
  Delete,
  EditNoteRounded,
  EditRounded,
} from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { errorToast } from "./ToasterProvider";
import InputTextarea from "./InputTextArea";
import { UIStore } from "@/store/UIStore";
import { DropletStore } from "@/store/DropletStore";

const MoreOptionsModal = () => {
  const {
    isMoreOptionsModalOpen,
    setIsMoreOptionsModalOpen,
    contentToEdit,
    setContentToEdit,
    setRipplesRefreshId,
    setContentToEditType,
    contentToEditType,
    setDropletsRefreshId,
  } = UIStore();

  const { EditContent, DeleteContent } = DropletStore();

  const [isVisible, setIsVisible] = useState(false); // For opening animation
  const [isClosing, setIsClosing] = useState(false); // For closing animation
  const [isEdit, setIsEdit] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);

  useEffect(() => {
    if (isMoreOptionsModalOpen) {
      setIsVisible(true); // Trigger opening animation
    }
  }, [isMoreOptionsModalOpen]);

  const handleEditToggle = () => {
    if (!isEdit) {
      setIsEdit(true);
      setTimeout(() => setIsEditVisible(true), 50); // Slight delay for smooth entry
    } else {
      setIsEditVisible(false);
      setTimeout(() => {
        setIsEdit(false);
      }, 180); // Slight delay for smooth entry
    }
  };

  const handleClose = () => {
    setIsClosing(true); // Trigger closing animation
    setTimeout(() => {
      setIsMoreOptionsModalOpen(false); // Fully hide modal
      setContentToEdit("");
      setContentToEditType("");
      setIsEdit(false);
      setIsEditVisible(false);
      setIsClosing(false); // Reset closing state
      setIsVisible(false); // Reset visibility
    }, 500); // Match animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contentToEdit.trim().length === 0) {
      return errorToast("Ripple cannot be empty!");
    }
    const refreshId = await EditContent(contentToEdit);
    contentToEditType === "Ripple"
      ? setRipplesRefreshId(refreshId)
      : setDropletsRefreshId(refreshId);
    handleClose(); // Close modal after successful submission
  };

  return (
    <div>
      {isMoreOptionsModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-d_ternary bg-opacity-40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
            isClosing || !isVisible ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-[80%] max-w-[600px] m-auto border border-slate-700 shadow-md dark:shadow-sm bg-foreground dark:bg-d_foreground p-5 text-text_clr dark:text-d_text_clr rounded-2xl transform transition-all duration-500 ease-out ${
              isClosing || !isVisible
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <h1 className="text-xl">Options</h1>
              <Close
                onClick={handleClose}
                className="size-7 cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
              />
            </div>

            <div className="flex gap-2 sm:gap-5 my-4 justify-between items-center text-lg h-10">
              <button
                className="flex gap-2 justify-center items-center h-full w-full rounded-xl bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 hover:scale-105 transition-all active:scale-95"
                onClick={handleEditToggle}
              >
                <EditNoteRounded className="size-8" />
                <h1>Edit</h1>
              </button>
              <button
                className="flex gap-2 justify-center items-center h-full w-full rounded-xl text-rose-600 bg-foreground dark:bg-d_foreground shadow-sm shadow-blue-600 hover:scale-105 transition-all active:scale-95"
                onClick={async () => {
                  // Add delete logic here
                  await DeleteContent();
                  const refreshId = Math.random();
                  contentToEditType === "Ripple"
                    ? setRipplesRefreshId(refreshId)
                    : setDropletsRefreshId(refreshId);
                  handleClose();
                }}
              >
                <Delete className="size-6" />
                <h1>Delete</h1>
              </button>
            </div>

            {/* Edit Input with smooth animation */}
            <div
              className={`transition-all duration-500 ease-in-out transform ${
                isEditVisible ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {isEdit && (
                <InputTextarea
                  placeholder="Edit content"
                  handleSubmit={handleSubmit}
                  input={contentToEdit}
                  setInput={setContentToEdit}
                  minRows={2}
                  submitBtn={
                    <EditRounded className="absolute right-3 bottom-[18px] size-7 rounded-lg border border-slate-600 shado w-sm shadow-blue-500 p-[2px] -mb-1 -me-1 " />
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptionsModal;
