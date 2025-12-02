import {
  ArrowUpRight03Icon,
  Cancel01Icon,
  Search01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../../Ascternity/utils";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useRef, useState } from "react";
import CustomSelect from "./Select";
import { chatModes } from "../util/chatModes";
import { useWindowSize } from "@uidotdev/usehooks";

export const GradientIconButton = ({
  icon,
  onSubmit,
  disabled,
  size = "32px",
  padding = "8px",
}) => {
  const { width } = useWindowSize();
  return (
    <div
      className={cn(
        "rounded-full p-2 flex justify-center items-center group",
        disabled
          ? "cursor-not-allowed bg-gray-300"
          : "cursor-pointer bg-[#57A2ED] hover:bg-[#57A2ED66] hover:border hover:border-[#57A2ED29]"
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
        size={width < 768 ? "16px" : "20px"}
        className={cn(
          "text-white",
          disabled ? "" : "group-hover:text-[#084298]"
        )}
      />
    </div>
  );
};

const SearchInput = ({
  onSubmit = () => {},
  showModes = false,
  disabled = false,
}) => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [selectedMode, setSelectedMode] = useState("reasoning");
  const searchPromptRef = useRef();
  return (
    <div
      className="p-3 rounded-[16px] border border-[#68748529] bg-white flex flex-col gap-4"
      style={{
        boxShadow: "0px 4px 20px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <TextField
        inputRef={searchPromptRef}
        placeholder="Search your query here..."
        fullWidth
        size="small"
        variant="standard"
        value={searchPrompt}
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit(searchPrompt, selectedMode);
          }
        }}
        onChange={(e) => setSearchPrompt(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <HugeiconsIcon icon={Search01Icon} size={"16px"} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setSearchPrompt("");
                  searchPromptRef.current.value = "";
                  searchPromptRef.current.focus();
                }}
                disabled={!searchPrompt}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={"16px"} />
              </IconButton>
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        sx={{
          "& .MuiInputBase-root": {
            padding: "0",
          },
          "& .MuiInputBase-input": {
            padding: "0",
          },
        }}
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {showModes && (
            <CustomSelect
              options={chatModes?.filter((mode) => !mode?.hideDropDown)}
              value={selectedMode}
              title="Select mode"
              setValue={(value) => setSelectedMode(value)}
              iconKey="icon"
              isPlain={false}
              displayKey="label"
              valueKey="value"
              width="140px"
            />
          )}
          {/* <Button
            variant="outlined"
            startIcon={<HugeiconsIcon icon={SparklesIcon} size={"16px"} />}
            size="small"
            sx={{
              minHeight: "32px",
            }}
            disabled={!searchPrompt}
          >
            Enhance search prompt
          </Button> */}
        </div>

        <GradientIconButton
          icon={ArrowUpRight03Icon}
          onSubmit={() => {
            onSubmit(searchPrompt, selectedMode);
          }}
          disabled={!searchPrompt || disabled}
        />
      </div>
    </div>
  );
};

export default SearchInput;
