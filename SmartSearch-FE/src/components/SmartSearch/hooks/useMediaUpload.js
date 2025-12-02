import { useEffect, useRef, useState } from "react";
import { secondsToReadableTime } from "../util/func";
import { useToast } from "../../Toast/Toast";
import { useLocation, useNavigate } from "react-router-dom";
import { startUpload, getUploadStatus, getChatMedia } from "../services";
import { useAppWideContext } from "../../../App";
import { ImageTypes, VideoTypes } from "../util/constant";

// Utility to extract video duration
const getVideoDuration = (file) =>
  new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => reject(new Error("Failed to load video metadata"));
    video.src = window.URL.createObjectURL(file);
  });

/**
 * Reusable hook for media (videos and images) uploads with validation and state management.
 * @param {Object} params - Input parameters
 * @param {Function} params.setUploadedMedia - State setter for uploaded media
 * @param {Function} params.navigate - Navigation function to redirect to another page
 * @returns {Object} - Upload state and functions
 */
const useMediaUpload = ({ setUploadedMedia }) => {
  const { setUploadProgress } = useAppWideContext();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false); // Indicates background processing
  const [error, setError] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0); // Global elapsed time from APIs
  const timerRef = useRef(null);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const pollIndexerStatus = async (chatId) => {
    const maxPollingTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    const pollingInterval = 5 * 1000; // 5 seconds in milliseconds
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        try {
          const data = await getUploadStatus(chatId);
          const { status, progress, chatTitle, media } = data || {};

          if (media?.length > 0) {
            setUploadedMedia((prev) => {
              let newData = JSON.parse(JSON.stringify(prev));
              newData.media = prev?.media?.map((item) => {
                const mediaIndex = media?.findIndex(
                  (m) => m.name === item.name
                );
                if (mediaIndex !== -1) {
                  // Revoke the old blob URL to free memory
                  if (item.link && item.link.startsWith('blob:')) {
                    window.URL.revokeObjectURL(item.link);
                  }
                  return {
                    ...item,
                    mediaId: media[mediaIndex]?.mediaId,
                    link: media[mediaIndex]?.link, // Use backend link
                    completed: true,
                  };
                }
                return item;
              });
              return newData;
            });
          }

          if (status === "completed") {
            clearInterval(intervalId);
            resolve(chatTitle); // Return final elapsed time
          } else if (status === "failed") {
            clearInterval(intervalId);
            reject(new Error("Media processing failed"));
          } else if (Date.now() - startTime >= maxPollingTime) {
            clearInterval(intervalId);
            reject(new Error("Media processing timed out after 10 minutes"));
          }
        } catch (err) {
          clearInterval(intervalId);
          reject(err);
        }
      }, pollingInterval);

      // Cleanup on unmount or when promise resolves/rejects
      return () => clearInterval(intervalId);
    });
  };

  const uploadMedia = async ({
    files,
    showLoader = false,
    existingChatId = null,
    existingChatName = null,
  }) => {
    setError("");
    setLoading(true);
    setUploadProgress((prev) => ({
      ...prev,
      uploading: true,
      existing: existingChatId ? true : false,
      chatId: existingChatId,
      chatName: existingChatName,
    }));
    setProcessing(true); // Set processing to true at start
    const results = [];
    const mediaUrls = []; // Track URLs for cleanup

    try {
      if (!files || files.length === 0) {
        throw new Error("No files selected");
      }

      const validVideoTypes = VideoTypes;
      const validImageTypes = ImageTypes;
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      const maxDuration = 30 * 60; // 30 min in seconds
      const maxVideos = 5;
      const maxImages = 50;

      // Validate new media counts
      const newVideos = files.filter((f) =>
        validVideoTypes.includes(f.type)
      ).length;
      const newImages = files.filter((f) =>
        validImageTypes.includes(f.type)
      ).length;

      if (newVideos > maxVideos) {
        throw new Error(`Cannot upload more than ${maxVideos} videos.`);
      }
      if (newImages > maxImages) {
        throw new Error(`Cannot upload more than ${maxImages} images.`);
      }

      // Validate files and prepare media objects
      const mediaObjects = [];
      for (const file of files) {
        const isImage = validImageTypes.includes(file.type);
        const isVideo = validVideoTypes.includes(file.type);

        // Validate file type
        if (!isImage && !isVideo) {
          throw new Error(
            `Invalid format for ${file.name}. Use PNG, JPG, JPEG, MP4, or MOV.`
          );
        }

        // Validate file size
        if (file.size > maxSize) {
          throw new Error(`File ${file.name} exceeds 500MB.`);
        }

        let durationSeconds = 0;
        let duration = null;

        // Get duration for videos
        if (isVideo) {
          durationSeconds = await getVideoDuration(file);
          if (durationSeconds > maxDuration) {
            throw new Error(`Video ${file.name} exceeds 30 minutes.`);
          }
          duration = secondsToReadableTime(durationSeconds);
        }

        const mediaUrl = window.URL.createObjectURL(file);
        mediaUrls.push(mediaUrl); // Track for cleanup
        mediaObjects.push({
          link: mediaUrl,
          name: file.name,
          type: file.type,
          completed: false,
          mediaId: null,
          duration: isVideo ? duration : null,
          poster: isVideo ? file?.poster || null : null,
          durationSeconds: isVideo ? durationSeconds : null,
        });
      }

      const estimatedTime = newVideos * 60 + newImages * 10;
      setUploadedMedia((prev) => ({
        ...prev,
        estimatedTime,
        chatId: existingChatId || null,
        media: mediaObjects,
      }));

      if (showLoader)
        navigate("/smartSearch/loading", {
          state: {
            prevPath: location.pathname + location.search,
          },
        });

      // Prepare FormData for single API call
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append("files", file);
      });

      // Use service function instead of direct API call
      const data = await startUpload(formData, existingChatId);
      const { chatId } = data || {};

      if (!chatId) {
        throw new Error("Upload failed");
      }

      // Update media objects with uploadId
      const updatedMediaObjects = mediaObjects.map((media) => ({
        ...media,
        chatId,
      }));
      // Update state with the structured format
      setUploadedMedia((prev) => ({
        ...prev,
        chatId,
        media: updatedMediaObjects,
      }));

      // Poll for processing status if there are videos
      const chatTitle = await pollIndexerStatus(chatId);

      // Update results for all files
      for (const media of updatedMediaObjects) {
        results.push({ media, status: "success" });
      }

      setUploadedMedia((prev) => ({
        ...prev,
        chatName: chatTitle,
      }));
      setUploadProgress((prev) => ({
        ...prev,
        uploading: false,
        chatId,
        chatName: chatTitle,
      }));
      return results;
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        position: "top-right",
      });
      // Cleanup all URLs on error
      mediaUrls.forEach((url) => window.URL.revokeObjectURL(url));
      return results;
    } finally {
      setLoading(false);
      setProcessing(false); // Set processing to false when done
      setUploadProgress((prev) => ({
        ...prev,
        uploading: false,
      }));
      setTimeout(() => {
        setUploadedMedia((prev) => ({}));
      }, 3000);
    }
  };

  useEffect(() => {
    if (processing) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      return () => {
        clearInterval(timerRef.current);
        setElapsedTime(0);
      };
    }
  }, [processing]);

  return { uploadMedia, loading, error, elapsedTime, processing };
};

export default useMediaUpload;
