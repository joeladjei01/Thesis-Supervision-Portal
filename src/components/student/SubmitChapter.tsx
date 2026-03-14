import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomSelect from "../shared/custom-select";
import SolidButton from "../shared/buttons/SolidButton";
import OutlineButton from "../shared/buttons/OutlineButton";
import { Calendar, Check, File, Loader2, Save, Trash } from "lucide-react";
import {
  chapters,
  formatDate,
  getDaysLeft,
  getFileNameFromURL,
} from "../../utils/helpers";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import RichText from "../shared/input/RichText";
import userStore from "../../store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { FaFilePdf, FaFilePowerpoint, FaFileWord } from "react-icons/fa";
import Loading from "../shared/loader/Loading";
import type {
  ChapterSubmission,
  ChapterSubmissionFeedback,
} from "../../utils/types";

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "pdf":
      return <FaFilePdf className="text-destructive mr-2" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-primary mr-2" />;
    case "ppt":
    case "pptx":
      return <FaFilePowerpoint className="text-orange-500 mr-2" />;
    default:
      return <File className="text-muted-foreground mr-2" />;
  }
};

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
// const SUPPORTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const SUPPORTED_FILE_EXTENSIONS = [".pdf", ".doc", ".docx"];

interface FileDropzoneProps {
  fieldName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  files: File[];
  error?: string;
  touched?: boolean;
}

