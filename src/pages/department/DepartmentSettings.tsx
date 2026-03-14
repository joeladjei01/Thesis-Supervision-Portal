import React from "react";
import userStore from "../../store/index";
import usePageTile from "../../hooks/usePageTitle";
import SetProgrammeTitles from "../../components/department/SetProgrammeTitles";
import Header from "../../components/shared/text/Header";
import SetQuota from "../../components/department/SetQuota";
import SetRearchAreas from "../../components/department/SetRearchAreas";
import { accountType } from "../../utils/helpers";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import DepartmentChapters from "../../components/department/DepartmentChapters";
import toast from "react-hot-toast";
import { Copy, BookOpen, Loader2 } from "lucide-react";

const DepartmentSettings: React.FC = () => {
  usePageTile("Department Settings");
  const axios = useAxiosPrivate();

  const { person, userInfo } = userStore();

  const { data: programmeLevels, isLoading: fetchProgrammeLevels } = useQuery({
    queryKey: ["programme-levels"],
    queryFn: async () => {
      const { data }: any = await axios.get("/superadmin/programme-levels/");
      return data.data || [];
    },
    enabled: true,
  });

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header
        title={`${accountType(userInfo.school)} Settings`}
        subtitle={`Manage settings for ${
          userInfo.school === "institute"
            ? ""
            : person?.department.name.includes("department of")
              ? ""
              : "department of"
        } ${person?.department.name}`}
      />

      {/* Program Titles Section */}
      <div>
        <SetProgrammeTitles />
      </div>

      {/* Research Areas Section */}
      <SetRearchAreas />

      <SetQuota />

      <div className="mt-5">
        <DepartmentChapters
          allLevels={programmeLevels}
          fetchProgrammeLevels={fetchProgrammeLevels}
        />
      </div>

      {/* <div className="mt-8">
        {/* Display programme levels with the id and the title 
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4  ">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-500 ">
                Programme Levels
              </h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all available programme levels
            </p>
          </div>

          {fetchProgrammeLevels ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600">
                Loading programme levels...
              </span>
            </div>
          ) : programmeLevels && programmeLevels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {programmeLevels.map((level: any) => (
                    <tr
                      key={level.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {level.title || level.name || "N/A"}
                        </span>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                No programme levels available
              </p>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default DepartmentSettings;
