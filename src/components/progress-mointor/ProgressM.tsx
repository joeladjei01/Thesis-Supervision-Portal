import React, { useState } from "react";
import { MdKeyboardArrowDown as ChevronDownIcon } from "react-icons/md";
import { Search } from "lucide-react";
import NavTab, { type selectorsType } from "../shared/Tab/NavTab";
import Header from "../shared/text/Header";
import CustomSelect from "../shared/custom-select/index";
import DepartmentProgressAnalytics from "./DepartmentProgressAnalytics";

// Types
interface SupervisorData {
  name: string;
  staffId: string;
  noOfStudents: number;
  lastInteraction: string;
  noOfMeetings: number;
  progressionRate: number;
}

interface SelectOption {
  value: string;
  label: string;
}

const SupervisorsTable: React.FC<{ data: SupervisorData[] }> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supervisor Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Staff ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No. of Students
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Interaction
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No. of Meetings
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progression Rate
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((supervisor, index) => (
            <tr key={index} className="hover:bg-gray-50 text-blue-900">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className=" font-medium">{supervisor.name}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {supervisor.staffId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                {supervisor.noOfStudents}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {supervisor.lastInteraction}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                {supervisor.noOfMeetings}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {supervisor.progressionRate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tabs: selectorsType[] = [
  { id: "up", title: "Student progress" },
  { id: "hs", title: "Supervisors Engagement" },
  { id: "tp", title: "Progress Analytics" },
];

// Main Dashboard Component
const UniversityAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("up");

  return (
    <div className="">
      <div>
        {/* <Header
          title={"Department Progress Dashboard"}
          subtitle={"Track progress and engagement at the departments level"}
        /> */}
        <Header
          title={"Student Progress"}
          subtitle={"Monitor the progress of students"}
        />

        <div className="mb-8">
          {/* <Header title={"Progress Monitor"} /> */}

          {/* <div className="grid grid-cols-3 gap-3">
            <CustomSelect
              label="College Name"
              value={collegeName}
              onChange={(option) => setCollegeName(option?.value || "")}
              options={collegeOptions}
              placeholder="select college name...."
            />
            <CustomSelect
              label="School Name"
              value={schoolName}
              onChange={(option) => setSchoolName(option?.value || "")}
              options={schoolOptions}
              placeholder="select school name....."
            />
            <CustomSelect
              label="Department Name"
              value={departmentName}
              onChange={(option) => setDepartmentName(option?.value || "")}
              options={departmentOptions}
              placeholder="select department name....."
            />
          </div> */}
        </div>

        {/* <NavTab
          selectors={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={"mt-4"}>
          {activeTab === "hs" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Supervisors Engagement
                </h2>
                <p className="text-gray-600 mb-4">
                  Monitor the Supervisors Engagement
                </p>

                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search Supervisors....."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="ml-4">
                    <div className="relative">
                      <select
                        value={selectedSupervisor}
                        onChange={(e) => setSelectedSupervisor(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {supervisorFilterOptions.map((option) => (
                          <option key={option.value} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <SupervisorsTable data={supervisorsData} />
            </div>
          )}

          {activeTab == "up" && (
            <div>
              <StudentProgress />
            </div>
          )}

          {activeTab == "tp" && (
            <div>
              <DepartmentProgressAnalytics />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default UniversityAdminDashboard;
