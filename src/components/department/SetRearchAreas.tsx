import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import React, { useEffect, useState } from "react";
import OutlineButton from "../shared/buttons/OutlineButton";
import SolidButton from "../shared/buttons/SolidButton";
import {
  Copy,
  Edit,
  Loader2,
  PlusCircle,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../layouts/Modal";
import { useFormik } from "formik";
import * as Yup from "yup";
import AppInput from "../shared/input/AppInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDepartmentDataStore } from "../../store/useDepartmentDataStore";
import { FaPaste } from "react-icons/fa";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  description: Yup.string().label("Description"),
});

const SetRearchAreas = () => {
  const { person, userInfo } = userStore();
  const [displayModal, setDisplayModal] = useState(false);
  const [editArea, setEditArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const researchAreas = useDepartmentDataStore((store) => store.researchAreas);
  const queryClient = useQueryClient();

  const axios = useAxiosPrivate();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["department-research-areas"] });
  }, []);

  const handleAddResearchArea = async (values: any) => {
    try {
      const response = await axios.post("/departments/research-areas/", {
        ...values,
        department: person?.department.id,
      });
      queryClient.invalidateQueries({
        queryKey: ["department-research-areas"],
      });
      setDisplayModal(false);
      formik.resetForm();
      toast.success("Research area added successfully.");
    } catch (error) {
      console.error("Error adding research area:", error);
      toast.error("Failed to add research area.");
    }
  };

  const handleUpdateResearchArea = async (values: any) => {
    try {
      const response = await axios.put(
        `/departments/research-areas/${editArea.id}/`,
        {
          ...values,
          department: person?.department.id,
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["department-research-areas"],
      });
      setDisplayModal(false);
      setEditArea(null);
      formik.resetForm();
      toast.success("Research area updated successfully.");
    } catch (error) {
      console.error("Error updating research area:", error);
      toast.error("Failed to update research area.");
    }
  };

  const handleRemoveResearchArea = async (id: string) => {
    try {
      const response = await axios.delete(`/departments/research-areas/${id}/`);
      toast.success("Research area removed successfully.");
      queryClient.invalidateQueries({
        queryKey: ["department-research-areas"],
      });
    } catch (error) {
      console.error("Error removing research area:", error);
      toast.error("Failed to remove research area.");
    }
  };

  const handleCancel = () => {
    setDisplayModal(false);
    setEditArea(null);
    formik.resetForm();
  };

  const { mutate: onfetch, isPending: onfetching } = useMutation({
    mutationFn: async () => {
      queryClient.invalidateQueries({
        queryKey: ["department-research-areas"],
      });
    },
  });
  const { mutate: onAdd, isPending: onAdding } = useMutation({
    mutationFn: handleAddResearchArea,
  });

  const { mutate: onUpdate, isPending: onUpdating } = useMutation({
    mutationFn: handleUpdateResearchArea,
  });

  useEffect(() => {
    onfetch();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: editArea ? editArea.name : "",
      description: editArea ? editArea.description : "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (editArea) {
        onUpdate(values);
      } else {
        onAdd(values);
      }
    },
  });

  const onEditClick = (area: any) => {
    setEditArea(area);
    formik.setValues({
      name: area.name,
      description: area.description,
    });
    setDisplayModal(true);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-md  font-bold text-gray-500 mb-4">
          Research Areas
        </h3>

        <div className="flex flex-col md:flex-row justify-between w-full gap-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search research areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 pl-11 py-2  w-full"
            />
            <Search className="absolute left-3 top-2 text-gray-400" />
          </div>

          <SolidButton
            title="Add"
            className="w-fit py-1.5"
            Icon={<PlusCircle />}
            onClick={() => {
              setDisplayModal(true);
            }}
          />
        </div>

        <div className="rounded-xl border-2 border-gray-300 mt-3 overflow-x-auto">
          {researchAreas.length > 0 ? (
            <table className="w-full  ">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-600 bg-blue-50 px-2 py-3">
                    ID
                  </th>
                  <th className="text-left text-sm font-medium text-gray-600 bg-blue-50 px-2 py-3">
                    Research Area
                  </th>
                  <th className="text-center text-sm font-medium text-gray-600 bg-blue-50 px-2 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {researchAreas
                  .filter((area) =>
                    area.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((area, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {area.id}
                          </code>

                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(area.id);
                              toast.success("ID copied to clipboard!", {
                                icon: <FaPaste className="text-slate-400" />,
                                duration: 2000,
                              });
                            }}
                            className="inline-flex items-center gap-2 hover:bg-gray-200 text-slate-700 rounded-md transition-colors duration-200 font-medium text-sm"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="text-sm text-gray-800 py-3 px-2">
                        {area.name}
                      </td>
                      <td className="text-sm flex justify-center text-gray-800 py-3 px-2">
                        <OutlineButton
                          Icon={<Trash2 className="h-5 w-5" />}
                          title=""
                          className="py-1 px-1"
                          onClick={() => handleRemoveResearchArea(area.id)}
                        />
                        <SolidButton
                          Icon={<Edit className="h-5 w-5" />}
                          title="Edit"
                          className="px-1 ml-2"
                          onClick={() => {
                            onEditClick(area);
                            setDisplayModal(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No research areas found.
            </div>
          )}
        </div>
      </div>

      {displayModal && (
        <Modal
          headTitle="Set Research Areas"
          subHeadTitle=""
          handleCancel={handleCancel}
          buttonDisabled
          handleConfirm={() => {}}
          w="max-w-lg"
        >
          <div>
            <form onSubmit={formik.handleSubmit} className="space-y-3">
              <AppInput
                name="name"
                label=" Research Area Name"
                formik={formik}
                type="text"
              />
              <AppInput
                as="textarea"
                label="Description (Optional)"
                name="description"
                formik={formik}
              />

              <div className="flex w-full justify-end mt-2">
                {editArea ? (
                  <SolidButton
                    title={"Save"}
                    Icon={
                      onUpdating ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Save />
                      )
                    }
                    type="submit"
                    disabled={onUpdating}
                  />
                ) : (
                  <SolidButton
                    title={editArea ? "Save" : "Create"}
                    Icon={
                      onAdding ? <Loader2 className="animate-spin" /> : <Save />
                    }
                    type="submit"
                    disabled={onAdding}
                  />
                )}
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SetRearchAreas;
