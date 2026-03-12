import { useEffect, useState } from "react";
import CustomSelect from "../shared/custom-select";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inputStyles } from "../../utils/helpers";
import SolidButton from "../shared/buttons/SolidButton";
import toast from "react-hot-toast";
import { RefreshCcw } from "lucide-react";

interface SetInstituteProps {
  colleges: any[];
}

const SetInstitute = ({ colleges }: SetInstituteProps) => {
  const [selectSchoolCollege, setSelectSchoolCollege] = useState<string | null>(
    null,
  );
  const [customInstituteName, setCustomInstituteName] = useState<string>("");
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const { data: institutes, isLoading: loadingInstitutes } = useQuery({
    queryKey: ["institutes", selectSchoolCollege],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/selector/centers-and-institutes?collegeId=${selectSchoolCollege}`,
        );
        return data as any[];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    enabled: !!selectSchoolCollege,
  });

  useEffect(() => {
    if (selectSchoolCollege) {
      queryClient.invalidateQueries({ queryKey: ["institutes", selectSchoolCollege] });
    }
  }, [selectSchoolCollege, queryClient]);

  const { mutateAsync: addInstitute, isPending: addingInstitute } = useMutation(
    {
      mutationFn: async (instituteName: string) => {
        try {
          await axios.post("/selector/centers-and-institutes/", {
            name: instituteName,
            college: selectSchoolCollege,
          });
          toast.success("Institute added successfully");
        } catch (error) {
          toast.error("Failed to add institute");
          throw error;
        }
      },
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["institutes", selectSchoolCollege] });
      },
    },
  );

  const handleAddInstitute = async () => {
    if (!customInstituteName) {
      toast.error("Please enter a name");
      return;
    }
    await addInstitute(customInstituteName);
    setCustomInstituteName("");
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Manage Institutes and Centres
          </h3>
          {loadingInstitutes && (
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
            }}
          />
          <div className="mt-4">
            <input
              type="text"
              value={customInstituteName}
              onChange={(e) => setCustomInstituteName(e.target.value)}
              placeholder="Enter Institute or Centre name"
              disabled={!selectSchoolCollege}
              className={`w-full ${inputStyles} dark:bg-secondary/5 dark:text-gray-200 dark:border-border ring-none disabled:cursor-not-allowed transition-all`}
            />
          </div>

          <SolidButton
            title={addingInstitute ? "Adding..." : "Add"}
            disabled={addingInstitute || !selectSchoolCollege}
            onClick={handleAddInstitute}
            className="mt-4"
          />
        </div>

        {!selectSchoolCollege && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Please select a college to view its institutes/centres.
          </p>
        )}

        {selectSchoolCollege && (
          <div className="max-h-96 border border-gray-300 dark:border-border rounded-xl custom-scrollbar overflow-y-auto mt-6">
            <table className="w-full table-auto border-collapse border border-gray-300 dark:border-border">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 border-b border-gray-300 dark:border-border">
                    Institute/Centre
                  </th>
                </tr>
              </thead>
              <tbody>
                {institutes?.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      No institutes added yet.
                    </td>
                  </tr>
                )}
                {institutes?.map((institute: any) => (
                  <tr key={institute.id} className="border-b border-gray-100 dark:border-border/50">
                    <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4 font-medium hover:bg-gray-50 dark:hover:bg-secondary/10 transition-colors">
                      {institute.name.replace(/-/g, " ")}
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

export default SetInstitute;
