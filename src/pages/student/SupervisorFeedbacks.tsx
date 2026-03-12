/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Header from "../../components/shared/text/Header";
import usePageTile from "../../hooks/usePageTitle";
import userStore from "../../store";
import { File } from "lucide-react";
import { MdFeedback } from "react-icons/md";
import toast from "react-hot-toast";
import SolidButton from "../../components/shared/buttons/SolidButton";
import {
  formatDate,
  getChaperById,
  getFileNameFromURL,
} from "../../utils/helpers";
import Loading from "../../components/shared/loader/Loading";
import { useNavigate } from "react-router";
import useChapterStore from "../../store/useChapterStore";
import { useStudentDataStore } from "../../store/useStudentDataStore";

const SupervisorFeedbacks: React.FC = () => {
  usePageTile("Student - Feedback");
  const { person } = userStore();
  const setSelectedChapter = useChapterStore(
    (state) => state.setSelectedChapter,
  );
  // const [feedbacks, setFeedbacks] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const { feedbacks } = useStudentDataStore();

  const axios = useAxiosPrivate();

  // const { data : feedbacks, isLoading } = useQuery({
  //   queryKey: ["supervisor-feedbacks"],
  //   queryFn: async () => {
  //     try {
  //       // const response = await axios.get("/students/topics/students/feedbacks/");
  //       const { data }: any = await axios.get(`/students/chapter/student/${person.id}/feedbacks/`);
  //       // return (response.data as any).data ;
  //       console.log(data)
  //       return data.data;
  //     } catch (error) {
  //       console.error("Error fetching feedbacks:", error);
  //       return [];
  //     }

  //   },
  // });

  const fetchFeedbacks = async () => {
    try {
      const { data }: any = await axios.get(
        `/students/chapter/student/${person.id}/feedbacks/`,
      );
      // setFeedbacks(data.data);
      return data.data;
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
      console.error("Error fetching feedbacks:", error);
    }
  };

  const { mutate, isPending: loading } = useMutation({
    mutationFn: fetchFeedbacks,
  });

  // useEffect(() => {
  //   mutate()
  // }, [])

  const getStatusButton = (status: string) => {
    switch (status) {
      case "revise":
        return (
          <button className="bg-yellow-300 text-yellow-900 px-4 py-1 rounded-md text-xs font-medium hover:bg-yellow-200">
            Revise and Resubmit
          </button>
        );
      case "approved":
        return (
          <button className="bg-green-300 text-green-900 px-4 py-1 rounded-md text-xs font-medium hover:bg-green-200">
            Approved
          </button>
        );
      case "reject":
        return (
          <button className="bg-red-300 text-red-900 px-4 py-1 rounded-md text-xs font-medium hover:bg-red-200">
            Reject
          </button>
        );
      default:
        return null;
    }
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toISOString().split("T")[0];
  // };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Header title="Feedbacks" subtitle="View feedback from supervisor" />

        {feedbacks?.length == 0 && !loading && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Note: Feedback is provided for specific chapters only after
                  submission and review by your supervisor.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && feedbacks?.length == 0 && (
          <Loading message="Loading feedbacks..." />
        )}

        {/* Feedback Cards */}
        <div className="space-y-6">
          {feedbacks?.map((feedback) => (
            <div
              key={feedback.id}
              className=" bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
            >
              <h2 className="text-md w-full bg-sky-600/7 p-3 font-montserrat font-bold text-blue-900">
                <MdFeedback
                  size={18}
                  className="inline-flex text-sky-700 mb-1 mr-1.5"
                />
                Chapter feedback
              </h2>

              <div className="relative p-3">
                {/* Chapter Header */}
                <div className="mb-2 ">
                  <h3 className="text-lg font-medium text-gray-600 mb-1">
                    Chapter{" "}
                    {feedback.chapter.chapter_assignment.chapter.custom_title} -{" "}
                    {
                      feedback.chapter.chapter_assignment.chapter
                        .custom_description
                    }
                  </h3>
                  <p className="text-sm text-gray-500 font-montserrat">
                    Submission: {feedback.chapter.title}
                  </p>
                </div>

                {/* Feedback Content */}
                <div className=" rounded-lg p-2 mb-3">
                  <div className="mb-3">
                    <h4 className="font-semibold text-sky-900 mb-1">
                      Feedback from {feedback.chapter.supervisor.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Received on {formatDate(feedback.created_at)} {}
                    </p>
                  </div>

                  <div className=" sm:hidden my-2 text-sm ">
                    Decision - {getStatusButton(feedback.decision)}
                  </div>

                  <div
                    className="text-gray-700 bg-gray-50 border border-gray-200 p-2 rounded min-h-40 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: feedback.feedback_text }}
                  />
                </div>

                {/* Status */}
                <div className="absolute hidden sm:block text-sm top-5 right-5">
                  Decision - {getStatusButton(feedback.decision)}
                </div>

                {feedback.file_attachment && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-sky-900 mb-1">
                      Attachment:
                    </h4>
                    <a
                      href={`https://thesisflow.sbuildsolutions.org${feedback.file_attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <File className="mr-1" />
                      {getFileNameFromURL(feedback.file_attachment)}
                    </a>
                  </div>
                )}

                <div className="flex justify-end">
                  <SolidButton
                    title="Resubmit"
                    onClick={() => {
                      // console.log("Selected Chapter: ", feedback.chapter);
                      setSelectedChapter(feedback.chapter.chapter_assignment);
                      navigate(`/submissions/chapter/${feedback.chapter.id}`);
                    }}
                    disabled={feedback.decision !== "revise"}
                    className="py-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no feedbacks) */}
        {feedbacks?.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feedback available
            </h3>
            <p className="text-gray-500">
              You haven't received any feedback from your supervisors yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorFeedbacks;
