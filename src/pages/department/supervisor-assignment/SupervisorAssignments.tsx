/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import Modal from "../../../layouts/Modal";
import AssignSupervisorModal from "./AssignModal";
import { useQueryClient } from "@tanstack/react-query";
import type { Student } from "../../../utils/types";
import usePageTile from "../../../hooks/usePageTitle";
import CustomSelect from "../../../components/shared/custom-select";
import OutlineButton from "../../../components/shared/buttons/OutlineButton";
import Header from "../../../components/shared/text/Header";
import { useDepartmentDataStore } from "../../../store/useDepartmentDataStore";
import { AiOutlineFileSearch } from "react-icons/ai";

const MAXLOAD = 10;
const SupervisorAssignments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [supervisorSearch, setSupervisorSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Students");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  usePageTile("Department - Assignment");
  const queryClient = useQueryClient();
  const { students, supervisors } = useDepartmentDataStore();

  const getLoadPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const availableSupervisors = supervisors?.filter(
    (s) => s.status === "Available"
  );

  const getFilteredStudents = () => {
    let filteredStudents = students || [];

    // Apply the selected filter
    if (selectedFilter === "Assigned Students") {
      filteredStudents = filteredStudents.filter(
        (student) => student.supervisors.length > 0
      );
    } else if (selectedFilter === "Unassigned Students") {
      filteredStudents = filteredStudents.filter(
        (student) => student.supervisors.length === 0
      );
    }

    // Apply the search filter
    if (searchQuery.trim()) {
      filteredStudents = filteredStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.student_id
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (student.thesis_topic &&
            student.thesis_topic
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    return filteredStudents;
  };

  const getFilteredSupervisors = () => {
    let filteredSupervisors = supervisors || [];
    if (supervisorSearch.trim()) {
      filteredSupervisors = filteredSupervisors.filter(
        (supervisor) =>
          supervisor.name
            .toLowerCase()
            .includes(supervisorSearch.toLowerCase()) ||
          supervisor.staff_id
            .toLowerCase()
            .includes(supervisorSearch.toLowerCase())
        // supervisor.research_area.
      );
    }
    return filteredSupervisors;
  };

  const handleCancel = () => {
    setNotes("");
    onClose();
  };

  const onClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setNotes("");
      setSelectedStudent(null);
    }, 300);
    queryClient.invalidateQueries({
      queryKey: ["students"],
    });
    queryClient.invalidateQueries({
      queryKey: ["supervisors"],
    });
  };

  const getLoadColor = (current: number, max: number) => {
    const percentage = getLoadPercentage(current, max);
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-orange-500";
    return "bg-green-500";
  };

  const handleAssignClick = (student: Student) => {
    setSelectedStudent(student);
    console.log(student.supervisors);
    setIsModalOpen(true);
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["students"],
    });
    queryClient.invalidateQueries({
      queryKey: ["supervisors"],
    });
  }, [queryClient]);

  return (
    <div className="relative min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Supervisor Allocation"
          subtitle="Assign or reassign students to supervisors"
        />

        {/* Manage Assignments Section */}
        <div className="relative bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border mb-8 overflow-hidden transition-all duration-300">
          <div className="py-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 px-6">
              Manage Assignments
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 px-6 text-sm">
              View and modify student-supervisor pairings
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 px-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-4 h-4 transition-colors" />
                <input
                  type="text"
                  placeholder="Search student by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-lg text-sm text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="relative w-full md:w-64">
                <CustomSelect
                  options={[
                    { value: "All Students", label: "All Students" },
                    {
                      value: "Assigned Students",
                      label: "Assigned Students",
                    },
                    {
                      value: "Unassigned Students",
                      label: "Unassigned Students",
                    },
                  ]}
                  value={selectedFilter}
                  onChange={(options) =>
                    setSelectedFilter(options || "All Students")
                  }
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="relative overflow-x-auto min-h-[400px]">
              {!students && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-card/50 backdrop-blur-sm z-10">
                  <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
              )}
              {students?.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center py-20">
                  <AiOutlineFileSearch
                    className="text-gray-300 dark:text-gray-700 mb-4"
                    size={64}
                  />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No students found.</p>
                </div>
              )}

              {getFilteredStudents()?.length >= 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-gray-200 dark:border-border">
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Student Name
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Student ID
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Programme
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Current Supervisor
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-border">
                    {getFilteredStudents()?.map((student) => (
                      <tr
                        key={student.id}
                        className="group hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-900 dark:text-gray-200 font-medium">
                          {student.name}
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                          {student.student_id}
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                          {student.programme}
                        </td>
                        <td className="py-4 px-6">
                          {student.supervisors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {student.supervisors.map((sup: any, idx: number) => (
                                <span 
                                  key={idx}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                >
                                  {sup.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <OutlineButton
                            title={
                              student.supervisors.length > 0
                                ? "Reassign"
                                : "Assign"
                            }
                            onClick={() => handleAssignClick(student)}
                            className="text-xs py-1.5"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Available Supervisors Section */}
        <div className="bg-white dark:bg-card relative rounded-xl shadow-lg border border-gray-200 dark:border-border overflow-hidden transition-all duration-300">
          <div className="py-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 px-6">
              Supervisors
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 px-6 text-sm">
              View current supervision load and capacity
            </p>

            <div className="relative flex-1 mb-6 px-6 group">
              <Search className="absolute left-9 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 w-4 h-4 transition-colors" />
              <input
                type="text"
                placeholder="Search supervisor by name or staff ID..."
                value={supervisorSearch}
                onChange={(e) => setSupervisorSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-lg text-sm text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Supervisors Table */}
            <div className="relative overflow-x-auto min-h-[400px]">
              {!supervisors && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-card/50 backdrop-blur-sm z-10">
                  <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
              )}

              {supervisors?.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center py-20">
                  <AiOutlineFileSearch
                    className="text-gray-300 dark:text-gray-700 mb-4"
                    size={64}
                  />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No supervisors found.</p>
                </div>
              )}

              {getFilteredSupervisors()?.length >= 0 && (
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-gray-200 dark:border-border">
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Name
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Research Area
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Current Load
                      </th>
                      <th className="text-left py-4 px-6 font-bold bg-gray-50 dark:bg-secondary/10 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-border">
                    {getFilteredSupervisors()?.map((supervisor) => (
                      <tr
                        key={supervisor.id}
                        className="group hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors"
                      >
                        <td className="py-4 px-6 text-gray-900 dark:text-gray-200">
                          <div className="flex flex-col">
                            <span className="font-bold">{supervisor.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 font-mono italic">
                              {supervisor.staff_id}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {supervisor.research_area.map((area, idx) => (
                              <span 
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px]"
                              >
                                {area.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${getLoadColor(
                                  supervisor.current_load ?? 0,
                                  MAXLOAD
                                )}`}
                                style={{
                                  width: `${Math.min(
                                    getLoadPercentage(
                                      supervisor.current_load ?? 0,
                                      MAXLOAD
                                    ),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8">
                              {supervisor.current_load ?? 0}/{MAXLOAD}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              supervisor.status === "Available"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              supervisor.status === "Available" ? "bg-green-500" : "bg-red-500"
                            }`} />
                            {supervisor.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          headTitle="Assign Supervisor"
          subHeadTitle={`Assign supervisor(s) to ${selectedStudent?.name} (${selectedStudent?.student_id})`}
          handleCancel={handleCancel}
          handleConfirm={() => {}}
          buttonDisabled={false}
          w="max-w-5xl"
        >
          <AssignSupervisorModal
            student={selectedStudent}
            supervisors={availableSupervisors ?? []}
            notes={notes}
            onClose={onClose}
            setNotes={setNotes}
            selectedStudent={selectedStudent}
          />
        </Modal>
      )}
    </div>
  );
};

export default SupervisorAssignments;
