"use client";
import Button from "@/components/Button";
import { DropletStore } from "@/store/DropletStore";
import Droplet from "@/components/Droplet";
import {
  ConnectWithoutContactRounded,
  Diversity1,
  Explore,
  Surfing,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UIStore } from "@/store/UIStore";

const SharedDropletPage = ({ id }) => {
  const router = useRouter();
  const { GetSingleDroplet, sharedDropletData } = DropletStore();
  const { setIsShareOptionsModalOpen } = UIStore();
  console.log("id from react share", id);

  useEffect(() => {
    setIsShareOptionsModalOpen(false);
    const fetchDroplet = async () => {
      await GetSingleDroplet(id);
    };
    fetchDroplet();
  }, [GetSingleDroplet]);

  if (!sharedDropletData?.id)
    return (
      <div className=" w-full h-screen flex justify-center items-center text-3xl">
        <h1>No Droplet Found!</h1>
      </div>
    );
  return (
    <div className="">
      <div className="w-screen h-screen flex relative overflow-x-hidden overflow-y-auto">
        {/* MAIN CONTENT STARTS HERE */}
        <div
          className={`h-full w-full m-auto sm:w-3/4 md:w-[80%] xl:w-[63%] xl:pe-2 relative pe p-2`}
        >
          {/* GREETINGS SECTIONS STARTS HERE */}
          <div className=" lg:mt-14 flex flex-col gap-2 sm:gap-3">
            {/* OCEANITES FINDER AND CONNECTOR STARTS HERE */}
            <div className="bg-ternary dark:bg-blue-950 dark:bg-opacity-70 w-full items-center  p-3 px-4  rounded-2xl flex justify-between">
              <div className="text-lg flex flex-col sm:flex-row sm:gap-2">
                <div className="flex items-center gap-2">
                  <h1>Meet the Oceanites and</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Diversity1 />
                  <h1>Lets connect !</h1>
                </div>
              </div>
              <Button
                onClick={() => {
                  router.push("/oceanites");
                }}
                className="bg-blue-500 text-d_text_clr px-2 w-12 rounded-full h-8"
              >
                <ConnectWithoutContactRounded className="size-7" />
              </Button>
            </div>
            {/* OCEANITES FINDER AND CONNECTOR ENDS HERE */}
            {/* DROPLET DROPER GREETING STARTS HERE */}
            <div className="bg-ternary dark:bg-d_ternary w-full  p-3 px-4  items-center rounded-2xl flex justify-between">
              <div className="text-lg flex flex-col sm:flex-row sm:gap-2">
                <h1>Want More ?</h1>
                <h1>Lets explore the Ocean!</h1>
              </div>
              <Button
                onClick={() => {
                  router.push("/");
                }}
                className="bg-blue-500 text-d_text_clr px-2 rounded-full h-8"
              >
                <Surfing />
              </Button>
            </div>
            {/* DROPLET DROPER GREETING ENDS HERE */}
          </div>
          {/* GREETINGS SECTIONS ENDS HERE */}
          {/* DROPLETS START HERE */}
          <div>
            <Droplet
              key={sharedDropletData?.id}
              droplet_id={sharedDropletData?.id}
              author_id={sharedDropletData?.user_id?.id}
              avatar_url={sharedDropletData?.user_id?.avatar}
              authorData={sharedDropletData?.user_id}
              name={sharedDropletData?.user_id?.name}
              username={sharedDropletData?.user_id?.username}
              wave={sharedDropletData?.user_id?.wave}
              platform={sharedDropletData?.platform}
              time={sharedDropletData?.created_at}
              content={sharedDropletData?.content}
              images={sharedDropletData?.images}
              videos={sharedDropletData?.videos}
              stars={sharedDropletData?.stars}
              ripples={sharedDropletData?.ripples}
              redrops={sharedDropletData?.redrops}
            />
          </div>
          {/* DROPLETS ENDS HERE */}
          <div className="h-1 w-full my-20"></div>
        </div>
        {/* MAIN CONTENT ENDS HERE */}
      </div>
    </div>
  );
};

export default SharedDropletPage;
