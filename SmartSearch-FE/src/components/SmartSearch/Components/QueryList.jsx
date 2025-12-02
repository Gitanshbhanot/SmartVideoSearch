import { PropertySearchIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../../Ascternity/utils";
import { Divider, Grow, Skeleton } from "@mui/material";
import { useWindowSize } from "@uidotdev/usehooks";

const QueryItem = ({ query, isSelected, onClick }) => {
  const { width } = useWindowSize();
  return (
    <div
      className={cn(
        "p-2 flex flex-col gap-[2px] rounded-lg",
        isSelected
          ? "border border-[#3A74CA29] bg-[#57A2ED0A]"
          : "hover:bg-[#57A2ED14] cursor-pointer transition-all duration-150 hover:pl-4"
      )}
      onClick={() => {
        if (!isSelected) {
          onClick();
        }
      }}
    >
      <div className="flex gap-1 items-center">
        <HugeiconsIcon
          icon={Search01Icon}
          size={width < 768 ? "16px" : "20px"}
          className="flex-shrink-0"
        />
        <p className="text-[#192944] text-xs md:text-sm font-semibold truncate flex-grow">
          {query.query}
        </p>
      </div>
      <p className="text-[#525068] text-xs md:text-sm">
        {new Date(query.timestamp).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
};

const QueryList = ({
  show,
  selectedQuery,
  setSelectedQuery,
  pastQueries,
  loading,
  setSelectedTab,
}) => {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-[#3A74CA1A] bg-white flex flex-col gap-4 h-full transition-all duration-200",
        show ? "w-full md:w-[20%] p-4 flex-shrink-0" : "w-0 p-0 fixed right-0"
      )}
    >
      {show && (
        <>
          <div className="flex justify-between items-center h-[38px]">
            <div className="flex gap-2 items-center">
              <HugeiconsIcon icon={PropertySearchIcon} size={"20px"} />
              <p className="text-[#525068] text-sm md:text-base">
                Search Queries
              </p>
            </div>
          </div>
          <Divider />
          {loading ? (
            <div className="flex flex-col gap-4">
              {[...Array(4)]?.map((item, idx) => {
                return (
                  <Skeleton
                    variant="rounded"
                    width={"100%"}
                    height={"70px"}
                    key={`Skeleton-query-tile-${idx}`}
                  />
                );
              })}
            </div>
          ) : pastQueries?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pastQueries?.map((query, idx) => (
                <Grow in={true} key={query.queryId} timeout={1000 * idx}>
                  <div>
                    <QueryItem
                      key={query.queryId}
                      query={query}
                      isSelected={selectedQuery?.queryId === query?.queryId}
                      onClick={() => {
                        setSelectedQuery(query);
                        setSelectedTab("search");
                      }}
                    />
                  </div>
                </Grow>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <p className="text-[#525068] text-sm md:text-base">
                No past queries
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QueryList;
