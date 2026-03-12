import React, { useRef, useState } from "react";
import OutlineButton from "../shared/buttons/OutlineButton";
import SolidButton from "../shared/buttons/SolidButton";
import CustomSelect from "../shared/custom-select";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { Loader2, PenLine, Save, X } from "lucide-react";
import { getFileNameFromURL } from "../../utils/helpers";
import RichText from "../shared/input/RichText";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdFeedback, MdPerson } from "react-icons/md";
import { FileDropzone, getFileIcon } from "../student/SubmitChapter";
import { useFormik } from "formik";
import AppInput from "../shared/input/AppInput";
import Modal from "../../layouts/Modal";
import DocumentEditor, { type DocumentEditorRef } from "../shared/DocumentEditor";
import { PdfViewer, type PdfViewerRef } from "../shared/PdfViewer";

interface ChapterReviewProps {
  data: any;
  chapterFeedbacks?: any;
  previousFeedback?: any;
  onClose: () => void;
}

const decisionOptions = [
  { value: "approved", label: "Approve" },
  { value: "revise", label: "Revise and Resubmit" },
  { value: "reject", label: "Reject" },
];

const BASE_FILE_URL = "https://thesisflow.sbuildsolutions.org";

interface SelectedAttachment {
  name: string;
  url: string;
}

