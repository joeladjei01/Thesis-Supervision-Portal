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

interface Recent {
  id: string;
  title: string;
  from: string;
  status: "Approved" | "Rejected";
}

interface RecentProps {
  data: Recent;
}

// Utility Functions

const StudentRow: React.FC<StudentRowProps> = ({ student }) => (
  <tr className="border-t border-gray-100 text-sm font-nunito-sans hover:bg-gray-50 transition-colors">
    <td className="py-4 px-0 text-sm border border-gray-100">
      <span className="font-medium px-2 text-ug-blue">
        {student.name} - {student.student_id}
      </span>
    </td>
    {/* <td className="py-4 px-4 text-sm text-center border border-gray-100">
      <span className="text-gray-700 ">
        {student.thesis_topic ? student.thesis_topic : "No Topic Proposed"}
      </span>
    </td> */}
    <td className="py-4 px-4 text-sm border border-gray-100">
      {student.programme}
    </td>
    {/* <td className="py-4 px-4 text-sm border border-gray-100">
      {student.programme_category}
    </td> */}
  </tr>
);

const Recent: React.FC<RecentProps> = ({ data }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex-1">
      <h4 className="font-medium text-gray-900 mb-1">{data.title}</h4>
      <p className="text-sm text-gray-500">{data.from}</p>
    </div>

    <span
      className={`${
        data.status == "Approved" ? "bg-green-300" : "bg-red-300"
      } text-gray-700 text-xs font-medium px-2 py-1 rounded-full`}
    >
      {data.status}
    </span>
  </div>
);

const StudentProgressTable: React.FC<{ students: Student[] }> = ({
  students,
}) => {
  const handleDetails = (studentId: string) => {
    console.log("View details for student:", studentId);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 font-nunito-sans">
          Students
        </h2>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <div className="min-w-3xl  ">
          <table className=" w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 bg-blue-50">
                <th className="p-3">Student</th>
                {/* <th className="p-3 px-4 text-left">Proposed Topic</th> */}
                <th className="p-3 px-4 text-left">Programme</th>
                {/* <th className="p-3 px-4 text-left">Level of Programme</th> */}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onDetails={handleDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={handleViewAll}
          className="w-full py-2 text-gray-600 text-sm font-medium hover:text-gray-700 transition-colors"
        >
          View All Students
        </button>
      </div> */}
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
      title: "Total # of Assigned Students",
      value: assignedStudents.length || 0,
      icon: Users,
    },
    {
      title: "Total # of Topic Proposals",
      value: proposals.length || 0,
      icon: FileText,
    },
    {
      title: "Total # of Upcoming Meetings",
      value: meetingSchedules.filter((m) => m.status === "pending").length || 0,
      icon: Video,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <Header
            Icon={UserCircleIcon}
            iconSize={40}
            title={``}
            coloredTitle={`${greeting()} ${person.name}`}
            subtitle="Supervisor Dashboard"
          />
          <SolidButton
            title={"Topic Proposals"}
            onClick={() => navigate("/topic-submissions")}
            className="w-fit py-2"
          />
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
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

        {/* Main Content Grid */}
        <div className="w-full gap-3">
          {/* Student Progress Table */}
          <div className="">
            <StudentProgressTable students={students} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
