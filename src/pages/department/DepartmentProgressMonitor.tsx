import Header from "../../components/shared/text/Header";
import StudentProgress from "../../components/progress-mointor/StudentProgress";
import { useDepartmentDataStore } from "../../store/useDepartmentDataStore";
import React from "react";

const DepartmentProgressMonitor = () => {
  const { students, supervisors } = useDepartmentDataStore();
  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="mb-6">
        <Header
          title={"Student Progress"}
          subtitle={"Monitor the progress of students across chapters"}
        />
      </div>
      <StudentProgress students={students} supervisors={supervisors} />
    </div>
  );
};

export default DepartmentProgressMonitor;
