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

  const handleAssignClick = (student) => {
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
    <div className="relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header
          title="Supervisor Allocation"
          subtitle="Assign or reassign students to supervisors"
        />

        {/* Manage Assignments Section */}
        {
          <div className="relative bg-white rounded-lg shadow-md border border-gray-300 mb-8">
            <div className="py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2  px-6">
                Manage Assignments
              </h2>
              <p className="text-gray-600 mb-6 px-6">
                View and modify student-supervisor pairings
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 px-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Student....."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
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
                      setSelectedFilter(options?.value || "All Students")
                    }
                  />
                </div>
              </div>

              {/* Students Table */}
              <div className="relative overflow-x-auto min-h-110">
                {!students && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <Loader2 className="animate-spin text-blue-600" size={60} />
                  </div>
                )}
                {students?.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75">
                    <AiOutlineFileSearch
                      className="text-gray-400 mx-auto"
                      size={70}
                    />

                    <p className="text-gray-500">No students found.</p>
                  </div>
                )}

                {students?.length > 0 && (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium bg-blue-50 text-gray-700">
                          Student Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium bg-blue-50 text-gray-700">
                          Student ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium bg-blue-50 text-gray-700">
                          Programme
                        </th>
                        <th className="text-left py-3 px-4 font-medium bg-blue-50 text-gray-700">
                          Current Supervisor
                        </th>
                        <th className="text-left py-3 px-4 font-medium bg-blue-50 text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredStudents()?.map((student) => (
                        <tr
                          key={student.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-800 hover:text-gray-600 cursor-pointer">
                            {student.name}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {student.student_id}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {student.programme}
                          </td>
                          <td className="py-3 px-4">
                            {student.supervisors.length > 0 &&
                            student.supervisors ? (
                              <span className="text-gray-700">
                                {student.supervisors
                                  .map((sup) => sup.name)
                                  .join(", ")}
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <OutlineButton
                              title={
                                student.supervisors.length > 0
                                  ? "Reassign"
                                  : "Assign"
                              }
                              onClick={() => handleAssignClick(student)}
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
        }

        {/* Available Supervisors Section */}
        {
          <div className="bg-white relative rounded-lg shadow-md border border-gray-300">
            <div className="py-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 px-6">
                Supervisors
              </h2>
              <p className="text-gray-600 mb-6 px-6">
                View current supervision load and capacity
              </p>

              <div className="relative flex-1 mb-4 px-6">
                <Search className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Supervisor..."
                  value={supervisorSearch}
                  onChange={(e) => setSupervisorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Supervisors Table */}
              <div className="relative overflow-x-auto min-h-120">
                {!supervisors && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                    <Loader2 className="animate-spin text-blue-600" size={60} />
                  </div>
                )}

                {supervisors?.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75">
                    <AiOutlineFileSearch
                      className="text-gray-400 mx-auto"
                      size={70}
                    />

                    <p className="text-gray-500">No supervisors found.</p>
                  </div>
                )}

                {supervisors && (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-4 font-medium bg-blue-50 text-gray-700">
                          Name
                        </th>
                        {/* <th className="text-left py-4 px-4 font-medium bg-blue-50 text-gray-700">
                      Email
                    </th> */}
                        <th className="text-left py-4 px-4 font-medium bg-blue-50 text-gray-700">
                          Research Area
                        </th>
                        <th className="text-left py-4 px-4 font-medium bg-blue-50 text-gray-700">
                          Current Load
                        </th>
                        <th className="text-left py-4 px-4 font-medium bg-blue-50 text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredSupervisors()?.map((supervisor) => (
                        <tr
                          key={supervisor.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 text-gray-900 font-medium">
                            {supervisor.name} -{" "}
                            <span className="text-gray-500 font-normal">
                              ({supervisor.staff_id})
                            </span>
                          </td>
                          {/* <td className="py-4 px-4 text-blue-600 hover:text-blue-800 cursor-pointer">
                        {supervisor.user.email}
                      </td> */}
                          <td className="py-4 px-4 text-gray-700">
                            {supervisor.research_area
                              .map((area) => area.name)
                              .join(", ")}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                                <div
                                  className={`h-2 rounded-full ${getLoadColor(
                                    supervisor.current_load == null
                                      ? 0
                                      : supervisor.current_load,
                                    MAXLOAD
                                  )}`}
                                  style={{
                                    width: `${Math.min(
                                      getLoadPercentage(
                                        supervisor.current_load == null
                                          ? 0
                                          : supervisor.current_load,
                                        MAXLOAD
                                      ),
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {supervisor.current_load == null
                                  ? 0
                                  : supervisor.current_load}
                                /{MAXLOAD}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                supervisor.status === "Available"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
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
        }
      </div>
      {isModalOpen && (
        <Modal
          headTitle="Assign Supervisor"
          subHeadTitle={`Assign supervisor(s) to ${selectedStudent?.name} (${selectedStudent?.student_id})`}
          handleCancel={handleCancel}
          handleConfirm={() => {}}
          buttonDisabled={false}
          w="max-w-lg"
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
