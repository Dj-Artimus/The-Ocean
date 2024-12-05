
import { UIStore } from "@/store/UIStore";
import { Close, ArrowForwardIosRounded } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

// Example images array (for testing)

const VideoViewer = () => {
  const { vidViewerSources, vidViewerIndex, setVidViewerSources, setVidViewerIndex } = UIStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  useEffect(() => {
    if (vidViewerSources.length > 0) {
      setIsVisible(true); // Trigger open animation when there are images
    }
  }, [vidViewerSources]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setVidViewerSources([]);
    }, 500); // Animation duration
  };

  const goToNext = () => {
    setVidViewerIndex((vidViewerIndex + 1) % vidViewerSources.length);
  };

  const goToPrev = () => {
    setVidViewerIndex(
        (vidViewerIndex - 1 + vidViewerSources.length) % vidViewerSources.length
    );
  };

  return (
    <>
      {isVisible && vidViewerSources.length > 0 && (
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
            {vidViewerSources.length > 1 && (
              <button
                onClick={goToPrev}
                className="absolute left-2 z-10 bg-slate-600 text-white rounded-full p-1 pe-[7px] shadow shadow-slate-900 flex justify-center items-center transition-transform transform hover:scale-110 bg-opacity-50"
              >
                <ArrowForwardIosRounded className=" rotate-180 size-5 " />
              </button>
            )}

            {/* Image */}
            <div>
              <video
                src={vidViewerSources[vidViewerIndex]?.split('<|>')[0]}
                controls
                autoPlay
                alt={`Image ${vidViewerIndex + 1}`}
                className={`max-w-[90vw] max-h-[90vh] object-contain shadow-slate-500 border border-slate-700 rounded-md shadow-sm transition-transform duration-500 ease-out ${
                  isClosing ? "scale-90 opacity-0" : "scale-100 opacity-100"
                }`}
              />

              <div className="flex justify-center mt-2 space-x-2">
                {vidViewerSources.length > 1 &&
                  vidViewerSources.map((_, index) => (
                    <span
                      key={index}
                      onClick={() => setVidViewerIndex(index)}
                      className={`h-2 w-2 rounded-full cursor-pointer ${
                        index === vidViewerIndex ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
              </div>
            </div>

            {/* Next Button */}
            {vidViewerSources.length > 1 && (
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

export default VideoViewer;
