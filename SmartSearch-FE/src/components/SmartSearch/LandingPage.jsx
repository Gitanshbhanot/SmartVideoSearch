import { PinIcon } from "@hugeicons/core-free-icons";
import UploadCard from "./Components/UploadCard";
import { HugeiconsIcon } from "@hugeicons/react";
import HistoryCard from "./Components/HistoryCard";
import { useControllerContext } from "./Controller";
import { allowedFileTypes } from "./util/constant";

const LandingPage = () => {
  const { uploadMedia, history, processing } = useControllerContext();

  return (
    <div className="flex flex-col gap-6 justify-between items-center h-full w-full relative">
      <div className="flex flex-col gap-6 flex-grow items-center justify-center z-10">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col gap-2 items-center">
            <p
              className="text-transparent text-4xl leading-[45px] md:text-5xl md:leading-[60px] font-medium text-center"
              style={{
                background:
                  "linear-gradient(100deg, #3A74CA 8.51%, #80B6FF 80.9%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Ignite Vision AI's Magic
            </p>
            <p className="text-[#687485] text-sm md:text-base text-center font-semibold">
              Upload your photos or videos & let our Vision AI uncover cool
              insights, spot objects or share the story behind your moments!
            </p>
          </div>
          <div className="p-2 hidden rounded bg-white border border-[#3A74CA14] md:flex gap-1 items-center w-fit">
            <img src="/thunder.svg" alt="Thunder icon" className="w-5 h-5" />
            <p className="text-[#3A74CA] text-xs md:text-base font-semibold">
              See the Magic in Your Moments
            </p>
          </div>
        </div>
        <UploadCard
          title="Add media"
          format={allowedFileTypes}
          onUpload={(files) => {
            uploadMedia({ files, showLoader: true });
          }}
          disabled={processing}
        />
      </div>

      {history?.length > 0 && (
        <div className="flex flex-col gap-4 items-center w-full z-10">
          <div className="flex gap-2 items-center text-[#525068]">
            <HugeiconsIcon icon={PinIcon} color="#525068" />
            <p className="text-sm md:text-base">Recent searches</p>
          </div>
          <div className="flex items-stretch gap-2 lg:justify-center md:gap-5 max-w-5xl w-full overflow-x-auto overflow-y-hidden p-1">
            {history?.slice(0, 3)?.map((item) => (
              <HistoryCard
                key={item?.chatId}
                chatId={item?.chatId}
                title={item?.chatName}
                lastQueryTime={item?.lastQueryTime}
                mediaSummary={item?.mediaSummary}
              />
            ))}
          </div>
        </div>
      )}
      <img
        alt="Background ellipse"
        src="/planetEffect.svg"
        className="fixed h-screen w-screen object-cover"
      />
    </div>
  );
};

export default LandingPage;
