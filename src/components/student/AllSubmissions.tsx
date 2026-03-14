import React from "react";
// import { Download, Eye, Upload } from 'lucide-react';
// import SolidButton from "../shared/buttons/SolidButton";
import { formatDate, getChaperById, getDaysLeft } from "../../utils/helpers";
import { useNavigate } from "react-router";
import useChapterStore from "../../store/useChapterStore";
import type { ChapterSubmissionFeedback } from "@/utils/types";

interface AllSubmissionsProps {
  chapters?: any;
  submissions?: any[];
  feedbacks?: any[];
}

const AllSubmissions: React.FC<AllSubmissionsProps> = ({
  chapters,
  submissions,
  feedbacks,
}) => {
  const navigate = useNavigate();
  const setSelectedChapter = useChapterStore(
    (state) => state.setSelectedChapter,
  );

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChapterSelect = (chapter: any) => {
    setSelectedChapter(chapter);
    navigate(`/submissions/chapter/${chapter.id}`);
  };

  const submittedSubmission = (chapter: any) : any => {
    return submissions?.filter(
      (sub) => sub.chapter_assignment.id === chapter?.id,
    );
  };

  const getStatusBadge = (feedbackChapter: any, chapter: any) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border";

    const isSubmitted = submittedSubmission(chapter);
    const isDraft = isSubmitted.find((sub: any) => sub.status === "draft");
    const isApproved = isSubmitted.find((sub: any) => sub.approved === true);

    if (feedbackChapter?.decision == "approved" || isApproved) {
      return `${baseClasses} bg-green-500/10 text-green-500 border-green-500/20`;
    } else if (feedbackChapter?.decision === "reject") {
      return `${baseClasses} bg-red-500/10 text-red-500 border-red-500/20`;
    } else if (feedbackChapter?.decision === "revise" && isDraft) {
      return `${baseClasses} bg-yellow-500/10 text-yellow-500 border-yellow-500/20`;
    } else {
      if (isDraft) {
        return `${baseClasses} bg-muted text-muted-foreground border-border`;
      } else if (isSubmitted.length > 0) {
        return `${baseClasses} bg-primary/10 text-primary dark:text-gray-400 border-primary/20 dark:border-gray-400`;
      } else if (getDaysLeft(chapter.due_date) <= 0) {
        return `${baseClasses} text-destructive italic font-medium border-transparent bg-destructive/5`;
      }
      return `${baseClasses} bg-muted text-muted-foreground border-border`;
    }
  };

  const getStatusText = (feedbackChapter: any, chapter: any) => {
    // console.log("Chapter", chapter);
    const isSubmitted = submittedSubmission(chapter);
    const isDraft = isSubmitted.find((sub: any) => sub.status === "draft");
    const isApproved = isSubmitted.find((sub: any) => sub.approved === true);

    if (feedbackChapter?.decision == "approved" || isApproved) {
      return "Approved";
    } else if (feedbackChapter?.decision === "reject") {
      return "Rejected";
    } else if (feedbackChapter?.status === "submitted") {
      return "Submitted";
    } else if (feedbackChapter?.decision === "revise" && isDraft) {
      return "Needs Revision";
    } else {
      if (isDraft) {
        return "Draft";
      } else if (isSubmitted.length > 0) {
        // console.log("Submission is in draft", isSubmitted);
        return "Submitted";
      } else if (getDaysLeft(chapter.due_date) <= 0) {
        return "due";
      } else {
        return "pending";
      }
    }
  };

  const completedSubmission = (chapter: any) => {
    const comp: ChapterSubmissionFeedback = feedbacks?.find(
      (f) => f.chapter.chapter_assignment.id == chapter?.id,
    );
    return comp;
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 w-full">
      <h2 className="text-lg font-bold text-foreground mb-6">
        All Submissions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-0 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                Chapters
              </th>
              <th className="text-left py-3 px-7 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                Due Date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                Days Until Due date
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {chapters?.map((chapter: any, index: number) => (
              <tr
                key={chapter.id}
                onClick={() => handleChapterSelect(chapter)}
                className={`${index !== submissions?.length - 1
                    ? "border-b border-border/50"
                    : ""
                  } hover:bg-muted/50 cursor-pointer transition-colors duration-200`}
              >
                <td className="py-4 px-2">
                  <span className="text-foreground text-sm font-semibold group-hover:text-primary transition-colors">{`${chapter.chapter?.custom_title} - ${chapter.chapter?.custom_description}`}</span>
                </td>
                <td className="py-4 px-2 text-sm text-muted-foreground">
                  {formatDate(chapter.due_date)}
                </td>
                <td
                  className={`py-4 px-4 text-sm text-muted-foreground text-center font-semibold`}
                >
                  <p
                    className={`${getDaysLeft(chapter.due_date) < 0 &&
                      "italic font-medium text-destructive"
                      }`}
                  >
                    {getDaysLeft(chapter.due_date)}
                  </p>
                </td>
                <td className="py-4 px-4 flex items-center gap-2">
                  <span
                    className={getStatusBadge(
                      completedSubmission(chapter),
                      chapter,
                    )}
                  >
                    {getStatusText(completedSubmission(chapter), chapter)}
                  </span>

                  {submittedSubmission(chapter).find(
                    (sub: any) => sub.status === "draft",
                  ) && <div className="size-2 bg-muted-foreground/30 rounded-full" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllSubmissions;
