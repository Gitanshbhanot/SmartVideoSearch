import {
  Image01Icon,
  Video01Icon,
  VideoReplayIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Divider,
  Grow,
  LinearProgress,
  Skeleton,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import MediaPlayer from "./MediaPlayer";
import { deleteMedia } from "../services";
import { cn } from "../../Ascternity/utils";
import UploadCard from "./UploadCard";
import { allowedFileTypes } from "../util/constant";
import { useControllerContext } from "../Controller";
import DeleteButton from "./DeleteButton";
import { useWindowSize } from "@uidotdev/usehooks";

const MediaCard = ({
  link,
  type,
  mediaId,
  name,
  chatId,
  setMedia,
  completed,
}) => {
  const icon = type?.includes("image") ? Image01Icon : Video01Icon;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await deleteMedia({
      chatId,
      mediaId,
      callback: () => {
        setMedia((prev) => prev.filter((m) => m.mediaId !== mediaId));
      },
    });
    setLoading(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        completed ? "" : "pointer-events-none cursor-not-allowed"
      )}
    >
      <MediaPlayer
        link={link}
        type={type}
        controls={completed}
        className={cn(
          "rounded object-cover aspect-square",
          completed ? "" : "opacity-50"
        )}
      />
      <div className="flex gap-1 items-center">
        <HugeiconsIcon icon={icon} size={"14px"} />
        <p
          className="text-[#525068] truncate flex-grow w-0 text-xs font-medium"
          title={name}
        >
          {name}
        </p>
        <DeleteButton
          onClick={handleDelete}
          disabled={loading || !completed}
          name={`Media ${name}`}
          size={"14px"}
        />
      </div>
      {!completed && (
        <LinearProgress sx={{ height: "2px", borderRadius: "0px" }} />
      )}
    </div>
  );
};

const MediaGallery = ({ media, setMedia, loading, chatId, chatName }) => {
  const { uploadMedia, processing } = useControllerContext();
  const [tab, setTab] = useState(0);
  const imageCount = media.filter((m) => m.type?.includes("image")).length;
  const videoCount = media.filter((m) => m.type?.includes("video")).length;
  const filteredMedia = media.filter((m) => {
    if (tab === 0) return true;
    if (tab === 1) return m.type?.includes("image");
    if (tab === 2) return m.type?.includes("video");
  });
  const { width } = useWindowSize();
  const tabs = [
    {
      label: `All (${media.length})`,
      value: 0,
    },
    imageCount > 0 && {
      label: `Images (${imageCount})`,
      value: 1,
    },
    videoCount > 0 && {
      label: `Videos (${videoCount})`,
      value: 2,
    },
  ]?.filter(Boolean);
  return (
    <div className="p-4 rounded-[32px] border border-[#3A74CA1A] bg-white flex flex-col gap-4 w-full md:w-[20%] h-full flex-shrink-0">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2 items-center">
          <HugeiconsIcon icon={VideoReplayIcon} size={"20px"} />
          <p className="text-[#525068] text-sm md:text-base">My Media</p>
        </div>
        {chatId && chatName && (
          <UploadCard
            format={allowedFileTypes}
            onUpload={(files) => {
              uploadMedia({
                files,
                showLoader: false,
                existingChatId: chatId,
                existingChatName: chatName,
              });
            }}
            isButton={true}
            disabled={processing}
          />
        )}
      </div>
      <Divider />
      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        sx={{
          borderBottom: "1px solid #DDEEFF",
          minHeight: "fit-content",
        }}
      >
        {tabs.map((item) => {
          return (
            <Tab
              label={item.label}
              key={`tab-${item.value}`}
              sx={{
                fontSize: width < 768 ? "10px" : "13px",
                minHeight: "fit-content",
              }}
              value={item.value}
            />
          );
        })}
      </Tabs>
      <div className="flex-grow h-0 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 h-fit">
          {loading ? (
            [...Array(5)]?.map((item, idx) => (
              <Skeleton
                key={`media-setup-${idx}`}
                height={"120px"}
                variant="rounded"
                width={"100%"}
              />
            ))
          ) : media?.length > 0 ? (
            filteredMedia.map((m, idx) => (
              <Grow
                in={true}
                key={`${m.name}-${m.mediaId}`}
                timeout={1000 * idx}
              >
                <div>
                  <MediaCard
                    key={`${m.name}-${m.mediaId}`}
                    {...m}
                    setMedia={setMedia}
                    chatId={chatId}
                  />
                </div>
              </Grow>
            ))
          ) : (
            <div className="flex-grow flex items-center justify-center col-span-full">
              <p className="text-[#525068] text-sm md:text-base text-center">
                No media found, please upload some media to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
