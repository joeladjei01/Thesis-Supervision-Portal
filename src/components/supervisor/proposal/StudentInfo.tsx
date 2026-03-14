import { Calendar, User } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import type { Student } from "../../../utils/types";

interface StudentInfoProps {
  student: Student;
  submittedDate: string;
}

const getDegreeColor = (degree: Student["level_title"]): string => {
  const colors: Record<Student["level_title"], string> = {
    PhD: "text-purple-600",
    MSc: "text-blue-600",
    BSc: "text-green-600",
  };
  return colors[degree];
};

const StudentInfo: React.FC<StudentInfoProps> = ({
  student,
  submittedDate,
}) => (
  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 bg-gray-50 dark:bg-secondary/5 p-2 rounded-lg border border-gray-100 dark:border-border/40">
    <div className="flex items-center gap-1.5 border-r border-gray-200 dark:border-border/40 pr-4">
      <User size={14} className="text-blue-600 dark:text-blue-400" />
      <span className="text-gray-900 dark:text-white">{student.name}</span>
      <span className={`px-2 py-0.5 rounded-md bg-white dark:bg-secondary/20 shadow-sm border border-gray-100 dark:border-border/40 ${getDegreeColor(student.level_title)}`}>
        {student.level_title}
      </span>
    </div>
    <div className="flex items-center gap-1.5">
      <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
      <span>Submitted: {formatDate(submittedDate)}</span>
    </div>
  </div>
);

export default StudentInfo;
