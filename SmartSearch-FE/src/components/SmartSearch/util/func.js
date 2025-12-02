export const secondsToReadableTime = (value) => {
  const durationSeconds = value;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const isYtVideo = (url) => {
  return url.includes("youtube.com/embed");
};

export const getLinkFromFileName = (media, name) => {
  return media?.find((item) => item?.name === name)?.link;
};

export function formatDuration(seconds) {
  if (typeof seconds !== "number" || seconds < 0) {
    return "Invalid input";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${minutes} min${
      minutes !== 1 ? "s" : ""
    } ${remainingSeconds} sec${remainingSeconds !== 1 ? "s" : ""}`;
  } else {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ${remainingSeconds} sec${
      remainingSeconds !== 1 ? "s" : ""
    }`;
  }
}
