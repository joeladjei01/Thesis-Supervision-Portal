import React, { useState, useMemo, useEffect, useRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { formatDate } from "../../utils/helpers";
import { Search, Loader2 } from "lucide-react";
import OutlineButton from "../shared/buttons/OutlineButton";
import Modal from "../../layouts/Modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface Student {
  id: string;
  name: string;
  studentId: string;
  supervisor: {
    name: string;
    id: string;
  };
  progress: number;
  programme_level?: any;
  stud: any;
}

interface StudentProgressProps {
  students: any[];
  supervisors: any[];
}

const StudentProgress: React.FC<StudentProgressProps> = ({
  students,
  supervisors,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Students");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentOnView, setStudentOnView] = useState<Student | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const axios = useAxiosPrivate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const allStudents: Student[] = students?.map((student: any) => ({
    id: student.id,
    name: student.name,
    studentId: student.student_id,
    supervisor:
      student?.supervisors?.find((sup: any) => sup.lead === true) || null,
    progress: 50,
    stud: student,
    programme_level: student.programme_level,
  }));

  const {
    data: studentDetails,
    mutateAsync,
    isPending: loadingDetails,
  } = useMutation({
    mutationFn: async (studentId: string) => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/student/${studentId}/`,
        );
        return data.data as any[];
      } catch (error) {
        console.error("Error fetching student details:", error);
        throw error;
      }
    },
  });

  const { data: totalChapters } = useQuery({
    queryKey: ["student-chapters", studentOnView?.id],
    queryFn: async () => {
      if (!studentOnView?.supervisor?.id || !studentOnView?.programme_level?.id) return [];
      try {
        const { data }: any = await axios.get(
          `/supervisors/supervisor-chapter/by-programme-level/${studentOnView.supervisor.id}/${studentOnView.programme_level.id}/`,
        );
        return data.data || ([] as any[]);
      } catch (error) {
        console.error("Error fetching total chapters:", error);
        throw error;
      }
    },
    enabled: studentOnView !== null && studentOnView.supervisor !== null,
  });

  const { data: studentFeedbacks } = useQuery({
    queryKey: ["student-feedbacks", studentOnView?.id],
    queryFn: async () => {
      if (!studentOnView?.id) return [];
      try {
        const { data }: any = await axios.get(
          `/students/chapter/student/${studentOnView.id}/feedbacks/`,
        );
        return data.data || ([] as any[]);
      } catch (error) {
        console.error("Error fetching student feedbacks:", error);
        throw error;
      }
    },
    enabled: studentOnView !== null,
  });

  const filterOptions = [
    "All Students",
    ...(supervisors?.map((sup: any) => sup?.name) || []),
  ];

  const filteredStudents = useMemo(() => {
    return allStudents.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.includes(searchTerm);
      const matchesFilter =
        selectedFilter === "All Students" ||
        student.supervisor?.name === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, selectedFilter, allStudents]);

  const approvedSubmissions = useMemo(() => {
    if (!studentDetails?.length) return [] as any[];

    const feedbackByChapter = new Map<string, any>();
    studentFeedbacks?.forEach((feedback: any) => {
      const chapterId = feedback?.chapter?.chapter_assignment?.id;
      if (!chapterId) return;
      const existing = feedbackByChapter.get(chapterId);
      if (
        !existing ||
        new Date(feedback.created_at) > new Date(existing.created_at)
      ) {
        feedbackByChapter.set(chapterId, feedback);
      }
    });

    return studentDetails
      .filter((submission: any) => {
        const feedback = feedbackByChapter.get(
          submission?.chapter_assignment?.id,
        );
        const isApprovedByFeedback = feedback?.decision === "approved";
        return submission?.approved === true || isApprovedByFeedback;
      })
      .map((submission: any) => ({
        submission,
        feedback: feedbackByChapter.get(submission?.chapter_assignment?.id),
      }));
  }, [studentDetails, studentFeedbacks]);

  const getProgress = () => {
    const total = totalChapters?.length || 0;
    const approvedCount = approvedSubmissions.length;
    const per = total > 0 ? (approvedCount / total) * 100 : 0;
    return { progress: Math.round(per), total: `${Math.round(per)}%` };
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 70) return "bg-emerald-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-6 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
            <input
              type="text"
              placeholder="Search Student by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-secondary/5 border border-gray-200 dark:border-border rounded-xl text-sm dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between min-w-[240px] px-4 py-3 bg-white dark:bg-secondary/5 border border-gray-200 dark:border-border rounded-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all outline-none"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedFilter === "All Students" ? "All Supervisors" : selectedFilter}
              </span>
              <MdKeyboardArrowDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto animate-fadeIn overflow-hidden">
                <div className="py-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedFilter(option);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedFilter === option
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-secondary/10"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-secondary/10 border-b border-gray-200 dark:border-border">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supervisor
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-border">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400 italic">
                        {student.studentId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.supervisor ? (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {student.supervisor.name}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <OutlineButton
                        onClick={() => {
                          setIsModalOpen(true);
                          setStudentOnView(student);
                          mutateAsync(student.stud.id);
                        }}
                        className="px-4 py-1.5 text-xs font-bold"
                        title={"View Details"}
                        disabled={student.supervisor === null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-20 px-4">
              <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No students found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Details Modal */}
      {isModalOpen && (
        <Modal
          buttonDisabled={false}
          handleCancel={() => {
            setIsModalOpen(false);
            setStudentOnView(null);
          }}
          handleConfirm={() => { }}
          headTitle="Student Progress Details"
          subHeadTitle={`${studentOnView?.name} (${studentOnView?.studentId})`}
          w="max-w-5xl"
        >
          <div className="min-h-[600px] py-2">
            {loadingDetails && (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium italic">Loading student progress data...</p>
              </div>
            )}
            {!loadingDetails && studentDetails && (
              <div className="animate-fadeIn">
                <div className="mb-8 p-6 bg-gray-50 dark:bg-secondary/5 rounded-2xl border border-gray-100 dark:border-border transition-all">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Proposed Thesis Topic</h2>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white leading-tight">
                    {studentDetails[0]?.chapter_assignment.topic.title || "No Topic Specified"}
                  </p>
                </div>

                <div className="mb-10 px-2 flex flex-col items-center">
                  <div className="w-full flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-tighter">Overall Completion</span>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      <span className="text-lg">{approvedSubmissions.length}</span> / {totalChapters?.length || 0} Chapters Approved
                    </p>
                  </div>
                  <div className="w-full h-12 rounded-full bg-gray-200 dark:bg-secondary/10 overflow-hidden relative shadow-inner p-1.5 border border-gray-100 dark:border-border">
                    <div
                      className={`h-full rounded-full flex items-center justify-center transition-all duration-1000 ease-out shadow-lg ${getProgressColor(
                        getProgress().progress,
                      )}`}
                      style={{
                        width: getProgress().total,
                      }}
                    >
                      {getProgress().progress > 5 && (
                        <span className="text-white text-lg font-black tracking-widest drop-shadow-md">
                          {getProgress().total}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {approvedSubmissions.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50/50 dark:bg-secondary/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-border">
                       <p className="text-gray-500 dark:text-gray-400 font-bold italic">No approved chapters found yet.</p>
                    </div>
                  )}
                  {approvedSubmissions.map(({ submission, feedback }: any) => {
                    const rawScore = Number(feedback?.score);
                    const hasScore = Number.isFinite(rawScore);
                    const score = hasScore
                      ? Math.min(100, Math.max(0, rawScore))
                      : 0;

                    return (
                      <div
                        key={submission.id}
                        className="group bg-white dark:bg-secondary/5 border border-gray-200 dark:border-border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="flex-1">
                            <div className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-tighter mb-2">
                              Chapter {submission.title}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {submission.chapter_assignment.chapter.custom_description}
                            </h3>
                            
                            <div className="space-y-2 mt-4">
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-gray-400 dark:text-gray-500 uppercase tracking-widest w-24">Assigned:</span>
                                <span className="text-gray-700 dark:text-gray-300 font-bold">
                                  {formatDate(submission.chapter_assignment.due_date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="text-gray-400 dark:text-gray-500 uppercase tracking-widest w-24">Submitted:</span>
                                <span className="text-gray-700 dark:text-gray-300 font-bold">
                                  {formatDate(submission.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="relative w-24 h-24 drop-shadow-md">
                              <svg
                                viewBox="0 0 120 120"
                                className="w-full h-full transform -rotate-90"
                              >
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="54"
                                  fill="none"
                                  stroke="currentColor"
                                  className="text-gray-100 dark:text-gray-800"
                                  strokeWidth="12"
                                />
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="54"
                                  fill="none"
                                  stroke="currentColor"
                                  className="text-emerald-500 transition-all duration-1000 ease-in-out"
                                  strokeWidth="12"
                                  strokeLinecap="round"
                                  strokeDasharray={`${(score / 100) * 339.292} 339.292`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-black text-gray-800 dark:text-white italic">
                                  {hasScore ? `${score}%` : "N/A"}
                                </span>
                                <span className="text-[8px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-tighter">Score</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentProgress;
