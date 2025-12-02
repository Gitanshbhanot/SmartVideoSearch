import React, { useRef, useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

const VideoSegmentPlayer = ({
  videoUrl,
  startTime,
  endTime,
  loop = true,
  className,
  props,
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    // Reset loading state when video URL changes
    setIsLoading(true);

    // Set initial time to startTime
    video.currentTime = startTime;

    // Event listener to enforce endTime
    const handleTimeUpdate = () => {
      if (video.currentTime >= endTime) {
        if (loop) {
          video.currentTime = startTime; // Reset to startTime if looping
          video.play(); // Continue playing
        } else {
          video.pause(); // Pause at endTime
        }
      }
    };

    // Event listener to ensure video doesn't start before startTime
    const handlePlay = () => {
      if (video.currentTime < startTime) {
        video.currentTime = startTime;
      }
    };

    // Event listener for when video data is loaded
    const handleLoadedData = () => {
      setIsLoading(false);
    };

    // Add event listeners
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("loadeddata", handleLoadedData);

    // Cleanup event listeners on unmount
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [startTime, endTime, loop, videoUrl]);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
          className="absolute inset-0"
          animation="pulse"
        />
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        muted
        playsInline
        {...props}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-150 rotate-0 w-full h-full`}
      />
    </div>
  );
};

const MediaPlayer = ({
  className = "",
  link = "",
  type = "image",
  startTime = null,
  endTime = null,
  noClip = false,
  controls = false,
  props = {},
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when link changes
  useEffect(() => {
    if (link) {
      setIsLoading(true);
    }
  }, [link]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const renderMedia = () => {
    if (!link) {
      return (
        <img
          src={"/smartSearch/noMedia.svg"}
          alt="No Media"
          className={className}
          {...props}
          onLoad={() => setIsLoading(false)}
        />
      );
    } else if (type?.includes("image")) {
      return (
        <div className={`relative ${className}`}>
          {isLoading && (
            <Skeleton
              variant="rounded"
              width="100%"
              height="100%"
              className="absolute inset-0"
              animation="pulse"
            />
          )}
          <img
            src={link}
            alt="Media"
            className={`${className} ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-150 rotate-0 w-full h-full`}
            {...props}
            onLoad={handleImageLoad}
            onError={() => setIsLoading(false)}
          />
        </div>
      );
    } else if (type?.includes("video")) {
      if ((!startTime && !endTime) || noClip) {
        return (
          <div className={`relative ${className}`}>
            {isLoading && (
              <Skeleton
                variant="rounded"
                width="100%"
                height="100%"
                className="absolute inset-0"
                animation="pulse"
              />
            )}
            <video
              src={link}
              className={`${className} ${
                isLoading ? "opacity-0" : "opacity-100"
              } transition-opacity duration-150 rotate-0 w-full h-full`}
              muted
              controls={controls}
              playsInline
              {...props}
              onLoadedData={handleVideoLoad}
              onError={() => setIsLoading(false)}
            />
          </div>
        );
      } else {
        return (
          <VideoSegmentPlayer
            videoUrl={link}
            startTime={startTime}
            endTime={endTime}
            className={className}
            {...props}
          />
        );
      }
    } else if (type === "audio") {
      return <audio src={link} className={className} {...props} />;
    } else if (type === "pdf") {
      return <iframe src={link} className={className} {...props} />;
    } else if (type === "doc") {
      return <iframe src={link} className={className} {...props} />;
    }
  };

  return renderMedia();
};

export default MediaPlayer;
