import { forwardRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import type {
  ProposalReviewModalRef,
  TopicProposal,
} from "../../../utils/types";
import CustomSelect from "../../shared/custom-select";
import { handleSelectionOnChange } from "../../../utils/helpers";
import OutlineButton from "../../shared/buttons/OutlineButton";
import SolidButton from "../../shared/buttons/SolidButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AiOutlineProfile } from "react-icons/ai";

const validationSchema = Yup.object().shape({
  decision: Yup.string().required("Please select a decision"),
  // feedback: Yup.string()
  //   .min(10, "Feedback must be at least 10 characters"),
});

interface ProposalReviewProps {
  proposal: TopicProposal;
  handleCancel: () => void;
  closeModal: (value: boolean) => void;
}

const ProposalReviewForm = forwardRef<
  ProposalReviewModalRef,
  ProposalReviewProps
>(({ proposal, handleCancel, closeModal }) => {
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();

  const handleStatusSubmit = async (values: typeof formik.values) => {
    try {
      proposal.status = values.decision;
      return axios.put(`students/topics/${proposal.id}/status/`, {
        status: values.decision,
      });
    } catch (error) {
      throw error;
    }
  };

  // const handleFeedbackSubmit = async (values: typeof formik.values) => {
  //   proposal.status = values.feedback;
  //   return axios.post(`students/topics/feedback/`, {
  //     feedback: values.decision,
  //     topic: proposal.id,
  //     supervisor: person.id,
  //   });
  // };

  const handleSubmit = async (values: typeof formik.values) => {
    await handleStatusSubmit(values);

    // if(values.feedback && values.feedback.length > 0){
    //   await handleFeedbackSubmit(values);
    // }
  };

  const { isPending: loading, mutate } = useMutation({
    mutationFn: handleSubmit,
    onError: (error) => {
      console.log(error);
      toast.error("Review failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchProposals"] });
      toast.success("Action is successfull");
      closeModal(false);
      formik.resetForm();
    },
  });

  const formik = useFormik({
    initialValues: {
      decision: proposal.status || "",
      // feedback: "trial",
    },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  // Expose the submit method through the ref
  // useImperativeHandle(ref, () => ({
  //   submit: () => {
  //     handleSubmit(formik.values);
  //   },
  // }));

  const decisionOptions = [
    { value: "approved", label: "Approve", color: "text-green-700" },
    { value: "revise", label: "Revise and Resubmit", color: "text-yellow-700" },
    { value: "rejected", label: "Reject", color: "text-red-700" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-2 bg-white dark:bg-card">
      <div className="mb-6 border-b border-gray-100 dark:border-border pb-6">
        <h1 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 font-montserrat uppercase tracking-widest flex items-center gap-2">
          <AiOutlineProfile size={18} />
          Proposal Topic Detail
        </h1>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">{proposal.title}</h2>
      </div>

      <div className="space-y-8 mb-10">
        {/* Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Executive Background
            </h3>
          </div>
          <div className="bg-gray-50 dark:bg-secondary/10 p-6 rounded-2xl border border-gray-100 dark:border-border/40 shadow-inner">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify prose dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: proposal.description }}
            />
          </div>
        </div>

        {/* Methodology */}
        {proposal.methodology && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Aim and Objectives
              </h3>
            </div>
            <div className="bg-blue-50/30 dark:bg-blue-900/5 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/20">
              <div
                className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: proposal.methodology }}
              />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={formik.handleSubmit} className="pt-8 border-t border-gray-100 dark:border-border">
        <div className="mb-8">
          {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Decision
          </h3> */}

          <CustomSelect
            label="Select Decision"
            value={formik.values.decision}
            options={decisionOptions}
            onChange={(option) =>
              handleSelectionOnChange(option, "decision", formik)
            }
          />

          {formik?.touched.decision && formik?.errors.decision && (
            <div className={"text-rose-600 dark:text-rose-400 text-xs font-bold mt-2 flex items-center gap-1"}>
              <span className="w-1 h-1 bg-current rounded-full" />
              {String(formik?.errors.decision)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pt-4">
          <OutlineButton
            title="Discard Review"
            type="button"
            onClick={handleCancel}
            className="px-8 py-2.5 text-xs font-bold uppercase tracking-widest transition-all"
          />

          <SolidButton
            title={loading ? "Processing..." : "Submit Review"}
            type="submit"
            disabled={loading}
            className={`px-10 py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
              loading ? "opacity-50 cursor-not-allowed" : "shadow-blue-500/20"
            }`}
          />
        </div>
      </form>
    </div>
  );
});

export default ProposalReviewForm;
