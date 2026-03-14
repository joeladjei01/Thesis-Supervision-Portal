import React from "react";
import { FileText, UserCircleIcon, Users, Video } from "lucide-react";
import Header from "../../components/shared/text/Header";
import SolidButton from "../../components/shared/buttons/SolidButton";
import { useNavigate } from "react-router";
import usePageTile from "../../hooks/usePageTitle";
import userStore from "../../store";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import DashboardCard from "../../components/dashboards/dashb/DashboardCard";
import { greeting } from "../../utils/helpers";

// Types and Interfaces
interface Student {
  id: string;
  name: string;
  student_id: string;
  thesis_topic: string;
  programme: string;
  programme_category: string;
}

interface StudentRowProps {
  student: Student;
  onDetails: (studentId: string) => void;
}

// Utility Components

const StudentRow: React.FC<StudentRowProps> = ({ student }) => (
  <tr className="border-t border-gray-100 dark:border-border text-sm font-nunito-sans hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors">
    <td className="py-4 px-4 text-sm border-r border-gray-100 dark:border-border">
      <span className="font-bold text-gray-900 dark:text-white">
        {student.name}
      </span>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
        {student.student_id}
      </div>
    </td>
    <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">
      {student.programme}
    </td>
  </tr>
);

const StudentProgressTable: React.FC<{ students: Student[] }> = ({
  students,
}) => {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-border shadow-sm overflow-hidden transition-all duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-border flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-nunito-sans">
          Assigned Students
        </h2>
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
          {students.length} Total
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-secondary/10">
              <th className="px-6 py-4">Student Info</th>
              <th className="px-6 py-4">Programme of Study</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-border bg-white dark:bg-card">
            {students.length > 0 ? (
              students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onDetails={() => {}}
                />
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-12 text-center text-gray-500 dark:text-gray-400 italic">
                  No students assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component
const SupervisorDashboard: React.FC = () => {
  usePageTile("Supervisor - Dashboard");
  const { person } = userStore();
  const {
    assignedStudents,
    topicProposals: proposals,
    meetingSchedules,
  } = useSupervisorDataStore();

  const students: Student[] = assignedStudents.map((student: any) => ({
    id: student.id,
    student_id: student.student.student_id,
    name: student.student.name,
    thesis_topic: student.student.thesis_topic,
    programme: student.student.programme,
    programme_category: student.student.programme_category,
  }));

  const navigate = useNavigate();

  const stat = [
    {
      title: "Assigned Students",
      value: assignedStudents.length || 0,
      icon: Users,
    },
    {
      title: "Topic Proposals",
      value: proposals.length || 0,
      icon: FileText,
    },
    {
      title: "Upcoming Meetings",
      value: meetingSchedules.filter((m) => m.status === "pending").length || 0,
      icon: Video,
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <Header
            Icon={UserCircleIcon}
            iconSize={48}
            title={``}
            coloredTitle={`${greeting()}, ${person.name}`}
            subtitle="Explore your supervisory activities and track student progress at a glance."
          />
          <div className="flex gap-3">
             <SolidButton
              title="Topic Proposals"
              onClick={() => navigate("/topic-submissions")}
              className="py-2.5 px-6 shadow-lg shadow-blue-500/10"
              Icon={<FileText size={18} />}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stat.map((item) => (
            <DashboardCard
              key={item.title}
              title={item.title}
              number={item.value}
              Icon={item.icon}
              subTitle={""}
            />
          ))}
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          <div className="transition-all duration-300 transform">
            <StudentProgressTable students={students} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
