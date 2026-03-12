import React, { useEffect, useState } from "react";
import Modal from "../../layouts/Modal";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import CustomSelect from "../shared/custom-select";
import { colleges, schools, departments } from "../../utils/selection";
import {
  accountType,
  addDash,
  handleSelectionOnChange,
  inputStyles,
  removeDash,
  shortenText,
} from "../../utils/helpers";
import AppInput from "../shared/input/AppInput";
import Loading from "../shared/loader/Loading";
import { FaSchool, FaBookOpen, FaPhone } from "react-icons/fa";
import { AiOutlineFileSearch } from "react-icons/ai";
import {
  ArrowLeft,
  BookOpenIcon,
  DotIcon,
  Edit,
  GraduationCap,
  Loader2,
  Mail,
  Save,
  Search,
  Trash,
  XCircle,
} from "lucide-react";
import SolidButton from "../shared/buttons/SolidButton";
import useAlert from "../../hooks/useAlert";
import usePageTile from "../../hooks/usePageTitle";
import EditStudent from "./EditStudent";
import EditSupervisor from "./EditSupervisor";

const tabs = [
  { value: "students", label: "Students", Icon: GraduationCap },
  { value: "supervisors", label: "Supervisors", Icon: BookOpenIcon },
];

const EditDepartment = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("students");
  const [departmentData, setDepartmentData] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [supervisorSearchTerm, setSupervisorSearchTerm] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editStudentModal, setEditStudentModal] = useState(false);
  const axios = useAxiosPrivate();
  const alert = useAlert();

  usePageTile(
    `Details - ${departmentData ? departmentData.department.name : ""}`,
  );

  const fetchDepartmentData = async () => {
    try {
      const { data }: any = await axios.get(`/departments/retrieve/${id}/`);
      setDepartmentData(data);
      formik.setValues({
        name: data.department.name || "",
        email: data.department.head.email || "",
        contact: data.department.head.contact || "",
        school: addDash(data.department.school) || "",
        college: addDash(data.department.college) || "",
      });
      console.log(formik.values);
      return data;
    } catch (error) {
      console.error("Error fetching department data:", error);
      // toast.error("Failed to fetch department data.");
    }
  };

  const fetchStudentsData = async () => {
    try {
      const { data }: any = await axios.get(
        `/students/search/?search=${departmentData.department.name}`,
      );
      console.log("Fetched students data:", data.data);
      return data.data as any[];
    } catch (error) {
      console.error("Error fetching students data:", error);
      toast.error("Failed to fetch students data.");
    }
  };

  const fetchSupervisorsData = async () => {
    try {
      const { data }: any = await axios.get(
        `/supervisors/supervisor/search/?search=${departmentData.department.name}`,
      );
      return data.data;
    } catch (error) {
      console.error("Error fetching supervisors data:", error);
      toast.error("Failed to fetch supervisors data.");
    }
  };

  const handleDepartmentUpdate = async (updatedData, id: string) => {
    try {
      await axios.put(`/departments/update/${id}/`, {
        ...updatedData,
        role: `${import.meta.env.VITE_DEPARTMENT_ROLE}`,
      });
      toast.success("Department details updated successfully.");
    } catch (error) {
      console.error("Error updating department data:", error);
      toast.error("Failed to update department details.");
      throw error;
    }
  };

  const { data: department, isLoading: fetching } = useQuery({
    queryFn: fetchDepartmentData,
    queryKey: ["fetch-department-data", id],
  });

  const { data: students, isLoading: fetchingStudents } = useQuery({
    queryFn: fetchStudentsData,
    queryKey: ["fetch-students-data", id],
    enabled: departmentData !== null,
  });

  const { data: supervisors, isLoading: fetchingSupervisors } = useQuery({
    queryFn: fetchSupervisorsData,
    queryKey: ["fetch-supervisors-data", id],
    enabled: departmentData !== null,
  });

  //Delete account mutation
  const { mutateAsync: deleteAccount, isPending: deleting } = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/accounts/delete/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-department-data", id],
      });
      queryClient.invalidateQueries({ queryKey: ["fetch-students-data", id] });
      queryClient.invalidateQueries({
        queryKey: ["fetch-supervisors-data", id],
      });
    },
  });

  const handleUserDeletion = async (userId: string) => {
    const confirm = await alert.confirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
    );
    if (!confirm) return;
    try {
      await deleteAccount(userId);
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleDeleteDepartment = async () => {
    const confirm = await alert.confirm(
      "Are you sure you want to delete this department? This action cannot be undone.",
    );
    if (!confirm) return;

    try {
      await deleteAccount(department.department.head.id);
      toast.success("Department deleted successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleCancel = () => {
    setDisplayModal(false);
  };

  const onCancel = () => {
    setEditStudentModal(false);
    setSelectedStudent(null);
    setSelectedSupervisor(null);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      contact: "",
      school: "",
      college: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const confirm = await alert.confirm(
        "Are you sure you want to save these changes?",
      );
      if (!confirm) {
        setSubmitting(false);
        return;
      }

      try {
        await handleDepartmentUpdate(values, department.department.id);
        setDisplayModal(false);
        queryClient.invalidateQueries({
          queryKey: ["fetch-department-data", id],
        });
      } catch (error) {
        console.error("Error in form submission:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getSchoolsByCollege = () => {
    const selectedCollege = formik.values.college;
    return schools[selectedCollege] || [];
  };

  const getDepartmentsBySchool = () => {
    const selectedCollege = formik.values.college;
    const selectedSchool = formik.values.school;
    return departments[selectedCollege]?.[selectedSchool] || [];
  };

  function getNameInitials(name: string) {
    const names = name.split(" ");
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join("");
    return initials;
  }

  function filterStudents() {
    if (!studentSearchTerm) return students;
    return students.filter((student) => {
      return (
        student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        student.student_id
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase()) ||
        student.user.email
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase())
      );
    });
  }

  function filterSupervisors() {
    if (!supervisorSearchTerm) return supervisors;
    return supervisors.filter((supervisor) => {
      return (
        supervisor.name
          .toLowerCase()
          .includes(supervisorSearchTerm.toLocaleLowerCase()) ||
        supervisor.staff_id
          .toLowerCase()
          .includes(supervisorSearchTerm.toLocaleLowerCase()) ||
        supervisor.user.email
          .toLowerCase()
          .includes(supervisorSearchTerm.toLocaleLowerCase())
      );
    });
  }

  const clearFilters = () => {
    setStudentSearchTerm("");
    setSupervisorSearchTerm("");
  };

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: ["fetch-department-data", id] });
      queryClient.cancelQueries({ queryKey: ["fetch-students-data", id] });
      queryClient.cancelQueries({ queryKey: ["fetch-supervisors-data", id] });
    };
  }, []);

  if (fetching || !department) {
    return <Loading loaderSize={45} message="Loading data..." />;
  }

  return (
    <div>
      <div>
        {deleting && (
          <div className="fixed inset-0 bg-black/10  flex justify-center items-center z-50">
            <Loading message="Deleting..." />
          </div>
        )}
        <div>
          <button
            onClick={handleBack}
            className="mb-4 p-2 text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-white/10 rounded cursor-pointer"
          >
            <ArrowLeft
              size={20}
              className="inline mr-2 text-gray-700 dark:text-gray-300"
              onClick={() => navigate(-1)}
            />
            Back
          </button>
        </div>
        <div className="relative dark:bg-card flex flex-col sm:flex-row gap-2 bg-gray-100/80 p-6 rounded-lg mb-6 items-center border dark:border-border/50">
          <div className="flex size-20 sm:size-30 bg-blue-900 text-white justify-center items-center rounded-full mr-4 shadow-lg">
            <p className="text-3xl font-extrabold">
              {department.department.name.toUpperCase().charAt(0)}
            </p>
          </div>

          <div className="flex-grow text-gray-700 dark:text-gray-200">
            <h2 className="text-center sm:text-left text-2xl font-bold">
              {department.department.name.includes("Department of")
                ? ""
                : department.department.school === "institute"
                  ? ""
                  : "Department of"}{" "}
              {department.department.name}
            </h2>
            <p className="flex items-center">
              <FaBookOpen className="inline mr-2 text-gray-700 dark:text-gray-400" />
              {removeDash(department.department.college)}
            </p>

            <p className="flex items-center">
              <FaSchool className="inline mr-2 text-gray-700 dark:text-gray-400" />
              {removeDash(department.department.school)}
            </p>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => setDisplayModal(true)}
              className=" bg-blue-900 hover:bg-blue-800 text-white font-semibold p-1 rounded cursor-pointer"
            >
              <Edit size={20} />
            </button>

            <button
              onClick={() => handleDeleteDepartment()}
              className="bg-red-600 hover:bg-red-800 text-white font-semibold p-1 rounded cursor-pointer"
            >
              <Trash size={20} className="" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100 dark:bg-card text-gray-700 dark:text-gray-200 p-6 rounded-lg border dark:border-border/50">
            <p className="flex items-center">
              <Mail size={19} className="inline mr-2 text-gray-700 dark:text-gray-400" />
              {department.department.head.email}
            </p>

            <p className="flex items-center">
              <FaPhone size={19} className="inline mr-2 text-gray-700 dark:text-gray-400" />
              {department.department.head.contact}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between border-b border-gray-300 dark:border-border mb-4 mt-10">
            {tabs.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setSelectedTab(type.value);
                }}
                className={`py-2 px-11 md:px-20 outline-none w-fit cursor-pointer flex gap-2 mx-auto text-center transition-all duration-200
                            ${
                              selectedTab === type.value
                                ? "rounded-t text-white bg-ug-blue dark:bg-primary shadow-md"
                                : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5"
                            }`}
              >
                <type.Icon size={18} />
                {type.label}
              </button>
            ))}
          </div>

          <div className="min-h-60 bg-white dark:bg-card p-6 rounded-lg shadow-sm border dark:border-border/50">
            {selectedTab === "students" && (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className={`${inputStyles} pl-12 w-full dark:bg-background/50`}
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                  />
                  {studentSearchTerm && (
                    <XCircle
                      size={18}
                      className="absolute top-2.5 right-3 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={clearFilters}
                    />
                  )}
                </div>

                {fetchingStudents ? (
                  <Loading loaderSize={40} message="Loading students..." />
                ) : (
                  <div>
                    {filterStudents()?.length === 0 ? (
                      <div className="text-gray-500 py-8">
                        <AiOutlineFileSearch
                          className="text-gray-400 mx-auto"
                          size={70}
                        />
                        <p className="text-center">
                          No students found for this{" "}
                          {accountType(
                            department.department.school,
                          ).toLocaleLowerCase()}
                          .
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-200 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filterStudents().map((student) => (
                          <div
                            key={student.id}
                            className="relative p-4 rounded-lg flex flex-col items-center mb-2 bg-gray-50 dark:bg-secondary/5 border border-gray-100 dark:border-border shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="absolute top-2 right-2">
                              <button
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 cursor-pointer rounded transition-colors duration-200"
                                onClick={() =>
                                  handleUserDeletion(student.user.id)
                                }
                              >
                                <Trash
                                  size={17}
                                />
                              </button>
                            </div>

                            <div className="flex size-12 bg-blue-900 text-white justify-center items-center rounded-full mr-4">
                              {getNameInitials(student.name)}
                            </div>

                            <div className="w-full mt-1 text-sm text-center text-gray-400 dark:text-gray-500 py-1.5">
                              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {shortenText(student.name, 25)} -{" "}
                                <span className="text-slate-500 dark:text-gray-400 py-1">
                                  {student.student_id}
                                </span>
                              </h3>

                              <p className="flex items-center justify-center">
                                <Mail className="inline mr-2" size={14} />
                                {shortenText(student.user.email, 30)}
                              </p>
                            </div>

                            {/* <div>
                              <p>{student.programme_category}</p>
                              <p>{student.programme}</p>
                            </div> */}

                            <div className="w-full mt-2">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setEditStudentModal(true);
                                }}
                                className="text-blue-800 dark:text-blue-400 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer w-full border border-blue-500 rounded-md transition-colors duration-200"
                              >
                                View more
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedTab === "supervisors" && (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search supervisors..."
                    className={`${inputStyles} pl-12 w-full dark:bg-background/50`}
                    value={supervisorSearchTerm}
                    onChange={(e) => setSupervisorSearchTerm(e.target.value)}
                  />
                  {supervisorSearchTerm && (
                    <XCircle
                      size={18}
                      className="absolute top-2.5 right-3 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={clearFilters}
                    />
                  )}
                </div>

                {fetchingSupervisors ? (
                  <Loading loaderSize={40} message="Loading students..." />
                ) : (
                  <div>
                    {filterSupervisors()?.length === 0 ? (
                      <div className="text-gray-500 py-8">
                        <AiOutlineFileSearch
                          className="text-gray-400 mx-auto"
                          size={70}
                        />
                        <p className="text-center">
                          No supervisors found for this{" "}
                          {accountType(
                            department.department.school,
                          ).toLocaleLowerCase()}
                          .
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-200 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filterSupervisors()?.map((supervisor) => (
                          <div
                            key={supervisor.id}
                            className="relative p-4 rounded-lg flex flex-col items-center mb-2 bg-gray-50 dark:bg-secondary/5 border border-gray-100 dark:border-border shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="absolute top-2 right-2">
                              <button
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 cursor-pointer rounded transition-colors duration-200"
                                onClick={() =>
                                  handleUserDeletion(supervisor.user.id)
                                }
                              >
                                <Trash
                                  size={17}
                                />
                              </button>
                            </div>

                            <div className="flex size-12 bg-blue-900 text-white justify-center items-center rounded-full mr-4">
                              {getNameInitials(supervisor.name)}
                            </div>

                            <div className="w-full mt-1 text-sm text-center text-gray-400 dark:text-gray-500 py-1.5">
                              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                                {shortenText(supervisor.name, 25)} -{" "}
                                <span className="text-slate-500 dark:text-gray-400 py-1">
                                  {supervisor.staff_id}
                                </span>
                              </h3>

                              <p className="flex items-center justify-center">
                                <Mail className="inline mr-2" size={14} />
                                {shortenText(supervisor.user.email, 30)}
                              </p>
                            </div>

                            <div className="w-full mt-2">
                              <button
                                onClick={() => {
                                  setSelectedSupervisor(supervisor);
                                  setEditStudentModal(true);
                                }}
                                className="text-blue-800 dark:text-blue-400 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer w-full border border-blue-500 rounded-md transition-colors duration-200"
                              >
                                View more
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden">
          <div className="flex items-center border-b border-gray-200 pb-2 mb-2">
            <p className="text-lg text-gray-500 font-semibold">
              Programs Titles
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-card p-4 rounded-lg border dark:border-border/50">
            {department.programs.length === 0 ? (
              <div className="text-gray-500 py-8">
                <AiOutlineFileSearch
                  className="text-gray-400 mx-auto"
                  size={70}
                />
                <p className="text-center">
                  No programs found for this{" "}
                  {department.department.college === "institute/centre"
                    ? "Institute/Center"
                    : "department"}
                </p>
              </div>
            ) : (
              department.programs.map((prog) => (
                <div
                  key={prog.id}
                  className=" p-1.5 rounded-lg flex items-center mb-2 bg-white dark:bg-background/50 shadow-sm border dark:border-border/30"
                >
                  <DotIcon className=" text-gray-500" size={33} />
                  <h3 className="text-md text-gray-600 dark:text-gray-300">{prog.program_name}</h3>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {displayModal && (
        <Modal
          headTitle={`Edit ${departmentData?.department.name} Details`}
          subHeadTitle="Manage department/institute/centre details"
          handleCancel={handleCancel}
          handleConfirm={() => {}}
          buttonDisabled={false}
          w="max-w-4xl"
        >
          <div className="min-h-[400px]">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <AppInput
                label="Email"
                name="email"
                type="email"
                formik={formik}
                placeholder="Enter department email"
              />

              <CustomSelect
                label="College"
                value={formik.values.college}
                options={colleges}
                onChange={(option) =>
                  handleSelectionOnChange(option, "college", formik)
                }
              />

              {department?.department.school === "institute" ? (
                <AppInput
                  label="Institute/Centre Name"
                  name="name"
                  type="text"
                  formik={formik}
                  placeholder="Enter institute/centre name"
                />
              ) : (
                <>
                  <CustomSelect
                    label="School"
                    value={formik.values.school}
                    options={getSchoolsByCollege()}
                    onChange={(option) =>
                      handleSelectionOnChange(option, "school", formik)
                    }
                    disabled={!formik.values.college}
                  />

                  <CustomSelect
                    label={
                      department?.department.school === "institute"
                        ? "Institute/Centre"
                        : "Department"
                    }
                    value={formik.values.name}
                    options={getDepartmentsBySchool()}
                    disabled={!formik.values.school}
                    onChange={(option) =>
                      handleSelectionOnChange(option, "name", formik)
                    }
                  />
                </>
              )}

              <AppInput
                label="Phone Number"
                name="contact"
                type="text"
                formik={formik}
                placeholder="Enter department phone number"
              />

              <div className="flex justify-end mt-4 space-x-3">
                <SolidButton
                  type="submit"
                  title="Save"
                  Icon={
                    formik.isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )
                  }
                  disabled={formik.isSubmitting}
                  className="py-1.5"
                />
              </div>
            </form>
          </div>
        </Modal>
      )}

      {editStudentModal && (
        <Modal
          headTitle={
            selectedSupervisor
              ? `${selectedSupervisor.name}`
              : `${selectedStudent.name}`
          }
          subHeadTitle="Manage user details"
          handleCancel={onCancel}
          handleConfirm={() => {}}
          buttonDisabled={false}
          w="max-w-4xl"
        >
          {selectedSupervisor && (
            <EditSupervisor
              onCancel={onCancel}
              selectedSupervisor={selectedSupervisor}
            />
          )}
          {selectedStudent && (
            <EditStudent
              onCancel={onCancel}
              selectedStudent={selectedStudent}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default EditDepartment;
