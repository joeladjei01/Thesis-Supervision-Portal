/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import React from "react";
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

  const { isPending: loading } = useMutation({
    mutationFn: fetchFeedbacks,
  });

  // useEffect(() => {
  //   mutate()
  // }, [])

  const getStatusButton = (status: string) => {
    const baseClasses = "px-4 py-1 rounded-full text-xs font-bold border transition-colors";
    switch (status) {
      case "revise":
        return (
          <span className={`${baseClasses} bg-yellow-500/10 text-yellow-500 border-yellow-500/20`}>
            REVISE AND RESUBMIT
          </span>
        );
      case "approved":
        return (
          <span className={`${baseClasses} bg-green-500/10 text-green-500 border-green-500/20`}>
            APPROVED
          </span>
        );
      case "reject":
        return (
          <span className={`${baseClasses} bg-destructive/10 text-destructive border-destructive/20`}>
            REJECTED
          </span>
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
          <div className="bg-primary/5 border-l-4 border-primary p-5 rounded-r-xl mb-8 shadow-sm">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg
                    className="h-6 w-6 text-primary"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground">
                  Feedback is provided for specific chapters only after
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
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <h2 className="text-sm w-full bg-muted/50 p-4 font-bold text-foreground border-b border-border flex items-center gap-2">
                <MdFeedback
                  size={18}
                  className="text-primary"
                />
                Chapter Feedback
              </h2>

              <div className="relative p-6">
                {/* Chapter Header */}
                <div className="mb-6 ">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Chapter{" "}
                    {feedback.chapter.chapter_assignment.chapter.custom_title} -{" "}
                    {
                      feedback.chapter.chapter_assignment.chapter
                        .custom_description
                    }
                  </h3>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Submission: {feedback.chapter.title}
                  </p>
                </div>

                {/* Feedback Content */}
                <div className="rounded-xl mb-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h4 className="font-bold text-foreground mb-1">
                        Feedback from {feedback.chapter.supervisor.name}
                        </h4>
                        <p className="text-xs font-medium text-muted-foreground">
                        Received on {formatDate(feedback.created_at)}
                        </p>
                    </div>
                  </div>

                  <div className="sm:hidden mb-4 p-3 bg-muted/50 rounded-lg border border-border">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Decision</span>
                    {getStatusButton(feedback.decision)}
                  </div>

                  <div
                    className="text-foreground bg-muted/30 border border-border p-5 rounded-xl min-h-40 leading-relaxed shadow-inner"
                    dangerouslySetInnerHTML={{ __html: feedback.feedback_text }}
                  />
                </div>

                {/* Status */}
                <div className="absolute hidden sm:flex flex-col items-end text-sm top-6 right-6">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Decision</span>
                  {getStatusButton(feedback.decision)}
                </div>

                {feedback.file_attachment && (
                  <div className="mb-6 p-4 bg-muted/20 border border-border rounded-xl">
                    <h4 className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-3">
                      Attachment:
                    </h4>
                    <a
                      href={`https://thesisflow.sbuildsolutions.org${feedback.file_attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-primary font-bold hover:underline group/file"
                    >
                      <File className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
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
          <div className="bg-card rounded-2xl shadow-sm border border-border p-16 text-center">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-muted-foreground"
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
            <h3 className="text-xl font-bold text-foreground mb-3">
              No feedback available
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You haven't received any feedback from your supervisors yet. Feedback appears here after review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorFeedbacks;
