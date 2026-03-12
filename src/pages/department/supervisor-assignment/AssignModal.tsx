import { useEffect, useState } from "react";
import { ChevronDown, X, Check, Loader2 } from "lucide-react";
import type { Student, Supervisor } from "../../../utils/types";
import OutlineButton from "../../../components/shared/buttons/OutlineButton";
import SolidButton from "../../../components/shared/buttons/SolidButton";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const MAX_SUPERVISOR_LOAD = 10;

interface SelectedSupervisor {
  id: string;
  name: string;
  lead: boolean;
}

interface AssignModalProps {
  student: Student | null;
  supervisors: Supervisor[];
  selectedSupervisor?: SelectedSupervisor[];
  setSelectedSupervisor?: (supervisors: SelectedSupervisor[]) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onClose: () => void;
  loading?: boolean;
  selectedStudent: any | null;
}

const AssignSupervisorModal = ({
  student,
  supervisors,
  selectedStudent,
  onClose,
}: AssignModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<
    SelectedSupervisor[]
  >([]);
  const [studentSupervisors, setStudentSupervisors] = useState<any[]>([]);
  const axios = useAxiosPrivate();

  const fetchStudentSupervisors = async () => {
    try {
      const { data }: any = await axios.get(
        `/students/supervisors/${selectedStudent.id}/`,
      );
      setStudentSupervisors(data.data);
      setSelectedSupervisor(
        data.data.map((sup: any) => ({
          id: sup.supervisor.id,
          name: sup.supervisor.name,
          lead: sup.lead,
        })),
      );
    } catch (error) {
      console.error("Error fetching student supervisors:", error);
      toast.error("Failed to fetch student supervisors");
    }
  };

  const removeStudentSupervisors = async (id: string) => {
    try {
      const res = await axios.post(`/students/remove/${id}/`, {
        supervisors: studentSupervisors.map((sup) => ({
          lead: sup.lead,
          supervisor_id: sup.id,
        })),
      });
      console.log("removed");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error("error reassigning");
    }
  };

  const handleConfirm = async () => {
    if (studentSupervisors.length > 0) {
      for (const sup of studentSupervisors) {
        await removeStudentSupervisors(sup.id);
      }
    }

    try {
      const response = await axios.post(
        `/students/assign/${selectedStudent?.id}/`,
        {
          supervisors: selectedSupervisor.map((s: any) => ({
            supervisor_id: s.id,
            lead: s.lead,
          })),
        },
      );
      toast.success("Supervisor assigned successfully");
      onClose();
      setSelectedSupervisor([]);
    } catch (error) {
      console.error("Error assigning supervisors:", error);
      toast.error("Failed to assign supervisor");
    }
  };

  const { mutateAsync: fetchStudSups, isPending: fetchingSups } = useMutation({
    mutationFn: fetchStudentSupervisors,
  });

  const { mutate, isPending: loading } = useMutation({
    mutationFn: handleConfirm,
    onError: () => {
      toast.error("Failed to assign supervisor");
    },
  });

  useEffect(() => {
    console.log("Existing supervisors:", studentSupervisors);
    fetchStudSups();
  }, []);

  const availableSupervisors = supervisors.filter(
    (s) => s.status === "Available",
  );

  const handleSupervisorToggle = (supervisor: Supervisor) => {
    const isCurrentlySelected = selectedSupervisor.some(
      (selected) => selected.id === supervisor.id,
    );

    if (isCurrentlySelected) {
      // Remove from selection
      const updatedSelection = selectedSupervisor.filter(
        (selected) => selected.id !== supervisor.id,
      );

      // If we removed the head supervisor and there are others, make the first one head
      if (
        updatedSelection.length > 0 &&
        !updatedSelection.some((s) => s.lead)
      ) {
        updatedSelection[0].lead = true;
      }

      setSelectedSupervisor(updatedSelection);
    } else {
      // Add to selection
      const isFirstSelection = selectedSupervisor.length === 0;
      const newSupervisor: SelectedSupervisor = {
        id: supervisor.id,
        name: supervisor.name,
        lead: isFirstSelection, // First supervisor is automatically head
      };

      setSelectedSupervisor([...selectedSupervisor, newSupervisor]);
    }
  };

  const removeSupervisor = (supervisorId: string) => {
    const updatedSelection = selectedSupervisor.filter(
      (selected) => selected.id !== supervisorId,
    );

    // If we removed the head supervisor and there are others, make the first one head
    if (updatedSelection.length > 0 && !updatedSelection.some((s) => s.lead)) {
      updatedSelection[0].lead = true;
    }

    setSelectedSupervisor(updatedSelection);
  };

  const setHeadSupervisor = (supervisorId: string) => {
    setSelectedSupervisor(
      selectedSupervisor.map((selected) => ({
        ...selected,
        lead: selected.id === supervisorId,
      })),
    );
  };

  const canSubmit = selectedSupervisor.length > 0 && !loading;

  return (
    <div className="bg-white">
      {/* Thesis Topic */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Proposed Topic</h3>
        <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
          {student?.thesis_topic || "No topic specified"}
        </p>
      </div>

      {/* Select Supervisors */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Assign Supervisors</h3>

        {/* Selected Supervisors Display */}
        {selectedSupervisor.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSupervisor.map((selected) => (
                <div
                  key={selected.id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selected.lead
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  <span>
                    {selected.name}
                    {selected.lead && " (Lead)"}
                  </span>
                  <button
                    onClick={() => removeSupervisor(selected.id)}
                    className="hover:bg-red-200 rounded-full p-0.5 transition-colors"
                    title="Remove supervisor"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Lead Supervisor Selection - Only show if more than one supervisor */}
            {selectedSupervisor.length > 1 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                <h4 className="font-medium text-amber-800 mb-2">
                  Select Lead Supervisor
                </h4>
                <div className="space-y-2">
                  {selectedSupervisor.map((selected) => (
                    <label
                      key={selected.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-amber-100 p-1 rounded"
                    >
                      <input
                        type="radio"
                        name="leadSupervisor"
                        checked={selected.lead}
                        onChange={() => setHeadSupervisor(selected.id)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-amber-800 text-sm font-medium">
                        {selected.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Supervisor Selection Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <span
              className={
                selectedSupervisor.length > 0
                  ? "text-gray-900"
                  : "text-gray-500"
              }
            >
              {selectedSupervisor.length > 0
                ? `${selectedSupervisor.length} supervisor${selectedSupervisor.length > 1 ? "s" : ""} selected`
                : "Choose Supervisors"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
              {availableSupervisors.length === 0 ? (
                <div className="px-4 py-6 text-gray-500 text-center">
                  <p>No available supervisors</p>
                  <p className="text-sm mt-1">
                    All supervisors may be at capacity
                  </p>
                </div>
              ) : (
                availableSupervisors.map((supervisor) => {
                  const isSelected = selectedSupervisor.some(
                    (selected) => selected.id === supervisor.id,
                  );

                  return (
                    <button
                      key={supervisor.user.id}
                      onClick={() => handleSupervisorToggle(supervisor)}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{supervisor.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            (supervisor.current_load || 0) >=
                            MAX_SUPERVISOR_LOAD * 0.8
                              ? "bg-red-100 text-red-600"
                              : (supervisor.current_load || 0) >=
                                  MAX_SUPERVISOR_LOAD * 0.6
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                          }`}
                        >
                          {supervisor.current_load || 0}/{MAX_SUPERVISOR_LOAD}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-3 text-sm text-gray-600">
          {selectedSupervisor.length === 0 ? (
            <p>Select at least one supervisor to assign to this student.</p>
          ) : selectedSupervisor.length === 1 ? (
            <p>
              <span className="font-medium">{selectedSupervisor[0].name}</span>{" "}
              will be the lead supervisor. You can add additional supervisors
              for collaborative research.
            </p>
          ) : (
            <p>
              {selectedSupervisor.length} supervisors selected.
              <span className="font-medium">
                {" "}
                {selectedSupervisor.find((s) => s.lead)?.name}
              </span>{" "}
              is the lead supervisor.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <OutlineButton
          type="button"
          title="Cancel"
          onClick={() => {
            setIsDropdownOpen(false);
            onClose();
          }}
          className="py-2 min-w-20"
          disabled={loading}
        />
        <SolidButton
          type="button"
          title={
            loading
              ? "Assigning..."
              : studentSupervisors.length > 0
                ? "Update"
                : "Assign Supervisors"
          }
          Icon={loading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
          disabled={!canSubmit || fetchingSups}
          onClick={() => {
            setIsDropdownOpen(false);
            mutate();
          }}
          className="py-2 min-w-32"
        />
      </div>
    </div>
  );
};

export default AssignSupervisorModal;
