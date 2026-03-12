import React, { useEffect, useState } from "react";
import CustomSelect from "../shared/custom-select";
import SolidButton from "../shared/buttons/SolidButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Loader2Icon, Save, Trash2 } from "lucide-react";
import Modal from "../../layouts/Modal";
import OutlineButton from "../shared/buttons/OutlineButton";
import { useFormik } from "formik";
import AppInput from "../shared/input/AppInput";
import useAlert from "../../hooks/useAlert";
import userStore from "../../store";
import { orderChapters } from "../../utils/helpers";

const DepartmentChapters = ({ allLevels, fetchProgrammeLevels }) => {
  const queryClient = useQueryClient();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [editChapter, setEditChapter] = useState<any>(null);
  const [departUpdated, setDepartUpdated] = useState<boolean>(false);
  const alert = useAlert();
  const { person } = userStore();
  const axios = useAxiosPrivate();

  const { data: allChapters } = useQuery({
    queryKey: ["all-department-chapters"],
    queryFn: async () => {
      const { data }: any = await axios.get(
        `/departments/${person?.department.id}/department-chapters/`,
      );
      return data.data;
    },
  });

  const { data: chaptersByLevel, isFetching } = useQuery({
    queryKey: ["admin-programmeLevel-chapters"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/superadmin/sgs-chapters/${selectedLevel}/by-programme-level/`,
        );
        return data.data;
      } catch (error) {
        toast.error("Error fetching chapters for the selected level");
        return [];
      }
    },
    enabled: !!selectedLevel,
  });

  const {
    data: departmentChaptersByLevel,
    isFetching: isFetchingDepartmentChapters,
  } = useQuery({
    queryKey: ["depart-programmeLevel-chapters"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/departments/${person?.department.id}/department-chapters/programme-level/${selectedLevel}/`,
        );
        return data.data as any[];
      } catch (error) {
        return [];
      }
    },
    enabled: !!selectedLevel,
  });

  useEffect(() => {
    console.log(selectedLevel);
    queryClient.invalidateQueries({
      queryKey: ["depart-programmeLevel-chapters"],
    });
    queryClient.invalidateQueries({
      queryKey: ["depart-programmeLevel-chapters"],
    });
  }, [selectedLevel]);

  const { isPending: adding, mutateAsync: addingChapter } = useMutation({
    mutationFn: async (values: { chapter: string; label: string }) => {
      try {
        await axios.post(
          `/departments/${person?.department.id}/department-chapters/`,
          {
            custom_title: values.chapter,
            custom_description: values.label,
            programme_level: selectedLevel,
            chapter: editChapter.id,
            department: person?.department.id,
          },
        );
        toast.success("Chapter added successfully");
      } catch (error) {
        toast.error("Error adding chapter");
        return [];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["depart-programmeLevel-chapters"],
      });
      queryClient.invalidateQueries({ queryKey: ["all-department-chapters"] });
    },
  });

  const handleUpdateAdminChapter = async (values) => {
    const confirm = await alert.confirm(
      "Are you sure you want to update this chapter?",
    );
    if (!confirm) return;

    await addingChapter(values);
    setEditChapter(null);
    setDisplayModal(false);
  };

  const { isPending: updating, mutateAsync: updatingChapter } = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: { chapter: string; label: string };
    }) => {
      try {
        await axios.put(
          `/departments/${person?.department.id}/department-chapters/update/${id}/`,
          {
            custom_title: values.chapter,
            custom_description: values.label,
            programme_level: selectedLevel,
            chapter: editChapter.chapter.id,
            department: person?.department.id,
          },
        );
        toast.success("Chapter updated successfully");
      } catch (error) {
        toast.error("Error updating chapter");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["depart-programmeLevel-chapters"],
      });
    },
  });

  const { isPending: deleting, mutateAsync: deletingChapter } = useMutation({
    mutationFn: async (chapterId) => {
      const confirmDelete = await alert.confirm(
        "Are you sure you want to delete this chapter?",
      );
      if (!confirmDelete) {
        throw new Error("User cancelled deletion");
      }
      try {
        await axios.delete(
          `/departments/${person?.department.id}/department-chapters/delete/${chapterId}/`,
        );
      } catch (error) {
        toast.error("Error deleting chapter");
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["depart-programmeLevel-chapters"],
      });
      toast.success("Chapter deleted successfully");
    },
  });

  const formik = useFormik({
    initialValues: {
      chapter: "",
      label: "",
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      if (departUpdated) {
        await updatingChapter({ id: editChapter.id, values });
        resetForm();
        setSubmitting(false);
        setDisplayModal(false);
        setDepartUpdated(false);
        return;
      }
      await handleUpdateAdminChapter(values);
      resetForm();
      setSubmitting(false);
      setDisplayModal(false);
      return;
    },
  });

  const onCloseModal = () => {
    setDisplayModal(false);
    setEditChapter(null);
  };

  // const orderChapters = (): any[] => {
  //   return chaptersByLevel?.sort((a, b) => a.name.localeCompare(b.name));
  // };

  const departmentChapterUpdate = (chapterId: string) => {
    console.log("departmentChaptersByLevel", allChapters);
    const update = allChapters?.find(
      (deptChapter) => deptChapter.chapter?.id === chapterId,
    );
    console.log("update", update);
    return update;
  };

  return (
    <div>
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200">
        <div className="bg-white mb-6">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 mb-4">
            Chapters for Level of Programme
          </h3>
          <div className="mb-4">
            <label className="  font-semibold text-blue-900 mb-2 block">
              Select Level of Programme
            </label>
            <CustomSelect
              options={allLevels?.map((level) => ({
                label: level.name,
                value: level.id,
              }))}
              value={selectedLevel}
              onChange={(option) => setSelectedLevel(option?.value || "")}
              placeholder="Select level of Programme"
              isClearable={true}
            />
          </div>
          {/* <SolidButton
            title="Create"
            onClick={() => {
              setDisplayModal(true);
            }}
            className="py-1.5 mt-2"
            disabled={!selectedLevel}
          /> */}
        </div>

        <div>
          <table className="w-full">
            <thead className="sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-600 bg-blue-50 px-4 py-3">
                  Title
                </th>
                <th className="text-center text-sm font-medium text-gray-600 bg-blue-50 px-4 py-3">
                  Department Update
                </th>
                <th className="text-center text-sm font-medium text-gray-600 bg-blue-50 px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!selectedLevel ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {fetchProgrammeLevels
                      ? "Loading..."
                      : "Select a level of programme to view chapters"}
                  </td>
                </tr>
              ) : isFetching ? (
                <tr>
                  <td
                    colSpan={5}
                    className="w-full flex justify-center items-center text-center py-8 text-gray-500"
                  >
                    <Loader2Icon className="animate-spin mr-2 text-ug-blue" />
                    Loading chapters...
                  </td>
                </tr>
              ) : (
                chaptersByLevel?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No chapters found for the selected level of programme
                    </td>
                  </tr>
                )
              )}
              {chaptersByLevel?.length > 0 &&
                selectedLevel &&
                !isFetching &&
                orderChapters(chaptersByLevel)?.map((chapter, index) => {
                  const customChapter = departmentChapterUpdate(chapter.id);

                  return (
                    <>
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="text-sm text-gray-800 py-3 px-4 font-medium">
                          Chapter {chapter.name} - {chapter.description}
                        </td>

                        <td className="text-sm text-gray-800 py-3 px-4 text-center">
                          {isFetchingDepartmentChapters ? (
                            <Loader2Icon className="animate-spin mr-2 text-ug-blue" />
                          ) : customChapter ? (
                            <span className="text-blue-800 ">
                              Chapter {customChapter.custom_title} -{" "}
                              {customChapter.custom_description}
                            </span>
                          ) : (
                            <span className="text-gray-600 font-medium">
                              Not Updated
                            </span>
                          )}
                        </td>

                        <td className="text-sm py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <SolidButton
                              title="Edit"
                              className="py-1 px-2 text-xs"
                              onClick={() => {
                                if (customChapter) {
                                  setEditChapter(customChapter);
                                  setDepartUpdated(true);
                                  formik.setValues({
                                    chapter: customChapter.custom_title,
                                    label: customChapter.custom_description,
                                  });
                                } else {
                                  setEditChapter(chapter);
                                  formik.setValues({
                                    chapter: chapter.name,
                                    label: chapter.description,
                                  });
                                }
                                setDisplayModal(true);
                              }}
                              Icon={<Edit size={15} />}
                            />

                            {customChapter && (
                              <button
                                className="py-1 px-2 text-gray-50 text-lg bg-red-500 cursor-pointer rounded-md hover:bg-red-500/60 transition-colors"
                                onClick={() => {
                                  deletingChapter(customChapter.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      {displayModal && (
        <Modal
          headTitle={editChapter ? "Edit Chapter" : "Create Chapter"}
          subHeadTitle={`${
            editChapter ? `Modify the ${editChapter.value}` : "Create chapter"
          } for the selected level of programme`}
          handleConfirm={() => {}}
          handleCancel={() => onCloseModal()}
          buttonDisabled={false}
          w="max-w-lg"
        >
          <div>
            {editChapter && (
              <p>
                Editing <span className="font-bold">{editChapter?.label}</span>
              </p>
            )}

            <div>
              <div className="mt-4">
                <AppInput
                  name="chapter"
                  placeholder="eg. 1"
                  label="Chapter Number"
                  formik={formik}
                  disabled={true}
                />
              </div>

              <div className="mt-4">
                <AppInput
                  name="label"
                  placeholder="eg. Introduction"
                  label="Label"
                  formik={formik}
                />
              </div>
            </div>
          </div>

          <div className=" mt-3 flex justify-end">
            <SolidButton
              title={editChapter ? "Save Changes" : "Create"}
              onClick={() => {
                formik.handleSubmit();
              }}
              className="py-1.5 mt-4"
              Icon={
                formik.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )
              }
              disabled={formik.isSubmitting}
            />
            <OutlineButton
              title="Cancel"
              onClick={() => onCloseModal()}
              className="py-1.5 mt-4 ml-2"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentChapters;
