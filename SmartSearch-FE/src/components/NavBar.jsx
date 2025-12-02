import {
  Avatar,
  Badge,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material";
import { mixpanelTrackLogOut } from "../mixpanel/funcs";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import {
  Clock04Icon,
  Notification02Icon,
  NotificationOff02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "./Ascternity/utils";
import { useAppWideContext } from "../App";

const handleLogout = () => {
  mixpanelTrackLogOut();
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  window.location.reload();
};

const avatars = ["man1", "man2", "female1", "female2"];
const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
const avatarSrc = `/characters/${randomAvatar}.svg`;

const DialogContent = ({ open, setOpen, email }) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      sx={{
        borderRadius: "32px",
        "& .MuiDialog-paper": {
          borderRadius: "32px",
        },
      }}
    >
      <div className="flex flex-col gap-4 px-2 py-4 items-center w-[50dvw] rounded-[32px]">
        <Avatar
          sx={{
            width: "72px",
            height: "72px",
          }}
          alt="Profile Image"
          src={avatarSrc}
        />
        <p className="text-xl md:text-2xl font-semibold">
          Hello{" "}
          <span className="text-[#57A2ED] font-semibold capitalize">
            {email?.split("@")?.[0]}!
          </span>
        </p>
        <p
          className="text-[#687485] text-sm hover:underline cursor-pointer px-2 py-1 rounded border bg-blue-50"
          onClick={handleLogout}
        >
          Logout
        </p>
      </div>
    </Dialog>
  );
};

const Profile = ({ isMobile = false }) => {
  const [open, setOpen] = useState(false);
  const { width } = useWindowSize();
  const email = localStorage.getItem("email");

  return (
    <div className="flex gap-2 items-center relative">
      {width < 768 ? (
        <IconButton
          onClick={() => {
            setOpen(true);
          }}
          size="small"
        >
          <Avatar
            alt="Profile Image"
            src={avatarSrc}
            sx={{
              height: "32px",
              width: "32px",
            }}
          />
        </IconButton>
      ) : (
        <div className="flex items-center justify-between p-1 rounded-full border border-[#DDEEFF]">
          <Avatar
            sx={{
              width: "42px",
              height: "42px",
            }}
            alt="Profile Image"
            src={avatarSrc}
          />
        </div>
      )}
      {width >= 768 && (
        <div className="flex flex-col gap-0">
          <p className="text-sm font-semibold">
            Welcome{" "}
            <span className="text-[#57A2ED] text-base font-semibold capitalize">
              {/* {email?.split("@")?.[0]}! */}Back!
            </span>
          </p>
          {/* <p
            className="text-[#687485] text-sm hover:underline cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </p> */}
        </div>
      )}
      <DialogContent
        open={open}
        setOpen={setOpen}
        email={email}
        avatarSrc={avatarSrc}
      />
    </div>
  );
};

const NavBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");
  const { uploadProgress, setUploadProgress } = useAppWideContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isHistory = location.pathname.includes("history");
  const chatReady = uploadProgress?.chatId && uploadProgress?.chatName;
  const isUploading = uploadProgress?.uploading;
  const { width } = useWindowSize();

  useEffect(() => {
    if (chatId && uploadProgress?.chatId === chatId) {
      if (uploadProgress?.existing) {
        if (uploadProgress?.uploading === false) {
          setUploadProgress((prev) => ({
            ...prev,
            chatId: null,
            chatName: null,
          }));
        }
      } else {
        setUploadProgress((prev) => ({
          ...prev,
          chatId: null,
          chatName: null,
        }));
      }
    }
  }, [chatId, uploadProgress?.chatId]);

  const handleNotificationClick = () => {
    if (chatReady) {
      navigate(
        `/smartSearch/chat?chatId=${uploadProgress?.chatId}&chatName=${uploadProgress?.chatName}`,
        {
          state: { prevPath: location.pathname + location.search },
        }
      );
      setUploadProgress((prev) => ({
        ...prev,
        chatId: null,
        chatName: null,
      }));
    } else if (isUploading) {
      if (uploadProgress?.existing) {
        navigate(
          `/smartSearch/chat?chatId=${uploadProgress?.chatId}&chatName=${uploadProgress?.chatName}`,
          {
            state: { prevPath: location.pathname + location.search },
          }
        );
      } else {
        navigate("/smartSearch/loading", {
          state: { prevPath: location.pathname + location.search },
        });
      }
    }
  };

  return (
    <div className="flex gap justify-between gap-2 items-center pt-2 px-2 pb-2 md:pt-4 md:px-6 border-b border-blue-10 z-20">
      <div className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <img
            alt="smartSearch"
            src="/smartSearch.svg"
            className="h-7 w-7 md:h-10 md:w-10"
          />
          <p className="text-xl md:text-2xl font-semibold">
            <span className="text-[#57A2ED] font-normal">SmartSearch.</span>
          </p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          <div
            className={cn(
              "p-2 rounded-full flex justify-center items-center relative",
              isUploading
                ? "bg-gradient-to-b from-[#084298] to-[#57A2ED] text-white hover:scale-105 cursor-pointer"
                : chatReady
                ? "border border-[#F0F0F0] bg-white hover:scale-105 cursor-pointer"
                : "border border-[#F0F0F0] bg-white"
            )}
            onClick={handleNotificationClick}
          >
            {isUploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              <Badge color="error" variant="dot" invisible={!chatReady}>
                <HugeiconsIcon
                  icon={chatReady ? Notification02Icon : NotificationOff02Icon}
                  size={width < 768 ? "20px" : "24px"}
                />
              </Badge>
            )}
          </div>
          <div
            className={cn(
              "p-2 rounded-full flex justify-center items-center",
              isHistory
                ? "bg-gradient-to-b from-[#084298] to-[#57A2ED] cursor-default"
                : "border border-[#F0F0F0] bg-white hover:scale-105 cursor-pointer"
            )}
            onClick={() => {
              navigate("/smartSearch/history", {
                state: { prevPath: location.pathname + location.search },
              });
            }}
          >
            <HugeiconsIcon
              icon={Clock04Icon}
              color={isHistory ? "white" : "#192944"}
              size={width < 768 ? "20px" : "24px"}
            />
          </div>
        </div>
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
