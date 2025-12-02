import { apiClient, apiClientFormData } from "../../api/api";
import { getLinkFromFileName } from "./util/func";

export const startUpload = async (data, chatId = null) => {
  try {
    const response = await apiClientFormData.post(
      chatId ? `/chat/b2c/${chatId}/media` : "/chat/b2c/",
      data
    );
    return (
      response?.data || {
        chatId: "",
        chatTitle: "",
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUploadStatus = async (chatId) => {
  try {
    const response = await apiClient.get(`/chat/${chatId}`);
    return (
      response?.data || {
        status: "failed",
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getChatMedia = async (chatId) => {
  try {
    const response = await apiClient.get(`/chat/${chatId}/media`);
    return (
      response?.data?.reverse()?.map((item) => ({
        ...item,
        completed: true,
      })) || []
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteChat = async (id, callback) => {
  try {
    const response = await apiClient?.delete(`/chat/${id}`);
    if (response?.status === 200) callback?.();
  } catch (error) {
    console.log(error);
  }
};

export const getSearchResults = async ({
  chatId,
  searchPrompt,
  selectedMode,
  media,
}) => {
  try {
    const response = await apiClient.post(`/search/b2c/`, {
      chatId,
      query: searchPrompt,
      mode: selectedMode,
    });
    return (
      {
        ...response?.data,
        queryId: response?.data?.searchId,
        timestamp: new Date().getTime(),
        clips: response?.data?.clips?.map((clip) => ({
          ...clip,
          link: clip.link || getLinkFromFileName(media, clip?.parentFileName),
          type: clip.type || media?.find((m) => m.name === clip?.parentFileName)?.type,
        })),
      } || {}
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getHistory = async () => {
  try {
    const response = await apiClient.get("/chat/");
    return (
      response?.data
        ?.filter((item) => item?.chatType !== "live")
        ?.map((item) => ({
          ...item,
          chatName: item?.chatTitle,
          lastQueryTime: item?.lastQueryTime || item?.createdAt || "N/A",
          mediaSummary: {
            imageCount: item?.numImage || 0,
            videoCount: item?.numVideo || 0,
            sampleMedia: item?.sampleMedia || [],
          },
        }))
        ?.sort((a, b) => b?.lastQueryTime - a?.lastQueryTime) || []
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getQueries = async (chatId) => {
  try {
    const response = await apiClient.get(`/chat/${chatId}/search`);
    return (
      response?.data
        ?.map((item) => ({
          ...item,
          queryId: item?.searchId,
          query: item?.response?.title,
          mode: item?.mode,
          timestamp: item?.timestamp,
        }))
        ?.sort((a, b) => b?.timestamp - a?.timestamp) || []
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getQueryResponse = async ({ queryId, media }) => {
  try {
    const response = await apiClient.get(`/search/${queryId}`);
    return (
      {
        ...response?.data,
        queryId: response?.data?.searchId,
        query:
          response?.data?.query || response?.data?.response?.title || "N/A",
        timestamp: response?.data?.timestamp,
        summary: response?.data?.response?.text || "N/A",
        clips: response?.data?.response?.references?.map((clip) => ({
          ...clip,
          link: clip.link || getLinkFromFileName(media, clip?.parentFileName),
          type: clip.type || media?.find((m) => m.name === clip?.parentFileName)?.type,
        })),
      } || {}
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMedia = async ({ chatId, mediaId, callback }) => {
  try {
    const response = await apiClient.delete(
      `/chat/b2c/${chatId}/media/${mediaId}`
    );
    if (response?.status === 200) callback?.();
  } catch (error) {
    console.log(error);
    return null;
  }
};
