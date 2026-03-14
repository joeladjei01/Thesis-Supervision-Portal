import React, { useState } from "react";
import SolidButton from "../shared/buttons/SolidButton";
import { Copy, Edit, Loader2, RefreshCcw, Save, Settings2 } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import userStore from "../../store";
import OutlineButton from "../shared/buttons/OutlineButton";
import Modal from "../../layouts/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  changedQuota: Yup.number()
    .required("Quota is required")
    .min(0, "Quota must be at least 0"),
  reason: Yup.string().max(200, "Reason cannot exceed 200 characters"),
});

interface QuotaItem {
  id: string;
  updated_quota: number;
  created_at: string;
  updated_at: string;
  department: string;
  default_quota: {
    id: string;
    name: string;
    quota: number;
  };
}

const SetQuota = () => {
  const queryClient = useQueryClient();
  const [editQuota, setEditQuota] = useState<QuotaItem | null>(null);
  const [displayModal, setDisplayModal] = useState(false);
  const axios = useAxiosPrivate();
  const { person } = userStore();

  const fetchQuota = async () => {
    try {
      const { data }: any = await axios.get(
        `/departments/quotas/${person.department.id}/retrieve/`,
      );
      return data.data;
    } catch (error) {
      console.error("Error fetching quota:", error);
      toast.error("Error fetching quota");
    }
  };

  const handleUpdateQuota = async (values: any) => {
    if (!editQuota) return;
    try {
      await axios.put(`/departments/quotas/${editQuota.id}/update/`, {
        updated_quota: values.changedQuota,
        reason: values.reason,
      });
      toast.success("Quota updated successfully.");
      setDisplayModal(false);
      setEditQuota(null);
      formik.resetForm();
    } catch (error) {
      console.error("Error updating quota:", error);
      toast.error("Failed to update quota.");
    }
  };

  const onEditClick = (item: QuotaItem) => {
    setEditQuota(item);
    formik.setFieldValue(
      "changedQuota",
      item.updated_quota || item.default_quota.quota || "",
    );
    setDisplayModal(true);
  };

  const handleCancelEdit = () => {
    setEditQuota(null);
    setDisplayModal(false);
    formik.resetForm();
  };

  const { mutate: onUpdate, isPending: isUpdating } = useMutation({
    mutationFn: handleUpdateQuota,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-quotas"],
      });
    },
  });

  const { isLoading: isFetching, data: allQuotas } = useQuery({
    queryFn: fetchQuota,
    queryKey: ["fetch-quotas"],
  });

  const formik = useFormik({
    initialValues: {
      changedQuota:
        editQuota?.updated_quota || editQuota?.default_quota.quota || "",
      reason: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-6 mb-8 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Supervisor Quota
        </h3>
        <OutlineButton
          title="Refresh"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["fetch-quotas"],
            });
          }}
          className="py-1.5 px-4 text-xs"
          Icon={
            <RefreshCcw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
          }
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-border overflow-hidden shadow-inner">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-secondary/5">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">Fetching quotas...</p>
          </div>
        ) : allQuotas?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-secondary/10 border-b border-gray-200 dark:border-border">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Quota Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Default
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Current
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-border bg-white dark:bg-card">
                {allQuotas.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-secondary/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {item.default_quota.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.default_quota.quota}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${item.updated_quota ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                        {item.updated_quota || item.default_quota.quota}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <SolidButton
                          title="Update"
                          onClick={() => onEditClick(item)}
                          Icon={<Edit size={14} />}
                          className="py-1.5 px-6 text-xs font-bold shadow-sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-secondary/5">
            <Settings2 className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-gray-500 font-medium italic">No quotas configured yet.</p>
          </div>
        )}
      </div>

      {displayModal && (
        <Modal
          headTitle="Edit Supervisor Quota"
          subHeadTitle={editQuota ? `Configuring ${editQuota.default_quota.name}` : ""}
          handleCancel={handleCancelEdit}
          buttonDisabled
          handleConfirm={() => {}}
          w="max-w-2xl"
        >
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
                  New Quota Limit
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-lg font-bold dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g., 5"
                  value={formik.values.changedQuota}
                  onChange={(e) =>
                    formik.setFieldValue("changedQuota", Number(e.target.value))
                  }
                />
                {formik.touched.changedQuota && formik.errors.changedQuota && (
                  <p className="text-red-500 text-[10px] mt-1 ml-1">{formik.errors.changedQuota as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
                  Reason for Adjustment
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                  placeholder="Provide a brief explanation for this change..."
                  value={formik.values.reason}
                  onChange={(e) => formik.setFieldValue("reason", e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-border">
              <OutlineButton
                title="Discard"
                onClick={handleCancelEdit}
                className="py-2.5 px-6"
              />
              <SolidButton
                title={isUpdating ? "Saving..." : "Apply Changes"}
                onClick={() => formik.handleSubmit()}
                Icon={
                  isUpdating ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />
                }
                disabled={isUpdating}
                className="py-2.5 px-8 text-sm font-bold shadow-lg"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SetQuota;
