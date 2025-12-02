import React from "react";
import { Button, Drawer, Modal, Slide } from "@mui/material";
import MediaPlayer from "./MediaPlayer";
import { secondsToReadableTime } from "../util/func";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useWindowSize } from "@uidotdev/usehooks";

export const ZoomWrapper = ({ element = null }) => {
  const size = useWindowSize();
  return (
    <TransformWrapper
      initialScale={1}
      wheel={{ disabled: false }}
      doubleClick={{ disabled: false }}
      pinch={{ disabled: false }}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div className="relative w-full h-full">
          {size?.width > 768 && (
            <div className="top-0 right-0 z-50 absolute flex flex-col gap-0 bg-[#616161] rounded-b text-[18px] text-white">
              <button
                onClick={() => zoomIn()}
                className="px-[6px] py-2 w-full hover:bg-gray-700"
              >
                +
              </button>
              <button
                onClick={() => zoomOut()}
                className="px-[6px] py-2 w-full hover:bg-gray-700"
              >
                -
              </button>
              <button
                onClick={() => resetTransform()}
                className="px-[6px] py-2 w-full hover:bg-gray-700"
              >
                x
              </button>
            </div>
          )}
          <TransformComponent
            wrapperStyle={{
              width: "100%",
              zIndex: 0,
              borderRadius: "0px 0px 4px 4px",
              height: "100%",
            }}
            contentStyle={{
              width: "100%",
              borderRadius: "0px 0px 4px 4px",
              height: "100%",
            }}
          >
            {element}
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};

const ClipDetail = ({
  isOpen = false,
  close = () => {},
  useModal = false,
  selectedMedia = {},
}) => {
  const displayTimeRange =
    Number.isInteger(selectedMedia?.startTime) &&
    Number.isInteger(selectedMedia?.endTime)
      ? `${secondsToReadableTime(
          selectedMedia?.startTime
        )} - ${secondsToReadableTime(selectedMedia?.endTime)}`
      : "";

  const renderContent = () => {
    return (
      <div className="p-4 flex flex-col items-end gap-6 h-[100dvh] w-full md:h-[80dvh] max-w-lg bg-white rounded-2xl">
        <div className="flex justify-between items-center w-full gap-10">
          <p className="text-xl md:text-2xl text-[#192944]  font-medium whitespace-nowrap">
            {selectedMedia?.type?.includes("video") ? "VIDEO CLIP" : "IMAGE"}
          </p>
          <div className="flex flex-col gap-0 items-end flex-grow w-0">
            <p
              className="text-[#687485] text-lg md:text-xl font-medium max-w-full line-clamp-2 break-words text-ellipsis"
              title={selectedMedia?.parentFileName}
            >
              {selectedMedia?.parentFileName || "No file name available"}
            </p>
            {displayTimeRange && (
              <p className="text-[#3A74CA] text-sm font-medium">
                {displayTimeRange}
              </p>
            )}
          </div>
        </div>
        <div className="flex-grow h-0 w-full">
          <ZoomWrapper
            element={
              <MediaPlayer
                type={selectedMedia?.type}
                link={selectedMedia?.link}
                className="rounded-lg border border-[#3A74CA52] object-contain aspect-video h-full w-full"
                startTime={selectedMedia?.startTime}
                endTime={selectedMedia?.endTime}
              />
            }
          />
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0 w-full">
          {selectedMedia?.title && (
            <p className="text-[#192944] text-sm md:text-base font-bold">
              {selectedMedia?.title}
            </p>
          )}
          {selectedMedia?.description && (
            <p className="text-[#525068] text-sm md:text-base font-medium">
              {selectedMedia?.description}
            </p>
          )}
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={close}
          sx={{
            width: "fit-content",
          }}
        >
          Close
        </Button>
      </div>
    );
  };

  return useModal ? (
    <Modal
      open={isOpen}
      aria-labelledby="snapshot-modal-title"
      disableAutoFocus={true}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .MuiBackdrop-root": { bgcolor: "rgba(0, 0, 0, 0.5)" },
      }}
    >
      <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
        {renderContent()}
      </Slide>
    </Modal>
  ) : (
    <Drawer
      anchor="bottom"
      open={isOpen}
      hideBackdrop

    >
      {renderContent()}
    </Drawer>
  );
};

export default ClipDetail;