const ChapterReview: React.FC<ChapterReviewProps> = ({
  data,
  onClose,
  chapterFeedbacks,
  previousFeedback,
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [selectedAttachment, setSelectedAttachment] =
    useState<SelectedAttachment | null>(null);
  const [isFileActionModalOpen, setIsFileActionModalOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [fileActionLoading, setFileActionLoading] = useState(false);
  const documentEditorRef = useRef<DocumentEditorRef>(null);
  const pdfViewerRef = useRef<PdfViewerRef>(null);
  const axios = useAxiosPrivate();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["studentSubmissions"] });
  };

  const handleSubmit = async (values) => {
    if (!values.decision) {
      toast.error("Please select a decision");
      return;
    }
    if (values.feedback.trim().length === 0) {
      toast.error("Please provide feedback");
      return;
    }

    if (values.decision === "approved" && !values.score) {
      toast.error("Please provide a score");
      return;
    }

    if (values.decision === "revise" && !values.newDeadline) {
      toast.error("Please provide a new deadline for revision");
      return;
    }

    if (values.decision === "revise") {
      try {
        setLoading(true);
        await axios.put(
          `/students/chapter/assignment/update/${data.chapter_assignment.id}/`,
          {
            due_date: values.newDeadline,
          },
        );
      } catch (err) {
        toast.error("Error setting new deadline");
        console.log(err);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    const formData = new FormData();
    values.file_attachment.forEach((file) => {
      formData.append("file_attachment", file);
    });
    formData.append("decision", values.decision);
    formData.append("feedback_text", values.feedback);
    formData.append("chapter", data.id);
    formData.append("stage", "submitted");
    if (values.decision === "approved") {
      formData.append("score", values.score);
    }

    try {
      if (values.file_attachment.length > 0) {
        const uploadResponse = await axios.post(
          `/students/chapter/feedback/create/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        console.log("File upload response: ", uploadResponse.data);
      } else {
        const response = await axios.post(
          `/students/chapter/feedback/create/`,
          {
            decision: values.decision,
            feedback_text: values.feedback,
            stage: "submitted",
            chapter: data.id,
            ...(values.decision === "approved" ? { score: values.score } : {}),
          },
        );
      }

      toast.success("Review submitted successfully");
      refresh();
      onClose();
    } catch (err) {
      toast.error("Error submitting review");
      console.log(err);
    } finally {
      refresh();
      setLoading(false);
    }
  };

  const { mutateAsync: onSaveFeedback, isPending: feedbackLoading } =
    useMutation({
      mutationFn: async (values: any) => {
        setLoading(true);
        const formData = new FormData();
        values.file_attachment.forEach((file) => {
          formData.append("file_attachment", file);
        });
        formData.append("decision", values.decision);
        formData.append("feedback_text", values.feedback);
        formData.append("chapter", data.id);
        formData.append("stage", "draft");

        try {
          if (values.file_attachment.length > 0) {
            const uploadResponse = await axios.post(
              `/students/chapter/feedback/create/`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              },
            );
            console.log("File upload response: ", uploadResponse.data);
          } else {
            const response = await axios.post(
              `/students/chapter/feedback/create/`,
              {
                decision: values.decision,
                feedback_text: values.feedback,
                stage: "draft",
                chapter: data.id,
              },
            );
          }

          toast.success("Review submitted successfully");
          refresh();
          onClose();
        } catch (err) {
          toast.error("Error submitting review");
          console.log(err);
        } finally {
          refresh();
          setLoading(false);
        }
      },
    });

  const formik = useFormik({
    initialValues: {
      decision: "",
      feedback: "",
      score: "",
      newDeadline: "",
      file_attachment: [],
    },
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const getStatus = () => {
    if (!previousFeedback) {
      return "Pending";
    } else if (previousFeedback.decision === "revise") {
      return "Needs Revision";
    } else {
      return previousFeedback.decision === "approved" ? "Approved" : "Rejected";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-center w-24 mx-auto";
      case "Rejected":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-center w-24 mx-auto";
      case "Needs Revision":
        return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-center w-24 mx-auto";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-center w-24 mx-auto";
    }
  };

  const getFileExtension = (fileName: string): string => {
    return fileName.split(".").pop()?.toLowerCase() || "";
  };

  const getMimeTypeFromExtension = (extension: string) => {
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "doc":
        return "application/msword";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      default:
        return "application/octet-stream";
    }
  };

  const isSupportedViewerFile = (fileName: string): boolean => {
    const extension = getFileExtension(fileName);
    return ["pdf", "doc", "docx"].includes(extension);
  };

  const handleAttachmentClick = (filePath: string) => {
    if (!filePath) {
      toast.error("Invalid file path");
      return;
    }

    const fileName = getFileNameFromURL(filePath);
    setSelectedAttachment({
      name: fileName,
      url: `${BASE_FILE_URL}${filePath}`,
    });
    setIsFileActionModalOpen(true);
  };

  const closeFileActionModal = (clearSelection = true) => {
    setIsFileActionModalOpen(false);
    if (clearSelection) {
      setSelectedAttachment(null);
    }
  };

  const handleDownloadAttachment = () => {
    if (!selectedAttachment) {
      return;
    }

    const link = document.createElement("a");
    link.href = selectedAttachment.url;
    link.download = selectedAttachment.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Download started");
    closeFileActionModal();
    closeDocumentViewer();
  };

  const getEditedAttachmentBlob = async (): Promise<Blob | null> => {
    if (!selectedAttachment) {
      return null;
    }

    const extension = getFileExtension(selectedAttachment.name);

    if (extension === "pdf") {
      const blob = await pdfViewerRef.current?.saveAsBlob();
      if (blob) {
        return blob;
      }
    }

    if (extension === "doc" || extension === "docx") {
      const blob = await documentEditorRef.current?.saveAsBlob("Docx");
      if (blob) {
        return blob;
      }
    }

    const response = await fetch(selectedAttachment.url);
    if (!response.ok) {
      throw new Error("Failed to fetch attachment for saving");
    }

    return response.blob();
  };

  const handleSaveAttachment = async () => {
    if (!selectedAttachment) {
      return;
    }

    try {
      setFileActionLoading(true);
      const blob = await getEditedAttachmentBlob();

      if (!blob || blob.size === 0) {
        toast.error("Unable to save document");
        return;
      }

      const originalExtension = getFileExtension(selectedAttachment.name);
      const extension =
        originalExtension === "doc" ? "docx" : originalExtension;
      const fileNameWithoutExtension =
        selectedAttachment.name.replace(/\.[^/.]+$/, "") || "review-document";
      const fileName = `${fileNameWithoutExtension}.${extension || "docx"}`;

      const draftFile = new File([blob], fileName, {
        type: blob.type || getMimeTypeFromExtension(extension || "docx"),
      });

      const formData = new FormData();
      formData.append("files", draftFile);
      formData.append("chapter", data.id);
      formData.append("stage", "draft");

      if (formik.values.decision) {
        formData.append("decision", "pending");
      }

      if (formik.values.feedback.trim().length > 0) {
        formData.append("feedback_text", "pending");
      }

      if (formik.values.decision === "approved" && formik.values.score) {
        formData.append("score", formik.values.score);
      }

      await axios.post(`/students/chapter/feedback/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Draft saved successfully");
      refresh();
    } catch (err) {
      toast.error("Error saving draft");
      console.log(err);
    } finally {
      setFileActionLoading(false);
    }
  };

  const handleViewAttachment = () => {
    if (!selectedAttachment) {
      return;
    }

    if (!isSupportedViewerFile(selectedAttachment.name)) {
      window.open(selectedAttachment.url, "_blank", "noopener,noreferrer");
      closeFileActionModal();
      return;
    }

    // Open document viewer in modal
    setIsDocumentViewerOpen(true);
    closeFileActionModal(false);
  };

  const closeDocumentViewer = () => {
    setIsDocumentViewerOpen(false);
    setSelectedAttachment(null);
  };

  return (
    <div className="">
      <div className="w-full">
        <div className="flex justify-between mb-6">
          <div>
            <p className="text-lg font-medium text-slate-700">
              <MdPerson
                size={24}
                className="inline mr-1.5 mb-1 text-ug-blue"
              />
              {data.student.name}
            </p>
            <p className="text-xs pl-3 text-gray-400">
              {data.student.email}
              {/* • <span className="text-purple-600">{data.level}</span> */}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="mt-2 text-xs">
              <span className={getStatusClass(getStatus())}>{getStatus()}</span>
            </div>

            {previousFeedback?.stage !== null &&
              previousFeedback?.stage === "draft" && (
                <div className="mt-2 text-xs">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-center w-24 mx-auto">
                    Draft
                  </span>
                </div>
              )}
          </div>
        </div>

        <div className="mb-4 border-b border-gray-300 pb-3">
          {/* <h3 className="text-md font-semibold  text-blue-800">Chapter Title</h3> */}
          <p className="text-xl font-medium text-ug-blue mb-1">
            {data.chapter_assignment.chapter.custom_title} -{" "}
            {data.chapter_assignment.chapter.custom_description}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Proposed Topic: </span>
            {data.chapter_assignment.topic.title}
          </p>
        </div>
        {data.content && (
          <div className="mb-4 px-4">
            <h3 className="text-sm font-montserrat text-slate-600 mb-2">
              <PenLine
                size={17}
                className="inline mr-2 mb-1 text-xl text-ug-blue"
              />
              Description
            </h3>
            <div
              className="min-h-30 bg-gray-100/50 p-3 rounded-lg text-sm text-gray-800 border border-gray-300"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        )}

        {data.files && data.files.length > 0 && (
          <div className="mt-6 p-4.5 rounded-lg">
            <p className="text-sm text-gray-800">Attachment(s)</p>
            <div className="space-y-2">
              {data.files.map((file: any, index: number) => (
                <div key={index} className="flex items-center w-fit gap-2">
                  <button
                    type="button"
                    onClick={() => handleAttachmentClick(file?.file)}
                    className="w-full"
                  >
                    <div className="w-fit flex rounded-lg text-blue-900 font-medium items-center hover:underline cursor-pointer">
                      {getFileIcon(getFileNameFromURL(file?.file))}
                      <p className="text-sm">
                        {getFileNameFromURL(file?.file)}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {previousFeedback?.decision !== "approved" && (
          <div className="border-t border-gray-300 pt-3 px-4 mb-3">
            <div className="mb-6">
              <CustomSelect
                label="Your Decision"
                options={decisionOptions}
                value={formik.values.decision}
                onChange={(options) =>
                  formik.setFieldValue("decision", options?.value)
                }
                placeholder="Select decision"
              />
            </div>
            {formik.values.decision === "revise" && (
              <div className="mb-6">
                <AppInput
                  label="New Deadline"
                  type="datetime-local"
                  name="newDeadline"
                  formik={formik}
                />
              </div>
            )}

            {formik.values.decision === "approved" && (
              <div className="mb-6">
                <AppInput
                  label="Score"
                  type="number"
                  name="score"
                  formik={formik}
                />
              </div>
            )}

            <div className="mb-6">
              <RichText
                label="Feedback"
                value={formik.values.feedback}
                onChange={(value) => formik.setFieldValue("feedback", value)}
                placeholder="Provide your feedback here..."
                h="h-50"
              />
            </div>

            <div>
              <FileDropzone
                files={formik.values.file_attachment}
                fieldName="file_attachment"
                setFieldValue={formik.setFieldValue}
                error={formik.errors.file_attachment as string}
                touched={formik.touched.file_attachment as boolean}
              />
            </div>
          </div>
        )}

        {previousFeedback?.stage === "draft" &&
          previousFeedback?.file_attachment && (
            <div className="border-t border-gray-300 pt-3 px-4 mb-3">
              <div>
                <p>Saved document</p>

                <div>
                  {previousFeedback.feedback_text && (
                    <div
                      className="text-sm min-h-30 bg-gray-100/50 p-3 rounded-lg text-gray-800 border border-gray-300"
                      dangerouslySetInnerHTML={{
                        __html: previousFeedback.feedback_text,
                      }}
                    />
                  )}
                </div>
                <div className="mt-2 rounded-lg">
                  <a
                    href={`https://thesisflow.sbuildsolutions.org${previousFeedback.file_attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={true}
                    className="w-fit"
                  >
                    <div className="w-fit flex bg-gray-100 mt-2 p-1 text-blue-900 font-medium items-center cursor-pointer hover:underline">
                      {getFileIcon(
                        getFileNameFromURL(previousFeedback.file_attachment),
                      )}
                      <p className="text-sm">
                        {getFileNameFromURL(previousFeedback.file_attachment)}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4 italic">
                This feedback is currently in draft status and has not been
                submitted to the student.
              </p>
            </div>
          )}

        {previousFeedback?.stage !== "draft" && (
          <div>
            <h4 className="text-sm font-montserrat text-slate-600 mb-2">
              <MdFeedback
                size={18}
                className="inline mr-1 text-xl text-ug-blue"
              />
              Recent Feedback
            </h4>
            <div className="border-t border-gray-300 pt-4 px-4 mb-4">
              <div className="mb-4">
                <div
                  className="text-sm min-h-30 bg-gray-100/50 p-3 rounded-lg text-gray-800 border border-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: previousFeedback?.feedback_text,
                  }}
                />
              </div>

              {previousFeedback?.file_attachment && (
                <div className="mt-4 rounded-lg">
                  <a
                    href={`https://thesisflow.sbuildsolutions.org${previousFeedback?.file_attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={true}
                    className="w-fit"
                  >
                    <div className="w-fit flex bg-white mt-2 p-1 text-blue-900 font-medium items-center cursor-pointer hover:underline">
                      {getFileIcon(
                        getFileNameFromURL(previousFeedback?.file_attachment),
                      )}
                      <p className="text-sm">
                        {getFileNameFromURL(previousFeedback?.file_attachment)}
                      </p>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {chapterFeedbacks && chapterFeedbacks.length > 0 && (
          <>
            <h4 className="text-sm font-montserrat text-slate-600 mb-2">
              <MdFeedback
                size={18}
                className="inline mr-1 text-xl text-ug-blue"
              />
              Previous Feedback(s)
            </h4>

            {chapterFeedbacks.map((chapterFeedback: any, index: number) => (
              <div className="border-t border-gray-300 pt-4 px-4 mb-4">
                <div className="mb-4">
                  <div
                    className="text-sm min-h-30 bg-gray-100/50 p-3 rounded-lg text-gray-800 border border-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: chapterFeedback.feedback_text,
                    }}
                  />
                </div>

                {chapterFeedback.file_attachment && (
                  <div className="mt-4 rounded-lg">
                    <a
                      href={`https://thesisflow.sbuildsolutions.org${chapterFeedback.file_attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={true}
                      className="w-fit"
                    >
                      <div className="w-fit flex bg-white mt-2 p-1 text-blue-900 font-medium items-center cursor-pointer hover:underline">
                        {getFileIcon(
                          getFileNameFromURL(chapterFeedback.file_attachment),
                        )}
                        <p className="text-sm">
                          {getFileNameFromURL(chapterFeedback.file_attachment)}
                        </p>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        <div className="flex justify-between">
          <OutlineButton
            title="Save"
            onClick={() => onSaveFeedback(formik.values)}
            Icon={<Save size={16} className="" />}
            className="py-2"
          />

          <div className="flex gap-3">
            <OutlineButton title="Cancel" onClick={onClose} className="py-2" />

            {previousFeedback?.decision !== "approved" &&
              data?.status === "submitted" && (
                <SolidButton
                  disabled={loading}
                  title="Submit"
                  Icon={loading ? <Loader2 className="animate-spin" /> : null}
                  onClick={formik.handleSubmit}
                  className="py-2"
                />
              )}
          </div>
        </div>

        {data.status === "draft" && (
          <p className="text-xs text-gray-500 italic mt-3 bg-yellow-50 p-2 rounded border-l-3 border-yellow-200">
            Note: This chapter is still in draft status and has not been
            officially submitted by the student.
          </p>
        )}

        {isFileActionModalOpen && selectedAttachment && (
          <Modal
            headTitle="Open Document"
            subHeadTitle={selectedAttachment.name}
            buttonDisabled={fileActionLoading}
            handleCancel={closeFileActionModal}
            handleConfirm={handleViewAttachment}
            w="max-w-lg"
          >
            <div className="space-y-4 pb-2">
              <p className="text-sm text-gray-600">
                Choose what you want to do with this document.
              </p>
              <div className="flex justify-end gap-3">
                <OutlineButton
                  title="Download"
                  onClick={handleDownloadAttachment}
                  className="py-2"
                  disabled={fileActionLoading}
                />
                <SolidButton
                  title="View"
                  onClick={handleViewAttachment}
                  className="py-2"
                  disabled={fileActionLoading}
                />
              </div>
            </div>
          </Modal>
        )}

        {isDocumentViewerOpen && selectedAttachment && (
          <div className="fixed inset-0 z-50 bg-gray-950/60 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Document Viewer
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAttachment.name}
                  </p>
                </div>
                <button
                  onClick={closeDocumentViewer}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Document Content */}
              <div className="flex-1 overflow-hidden p-4">
                {getFileExtension(selectedAttachment.name) === "pdf" ? (
                  <PdfViewer
                    ref={pdfViewerRef}
                    documentPath={selectedAttachment.url}
                  />
                ) : (
                  <DocumentEditor
                    ref={documentEditorRef}
                    documentPath={selectedAttachment.url}
                    height="100%"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                <OutlineButton
                  title="Save"
                  onClick={handleSaveAttachment}
                  className="py-2"
                  disabled={fileActionLoading}
                />
                <SolidButton
                  title="Close"
                  onClick={closeDocumentViewer}
                  className="py-2"
                  disabled={fileActionLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterReview;
