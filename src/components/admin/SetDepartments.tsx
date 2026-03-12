import { useEffect, useState } from "react";
import CustomSelect from "../shared/custom-select";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inputStyles } from "../../utils/helpers";
import SolidButton from "../shared/buttons/SolidButton";
import toast from "react-hot-toast";
import { RefreshCcw } from "lucide-react";

interface SetDepartmentsProps {
  colleges: any[];
}

interface SchoolData {
  id: string;
  name: string;
  college: {
    id: string;
    name: string;
  };
}

const SetDepartments = ({ colleges }: SetDepartmentsProps) => {
  const [selectSchoolCollege, setSelectSchoolCollege] = useState<string | null>(
    null,
  );
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [customDepartmentName, setCustomDepartmentName] = useState<string>("");
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const { data: schools, isLoading: loadingSchools } = useQuery({
    queryKey: ["schools", selectSchoolCollege],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/selector/schools?collegeId=${selectSchoolCollege}`,
        );
        return data as SchoolData[];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    enabled: !!selectSchoolCollege,
  });

  const { data: departments, isLoading: loadingDepartments } = useQuery({
    queryKey: ["departments", selectedSchool],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/selector/departments?schoolId=${selectedSchool}`,
        );
        return data as any[];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    enabled: !!selectedSchool,
  });

  useEffect(() => {
    if (selectSchoolCollege) {
      queryClient.invalidateQueries({ queryKey: ["schools", selectSchoolCollege] });
    }
  }, [selectSchoolCollege, queryClient]);

  useEffect(() => {
    if (selectedSchool) {
      queryClient.invalidateQueries({ queryKey: ["departments", selectedSchool] });
    }
  }, [selectedSchool, queryClient]);

  const { mutateAsync: addDepartment, isPending: addingDepartment } =
    useMutation({
      mutationFn: async (departmentName: string) => {
        try {
          await axios.post("/selector/departments/", {
            name: departmentName,
            school: selectedSchool,
          });
          toast.success("Department added successfully");
        } catch (error) {
          toast.error("Failed to add department");
          throw error;
        }
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["departments", selectedSchool],
        });
      },
    });

  const handleAddDepartment = async () => {
    if (!customDepartmentName) {
      toast.error("Please enter a department name");
      return;
    }
    await addDepartment(customDepartmentName);
    setCustomDepartmentName("");
  };

  const getSchools = () => {
    if (!schools) return [];
    return schools.map((school: SchoolData) => ({
      value: school.id,
      label: school.name.replace(/-/g, " "),
    }));
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Manage Departments
          </h3>
          {loadingDepartments && (
            <div>
              <RefreshCcw size={15} className="animate-spin text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>

        <div>
          <CustomSelect
            label="Select College"
            options={colleges?.map((college: any) => ({
              value: college.id,
              label: college.name.replace(/-/g, " "),
            }))}
            
            value={selectSchoolCollege || ""}
            onChange={(option: any) => {
              setSelectSchoolCollege(option || null);
              setSelectedSchool(null);
            }}
          />
          <div className="mt-4 space-y-4">
            <CustomSelect
              label="Select School"
              options={getSchools()}
              value={selectedSchool || ""}
              
              isLoading={loadingSchools}
              onChange={(option: any) => setSelectedSchool(option || null)}
            />

            <input
              type="text"
              value={customDepartmentName}
              onChange={(e) => setCustomDepartmentName(e.target.value)}
              placeholder="Enter department name eg. Department of Computer Science"
              disabled={!selectedSchool}
              className={`w-full ${inputStyles} dark:bg-secondary/5 dark:text-gray-200 dark:border-border ring-none disabled:cursor-not-allowed transition-all`}
            />
          </div>

          <SolidButton
            title={addingDepartment ? "Adding..." : "Add"}
            disabled={addingDepartment || !selectedSchool}
            onClick={handleAddDepartment}
            className="mt-4"
          />
        </div>

        {!selectedSchool && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Please select a school to view its departments.
          </p>
        )}

        {selectedSchool && (
          <div className="max-h-96 border border-gray-300 dark:border-border rounded-xl custom-scrollbar overflow-y-auto mt-6">
            <table className="w-full table-auto border-collapse border border-gray-300 dark:border-border">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-gray-300 dark:border-border">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments?.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No departments added yet.
                    </td>
                  </tr>
                )}
                {departments?.map((department: any) => (
                  <tr key={department.id} className="border-b border-gray-100 dark:border-border/50">
                    <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4 font-medium hover:bg-gray-50 dark:hover:bg-secondary/10 transition-colors">
                      {department.name.replace(/-/g, " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetDepartments;
