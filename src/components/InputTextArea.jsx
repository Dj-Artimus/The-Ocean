import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import SendIcon from "@mui/icons-material/Send";
import "../app/globals.css";
import { Search } from "@mui/icons-material";
import { useState } from "react";

export default function InputTextarea({
  placeholder,
  submitBtn,
  input,
  setInput,
  handleSubmit,
  minRows
}) {
  const [isValidInput, setIsValidInput] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-xl -mb-[6px]">
      <TextareaAutosize
        className="font-sans pe-8 font-normal leading-5 p-4 rounded-xl shadow-md shadow-slate-100 dark:shadow-slate-900 focus:shadow-outline-purple dark:focus:shadow-outline-purple focus:shadow-lg border border-solid border-slate-500 hover:border-purple-500 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-500 dark:border-slate-600 bg-foreground dark:bg-d_foreground resize-none w-full overflow-x-hidden text-slate-900 dark:text-slate-300 focus-visible:outline-0 box-border customScrollbar placeholder:text-slate-700 "
        aria-label="Demo input"
        maxRows={5}
        minRows={minRows || 1}
        placeholder={placeholder}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setIsValidInput(Boolean(e.target.value.length));
        }}
      />
      <button
        disabled={!isValidInput}
        onClick={(e) => {
          handleSubmit(e);
        }}
        className={`${!isValidInput && "text-slate-600"} active:text-blue-600  `}
      >
        {submitBtn ? ( submitBtn
          // <Search className="absolute right-3 bottom-[18px] size-7" />
        ) : (
          <SendIcon className="absolute right-3 bottom-[18px] size-7" />
        )}
      </button>
    </div>
  );
}
