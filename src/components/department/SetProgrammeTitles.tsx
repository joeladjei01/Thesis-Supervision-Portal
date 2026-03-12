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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-md  font-bold text-gray-500 mb-4">
          Programme Titles
        </h3>

        <div className="flex flex-col sm:flex-row justify-center w-full gap-2">
          <div className="w-full">
            <div className="flex">
              <input
                type="text"
                className={`${inputStyles} w-full px-3 py-2`}
                placeholder="Enter program title to be added. eg. Computer Engineering"
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                }}
              />
            </div>
          </div>

          <SolidButton
            title={!addingProg && "Add"}
            disabled={addingProg}
            className="w-fit h-fit py-1.5"
            Icon={
              addingProg ? <Loader2 className="animate-spin" /> : <PlusCircle />
            }
            onClick={() => onAdd()}
          />
        </div>

        <div className="mt-3">
          <div className="relative flex gap-3 items-center mb-2">
            {/* <button
              onClick={() => fetchTitles()}
            >
              <RefreshCcw className={`${fetchingProg ? "animate-spin" : ""}  text-gray-500`} />
            </button> */}
            <input
              type="text"
              placeholder="Search titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputStyles} px-3 pl-12 py-2 w-full`}
            />
            <Search className="absolute left-3 top-2 text-gray-400" />
          </div>
          <div className="max-h-120 border-2 border-gray-300 rounded-xl overflow-y-auto">
            {filteredTitles.length > 0 ? (
              <table className="w-full rounded ">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-sm font-medium text-gray-600 bg-blue-50 px-2 py-3">
                      Title
                    </th>
                    {/* <th className="text-left text-sm font-medium text-gray-600 bg-blue-50 px-2 py-3">Label</th> */}
                    <th className="text-center text-sm font-medium text-gray-600 bg-blue-50 px-2 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTitles.map((title) => (
                    <tr key={title.value} className="border-b border-gray-200">
                      <td className="text-sm text-gray-800 py-3 px-2">
                        {title.program_name}
                      </td>
                      {/* <td className="text-sm text-gray-800 py-3 px-2">{title.label}</td> */}
                      <td className="text-sm flex gap-2 justify-center text-gray-800 py-3 px-2">
                        {/* <OutlineButton 
                        Icon={<Trash2 className="h-5 w-5" />}
                        title=""
                        className="py-1 px-1"
                        onClick={()=>{}}
                        onClick={() => setProgramTitles(programTitles.filter(t => t.value !== title.value))}
                      /> */}
                        <SolidButton
                          title={"Edit"}
                          className="py-1.5"
                          onClick={() => {
                            setEditTitle(title);
                            console.log(title);
                            console.log(editTitle);
                            setIsModalOpen(true);
                          }}
                          Icon={<Edit className="h-4 w-4" />}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No prgramme titles found.
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          headTitle="Update Programme Titles"
          subHeadTitle=""
          buttonDisabled={false}
          handleConfirm={() => {}}
          handleCancel={() => {
            setIsModalOpen(false);
            setEditTitle(null);
          }}
          w="max-w-2xl"
        >
          <div className="p-4">
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={editTitle.current ? editTitle.current.program_name : ""}
              onChange={(e) => {
                const updatedValue = e.target.value;
                setEditTitle({
                  ...editTitle.current,
                  program_name: updatedValue,
                });
                updateFormik.setFieldValue("title", updatedValue);
              }}
              className="py-2 w-full px-3 border-1 border-gray-300 rounded-md  focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600"
            />
            <SolidButton
              type={"submit"}
              title={!updatingProg && "Update Title"}
              className="mt-4 py-2"
              disabled={updatingProg}
              Icon={
                updatingProg ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Edit className="h-4 w-4" />
                )
              }
              onClick={() => onUpdate()}
            />
          </div>
        </Modal>
      )}
    </>
  );
};
export default SetProgrammeTitles;
