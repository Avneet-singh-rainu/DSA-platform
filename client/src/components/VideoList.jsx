// VideoList.js
import React, { memo } from "react";
import ReactPlayer from "react-player";

// VideoList component with React.memo to prevent unnecessary re-renders
const VideoList = memo(({ videoUrl }) => {
  return (
    <div className="lg:w-1/3 w-full h-64 lg:h-auto">
      {videoUrl ? (
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls={true}
        />
      ) : (
        <p className="text-gray-400">No video available</p>
      )}
    </div>
  );
});

export default VideoList;
