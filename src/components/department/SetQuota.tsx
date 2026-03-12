import React, { useState } from "react";
import SolidButton from "../shared/buttons/SolidButton";
import { Copy, Edit, Loader2, RefreshCcw, Save } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import userStore from "../../store";
import OutlineButton from "../shared/buttons/OutlineButton";
import Modal from "../../layouts/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RichText from "../shared/input/RichText";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  changedQuota: Yup.number()
    .required("Quota is required")
    .min(0, "Quota must be at least 0"),
  reason: Yup.string().max(20, "Reason cannot exceed 20 characters"),
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

  const handleUpdateQuota = async (values) => {
    if (!editQuota) return;
    try {
      await axios.put(`/departments/quotas/${editQuota.id}/update/`, {
        updated_quota: values.changedQuota,
        reason: values.reason,
      });
      toast.success("Quota updated successfully.");
      fetchQuota();
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
    validationSchema,
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-md font-bold text-gray-500 mb-4">Supervisor Quota</h3>

      <div>
        <div className="flex gap-4 items-center mb-4">
          <OutlineButton
            title="Refresh"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ["fetch-quotas"],
              });
            }}
            Icon={
              <RefreshCcw className={`${isFetching ? "animate-spin" : ""}`} />
            }
          />
        </div>

        {allQuotas?.length > 0 ? (
          <div>
            {/* Table for quotas */}
            <div className="rounded-xl border-2 border-gray-200 overflow-x-auto">
              <table className="min-w-full bg-white ">
                <thead className="bg-blue-50 text-gray-600 ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Quota Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Default Quota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Updated Quota
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allQuotas.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.default_quota.id}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              item.default_quota.id,
                            );
                            toast.success("ID copied to clipboard");
                          }}
                        >
                          <Copy className="h-4 w-4 text-gray-500 ml-5" />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.default_quota.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.default_quota.quota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.updated_quota || item.default_quota.quota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <SolidButton
                          title="Update"
                          onClick={() => {
                            onEditClick(item);
                          }}
                          Icon={<Edit size={16} />}
                          className="py-1 px-3 text-xs"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No quota set yet.</p>
        )}
      </div>

      {displayModal && (
        <Modal
          headTitle="Edit Quota"
          subHeadTitle={
            editQuota ? `Editing quota for ${editQuota.default_quota.name}` : ""
          }
          handleCancel={() => handleCancelEdit()}
          buttonDisabled
          handleConfirm={() => {}}
          w="max-w-4xl"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Quota for {editQuota?.default_quota.name}
            </label>
            {/* Input field for setting quota */}
            <input
              type="number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Enter new quota"
              value={formik.values.changedQuota}
              onChange={(e) =>
                formik.setFieldValue("changedQuota", Number(e.target.value))
              }
            />
          </div>

          <div className="mt-4">
            <RichText
              label="Reason for Change (optional)"
              value={formik.values.reason}
              onChange={(value) => formik.setFieldValue("reason", value)}
              placeholder="Provide a reason for changing the quota..."
            />
          </div>

          <div className="mt-4 flex justify-end">
            <SolidButton
              title="Save Changes"
              onClick={() => formik.handleSubmit()}
              Icon={
                isUpdating ? <Loader2 className="animate-spin" /> : <Save />
              }
              className="py-1.5"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SetQuota;
