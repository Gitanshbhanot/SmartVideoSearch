import { createContext, lazy, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMediaUpload from "./hooks/useMediaUpload";
import { getHistory } from "./services";
const LandingPage = lazy(() => import("./LandingPage"));
const MediaLoading = lazy(() => import("./MediaLoading"));
const SearchHistory = lazy(() => import("./SearchHistory"));
const MediaSearch = lazy(() => import("./MediaSearch"));

const ControllerContext = createContext();

export const useControllerContext = () => useContext(ControllerContext);

const Controller = () => {
  const { pageType } = useParams();
  const [history, setHistory] = useState([]);
  const [uploadedMedia, setUploadedMedia] = useState({});
  const { uploadMedia, loading, error, elapsedTime, processing } =
    useMediaUpload({
      setUploadedMedia,
    });

  const getPastData = async () => {
    const history = await getHistory();
    setHistory(history);
  };

  useEffect(() => {
    getPastData();
  }, [pageType]);

  const renderPage = () => {
    switch (pageType) {
      case "home":
        return <LandingPage />;
      case "history":
        return <SearchHistory />;
      case "chat":
        return <MediaSearch />;
      case "loading":
        return (
          <MediaLoading
            duration={uploadedMedia?.estimatedTime}
            timePassed={elapsedTime}
            src={uploadedMedia?.media?.[0]?.link}
            type={uploadedMedia?.media?.[0]?.type}
            chatId={uploadedMedia?.chatId}
            chatName={uploadedMedia?.chatName}
            error={error}
          />
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <ControllerContext.Provider
      value={{
        uploadMedia,
        uploadedMedia,
        processing,
        elapsedTime,
        history,
        setHistory,
      }}
    >
      {renderPage()}
    </ControllerContext.Provider>
  );
};

export default Controller;
