import Header from "../../components/shared/text/Header";
import usePageTile from "../../hooks/usePageTitle";
import { ChevronRight } from "lucide-react";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import { useNavigate } from "react-router";


//--------------------------------------------------------------------------

const ReviewSubmissions: React.FC = () => {
  const { assignedStudents } = useSupervisorDataStore();
  const navigate = useNavigate();
  usePageTile("ThesisFlow - Student Submissions");


  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <Header
          title="Student Submissions"
          subtitle="View student submission and give a comment"
        />
      </div>


      {/* Assigned Students Section */}
      {assignedStudents && assignedStudents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-foreground">My Students</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedStudents.map((student) => (
              <div
                key={student.id}
                onClick={() =>
                  navigate(
                    `/supervisor/student/${student.student.id}/submissions`,
                  )
                }
                className="bg-card border border-border rounded-xl p-5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500"></div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1 text-foreground group-hover:text-primary">
                      {student.student.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                      ID: {student.student.student_id}
                    </p>
                    {student.student.programme && (
                      <p className="text-xs text-muted-foreground bg-muted rounded px-2 py-1 inline-block">
                        {student.student.programme}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;
