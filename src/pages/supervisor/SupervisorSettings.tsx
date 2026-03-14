import userStore from "../../store";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Header from "../../components/shared/text/Header";
import SolidButton from "../../components/shared/buttons/SolidButton";
import { Loader2, Save, Tags } from "lucide-react";
import MultiSelect from "../../components/shared/custom-select/MultiSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePageTile from "../../hooks/usePageTitle";

interface ResearchArea {
  id: string;
  name: string;
}

const ResearchAreaSettings = () => {
  const { person, userInfo, updatePerson } = userStore();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  // Fetch all research areas available in the department
  const { data: departmentAreas, isLoading: loadingDeptAreas } = useQuery({
    queryKey: ["department-research-areas", userInfo?.department_id?.department?.id],
    queryFn: async () => {
      const { data }: any = await axios.get(
        `/departments/department-research-areas/${userInfo?.department_id?.department?.id}/`
      );
      return data.data as ResearchArea[];
    },
    enabled: !!userInfo?.department_id?.department?.id,
  });

  // Fetch supervisor's current details to get their research areas
  const { data: supervisorDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ["supervisor-details", person?.id],
    queryFn: async () => {
      const { data }: any = await axios.get(
        `/supervisors/supervisor/retrieve/${person?.id}/`
      );
      return data.data;
    },
    enabled: !!person?.id,
  });

  const formik = useFormik({
    initialValues: {
      research_area: supervisorDetails?.research_area?.map((ra: any) => ra.id) || [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      research_area: Yup.array().of(Yup.string()).min(1, "Select at least one area"),
    }),
    onSubmit: async (values) => {
      mutate(values);
    },
  });

  const { mutate, isPending: updating } = useMutation({
    mutationFn: async (values: any) => {
      const { data } = await axios.put(`/supervisors/supervisor/update/${person?.id}/`, {
        research_area: values.research_area,
      });
      return data;
    },
    onSuccess: (data: any) => {
      toast.success("Research areas updated successfully");
      if (data?.data) {
        updatePerson(data.data);
      }
      queryClient.invalidateQueries({ queryKey: ["supervisor-details", person?.id] });
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("Failed to update research areas");
    },
  });

  const options = departmentAreas?.map((area) => ({
    value: area.id,
    label: area.name,
  })) || [];

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden shadow-lg transition-all duration-300">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Tags className="w-5 h-5 text-primary dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Research Interests</h3>
            <p className="text-sm text-muted-foreground">Select the areas you are interested in supervising</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {(loadingDeptAreas || loadingDetails) ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="w-full">
              <MultiSelect
                label="Research Areas"
                value={formik.values.research_area}
                options={options}
                onChange={(selected) => formik.setFieldValue("research_area", selected)}
              />
              {formik.touched.research_area && formik.errors.research_area && (
                <p className="text-destructive text-xs mt-2 font-medium">{formik.errors.research_area as string}</p>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-border">
              <SolidButton
                title={updating ? "Saving Changes..." : "Save Research Areas"}
                type="submit"
                disabled={updating || !formik.dirty}
                Icon={updating ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const SupervisorSettings = () => {
  usePageTile("Supervisor Settings | ThesisFlow");

  return (
    <div className="min-h-screen">
      <div className=" mx-auto space-y-8">
        <Header 
          title="Profile Settings" 
          subtitle="Manage your professional information and research preferences" 
        />

        <div className="space-y-6">
          <ResearchAreaSettings />
          
          {/* Future sections like password change, etc. can go here */}
        </div>
      </div>
    </div>
  );
};

export default SupervisorSettings;
