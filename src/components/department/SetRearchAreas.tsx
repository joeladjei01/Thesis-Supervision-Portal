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
      <div className="bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-6 mb-8 transition-all duration-300">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">
          Research Areas
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mb-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search existing research areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-sm dark:text-white transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <SolidButton
            title="Add New Area"
            className="w-full md:w-auto py-2.5 px-6 shadow-md shadow-blue-500/10"
            Icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              setDisplayModal(true);
            }}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-border overflow-hidden shadow-inner">
          <div className="overflow-x-auto">
            {researchAreas.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-secondary/10 border-b border-gray-200 dark:border-border">
                    <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                      Research Area
                    </th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-border bg-white dark:bg-card">
                  {researchAreas
                    .filter((area) =>
                      area.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((area, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors group"
                      >
                        <td className="text-sm font-medium text-gray-800 dark:text-gray-200 px-6 py-4">
                          {area.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <OutlineButton
                              Icon={<Trash2 className="h-4 w-4" />}
                              title=""
                              className="py-1.5 px-2 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 hover:border-red-200 transition-all"
                              onClick={() => handleRemoveResearchArea(area.id)}
                            />
                            <SolidButton
                              Icon={<Edit className="h-4 w-4" />}
                              title="Edit"
                              className="py-1.5 px-4 text-xs font-bold"
                              onClick={() => {
                                onEditClick(area);
                                setDisplayModal(true);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 bg-gray-50/50 dark:bg-secondary/5">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 dark:text-gray-500 font-medium italic">
                  No research areas found.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {displayModal && (
        <Modal
          headTitle={editArea ? "Edit Research Area" : "Add Research Area"}
          subHeadTitle={editArea ? `Modifying: ${editArea.name}` : "Create a new research area for your department"}
          handleCancel={handleCancel}
          buttonDisabled
          handleConfirm={() => {}}
          w="max-w-lg"
        >
          <div className="p-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <AppInput
                  name="name"
                  label="Research Area Name"
                  formik={formik}
                  type="text"
                  placeholder="e.g., Artificial Intelligence"
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                    placeholder="Provide a brief description of this research area..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-[10px] mt-1 ml-1">{formik.errors.description}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-border">
                <OutlineButton
                  title="Cancel"
                  onClick={handleCancel}
                  className="py-2.5 px-6"
                />
                <SolidButton
                  title={editArea ? "Save Changes" : "Create Area"}
                  Icon={
                    onUpdating || onAdding ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )
                  }
                  type="submit"
                  disabled={onUpdating || onAdding}
                  className="py-2.5 px-8 text-sm font-bold shadow-lg"
                />
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SetRearchAreas;
