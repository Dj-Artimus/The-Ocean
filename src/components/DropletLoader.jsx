import { CycloneRounded } from "@mui/icons-material";

const DropletLoader = () => {
    return (
      <div className="absolute bg-slate-950 bg-opacity-10 w-full h-full backdrop-blur-[0.5px] rounded-3xl z-20 overflow-hidden flex justify-center">
        <div className="translate-y-14 mt-1 animate-pulse">
          <CycloneRounded className=" text-cyan-500 animate-spin  size-10" />
        </div>
      </div>
    );
  };

export default DropletLoader