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

  const submittedSubmission = (chapter) => {
    return submissions?.filter(
      (sub) => sub.chapter_assignment.id === chapter?.id,
    );
  };

  const getStatusBadge = (feedbackChapter, chapter) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    const isSubmitted = submittedSubmission(chapter);
    const isDraft = isSubmitted.find((sub) => sub.status === "draft");
    const isApproved = isSubmitted.find((sub) => sub.approved === true);

    if (feedbackChapter?.decision == "approved" || isApproved) {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (feedbackChapter?.decision === "reject") {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (feedbackChapter?.decision === "revise" && isDraft) {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else {
      if (isDraft) {
        return `${baseClasses}  bg-gray-100 text-gray-800`;
      } else if (isSubmitted.length > 0) {
        return `${baseClasses} bg-blue-100 text-blue-800`;
      } else if (getDaysLeft(chapter.due_date) <= 0) {
        return `${baseClasses}  text-red-600 italic font-medium`;
      }
      return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (feedbackChapter, chapter) => {
    // console.log("Chapter", chapter);
    const isSubmitted = submittedSubmission(chapter);
    const isDraft = isSubmitted.find((sub) => sub.status === "draft");
    const isApproved = isSubmitted.find((sub) => sub.approved === true);

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

  const completedSubmission = (chapter) => {
    const comp: ChapterSubmissionFeedback = feedbacks?.find(
      (f) => f.chapter.chapter_assignment.id == chapter?.id,
    );
    return comp;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full">
      <h2 className="text-lg font-cal-sans tracking-wide text-gray-500 mb-4">
        All Submissions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-0 font-medium text-gray-600">
                Chapters
              </th>
              <th className="text-left py-3 px-7 font-medium text-gray-600">
                Due Date
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Days Until Due date
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {chapters?.map((chapter, index) => (
              <tr
                key={chapter.id}
                onClick={() => handleChapterSelect(chapter)}
                className={`${index !== submissions?.length - 1
                    ? "border-b border-gray-100"
                    : ""
                  } hover:bg-blue-50/50 cursor-pointer rounded-md`}
              >
                <td className="py-4 px-2">
                  <span className="text-blue-800 text-sm font-medium">{`${chapter.chapter?.custom_title} - ${chapter.chapter?.custom_description}`}</span>
                </td>
                <td className="py-4 px-2 text-sm text-gray-700">
                  {formatDate(chapter.due_date)}
                </td>
                <td
                  className={`"py-4 px-4 text-sm text-gray-700 text-center font-semibold  `}
                >
                  <p
                    className={`${getDaysLeft(chapter.due_date) < 0 &&
                      " italic font-medium text-red-600"
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
                    (sub) => sub.status === "draft",
                  ) && <div className="size-3 bg-slate-500 rounded-full" />}
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
