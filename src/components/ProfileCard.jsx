import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ProfileCard = ({ avatar_url, name, wave }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-w-52 max-w-60 bg-foreground dark:bg-d_foreground p-2 rounded-lg items-center shadow-sm shadow-blue-700">
      <div className="flex-shrink-0">
        <img
          src={avatar_url}
          alt="profile"
          onClick={() => {
            router.push("/profile");
          }}
          className="size-28 my-2 rounded-xl shadow-sm shadow-blue-600 dark:shadow-blue-400 border-2 border-blue-500 "
        />
      </div>
      <h1
        className="font-semibold leading-non"
        onClick={() => {
          router.push("/profile");
        }}
      >
        {name}
      </h1>
      <p
        onClick={() => {
          router.push("/profile");
        }}
        className="text-[14px] text-text_clr2 dark:text-d_text_clr2 "
      >
        {wave}
      </p>
    </div>
  );
};

export default ProfileCard;
