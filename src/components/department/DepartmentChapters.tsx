import { useEffect, useState } from "react";
import CustomSelect from "../shared/custom-select";
import SolidButton from "../shared/buttons/SolidButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Edit, Loader2, Loader2Icon, Save, Trash2 } from "lucide-react";
import Modal from "../../layouts/Modal";
import OutlineButton from "../shared/buttons/OutlineButton";
import { useFormik } from "formik";
import AppInput from "../shared/input/AppInput";
import useAlert from "../../hooks/useAlert";
import userStore from "../../store";
import { orderChapters } from "../../utils/helpers";

interface DepartmentChaptersProps {
  allLevels: any[];
  fetchProgrammeLevels: boolean;
}

const DepartmentChapters = ({ allLevels, fetchProgrammeLevels }: DepartmentChaptersProps) => {
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
    queryKey: ["admin-programmeLevel-chapters", selectedLevel],
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
    isFetching: isFetchingDepartmentChapters,
  } = useQuery({
    queryKey: ["depart-programmeLevel-chapters", selectedLevel],
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
    if (selectedLevel) {
      queryClient.invalidateQueries({
        queryKey: ["depart-programmeLevel-chapters", selectedLevel],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-programmeLevel-chapters", selectedLevel],
      });
    }
  }, [selectedLevel, queryClient]);

  const { mutateAsync: addingChapter } = useMutation({
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
        queryKey: ["depart-programmeLevel-chapters", selectedLevel],
      });
      queryClient.invalidateQueries({ queryKey: ["all-department-chapters"] });
    },
  });

  const handleUpdateAdminChapter = async (values : any) => {
    const confirm = await alert.confirm(
      "Are you sure you want to update this chapter?",
    );
    if (!confirm) return;

    await addingChapter(values);
    setEditChapter(null);
    setDisplayModal(false);
  };

  const { mutateAsync: updatingChapter } = useMutation({
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
        queryKey: ["depart-programmeLevel-chapters", selectedLevel],
      });
      queryClient.invalidateQueries({ queryKey: ["all-department-chapters"] });
    },
  });

  const { mutateAsync: deletingChapter } = useMutation({
    mutationFn: async (chapterId) => {
      const confirmDelete = await alert.confirm(
        "Are you sure you want to delete this depth chapter modification?",
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
        queryKey: ["depart-programmeLevel-chapters", selectedLevel],
      });
      await queryClient.invalidateQueries({ queryKey: ["all-department-chapters"] });
      toast.success("Modification deleted successfully");
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

  const departmentChapterUpdate = (chapterId: string) => {
    const update = allChapters?.find(
      (deptChapter: any) => deptChapter.chapter?.id === chapterId && deptChapter.programme_level === selectedLevel
    );
    return update;
  };

  return (
    <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-border transition-all duration-300">
      <div className="mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
          Programme Chapter Customization
        </h3>
        
        <div className="bg-gray-50 dark:bg-secondary/5 p-6 rounded-2xl border border-gray-100 dark:border-border">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 block">
            Select Programme Level
          </label>
          <CustomSelect
            options={allLevels?.map((level: any) => ({
              label: level.name,
              value: level.id,
            }))}
            value={selectedLevel}
            onChange={(option) => setSelectedLevel(option || "")}
            placeholder="Choose a programme level to customize its chapters..."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-border overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-secondary/10 border-b border-gray-200 dark:border-border">
                <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                  Standard Chapter
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                  Departmental Override
                </th>
                <th className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-border bg-white dark:bg-card">
              {!selectedLevel ? (
                <tr>
                  <td colSpan={3} className="text-center py-20 bg-gray-50/50 dark:bg-secondary/5">
                    <BookOpen className="h-10 w-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 dark:text-gray-500 font-medium italic">
                      {fetchProgrammeLevels ? "Loading levels..." : "Select a programme level to view and customize chapters"}
                    </p>
                  </td>
                </tr>
              ) : isFetching ? (
                <tr>
                  <td colSpan={3} className="text-center py-20 bg-gray-50/50 dark:bg-secondary/5">
                    <Loader2Icon className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 dark:text-gray-500 italic">Fetching chapters...</p>
                  </td>
                </tr>
              ) : chaptersByLevel?.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-20 bg-gray-50/50 dark:bg-secondary/5">
                    <p className="text-gray-400 dark:text-gray-500 font-medium italic">No default chapters found for this level.</p>
                  </td>
                </tr>
              ) : (
                orderChapters(chaptersByLevel)?.map((chapter, index) => {
                  const customChapter = departmentChapterUpdate(chapter.id);
                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-1">
                            Chapter {chapter.name}
                          </span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {chapter.description}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {isFetchingDepartmentChapters ? (
                          <Loader2Icon className="h-4 w-4 animate-spin text-blue-500" />
                        ) : customChapter ? (
                          <div className="flex flex-col border-l-2 border-emerald-500/30 pl-3">
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                              Override Active
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                              {customChapter.custom_description}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Using system default</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <SolidButton
                            title="Edit"
                            className="py-1.5 px-4 text-xs font-bold shadow-sm"
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
                            Icon={<Edit size={14} />}
                          />

                          {customChapter && (
                            <button
                              title="Delete Override"
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all border border-transparent hover:border-red-200"
                              onClick={() => deletingChapter(customChapter.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {displayModal && (
        <Modal
          headTitle={departUpdated ? "Update Override" : "Create Override"}
          subHeadTitle={editChapter ? `Customizing Chapter ${editChapter.custom_title || editChapter.name}` : ""}
          handleConfirm={() => {}}
          handleCancel={() => onCloseModal()}
          buttonDisabled={false}
          w="max-w-lg"
        >
          {editChapter && (
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest mb-1">System Default</p>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 italic">
                  {departUpdated ? editChapter.chapter?.description : editChapter.description}
                </p>
              </div>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <AppInput
                    name="chapter"
                    placeholder="1"
                    label="Number"
                    formik={formik}
                    disabled={true}
                  />
                </div>
                <div className="col-span-3">
                  <AppInput
                    name="label"
                    placeholder="Custom Title..."
                    label="Custom Description"
                    formik={formik}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-border">
              <OutlineButton
                title="Discard"
                onClick={onCloseModal}
                className="py-2.5 px-6"
              />
              <SolidButton
                title={formik.isSubmitting ? "Saving..." : "Apply Override"}
                onClick={() => formik.handleSubmit()}
                className="py-2.5 px-8 text-sm font-bold shadow-lg"
                Icon={
                  formik.isSubmitting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Save size={16} />
                  )
                }
                disabled={formik.isSubmitting}
              />
            </div>
          </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DepartmentChapters;
