import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AppInput from "../shared/input/AppInput";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import userStore from "../../store";
import OutlineButton from "../shared/buttons/OutlineButton";
import SolidButton from "../shared/buttons/SolidButton";
import RichText from "../shared/input/RichText";
import { useQueryClient } from "@tanstack/react-query";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Topic is required")
    .min(5, "Topic must be at least 5 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  methodology: Yup.string()
    .min(10, "Methodology must be at least 10 characters"),
});

interface TopicSubmissionModalProps {
  onCancel?: () => void;
  selectedTopic?: any;
}

export interface TopicSubmissionModalRef {
  submitForm: () => void;
  isValid: boolean;
  isDirty: boolean;
}

const TopicSubmissionModal = ({ selectedTopic, onCancel }: TopicSubmissionModalProps) => {
  const formik = useFormik({
    initialValues: {
      title: selectedTopic ? selectedTopic.title : "",
      description: selectedTopic ? selectedTopic.description : "",
      methodology: selectedTopic ? selectedTopic.methodology : "",
    },
    validationSchema,
    onSubmit: () => { },
  });
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const student = userStore((state) => state.userInfo);

  async function handleSubmit(values: typeof formik.values) {
    formik.setSubmitting(true);
    try {
      if (selectedTopic) {
        const response = await axiosPrivate.put(`/students/topics/${selectedTopic.id}/retrieve/`, {
          ...values,
          user_id: student.id,
        });
        toast.success("Topic proposal updated successfully");
      } else {
        const response = await axiosPrivate.post("/students/topics/", {
          ...values,
          user_id: student.id,
        });
        console.log("Topic proposal submitted successfully:", response.data);
        toast.success("Topic proposal submitted successfully");
      }

      queryClient.invalidateQueries({
        queryKey: ['student-topics'],
      });
      formik.resetForm();
    } catch (error) {
      console.error("Error submitting topic proposal:", error);
      // Handle error (e.g., show notification to user)
      toast.error("Error submitting topic proposal");
    } finally {
      formik.setSubmitting(false);
      onCancel();
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Student Topic */}
        <AppInput
          label="Proposed Topic"
          name="title"
          type="text"
          placeholder="Enter topic proposal here...."
          formik={formik}
        />

        {/* Description */}
        <div>
          <RichText
            label="Brief Background, Problem Statement and Objective"
            name="description"
            placeholder="Provide a detailed description of your topic proposal"
            onChange={(content) => formik.setFieldValue("description", content)}
            value={formik.values.description}
            onBlur={() => formik.setFieldTouched("description", true)}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-600 text-sm mt-1">
              {formik.errors.description as string}
              </div>
          ) : null}
        </div>


        <div>
          <RichText
            label="Aim and Objectivities (Optional)"
            name="methodology"
            placeholder="Describe the methodology you plan to use for this topic proposal"
            onChange={(content) => formik.setFieldValue("methodology", content)}
            value={formik.values.methodology}
            onBlur={() => formik.setFieldTouched("methodology", true)}
          />
          {formik.touched.methodology && formik.errors.methodology ? (
            <div className="text-red-600 text-sm mt-1">{formik.errors.methodology as string}</div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 items-center mt-4">
          <OutlineButton
            type="button"
            title="Cancel"
            onClick={() => {
              formik.resetForm()
              onCancel()
            }}
            className=""
          />
          <SolidButton
            type="submit"
            disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            title={selectedTopic ? "Update Proposal" : "Submit Topic Proposal"}
            onClick={() => handleSubmit(formik.values)}
            className="py-2"
          />
        </div>
      </form>
    </div>
  );
};

TopicSubmissionModal.displayName = "TopicSubmissionModal";

export default TopicSubmissionModal;
