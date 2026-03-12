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
    <div className="max-w-4xl mx-auto p-2 bg-white">
      <div className="mb-2 border-b border-gray-200 pb-4">
        <h1 className="text-xl text-gray-500 mb-2 font-montserrat font-medium">
          <AiOutlineProfile size={23} className="inline-block mr-1" />
          Proposal Topic
        </h1>
        <h2 className="text-2xl font-bold text-slate-500 ">{proposal.title}</h2>
      </div>

      <div className="border-b border-gray-200 p-4 mb-4">
        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font- text-gray-700 mb-1 font-montserrat">
            Description
          </h3>
          <div className="min-h-50 bg-gray-100/70 p-4 rounded-md border border-gray-300">
            <div
              className="text-gray-700 leading-relaxed text-justify"
              dangerouslySetInnerHTML={{ __html: proposal.description }}
            />
          </div>
        </div>

        {/* Methodology */}
        {proposal.methodology && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 font-montserrat">
              Aim and Objectives
            </h3>
            <div
              className="text-gray-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: proposal.methodology }}
            />
          </div>
        )}
      </div>

      <form onSubmit={formik.handleSubmit}>
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
            <div className={"text-red-600 text-sm mt-1"}>
              {String(formik?.errors.decision)}
            </div>
          )}
        </div>

        {/* Feedback to Student */}
        <div className="mb-8">
          {/* <AppInput
            label="Your Feedback"
            as="textarea"
            formik={formik}
            placeholder="Provide detailed feedback to the student..."
            name="feedback"
           /> */}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <OutlineButton
            title="Cancel"
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors
                      hover:cursor-pointer
                      "
          />

          <SolidButton
            title={"Confirm"}
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                        hover:cursor-pointer
                        disabled:cursor-not-allowed
                         ${
                           !loading
                             ? "ug-blue-background text-white hover:bg-blue-700"
                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
                         }`}
          />
        </div>
      </form>
    </div>
  );
});

export default ProposalReviewForm;
