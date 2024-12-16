"use client";

import { CommunicationStore } from "@/store/CommunicationStore";
import { UIStore } from "@/store/UIStore";
import { Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return <Toaster />;
};

export const successToast = (msg) => {
  toast.success(msg);
};

export const errorToast = (msg) => {
  toast.error(msg);
};

export const loadingToast = (msg) => {
  toast.loading(msg);
};

export const msgToast = (profile_id, name, avatar, message) => {
  toast.custom(
    (t) => (
      <MsgToastContent
        profile_id={profile_id}
        name={name}
        avatar={avatar}
        message={message}
      />
    ),
    { duration: 2000, icon: "💭" }
  );
};

const MsgToastContent = ({ profile_id, name, avatar, message }) => {
  const router = useRouter();
  const { setCommunicatorId } = CommunicationStore();
  const { setIsMsgsOpen } = UIStore();

  return (
    <div className="max-w-md w-full px-2">
      <div
        className={`
        bg-secondary dark:bg-d_secondary border border-blue-500 shadow-blue-500 shadow rounded-full pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-2">
          <div
            className="flex items-center ps-[5px]"
            onClick={() => {
              setTimeout(() => {
                setCommunicatorId(profile_id);
                setIsMsgsOpen(false);
              }, 500);
              router.push("/chat");
            }}
          >
            <div className="flex-shrink-0 ">
              <img
                className="h-10 w-10 rounded-full border border-slate-500"
                src={avatar}
                alt={name}
              />
            </div>
            <div className="ml-3 flex-1 text-text_clr dark:text-d_text_clr">
              <p className="text-lg font-semibold -my-1">{name}</p>
              <p className="text-slate-900 dark:text-slate-100 line-clamp-1">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg px-3 flex items-center justify-center text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Close sx={{ width: "30px", height: "30px" }} />
          </button>
        </div>
      </div>
    </div>
  );
};
