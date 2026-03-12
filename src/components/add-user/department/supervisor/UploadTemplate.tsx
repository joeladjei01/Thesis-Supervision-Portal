import React from "react";

interface Student {
  studentId: string;
  name: string;
  gender: string;
  email: string;
  programmeLevel: string;
  programmeName: string;
  topic: string;
  contactNumber: string;
}

const UploadTemplate: React.FC = () => {
  const students: Student[] = [
    {
      studentId: "11233977",
      name: "John Smith",
      gender: "Male",
      email: "johnsmith@st.ug.edu.gh",
      programmeLevel: "MSc",
      programmeName: "Computer Science",
      topic: "Deep Learning",
      contactNumber: "0123 345 678",
    },
    {
      studentId: "10243957",
      name: "Emily Johnson",
      gender: "Female",
      email: "emilyjohnson@st.ug.edu.gh",
      programmeLevel: "MSc",
      programmeName: "Computer Science",
      topic: "Deep Learning",
      contactNumber: "0123 345 678",
    },
    {
      studentId: "11235949",
      name: "Michael Brown",
      gender: "Male",
      email: "michaelbrown@st.ug.edu.gh",
      programmeLevel: "MSc",
      programmeName: "Computer Science",
      topic: "Deep Learning",
      contactNumber: "0123 345 678",
    },
    {
      studentId: "11283468",
      name: "Sarah Davis",
      gender: "Female",
      email: "sarahdavis@st.ug.edu.gh",
      programmeLevel: "PhD",
      programmeName: "Computer Science",
      topic: "Deep Learning",
      contactNumber: "0123 345 678",
    },
    {
      studentId: "10283988",
      name: "David Wilson",
      gender: "Male",
      email: "davidwilson@st.ug.edu.gh",
      programmeLevel: "PhD",
      programmeName: "Computer Science",
      topic: "Deep Learning",
      contactNumber: "0123 345 678",
    },
    {
      studentId: "12283233",
      name: "Evans Brown",
      gender: "Male",
      email: "evansbrown@st.ug.edu.gh",
      programmeLevel: "PhD",
      programmeName: "Computer Science",
      topic: "Deep Learning",
      contactNumber: "0123 345 678",
    },
  ];

  // const getProgrammeLevelColor = (level: string) => {
  //   return level === 'PhD' ? 'text-blue-700 font-medium' : 'text-blue-600';
  // };

  return (
    <div className="w-full ">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Student ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Gender
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Programme Level
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Programme Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider border-r border-gray-200">
                  Topic
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 tracking-wider">
                  Contact Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr
                  key={student.studentId}
                  className={`hover:bg-gray-50 text-blue-900 border-gray-200  transition-colors duration-150 ${
                    index % 2 === 1 ? "bg-gray-25" : ""
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-900 border-r border-gray-200">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-200">
                    {student.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-200">
                    {student.gender}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm border-r border-gray-200">
                    {student.email}
                  </td>
                  <td
                    className={`px-4 py-4 whitespace-nowrap text-sm border-r border-gray-200`}
                  >
                    {student.programmeLevel}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-200">
                    {student.programmeName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-200">
                    {student.topic}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm ">
                    {student.contactNumber}
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

export default UploadTemplate;
