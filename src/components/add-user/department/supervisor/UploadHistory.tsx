import React from 'react';
import { FileText } from 'lucide-react';

interface FileRecord {
  date: string;
  file: string;
  records: number;
  status: 'Complete' | 'Processing' | 'Failed';
  uploadedBy: string;
}

const UploadHistory: React.FC = () => {
  const fileRecords: FileRecord[] = [
    {
      date: 'May 6, 2025',
      file: 'students_may_intake.xlsx',
      records: 45,
      status: 'Complete',
      uploadedBy: 'Department Head'
    },
    {
      date: 'May 15, 2025',
      file: 'students_may_intake.csv',
      records: 60,
      status: 'Complete',
      uploadedBy: 'Department Head'
    },
    {
      date: 'May 26, 2025',
      file: 'students_may_intake.xlsx',
      records: 66,
      status: 'Complete',
      uploadedBy: 'Admin'
    },
    {
      date: 'June 2, 2025',
      file: 'students_june_intake.csv',
      records: 66,
      status: 'Complete',
      uploadedBy: 'Department Head'
    },
    {
      date: 'June 16, 2025',
      file: 'students_june_intake.xlsx',
      records: 109,
      status: 'Complete',
      uploadedBy: 'Admin'
    },
    {
      date: 'July 18, 2025',
      file: 'students_july_intake.csv',
      records: 202,
      status: 'Complete',
      uploadedBy: 'Department Head'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">
                  Uploaded by
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fileRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 text-blue-900 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {record.file}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                    {record.records}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900`}>
                    {record.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                      onClick={() => console.log('View file:', record.file)}
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadHistory;