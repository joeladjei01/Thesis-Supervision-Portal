// import { useState } from "react";

export type selectorsType = {
  title: string;
  id: string;
};

type selectorProps = {
  selectors: selectorsType[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};
export const NavTab = ({
  activeTab,
  selectors,
  onTabChange,
}: selectorProps) => {
  // const [selected , setSelected] = useState(activeTab)
  return (
    <div
      className={"overflow-auto flex w-full justify-between bg-blue-100 p-[3px] rounded-sm"}
    >
      {selectors.map((value, index) => (
        <button
          key={index}
          className={`py-2 px-12 ${
            activeTab === value.id && "bg-white"
          } cursor-pointer font-semibold text-blue-900 rounded-sm`}
          onClick={() => onTabChange(value.id)}
          // onClick={setActiveTab}
        >
          {value.title}
        </button>
      ))}
    </div>
  );
};

export default NavTab;
