import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AppInput from "../shared/input/AppInput";
import SolidButton from "../shared/buttons/SolidButton";
import OutlineButton from "../shared/buttons/OutlineButton";
import { Edit } from "lucide-react";
import { FaUserTie, FaUserGraduate } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type EditSupervisorProps = {
  selectedSupervisor: {
    name: string;
    staff_id: string;
    gender: string;
    contact: string;
    user: {
      email: string;
    };
    id: string;
    research_area?: Array<{
      id: string;
      name: string;
    }>;
  };
  onSave?: (supervisorData: any) => void;
  onCancel?: () => void;
};

interface SupervisorStudent {
  id: string;

  student: {
    id: string;
    name: string;
    student_id: string;
    user: {
      email: string;
    };
    programme: string;
    level: string;
  };
}

// Validation schema for supervisor data
const validationSchema = Yup.object({
  name: Yup.string(),
  email: Yup.string().email("Invalid email format"),
  staff_id: Yup.string(),
  research_area: Yup.string(),
  gender: Yup.string(),
  contact: Yup.string(),
});

const EditSupervisor = ({
  selectedSupervisor,
  onSave,
}: EditSupervisorProps) => {
  const [edit, setEdit] = useState(false);
  const axios = useAxiosPrivate();

  const { data: supervisorStudents } = useQuery({
    queryKey: ["supervisor-students"],
    queryFn: async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data }: any = await axios.get(
          `/supervisors/supervisor/students/${selectedSupervisor.id}/`,
        );
        return data.data as SupervisorStudent[];
      } catch (error) {
        console.error("Error fetching supervisor's students:", error);
        throw new Error("Error fetching supervisor's students");
      }
    },
    enabled: !!selectedSupervisor,
  });

  const formik = useFormik({
    initialValues: {
      name: selectedSupervisor?.name || "",
      email: selectedSupervisor?.user.email || "",
      staff_id: selectedSupervisor?.staff_id || "",
      research_area: selectedSupervisor?.research_area || "",
      gender: selectedSupervisor?.gender || "",
      contact: selectedSupervisor?.contact || "",
    },
    validationSchema,
    onSubmit: (values) => {
      onSave?.(values);
    },
  });

  // Options for select fields
  // const genderOptions = [
  //   { value: "male", label: "Male" },
  //   { value: "female", label: "Female" },
  // ];

  return (
    <div className="p-6 bg-white dark:bg-card rounded-lg shadow-lg max-w-4xl mx-auto border dark:border-border/50">
      <button
        onClick={() => {
          setEdit(true);
        }}
        className="absolute top-9 right-20 mr-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold p-1 rounded cursor-pointer"
      >
        <Edit size={20} />
      </button>
      <div>
        <div className={edit ? "hidden" : "block"}>
          {/* Supervisor Profile */}
          <div className="w-full h-full flex flex-col lg:flex-row gap-6">
            {/* Left Section - Profile Card */}
            <div className="bg-gray-100 dark:bg-card rounded-lg p-6 lg:w-1/2 border dark:border-border/50 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-4">
                  <FaUserTie className="w-16 h-16 text-blue-900 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900 dark:text-white">
                  {selectedSupervisor.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mt-1">
                  {selectedSupervisor.staff_id}
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
                    {selectedSupervisor.user.email}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Gender:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm capitalize font-medium">
                    {selectedSupervisor.gender}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase">
                    Contact:
                  </span>
                  <span className="col-span-2 text-gray-800 dark:text-gray-200 text-sm font-medium">
                    {selectedSupervisor.contact}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Research Areas & Students */}
            <div className="lg:w-1/2 space-y-6">
              {/* Research Areas Section */}
              <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border/50 p-6 shadow-sm">
                <div className="border-b border-gray-300 dark:border-border pb-3 mb-4">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-white">
                    Research Areas
                  </h3>
                </div>

                {selectedSupervisor.research_area &&
                selectedSupervisor.research_area.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSupervisor.research_area.map((area) => (
                      <span
                        key={area.id}
                        className="bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800"
                      >
                        {area.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-500 text-xs text-center py-4 italic font-medium">
                    No research areas specified
                  </p>
                )}
              </div>

              {/* Assigned Students Section */}
              <div className="bg-white dark:bg-card rounded-lg border border-gray-200 dark:border-border/50 p-6 shadow-sm">
                <div className="border-b border-gray-300 dark:border-border pb-3 mb-4">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-white">
                    Assigned Students
                    {supervisorStudents && (
                      <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        ({supervisorStudents.length})
                      </span>
                    )}
                  </h3>
                </div>

                {supervisorStudents && supervisorStudents?.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                    {supervisorStudents?.map(({ student }) => (
                      <div
                        key={student.id}
                        className="bg-gray-50 dark:bg-secondary/5 rounded-lg p-4 border border-gray-200 dark:border-border hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <FaUserGraduate className="w-10 h-10 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-0.5">
                                {student.name}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                ID: {student.student_id}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded">
                                  {student.programme}
                                </span>
                                <span className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded">
                                  Level {student.level}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-gray-50 dark:bg-secondary/5 rounded-full p-6 mb-4 border border-gray-100 dark:border-border">
                      <FaUserGraduate className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      No students assigned yet
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      Students will appear here once assigned
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={edit ? "block" : "hidden"}>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1  gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-900 dark:text-white border-b border-gray-300 dark:border-border pb-1">
                  Personal Information
                </h3>

                <AppInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter supervisor's full name"
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
                  label="Staff ID"
                  name="staff_id"
                  placeholder="Enter staff ID"
                  type="text"
                  formik={formik}
                />

                {/* <CustomSelect
                            label="Gender"
                            options={genderOptions}
                            value={formik.values.gender}
                            onChange={option => formik.setFieldValue('gender', option ? option.value : '')} 
                        /> */}
                {/* 
                        <AppInput
                            label="Contact Number"
                            name="contact"
                            placeholder="Enter contact number"
                            type="tel"
                            formik={formik}
                        /> */}
              </div>

              {/* Academic Information */}
              {/* <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">Academic Information</h3>
                        
                        <CustomSelect
                            label="Research Area"
                            options={researchAreaOptions}
                            value={formik.values.research_area}
                            onChange={option => formik.setFieldValue('research_area', option ? option.value : '')}
                        />
                    </div> */}
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

export default EditSupervisor;
