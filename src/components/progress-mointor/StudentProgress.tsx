import React, { useState, useMemo, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { formatDate, inputStyles } from "../../utils/helpers";
import { Search } from "lucide-react";
import OutlineButton from "../shared/buttons/OutlineButton";
import Modal from "../../layouts/Modal";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Loading from "../shared/loader/Loading";

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
  const axios = useAxiosPrivate();

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
    queryKey: ["student-chapters"],
    queryFn: async () => {
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
    enabled: studentOnView !== null,
  });

  const { data: studentFeedbacks } = useQuery({
    queryKey: ["student-feedbacks", studentOnView?.id],
    queryFn: async () => {
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
    ...supervisors?.map((sup: any) => sup?.name),
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
  }, [searchTerm, selectedFilter]);

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
    if (progress >= 70) return "bg-green-500";
    if (progress >= 40) return "bg-green-400";
    return "bg-green-300";
  };

  return (
    <div className="min-h-screen border-1 bg-white border-gray-300 rounded-lg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search Student......"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 ${inputStyles}`}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-64 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <span className="text-gray-700">{selectedFilter}</span>
              <MdKeyboardArrowDown className="h-5 w-5 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <div className="min-w-4xl ">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Student ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Supervisor
                  </th>
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Last Meeting Date
                  </th> */}
                  {/* <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th> */}
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.studentId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                        {student.supervisor === null
                          ? "N/A"
                          : student.supervisor?.name}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.lastMeetingDate}</div>
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3 max-w-24">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              student.progress
                            )}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-10">
                          {student.progress}%
                        </span>
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OutlineButton
                        onClick={() => {
                          setIsModalOpen(true);
                          setStudentOnView(student);
                          mutateAsync(student.stud.id);
                        }}
                        className="px-4 py-2 text-sm"
                        title={"Details"}
                        disabled={student.supervisor === null}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Show message if no students found */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your criteria.
          </div>
        )}
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
          headTitle="View Student Progress"
          subHeadTitle={`${studentOnView?.name} - ${studentOnView?.studentId}`}
          w="max-w-5xl"
        >
          <div className="min-h-[600px] ">
            {loadingDetails && (
              <div>
                <Loading />
              </div>
            )}
            {!loadingDetails && (
              <div>
                <div className=" flex flex-col gap-2 border-l-3 border-gray-300 pl-3">
                  <h2 className=" text-gray-500">Proposed Topic</h2>
                  <p className="flex-1 text-2xl font-bold font-kadwa text-slate-500 ">
                    {studentDetails[0]?.chapter_assignment.topic.title}
                  </p>
                </div>
                <div className="p-4 pt-0">
                  <div>
                    <p className="text-gray-700 text-right px-4">{`${approvedSubmissions.length} / ${totalChapters?.length || 0}`}</p>
                  </div>
                  <div className="w-full h-10 rounded-full bg-gray-400 ">
                    <div
                      className={`h-full rounded-full flex items-center ${getProgressColor(
                        getProgress().progress,
                      )}`}
                      style={{
                        width: getProgress().total,
                      }}
                    >
                      <span className="text-white text-xl font-bold px-7">
                        {getProgress().total}
                      </span>
                    </div>
                  </div>
                </div>
                <div></div>
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-2">
                  {approvedSubmissions.length === 0 && (
                    <div className="text-center text- gray-500 py-6">
                      No approved submissions yet.
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
                        className="mb-4 w-full rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex flex-col md:flex-col md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center text-center justify-center gap-3 mb-">
                              <h3 className="text-slate-700 text-lg font-semibold">
                                {submission.title}
                              </h3>
                            </div>
                            <p className="text-xl text-center text-slate-500">
                              {
                                submission.chapter_assignment.chapter
                                  .custom_description
                              }
                            </p>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                                <p className="uppercase tracking-wide text-[10px] text-gray-500 mb-1">
                                  Assigned on
                                </p>
                                <p className="font-medium text-gray-700">
                                  {formatDate(
                                    submission.chapter_assignment.due_date,
                                  )}
                                </p>
                              </div>
                              <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                                <p className="uppercase tracking-wide text-[10px] text-gray-500 mb-1">
                                  Submitted on
                                </p>
                                <p className="font-medium text-gray-700">
                                  {formatDate(submission.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-xs text-gray-500">
                              <p className="uppercase tracking-wide text-[10px] text-gray-400 mb-1">
                                Score
                              </p>
                            </div>
                            <div className="relative w-24 h-24">
                              <svg
                                viewBox="0 0 120 120"
                                className="w-full h-full"
                              >
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke="currentColor"
                                  className="text-gray-200"
                                  strokeWidth="10"
                                />
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke="currentColor"
                                  className="text-emerald-500"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  pathLength={100}
                                  strokeDasharray={`${score} 100`}
                                  transform="rotate(-90 60 60)"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-semibold text-slate-600">
                                  {hasScore ? `${score}%` : "N/A"}
                                </span>
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
