import {
  Album02FreeIcons,
  BulbChargingIcon,
  CheckmarkCircle04Icon,
  PlayListIcon,
  SearchAreaIcon,
  StarsIcon,
  TapeMeasureIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinearProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { LottieLoader } from "./Components/LottieLoader";
import animationData from "./Lotties/videoPreparingLottie.json";
import { formatDuration } from "./util/func";
import { useControllerContext } from "./Controller";
import { useWindowSize } from "@uidotdev/usehooks";
import { useLocation, useNavigate } from "react-router-dom";
import MediaPlayer from "./Components/MediaPlayer";
import NavigateBack from "./Components/NavigateBack";

const Step = ({
  title = "",
  highlight = "",
  description = "",
  icon,
  active,
  complete,
  timing = 0, // in seconds
  onComplete = () => {},
  hold = false,
}) => {
  const [value, setValue] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (active && !complete) {
      intervalRef.current = setInterval(() => {
        setValue((prev) => (!hold ? prev + 1 : prev < 99 ? prev + 1 : prev));
      }, timing * 10);
      return () => clearInterval(intervalRef?.current);
    } else if (complete) setValue(100);
  }, [timing, active, complete, hold]);

  useEffect(() => {
    if (active && value === 100 && onComplete) onComplete();
  }, [active, value]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full w-full">
      <div
        className="flex justify-center items-center p-2 rounded-full w-fit h-fit"
        style={{
          backgroundColor: complete
            ? "#16C47F"
            : active
            ? "#3A74CA"
            : "#687485",
          filter: complete
            ? "drop-shadow(0px 0px 33.333px rgba(22, 196, 127, 0.50))"
            : active
            ? "drop-shadow(0px 0px 33.333px rgba(58, 116, 202, 0.50))"
            : "",
        }}
      >
        <HugeiconsIcon size={16} icon={icon} color="white" />
      </div>
      <div className="flex flex-col gap-4 flex-grow justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[#192944] text-xs md:text-sm font-medium">
            {title} <span className="text-[#57A2ED]">{highlight}</span>
          </p>
          <p className="text-[#687485] text-[10px] md:text-xs">{description}</p>
        </div>
        <LinearProgress
          color={complete ? "success" : "primary"}
          value={value}
          variant="determinate"
        />
      </div>
    </div>
  );
};

