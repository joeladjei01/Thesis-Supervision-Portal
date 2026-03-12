import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AppInput from "../shared/input/AppInput";
import CustomSelect from "../shared/custom-select";
import SolidButton from "../shared/buttons/SolidButton";
import OutlineButton from "../shared/buttons/OutlineButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { ArrowLeft, Edit } from "lucide-react";
import { FaUserMd } from "react-icons/fa";

type EditStudentProps = {
  selectedStudent: {
    name: string;
    student_id: string;
    programme: string;
    level: string;
    gender: string;
    contact: string;
    user: {
      email: string;
    };
    id: string;
    supervisors?: Array<{
      id: string;
      name: string;
      email: string;
      specialization?: string;
    }> | null;
  };
  onSave?: (studentData: any) => void;
  onCancel?: () => void;
};

// Validation schema for student data
const validationSchema = Yup.object({
  name: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  student_id: Yup.string(),
  programme: Yup.string(),
  gender: Yup.string(),
  level: Yup.string(),
  contact: Yup.string(),
});

const EditStudent = ({
  selectedStudent,
  onSave,
  onCancel,
}: EditStudentProps) => {
  const axios = useAxiosPrivate();
  const [edit, setEdit] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: selectedStudent?.name || "",
      email: selectedStudent?.user.email || "",
      student_id: selectedStudent?.student_id || "",
      programme: selectedStudent?.programme || "",
      gender: selectedStudent?.gender || "",
      level: selectedStudent?.level || "",
      contact: selectedStudent?.contact || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `/accounts/update/${selectedStudent.id}/`,
          values,
        );
        if (response.status === 200) {
          onSave?.(response.data);
        }
        toast.success("Student information updated successfully");
      } catch (error) {
        console.error("Error saving student data:", error);
        toast.error("Failed to update student information");
      }
    },
  });

  // Options for select fields
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const levelOptions = [
    { value: "600", label: "600" },
    { value: "700", label: "700" },
  ];

  return (
    <div className="min-h-120 max-w-4xl mx-auto">
      <button
        onClick={() => {
          setEdit(true);
        }}
        className="absolute top-9 right-20 mr-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold p-1 rounded cursor-pointer"
      >
        <Edit size={20} />
      </button>

      <div>
        {/* Profile Display */}
        <div className={edit ? "hidden" : "h-full"}>
          <div className="w-full h-full flex flex-col md:flex-row gap-6">
            {/* Left Section - Profile Card */}
            <div className="bg-gray-100 dark:bg-card rounded-lg p-6 md:w-1/2 border dark:border-border/50 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <FaUserMd className="w-16 h-16 text-blue-900 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white">
                  {selectedStudent.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">
                  {selectedStudent.student_id}
                </p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="border-b border-gray-300 dark:border-border pb-2">
                  <h3 className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Email:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm break-all font-medium">
                    {selectedStudent.user.email}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Gender:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm capitalize font-medium">
                    {selectedStudent.gender}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Contact:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
                    {selectedStudent.contact}
                  </span>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4 mt-8">
                <div className="border-b border-gray-300 dark:border-border pb-2">
                  <h3 className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">
                    Academic Information
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Programme:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
                    {selectedStudent.programme}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Level:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
                    {selectedStudent.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Supervisors List */}
            <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border/50 p-6 md:w-1/2 shadow-sm">
              <div className="border-b border-gray-300 dark:border-border pb-3 mb-4">
                <h3 className="text-lg font-bold text-blue-900 dark:text-white">
                  Assigned Supervisors
                </h3>
              </div>

              {selectedStudent.supervisors &&
              selectedStudent.supervisors.length > 0 ? (
                <div className="space-y-4">
                  {selectedStudent.supervisors.map((supervisor, index) => (
                    <div
                      key={supervisor.id}
                      className="bg-gray-50 dark:bg-secondary/5 rounded-lg p-4 border border-gray-200 dark:border-border hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-900 dark:bg-primary text-white text-[10px] uppercase tracking-tighter font-bold px-2 py-0.5 rounded">
                              {index === 0 ? "Lead" : "Co-supervisor"}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-0.5">
                            {supervisor.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {supervisor.email}
                          </p>
                          {supervisor.specialization && (
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 italic mt-2 font-medium">
                              Specialization: {supervisor.specialization}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-50 dark:bg-secondary/5 rounded-full p-6 mb-4 border border-gray-100 dark:border-border">
                    <FaUserMd className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    No supervisors assigned yet
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                    Supervisors will appear here once assigned
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={edit ? "" : "hidden"}>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-900 dark:text-white border-b border-gray-300 dark:border-border pb-1">
                  Personal Information
                </h3>

                <AppInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter student's full name"
                  type="text"
                  formik={formik}
                />

                <AppInput
                  label="Email Address"
                  name="email"
                  placeholder="Enter email address"
                  type="email"
                  formik={formik}
                />

                <AppInput
                  label="Student ID"
                  name="student_id"
                  placeholder="Enter student ID"
                  type="text"
                  formik={formik}
                />

                <CustomSelect
                  label="Gender"
                  value={formik.values.gender}
                  placeholder="Select Gender"
                  onChange={(value) =>
                    formik.setFieldValue("gender", value)
                  }
                  options={genderOptions || []}
                />

                <AppInput
                  label="Contact Number"
                  name="contact"
                  placeholder="Enter contact number"
                  type="tel"
                  formik={formik}
                />
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-900 dark:text-white border-b border-gray-300 dark:border-border pb-1">
                  Academic Information
                </h3>

                {/* <CustomSelect
                            label="College"
                            value={formik.values.college}
                            onChange={option => formik.setFieldValue('college', option ? option.value : '')}
                            options={collegeOptions}
                        />

                        <CustomSelect
                            label="School"
                            options={schoolOptions}
                            value={formik.values.school}
                            onChange={option => formik.setFieldValue('school', option ? option.value : '')}
                        />

                        <CustomSelect
                            label="Department"
                            options={departmentOptions}
                            value={formik.values.department}
                            onChange={(value) => formik.setFieldValue('department', value)}
                        /> */}

                <AppInput
                  label="Programme"
                  name="programme"
                  placeholder="Enter programme name"
                  type="text"
                  formik={formik}
                />

                <CustomSelect
                  label="Level"
                  options={levelOptions || []}
                  value={formik.values.level}
                  placeholder="Select Level"
                  onChange={(value) =>
                    formik.setFieldValue("level", value)
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-300 dark:border-border">
              <OutlineButton
                title="Cancel"
                type="button"
                onClick={() => setEdit(false)}
                className="min-w-[120px]"
              />
              <SolidButton
                title="Save Changes"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
                className="min-w-[120px]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
