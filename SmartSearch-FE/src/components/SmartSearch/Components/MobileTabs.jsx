import { cn } from "../../Ascternity/utils";

const MobileTabs = ({ selectedTab = "search", setSelectedTab }) => {
  const tabs = [
    {
      value: "media",
      label: "Media sources",
    },
    {
      value: "search",
      label: "Search area",
    },
    {
      value: "query",
      label: "Search queries",
    },
  ];
  return (
    <div className="flex-shrink-0 p-2 flex gap-2 items-stretch rounded-full bg-white w-full border border-[#cfe1fd80]">
      {tabs.map((tab) => {
        let isSelected = selectedTab === tab.value;
        return (
          <div
            key={tab.value}
            className={cn(
              "flex-1 px-2 py-2 text-center text-xs font-medium rounded-2xl",
              isSelected
                ? "bg-[#cfe1fd80] text-[#0B58CB]"
                : "bg-transparent text-[#525056]"
            )}
            onClick={() => setSelectedTab(tab.value)}
          >
            <p>{tab.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MobileTabs;
