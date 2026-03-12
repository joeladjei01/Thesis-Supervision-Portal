import { useState } from "react";
import { colleges, schools } from "../../utils/selection";
import CustomSelect from "../shared/custom-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import SolidButton from "../shared/buttons/SolidButton";
import { inputStyles } from "../../utils/helpers";
import SetDepartments from "./SetDepartments";
import SetInstitute from "./SetInstitute";
import { RefreshCcw } from "lucide-react";

const ManageSelector = () => {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectSchoolCollege, setSelectSchoolCollege] = useState<string | null>(
    null,
  );
  const [customSchoolName, setCustomSchoolName] = useState<string>("");
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const { data: addedColleges } = useQuery({
    queryKey: ["added-colleges"],
    queryFn: async () => {
      const response = await axios.get("/selector/colleges");
      return response.data as any[];
    },
  });

  const { mutateAsync: addCollege, isPending: addingCollege } = useMutation({
    mutationFn: async (collegeName: string) => {
      try {
        const response = await axios.post("/selector/colleges/", {
          name: collegeName,
        });
        toast.success("College added successfully");
        return response.data;
      } catch (error) {
        toast.error("Failed to add college");
        console.error("Error adding college:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["added-colleges"],
        refetchType: "all",
      });
    },
  });

  const handleAddCollege = async () => {
    if (selectedCollege) {
      if (
        addedColleges?.some((college: any) => college.name === selectedCollege)
      ) {
        toast.error("College already added");
        return;
      }
      try {
        await addCollege(selectedCollege);
        setSelectedCollege(null);
      } catch (error) {
        console.error("Error in handleAddCollege:", error);
      }
    } else {
      toast.error("Please select a college to add");
    }
  };

  const getSchools = () => {
    if (selectSchoolCollege && addedColleges) {
      const selCol: { name: string } | undefined = addedColleges?.find(
        (col: any) => col.id === selectSchoolCollege,
      );
      if (selCol && schools[selCol.name]) {
        return [
          ...schools[selCol.name],
          { value: "custom", label: "Others(specify)" },
        ];
      }
    }
    return [];
  };

  const { data: addedSchools, isLoading: loadingSchools } = useQuery({
    queryKey: ["added-schools", selectSchoolCollege],
    queryFn: async () => {
      if (!selectSchoolCollege) return [];
      const response = await axios.get(
        `/selector/schools?collegeId=${selectSchoolCollege}`,
      );
      return response.data as any[];
    },
    enabled: !!selectSchoolCollege,
  });

  const { mutateAsync: addSchool, isPending: addingSchool } = useMutation({
    mutationFn: async (schoolName: string) => {
      try {
        const response = await axios.post("/selector/schools/", {
          name: selectedSchool === "custom" ? customSchoolName : schoolName,
          college: selectSchoolCollege,
        });
        toast.success("School added successfully");
        return response.data;
      } catch (error) {
        console.error("Error adding school:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["added-schools", selectSchoolCollege] });
    },
    onError: (error) => {
      toast.error("Failed to add school");
      console.error("Error in addSchool mutation:", error);
    },
  });

  const handleAddSchool = async () => {
    if (selectedSchool) {
      if (addedSchools?.some((school: any) => school.name === selectedSchool)) {
        toast.error("School already added");
        return;
      }
      try {
        if (selectedSchool === "custom" && !customSchoolName) {
            toast.error("Please specify the school name");
            return;
        }
        await addSchool(selectedSchool);
        setSelectedSchool(null);
        setCustomSchoolName("");
      } catch (error) {
        console.error("Error in handleAddSchool:", error);
      }
    } else {
      toast.error("Please select a school to add");
    }
  };

  return (
    <div>
      <div className="mt-6 px-5 border-b-2 border-gray-300 dark:border-border pb-1 mb-4">
        <p className="text-xl text-center tracking-wide font-cal-sans font-semibold text-gray-500 dark:text-gray-400">
          Set Colleges, Schools and Department/Institute/Centres
        </p>
      </div>
      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
          Set Colleges
        </h3>
        <div>
          <CustomSelect
            options={colleges}
            value={selectedCollege || ""}
            onChange={(option: any) => setSelectedCollege(option || null)}
          />
          <SolidButton
            title={addingCollege ? "Adding College..." : "Add College"}
            disabled={addingCollege}
            onClick={handleAddCollege}
            className="mt-4"
          />
        </div>

        <div>
           <p className="mt-6 mb-2 text-sm text-gray-700 dark:text-gray-300 font-medium">Added Colleges</p>
          <div className="px-4 border-t border-gray-300 dark:border-border pt-3">
            {addedColleges?.map((college: any) => (
              <div
                key={college.id}
                className="p-3 mb-2 bg-gray-100 dark:bg-secondary/10 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-border transition-all"
              >
                {college.name.replace(/-/g, " ")}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Manage Schools
          </h3>
          {loadingSchools && (
            <div>
              <RefreshCcw size={15} className="animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <CustomSelect
            label="Select College"
            options={addedColleges?.map((college: any) => ({
              value: college.id,
              label: college.name.replace(/-/g, " "),
            })) || []}
            value={selectSchoolCollege || ""}
            onChange={(option: any) => {
              setSelectSchoolCollege(option || null);
              setSelectedSchool(null);
            }}
          />
          <div>
            <CustomSelect
              label="Select school to be added"
              options={getSchools()}
              value={selectedSchool || ""}
              onChange={(option: any) => setSelectedSchool(option || null)}
            />

            {selectedSchool === "custom" && (
              <input
                type="text"
                value={customSchoolName}
                onChange={(e) => setCustomSchoolName(e.target.value)}
                placeholder="Enter custom school name"
                className={`w-full mt-2 ${inputStyles} dark:bg-secondary/5 dark:text-gray-200 dark:border-border ring-none`}
              />
            )}
          </div>

          <SolidButton
            title={addingSchool ? "Adding..." : "Add"}
            disabled={addingSchool || !selectSchoolCollege}
            onClick={handleAddSchool}
            className="mt-4"
          />
        </div>

        <div className="max-h-96 border border-gray-300 dark:border-border rounded-xl custom-scrollbar overflow-y-auto mt-6">
          <table className="w-full table-auto border-collapse border border-gray-300 dark:border-border">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-gray-300 dark:border-border">
                  School
                </th>
              </tr>
            </thead>
            <tbody>
              {addedSchools?.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No schools added yet.
                  </td>
                </tr>
              )}
              {addedSchools?.map((school: any) => (
                <tr key={school.id} className="border-b border-gray-100 dark:border-border/50">
                  <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4 font-medium hover:bg-gray-50 dark:hover:bg-secondary/10 transition-colors">
                    {school.name.replace(/-/g, " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Departments */}
      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <SetDepartments colleges={addedColleges || []} />
      </div>

      {/* Set Institute */}
      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <SetInstitute colleges={addedColleges || []} />
      </div>
    </div>
  );
};

export default ManageSelector;
