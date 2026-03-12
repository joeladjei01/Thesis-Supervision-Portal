import React from 'react';
import { Download, Eye, Upload } from 'lucide-react';
import SolidButton from '../../components/shared/buttons/SolidButton';
import { formatDate, getChaperById } from '../../utils/helpers';

type SubmissionStatus = 'completed' | 'pending' | 'upcoming';

interface AllSubmission {
  id: string;
  chapter: string;
  dueDate: string;
  submittedDate: string | null;
  status: SubmissionStatus;
  feedback: 'Received' | 'Pending' | null;
}

interface AllSubmissionsProps {
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  submissions?: any;
  onDownload?: (submissionId: string) => void;
  onView?: (submissionId: string) => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (submission: any) => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  feedbacks?: any[];
}



const PendingSubmissions: React.FC<AllSubmissionsProps> = ({
  submissions = [
    { id: '1', chapter: 'Chapter 1', dueDate: '22-05-2025', submittedDate: '20-05-2025', status: 'completed', feedback: 'Received' },
    { id: '2', chapter: 'Chapter 2', dueDate: '16-04-2025', submittedDate: '12-04-2025', status: 'completed', feedback: 'Received' },
    { id: '3', chapter: 'Chapter 3', dueDate: '12-05-2025', submittedDate: '9-05-2025', status: 'pending', feedback: null },
    { id: '4', chapter: 'Chapter 4', dueDate: '17-05-2025', submittedDate: '13-05-2025', status: 'upcoming', feedback: null }
  ],
  onDownload,
  onView,
  onSubmit,
  feedbacks,
}) => {


  const getDaysLeft = (dueDate: string): any => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysLeft > 0 ? daysLeft : "passed";
  };

  const completedSubmission = () =>{
    return feedbacks.filter((f) => f.decision === "approved")
  }

  console.log("completedSubmission", completedSubmission());


  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 w-full">
      <h2 className="text-lg font-cal-sans tracking-wide text-gray-500 mb-4">All Submissions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-0 font-medium text-gray-600">Chapters</th>
              {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Due Date</th> */}
              {/* <th className="text-left py-3 px-4 font-medium text-gray-600">Days Until Due date</th> */}
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr 
                key={submission.id}
                className={`${index !== submissions.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50`}
              >
                <td className="py-4 px-0">
                  <span className="text-blue-700 font-medium">{getChaperById(submission.chapter_title).label}</span>
                </td>
                <td className="py-4 px-4 text-gray-700">{formatDate(submission.due_date)}</td>
                {/* <td className={`"py-4 px-4 text-gray-700 text-center font-semibold  `}>
                  <p className={`${getDaysLeft(submission.due_date) === "passed" && "bg-red-300 text-red-900 text-center rounded-full w-fit p-1 px-7"}`}>{getDaysLeft(submission.due_date)}</p>
                </td> */}
                {/* <td className="py-4 px-4">
                  <span className={getStatusBadge(submission.status)}>
                    {getStatusText(submission.status)}
                  </span>
                </td> */}

                <td className="py-4 px-4 space-x-2">
                  <SolidButton
                    title={"submit"}
                    onClick={() => onSubmit(submission)}
                    // disabled={feedbacks?.filter(f => f.chapter.id === submission.id).find(f => f.decision === "approved")}
                    disabled={completedSubmission().find(f => f.chapter.id === submission.id)}
                    Icon={<Upload className="h-4 w-4" />}
                    className='py-2'
                  />
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingSubmissions;