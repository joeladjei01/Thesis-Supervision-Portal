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
      className={"overflow-auto flex w-full justify-between bg-muted p-[4px] rounded-lg"}
    >
      {selectors.map((value, index) => (
        <button
          key={index}
          className={`py-2 px-12 transition-all duration-200 ${
            activeTab === value.id 
              ? "bg-card text-foreground shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          } cursor-pointer font-semibold rounded-md`}
          onClick={() => onTabChange(value.id)}
        >
          {value.title}
        </button>
      ))}
    </div>
  );
};

export default NavTab;
