import React, { useEffect, useMemo, useState } from "react";
import { type SingleValue } from "react-select";
import { useFormik } from "formik";
import Header from "../../components/shared/text/Header";
import AppInput from "../../components/shared/input/AppInput";
import CustomSelect from "../../components/shared/custom-select";
import SolidButton from "../../components/shared/buttons/SolidButton";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chapterAssignmentSchema } from "../../utils/validationSchema";
import { Loader2 } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import { chapters, handleMultiSelectionOnChange } from "../../utils/helpers";
import usePageTile from "../../hooks/usePageTitle";
import RichText from "../../components/shared/input/RichText";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import MultiSelect from "../../components/shared/custom-select/MultiSelect";
import { useNavigate } from "react-router";

const labelStyle =
  "text-blue-900 mb-1.5 font-semibold block text-md font-medium leading-6";

interface Options {
  value: string;
  label: string;
}

const ChapterAssignment: React.FC = () => {
  const axios = useAxiosPrivate();
  usePageTile("ThesisFlow - Chapter Assignment");
  const queryClient = useQueryClient();
  const person = userStore((state) => state.person);
  const navigate = useNavigate();
  const userInfo: any = userStore((state) => state.userInfo);
  const [checked, setChecked] = useState(false);
  const assignedStudents = useSupervisorDataStore(
    (state) => state.assignedStudents,
  );
  const programmeLevels = useSupervisorDataStore(
    (state) => state.programmeLevels,
  );

  const getStudentTopic = (topics) => {
    const approvedTopic = topics.find((topic) => topic.status === "approved");
    if (!approvedTopic) {
      toast.error("No approved topic found for the student.");
      throw new Error("No approved topic found for the student.");
    }
    console.log(approvedTopic);
    return approvedTopic.id;
  };

  const handleOnSubmit = async (values) => {
    const selectedStudents = Array.isArray(formik.values.student)
      ? formik.values.student
      : [];

    if (selectedStudents.length === 0) {
      toast.error("No students selected.");
      throw new Error("No students selected.");
    }

    const studentMap = new Map(
      filteredStudentsOptions.map((student) => [student.value, student.label]),
    );

    const results = [];

    for (const studentId of selectedStudents) {
      const studentName = studentMap.get(studentId) || "Unknown student";

      try {
        const topics = await fetchStudentTopics(studentId);
        const approvedTopicId = getStudentTopic(topics);

        await axios.post(`/students/chapter/assignment/create/${person.id}/`, {
          ...values,
          student: studentId,
          chapter: values.chapter_title,
          topic: approvedTopicId,
        });

        toast.success(
          `Assigned chapter successfully: ${studentName} (${studentId})`,
        );
        results.push({ studentId, studentName, success: true });
      } catch (error) {
        toast.error(`Assignment failed: ${studentName} (${studentId})`);
        results.push({ studentId, studentName, success: false, error });
      }
    }

    const successCount = results.filter((result) => result.success).length;

    if (successCount === 0) {
      throw new Error("Chapter assignment failed for all selected students.");
    }

    return results;
  };

  const { mutateAsync: fetchStudentTopics } = useMutation({
    mutationFn: async (studentId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data }: any = await axios.get(
        `/students/topics/students/${studentId}/`,
      );
      console.log("Student topics data:", data.data);
      return data.data;
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error fetching student topics");
    },
    // onSuccess: (data) => {
    //   // console.log("Fetched student:", data);
    //   return data;
    // }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["supervisor-students"] });
    queryClient.invalidateQueries({ queryKey: ["programme-levels"] });
  }, []);

  const { mutate } = useMutation({
    mutationFn: handleOnSubmit,
    onError: (error) => {
      console.log(error);
      toast.error("Error assigning chapter");
      formik.setSubmitting(false);
    },
    onSuccess: () => {
      toast.success("Chapter assign successfully");
      formik.resetForm();
      formik.setSubmitting(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      programmeLevel: "",
      student: [],
      chapter_title: "",
      // section: "",
      due_date: "",
      description: "",
    },
    validationSchema: chapterAssignmentSchema,
    onSubmit: (values) => mutate(values),
  });

  // const { data: chaptersByLevel, isFetching } = useQuery({
  //   queryKey: ["programmeLevel-chapters"],
  //   queryFn: async () => {
  //     const { data }: any = await axios.get(
  //       `/superadmin/sgs-chapters/${formik.values.programmeLevel}/by-programme-level/`,
  //     );
  //     return data.data;
  //   },
  //   enabled: !!formik.values.programmeLevel,
  // });

  const {
    data: supervisorChaptersByLevel,
    isFetching: isFetchingSupervisorChapters,
  } = useQuery({
    queryKey: ["superv-programmeLevel-chapters"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/supervisors/supervisor-chapter/by-programme-level/${person.id}/${formik.values.programmeLevel}/`,
        );
        return data.data;
      } catch (error) {
        return [];
      }
    },
    enabled: !!formik.values.programmeLevel,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["programmeLevel-chapters"],
    });
    queryClient.invalidateQueries({
      queryKey: ["depart-programmeLevel-chapters"],
    });
  }, [formik.values.programmeLevel]);

  // const departmentChapterUpdate = (chapterId: string) => {
  //   const update = departmentChaptersByLevel?.find(
  //     (deptChapter) => deptChapter.chapter.id === chapterId
  //   );
  //   console.log("update", update);
  //   return update;
  // };

  const chaptersOptions = (): Options[] => {
    return supervisorChaptersByLevel?.map((chapter) => {
      // const deptChapter = departmentChapterUpdate(chapter.id);
      // if (deptChapter) {
      //   return {
      //     value: deptChapter.id,
      //     label: `${deptChapter.custom_title} - ${deptChapter.custom_description}`,
      //   };
      // } else {
      //   return {
      //     value: chapter.id,
      //     label: `${chapter.name} - ${chapter.description}`,
      //   };
      // }

      return {
        value: chapter.id,
        label: `Chapter ${chapter.custom_title} - ${chapter.custom_description}`,
      };
    });
  };

  const handleSelectionOnChange = (
    option: SingleValue<Options>,
    field: string,
  ) => {
    return formik.setFieldValue(field, option ? option.value : "");
  };

  function filterStudentByProgrammeLevel(level: string) {
    const filteredStudents = assignedStudents?.filter((student) => {
      // Assuming each student object has a 'programmeLevelId' property
      return student.student.programme_level.id === level;
    });
    if (filteredStudents) {
      return filteredStudents;
    }
    return [];
  }

  const filteredStudentsOptions = useMemo(() => {
    if (formik.values.programmeLevel) {
      return filterStudentByProgrammeLevel(formik.values.programmeLevel).map(
        (student) => ({
          value: student.student.id,
          label: student.student.name,
        }),
      );
    }
    return assignedStudents?.map((student) => ({
      value: student.student.id,
      label: student.student.name,
    }));
  }, [formik.values.programmeLevel, assignedStudents]);

  return (
    <>
      <div>
        <Header
          title="Chapter Assignment for Thesis Flow"
          subtitle="Assign Chapters to students and set deadlines"
        />

        <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* <Header
            title="Assign Chapter"
            subtitle=""
          /> */}
          <div className="mb-6 font-jost text-gray-500">
            <h3 className="text-xl font-cal-sans tracking-wide text-sky-900">
              Assign Chapter to Student
            </h3>
            <p>Create a Chapter submissions with deadlines</p>
          </div>

          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <div>
                  <CustomSelect
                    label="Level of Programme"
                    options={
                      programmeLevels?.map((level) => ({
                        value: level.id,
                        label: level.name,
                      })) || []
                    }
                    value={formik.values.programmeLevel}
                    onChange={(option) => {
                      formik.setFieldValue(
                        "programmeLevel",
                        option ? option?.value : "",
                      );
                      formik.setFieldValue("student", "");
                    }}
                    placeholder="slect programme level (eg.MSc)"
                    isClearable
                  />
                </div>

                {formik?.touched.programmeLevel &&
                  formik?.errors.programmeLevel && (
                    <div>
                      <p className={"text-red-600 text-sm mt-1"}>
                        {formik.errors.programmeLevel}
                      </p>
                    </div>
                  )}
              </div>

              <div className="mb-3">
                <div>
                  <MultiSelect
                    label="Students"
                    value={formik.values.student}
                    onChange={(options) =>
                      handleMultiSelectionOnChange(options, "student", formik)
                    }
                    options={filteredStudentsOptions}
                    disabled={!formik.values.programmeLevel}
                    // isLoading={assignedStudents.length === 0}
                  />

                  {/* <button
                    className="flex items-center gap-2 mt-1.5 text-gray-700  pl-3 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400"
                    type="button"
                    onClick={() => {
                      setChecked(!checked);

                      if (checked) {
                        const allStudentIds = filteredStudentsOptions.map(
                          (option) => option.value,
                        );
                        formik.setFieldValue("student", allStudentIds);
                      } else {
                        formik.setFieldValue("student", []);
                      }
                    }}
                    disabled={
                      !formik.values.programmeLevel ||
                      filteredStudentsOptions.length === 0
                    }
                  >
                    <div>
                      <div
                        className={`size-4 border border-gray-400 rounded-full flex items-center justify-center`}
                      >
                        {checked && (
                          <div
                            className={`size-2.5 bg-blue-900 rounded-full`}
                          />
                        )}
                      </div>
                    </div>
                    <label className={"text-sm font-medium leading-6"}>
                      Select all students
                    </label>
                  </button> */}
                  {/* <CustomSelect
                    label="Student"
                    value={formik.values.student}
                    options={filteredStudentsOptions}
                    onChange={(option) =>
                      handleSelectionOnChange(option, "student")
                    }
                    isLoading={assignedStudents.length === 0}
                    disabled={!formik.values.programmeLevel}
                  /> */}
                </div>

                {/* {formik?.touched.student && formik?.errors.student && (
                  <div>
                    <p className={"text-red-600 text-sm mt-1"}>
                      {formik.errors.student}
                    </p>
                  </div>
                )} */}
              </div>

              <div className="mb-3">
                <div>
                  <CustomSelect
                    label="Chapter"
                    value={formik.values.chapter_title}
                    options={chaptersOptions()}
                    isLoading={isFetchingSupervisorChapters}
                    onChange={(option) =>
                      handleSelectionOnChange(option, "chapter_title")
                    }
                    disabled={
                      !formik.values.programmeLevel ||
                      isFetchingSupervisorChapters
                    }
                  />
                  {supervisorChaptersByLevel?.length === 0 &&
                    formik.values.programmeLevel &&
                    !isFetchingSupervisorChapters && (
                      <div className="py-1.5 flex flex-row gap-1">
                        <p className="text-sm text-slate-500 italic">
                          No Chapter available for the selected programme level.
                        </p>
                        <button
                          type="button"
                          className="text-sm text-blue-800 hover:underline cursor-pointer"
                          onClick={() => {
                            navigate("/chapter-management");
                          }}
                        >
                          Go to Settings
                        </button>
                      </div>
                    )}
                </div>

                {formik?.touched.chapter_title &&
                  formik?.errors.chapter_title && (
                    <div>
                      <p className={"text-red-600 text-sm mt-1"}>
                        {formik.errors.chapter_title}
                      </p>
                    </div>
                  )}
              </div>

              {/* <div className="mb-3">
                <label htmlFor="section" className={labelStyle}>
                  Section
                </label>
                <div>
                  <CustomSelect
                    value={formik.values.section}
                    options={sectionOptions}
                    onChange={(option) =>
                      handleSelectionOnChange(option, "section")
                    }
                  />
                </div>
                {formik?.touched.section && formik?.errors.section && (
                  <div>
                    <p className={"text-red-600 text-sm mt-1"}>
                      {formik.errors.section}
                    </p>
                  </div>
                )}{" "}
              </div> */}

              <div className="mb-3">
                <AppInput
                  formik={formik}
                  label="Due date"
                  name="due_date"
                  placeholder="Pick a due date"
                  type="datetime-local"
                />
              </div>

              <div>
                <RichText
                  label="Description"
                  name="description"
                  value={formik.values.description}
                  onChange={(value) =>
                    formik.setFieldValue("description", value)
                  }
                />
                {formik?.touched.description && formik?.errors.description && (
                  <div>
                    <p className={"text-red-600 text-sm mt-1"}>
                      {formik.errors.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-7">
                <SolidButton
                  type="submit"
                  disabled={formik.isSubmitting}
                  title={
                    formik.isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Assign Chapter"
                    )
                  }
                  className="w-full py-2"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterAssignment;
