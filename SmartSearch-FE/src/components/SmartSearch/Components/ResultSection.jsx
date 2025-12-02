import { ArrowUpRight03Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { chatModes } from "../util/chatModes";
import { Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { GradientIconButton } from "./SearchInput";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw"; // for html handling
import remarkGfm from "remark-gfm"; // for gfm tables
import ClipDetail from "./ClipDetail";
import ResultCard from "./ResultCard";
import { useWindowSize } from "@uidotdev/usehooks";
import { cn } from "../../Ascternity/utils";
import ExpandableText from "./ExpandableText";

// Custom renderer for markdown to handle [clipId: some_id]
const MarkdownWithClipButtons = ({ markdownText, media, setOpenClip }) => {
  // Preprocess markdown to replace [clipId: some_id] with HTML spans
  const preprocessMarkdown = (text) => {
    const clipIdRegex = /\[clipId:\s*([^\]]*)\]/g;
    return text.replace(clipIdRegex, (match, clipId) => {
      return `<span data-clip-id="${clipId.trim()}"></span>`;
    });
  };

  const processedMarkdown = preprocessMarkdown(markdownText);

  return (
    <div className="prose max-w-full text-[#192944] text-xs md:text-sm font-medium flex flex-col gap-[10px] tracking-wide">
      <Markdown
        remarkPlugins={[remarkGfm]} // Add GFM support for tables
        rehypePlugins={[rehypeRaw]} // Allow raw HTML for span tags
        components={{
          // Custom component to render spans with data-clip-id as buttons
          span: ({ node, ...props }) => {
            const clipId = props["data-clip-id"];
            if (clipId) {
              return (
                <span className="inline-flex items-baseline relative w-5 h-5">
                  <div className="absolute inset-x-0 -bottom-1">
                    <GradientIconButton
                      key={clipId}
                      size="20px"
                      padding="4px"
                      onSubmit={() => {
                        setOpenClip({
                          open: true,
                          selectedMedia: media?.find(
                            (m) => m?.clipId === clipId
                          ),
                        });
                      }}
                      icon={ArrowUpRight03Icon}
                    />
                  </div>
                </span>
              );
            }
            return <span {...props} />;
          },
          // Optional: Customize table rendering if needed
          table: ({ node, ...props }) => (
            <table
              className={cn(
                "border-collapse border border-gray-300",
                "w-full text-xs md:text-sm"
              )}
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className={cn(
                "border border-gray-300 px-2 py-1 bg-gray-100 font-semibold"
              )}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className={cn("border border-gray-300 px-2 py-1")} {...props} />
          ),
        }}
      >
        {processedMarkdown}
      </Markdown>
    </div>
  );
};

const MediaSection = ({ media, setOpenClip }) => {
  const [tab, setTab] = useState(0);
  const imageCount = media?.filter((m) => m.type?.includes("image")).length;
  const videoCount = media?.filter((m) => m.type?.includes("video")).length;
  const filteredMedia = media?.filter((m) => {
    if (tab === 0) return true;
    if (tab === 1) return m.type?.includes("image");
    if (tab === 2) return m.type?.includes("video");
  });
  const types = [
    {
      label: `All Media(${media.length})`,
      value: 0,
    },
    videoCount > 0 && {
      label: `Video clips(${videoCount})`,
      value: 2,
    },
    imageCount > 0 && {
      label: `Images(${imageCount})`,
      value: 1,
    },
  ]?.filter(Boolean);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 items-stretch pb-3 border-b border-[#68748514]">
        {types?.map((item, idx) => {
          let isSelected = item.value === tab;
          return (
            <div
              key={`media-tabs-${idx}`}
              onClick={() => setTab(item.value)}
              className={`p-1 rounded text-xs text-center ${
                isSelected
                  ? "bg-[#57A2ED29] text-[#084298]"
                  : "bg-transparent text-[#525068] hover:bg-[#57A2ED29] hover:text-[#084298] cursor-pointer"
              }`}
            >
              {item.label}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        {filteredMedia?.map((item, idx) => {
          return (
            <ResultCard
              key={`result-card-${idx}`}
              link={item?.link}
              parentFileName={item?.parentFileName}
              clipTitle={item?.title}
              duration={item?.endTime - item?.startTime}
              startTime={item?.startTime}
              endTime={item?.endTime}
              type={item?.type}
              onClick={() => {
                setOpenClip({
                  open: true,
                  selectedMedia: item,
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const ResultSection = ({ selectedQuery = {}, summary = "", media = [] }) => {
  const [tab, setTab] = useState(0);
  const { width } = useWindowSize();
  const [openClip, setOpenClip] = useState({
    open: false,
    selectedMedia: null,
  });
  const tabs = [
    {
      label: "Results",
      value: 0,
    },
    media?.length > 0 && {
      label: "Media only",
      value: 1,
    },
    summary && {
      label: "Summary",
      value: 2,
    },
  ]?.filter(Boolean);
  const queryMode = chatModes?.find(
    (mode) => mode.value === selectedQuery?.mode
  );
  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-stretch">
          <HugeiconsIcon
            icon={Search01Icon}
            size={width < 768 ? "16px" : "20px"}
            className="flex-shrink-0"
          />
          <ExpandableText query={selectedQuery?.query} />
        </div>
        <div className="p-2 rounded-lg border text-[#3A74CA] border-[#57A2ED29] bg-[#57A2ED14] flex gap-1 items-center">
          {queryMode?.icon}
          <p className="text-xs font-medium">{queryMode?.label}</p>
        </div>
      </div>
      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        sx={{
          borderBottom: "1px solid #DDEEFF",
          minHeight: "fit-content",
        }}
      >
        {tabs.map((item) => {
          return (
            <Tab
              label={item.label}
              key={`tab-${item.value}`}
              sx={{
                fontSize: width < 768 ? "10px" : "13px",
                minHeight: "fit-content",
              }}
              value={item.value}
            />
          );
        })}
      </Tabs>
      <div className="flex-grow h-0 overflow-y-auto md:py-4">
        {tab === 0 && (
          <div className="flex flex-col gap-6">
            {summary && (
              <MarkdownWithClipButtons
                markdownText={summary}
                media={media}
                setOpenClip={setOpenClip}
              />
            )}
            {media?.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className="text-[#525068] text-sm">Related media</p>
                  <Button size="small" variant="text" onClick={() => setTab(1)}>
                    View all
                  </Button>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {media?.slice(0, 5)?.map((item, idx) => {
                    return (
                      <ResultCard
                        key={`result-card-${idx}`}
                        link={item?.link}
                        parentFileName={item?.parentFileName}
                        clipTitle={item?.title}
                        duration={item?.endTime - item?.startTime}
                        startTime={item?.startTime}
                        endTime={item?.endTime}
                        type={item?.type}
                        onClick={() => {
                          setOpenClip({
                            open: true,
                            selectedMedia: item,
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 1 && <MediaSection media={media} setOpenClip={setOpenClip} />}
        {tab === 2 && (
          <MarkdownWithClipButtons
            markdownText={summary}
            media={media}
            setOpenClip={setOpenClip}
          />
        )}
      </div>
      <ClipDetail
        isOpen={openClip?.open}
        close={() =>
          setOpenClip((prev) => ({ ...prev, open: false, selectedMedia: null }))
        }
        useModal={width >= 768}
        selectedMedia={openClip?.selectedMedia}
      />
    </div>
  );
};

export default ResultSection;
