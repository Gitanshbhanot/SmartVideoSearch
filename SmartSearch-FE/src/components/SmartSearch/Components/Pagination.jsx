import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

const Paginator = ({
  data = [],
  limit = 10,
  initialPage = 1,
  setDisplayData = () => {},
  setCurrect_page = null,
}) => {
  const [selectedPage, setSelectedPage] = useState(initialPage || 1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const totalPages = useMemo(
    () => Math.ceil(data.length / limit),
    [data, limit]
  );
  const perPageData = useMemo(() => {
    const newData = {};
    for (let i = 0; i < data.length; i += limit) {
      const pageData = data
        .slice(i, i + limit)
        .map((item, idx) => ({ ...item, idx: i + idx + 1 }));
      newData[i / limit + 1] = pageData;
    }
    return newData;
  }, [data, limit]);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handlePageClick = (pageNumber) => {
    setSelectedPage(pageNumber);
    setDisplayData(perPageData[pageNumber]);
    handleCloseMenu();
  };
  useEffect(() => {
    setSelectedPage(initialPage || 1);
    setDisplayData(perPageData[initialPage || 1] || []);
  }, [data, initialPage, perPageData]);

  useEffect(() => {
    if (setCurrect_page) {
      setCurrect_page((prev) => {
        return {
          ...prev,
          //  store your current page to stay back on that page only when you delete the item
          page: selectedPage,
        };
      });
    }
  }, [selectedPage]);

  return (
    <div
      className="p-[6px] rounded flex gap-1 items-center bg-white w-fit text-[#79767D]"
      style={{
        boxShadow:
          "0px 0px 4px 0px rgba(0, 0, 0, 0.04), 0px 4px 8px 0px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Button
        id="paginator-button"
        aria-controls={open ? "paginator-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpenMenu}
        sx={{ textTransform: "none", padding: "0px" }}
        size="small"
        color="inherit"
      >
        {data.length > 0
          ? `${(selectedPage - 1) * limit + 1}-${Math.min(
              selectedPage * limit,
              data.length
            )} of ${data.length}`
          : "0-0 of 0"}
      </Button>
      <div className="flex gap-2 items-center">
        <IconButton
          variant="link"
          disabled={selectedPage === 1}
          onClick={() => handlePageClick(Math.max(selectedPage - 1, 1))}
          size="small"
          sx={{ padding: "0px" }}
          title="prev page"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={"24px"} />
        </IconButton>
        <IconButton
          variant="link"
          disabled={selectedPage === totalPages || initialPage === 0}
          onClick={() =>
            handlePageClick(Math.min(selectedPage + 1, totalPages))
          }
          size="small"
          sx={{ padding: "0px" }}
          title="next page"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={"24px"} />
        </IconButton>
      </div>
      <Menu
        id="paginator-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "paginator-button",
        }}
        slotProps={{
          paper: {
            style: {
              maxHeight: "30vh",
              width: "15ch",
            },
          },
        }}
      >
        {Object.keys(perPageData).map((pageNumber) => (
          <MenuItem
            key={pageNumber}
            onClick={() => handlePageClick(parseInt(pageNumber))}
          >
            {`${(pageNumber - 1) * limit + 1}-${Math.min(
              pageNumber * limit,
              data.length
            )}`}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
export default React.memo(Paginator);
