import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { MdPersonAdd as UserPlusIcon, MdOutlineSettings as Cog6ToothIcon } from "react-icons/md";
import { useNavigate } from "react-router";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CustomSelect from "../../components/shared/custom-select";
import SmallLoader from "../shared/loader/SmallLoader";
import SolidButton from "../shared/buttons/SolidButton";
import usePageTile from "../../hooks/usePageTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AppInput from "../shared/input/AppInput";
import { handleSelectionOnChange } from "../../utils/helpers";

interface AdminAddUserFormValues {
  email: string;
  account_type: string;
  unit: string;
  department: string;
  customDepartment: string;
  contact: string;
  college: string;
  school: string;
  role?: string;
  create_type?: string;
}

export default function AdminAddUser() {
  usePageTile("Admin - Add User");
  const DEPARTMENT_ROLE = import.meta.env.VITE_DEPARTMENT_ROLE;
  const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE;
  const [allDepartments, setAllDepartments] = useState<any[]>([]);
  const [allInstitutes, setAllInstitutes] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const options = [
    { value: "department", label: "Department" },
    { value: "institute", label: "Institute/Centre" },
    { value: "admin", label: "Admin" },
  ];
  const axios = useAxiosPrivate();
  const [role, setRole] = useState<string>("");
  const navigate = useNavigate();

  const getLabel = (itemOptions: any[], value: string) => {
    const selectedItem = itemOptions?.find((item) => item.id === value);
    return selectedItem;
  };

  const fetchColleges = async () => {
    const { data }: any = await axios.get("/selector/colleges/");
    return data.map((col: any) => ({
      value: col.id,
      label: col.name.replace(/-/g, " "),
    }));
  };

  const fetchDepartments = async () => {
    const { data }: any = await axios.get(
      `/selector/departments/?schoolId=${formik.values.school}`,
    );
    setAllDepartments(data);
    const deptOptions = data.map((dept: any) => ({
      value: dept.id,
      label: dept.name.replace(/-/g, " "),
    }));
    return [...deptOptions, { value: "other", label: "Other (specify)" }];
  };

  const fetchSchools = async () => {
    const { data }: any = await axios.get(
      `/selector/schools/?collegeId=${formik.values.college}`,
    );
    return data;
  };

  const fetchInstitutes = async () => {
    const { data }: any = await axios.get(
      `/selector/centers-and-institutes/?collegeId=${formik.values.college}`,
    );
    setAllInstitutes(data);
    const institutesData = data.map((institute: any) => ({
      value: institute.id,
      label: institute.name,
    }));
    return [...institutesData, { value: "other", label: "Other (specify)" }];
  };

  const createInstitute = async (name: string, collegeId: string) => {
    try {
      const { data }: any = await axios.post(
        "/selector/centers-and-institutes/",
        {
          name: name,
          college: collegeId,
        },
      );
      return data;
    } catch (error) {
      toast.error("Error creating institute/centre");
      throw error;
    }
  };

  const createDepartment = async (name: string, schoolId: string) => {
    try {
      const { data }: any = await axios.post("/selector/departments/", {
        name: name,
        school: schoolId,
      });
      return data;
    } catch (error) {
      toast.error("Error creating department");
      throw error;
    }
  };

  const handleOnSubmit = async (values: AdminAddUserFormValues) => {
    if (values.email.trim() === "") {
      toast.error("Email is required");
      throw new Error("Email is required");
    }
    values.create_type = "single";
    values.role = role;

    const selectedDepart = getLabel(allDepartments, values.department);

    if (values.account_type == "department") {
      if (values.department === "other" && !values.customDepartment) {
        toast.error("Please specify the department name");
        return;
      } else if (values.department === "other") {
        const newDepartment = await createDepartment(
          values.customDepartment,
          values.school,
        );
        return axios.post("/departments/", {
          ...values,
          name: newDepartment.name,
          departments: newDepartment.name,
          school: newDepartment.school.name,
          college: newDepartment.school.college.name,
        });
      }

      return axios.post("/departments/", {
        ...values,
        name: selectedDepart.name,
        department: selectedDepart.name,
        school: selectedDepart.school.name,
        college: selectedDepart.school.college.name,
      });
    }

    if (values.account_type == "institute") {
      if (values.department === "other" && !values.customDepartment) {
        toast.error("Please specify the institute/centre name");
        return;
      } else if (values.department === "other") {
        const newInstitute = await createInstitute(
          values.customDepartment,
          values.college,
        );
        await queryClient.invalidateQueries({
          queryKey: ["institutes", values.college],
        });
        const selectedInstitute = allInstitutes.find(
          (inst) => inst.id === newInstitute.id,
        );
        if (!selectedInstitute) {
          toast.error("Error finding newly created institute");
          throw new Error("Error finding newly created institute");
        }

        return axios.post("/departments/", {
          ...values,
          name: selectedInstitute.name,
          department: selectedInstitute.name,
          school: "institute",
          college: selectedInstitute.college.name,
        });
      }

      const selectedInstitute = getLabel(allInstitutes, values.department);

      values.department =
        values.department === "other"
          ? values.customDepartment
          : selectedInstitute.name;
      values.customDepartment =
        values.department === "other" ? "" : values.customDepartment;
      values.school = "institute";
      return axios.post("/departments/", {
        ...values,
        college: selectedInstitute.college.name,
        department: selectedInstitute.name,
        name: values.department,
      });
    }

    return axios.post("/accounts/", values);
  };

  const { isPending: loading, mutate } = useMutation({
    mutationFn: handleOnSubmit,
    onError: (error) => {
      console.error(error);
      toast.error("Error creating user");
    },
    onSuccess: () => {
      toast.success("User created successfully");
      formik.resetForm();
      setRole("");
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      account_type: "",
      unit: "",
      department: "",
      customDepartment: "",
      contact: "",
      college: "",
      school: "",
    },
    onSubmit: (values) => {
      mutate(values);
    },
  });

  const { data: institutes } = useQuery({
    queryKey: ["institutes", formik.values.college],
    queryFn: fetchInstitutes,
    enabled:
      !!formik.values.college && formik.values.account_type === "institute",
  });

  const { data: departments, isLoading: fetchingDepartments } = useQuery({
    queryKey: ["departments-selector", formik.values.school],
    queryFn: fetchDepartments,
    enabled:
      !!formik.values.school && formik.values.account_type === "department",
  });

  const { data: schools, isLoading: fetchingSchools } = useQuery({
    queryKey: ["schools", formik.values.college],
    queryFn: fetchSchools,
    enabled:
      !!formik.values.college && formik.values.account_type === "department",
  });

  const { data: colleges, isLoading: fetchingColleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: fetchColleges,
  });

  useEffect(() => {
    if (formik.values.account_type === "department") {
      setRole(DEPARTMENT_ROLE);
    } else if (formik.values.account_type === "admin") {
      setRole(ADMIN_ROLE);
    }
  }, [formik.values.account_type, ADMIN_ROLE, DEPARTMENT_ROLE]);

  return (
    <>
      {colleges?.length === 0 && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-card shadow-2xl ring-1 ring-gray-900/5 dark:ring-border p-8 border border-transparent dark:border-border transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 mb-6 transition-colors">
                <Cog6ToothIcon
                  className="h-10 w-10 text-primary dark:text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                No colleges found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                You need to add at least one college before creating users.
                Colleges help group schools and departments.
              </p>

              <div className="flex w-full justify-center">
                <SolidButton
                  type="button"
                  title="Go to Settings"
                  Icon={<Cog6ToothIcon className="h-4 w-4" />}
                  onClick={() => navigate("/settings")}
                  className="w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <UserPlusIcon
              className="h-16 w-16 mx-auto text-primary dark:text-blue-400 mb-2"
              aria-hidden="true"
            />
            <h2 className="text-primary dark:text-gray-100 text-3xl font-cal-sans tracking-wide">
              Add New User
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Create new user account for Departments/Administrators
            </p>
          </div>

          <div className="bg-white dark:bg-card p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-border transition-all">
            <form className="px-6 py-8" onSubmit={formik.handleSubmit}>
              <div className="space-y-6">
                <div>
                  <AppInput
                    label="Email"
                    type="email"
                    formik={formik}
                    name="email"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="account_type"
                    className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                  >
                    Account Type
                  </label>
                  <div className="mt-2">
                    <CustomSelect
                      options={options}
                      onChange={(option) =>
                        handleSelectionOnChange(option, "account_type", formik)
                      }
                      value={formik.values.account_type}
                    />
                  </div>
                </div>

                {formik.values.account_type && (
                  <div className="pt-2">
                    <div className="relative">
                      <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                      >
                        <div className="w-full border-t border-gray-200 dark:border-border" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-card px-2 text-sm text-gray-500 dark:text-gray-400">
                          {formik.values.account_type === "admin"
                            ? "Administrator Details"
                            : formik.values.account_type === "department"
                              ? "Department Details"
                              : "Institute Details"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {formik.values.account_type === "institute" && (
                  <div className="animate-fadeIn space-y-6">
                    <div>
                      <label
                        htmlFor="college"
                        className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                      >
                        College Name
                      </label>
                      <div className="mt-2">
                        <CustomSelect
                          options={colleges || []}
                          onChange={(option) => {
                            handleSelectionOnChange(option, "college" , formik);
                          }}
                          value={formik.values.college}
                          isLoading={fetchingColleges}
                        />
                      </div>
                    </div>

                    {formik.values.college && (
                      <div>
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                        >
                          Institute/Centre Name
                        </label>
                        <div className="mt-2">
                          <CustomSelect
                            options={institutes || []}
                            onChange={(option) =>
                              handleSelectionOnChange(option, "department" , formik)
                            }
                            value={formik.values.department}
                          />
                        </div>
                      </div>
                    )}
                    {formik.values.department === "other" && (
                      <div className="mt-3 animate-fadeIn">
                        <label
                          htmlFor="customDepartment"
                          className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                        >
                          Specify Institute/Centre
                        </label>
                        <div className="mt-2 flex rounded-md shadow-sm border border-gray-300 dark:border-border overflow-hidden">
                          <input
                            type="text"
                            id="customDepartment"
                            name="customDepartment"
                            className="block flex-1 border-0 bg-transparent py-2.5 pl-2 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            placeholder="eg. Institute of Advanced Studies"
                            onChange={(e) => {
                              const words = e.target.value.split(" ");
                              const capitalizedWords = words.map((word) =>
                                word.length > 0
                                  ? word.charAt(0).toUpperCase() + word.slice(1)
                                  : word,
                              );
                              const capitalizedValue =
                                capitalizedWords.join(" ");

                              formik.setFieldValue(
                                "customDepartment",
                                capitalizedValue,
                              );
                            }}
                            value={
                              formik.values.department === "other" ?
                              formik.values.customDepartment : ""
                            }
                            required={formik.values.department === "other"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formik.values.account_type === "admin" ? (
                  <div className="animate-fadeIn">
                    <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4 border border-blue-100 dark:border-blue-900/30">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-blue-400 dark:text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            This user will have administrator privileges.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : formik.values.account_type === "department" ? (
                  <div className="space-y-6 animate-fadeIn">
                    <div>
                      <label
                        htmlFor="college"
                        className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                      >
                        College Name
                      </label>
                      <div className="mt-2">
                        <CustomSelect
                          options={colleges || []}
                          onChange={(option) => {
                            handleSelectionOnChange(option, "college" , formik);
                            formik.setFieldValue("school", "");
                            formik.setFieldValue("department", "");
                            queryClient.invalidateQueries({
                              queryKey: ["schools", option],
                            });
                          }}
                          value={formik.values.college}
                          isLoading={fetchingColleges}
                        />
                      </div>
                    </div>

                    {formik.values.college && (
                      <div>
                        <label
                          htmlFor="school"
                          className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                        >
                          School Name
                        </label>
                        <div className="mt-2">
                          <CustomSelect
                            options={
                              schools?.map((school: any) => ({
                                value: school.id,
                                label: school.name.replace(/-/g, " "),
                              })) || []
                            }
                            onChange={(option) => {
                              handleSelectionOnChange(option, "school", formik);
                              formik.setFieldValue("department", "");
                              queryClient.invalidateQueries({
                                queryKey: ["departments-selector", option],
                              });
                            }}
                            value={formik.values.school}
                            isLoading={fetchingSchools}
                          />
                        </div>
                      </div>
                    )}

                    {formik.values.school && (
                      <div>
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                        >
                          Department Name
                        </label>
                        <div className="mt-2">
                          <CustomSelect
                            options={departments || []}
                            onChange={(option) =>
                              handleSelectionOnChange(option, "department", formik)
                            }
                            value={formik.values.department}
                            isLoading={fetchingDepartments}
                          />
                        </div>

                        {formik.values.department === "other" && (
                          <div className="mt-3 animate-fadeIn">
                            <label
                              htmlFor="customDepartment"
                              className="block text-sm font-medium leading-6 text-blue-900 dark:text-blue-400"
                            >
                              Specify Department
                            </label>
                            <div className="mt-2 flex rounded-md shadow-sm border border-gray-300 dark:border-border overflow-hidden transition-all">
                              <span className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 text-blue-900 dark:text-blue-300 sm:text-base border-r dark:border-border">
                                Department of
                              </span>
                              <input
                                type="text"
                                id="customDepartment"
                                name="customDepartment"
                                className="block flex-1 border-0 outline-none bg-transparent py-2.5 pl-1 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                placeholder="eg. Computer Science"
                                onChange={(e) => {
                                  const words = e.target.value.split(" ");
                                  const capitalizedWords = words.map((word) =>
                                    word.length > 0
                                      ? word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                      : word,
                                  );
                                  const capitalizedValue =
                                    capitalizedWords.join(" ");

                                  formik.setFieldValue(
                                    "customDepartment",
                                    capitalizedValue,
                                  );
                                }}
                                value={formik.values.customDepartment}
                                required={formik.values.department === "other"}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}

                <div>
                  <AppInput
                    label="Contact Number"
                    type="text"
                    formik={formik}
                    name="contact"
                    placeholder="0123 456 789"
                  />
                </div>
              </div>

              <div className="mt-8">
                <SolidButton
                  title={
                    loading ? (
                      <>
                        <SmallLoader />
                        Adding User...
                      </>
                    ) : (
                      "Add User"
                    )
                  }
                  type={"submit"}
                  disabled={loading}
                  className={"w-full py-2"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
