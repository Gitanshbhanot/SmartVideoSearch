import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../../Ascternity/utils";
import { useRef, useState } from "react";
import {
  Album02Icon,
  PlayListIcon,
  SpeechToTextIcon,
  Upload02Icon,
} from "@hugeicons/core-free-icons";
import { useWindowSize } from "@uidotdev/usehooks";

export const UploadCardIcon = ({ icon = null, className = "" }) => {
  const { width } = useWindowSize();
  return (
    <div
      className={cn(
        "p-2 rounded-full border border-[#FFFFFF80] flex justify-center items-center transition-all duration-150 ease-linear",
        className
      )}
      style={{
        boxShadow: "linear-gradient(180deg, #084298 0%, #57A2ED 100%)",
        background: "linear-gradient(180deg, #084298 0%, #57A2ED 100%)",
      }}
    >
      <HugeiconsIcon icon={icon} color="#FFFFFF" size={width < 768 ? "20px" : "28px"} />
    </div>
  );
};

const UploadCard = ({
  title = "",
  format = "",
  disabled = false,
  onUpload = () => {},
  onClick = null,
  isButton = false,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCardClick = () => {
    if (!disabled) {
      if (onClick) {
        onClick();
      } else {
        inputRef.current?.click();
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
    e.target.value = ""; // Reset input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        // Filter files by format (accept attribute) if needed
        const validFiles = format
          ? files.filter((file) => {
              const extension = file.name.split(".").pop().toLowerCase();
              const acceptedTypes = format
                .split(",")
                .map((type) => type.trim().replace(".", ""));
              return acceptedTypes.includes(extension);
            })
          : files;
        if (validFiles.length > 0) {
          onUpload(validFiles);
        }
      }
    }
  };

  return (
    <>
      {isButton ? (
        <div
          onClick={handleCardClick}
          aria-disabled={disabled}
          role="button"
          className={cn(
            "flex gap-1 items-center rounded-2xl p-2 text-sm font-medium border",
            disabled
              ? "bg-[#D9D9D90A] border-[#68748529] text-gray-500 cursor-not-allowed"
              : "bg-[#57A2ED0A] border-[#57A2ED29] text-[#084298] cursor-pointer hover:bg-[#57A2ED29]"
          )}
        >
          <HugeiconsIcon icon={Upload02Icon} size={"14px"} />
          <p>Upload</p>
        </div>
      ) : (
        <div
          onClick={handleCardClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border group border-dashed rounded-lg flex flex-col gap-2 justify-between items-center p-4 md:p-8 transition-colors duration-150 h-fit md:h-[200px]",
            disabled
              ? "bg-[#D9D9D90A] border-[#68748529] cursor-not-allowed"
              : isDragging
              ? "bg-[#E6F0FA] border-[#3A74CA] cursor-pointer"
              : "bg-[#FFFFFF66] border-[#CAC5CD] hover:bg-[#F6F9FD] cursor-pointer"
          )}
          role="button"
          aria-label={title}
          aria-disabled={disabled}
        >
          <div className={"flex items-center justify-center"}>
            <UploadCardIcon icon={Album02Icon} />
            <UploadCardIcon
              icon={PlayListIcon}
              className={cn(disabled ? "" : "ml-[-8px] group-hover:ml-2")}
            />
            <UploadCardIcon
              icon={SpeechToTextIcon}
              className={cn(disabled ? "" : "ml-[-8px] group-hover:ml-2")}
            />
          </div>

          <div
            className={cn(
              "flex flex-col gap-2 items-center",
              disabled
                ? ""
                : "group-hover:gap-4 transition-all duration-150 ease-linear"
            )}
          >
            <p className="text-[#525056] text-lg md:text-xl text-center">
              {isDragging
                ? "Drop your media here"
                : "Drag & Drop your media here"}
            </p>
            <p className="text-xs md:text-sm text-[#525056] font-light text-center">
              Supports {format} files.
            </p>
          </div>
          <p className="text-[#525056] text-xs md:text-sm font-medium text-center">
            or click to{" "}
            <span className="text-[#3A74CA] font-semibold underline">
              Browse
            </span>{" "}
            files. (supports multiple files)
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={format}
        multiple={true}
        onChange={handleFileChange}
        className="hidden"
        aria-label={`Upload ${title.toLowerCase()}`}
      />
    </>
  );
};

export default UploadCard;
