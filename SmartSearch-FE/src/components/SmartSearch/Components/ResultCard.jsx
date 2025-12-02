import MediaPlayer from "./MediaPlayer";
import { secondsToReadableTime } from "../util/func";

const ResultCard = ({
  link,
  parentFileName,
  clipTitle,
  duration,
  startTime,
  endTime,
  type,
  onClick,
}) => {
  const displayDuration =
    Number.isInteger(duration) && duration > 0 ? duration + "s" : "";
  const displayTimeRange =
    Number.isInteger(startTime) && Number.isInteger(endTime)
      ? `${secondsToReadableTime(startTime)} - ${secondsToReadableTime(
          endTime
        )}`
      : "";

  return (
    <div
      className="p-2 rounded-lg bg-[#57A2ED0F] group flex flex-col gap-1 md:gap-2 h-[170px] md:h-[200px] w-[170px] md:w-[200px] hover:border-b-2 hover:border-blue-600 transition-all duration-150 ease-linear cursor-pointer"
      onClick={onClick}
    >
      <MediaPlayer
        type={type}
        link={link}
        startTime={startTime}
        endTime={endTime}
        controls={true}
        className="flex-grow h-0 border border-[#D3D3D366] rounded-lg object-cover aspect-square"
      />
      {clipTitle && (
        <p
          className="text-[#192944] text-xs font-medium truncate"
          title={clipTitle}
        >
          {clipTitle}
        </p>
      )}
      <p className="text-[#192944] text-[10px] truncate" title={parentFileName}>
        {parentFileName}
      </p>
      {(displayTimeRange || displayDuration) && (
        <div className="flex justify-between items-center">
          {displayTimeRange && (
            <p className="text-[#605D64] text-xs font-semibold">
              {displayTimeRange}
            </p>
          )}
          {displayDuration && (
            <p className="text-[#605D64] text-xs">{displayDuration}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultCard;
