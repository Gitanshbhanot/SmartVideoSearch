import { HugeiconsIcon } from "@hugeicons/react";
import NavigateBack from "./Components/NavigateBack";
import {
  Album02FreeIcons,
  PlayListIcon,
  PropertySearchIcon,
  SearchAreaIcon,
} from "@hugeicons/core-free-icons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../Ascternity/utils";
import { useEffect, useState } from "react";
import {
  getChatMedia,
  deleteChat,
  getSearchResults,
  getQueries,
  getQueryResponse,
} from "./services";
import { useControllerContext } from "./Controller";
import MediaGallery from "./Components/MediaGallery";
import QueryList from "./Components/QueryList";
import SearchInput from "./Components/SearchInput";
import ResultSection from "./Components/ResultSection";
import { chatModes } from "./util/chatModes";
import ModeCards from "./Components/ModeCards";
import animationData from "./Lotties/queryAnswerLottie.json";
import { LottieLoader } from "./Components/LottieLoader";
import { useToast } from "../Toast/Toast";
import DeleteButton from "./Components/DeleteButton";
import MobileTabs from "./Components/MobileTabs";
import { useWindowSize } from "@uidotdev/usehooks";

const MediaSearch = () => {
  const { uploadedMedia, processing } = useControllerContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");
  const chatName = searchParams.get("chatName");
  const [loadingQuery, setLoadingQuery] = useState(false); // for past queries
  const [loadingMedia, setLoadingMedia] = useState(false); // for media gallery
  const [loading, setLoading] = useState(false); // for search results
  const [loadingQueryResponse, setLoadingQueryResponse] = useState(false); // for past query response
  const [pastQueries, setPastQueries] = useState([]);
  const [showPastQueries, setShowPastQueries] = useState(true);
  const [media, setMedia] = useState([]);
  const mediaUploading =
    uploadedMedia?.chatId === chatId
      ? uploadedMedia?.media?.filter(
          (item) => !media?.find((m) => m.mediaId === item.mediaId)
        ) || []
      : [];
  const [selectedQuery, setSelectedQuery] = useState({});
  const [selectedTab, setSelectedTab] = useState("search");
  const { width } = useWindowSize();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const getMedia = async () => {
    if (uploadedMedia?.chatId === chatId) {
      const data = await getChatMedia(chatId);
      setMedia(data || []);
    } else {
      setLoadingMedia(true);
      const data = await getChatMedia(chatId);
      setMedia(data || []);
      setLoadingMedia(false);
    }
  };

  const getPastQueries = async () => {
    setLoadingQuery(true);
    const data = await getQueries(chatId);
    setPastQueries(data || []);
    setLoadingQuery(false);
  };

  const getQueryResult = async (queryId) => {
    setLoadingQueryResponse(true);
    const data = await getQueryResponse({ queryId, media });
    setSelectedQuery(data || {});
    setLoadingQueryResponse(false);
  };

  const handleSearch = async (searchPrompt, selectedMode) => {
    setLoading(true);
    setSelectedQuery({});
    const response = await getSearchResults({
      chatId,
      searchPrompt,
      selectedMode,
      media,
    });
    let data = response || {};
    if (data?.clips?.length === 0 && data?.summary === "") {
      toast({
        title: "No results found",
        description: "Please try again with a different query",
        position: "top-right",
      });
    } else {
      let result = {
        ...data,
      };
      setPastQueries((prev) => [result, ...prev]);
      setSelectedQuery(result);
      getPastQueries();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (chatId) {
      getMedia();
    }
  }, [chatId, processing]);

  useEffect(() => {
    if (chatId) {
      getPastQueries();
    }
  }, [chatId]);

  useEffect(() => {
    if (
      selectedQuery?.queryId &&
      !selectedQuery?.summary &&
      !selectedQuery?.clips?.length
    ) {
      getQueryResult(selectedQuery?.queryId);
    }
  }, [selectedQuery?.queryId]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full">
      <div className="flex justify-between items-center">
        <NavigateBack
          path="/smartSearch/home"
          element={
            <div className="flex gap-1 items-center text-lg md:text-xl font-medium text-[#084298]">
              <HugeiconsIcon icon={SearchAreaIcon} />
              <p>{chatName}</p>
            </div>
          }
        />
        <div className="flex gap-2 items-center">
          {/* <IconButton color="primary" size="small">
            <HugeiconsIcon icon={PinOffIcon} size={"20px"} />
          </IconButton>
          <IconButton color="primary" size="small">
            <HugeiconsIcon icon={Share08Icon} size={"20px"} />
          </IconButton> */}
          <DeleteButton
            onClick={() =>
              deleteChat(chatId, () => {
                navigate("/smartSearch/home", {
                  state: {
                    prevPath: location.pathname + location.search,
                  },
                });
              })
            }
            name={`Chat ${chatName}`}
            size={"20px"}
          />
          <div className="hidden md:flex gap-1 items-center p-1 text-[#192944] text-sm font-medium">
            <HugeiconsIcon icon={Album02FreeIcons} size={"20px"} />
            {media?.filter((item) => item?.type?.includes("image"))?.length ||
              0}
          </div>
          <div className="hidden md:flex gap-1 items-center p-1 text-[#192944] text-sm font-medium">
            <HugeiconsIcon icon={PlayListIcon} size={"20px"} />
            {media?.filter((item) => item?.type?.includes("video"))?.length ||
              0}
          </div>
          <div
            className={cn(
              "p-1 hidden md:flex justify-center items-center cursor-pointer hover:scale-105 transition-all duration-150",
              showPastQueries
                ? "bg-white rounded-full border border-[#57A2ED52]"
                : ""
            )}
            onClick={() => setShowPastQueries((prev) => !prev)}
          >
            <HugeiconsIcon
              icon={PropertySearchIcon}
              size={"20px"}
              color="#3A74CA"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-stretch flex-grow md:min-h-[570px] overflow-y-auto">
        {(selectedTab === "media" || width >= 768) && (
          <MediaGallery
            media={[...mediaUploading, ...media]}
            loading={loadingMedia}
            chatId={chatId}
            chatName={chatName}
            setMedia={setMedia}
          />
        )}
        {(selectedTab === "search" || width >= 768) && (
          <div className="flex-grow  w-0 rounded-[32px] border border-[#3A74CA1A] bg-white p-4 relative flex flex-col gap-4">
            {loading || loadingMedia || loadingQueryResponse ? (
              <div className="flex-grow h-0 flex justify-center items-center">
                <div className="flex flex-col gap-4 items-center">
                  <LottieLoader
                    animationData={animationData}
                    width={"200px"}
                    height={"200px"}
                  />
                  <p className="text-xl font-medium">
                    {loadingMedia
                      ? "Setting up media..."
                      : loadingQueryResponse
                      ? "Loading Results..."
                      : "Generating Results..."}
                  </p>
                </div>
              </div>
            ) : selectedQuery?.queryId ? (
              <>
                <ResultSection
                  selectedQuery={selectedQuery}
                  summary={selectedQuery?.summary}
                  media={selectedQuery?.clips}
                />
                <div className="bottom-4 sticky flex-shrink-0">
                  <SearchInput
                    onSubmit={handleSearch}
                    showModes={true}
                    disabled={media?.length === 0}
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col gap-8 justify-between items-center">
                <div className="flex flex-col gap-8 items-center w-full flex-1 justify-center">
                  <p
                    className="text-2xl md:text-3xl font-medium text-center"
                    style={{
                      background:
                        "linear-gradient(100deg, #3A74CA 8.51%, #80B6FF 80.9%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Uncover Insights Instantly!
                  </p>
                  <div className="w-full md:px-10">
                    <SearchInput
                      onSubmit={handleSearch}
                      showModes={true}
                      disabled={media?.length === 0}
                    />
                  </div>
                </div>
                {media?.length > 0 && (
                  <div className="flex gap-4 items-stretch overflow-x-auto md:overflow-x-hidden w-full md:flex-wrap">
                    {chatModes
                      ?.filter((mode) => !mode?.hideShortcut)
                      .map((mode) => (
                        <ModeCards
                          key={mode.value}
                          icon={mode.icon}
                          name={mode.label}
                          description={mode?.description}
                          onClick={() => handleSearch(mode?.prompt, mode.value)}
                        />
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {(selectedTab === "query" || width >= 768) && (
          <QueryList
            selectedQuery={selectedQuery}
            setSelectedQuery={setSelectedQuery}
            pastQueries={pastQueries}
            show={width >= 768 ? showPastQueries : true}
            loading={loadingQuery}
            setSelectedTab={setSelectedTab}
          />
        )}
      </div>
      {width < 768 && (
        <MobileTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      )}
    </div>
  );
};

export default MediaSearch;
