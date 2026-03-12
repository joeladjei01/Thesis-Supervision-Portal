import { Search } from "lucide-react";
import { getChaperById, getSectionById } from "../../utils/helpers";
import React, { useState } from "react";

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
  student : {
    id: string;
    first_name: string;
    email: string;
  } 
}

interface ChapterAssignmentsTableProps {
  assignments: ChapterAssignment[];
}

const ChapterAssignmentsTable: React.FC<ChapterAssignmentsTableProps> = ({ assignments }) => {
  const [filter, setFilter] = useState("");

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.student.first_name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <>
    <div className="my-4 mt-9">
      <h2 className="text-2xl font-semibold mb-4">Chapter Assignments</h2>
      <div className="relative">
          <Search className="absolute left-3 top-2 text-gray-400" /> {/* Search icon */}
          <input
            type="text"
            placeholder="Search student"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-13 py-2 w-full mb-4" // Adjust padding for the icon
          />
        </div>
      </div>
    
    <div className="overflow-x-auto rounded-lg border border-gray-300">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-7 py-2 text-left text-gray-700 bg-blue-50/60">Student</th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 bg-blue-50/60">Chapter Title</th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 bg-blue-50/60">Section</th>
            <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 bg-blue-50/60">Due Date</th>
            <th className="border border-gray-300 px-7 py-2 text-left text-gray-700 bg-blue-50/60">Topic</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((assignment) => (
            <tr key={assignment.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{assignment.student.first_name}</td>
              <td className="border border-gray-300 px-4 py-2">{getChaperById(assignment.chapter_title).label}</td>
              <td className="border border-gray-300 px-4 py-2">{getSectionById(assignment.section).label}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(assignment.due_date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{assignment.topic.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ChapterAssignmentsTable;