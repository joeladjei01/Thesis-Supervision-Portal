import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  User,
  BookOpen,
  GraduationCap,
  Mail,
  FileText,
  ArrowRight,
  School,
  LayoutGrid,
} from "lucide-react";
import Loading from "../../components/shared/loader/Loading";
import toast from "react-hot-toast";
import Modal from "../../layouts/Modal";
import Header from "../../components/shared/text/Header";

const SupervisorStudents = () => {
  const axios = useAxiosPrivate();
  const person = userStore((state) => state.person);
  const [displayModal, setDisplayModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const { data: students, isLoading } = useQuery({
    queryKey: ["supervisor-students"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/supervisors/supervisor/students/${person.id}/`,
        );
        return data.data as any[];
      } catch (error) {
        toast.error("Error fetching students");
        console.error("Error fetching students:", error);
      }
    },
  });

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setDisplayModal(true);
  };

  if (isLoading) {
    return <Loading message="Loading your students..." />;
  }

  if (!students || students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-card rounded-2xl border-2 border-dashed border-gray-200 dark:border-border transition-colors duration-300">
        <div className="bg-gray-50 dark:bg-secondary/10 p-4 rounded-full mb-4">
          <User size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-900 dark:text-white text-xl font-bold mb-2">
          No students assigned
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center">
          You currently have no students assigned to you for supervision.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header
          title="Assigned Students"
          subtitle={`Managing ${students.length} student${students.length !== 1 ? "s" : ""} under your supervision.`}
          Icon={GraduationCap}
        />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {students?.map((student) => (
            <div
              key={student.id}
              className="group bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-xl dark:hover:shadow-blue-900/10 border border-gray-200 dark:border-border overflow-hidden transition-all duration-300"
            >
              {/* Card Header Area */}
              <div className="relative p-6 pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {student.student.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                      ID: {student.student.student_id}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-800/30 group-hover:scale-110 transition-transform">
                    <User size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Card Body - Content */}
              <div className="p-6 space-y-5">
                {/* Level & Programme */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-4 p-3 bg-gray-50/50 dark:bg-secondary/5 rounded-md border border-gray-100 dark:border-border/40">
                    <div className="bg-white dark:bg-secondary/10 p-1.5 rounded-lg shadow-sm">
                      <GraduationCap size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Level / Programme</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {student.student.level} • {student.student.programme}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3 bg-gray-50/50 dark:bg-secondary/5 rounded-xl border border-gray-100 dark:border-border/40">
                    <div className="bg-white dark:bg-secondary/10 p-1.5 rounded-lg shadow-sm">
                      <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">Contact Email</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={student.student.user.email}>
                        {student.student.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supervisor Role Tag */}
                <div className="pt-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    student.lead 
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30"
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30"
                  }`}>
                    {student.lead ? "Lead Supervisor" : "Co-Supervisor"}
                  </span>
                </div>
              </div>

              {/* Card Footer - Action Area */}
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-secondary/10 border-t border-gray-100 dark:border-border flex gap-3">
                <button
                  onClick={() => handleViewDetails(student)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-bold rounded-md shadow-md shadow-blue-500/10 transition-all active:scale-95"
                >
                  <FileText size={16} />
                  View Portfolio
                </button>
                <button
                  onClick={() => handleViewDetails(student)}
                  className="inline-flex items-center justify-center p-2.5 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 rounded-md hover:bg-white dark:hover:bg-secondary/20 transition-all active:scale-95 shadow-sm"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {displayModal && selectedStudent && (
        <Modal
          headTitle={`${selectedStudent.student.name}`}
          subHeadTitle="Detailed Academic Portfolio"
          buttonDisabled={false}
          handleConfirm={() => setDisplayModal(false)}
          handleCancel={() => {
            setDisplayModal(false);
            setSelectedStudent(null);
          }}
          w="max-w-4xl"
        >
          <div className="p-2 space-y-8">
            {/* Top Grid - Personal & Supervision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-gray-50/50 dark:bg-secondary/10 p-6 rounded-2xl border border-gray-100 dark:border-border">
                <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={16} />
                  Individual Profile
                </h3>
                <div className="grid gap-5">
                  {[
                    { label: "Full Identity", value: selectedStudent.student.name },
                    { label: "Institutional ID", value: selectedStudent.student.student_id },
                    { label: "Email Address", value: selectedStudent.student.user.email },
                    { label: "Gender Designation", value: selectedStudent.student.gender || "Undefined" },
                  ].map((item, idx) => (
                    <div key={idx} className="border-b border-gray-100 dark:border-border/40 pb-2 last:border-0 last:pb-0">
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="space-y-6">
                <section className="bg-gray-50/50 dark:bg-secondary/10 p-6 rounded-2xl border border-gray-100 dark:border-border">
                  <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BookOpen size={16} />
                    Supervisory Context
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-border flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Role</span>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        selectedStudent.lead 
                          ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                      }`}>
                        {selectedStudent.lead ? "Lead Supervisor" : "Assistant Supervisor"}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50/50 dark:bg-secondary/10 p-6 rounded-2xl border border-gray-100 dark:border-border">
                   <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <LayoutGrid size={16} />
                    Program Metadata
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter mb-0.5">Academic Level</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{selectedStudent.student.programme_level?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter mb-0.5">Year Status</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedStudent.student.level}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom Section - Institutional Structure */}
            <section className="bg-white dark:bg-secondary/5 p-6 rounded-2xl border border-gray-200 dark:border-border shadow-inner">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <School size={16} />
                Institutional Affiliation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Constituent School", value: selectedStudent.student.school?.replace(/-/g, " ") },
                  { label: "Academic College", value: selectedStudent.student.college?.replace(/-/g, " ") },
                  { label: "Assigned Department", value: selectedStudent.student.department },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-card rounded-xl border border-gray-100 dark:border-border shadow-sm">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter mb-1">{item.label}</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-relaxed capitalize">{item.value || "N/A"}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupervisorStudents;
