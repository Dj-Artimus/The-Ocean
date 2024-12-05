
import { UIStore } from "@/store/UIStore";
import { Close, ArrowForwardIosRounded } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

// Example images array (for testing)

const ImageViewer = () => {
  const {
    imgViewerSources,
    imgViewerIndex,
    setImgViewerSources,
    setImgViewerIndex,
  } = UIStore();
  // const [imgViewerIndex, setImgViewerIndex] = useState(imgViewerIndex);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    if (imgViewerSources.length > 0) {
      setIsVisible(true); // Trigger open animation when there are images
    }
  }, [imgViewerSources]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setImgViewerSources([]);
    }, 500); // Animation duration
  };

  const goToNext = () => {
    setImgViewerIndex((imgViewerIndex + 1) % imgViewerSources.length);
  };

  const goToPrev = () => {
    setImgViewerIndex(
      (imgViewerIndex - 1 + imgViewerSources.length) % imgViewerSources.length
    );
  };

  // Swipe handlers
  const swipeHandlersForImages = useSwipeable({
    onSwipedLeft: () => goToPrev() ,
    onSwipedRight: () => goToNext() ,
  });

  return (
    <>
      {isVisible && imgViewerSources.length > 0 && (
        <div
          className={`w-screen h-screen fixed z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 bg-slate-600 text-white bg-opacity-50 rounded-full p-[2px] transition-transform transform hover:scale-110"
            >
              <Close className="size-6" />
            </button>

            {/* Previous Button */}
            {imgViewerSources.length > 1 && (
              <button
                onClick={goToPrev}
                className="absolute left-2 z-10 bg-slate-600 text-white rounded-full p-1 pe-[7px] shadow shadow-slate-900 flex justify-center items-center transition-transform transform hover:scale-110 bg-opacity-50"
              >
                <ArrowForwardIosRounded className=" rotate-180 size-5 " />
              </button>
            )}

            {/* Image */}
            <div>
              <img
                src={imgViewerSources[imgViewerIndex]?.split("<|>")[0]}
                alt={`Image ${imgViewerIndex + 1}`}
                {...swipeHandlersForImages } 
                className={`max-w-[90vw] max-h-[90vh] object-contain shadow-slate-500 border border-slate-700 rounded-md shadow-sm transition-transform duration-500 ease-out ${
                  isClosing ? "scale-90 opacity-0" : "scale-100 opacity-100"
                }`}
              />

              <div className="flex justify-center mt-2 space-x-2">
                {imgViewerSources.length > 1 &&
                  imgViewerSources.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setImgViewerIndex(index)}
                      className={`h-2 w-2 rounded-full cursor-pointer ${
                        index === imgViewerIndex ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
              </div>
            </div>

            {/* Next Button */}
            {imgViewerSources.length > 1 && (
              <button
                onClick={goToNext}
                className="absolute right-2 z-10 bg-slate-600 text-white shadow shadow-slate-900 rounded-full p-1 ps-[7px] transition-transform flex justify-center items-center transform hover:scale-110 bg-opacity-50"
              >
                <ArrowForwardIosRounded className="size-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewer;
