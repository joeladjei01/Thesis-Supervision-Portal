import React from "react";
import { Download, Eye } from "lucide-react";

const pendingSubmissions = [
    {
      id: "1",
      chapter: "Research Proposal",
      dueDate: "22-05-2025",
      daysLeft: 17,
    },
    {
      id: "2",
      chapter: "Chapter 1",
      dueDate: "16-04-2025",
      daysLeft: 5,
    },
  ];

interface Submission {
  id: string;
  chapter: string;
  dueDate: string;
  daysLeft: number;
}

interface PendingSubmissionsProps {
  submissions?: Submission[];
}

const ReviewSubmissions: React.FC<PendingSubmissionsProps> = ({
  submissions = pendingSubmissions,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Pending Submissions
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-sm font-medium text-gray-600 py-3 px-0">
              Chapters
            </th>
            <th className="text-left text-sm font-medium text-gray-600 py-3 px-0">
              Due Date
            </th>
            <th className="text-left text-sm font-medium text-gray-600 py-3 px-0">
              Days Left
            </th>
            <th className="text-left text-sm font-medium text-gray-600 py-3 px-0">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b border-gray-200">
              <td className="text-sm text-gray-800 py-4 px-4">{submission.chapter}</td>
              <td className="text-sm text-gray-800 py-4 px-4">{submission.dueDate}</td>
              <td className="text-sm text-gray-800 py-4 px-4">{submission.daysLeft}</td>
              <td className="text-sm text-gray-800 py-4 px-4 flex gap-2">
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

export default ReviewSubmissions;