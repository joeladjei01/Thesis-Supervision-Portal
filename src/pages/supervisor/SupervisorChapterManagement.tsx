import OutlineButton from "../../components/shared/buttons/OutlineButton";
import useAlert from "../../hooks/useAlert";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit, Loader2, Loader2Icon, Save, Trash2 } from "lucide-react";
import SolidButton from "../../components/shared/buttons/SolidButton";
import AppInput from "../../components/shared/input/AppInput";
import Modal from "../../layouts/Modal";
import CustomSelect from "../../components/shared/custom-select";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import Header from "../../components/shared/text/Header";

const SupervisorChapterManagement = () => {
  const queryClient = useQueryClient();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [editChapter, setEditChapter] = useState<any>(null);
  const [departUpdated, setDepartUpdated] = useState<boolean>(false);
  const alert = useAlert();
  const { person, userInfo } = userStore();
  const axios = useAxiosPrivate();
  const { programmeLevels: allLevels } = useSupervisorDataStore();

  const { data: SuperChaptersByLevel, isLoading: isLoadingSuperChapters } =
    useQuery({
      queryKey: ["super-programmeLevel-chapters"],
      queryFn: async () => {
        try {
          const { data }: any = await axios.get(
            `/supervisors/supervisor-chapter/by-programme-level/${person.id}/${selectedLevel}/`,
          );
          return data.data;
        } catch (error) {
          return [];
        }
      },
      enabled: !!selectedLevel,
    });

  const { data: chaptersByLevel, isLoading: isSgsLoading } = useQuery({
    queryKey: ["programmeLevel-chapters"],
    queryFn: async () => {
      const { data }: any = await axios.get(
        `/superadmin/sgs-chapters/${selectedLevel}/by-programme-level/`,
      );
      return data.data;
    },
    enabled: !!selectedLevel,
  });

  const {
    data: departmentChaptersByLevel,
    isLoading: isFetchingDepartmentChapters,
  } = useQuery({
    queryKey: ["depart-programmeLevel-chapters"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/departments/${userInfo?.department_id?.department.id}/department-chapters/programme-level/${selectedLevel}/`,
        );
        return data.data;
      } catch (error) {
        return [];
      }
    },
    enabled: !!selectedLevel,
  });

  useEffect(() => {
    console.log("selectedLevel", selectedLevel);
    queryClient.invalidateQueries({
      queryKey: ["depart-programmeLevel-chapters"],
    });
    queryClient.invalidateQueries({
      queryKey: ["programmeLevel-chapters"],
    });
    queryClient.invalidateQueries({
      queryKey: ["super-programmeLevel-chapters"],
    });
  }, [selectedLevel]);

  const { isPending: adding, mutateAsync: addingChapter } = useMutation({
    mutationFn: async (values: { chapter: string; label: string }) => {
      try {
        await axios.post(`/supervisors/supervisor-chapter/`, {
          custom_title: values.chapter,
          custom_description: values.label,
          programme_level: selectedLevel,
          chapter: editChapter.id,
          supervisor: person?.id,
        });
        toast.success("Chapter added successfully");
      } catch (error) {
        toast.error("Error adding chapter");
        return [];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["super-programmeLevel-chapters"],
      });
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
        await axios.put(`/supervisors/supervisor-chapter/${id}/`, {
          custom_title: values.chapter,
          custom_description: values.label,
          programme_level: selectedLevel,
          chapter: editChapter.chapter.id,
          supervisor: person?.id,
        });
        toast.success("Chapter updated successfully");
      } catch (error) {
        toast.error("Error updating chapter");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["super-programmeLevel-chapters"],
      });
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

  const orderChapters = (): any[] => {
    return departmentChaptersByLevel?.sort((a: any, b: any) =>
      a.custom_title.localeCompare(b.custom_title),
    );
  };

  const supervisorChapterUpdate = (chapterId: string) => {
    const update = SuperChaptersByLevel?.find(
      (superChapter: any) => superChapter.chapter.id === chapterId,
    );
    console.log("update", update);
    if (update) return update;
    return null;
  };

  const onEditChapter = (chapter: any, customChapter: any) => {
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
        chapter: chapter.custom_title,
        label: chapter.custom_description,
      });
    }
    setDisplayModal(true);
  };

  return (
    <div>
      <Header
        title="Chapter Management"
        subtitle="Set chapters to be assign to a student"
      />
      <div className="bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-border">
        <div className="bg-card mb-6">
          <h3 className="text-lg font-cal-sans tracking-wide text-muted-foreground mb-4">
            Chapters for Programme Level
          </h3>
          <div className="mb-4">
            <label className="font-semibold text-primary mb-2 block">
              Select Programme Level
            </label>
            <CustomSelect
              options={allLevels?.map((level) => ({
                label: level.name,
                value: level.id,
              }))}
              value={selectedLevel}
              onChange={(option) => setSelectedLevel(option || "")}
              placeholder="Select level of Programme"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="sticky top-0">
              <tr className="border-b border-border">
                <th className="text-left text-sm font-semibold text-muted-foreground bg-muted px-4 py-3">
                  Department Chapters
                </th>
                <th className="text-center text-sm font-semibold text-muted-foreground bg-muted px-4 py-3">
                  Your Update
                </th>
                <th className="text-center text-sm font-semibold text-muted-foreground bg-muted px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!selectedLevel ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    {isSgsLoading
                      ? "Loading..."
                      : "Select a level of programme to view chapters"}
                  </td>
                </tr>
              ) : isFetchingDepartmentChapters ? (
                <tr>
                  <td
                    colSpan={5}
                    className="w-full text-center py-8 text-muted-foreground"
                  >
                    <div className="flex justify-center items-center">
                      <Loader2Icon className="animate-spin mr-2 text-primary" />
                      Loading chapters...
                    </div>
                  </td>
                </tr>
              ) : (
                departmentChaptersByLevel?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No chapters found for the selected level of programme
                    </td>
                  </tr>
                )
              )}
              {departmentChaptersByLevel?.length > 0 &&
                !isFetchingDepartmentChapters &&
                selectedLevel &&
                orderChapters()?.map((chapter, index) => {
                  const customChapter = supervisorChapterUpdate(chapter.id);

                  return (
                    <>
                      <tr
                        key={index}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="text-sm text-foreground py-3 px-4 font-medium">
                          {chapter.custom_title} - {chapter.custom_description}
                        </td>

                        <td className="text-sm text-foreground py-3 px-4 text-center">
                          {isLoadingSuperChapters ? (
                            <div className="flex justify-center">
                              <Loader2Icon className="animate-spin text-primary" />
                            </div>
                          ) : customChapter ? (
                            <span className="text-primary dark:text-secondary font-semibold">
                              {customChapter.custom_title} -{" "}
                              {customChapter.custom_description}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Not Updated
                            </span>
                          )}
                        </td>

                        <td className="text-sm py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <SolidButton
                              title="Edit"
                              className="py-1 px-2 text-xs"
                              onClick={() =>
                                onEditChapter(chapter, customChapter)
                              }
                              Icon={<Edit size={15} />}
                            />

                            {/* {customChapter && (
                              <button
                                className="py-1 px-2 text-gray-50 text-lg bg-red-500 cursor-pointer rounded-md hover:bg-red-500/60 transition-colors"
                                onClick={() => {
                                  deletingChapter(customChapter.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )} */}
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
          <div className="space-y-4">
            {editChapter && (
              <p className="text-muted-foreground">
                Editing <span className="font-bold text-foreground">{editChapter?.label}</span>
              </p>
            )}

            <div>
              <div className="mt-4">
                <AppInput
                  name="chapter"
                  placeholder="eg. Chapter 1"
                  label="Chapter"
                  formik={formik}
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

export default SupervisorChapterManagement;
