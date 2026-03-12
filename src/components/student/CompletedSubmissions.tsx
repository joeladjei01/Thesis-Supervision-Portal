import React from "react";
import { Download, Eye } from "lucide-react";

interface Submission {
  id: string;
  chapter: string;
  dueDate: string;
  submittedDate: string;
  feedback: "received" | "pending" | null;
}

interface CompletedSubmissionsProps {
  submissions?: Submission[];
}

const completedSubmissions = [
    {
      id: "1",
      chapter: "Research Proposal",
      dueDate: "22-05-2025",
      submittedDate: "20-05-2025",
      feedback: "received",
    },
    {
      id: "2",
      chapter: "Chapter 1",
      dueDate: "16-04-2025",
      submittedDate: "12-04-2025",
      feedback: "received",
    },
  ];

const CompletedSubmissions: React.FC<CompletedSubmissionsProps> = ({
  submissions = completedSubmissions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Completed Submissions
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left  py-3 px-0 font-medium text-gray-600">
              Chapters
            </th>
            <th className="text-left  py-3 px-0 font-medium text-gray-600">
              Due Date
            </th>
            <th className="text-left  py-3 px-0 font-medium text-gray-600">
              Submitted
            </th>
            <th className="text-left  py-3 px-0 font-medium text-gray-600">
              Feedback
            </th>
            <th className="text-left  py-3 px-0 font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b border-gray-200">
              <td className="py-4 px-0 text-gray-800">{submission.chapter}</td>
              <td className="py-4 px-4 text-gray-800">{submission.dueDate}</td>
              <td className="py-4 px-4 text-gray-800">
                {submission.submittedDate}
              </td>
              <td className="py-4 px-4 text-gray-800">
                {submission.feedback === "received" ? "Received" : "Pending"}
              </td>
              <td className="py-4 px-4 text-gray-800 flex gap-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompletedSubmissions;