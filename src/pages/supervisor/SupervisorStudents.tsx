import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import type { Student } from "../../utils/types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  User,
  BookOpen,
  GraduationCap,
  Mail,
  FileText,
  ArrowRight,
} from "lucide-react";
import Loading from "../../components/shared/loader/Loading";
import SolidButton from "../../components/shared/buttons/SolidButton";
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
        console.log("Total students fetched:", data.data);
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
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <User size={48} className="text-gray-400 mb-3" />
        <p className="text-gray-600 text-lg font-semibold">
          No students assigned
        </p>
        <p className="text-gray-500 text-sm">
          You currently have no students assigned to you.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Your Student"
        subtitle={`You are supervising ${students.length} student${students.length !== 1 ? "s" : ""}.`}
        Icon={GraduationCap}
      />
      <div className="max-w-7xl mx-auto">
        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="py-4 text-slate-700 px-3">
                <div className="flex items-start justify-between px-3 mb-2">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">
                      {student.student.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {student.student.student_id}
                    </p>
                  </div>
                  <div className="bg-blue-950 p-1.5 rounded-lg">
                    <User size={20} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-4 space-y-4">
                {/* Student Level */}
                <div className="flex items-start gap-3">
                  <GraduationCap
                    size={18}
                    className="text-ug-blue mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Level
                    </p>
                    <p className="text-gray-800 font-medium">
                      {student.student.level || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Programme */}
                {student.student.programme && (
                  <div className="flex items-start gap-3">
                    <FileText
                      size={18}
                      className="text-ug-blue mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        Programme
                      </p>
                      <p className="text-gray-800 font-medium">
                        {student.student.programme}
                      </p>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="text-ug-blue mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Email
                    </p>
                    <p
                      className="text-gray-800 font-medium text-sm truncate"
                      title={student.student.user.email}
                    >
                      {student.student.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleViewDetails(student)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-ug-blue text-white text-sm font-medium rounded hover:bg-blue-900 transition-colors duration-200"
                >
                  <FileText size={16} />
                  View Details
                </button>
                <button
                  onClick={() => handleViewDetails(student)}
                  className="inline-flex items-center justify-center p-2 text-ug-blue border border-ug-blue rounded hover:bg-blue-50 transition-colors duration-200"
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
          headTitle={`${selectedStudent.student.name} - Student Details`}
          subHeadTitle=""
          buttonDisabled={false}
          handleConfirm={() => setDisplayModal(false)}
          handleCancel={() => {
            setDisplayModal(false);
            setSelectedStudent(null);
          }}
          w="max-w-5xl"
        >
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-ug-blue mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Full Name
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Student ID
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.student_id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Gender
                  </p>
                  <p className="text-gray-800 font-medium capitalize">
                    {selectedStudent.student.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-gray-800 font-medium break-all">
                    {selectedStudent.student.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg ">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} />
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Level
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.level}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Programme
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.programme}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Programme Level
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.programme_level?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    Department
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Thesis & Research Section */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg ">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Supervision Status
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedStudent.lead
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedStudent.lead
                        ? "Lead Supervisor"
                        : "Co-Supervisor"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Organization Section */}
            <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg 0">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Organization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    College
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.college?.replace(/-/g, " ") ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                    School
                  </p>
                  <p className="text-gray-800 font-medium">
                    {selectedStudent.student.school?.replace(/-/g, " ") ||
                      "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupervisorStudents;
