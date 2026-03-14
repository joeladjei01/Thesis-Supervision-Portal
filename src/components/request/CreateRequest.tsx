import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import CustomSelect from "../shared/custom-select";
import AppInput from "../shared/input/AppInput";
import RichText from "../shared/input/RichText";
import OutlineButton from "../shared/buttons/OutlineButton";
import SolidButton from "../shared/buttons/SolidButton";
import type { Supervisor } from "@/utils/types";

const ValidationSchema = Yup.object().shape({
  proposed_topic: Yup.string().required("Title is required"),
  recipient: Yup.string().required("Recipient is required"),
  supervisor: Yup.string().when("recipient", {
    is: "supervisor",
    then: (schema) => schema.required("Supervisor selection is required"),
    otherwise: (schema) => schema.optional(),
  }),
  details: Yup.string().required("Details are required"),
});

const recipientOptions = [
  { label: "Department Supervisor", value: "supervisor" },
  { label: "Coordinator", value: "department" },
  { label: "SGS Admin", value: "admin" },
];

const CreateRequest = ({ onClose }: { onClose: () => void }) => {
  const { person } = userStore();
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();

  const fetchSupervisors = async (): Promise<Supervisor[]> => {
    try {
      const { data }: any = await axios.get(`/supervisors/supervisor/department/${person.department}/`);
      return data.data;
    } catch (error) {
      toast.error("Error fetching supervisors");
      console.error("Error fetching supervisors:", error);
      throw error;
    }
  };

  const { data: allSupervisors, isLoading: fetchingSupervisors } = useQuery<
    Supervisor[]
  >({
    queryFn: fetchSupervisors,
    queryKey: ["all-supervisors"],
    enabled: true,
  });

  const formik = useFormik({
    initialValues: {
      recipient: "",
      proposed_topic: "",
      supervisor: "",
      details: "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      const url =
        values.recipient == "admin"
          ? "/admin/"
          : values.recipient === "department"
            ? "/department/"
            : `/`;

      try {
        await axios.post(
          `/students/supervisor-requests${url}`,
          {
            supervisor: values.recipient === "supervisor" ? values.supervisor : undefined,
            proposed_topic: values.proposed_topic,
            details: values.details,
            student: person.id,
          },
        );
        toast.success("Request submitted successfully");
        queryClient.invalidateQueries({ queryKey: ["fetch-requests"] });
        queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
        queryClient.invalidateQueries({ queryKey: ["department-requests"] });
        onClose();
      } catch (error) {
        console.error("Error submitting request:", error);
        toast.error("Failed to submit request");
      }
    },
  });

  return (
    <div className="bg-white dark:bg-card p-2 sm:p-4 rounded-xl transition-colors duration-300">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <AppInput
          label="Request Title"
          name="proposed_topic"
          type="text"
          placeholder="What is this request about?"
          formik={formik}
          className="dark:bg-muted/30 dark:border-border"
        />

        <div className="space-y-2">
          <CustomSelect
            label="Select Recipient"
            options={recipientOptions}
            value={formik.values.recipient}
            onChange={(selectedOption) => {
              formik.setFieldValue(
                "recipient",
                selectedOption ,
              );
            }}
            isLoading={fetchingSupervisors}
          />
          {formik.touched.recipient && formik.errors.recipient && (
            <div className="text-destructive text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-1 italic">
              {formik.errors.recipient}
            </div>
          )}
        </div>

        {formik.values.recipient === "supervisor" && (
          <div className="mt-4 space-y-2">
            <CustomSelect
              label="Select Supervisor"
              options={
                allSupervisors?.map((sup) => ({
                  label: sup.name,
                  value: sup.id,
                })) || []
              }
              value={formik.values.supervisor}
              onChange={(selectedOption) => {
                formik.setFieldValue(
                  "supervisor",
                  selectedOption,
                );
              }}
            />
            {formik.touched.supervisor && formik.errors.supervisor && (
              <div className="text-destructive text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-1 italic">
                {formik.errors.supervisor}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 space-y-2">
          <RichText
            label="Details"
            value={formik.values.details}
            onChange={(content) => formik.setFieldValue("details", content)}
          />

          {formik.touched.details && formik.errors.details && (
            <div className="text-destructive text-[10px] font-bold uppercase tracking-wider mt-1.5 ml-1 italic">
              {formik.errors.details}
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-end mt-10 pt-6 border-t border-border">
          <OutlineButton 
            title="Discard" 
            onClick={onClose}
            className="hover:bg-muted transition-colors" 
          />
          <SolidButton
            Icon={
              formik.isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : null
            }
            disabled={!(formik.isValid || formik.isSubmitting) || !formik.dirty}
            title={formik.isSubmitting ? "Submitting..." : "Send Request"}
            type="submit"
            className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;
