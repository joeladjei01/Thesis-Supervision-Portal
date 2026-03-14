import React from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ChapterReview from "../../components/supervisor/ChapterReview";
import toast from "react-hot-toast";
import usePageTitle from "../../hooks/usePageTitle";
import OutlineButton from "../../components/shared/buttons/OutlineButton";

const ChapterReviewPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  usePageTitle("ThesisFlow - Chapter Review");

  // Fetch the specific chapter submission
  const { data: chapterData, isLoading: chapterLoading } = useQuery({
    queryKey: ["chapterSubmission", chapterId],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/retrieve/${chapterId}/`,
        );
        return data.data;
      } catch (error) {
        toast.error("Failed to load chapter details");
        console.log(error);
        return null;
      }
    },
    enabled: !!chapterId,
  });

  // Fetch feedbacks for this chapter
  const { data: feedbacks, isLoading: feedbacksLoading } = useQuery({
    queryKey: ["chapterFeedbacks", chapterId],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/${chapterId}/feedbacks/`,
        );
        return data.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    enabled: !!chapterId,
  });

  const handleClose = () => {
    navigate(-1);
  };

  if (chapterLoading || feedbacksLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Chapter not found.</p>
          <OutlineButton
            title="Go Back"
            onClick={handleClose}
            className="mt-4"
            Icon={<ArrowLeft size={18} />}
          />
        </div>
      </div>
    );
  }

  const chapterFeedback = feedbacks?.length
    ? feedbacks[feedbacks.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-background dark:bg-transparent p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <OutlineButton
            title="Back to Submissions"
            onClick={handleClose}
            className="py-2"
            Icon={<ArrowLeft size={18} />}
          />
        </div>

        <div className="bg-card border border-border rounded-lg shadow-md p-6">
          <ChapterReview
            data={chapterData}
            onClose={handleClose}
            chapterFeedbacks={feedbacks || []}
            previousFeedback={chapterFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterReviewPage;
