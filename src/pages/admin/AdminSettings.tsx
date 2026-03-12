import {
  Edit,
  Loader2,
  PlusCircleIcon,
  Save,
  Search,
} from "lucide-react";
import SolidButton from "../../components/shared/buttons/SolidButton";
import Header from "../../components/shared/text/Header";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomSelect from "../../components/shared/custom-select";
import OutlineButton from "../../components/shared/buttons/OutlineButton";
import Modal from "../../layouts/Modal";
import SetChapters from "../../components/admin/SetChapters";
import AdminProgrammeLevels from "../../components/admin/AdminProgrammeLevels";
import usePageTile from "../../hooks/usePageTitle";
import ManageSelector from "../../components/admin/ManageSelector";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [supervisorQuota, setSupervisorQuota] = useState<number>(5);
  const [selectedQuota, setSelectedQuota] = useState<string>("");
  const [editingQuota, setEditingQuota] = useState<any | null>(null);
  const [displayModal, setDisplayModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  usePageTile("Admin Settings | ThesisFlow");

  const axios = useAxiosPrivate();

  const { data: programmeLevels, isLoading: fetchProgrammeLevels } = useQuery({
    queryKey: ["programme-levels"],
    queryFn: async () => {
      const { data }: any = await axios.get("/superadmin/programme-levels/");
      return data.data || [];
    },
    enabled: true,
  });

  const { data: departQuotas, isLoading: superFetching } = useQuery({
    queryKey: ["all-depart-quotas"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get("/supervisors/quota/");
        return data.data || [];
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch supervisor quota");
      }
    },
  });

  const handleQuotaChange = async () => {
    try {
      const { data }: any = await axios.put(
        `/supervisors/quota/${editingQuota.id}/update/`,
        {
          quota: supervisorQuota,
          name: editingQuota.name,
        },
      );
      toast.success("Supervisor quota updated successfully");
      setDisplayModal(false);
      setEditingQuota(null);
      setSupervisorQuota(5);
      setSelectedQuota("");
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update supervisor quota");
    }
  };

  const handleCreateQuota = async () => {
    if (departQuotas?.some((quota: any) => quota.name === selectedQuota)) {
      toast.error("Quota already exists");
      return;
    }

    try {
      const { data }: any = await axios.post("/supervisors/quota/create/", {
        name: selectedQuota,
        quota: supervisorQuota,
      });
      toast.success("Supervisor quota updated successfully");
      setSelectedQuota("");
      setSupervisorQuota(5);
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update supervisor quota");
    }
  };

  const { mutate: quotaUpdate, isPending: superUpdating } = useMutation({
    mutationFn: handleQuotaChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-depart-quotas"] });
    },
  });

  const { mutate: quotaCreate, isPending: superCreating } = useMutation({
    mutationFn: handleCreateQuota,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-depart-quotas"] });
    },
  });

  const filteredQuotas = departQuotas?.filter((quota: any) =>
    quota.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const findProgrammeLevelName = (id: string) => {
    const name =
      programmeLevels?.find((level: any) => level.id === id)?.name || "Unknown";
    return name;
  };

  return (
    <div className="transition-colors duration-300 min-h-screen">
      <Header
        title="Admin Settings"
        subtitle="Manage system-wide settings and configurations"
      />

      <div className="mb-5">
        <AdminProgrammeLevels
          programmeLevels={programmeLevels}
          fetchProgrammeLevels={fetchProgrammeLevels}
        />
      </div>

      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <div className="mb-3">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Supervisor Quota
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label="Level of Programme"
              options={programmeLevels?.map((level: any) => ({
                value: level.id,
                label: level.name,
              }))}
              value={selectedQuota}
              onChange={(option: any) => setSelectedQuota(option?.value || "")}
              placeholder="Select level of Programme"
            />

            <div>
              <label className="text-blue-900 dark:text-blue-400 mb-3 text-sm font-medium">
                Quota
              </label>
              <input
                type="number"
                value={supervisorQuota}
                className="py-2 w-full px-3 border border-gray-300 dark:border-border dark:bg-secondary/5 dark:text-gray-200 rounded-md focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600 transition-all"
                onChange={(e) =>
                  setSupervisorQuota(e.target.value as unknown as number)
                }
              />
            </div>
          </div>
          <SolidButton
            title="Add"
            onClick={() => {
              quotaCreate();
            }}
            className="py-1.5 mt-4"
            Icon={
              superCreating ? (
                <Loader2 className="animate-spin" />
              ) : (
                <PlusCircleIcon />
              )
            }
            disabled={superCreating || superFetching}
          />
        </div>

        <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md border-2 border-gray-200 dark:border-border mt-8">
          {/* Search input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-border dark:bg-secondary/5 dark:text-gray-200 rounded px-3 py-2 mb-4 w-full pl-10 focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600 transition-all"
            />
            <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 h-4 w-4" />
          </div>

          {/* Department quota table */}
          <div className="max-h-96 border border-gray-300 dark:border-border rounded-xl custom-scrollbar overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-gray-200 dark:border-border">
                  <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                    Quota Title
                  </th>
                  <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                    Quota
                  </th>
                  <th className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotas?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      {superFetching
                        ? "Loading..."
                        : "No supervisor quotas found"}
                    </td>
                  </tr>
                ) : (
                  filteredQuotas?.map((quota: any) => (
                    <tr
                      key={quota.id}
                      className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-secondary/10 transition-colors"
                    >
                      <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4 font-medium">
                        {findProgrammeLevelName(quota.name)}
                      </td>
                      <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {quota.quota} students
                        </span>
                      </td>
                      <td className="text-sm py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <SolidButton
                            title="Edit"
                            className="py-1 px-2 text-xs"
                            onClick={() => {
                              setEditingQuota(quota);
                              setSupervisorQuota(quota.quota);
                              setDisplayModal(true);
                            }}
                            Icon={<Edit className="h-3 w-3" />}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <SetChapters
          allLevels={programmeLevels}
          fetchProgrammeLevels={fetchProgrammeLevels}
        />
      </div>

      <div className="mt-6">
        <ManageSelector />
      </div>

      {/* Modals */}
      {displayModal && (
        <Modal
          headTitle="Edit Supervisor Quota"
          subHeadTitle="Modify the supervisor quota for the selected level of programme"
          handleConfirm={() => {}}
          handleCancel={() => {
            setDisplayModal(false);
            setEditingQuota(null);
          }}
          buttonDisabled={false}
          w="max-w-lg"
        >
          <div className="text-gray-800 dark:text-gray-200">
            <p>
              Editing quota for:{" "}
              <span className="font-bold text-blue-900 dark:text-blue-400">
                {findProgrammeLevelName(editingQuota?.name)}
              </span>
            </p>

            <div className="mt-4">
              <label className="text-blue-900 dark:text-blue-400 mb-2 block font-semibold">Quota</label>
              <input
                type="number"
                value={supervisorQuota}
                className="py-2 px-3 border border-gray-300 dark:border-border dark:bg-secondary/5 dark:text-gray-200 rounded-md focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600 w-full"
                onChange={(e) =>
                  setSupervisorQuota(e.target.value as unknown as number)
                }
              />
            </div>
          </div>

          <div className=" mt-6 flex justify-end gap-3">
            <OutlineButton
              title="Cancel"
              onClick={() => {
                setDisplayModal(false);
                setEditingQuota(null);
              }}
              className="py-1.5"
            />
            <SolidButton
              title="Save Changes"
              onClick={() => {
                quotaUpdate();
              }}
              className="py-1.5"
              Icon={
                superUpdating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )
              }
              disabled={superUpdating}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSettings;
