interface TabsProps {
  tab: string;
  setTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tab, setTab }) => {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "data management", label: "Data Management", shortLabel: "Data" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="bg-white/80 rounded-lg border border-gray-200 overflow-hidden mb-8">
      {/* Desktop - tabs */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex-1 py-3 px-4 lg:px-7 transition text-base lg:text-lg font-medium
                        ${
                          tab === tabItem.key
                            ? "bg-lime-100 text-emerald-900"
                            : "bg-transparent hover:bg-lime-50 text-gray-500"
                        }`}
          >
            <span className="hidden md:inline">{tabItem.label}</span>
            <span className="md:hidden">{tabItem.shortLabel || tabItem.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile - dropdown */}
      <div className="sm:hidden">
        <select
          value={tab}
          onChange={(e) => setTab(e.target.value)}
          className="w-full py-3 px-4 text-base font-medium text-emerald-900 bg-lime-100 border-none focus:outline-none"
        >
          {tabs.map((tabItem) => (
            <option key={tabItem.key} value={tabItem.key}>
              {tabItem.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default Tabs;