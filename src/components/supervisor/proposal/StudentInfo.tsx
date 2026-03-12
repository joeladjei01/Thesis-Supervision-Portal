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
  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
    <div className="flex items-center gap-1">
      <User size={14} />
      <span>{student.name}</span>
      <span className={`font-medium ${getDegreeColor(student.level_title)}`}>
        {student.level_title}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <Calendar size={14} />
      <span>Submitted: {formatDate(submittedDate)}</span>
    </div>
  </div>
);

export default StudentInfo;
