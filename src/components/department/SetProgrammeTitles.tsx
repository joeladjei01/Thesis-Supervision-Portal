import { useRef, useState } from "react";
import toast from "react-hot-toast";
import SolidButton from "../shared/buttons/SolidButton";
import { Edit, PlusCircle, Trash2, Search, Loader2, Copy } from "lucide-react";
import Modal from "../../layouts/Modal";
import { useFormik } from "formik";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDepartmentDataStore } from "../../store/useDepartmentDataStore";
import { inputStyles } from "../../utils/helpers";

const SetProgrammeTitles = () => {
  const queryClient = useQueryClient();
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState<string>("");
  const axios = useAxiosPrivate();
  const programTitles = useDepartmentDataStore((state) => state.programTitles);
  const person = userStore((state) => state.person);

  const handleCreateProgramTitles = async () => {
    if (selectedTitle) {
      const alreadyExists = programTitles.find(
        (t) => t.program_name === selectedTitle,
      );
      if (alreadyExists) {
        toast.error(`${alreadyExists.program_name} already added`);
        return;
      }
    }

    try {
      const { data } = await axios.post(`/departments/programs/create/`, {
        program_name: customTitle,
        department: person.department.id,
      });
      console.log(data);
      toast.success("Program title added successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-program-titles"] });
      setSelectedTitle("");
      setCustomTitle("");
    } catch (error) {
      toast.error("Error adding program title");
      throw new Error("Error adding program title");
    }
  };

  const { mutate: onAdd, isPending: addingProg } = useMutation({
    mutationFn: async () => {
      if (customTitle.trim() === "") {
        toast.error("Title cannot be empty");
        return;
      }
      return await handleCreateProgramTitles();
    },
  });

  const handleUpdateProgramTitles = async () => {
    try {
      const { data } = await axios.put(
        `/departments/programs/${editTitle.current.id}/update/`,
        {
          program_name: editTitle.current.program_name,
        },
      );
      console.log(data);
      setIsModalOpen(false);
      setEditTitle(null);
    } catch (error) {
      // toast.error("Error updating program title");
      console.error("Error updating program title", error);
    }
  };

  const { mutate: onUpdate, isPending: updatingProg } = useMutation({
    mutationFn: handleUpdateProgramTitles,
    onSuccess: () => {
      setIsModalOpen(false);
      toast.success("Program title updated successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-program-titles"] });
      setEditTitle(null);
    },
    onError: (error) => {
      toast.success("Program title updated successfully");
      queryClient.invalidateQueries({ queryKey: ["fetch-program-titles"] });
      setIsModalOpen(false);
      setEditTitle(null);
    },
  });

  // const [editTitle, setEditTitle] = useState<any>(null);
  const editTitle = useRef<any>(null);

  const setEditTitle = (value) => {
    editTitle.current = value;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEditTitle = (updatedTitle) => {
    queryClient.invalidateQueries({ queryKey: ["fetch-program-titles"] });
    setIsModalOpen(false);
    updateFormik.resetForm();
    setEditTitle(null);
  };

  const filteredTitles = programTitles.filter((title) =>
    // title.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    title.program_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const initialValues = {
    // label: editTitle.current !== null ? editTitle.current.label : '',
    title: editTitle.current ? editTitle.current.programme_name : "",
  };

  const updateFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      handleEditTitle(values);
    },
  });

  return (
    <>
      <div className="bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-6 mb-8 transition-all duration-300">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
          Programme Titles
        </h3>

        <div className="flex flex-col sm:flex-row items-center w-full gap-3 mb-8">
          <div className="w-full relative group">
            <input
              type="text"
              className={`${inputStyles} w-full pl-4 pr-4 py-2.5 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none`}
              placeholder="Enter program title (e.g., Computer Engineering)"
              value={customTitle}
              onChange={(e) => {
                setCustomTitle(e.target.value);
              }}
            />
          </div>

          <SolidButton
            title={!addingProg && "Add Title"}
            disabled={addingProg}
            className="w-full sm:w-auto h-fit py-2.5 px-6 shadow-md shadow-blue-500/10"
            Icon={
              addingProg ? <Loader2 className="animate-spin w-4 h-4" /> : <PlusCircle className="w-4 h-4" />
            }
            onClick={() => onAdd()}
          />
        </div>

        <div className="mt-8">
          <div className="relative flex gap-3 items-center mb-4 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search existing titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputStyles} pl-11 pr-4 py-2.5 w-full bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-sm dark:text-white transition-all outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>
          
          <div className="max-h-[500px] border border-gray-200 dark:border-border rounded-2xl overflow-hidden shadow-inner">
            <div className="overflow-y-auto max-h-[500px]">
              {filteredTitles.length > 0 ? (
                <table className="w-full transition-colors">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 dark:bg-secondary/10 border-b border-gray-200 dark:border-border">
                      <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                        Title
                      </th>
                      <th className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-border bg-white dark:bg-card">
                    {filteredTitles.map((title) => (
                      <tr 
                        key={title.id} 
                        className="hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors group"
                      >
                        <td className="text-sm font-medium text-gray-800 dark:text-gray-200 px-6 py-4">
                          {title.program_name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <SolidButton
                              title={"Edit"}
                              className="py-1.5 px-4 text-xs font-bold shadow-sm"
                              onClick={() => {
                                setEditTitle(title);
                                setIsModalOpen(true);
                              }}
                              Icon={<Edit className="h-3.5 w-3.5" />}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-20 bg-gray-50/50 dark:bg-secondary/5">
                  <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 dark:text-gray-500 font-medium italic">
                    No programme titles found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          headTitle="Update Programme Title"
          subHeadTitle={`Current: ${editTitle.current?.program_name}`}
          buttonDisabled={false}
          handleConfirm={() => {}}
          handleCancel={() => {
            setIsModalOpen(false);
            setEditTitle(null);
          }}
          w="max-w-2xl"
        >
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                New Program Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter title (e.g., Computer Engineering)"
                value={editTitle.current ? editTitle.current.program_name : ""}
                onChange={(e) => {
                  const updatedValue = e.target.value;
                  setEditTitle({
                    ...editTitle.current,
                    program_name: updatedValue,
                  });
                  updateFormik.setFieldValue("title", updatedValue);
                }}
                className="w-full px-4 py-3 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-border">
              <SolidButton
                type={"submit"}
                title={updatingProg ? "Updating..." : "Update Title"}
                className="py-2.5 px-8 text-sm font-bold shadow-lg active:scale-95 transition-all"
                disabled={updatingProg}
                Icon={
                  updatingProg ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
                onClick={() => onUpdate()}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
export default SetProgrammeTitles;
