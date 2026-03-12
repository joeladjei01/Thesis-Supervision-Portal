import { formatDate } from '../../utils/helpers';
import React from 'react';

interface UpcomingSubmission {
  id: string;
  chapter: string;
  dueDate: string;
  daysUntilDue: number;
  status: 'upcoming';
}

interface UpcomingSubmissionsProps {
  submissions?: any[];
}

const getDaysLeft = (dueDate: string): any => {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return daysLeft > 0 ? daysLeft : "passed";
};


const UpcomingSubmissions: React.FC<UpcomingSubmissionsProps> = ({
  submissions = [
    { id: '1', chapter: 'Chapter 1', dueDate: '2-06-2025', daysUntilDue: 22, status: 'upcoming' },
    { id: '2', chapter: 'Chapter 2', dueDate: '16-06-2025', daysUntilDue: 36, status: 'upcoming' },
    { id: '3', chapter: 'Chapter 3', dueDate: '22-06-2025', daysUntilDue: 42, status: 'upcoming' }
  ]
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Submissions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-0 font-medium text-gray-600">Chapters</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Days Until Due</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr 
                key={submission.id}
                className={`${index !== submissions.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}
              >
                <td className="py-4 px-0">
                  <span className="text-blue-700 font-medium">{submission.chapter_title}</span>
                </td>
                <td className="py-4 px-4 text-gray-700">{formatDate(submission.due_date)}</td>
                <td className={`"py-4 px-4 text-gray-700 text-center font-semibold  `}>
                  <p className={`${getDaysLeft(submission.due_date) === "passed" && "bg-red-300 text-xs font-medium text-red-900 text-center rounded-full w-fit p-1 px-7"}`}>{getDaysLeft(submission.due_date)}</p>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                    Upcoming
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingSubmissions;