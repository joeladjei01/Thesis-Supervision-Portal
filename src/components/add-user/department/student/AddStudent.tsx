/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UserPlus2, Files } from "lucide-react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import usePageTile from "../../../../hooks/usePageTitle";
import userStore from "../../../../store";
import SolidButton from "../../../shared/buttons/SolidButton";
import AppInput from "../../../shared/input/AppInput";
import Header from "../../../shared/text/Header";
import BulkUpload from "./BulkUpload";
import CustomSelect from "../../../shared/custom-select";
import { handleSelectionOnChange } from "../../../../utils/helpers";
import { useDepartmentDataStore } from "../../../../store/useDepartmentDataStore";
import { cardDefaultStyle } from "@/utils/utils";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const LevelOptions = [
  { value: "600", label: "600" },
  { value: "700", label: "700" },
];

const AddStudent = () => {
  const StudentRole = import.meta.env.VITE_STUDENT_ROLE;
  const queryClient = useQueryClient();
  const [selectMode, setSelectMode] = useState("sng");
  const { person } = userStore();
  const { programmeLevels, programTitles } = useDepartmentDataStore();

  const programmeCategories = programmeLevels.map((level) => {
    return {
      value: level.id,
      label: level.name,
    };
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["fetch-quotas"] });
    queryClient.invalidateQueries({ queryKey: ["fetch-program-titles"] });
  }, []);

  const initialValue = {
    student_id: "",
    name: "",
    gender: "",
    email: "",
    level_title: "",
    programme: "",
    programme_level: "",
    contact: "",
    level: "",
  };

  const validationSchema = Yup.object().shape({
    student_id: Yup.string().required().label("Student ID").min(7),
    name: Yup.string().required().label("Student Name"),
    gender: Yup.string().required().label("Gender").oneOf(["male", "female"]),
    email: Yup.string().email().required().label("Email"),
    programme: Yup.string().required().label("Programme Name"),
    level: Yup.string().required().label("Level"),
    // programme: Yup.string().required().label("Programme Name"),
    programme_level: Yup.string().required().label("Programme Level"),
    contact: Yup.string().required().label("Contact").min(10),
  });

  usePageTile("Department - Add Student");
  const formik = useFormik({
    initialValues: initialValue,
    validationSchema,
    onSubmit: () => {
      if (selectMode === "sng") {
        // mutate(values);
      }
    },
  });
  const handleSingleSubmit = async (values: any) => {
    return await axios
      .post("students/", {
        ...values,
        create_type: "single",
        role: StudentRole,
        department: person.department.name,
        school: person.department.school,
        college: person.department.college,
      })
      .then(() => formik.resetForm());
  };

  const axios = useAxiosPrivate();

  const handleSelectSingleEntry = () => {
    setSelectMode("sng");
  };

  const handleSelectBulkEntry = () => {
    setSelectMode("bulk");
  };

  const { mutate, isPending: loading } = useMutation({
    mutationFn: handleSingleSubmit,
    onError: (error) => {
      console.error("Error submitting form:", error);
      toast.error("Failed to create student");
    },
    onSuccess: () => {
      toast.success("Student created successfully");
    },
  });

  return (
    <section className="relative">
      <Header
        title={"Student Management"}
        subtitle={"Add student information to the system"}
      />

      <div
        className={
          `${cardDefaultStyle} mt-5 mb-20`}
      >
        <Header
          title={"Choose Entry Method"}
          subtitle={"Select how you want to add a student"}
        />
        <div className={"w-full grid grid-cols-1 md:grid-cols-2 gap-4"}>
          <div
            onClick={handleSelectSingleEntry}
            className={`${selectMode === "sng" && "bg-[#003399]/9 dark:bg-primary"
              } text-center cursor-pointer text-blue-800 dark:text-blue-200 border-3 border-slate-300 p-6 rounded-lg`}
          >
            <div
              className={
                "mx-auto flex items-center justify-center size-15 bg-blue-200 rounded-full"
              }
            >
              <UserPlus2 className={"size-7 text-blue-900"} />
            </div>

            <h4 className={"text-2xl font-bold text-[#003399] dark:text-blue-200  mt-3"}>
              Single Entry
            </h4>
            <p>Add individual student record one at a time</p>

            <button
              className={
                "px-7 cursor-pointer py-2 border border-slate-400 rounded-md mt-4 active:bg-slate-200"
              }
              onClick={handleSelectSingleEntry}
            >
              Select single Entry
            </button>
          </div>
          <div
            onClick={handleSelectBulkEntry}
            className={`${selectMode !== "sng" && "bg-[#003399]/9 dark:bg-primary"
              } text-center cursor-pointer text-blue-800 dark:text-blue-200 border-3 border-slate-300 p-6 rounded-lg`}
          >
            <div
              className={
                "mx-auto flex items-center justify-center size-15 bg-blue-200 rounded-full"
              }
            >
              <Files className={"size-7 text-blue-900"} />
            </div>

            <h4 className={"text-2xl font-bold text-blue-800 dark:text-blue-200 mt-3"}>
              Bulk Upload
            </h4>
            <p>Upload CSV file containing multiple records</p>

            <button
              className={
                "px-7 cursor-pointer py-2 border border-gray-400 rounded-md mt-4 active:bg-slate-200"
              }
              onClick={handleSelectBulkEntry}
            >
              Select Bulk upload
            </button>
          </div>
        </div>
      </div>

      {
        selectMode === "sng" ? (
          <form
            className={`${cardDefaultStyle} p-6`}
            onSubmit={formik.handleSubmit}
          >
            <Header
              title={"Add Student Records"}
              subtitle={"Enter student information manually"}
            />
            <div className={"flex flex-col items-center"}>
              <div className={"w-full grid grid-cols-2 md:grid-cols-2 gap-4 "}>
                <AppInput
                  label={"Student ID"}
                  name={"student_id"}
                  placeholder={"11290058"}
                  formik={formik}
                />

                <div>
                  <div className="">
                    <CustomSelect
                      label="Programme Name"
                      options={programTitles.map((prog: any) => ({
                        value: prog.program_name,
                        label: prog.program_name,
                      }))}
                      onChange={(option) =>
                        formik.setFieldValue("programme", option || "")
                      }
                      value={formik.values.programme}
                    />
                  </div>
                  {formik?.touched.programme && formik?.errors.programme && (
                    <div className={"text-red-600 text-sm mt-1"}>
                      {String(formik?.errors.programme)}
                    </div>
                  )}
                </div>

                <AppInput
                  label={"Student name"}
                  name={"name"}
                  formik={formik}
                  placeholder={"Joel Johnson"}
                />

                <div>
                  <div className="">
                    <CustomSelect
                      label="Student Level"
                      options={LevelOptions}
                      onChange={(option) =>
                        handleSelectionOnChange(option, "level", formik)
                      }
                      value={formik.values.level}
                    />
                  </div>
                  {formik?.touched.level && formik?.errors.level && (
                    <div className={"text-red-600 text-sm mt-1"}>
                      {String(formik?.errors.level)}
                    </div>
                  )}
                </div>

                <AppInput
                  label={"Email"}
                  name={"email"}
                  formik={formik}
                  placeholder={"joel@st.ug.edu.gh"}
                />

                <div>
                  <CustomSelect
                    label="Programme Level"
                    options={programmeCategories}
                    onChange={(option) =>
                      formik.setFieldValue("programme_level", option || "")
                    }
                    value={formik.values.programme_level}
                  />
                </div>

                <div>
                  <div className="">
                    <CustomSelect
                      label="Gender"
                      options={genderOptions}
                      onChange={(option) =>
                        handleSelectionOnChange(option, "gender", formik)
                      }
                      value={formik.values.gender}
                    />
                  </div>
                  {formik?.touched.gender && formik?.errors.gender && (
                    <div className={"text-red-600 text-sm mt-1"}>
                      {String(formik?.errors.gender)}
                    </div>
                  )}
                </div>

                <AppInput
                  label={"Contact Number"}
                  name={"contact"}
                  placeholder={"020 345 1124"}
                  formik={formik}
                />
              </div>

              <SolidButton
                type={"submit"}
                title={loading ? "Submitting..." : "Submit"}
                className={"mt-4 px-9 py-2"}
                onClick={() => mutate(formik.values)}
              />
            </div>
          </form>
        ) : (
          <div>
            <BulkUpload />
          </div>
        )
      }
    </section >
  );
};

export default AddStudent;
