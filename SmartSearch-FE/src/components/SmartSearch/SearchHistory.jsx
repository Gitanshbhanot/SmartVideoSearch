import { HugeiconsIcon } from "@hugeicons/react";
import NavigateBack from "./Components/NavigateBack";
import { Clock04Icon, MessageSearch01Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";
import HistoryCard from "./Components/HistoryCard";
import { InputAdornment, OutlinedInput } from "@mui/material";
import { useControllerContext } from "./Controller";

const SearchHistory = () => {
  const { history } = useControllerContext();
  const [groupedHistory, setGroupedHistory] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistory, setFilteredHistory] = useState([]);

  const groupHistoryByDate = (historyData) => {
    const grouped = {};

    historyData.forEach((chat) => {
      const date = new Date(chat.lastQueryTime);
      const dateKey = date.toDateString(); // Format: "Mon Jan 01 2025"

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(chat);
    });

    // Sort chats within each date by time (most recent first)
    Object.keys(grouped).forEach((dateKey) => {
      grouped[dateKey].sort(
        (a, b) => new Date(b.lastQueryTime) - new Date(a.lastQueryTime)
      );
    });

    return grouped;
  };

  const filterHistory = (historyData, searchTerm) => {
    if (!searchTerm.trim()) {
      return historyData;
    }

    const searchLower = searchTerm.toLowerCase();
    return historyData.filter((chat) => {
      // Search in chat title
      const titleMatch = chat.chatTitle?.toLowerCase().includes(searchLower);

      // Search in media metadata (if available)
      const mediaMatch = chat.mediaSummary?.sampleMedia?.some((media) =>
        media.name?.toLowerCase().includes(searchLower)
      );

      return titleMatch || mediaMatch;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filtered = filterHistory(history, searchTerm);
      setFilteredHistory(filtered);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, history]);

  useEffect(() => {
    if (filteredHistory.length > 0 || history.length > 0) {
      const dataToGroup =
        filteredHistory.length > 0 || searchTerm ? filteredHistory : history;
      const grouped = groupHistoryByDate(dataToGroup);
      setGroupedHistory(grouped);
    }
  }, [filteredHistory, history, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <NavigateBack
          path="/smartSearch/home"
          element={
            <div className="flex gap-1 items-center text-lg md:text-xl font-medium text-[#084298]">
              <HugeiconsIcon icon={Clock04Icon} />
              <p>History</p>
            </div>
          }
        />
        <OutlinedInput
          sx={{
            borderRadius: "30px",
            backgroundColor: "white",
            width: "300px",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#3A74CA",
              },
            },
          }}
          placeholder="Search here..."
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <HugeiconsIcon
                icon={MessageSearch01Icon}
                color="#687485"
                size={"14px"}
              />
            </InputAdornment>
          }
        />
      </div>

      <div className="flex flex-col gap-6 overflow-y-auto">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>
              {searchTerm
                ? `No results found for "${searchTerm}"`
                : "No search history found"}
            </p>
          </div>
        ) : (
          <>
            {searchTerm && (
              <div className="text-sm text-gray-600">
                {Object.values(groupedHistory).flat().length} result
                {Object.values(groupedHistory).flat().length !== 1
                  ? "s"
                  : ""}{" "}
                found for "{searchTerm}"
              </div>
            )}
            {Object.keys(groupedHistory)
              .sort((a, b) => new Date(b) - new Date(a)) // Sort dates in descending order
              .map((dateKey) => (
                <div key={dateKey} className="flex flex-col gap-4">
                  <p className="text-[#525068] text-sm md:text-base">
                    {formatDate(dateKey)}
                  </p>
                  <div className="flex gap-4 md:gap-6 flex-wrap">
                    {groupedHistory[dateKey].map((chat) => (
                      <HistoryCard
                        key={chat.chatId}
                        chatId={chat.chatId}
                        title={chat.chatName}
                        lastQueryTime={chat.lastQueryTime}
                        mediaSummary={chat.mediaSummary}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
