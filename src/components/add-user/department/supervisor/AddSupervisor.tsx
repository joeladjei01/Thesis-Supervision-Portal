import { use, useEffect, useState } from "react";
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
import MultiSelect from "../../../shared/custom-select/MultiSelect";
import {
  handleSelectionOnChange,
  handleMultiSelectionOnChange,
} from "../../../../utils/helpers";
import { genderOptions } from "../../../../utils/selection";
import { useDepartmentDataStore } from "../../../../store/useDepartmentDataStore";
import { cardDefaultStyle } from "@/utils/utils";

const AddSupervisor = () => {
  const supervisorRole = import.meta.env.VITE_SUPERVISOR_ROLE;
  const queryClient = useQueryClient();
  const [selectMode, setSelectMode] = useState("sng");
  const { researchAreas } = useDepartmentDataStore();
  const axios = useAxiosPrivate();
  const { person } = userStore();

  const validationSchema = Yup.object().shape({
    staff_id: Yup.string().required().label("Staff ID").min(5),
    name: Yup.string().required().label("Staff Name"),
    gender: Yup.string().required().label("Gender").oneOf(["male", "female"]),
    email: Yup.string().email().required().label("Email"),
    contact: Yup.string().required().label("Contact").min(10),
    research_area: Yup.array()
      .of(Yup.string())
      .min(1, "At least one research area is required")
      .required()
      .label("Research Area"),
    school: Yup.string().required().label("School"),
    college: Yup.string().required().label("College"),
    department: Yup.string().required().label("Department"),
    status: Yup.string().label("Status"),
  });
  const initialValue = {
    staff_id: "",
    school: "",
    college: "",
    research_area: [] as string[],
    name: "",
    email: "",
    gender: "",
    contact: "",
    status: "",
  };
  const formik = useFormik({
    initialValues: initialValue,
    validationSchema,
    onSubmit: (values) => {
      if (selectMode === "sng") {
        mutate(values);
      }
    },
  });
  usePageTile("Department - Add Supervisor");
  const handleSingleSubmit = async (values: typeof initialValue) => {
    return await axios
      .post("accounts/", {
        ...values,
        create_type: "single",
        role: supervisorRole,
        department: person.department.name,
        school: person.department.school,
        college: person.department.college,
      })
      .then(() => formik.resetForm());
  };

  const handleSelectSingleEntry = () => {
    setSelectMode("sng");
  };

  const handleSelectBulkEntry = () => {
    setSelectMode("bulk");
  };
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["fetch-research-areas"],
    });
  }, []);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: handleSingleSubmit,
    onError: (error) => {
      console.error("Error submitting form:", error);
      toast.error("Failed to create supervisor");
    },
    onSuccess: () => {
      toast.success("Supervisor created successfully");
    },
  });

  return (
    <section className="relative">
      <Header
        title={"Supervisor Management"}
        subtitle={"Add supervisor information to the system"}
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
            className={`${
              selectMode === "sng" && "bg-[#003399]/9 dark:bg-primary"
            } text-center cursor-pointer text-blue-800 dark:text-blue-200  border-3 border-slate-300 p-6 rounded-lg`}
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
            <p>Add individual supervisor record one at a time</p>

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
            className={`${
              selectMode !== "sng" && "bg-[#003399]/9 dark:bg-primary"
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

      {selectMode === "sng" ? (
        <form
          className={`${cardDefaultStyle} `}
          onSubmit={formik.handleSubmit}
        >
          <Header
            title={"Add Supervisor Records"}
            subtitle={"Enter supervisor information manually"}
          />
          <div className={"flex flex-col items-center"}>
            <div className={"w-full grid grid-cols-2 gap-4 "}>
              <AppInput
                label={"Staff ID"}
                name={"staff_id"}
                placeholder={"12345"}
                formik={formik}
              />
              <AppInput
                label={"Email"}
                name={"email"}
                placeholder={"joel@ug.edu.gh"}
                formik={formik}
              />

              <AppInput
                label={"Staff name"}
                name={"name"}
                placeholder={"Joel Johnson"}
                formik={formik}
              />

              {/* <div>
                <MultiSelect
                  label="Research Area(s)"
                  options={researchAreas.map((area: any) => ({
                    value: area.id,
                    label: area.name,
                  }))}
                  onChange={(options) =>
                    formik.setFieldValue("research_area", options)
                  }
                  value={formik.values.research_area}
                  placeholder="Select research areas..."
                />
                {formik?.touched.research_area &&
                  formik?.errors.research_area && (
                    <div className={"text-red-600 text-sm mt-1"}>
                      {String(formik?.errors.research_area)}
                    </div>
                  )}
              </div> */}

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
                formik={formik}
                placeholder={"Enter Contact Number"}
              />
              {/* <AppInput
                label={"Current Load"}
                name={"current_load"}
                formik={formik}
                placeholder={"Enter Current Load"}
              /> */}

              <div>
                <div className="">
                  
                  <CustomSelect
                    label="Status"
                    options={[
                      { value: "Not Available", label: "Not Available" },
                      { value: "Available", label: "Available" },
                    ]}
                    onChange={(option) =>
                      handleSelectionOnChange(option, "status", formik)
                    }
                    value={formik.values.status}
                  />
                </div>
                {formik?.touched.status && formik?.errors.status && (
                  <div className={"text-red-600 text-sm mt-1"}>
                    {String(formik?.errors.status)}
                  </div>
                )}
              </div>
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
      )}
    </section>
  );
};

export default AddSupervisor;
