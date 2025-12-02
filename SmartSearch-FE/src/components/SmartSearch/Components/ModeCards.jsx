import { ArrowUpRight03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../../Ascternity/utils";

export const SendToButton = ({
  icon,
  onSubmit,
  disabled,
  size = "32px",
  padding = "8px",
}) => {
  return (
    <div
      className={cn(
        "rounded-full p-2 flex justify-center items-center group",
        disabled
          ? "cursor-not-allowed bg-gray-300"
          : "cursor-pointer bg-white group-hover:bg-[#3A74CA14]"
      )}
      style={{
        width: size,
        height: size,
        padding: padding,
      }}
      onClick={onSubmit}
      disabled={disabled}
    >
      <HugeiconsIcon
        icon={icon}
        className={cn(
          "text-[#192944]",
          disabled
            ? "text-white"
            : "group-hover:text-[#084298] group-hover:rotate-45 transition-all duration-100 ease-linear"
        )}
      />
    </div>
  );
};

const ModeCards = ({
  icon = null,
  name = "",
  description = "",
  onClick = () => {},
}) => {
  return (
    <div
      className="p-4 rounded-2xl flex flex-col gap-2 bg-[#57A2ED] bg-opacity-[8%] flex-1 min-w-[150px] group hover:bg-opacity-[16%] transition-all duration-100 ease-linear cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="p-2 rounded-lg bg-[#57A2ED] text-white">{icon}</div>
        <SendToButton icon={ArrowUpRight03Icon} disabled={false} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[#525068] text-sm font-semibold">{name}</p>
        <p className="text-[10px] text-[#525068]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ModeCards;
