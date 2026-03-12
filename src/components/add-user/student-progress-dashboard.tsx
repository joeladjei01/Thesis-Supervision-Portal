import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface StudentProgress {
  student: string;
  studentId: string;
  supervisor: string;
  lastUpdate: string;
  progress: number;
}

const StudentProgressDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Students');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const students: StudentProgress[] = [
    {
      student: 'John Smith',
      studentId: '11233977',
      supervisor: 'Prof. Solomon Mensah',
      lastUpdate: '05-15-2025',
      progress: 65
    },
    {
      student: 'Emily Johnson',
      studentId: '10243957',
      supervisor: 'Prof. Solomon Mensah',
      lastUpdate: '05-17-2025',
      progress: 70
    },
    {
      student: 'Michael Brown',
      studentId: '11235949',
      supervisor: 'Dr. Sarah Williams',
      lastUpdate: '05-23-2025',
      progress: 20
    },
    {
      student: 'Sarah Davis',
      studentId: '11283468',
      supervisor: 'Dr. Sarah Williams',
      lastUpdate: '06-02-2025',
      progress: 40
    },
    {
      student: 'David Wilson',
      studentId: '10283988',
      supervisor: 'Dr. Sarah Williams',
      lastUpdate: '06-09-2025',
      progress: 80
    },
    {
      student: 'Michael Brown',
      studentId: '12283233',
      supervisor: 'Dr. Sarah Williams',
      lastUpdate: '06-15-2025',
      progress: 30
    },
    {
      student: 'Lord Konadu',
      studentId: '11362466',
      supervisor: 'Dr. Sarah Williams',
      lastUpdate: '06-19-2025',
      progress: 20
    },
    {
      student: 'Martin Freeman',
      studentId: '10252655',
      supervisor: 'Dr. Sarah Williams',
      lastUpdate: '06-25-2025',
      progress: 85
    }
  ];

  const filterOptions = ['All Students', 'Prof. Solomon Mensah', 'Dr. Sarah Williams'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    const matchesFilter = selectedFilter === 'All Students' || student.supervisor === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-green-400';
    if (progress >= 40) return 'bg-yellow-400';
    if (progress >= 20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const handleDetailsClick = (studentName: string) => {
    console.log(`Viewing details for ${studentName}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Progress</h1>
          <p className="text-gray-600">Monitor the progress of students in your department</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search Student......"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full sm:w-48 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <span className="text-gray-700">{selectedFilter}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Student ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Supervisor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Last Update</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={`${student.studentId}-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4">
                    <span className="font-medium text-blue-700">{student.student}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-blue-600 font-medium">{student.studentId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{student.supervisor}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{student.lastUpdate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.progress)}`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 min-w-10">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDetailsClick(student.student)}
                      className="px-4 py-1 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-150 text-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProgressDashboard;