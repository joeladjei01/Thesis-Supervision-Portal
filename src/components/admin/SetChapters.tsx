import { useEffect, useState } from "react";
import CustomSelect from "../shared/custom-select";
import SolidButton from "../shared/buttons/SolidButton";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderChapters } from "../../utils/helpers";
import { Edit, Loader2, Loader2Icon, Save, Trash2 } from "lucide-react";
import Modal from "../../layouts/Modal";
import OutlineButton from "../shared/buttons/OutlineButton";
import { useFormik } from "formik";
import AppInput from "../shared/input/AppInput";
import useAlert from "../../hooks/useAlert";
import * as Yup from "yup";

const SetChapters = ({
  allLevels,
  fetchProgrammeLevels,
}: {
  allLevels: any[];
  fetchProgrammeLevels: boolean;
}) => {
  const queryClient = useQueryClient();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [editChapter, setEditChapter] = useState<any>(null);
  const alert = useAlert();

  const axios = useAxiosPrivate();

  const { data: chaptersByLevel, isFetching } = useQuery({
    queryKey: ["programmeLevel-chapters", selectedLevel],
    queryFn: async () => {
      const { data }: any = await axios.get(
        `/superadmin/sgs-chapters/${selectedLevel}/by-programme-level/`,
      );
      return data.data;
    },
    enabled: !!selectedLevel,
  });

  useEffect(() => {
    if (selectedLevel) {
      queryClient.invalidateQueries({
        queryKey: ["programmeLevel-chapters", selectedLevel],
      });
    }
  }, [selectedLevel, queryClient]);

  const { isPending: adding, mutateAsync: addingChapter } = useMutation({
    mutationFn: async (values: { chapter: string; label: string }) => {
      try {
        await axios.post("/superadmin/sgs-chapters/", {
          name: values.chapter,
          description: values.label,
          programme_level: selectedLevel,
        });
        await queryClient.invalidateQueries({
          queryKey: ["programmeLevel-chapters", selectedLevel],
        });
        toast.success("Chapter added successfully");
      } catch (error) {
        toast.error("Error adding chapter");
      }
    },
  });

  const { isPending: updating, mutateAsync: updatingChapter } = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: { chapter: string; label: string };
    }) => {
      try {
        await axios.put(`/superadmin/sgs-chapters/${id}/`, {
          name: values.chapter,
          description: values.label,
          programme_level: selectedLevel,
        });
        queryClient.invalidateQueries({
          queryKey: ["programmeLevel-chapters", selectedLevel],
        });
        toast.success("Chapter updated successfully");
      } catch (error) {
        toast.error("Error updating chapter");
      }
    },
  });

  const { mutateAsync: deletingChapter } = useMutation({
    mutationFn: async (chapterId: string) => {
      const confirmDelete = await alert.confirm(
        "Are you sure you want to delete this chapter?",
      );
      if (!confirmDelete) {
        throw new Error("User cancelled deletion");
      }
      try {
        await axios.delete(`/superadmin/sgs-chapters/${chapterId}/`);
      } catch (error) {
        toast.error("Error deleting chapter");
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["programmeLevel-chapters", selectedLevel],
      });
      toast.success("Chapter deleted successfully");
    },
  });

  const formik = useFormik({
    initialValues: {
      chapter: "",
      label: "",
    },
    validationSchema: Yup.object().shape({
      chapter: Yup.number()
        .typeError("Chapter must be a number")
        .required("Chapter number is required"),
      label: Yup.string().required("Label is required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      if (editChapter) {
        await updatingChapter({ id: editChapter.id, values });
        resetForm();
        setSubmitting(false);
        setEditChapter(null);
        setDisplayModal(false);
      } else {
        await addingChapter(values);
        resetForm();
        setSubmitting(false);
        setDisplayModal(false);
      }
    },
  });

  const onCloseModal = () => {
    setDisplayModal(false);
    setEditChapter(null);
    formik.resetForm();
  };

  return (
    <div>
      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <div className="mb-6">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Chapters for Level of Programme
          </h3>
          <div className="mb-4">
            <label className=" text-blue-900 dark:text-blue-400 mb-2 block font-medium">
              Select Level of Programme
            </label>
            <CustomSelect
              options={allLevels?.map((level: any) => ({
                label: level.name,
                value: level.id,
              }))}
              value={selectedLevel}
              onChange={(option: any) => setSelectedLevel(option || "")}
              placeholder="Select level of Programme"
            />
          </div>
          <SolidButton
            title="Create"
            onClick={() => {
              setDisplayModal(true);
            }}
            className="py-1.5 mt-2"
            disabled={!selectedLevel}
            Icon={adding ? <Loader2 className="animate-spin" /> : null}
          />
        </div>

        <div className="max-h-96 border border-gray-300 dark:border-border rounded-xl custom-scrollbar overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-200 dark:border-border">
                <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                  Title
                </th>
                <th className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {!selectedLevel ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {fetchProgrammeLevels
                      ? "Loading..."
                      : "Select a level of programme to view chapters"}
                  </td>
                </tr>
              ) : isFetching ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex justify-center items-center">
                    <Loader2Icon className="animate-spin mr-2 text-ug-blue dark:text-blue-400" />
                    Loading chapters...
                    </div>
                  </td>
                </tr>
              ) : (
                chaptersByLevel?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No chapters found for the selected level of programme
                    </td>
                  </tr>
                )
              )}
              {chaptersByLevel?.length > 0 &&
                !isFetching &&
                orderChapters(chaptersByLevel)?.map((chapter, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-secondary/10 transition-colors"
                  >
                    <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4 font-medium">
                      Chapter {chapter.name} - {chapter.description}
                    </td>

                    <td className="text-sm py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <SolidButton
                          title="Edit"
                          className="py-1 px-2 text-xs"
                          onClick={() => {
                            setEditChapter(chapter);
                            formik.setValues({
                              chapter: chapter.name,
                              label: chapter.description,
                            });
                            setDisplayModal(true);
                          }}
                          Icon={<Edit size={15} />}
                        />

                        <button
                          className="py-1 px-2 text-gray-50 text-lg bg-red-500 cursor-pointer rounded-md hover:bg-red-500/60 transition-colors disabled:opacity-50"
                          onClick={() => {
                            deletingChapter(chapter.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {displayModal && (
        <Modal
          headTitle={editChapter ? "Edit Chapter" : "Create Chapter"}
          subHeadTitle={`${
            editChapter ? `Modify the ${editChapter.name}` : "Create chapter"
          } for the selected level of programme`}
          handleConfirm={() => {}}
          handleCancel={() => onCloseModal()}
          buttonDisabled={false}
          w="max-w-lg"
        >
          <div className="text-gray-800 dark:text-gray-200">
            {editChapter && (
              <p className="mb-4">
                Editing <span className="font-bold text-blue-900 dark:text-blue-400">{editChapter?.description}</span>
              </p>
            )}

            <div className="space-y-4">
              <AppInput
                name="chapter"
                placeholder="eg. 1"
                label="Chapter Number"
                formik={formik}
                className="dark:bg-secondary/5 dark:border-border dark:text-gray-200"
              />

              <AppInput
                name="label"
                placeholder="eg. Introduction"
                label="Label"
                formik={formik}
                className="dark:bg-secondary/5 dark:border-border dark:text-gray-200"
              />
            </div>
          </div>

          <div className=" mt-6 flex justify-end gap-3">
            <OutlineButton
              title="Cancel"
              onClick={() => onCloseModal()}
              className="py-1.5"
              disabled={formik.isSubmitting}
            />
            <SolidButton
              title={editChapter ? "Save Changes" : "Create"}
              onClick={() => {
                formik.handleSubmit();
              }}
              className="py-1.5"
              Icon={
                formik.isSubmitting || updating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )
              }
              disabled={formik.isSubmitting || updating}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SetChapters;
