import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CycloneIcon from "@mui/icons-material/Cyclone";

export const getPlatformIcon = (platform, styles) => {
    switch (platform) {
      case "ocean":
        return <CycloneIcon className={` cursor-pointer ${styles} `} />;
      case "linkedin":
        return <LinkedInIcon className={` cursor-pointer ${styles} `} />;
      case "facebook":
        return <FacebookIcon className={` cursor-pointer ${styles} `} />;
      case "instagram":
        return <InstagramIcon className={` cursor-pointer ${styles} `} />;
      case "x":
        return <XIcon sx={{width:"18px", height:"18px" }} className={` cursor-pointer ${styles} `} />;
      case "youtube":
        return <YouTubeIcon className={` cursor-pointer ${styles} `} />;
    }
  };