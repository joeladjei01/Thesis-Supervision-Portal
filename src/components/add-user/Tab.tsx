/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "react-router";
import { BookOpenIcon, GraduationCap } from "lucide-react";
interface ITabs {
  name: string;
  current: boolean;
  url: string;
  icon: any;
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Tab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userType = searchParams.get("userType") ?? "students";
  const setUserType = (val: { userType: string }) =>
    setSearchParams({ userType: val.userType });

  const tabs: ITabs[] = [
    {
      name: "Students",
      current: userType === "students",
      icon: GraduationCap,
      url: "students",
    },
    {
      name: "Supervisors",
      current: userType === "supervisors",
      url: "supervisors",
      icon: BookOpenIcon,
    },
  ];

  return (
    <div className="my-6">
      <div className="">
        <div className="border-b border-gray-200">
          <nav
            aria-label="Tabs"
            className=" flex justify-center md:justify-evenly gap-2.5"
          >
            {tabs.map((tab) => (
              <span
                key={tab.name}
                aria-current={tab.current ? "page" : undefined}
                className={classNames(
                  tab.current
                    ? "bg-blue-900 text-gray-50"
                    : " text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  " flex items-center cursor-pointer justify-center gap-3 px-5 md:px-7 py-2 text-center text-sm rounded-t-md font-medium hover:cursor-pointer"
                )}
                onClick={() => setUserType({ userType: tab.url })}
              >
                <tab.icon size={19} />
                {tab.name}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
