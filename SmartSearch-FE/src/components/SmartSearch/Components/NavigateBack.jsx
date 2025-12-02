import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IconButton } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";
import { useLocation, useNavigate } from "react-router-dom";

const NavigateBack = ({ element = null, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize();
  return (
    <div className="flex gap-4 items-center">
      <div className="flex justify-center items-center bg-white rounded-full border border-[#3A74CA29]">
        <IconButton
          color="primary"
          size="small"
          onClick={() =>
            navigate(path, {
              state: {
                prevPath: location.pathname + location.search,
              },
            })
          }
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={width < 768 ? "20px" : "24px"}
          />
        </IconButton>
      </div>

      {element}
    </div>
  );
};

export default NavigateBack;
