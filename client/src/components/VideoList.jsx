// VideoList.js
import React, { memo } from "react";
import ReactPlayer from "react-player";

// VideoList component with React.memo to prevent unnecessary re-renders
const VideoList = ({ videoUrl }) => {
    return (
        <div className="w-full h-full">
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
};

export default VideoList;
