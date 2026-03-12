import { useState } from "react";
import CustomSelect from "../shared/custom-select";
import type { Options } from "../../utils/types";
import SolidButton from "../shared/buttons/SolidButton";
import { Edit, Loader2, PlusCircleIcon, Save, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import Modal from "../../layouts/Modal";
import OutlineButton from "../shared/buttons/OutlineButton";
import useAlert from "../../hooks/useAlert";

const levelOfProgOpt: Options[] = [
  {
    value: "One Year Masters (Long Essay Option)",
    label: "One Year Masters (Long Essay Option)",
  },
  {
    value: "One Year Masters Degree (Dissertation Option)",
    label: "One Year Masters Degree (Dissertation Option)",
  },
  {
    value: "One Year Masters Degree (Non-dissertation/Non-long Essay Option)",
    label: "One Year Masters Degree (Non-dissertation/Non-long Essay Option)",
  },
  {
    value: "One and Half Year Masters Degree (Dissertation Option)",
    label: "One and Half Year Masters Degree (Dissertation Option)",
  },
  {
    value: "One and Half Year Masters Degree (Long Essay Option)",
    label: "One and Half Year Masters Degree (Long Essay Option)",
  },
  {
    value: "Two Year Masters Degree (Thesis Option)",
    label: "Two Year Masters Degree (Thesis Option)",
  },
  {
    value: "Two Year Masters Degree (Course Work)",
    label: "Two Year Masters Degree (Course Work)",
  },
  {
    value: "Doctor of Philosophy Degree (PhD)",
    label: "Doctor of Philosophy Degree (PhD)",
  },
];

interface AdminProgrammeLevelsProps {
  programmeLevels: any[];
  fetchProgrammeLevels: boolean;
}

const AdminProgrammeLevels = ({ programmeLevels, fetchProgrammeLevels }: AdminProgrammeLevelsProps) => {
  const queryClient = useQueryClient();
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [displayModal, setDisplayModal] = useState(false);
  const [levelName, setLevelName] = useState("");
  const [editLevel, setEditLevel] = useState<any>(null);
  const axios = useAxiosPrivate();
  const alert = useAlert();

  const { isPending: superCreating, mutateAsync: creatingProgLevel } =
    useMutation({
      mutationFn: async () => {
        if (programmeLevels?.some((level: any) => level.name === selectedLevel)) {
          toast.error("Programme Level already exist");
          return;
        }

        try {
          await axios.post("/superadmin/programme-levels/", {
            name: selectedLevel,
            description: "Description",
          });
          await queryClient.invalidateQueries({
            queryKey: ["programme-levels"],
          });
          toast.success("Programme level added successfully");
        } catch (error: any) {
          toast.error(`Error adding programme level: ${error.message}`);
        } finally {
          setSelectedLevel("");
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["programme-levels"],
        });
      },
    });

  const { isPending: superUpdating, mutateAsync: programmeLevelUpdate } =
    useMutation({
      mutationFn: async () => {
        if (!editLevel) return;
        try {
          await axios.put(`/superadmin/programme-levels/${editLevel.id}/`, {
            name: levelName,
            description: "Description",
          });
          queryClient.invalidateQueries({
            queryKey: ["programme-levels"],
          });
          toast.success("Programme level updated successfully");
        } catch (error) {
          toast.error("Error updating programme level");
        } finally {
          setDisplayModal(false);
          setLevelName("");
          setEditLevel(null);
        }
      },
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["programme-levels"],
        });
      },
    });

  const { mutateAsync: deletingProgLevel } =
    useMutation({
      mutationFn: async (levelId: string) => {
        try {
          await axios.delete(`/superadmin/programme-levels/${levelId}/`);
          queryClient.invalidateQueries({
            queryKey: ["programme-levels"],
          });
          toast.success("Programme level deleted successfully");
        } catch (error: any) {
          toast.error(`Error deleting programme level: ${error.message}`);
        }
      },
      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: ["programme-levels"],
        });
      },
    });

  const handleDelete = async (levelId: string) => {
    const confirm = await alert.confirm(
      "Are you sure you want to delete this programme level? This action cannot be undone.",
    );
    if (confirm) {
      deletingProgLevel(levelId);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-card p-5 rounded-2xl shadow-md mb-6 border-2 border-gray-200 dark:border-border transition-colors duration-300">
        <div className="mb-5">
          <h3 className="text-lg font-cal-sans tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            Programme Levels
          </h3>
          <div className="flex items-end gap-2 ">
            <div className="flex-1">
              <CustomSelect
                label="Level of Programme"
                options={levelOfProgOpt}
                value={selectedLevel}
                onChange={(option: any) => setSelectedLevel(option || "")}
                placeholder="Select level of Programme"
              />
            </div>
            <SolidButton
              title="Add"
              className="py-1.5 h-fit"
              onClick={() => {
                creatingProgLevel();
              }}
              Icon={
                superCreating ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <PlusCircleIcon />
                )
              }
              disabled={superCreating || fetchProgrammeLevels}
            />
          </div>
        </div>

        <div className="max-h-96 border border-gray-300 dark:border-border rounded-xl custom-scrollbar overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-200 dark:border-border">
                <th className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                  Programme Level
                </th>
                <th className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {programmeLevels?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {fetchProgrammeLevels
                      ? "Loading..."
                      : "No Programme Level found"}
                  </td>
                </tr>
              ) : (
                programmeLevels?.map((level: any) => (
                  <tr
                    key={level.id}
                    className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-secondary/10 transition-colors"
                  >
                    <td className="text-sm text-gray-800 dark:text-gray-200 py-3 px-4 font-medium">
                      {level.name}
                    </td>
                    <td className="text-sm py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <SolidButton
                          title="Edit"
                          className="py-1 px-2 text-xs"
                          onClick={() => {
                            setEditLevel(level);
                            setDisplayModal(true);
                            setLevelName(level.name);
                          }}
                          Icon={<Edit className="h-3 w-3" />}
                        />
                        <button
                          className="py-1 px-2 text-gray-50 text-lg bg-red-500 cursor-pointer rounded-md hover:bg-red-500/60 transition-colors"
                          onClick={() => {
                            handleDelete(level.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {displayModal && (
        <Modal
          headTitle="Edit Programme Level"
          subHeadTitle="Modify the programme level title"
          handleConfirm={() => {}}
          handleCancel={() => {
            setDisplayModal(false);
            setEditLevel(null);
            setLevelName("");
          }}
          buttonDisabled={false}
          w="max-w-2xl"
        >
          <div className="text-gray-800 dark:text-gray-200">
            <p>
              Editing title for:{" "}
              <span className="font-bold text-blue-900 dark:text-blue-400">{editLevel?.name}</span>
            </p>

            <div className="mt-4">
              <label className="text-blue-900 dark:text-blue-400 block mb-2 font-semibold">Title</label>
              <input
                type="text"
                value={levelName}
                className="py-2 px-3 border border-gray-300 dark:border-border dark:bg-secondary/5 dark:text-gray-200 rounded-md focus:outline-1.5 focus:-outline-offset- focus:outline-blue-600 w-full"
                onChange={(e) => setLevelName(e.target.value)}
              />
            </div>
          </div>

          <div className=" mt-6 flex justify-end gap-3">
            <OutlineButton
              title="Cancel"
              onClick={() => {
                setDisplayModal(false);
                setEditLevel(null);
              }}
              className="py-1.5"
            />
            <SolidButton
              title="Save Changes"
              onClick={() => {
                programmeLevelUpdate();
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

export default AdminProgrammeLevels;
