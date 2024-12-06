// "use client";
import Button from "@/components/Button";
import Droplet from "@/components/Droplet";
import { DropletStore } from "@/store/DropletStore";
import { ConnectWithoutContactRounded, Diversity1 } from "@mui/icons-material";
import { redirect } from "next/navigation";

export default async function DropletPage({ params }) {
  // const router = useRouter();
  const { id } = await params;
  const { GetSingleDroplet } = DropletStore();

  const droplet = await GetSingleDroplet(id);

  if (!droplet.id) {
    return {
      notFound: true, // Show a 404 page if the droplet is not found
    };
  }
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
                  <h1 className="text-sm sm:text-lg ">Looking for New</h1>{" "}
                  <h1>Oceanites ?</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Diversity1 />
                  <h1>Lets connect !</h1>
                </div>
              </div>
              <Button
                onClick={() => {
                  redirect("/oceanites");
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
                  redirect("/");
                }}
                className="bg-blue-500 text-d_text_clr px-2 rounded-full h-8"
              >
                Drop
              </Button>
            </div>
            {/* DROPLET DROPER GREETING ENDS HERE */}
          </div>
          {/* GREETINGS SECTIONS ENDS HERE */}
          {/* DROPLETS START HERE */}
          <div>
            <Droplet
              key={droplet?.id}
              droplet_id={droplet?.id}
              author_id={droplet?.user_id?.id}
              avatar_url={droplet?.user_id?.avatar}
              authorData={droplet?.user_id}
              name={droplet?.user_id?.name}
              username={droplet?.user_id?.username}
              wave={droplet?.user_id?.wave}
              platform={droplet?.platform}
              time={droplet?.created_at}
              content={droplet?.content}
              images={droplet?.images}
              videos={droplet?.videos}
              stars={droplet?.stars}
              ripples={droplet?.ripples}
              redrops={droplet?.redrops}
            />
          </div>
          {/* DROPLETS ENDS HERE */}
          <div className="h-1 w-full my-20"></div>
        </div>
        {/* MAIN CONTENT ENDS HERE */}
      </div>
    </div>
  );
}
