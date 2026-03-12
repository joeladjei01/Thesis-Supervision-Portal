/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Calendar, Clock, FileCheck2, FileText, Upload } from "lucide-react";
import Modal from "../../layouts/Modal";
import TopicSubmissionModal, {
  type TopicSubmissionModalRef,
} from "../../components/student/TopicSubmissionModal";
import Header from "../../components/shared/text/Header";
import SolidButton from "../../components/shared/buttons/SolidButton";
import AllSubmissions from "../../components/student/AllSubmissions";
import usePageTile from "../../hooks/usePageTitle";
import userStore from "../../store";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ProposalDetails from "../../components/student/TopicDetails";
import AllTopics from "../../components/student/AllTopics";
import SubmitChapter from "../../components/student/SubmitChapter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Loading from "../../components/shared/loader/Loading";
import { useStudentDataStore } from "../../store/useStudentDataStore";
import { getDaysLeft } from "../../utils/helpers";

const MySubmissions: React.FC = () => {
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isChapterSubmit, setIsChapterSubmit] = useState(false);
  const topicModalRef = useRef<TopicSubmissionModalRef>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const { person } = userStore();
  const queryClient = useQueryClient();
  usePageTile("Student - Submissions");
  const {
    chapters,
    feedbacks,
    submissions: StudentSubmissions,
    topics,
  } = useStudentDataStore();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
    queryClient.invalidateQueries({ queryKey: ["student-chapters"] });
    queryClient.invalidateQueries({ queryKey: ["student-feedbacks"] });
    const approvedTopic = topics.find((t: any) => t.status === "approved");
    if (!approvedTopic) {
      queryClient.invalidateQueries({ queryKey: ["student-topics"] });
    }
  }, [queryClient]);

  const onViewDetails = (topic: any) => {
    setSelectedTopic(topic);
    setViewDetailsOpen(true);
  };

  const onUpadteClick = (topic: any) => {
    setSelectedTopic(topic);
    setIsTopicModalOpen(true);
  };

  const notDueChapters = () => {
    const notDue = chapters.filter((chapter: any) => {
      return getDaysLeft(chapter.due_date) >= 0;
    });
    return notDue;
  };

  function upnext() {
    const result = notDueChapters()?.length - StudentSubmissions?.length;
    if (result < 0) {
      return 0;
    }
    return result;
  }

  const stats = {
    completed: feedbacks?.filter((f) => f.decision === "approved").length,
    pending: StudentSubmissions.filter(
      (sub) => sub.status === "submitted" && sub.approved !== true,
    ).length,
    upcoming: upnext(),
    drafts: StudentSubmissions.filter(
      (sub) => sub.status === "draft" && sub.approved !== true,
    ).length,
    totalCompleted: feedbacks?.filter((f) => f.decision === "approved").length,
    totalSubmissions: chapters?.length,
  };

  const StatArray = [
    { title: "Completed", value: stats.completed, Icon: FileCheck2 },
    { title: "Under Review", value: stats.pending, Icon: Clock },
    { title: "Upnext", value: stats.upcoming, Icon: Calendar },
    { title: "Drafts", value: stats.drafts, Icon: FileText },
  ];

  const handleTopicSubmit = async () => {
    if (topicModalRef.current) {
      topicModalRef.current.submitForm();
      // Close modal after successful submission
      setIsTopicModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["student-topics"] });
    }
  };

  const handleTopicCancel = () => {
    setIsTopicModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <Header title={"My Submissions"} />

          {
            <div className="flex gap-2 flex-wrap">
              <SolidButton
                title={"Topic Submission"}
                onClick={() => setIsTopicModalOpen(true)}
                Icon={<Upload className="w-4 h-4" />}
                disabled={
                  topics?.some((t) => t.status === "approved") ||
                  person.supervisors == null
                }
                className={"py-2"}
              />
            </div>
          }
        </div>

        {/* {
          loading &&
          <Loading message="Loading submissions..." />
        } */}

        {/* Progress Section */}
        {chapters?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between md:items-center mb-4">
                <div>
                  <h2 className="text-lg font-cal-sans tracking-wide text-gray-700">
                    Submission Progress
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Track your overall project submission progress
                  </p>
                </div>
                <span className="text-sm text-gray-600 mt-1 md:mt-0">
                  {stats.totalCompleted}/{stats.totalSubmissions} submissions
                  completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-sky-700 h-2 rounded-full"
                  style={{
                    width: `${
                      (stats.totalCompleted / stats.totalSubmissions) * 100
                    }%`,
                  }}
                ></div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 gap-y-7">
                {StatArray.map((stat) => (
                  <div className="relative bg-gray-50 p-4 rounded-lg border-t-4 border border-sky-800 text-center">
                    <div className="absolute size-13 -top-5 left-1/2 transform -translate-x-1/2 flex items-center justify-center bg-white rounded-full border-1 border-sky-800">
                      <stat.Icon size={25} className="mb-1 text-sky-900" />
                    </div>

                    <div className="mt-5.5">
                      <div className="text-2xl font-bold text-slate-500 font-montserrat">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {chapters && chapters?.length == 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.981-1.742 2.981H4.42c-1.53 0-2.493-1.647-1.743-2.982l5.58-9.919zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v3a1 1 0 001.993.117L11 9V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have no chapter assignments from supervisor yet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {chapters?.length > 0 && (
          <div>
            <AllSubmissions
              submissions={StudentSubmissions}
              chapters={chapters}
              feedbacks={feedbacks}
            />
          </div>
        )}

        {topics?.length > 0 && (
          <AllTopics
            topics={topics}
            onUpadteClick={onUpadteClick}
            onViewDetails={onViewDetails}
          />
        )}

        {/* Topic Details */}
        {viewDetailsOpen && selectedTopic && (
          <Modal
            headTitle="Topic Details"
            subHeadTitle="View detailed information about your topic proposal"
            handleCancel={() => {
              setViewDetailsOpen(false);
              setSelectedTopic(null);
            }}
            buttonDisabled={false}
            w="max-w-5xl"
            handleConfirm={() => {}}
          >
            <ProposalDetails
              topic={selectedTopic}
              onBack={() => {
                setViewDetailsOpen(false);
                setSelectedTopic(null);
              }}
            />
          </Modal>
        )}

        {topics?.length == 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.981-1.742 2.981H4.42c-1.53 0-2.493-1.647-1.743-2.982l5.58-9.
                      919zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-.993.883L9 6v3a1 1 0 001.993.117L11 9V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You have not submitted any topic proposals yet. Click on
                  "Topic Submission" to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Topic Submission Modal */}
        {isTopicModalOpen && (
          <Modal
            headTitle="Submit Topic Proposal"
            subHeadTitle="Submit your research topic proposal for approval"
            handleCancel={handleTopicCancel}
            handleConfirm={handleTopicSubmit}
            buttonDisabled={false}
            w="max-w-5xl"
          >
            <TopicSubmissionModal
              selectedTopic={selectedTopic}
              onCancel={handleTopicCancel}
            />
          </Modal>
        )}

        {isChapterSubmit && (
          <Modal
            headTitle="Submit Assigned Task"
            subHeadTitle="Upload your document for supervisor review. Supported file types: PDF, DOC, DOCX."
            handleCancel={() => {
              setIsChapterSubmit(false);
              setSelectedChapter(null);
            }}
            handleConfirm={() => {}}
            buttonDisabled={false}
            w="max-w-3xl"
          >
            <SubmitChapter
              selectedChapter={selectedChapter}
              onClose={() => {
                setIsChapterSubmit(false);
                setSelectedChapter(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MySubmissions;
