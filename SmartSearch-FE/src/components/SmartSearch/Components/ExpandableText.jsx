import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";

const ExpandableText = ({ query }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  const checkTruncated = () => {
    const element = textRef.current;
    if (element) {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  };

  useEffect(() => {
    checkTruncated();
    window.addEventListener("resize", checkTruncated);
    return () => window.removeEventListener("resize", checkTruncated);
  }, [query]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex items-end space-x-1">
      <p
        ref={textRef}
        className={`font-medium text-sm md:text-base flex-grow break-words text-[#192944] ${
          isExpanded ? "" : "line-clamp-2"
        } ${isTruncated ? "cursor-pointer" : ""}`}
        onClick={isTruncated ? handleToggle : undefined}
        title={
          isTruncated
            ? isExpanded
              ? "Click to collapse"
              : "Click to expand"
            : ""
        }
      >
        {query}
      </p>
      {isTruncated && (
        <IconButton
          onClick={handleToggle}
          aria-label={isExpanded ? "Collapse text" : "Expand text"}
          size="small"
          className="flex-shrink-0 p-0.5"
        >
          {isExpanded ? (
            <HugeiconsIcon icon={ArrowUp01Icon} size={"18px"} />
          ) : (
            <HugeiconsIcon icon={ArrowDown01Icon} size={"18px"} />
          )}
        </IconButton>
      )}
    </div>
  );
};

export default ExpandableText;