/** Renders a custom drag-and-drop file input that supports multiple files. */
export const FileDropzone: React.FC<FileDropzoneProps> = ({
  fieldName,
  setFieldValue,
  files,
  error,
  touched,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Memoize the handleFileChange function
  const handleFileChange = useCallback(
    (selectedFiles: File[]) => {
      // Manually set the value in Formik state
      setFieldValue(fieldName, selectedFiles, true);
    },
    [fieldName, setFieldValue],
  );

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files);
        handleFileChange([...files, ...newFiles]);
      }
    },
    [handleFileChange, files],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        handleFileChange([...files, ...newFiles]);
      }
    },
    [handleFileChange, files],
  );

  const removeFile = useCallback(
    (indexToRemove: number) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      handleFileChange(updatedFiles);
    },
    [files, handleFileChange],
  );

  const displayText = useMemo(() => {
    return files?.length > 0
      ? ""
      : `PDF, DOC or DOCX (MAX. ${MAX_FILE_SIZE / 1024 / 1024}MB each)`;
  }, [files]);

  const totalSize = useMemo(() => {
    return files.reduce((total, file) => total + file.size, 0);
  }, [files]);

  return (
    <div className="mb-6">
      <label className={"text-foreground mb-3 text-sm font-semibold uppercase tracking-wider block"}>
        Upload Documents
      </label>
      <div
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300
            ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/50"
            }
            ${touched && error ? "border-destructive bg-destructive/5" : ""}
          `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload-input")?.click()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary/60 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <p
          className={`font-bold text-sm ${
            files.length > 0 ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {files.length > 0
            ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
            : "Click to upload or drag and drop"}
        </p>

        {files.length > 0 && (
          <div className="w-full mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-4 bg-card border border-border p-3 rounded-lg text-sm text-foreground shadow-sm"
              >
                <div className="flex-1 text-left">
                  <p className="font-semibold text-xs truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-destructive/10 p-1.5 hover:bg-destructive text-destructive hover:text-destructive-foreground rounded-md transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <p
          className={`text-xs mt-1 ${
            touched && error ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {files.length > 0
            ? `Total: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
            : displayText}
        </p>
        {touched && error && (
          <p className="text-xs text-destructive mt-2 font-semibold italic">{error}</p>
        )}
        <input
          id="file-upload-input"
          name={fieldName}
          type="file"
          multiple
          accept={SUPPORTED_FILE_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="hidden"
          // We don't use Formik's onBlur/value for file input directly, but we do trigger validation
          onBlur={() => setFieldValue(fieldName, files, true)}
        />
      </div>
    </div>
  );
};

//---------------------------------------------------------------
// Main Component
//---------------------------------------------------------------

type SubmitChapterProps = {
  onClose?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedChapter?: any;
  refresh?: () => void;
};

const SubmitChapter = ({ selectedChapter }: SubmitChapterProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const chapterOptions = chapters;
  const person = userStore((state) => state.person);
  const axios = useAxiosPrivate();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
    queryClient.invalidateQueries({ queryKey: ["student-chapters"] });
    queryClient.invalidateQueries({ queryKey: ["student-feedbacks"] });
    // queryClient.invalidateQueries({ queryKey: ['student-chapter-submissions', person.id] });
    mutateSubmissions();
  };

  const onClose = () => {
    navigate(-1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    formik.setSubmitting(true);
    // if (values.files.length === 0 && values.description.length <= 11) {
    //   toast.error("Please provide a description or upload at least one file.");
    //   return;
    // }
    try {
      if (values.description.trim() === "") {
        values.description = "None";
      }
      const formData = new FormData();
      formData.append("content", values.description);
      formData.append("title", selectedChapter.chapter.custom_title);
      formData.append("chapter_assignment", selectedChapter.id);
      formData.append("supervisor", selectedChapter.supervisor.id);
      formData.append("status", "submitted");
      values.files.forEach((file: File) => {
        formData.append("files", file);
      }); // Append the files

      if (!(values.files.length === 0)) {
        const response = await axios.post(
          `/students/chapter/create/${person?.id}/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Chapter submitted successfully.");
      } else {
        const response = await axios.post(
          `/students/chapter/create/${person?.id}/`,
          {
            content: values.description,
            title: selectedChapter.chapter.custom_title,
            chapter_assignment: selectedChapter.id,
            status: "submitted",
            supervisor: selectedChapter.supervisor.id,
          },
        );
      }
      toast.success("Chapter submitted successfully.");
      refresh();
      handleCancel();
      formik.resetForm();
    } catch (error) {
      console.log("error", error.response.status);
      if (error.response.status === 413) {
        toast.error(
          "File size exceeds the maximum limit. Please upload a smaller file.",
        );
        return;
      }
      toast.error("Error submitting chapter. Please try again.");
      console.error("Error submitting chapter:", error);
    } finally {
      formik.setSubmitting(false);
    }
  };

  const { mutateAsync: mutateSubmit, isPending: isSubmitting } = useMutation({
    mutationFn: handleSubmit,
  });

  const {
    data: submissions,
    isPending: isPending,
    mutateAsync: mutateSubmissions,
  } = useMutation({
    mutationFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/student/${person.id}/`,
        );
        const previousSubmit = data.data.find(
          (fb: any) => fb.chapter_assignment.id === selectedChapter.id || null,
        );

        if (previousSubmit?.status === "draft") {
          formik.setFieldValue("description", previousSubmit.content);
        }
        return data.data as ChapterSubmission[];
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
      }
    },

    // queryKey: ['student-chapter-submissions', person.id],
  });

  const previousSubmission: ChapterSubmission = submissions?.find(
    (fb: any) => fb.chapter_assignment.id === selectedChapter.id || null,
  );

  console.log(previousSubmission);

  const { data: ChapterSubmissionFeedback, isLoading: fetchingFeedbacks } =
    useQuery({
      queryKey: ["feedback-chapter", previousSubmission?.id],
      queryFn: async () => {
        try {
          const { data }: any = await axios.get(
            `/students/chapter/${previousSubmission?.id}/feedbacks/`,
          );
          console.log("Feddback data", data.data);
          return data.data as ChapterSubmissionFeedback[];
        } catch (error) {}
      },
      enabled: !!previousSubmission?.id,
    });
  const { data: chapterSubData } = useQuery({
    queryKey: ["chapter-data", previousSubmission?.id],
    queryFn: async () => {
      try {
        const {
          data: { data },
        }: any = await axios.get(
          `/students/chapter/retrieve/${previousSubmission?.id}/`,
        );
        return data;
      } catch (error) {
        toast.error("Error creating chapter feedback. Please try again.");
        console.error("Error fetching chapter data:", error);
        return null;
      }
    },
    enabled: !!previousSubmission?.id,
  });

  useEffect(() => {
    mutateSubmissions();
  }, [selectedChapter]);

  const latestFeedback = ChapterSubmissionFeedback?.length
    ? ChapterSubmissionFeedback[ChapterSubmissionFeedback.length - 1]
    : null;

  const isApprovedByFeedback = latestFeedback?.decision === "approved";

  const isApproved =
    previousSubmission?.approved === true || chapterSubData?.approved === true;

  const hideSubmissionFields = isApproved || isApprovedByFeedback;

  const getDecisionColor = (decision: string | undefined) => {
    if (!decision) return "bg-muted text-muted-foreground border-border";
    switch (decision.toLowerCase()) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "revise":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "reject":
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };


  const formik = useFormik({
    initialValues: {
      submissionType: selectedChapter
        ? (selectedChapter.chapter.custom_title as string)
        : "",
      description:
        previousSubmission?.status == "draft" ? previousSubmission.content : "",
      files: [],
    },
    validationSchema: Yup.object({
      submissionType: Yup.string().required("Submission type is required"),
      description: Yup.string(),
      files: Yup.array().of(
        Yup.mixed()
          .test(
            "fileSize",
            "File size must be less than 10MB",
            (value: any) => value && value.size <= 10 * 1024 * 1024,
          )
          .test(
            "fileType",
            "Supported file types are PDF, DOC, and DOCX",
            (value: any) =>
              value &&
              [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ].includes(value.type),
          ),
      ),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      if (
        previousSubmission?.status === "draft" &&
        values.files.length === 0 &&
        values.description.trim() === "" &&
        previousSubmission?.approved === false
      ) {
        if (previousSubmission?.files && previousSubmission.files.length > 0) {
          await axios.put(
            `/students/chapter/update/${previousSubmission.id}/`,
            {
              status: "submitted",
            },
          );
          toast.success(
            "Resubmission initiated. You can now submit a new document.",
          );
        }
        return;
      }

      if (values.files.length === 0 && values.description.trim() === "") {
        toast.error(
          "Please provide a description or upload at least one file.",
        );
        return;
      }

      if (
        previousSubmission?.approved === false ||
        previousSubmission?.status === "draft"
      ) {
        try {
          const formData = new FormData();
          formData.append("content", values.description);
          formData.append("title", selectedChapter.chapter.custom_title);
          formData.append("chapter_assignment", selectedChapter.id);
          formData.append("status", "submitted");
          formData.append("supervisor", selectedChapter.supervisor.id);
          values.files.forEach((file: File) => {
            formData.append("files", file);
          });

          if (!(values.files.length === 0)) {
            const { data }: any = await axios.put(
              `/students/chapter/update/${previousSubmission.id}/`,
              formData,
            );
            toast.success(
              "Resubmission initiated. You can now submit a new document.",
            );

            onClose();
            return data.data;
          } else {
            const { data }: any = await axios.put(
              `/students/chapter/update/${previousSubmission.id}/`,
              {
                content: values.description,
                title: selectedChapter.chapter.custom_title,
                chapter_assignment: selectedChapter.id,
                supervisor: selectedChapter.supervisor.id,
                status: "submitted",
              },
            );
            toast.success(
              "Resubmission initiated. You can now submit a new document.",
            );

            onClose();
            return data.data;
          }
        } catch (error) {
          toast.error("Error initiating resubmission. Please try again.");
          console.error("Error initiating resubmission:", error);
          return null;
        } finally {
          formik.setSubmitting(false);
        }
      } else {
        mutateSubmit(values);
      }
      formik.setSubmitting(false);
    },
  });

  const { mutateAsync: save, isPending: isSaving } = useMutation({
    mutationFn: async (values: any) => {
      try {
        const formData = new FormData();
        formData.append("content", values.description);
        formData.append("title", selectedChapter.chapter.custom_title);
        formData.append("chapter_assignment", selectedChapter.id);
        formData.append("status", "draft");
        formData.append("supervisor", selectedChapter.supervisor.id);
        values.files.forEach((file: File) => {
          formData.append("files", file);
        }); // Append the files

        if (!(values.files.length === 0)) {
          if (
            previousSubmission?.status === "draft" ||
            previousSubmission?.status === "submitted"
          ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await axios.put(
              `/students/chapter/update/${previousSubmission.id}/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );
            toast.success("Chapter saved successfully.");
            queryClient.invalidateQueries({
              queryKey: ["student-chapter-submissions", person.id],
            });
            formik.resetForm();
            onClose();
            return data.data;
          }
          const response = await axios.post(
            `/students/chapter/create/${person?.id}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          toast.success("Chapter saved successfully.");
          formik.resetForm();
          onClose();
          return response.data;
        } else {
          if (previousSubmission) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data }: any = await axios.put(
              `/students/chapter/update/${previousSubmission.id}/`,
              {
                content: values.description,
                title: selectedChapter.chapter.custom_title,
                chapter_assignment: selectedChapter.id,
                supervisor: selectedChapter.supervisor.id,
                status: "draft",
              },
            );
            toast.success("Chapter saved successfully.");
            formik.resetForm();
            onClose();
            return data.data;
          }
          const response = await axios.post(
            `/students/chapter/create/${person?.id}/`,
            {
              content: values.description,
              title: selectedChapter.chapter.custom_title,
              chapter_assignment: selectedChapter.id,
              supervisor: selectedChapter.supervisor.id,
              status: "draft",
            },
          );
          toast.success("Chapter saved successfully.");
          onClose();
          formik.resetForm();
          return response.data;
        }
      } catch (error) {
        console.log("error", error.response.status);
        if (error.response.status === 413) {
          toast.error(
            "File size exceeds the maximum limit. Please upload a smaller file.",
          );
          return null;
        }
        toast.error("Error saving chapter. Please try again.");
        console.error("Error saving chapter:", error);
        return null;
      }
    },
  });

  const onFileDelete = async (fileID) => {
    const fileUpdate = previousSubmission.files.filter(
      (file: any) => file.id !== fileID,
    );

    try {
      const response = await axios.put(
        `/students/chapter/update/${previousSubmission.id}/`,
        {
          files: fileUpdate,
          status: "draft",
          supervisor: selectedChapter.supervisor.id,
          content: formik.values.description,
          title: selectedChapter.chapter.custom_title,
          chapter_assignment: selectedChapter.id,
        },
      );
      formik.setFieldValue("files", []);
      toast.success("File deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file. Please try again.");
    }
  };

  const { mutateAsync: mutateFileDelete, isPending: deleting } = useMutation({
    mutationFn: onFileDelete,
  });

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  if (isPending) {
    return <Loading message="" />;
  }

  return (
    <div className="w-full mx-auto ">
      <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Submission Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted border border-border p-3">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-foreground">
              {isApproved || isApprovedByFeedback
                ? "Approved"
                : previousSubmission?.status || "Not submitted"}
            </p>
          </div>
          <div
            className={`rounded-lg border p-3 ${
              latestFeedback?.decision ? "border-border" : "bg-muted border-border"
            }`}
          >
            <p className="text-xs text-muted-foreground">Decision</p>
            <p
              className={`text-xs font-bold px-3 py-1 rounded-full border inline-block mt-1 ${getDecisionColor(
                latestFeedback?.decision,
              )}`}
            >
              {latestFeedback?.decision
                ? latestFeedback.decision.toUpperCase()
                : "PENDING"}
            </p>
          </div>
        </div>

        {/* {(isApproved || isApprovedByFeedback) &&
          (latestFeedback?.score || latestFeedback?.score === 0) && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Score</p>
              {(() => {
                const rawScore = Number(latestFeedback?.score ?? 0);
                const progress = Math.min(100, Math.max(0, rawScore));
                const displayScore = Number.isFinite(rawScore) ? rawScore : 0;

                return (
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative w-55 h-30">
                      <svg viewBox="0 0 200 120" className="w-full h-full">
                        <path
                          d="M 10 100 A 90 90 0 0 1 190 100"
                          fill="none"
                          stroke="currentColor"
                          className="text-gray-200"
                          strokeWidth="18"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 10 100 A 90 90 0 0 1 190 100"
                          fill="none"
                          stroke="currentColor"
                          className="text-emerald-500"
                          strokeWidth="22"
                          strokeLinecap="round"
                          pathLength={100}
                          strokeDasharray={`${progress} 100`}
                        />
                      </svg>

                      <div className="absolute inset-0 -bottom-10 flex flex-col items-center justify-center -mt-1">
                        <span className="text-2xl md:text-3xl font-semibold text-slate-500">
                          {displayScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )} */}
      </div>

      {getDaysLeft(selectedChapter?.due_date) > 0 && !hideSubmissionFields && (
        <div className="px-2 w-full">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Submission Type */}
            {/* <div>
              <CustomSelect
                label="Selected Chapter"
                disabled={true}
                options={chapterOptions}
                value={formik.values.submissionType}
                onChange={(option) => formik.setFieldValue("submissionType", option?.value)}
              />
              {formik.touched.submissionType && formik.errors.submissionType && (
                <p className="text-sm text-red-500 mt-1">{formik.errors.submissionType}</p>
              )}

            </div> */}

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                Submitting for:{" "}
                <span className="text-primary font-bold">{`Chapter ${selectedChapter.chapter?.custom_title} - ${selectedChapter.chapter?.custom_description}`}</span>
              </h3>
            </div>

            <div>
              <RichText
                value={formik.values.description}
                onChange={(value) => formik.setFieldValue("description", value)}
                onBlur={() => formik.setFieldTouched("description", true)}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.description as string}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <FileDropzone
                fieldName="files"
                setFieldValue={formik.setFieldValue}
                files={formik.values.files}
                error={formik.errors.files as string}
                touched={formik.touched.files as boolean}
              />
            </div>

            {chapterSubData?.files &&
              Array.isArray(chapterSubData.files) &&
              chapterSubData.files.length > 0 && (
                <div className="mt-6 rounded-lg bg-muted/20 p-4 border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Saved Documents</p>
                  <div className="space-y-2">
                    {chapterSubData.files.map((file: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center w-fit gap-2"
                      >
                        <a
                          href={`https://thesisflow.sbuildsolutions.org${file?.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={true}
                          className="w-full"
                        >
                          <div className="w-fit flex rounded-lg text-primary font-bold items-center hover:underline cursor-pointer group/link">
                            {getFileIcon(getFileNameFromURL(file?.file))}
                            <p className="text-sm group-hover/link:text-primary transition-colors">
                              {getFileNameFromURL(file?.file)}
                            </p>
                          </div>
                        </a>
                        <button
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                          onClick={() => {
                            mutateFileDelete(file.id);
                          }}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <Loader2 size={14} className="animate-spin text-muted-foreground" />
                          ) : (
                            <Trash
                              size={14}
                              className="text-destructive cursor-pointer"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Buttons */}
            <div className="flex justify-between items-center gap-4">
              <OutlineButton
                type="button"
                title={<span className="hidden md:block">Save</span>}
                Icon={
                  isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )
                }
                className=" py-2 text-sm"
                onClick={() => {
                  save(formik.values);
                }}
              />
              <div className="flex items-center gap-3">
                <OutlineButton
                  type="button"
                  title="Cancel"
                  className="px-2 py-2 text-sm"
                  onClick={handleCancel}
                />

                <SolidButton
                  type="submit"
                  title={formik.isSubmitting ? "Submiting.." : "Submit"}
                  Icon={
                    formik.isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : null
                  }
                  className="py-2 text-sm"
                  disabled={formik.isSubmitting || isPending}
                />
              </div>
            </div>
          </form>
        </div>
      )}

      <div>
        {getDaysLeft(selectedChapter?.due_date) < 1 &&
          !hideSubmissionFields && (
            <p className="text-sm text-destructive mt-1 text-center font-semibold italic">
              The due date for this chapter has passed. You can no longer submit
              or resubmit documents for this chapter.
            </p>
          )}

        {selectedChapter && previousSubmission && hideSubmissionFields && (
          <div className="mt-8 p-6 border border-green-500/30 rounded-2xl bg-green-500/5 text-center shadow-sm">
            <Check className="mx-auto mb-3 text-green-500 w-10 h-10 p-2 bg-green-500/10 rounded-full" />
            <p className="text-sm text-green-500 font-bold uppercase tracking-wide">Approved</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              This chapter has been approved by your supervisor. No further
              submissions are allowed.
            </p>
          </div>
        )}
      </div>

      {previousSubmission && (
        <div className="mt-8 p-6 border border-border rounded-2xl bg-card shadow-sm">
          <div className="mb-6 border-b border-border pb-4">
            <h3 className="text-lg font-bold text-foreground">
              {previousSubmission.status === "draft"
                ? "Draft"
                : "Previous Submission"}
            </h3>
          </div>
          <div>
            <p className="flex items-center gap-2 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Calendar size={14} className="text-primary/70" />
              {formatDate(previousSubmission.created_at)}
            </p>
          </div>

          <div>
            <div
              className="min-h-40 mt-6 p-5 bg-muted/30 border border-border rounded-xl text-foreground leading-relaxed overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: previousSubmission.content }}
            />
          </div>

          {previousSubmission.files &&
            Array.isArray(previousSubmission.files) &&
            previousSubmission.files.length > 0 && (
              <div className="mt-8 rounded-xl bg-muted/20 p-4 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Documents</p>
                <div className="space-y-2">
                  {previousSubmission.files.map((file: any, index: number) => (
                    <a
                      key={index}
                      href={`https://thesisflow.sbuildsolutions.org${file?.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={true}
                      className="w-fit block"
                    >
                      <div className="w-fit flex bg-card border border-border rounded-lg px-3 py-2 text-primary font-bold items-center cursor-pointer hover:bg-muted transition-colors shadow-sm group/prevfile">
                        {getFileIcon(getFileNameFromURL(file?.file))}
                        <p className="text-sm group-hover/prevfile:underline">
                          {getFileNameFromURL(file?.file)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {fetchingFeedbacks && (
        <div className="flex justify-center mt-4">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {ChapterSubmissionFeedback && ChapterSubmissionFeedback.length > 0 && (
        <div className="mt-10 p-6 border border-border rounded-2xl bg-card shadow-lg">
          <div className="mb-6 border-b border-border pb-4">
            <h3 className="text-lg font-bold text-foreground">
              Supervisor Feedback
            </h3>
          </div>
          {ChapterSubmissionFeedback.map((feedback) => (
            <div
              key={feedback.id}
              className="mb-8 last:mb-0 p-6 bg-muted/20 border border-border rounded-xl"
            >
              <p className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                <Calendar size={14} className="text-primary/70" />
                {formatDate(feedback.created_at)}
              </p>
              <div
                className="mt-6 text-sm text-foreground leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: feedback.feedback_text }}
              />
              {feedback.file_attachment && (
                <div className="mt-8 rounded-xl bg-card p-4 border border-border shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Response Document</p>
                  <a
                    href={`https://thesisflow.sbuildsolutions.org${feedback.file_attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={true}
                    className="w-fit block"
                  >
                    <div className="w-fit flex bg-muted border border-border rounded-lg px-3 py-2 text-primary font-bold items-center cursor-pointer hover:bg-muted/80 transition-colors shadow-sm group/fbfile">
                      {getFileIcon(
                        getFileNameFromURL(feedback.file_attachment),
                      )}
                      <p className="text-sm group-hover/fbfile:underline">
                        {getFileNameFromURL(feedback.file_attachment)}
                      </p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmitChapter;
