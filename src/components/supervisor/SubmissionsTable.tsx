import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getChaperById, shortenText } from "../../utils/helpers";

interface ChapterAssignment {
  id: string;
  chapter_title: string;
  section: string;
  due_date: string;
  description: string;
  topic: {
    id: string;
    title: string;
    description: string;
  };
  supervisor: {
    id: string;
    name: string;
    email: string;
  };
  chapter?: any;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Submission {
  id: string;
  title: string;
  content: string;
  chapter_assignment: ChapterAssignment;
  approved: boolean;
  created_at: string;
  updated_at: string;
  student: Student;
}

interface StudentSubmissionsTableProps {
  submissions?: Submission[];
  feedbacks?: any[];
}

const StudentSubmissionsTable: React.FC<StudentSubmissionsTableProps> = ({
  submissions,
  feedbacks,
}) => {
  const navigate = useNavigate();

  const onReviewClick = (data) => {
    navigate(`/supervisor/chapter-review/${data.id}`);
  };

  const getStatus = (chapterId: string) => {
    const feedB = feedbacks?.filter(
      (fb) => fb.chapter.chapter_assignment.id === chapterId,
    );
    const feedback = feedB?.length > 0 ? feedB[feedB.length - 1] : null;
    if (!feedback) {
      return "Pending";
    } else if (feedback.decision === "revise") {
      return "Needs Revision";
    } else {
      return feedback.decision === "approved" ? "Approved" : "Rejected";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400 px-2 py-1 rounded-full text-center w-24 mx-auto";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400 px-2 py-1 rounded-full text-center w-24 mx-auto";
      case "Needs Revision":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400 px-2 py-1 rounded-full text-center w-26 mx-auto";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-muted dark:text-muted-foreground px-2 py-1 rounded-full text-center w-24 mx-auto";
    }
  };

  const getScore = (chapterId: string) => {
    const feedB = feedbacks?.filter(
      (fb) => fb.chapter.chapter_assignment.id === chapterId,
    );
    const feedback = feedB?.length > 0 ? feedB[feedB.length - 1] : null;
    return feedback?.score || null;
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border shadow-md custom-scrollbar">
        <table className="w-full overflow-x-auto rounded border-collapse">
          <thead>
            <tr className="bg-muted text-muted-foreground font-medium">
              {/* <th className=" border-border bg-blue-50/60 px-11 py-3 text-left">
                Student
              </th> */}
              {/* <th className=" border-border bg-blue-50/60 py-3  px-11 text-center">
                Topic
              </th> */}
              <th className=" border-border bg-muted/60 px-4 w-[120px] pr-7 py-3 text-left">
                Chapter
              </th>
              <th className=" border-border bg-muted/60 px-4 py-3 text-left">
                Submitted
              </th>
              <th className=" border-border bg-muted/60 px-4 py-3 text-left">
                Deadline
              </th>
              <th className=" border-border bg-muted/60 px-4 py-3 text-left">
                Status
              </th>
              <th className=" border-border bg-muted/60 px-4 py-3 text-left">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions?.map((submission) => (
              <tr
                key={submission.id}
                className="bg-card hover:bg-muted/30 border border-border text-foreground cursor-pointer text-sm group"
                onClick={() => onReviewClick(submission)}
              >
                {/* <td className="group-hover:underline  px-4 py-3">
                  {submission.student.name}
                </td> */}
                {/* <td className="border border-border text-center px-4 py-2">
                  {shortenText(submission.chapter_assignment.topic.title, 30)}
                </td> */}
                <td className="border border-border px-4 py-2 text-foreground">
                  Chapter {submission.chapter_assignment.chapter.custom_title} -{" "}
                  <span className="text-muted-foreground">
                    {submission.chapter_assignment.chapter.custom_description}
                  </span>
                </td>
                <td className="border border-border px-4 py-2 text-muted-foreground">
                  {new Date(submission.created_at).toLocaleDateString()}
                </td>
                <td className="border border-border px-4 py-2 text-sm text-muted-foreground">
                  {new Date(
                    submission.chapter_assignment.due_date,
                  ).toLocaleDateString()}
                </td>
                <td className="border border-border px-4 py-2 text-xs">
                  <span
                    className={getStatusClass(
                      getStatus(submission.chapter_assignment.id),
                    )}
                  >
                    {getStatus(submission.chapter_assignment.id)}
                  </span>
                </td>

                <td className="border border-border px-4 py-2">
                  <span className="text-sm text-muted-foreground">
                    {getScore(submission.chapter_assignment.id) || "N/A"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentSubmissionsTable;