const MediaLoading = ({
  duration = 0,
  timePassed = 0,
  src = "",
  type = "image",
  chatId = "",
  chatName = "",
  error = null,
}) => {
  const { processing, uploadedMedia } = useControllerContext();
  const [activeStep, setActiveStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(timePassed);
  const [overallProgress, setOverallProgress] = useState(
    timePassed >= duration ? 99 : Math.round((timePassed / duration) * 100)
  );
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    {
      title: "Kickstarting Your",
      highlight: "Upload",
      icon: CheckmarkCircle04Icon,
      description:
        "Your video is zooming to our servers! We’re setting the stage for an amazing search experience.",
    },
    {
      title: "Diving into",
      highlight: "Analysis",
      icon: StarsIcon,
      description:
        "We’re breaking down every frame to uncover the details you’ll love exploring.",
    },
    {
      title: "Building the",
      highlight: "Search Magic",
      icon: SearchAreaIcon,
      description:
        "Indexing your video’s content so you can find exactly what you’re looking for, fast.",
    },
    {
      title: "Polishing to",
      highlight: "Perfection",
      icon: TapeMeasureIcon,
      description:
        "Almost there! We’re putting the final touches to make your video search-ready.",
    },
  ];
  const perStepTime = duration / steps?.length;

  useEffect(() => {
    let interval = setInterval(() => {
      setOverallProgress((prev) => (prev < 99 ? prev + 1 : prev));
    }, duration * 10);
    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    let interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!processing && !error) {
      setOverallProgress(100);
      setTimeout(() => {
        navigate(`/smartSearch/chat?chatId=${chatId}&chatName=${chatName}`, {
          state: {
            prevPath: location.pathname + location.search,
          },
        });
      }, 3000);
    } else if (error) {
      setTimeout(() => {
        navigate(`/smartSearch/home`, {
          state: {
            prevPath: location.pathname + location.search,
          },
        });
      }, 1000);
    }
  }, [processing, error]);

  return (
    <div className="rounded-[24px] h-full w-full flex flex-col gap-6 bg-white border border-blue-50 p-4 md:p-6 justify-between relative overflow-y-auto">
      <div className="hidden md:flex flex-col gap-2 max-w-xs absolute top-[70px] left-7">
        <HugeiconsIcon icon={BulbChargingIcon} color="#3A74CA" />
        <p className="text-[#687485] text-xs text-justify">
          You're all set! Feel free to head back to the homepage, we’ll let you
          know as soon as your media is ready for search. Just keep this tab
          open in the meantime.
        </p>
      </div>
      <div className="flex justify-between gap-2 items-center">
        <NavigateBack path="/smartSearch/home" />
        <div className="flex items-stretch gap-4">
          <div className="py-2 px-4 rounded-full text-[#192944] text-xs md:text-sm font-medium bg-[#3A74CA1A] h-fit flex items-center gap-4">
            <div className="flex gap-1 items-center">
              <HugeiconsIcon
                icon={Album02FreeIcons}
                size={width < 768 ? "16px" : "20px"}
              />
              {uploadedMedia?.media?.filter((item) =>
                item?.type?.includes("image")
              )?.length || 0}
            </div>
            <div className="flex gap-1 items-center">
              <HugeiconsIcon
                icon={PlayListIcon}
                size={width < 768 ? "16px" : "20px"}
              />
              {uploadedMedia?.media?.filter((item) =>
                item?.type?.includes("video")
              )?.length || 0}
            </div>
          </div>
          {/* <div className="py-2 px-4 rounded-full text-[#192944] text-xs md:text-sm font-medium bg-[#3A74CA1A] h-fit">
            Estimated time {width < 768 ? <br /> : ":"}{" "}
            {formatDuration(duration)}
          </div> */}
          <div className="py-2 px-4 rounded-full text-[#3A74CA] border-[#3A74CA52] border text-xs md:text-sm font-medium h-fit">
            <span className="hidden md:inline">Elapsed time: </span>{" "}
            {formatDuration(elapsedTime)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center flex-grow">
        <div className="flex flex-col gap-0 items-center">
          <LottieLoader
            animationData={animationData}
            width="40px"
            height="40px"
          />
          <p className="text-[#192944] text-lg md:text-xl font-medium">
            Preparing <span className="text-[#57A2ED]">Media</span>
          </p>
        </div>
        <div className="flex p-8 justify-center items-center flex-grow relative w-full md:w-auto aspect-video h-0 min-h-[140px] overflow-hidden">
          <MediaPlayer
            link={src}
            type={type}
            className="flex-grow z-10 h-full w-full md:w-auto max-w-2xl rounded-2xl object-cover"
          />
          <div className="z-20 bg-transparent flex gap-0 items-stretch absolute inset-8">
            <div
              className="h-full border-r-2 border-white bg-transparent relative transition-all duration-150"
              style={{
                width: overallProgress + "%",
              }}
            />
            <div
              className="h-full bg-transparent flex-grow rounded-r-2xl"
              style={{
                backdropFilter: "blur(4px)",
              }}
            />
            <p
              className="text-white flex items-center justify-center font-extrabold absolute inset-0 text-3xl md:text-4xl z-10"
              style={{
                textShadow: " 0px 2px 40px rgba(0, 0, 0, 0.50)",
              }}
            >
              {overallProgress}%
            </p>
          </div>
          <img
            alt="rectangle"
            className="absolute inset-0 object-contain h-full w-full"
            src="/smartSearch/rectangle.svg"
          />
          <img
            alt="rectangle2"
            className="absolute inset-0 object-contain h-full w-full -rotate-6"
            src="/smartSearch/rectangle.svg"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 w-full">
        {steps?.map((item, idx) => {
          let isHold = idx === steps?.length - 1 && overallProgress !== 100;
          return (
            <Step
              key={`Video-load-steps-${idx}`}
              title={item?.title}
              description={item?.description}
              highlight={item?.highlight}
              icon={item?.icon}
              active={activeStep === idx}
              complete={activeStep > idx || overallProgress === 100}
              timing={perStepTime}
              hold={isHold}
              onComplete={() => setActiveStep((prev) => prev + 1)}
            />
          );
        })}
      </div>
      <p className="hidden md:block w-full rounded-[24px] text-[#3A74CA] text-[10px] md:text-xs font-medium py-2 px-2 md:px-4 text-center border-[#3A74CA1A] border bg-[#3A74CA0F]">
        The system is working hard to supercharge your video for seamless
        searching. This might take a few minutes, depending on your video’s
        length. Keep this tab open to stay in the action!
      </p>
    </div>
  );
};

export default MediaLoading;
