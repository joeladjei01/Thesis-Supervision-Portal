import usePageTile from "../../hooks/usePageTitle";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { schools } from "../../utils/selection";
import { Eye, Search, XCircle } from "lucide-react";
import { inputStyles, shortenText } from "../../utils/helpers";
import { FaSchool, FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router";
import Loading from "../../components/shared/loader/Loading";
import { cardDefaultStyle } from "@/utils/utils";

type department = {
  id: string;
  name: string;
  school: string;
  college: string;
  head?: string;
};

const UserMangement = () => {
  usePageTile("User Management");
  const navigate = useNavigate();
  // const [allDepartments, setAllDepartments] = useState<department []>([])
  const [query, setQuery] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const axios = useAxiosPrivate();

  const fetchAllDepartments = async () => {
    try {
      const { data }: any = await axios.get("/departments/");
      // setAllDepartments(data);
      console.log("Departments fetched:", data);
      return data as department[];
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to fetch departments");
    }
  };

  const { isLoading: fetchingAllDepart, data: allDepart } = useQuery({
    queryFn: fetchAllDepartments,
    queryKey: ["fetch-all-departments"],
  });

  // u++seEffect(() => {
  //     fetchDepart();
  // }, [])

  const handleView = (deptId: string) => {
    navigate(`/user-management/edit-user/${deptId}`);
  };

  const removeDash = (str: string) => {
    return str.replace(/-/g, " ");
  };

  const getSchoolOptions = () => {
    if (!selectedCollege) return [];
    const schoolsOpt = schools[selectedCollege];
    return [...schoolsOpt, { value: "institute", label: "Institute/Centre" }];
  };

  // Filter departments based on search query and selected filters
  const filteredDepartments = useMemo(() => {
    let filtered = allDepart || [];

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(query.toLowerCase()) ||
          dept.school.toLowerCase().includes(query.toLowerCase()) ||
          dept.college.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // Filter by selected college
    if (selectedCollege) {
      filtered = filtered.filter((dept) => dept.college === selectedCollege);
    }

    // Filter by selected school
    if (selectedSchool) {
      filtered = filtered.filter((dept) => dept.school === selectedSchool);
    }

    return filtered;
  }, [allDepart, query, selectedCollege, selectedSchool]);

  // Clear all filters
  const clearFilters = () => {
    setQuery("");
    setSelectedCollege("");
    setSelectedSchool("");
  };

  // Clear school selection when college changes
  useEffect(() => {
    if (selectedCollege && selectedSchool) {
      const schoolOptions = schools[selectedCollege] || [];
      const schoolExists = schoolOptions.some(
        (school) => school.value === selectedSchool,
      );
      if (!schoolExists) {
        setSelectedSchool("");
      }
    }
  }, [selectedCollege, selectedSchool]);

  return (
    <div>
      <div>
        <div className="w-full">
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search departments/institute/centre"
              className={`w-full bg-white py-2 px-3 pl-11 ${inputStyles}`}
            />

            {query && (
              <XCircle
                size={18}
                className="absolute top-3 right-2 text-gray-400"
                onClick={clearFilters}
              />
            )}
          </div>

          {/* <div className='grid grid-cols-2 gap-3 mb-4'>
                        <CustomSelect
                            classNamePrefix="select college"
                            options={colleges}
                            value={selectedCollege}
                            onChange={option => setSelectedCollege(option?.value || '')}
                            isClearable
                        />

                        <CustomSelect
                            classNamePrefix="select school"
                            options={getSchoolOptions()}
                            value={selectedSchool}
                            onChange={option => setSelectedSchool(option?.value || '')}
                            isClearable
                            disabled={!selectedCollege}
                        />
                    </div> */}

          {/* Filter Summary and Clear Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {filteredDepartments.length} of {allDepart?.length}{" "}
              departments
              {(query || selectedCollege || selectedSchool) && (
                <span className="ml-2">(filtered)</span>
              )}
            </div>
            {/* {(query || selectedCollege || selectedSchool) && (
                            <button
                                onClick={clearFilters}
                                className='px-3 py-1 text-sm text-blue-900 hover:text-blue-800 border border-blue-700 cursor-pointer rounded-md hover:bg-blue-50 transition-colors'
                            >
                                Clear Filters
                            </button>
                        )} */}
          </div>
        </div>

        <div className={`${cardDefaultStyle} min-h-100 mt-5`}>
          {/* Loading State */}
          {fetchingAllDepart && <Loading message="loading..." />}

          {/* Departments Grid */}
          {!fetchingAllDepart && (
            <>
              {filteredDepartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDepartments.map((dept) => (
                    <div
                      key={dept.id}
                      className={`' border-r-5 border-l-3 border cursor-pointer rounded-md p-4 shadow-sm hover:shadow-md transition-shadow
                                                ${dept.school === "institute" ? "border-gray-300 border-l-sky-700" : "border-gray-300 border-l-gray-600"}
                                                `}
                      onClick={() =>
                        navigate(`/user-management/edit-user/${dept.id}`)
                      }
                    >
                      <div className="flex justify-between items-center  pb-2 border-b border-gray-300 mb-2">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-white">
                          {shortenText(dept.name, 40)}
                        </h3>
                        <div className="flex gap-2 ">
                          <Eye
                            onClick={() => handleView(dept.id)}
                            size={19}
                            className=" text-gray-500 hover:text-gray-800 cursor-pointer"
                          />
                        </div>
                      </div>
                      <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-100 mb-1">
                        <FaSchool />
                        <span className="font-semibold">School:</span>{" "}
                        {removeDash(dept.school)}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-100 mb-1">
                        <FaBookOpen className="" />
                        <span className=" font-semibold">College:</span>{" "}
                        {removeDash(dept.college)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    {allDepart?.length === 0
                      ? "No departments found."
                      : "No departments match your search criteria."}
                  </div>
                  {(query || selectedCollege || selectedSchool) && (
                    <button
                      onClick={clearFilters}
                      className="mt-2 px-4 py-2 text-sm text-blue-900 hover:text-blue-800 border border-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMangement;
