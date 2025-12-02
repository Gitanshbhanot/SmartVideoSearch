import {
  Album02Icon,
  Clock01Icon,
  PlayListIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../../Ascternity/utils";
import MediaPlayer from "./MediaPlayer";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteChat } from "../services";
import { useControllerContext } from "../Controller";
import DeleteButton from "./DeleteButton";

const HistoryCard = ({
  chatId = "",
  title = "",
  lastQueryTime = "",
  mediaSummary = {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setHistory } = useControllerContext();
  return (
    <div
      className="p-4 rounded-2xl flex-grow md:flex-grow-0 min-w-[300px] flex flex-col gap-5 hover:gap-4 border bg-clip-border border-[#57A2ED29] group hover:shadow-[0px_4px_20px_0px_rgba(0,0,0,0.10)] transition-all duration-150 ease-linear cursor-pointer h-[140px] bg-white"
      onClick={() => {
        navigate(`/smartSearch/chat?chatId=${chatId}&chatName=${title}`, {
          state: {
            prevPath: location.pathname + location.search,
          },
        });
      }}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          {mediaSummary?.sampleMedia?.slice(0, 5)?.map((item, idx) => {
            return (
              <MediaPlayer
                key={`item-${idx}`}
                link={item?.link}
                type={item?.type}
                className={cn(
                  "w-8 h-8 rounded-lg object-cover -rotate-[30deg] transition-all duration-150 ease-linear",
                  idx !== 0 ? "ml-[-8px] group-hover:ml-[-6px]" : ""
                )}
              />
            );
          })}
        </div>
        <div className="flex gap-2 h-fit text-xs font-medium">
          <div className="p-1 flex gap-1 items-center text-[#192944] rounded bg-[#57A2ED29]">
            <HugeiconsIcon icon={Album02Icon} size={"14px"} />
            {mediaSummary?.imageCount}
          </div>
          <div className="p-1 flex gap-1 items-center text-[#192944] rounded bg-[#57A2ED29]">
            <HugeiconsIcon icon={PlayListIcon} size={"14px"} />
            {mediaSummary?.videoCount}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p
          className="truncate text-[#525068] text-sm md:text-base font-semibold"
          title={title}
        >
          {title}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 items-center text-[#525068] text-xs">
              <HugeiconsIcon icon={Clock01Icon} size={"14px"} />
              <p>Last Queried</p>
            </div>
            <p className="p-1 rounded text-[#3A74CA] text-xs font-medium bg-[#57A2ED29]">
              {new Date(lastQueryTime)?.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex gap-0 items-center">
            {/* <IconButton color="info" size="small">
              <HugeiconsIcon icon={PinOffIcon} size={"14px"} />
            </IconButton> */}
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chatId, () => {
                  setHistory((prev) =>
                    prev?.filter((item) => item?.chatId !== chatId)
                  );
                });
              }}
              name={`Chat ${title}`}
              size={"14px"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
