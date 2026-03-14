import { useEffect, useState, useRef } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<
    SelectedSupervisor[]
  >([]);
  const [studentSupervisors, setStudentSupervisors] = useState<any[]>([]);
  const axios = useAxiosPrivate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

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
      console.log("removed", res.data);
    } catch (error) {
      console.error(error);
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
      await axios.post(
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
      const updatedSelection = selectedSupervisor.filter(
        (selected) => selected.id !== supervisor.id,
      );

      if (
        updatedSelection.length > 0 &&
        !updatedSelection.some((s) => s.lead)
      ) {
        updatedSelection[0].lead = true;
      }

      setSelectedSupervisor(updatedSelection);
    } else {
      const isFirstSelection = selectedSupervisor.length === 0;
      const newSupervisor: SelectedSupervisor = {
        id: supervisor.id,
        name: supervisor.name,
        lead: isFirstSelection,
      };

      setSelectedSupervisor([...selectedSupervisor, newSupervisor]);
    }
  };

  const removeSupervisor = (supervisorId: string) => {
    const updatedSelection = selectedSupervisor.filter(
      (selected) => selected.id !== supervisorId,
    );

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
    <div className="bg-white dark:bg-card transition-colors duration-300">
      {/* Thesis Topic */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Programme Title</h3>
        {/* <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-secondary/5 p-4 rounded-xl border border-gray-100 dark:border-border italic text-sm leading-relaxed">
          {student?.thesis_topic || "No topic specified"}
        </p> */}
        <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed">{student?.programme} </p>
      </div>

       <div className="mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Programme Level</h3>
        {/* <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-secondary/5 p-4 rounded-xl border border-gray-100 dark:border-border italic text-sm leading-relaxed">
          {student?.thesis_topic || "No topic specified"}
        </p> */}
        <p className="text-gray-700 dark:text-gray-300 text-md leading-relaxed">{student?.programme_level.name} </p>
      </div>

      {/* Select Supervisors */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Assign Supervisors</h3>

        {/* Selected Supervisors Display */}
        {selectedSupervisor.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSupervisor.map((selected) => (
                <div
                  key={selected.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    selected.lead
                      ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800"
                      : "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {selected.name}
                    {selected.lead && (
                      <span className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Lead</span>
                    )}
                  </span>
                  <button
                    onClick={() => removeSupervisor(selected.id)}
                    className="hover:bg-red-200 dark:hover:bg-red-900/60 rounded-full p-0.5 transition-colors"
                    title="Remove supervisor"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Lead Supervisor Selection */}
            {selectedSupervisor.length > 1 && (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl p-4 mb-4 transition-all">
                <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-3 text-xs uppercase tracking-wide">
                  Select Lead Supervisor
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedSupervisor.map((selected) => (
                    <label
                      key={selected.id}
                      className={`flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border transition-all ${
                        selected.lead 
                        ? "bg-white dark:bg-card border-amber-400 dark:border-amber-500 shadow-sm" 
                        : "bg-transparent border-transparent hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="leadSupervisor"
                        checked={selected.lead}
                        onChange={() => setHeadSupervisor(selected.id)}
                        className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-border dark:bg-secondary/10"
                      />
                      <span className="text-amber-900 dark:text-amber-200 text-sm font-medium">
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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3.5 border border-gray-300 dark:border-border rounded-xl bg-white dark:bg-secondary/5 hover:border-blue-400 dark:hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
          >
            <span
              className={
                selectedSupervisor.length > 0
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-500 dark:text-gray-400"
              }
            >
              {selectedSupervisor.length > 0
                ? `${selectedSupervisor.length} supervisor${selectedSupervisor.length > 1 ? "s" : ""} selected`
                : "Choose Supervisors"}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50 animate-fadeIn overflow-hidden">
              {availableSupervisors.length === 0 ? (
                <div className="px-4 py-8 text-gray-500 dark:text-gray-400 text-center">
                  <p className="font-medium text-sm">No available supervisors</p>
                  <p className="text-xs mt-1 opacity-70">
                    All supervisors may be at capacity
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-border/50">
                  {availableSupervisors.map((supervisor) => {
                    const isSelected = selectedSupervisor.some(
                      (selected) => selected.id === supervisor.id,
                    );

                    return (
                      <button
                        key={supervisor.user.id}
                        onClick={() => handleSupervisorToggle(supervisor)}
                        className={`w-full text-left px-5 py-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 shadow-sm"
                                : "border-gray-300 dark:border-border bg-transparent group-hover:border-blue-400"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">{supervisor.name}</span>
                            <p className="text-sm text-gray-500 dark:text-gray-500 font-mono"><span className="font-bold">ID:</span> {supervisor.staff_id}</p>
                            <div className="flex gap-2">
                              {supervisor.research_area.map((area: any, index: number) => (
                              <span key={index} className="text-xs text-gray-500 dark:text-gray-500 font-mono italic">{area.name},</span>
                            ))}
                            </div>
                            
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                              (supervisor.current_load || 0) >=
                              MAX_SUPERVISOR_LOAD * 0.8
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                : (supervisor.current_load || 0) >=
                                    MAX_SUPERVISOR_LOAD * 0.6
                                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                  : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            }`}
                          >
                            Load: {supervisor.current_load || 0}/{MAX_SUPERVISOR_LOAD}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300 leading-relaxed italic">
          {selectedSupervisor.length === 0 ? (
            <p>Select at least one supervisor to assign to this student.</p>
          ) : selectedSupervisor.length === 1 ? (
            <p>
              <span className="font-bold">{selectedSupervisor[0].name}</span>{" "}
              will be the lead supervisor. Additional supervisors can be added for collaboration.
            </p>
          ) : (
            <p>
              {selectedSupervisor.length} supervisors selected.
              <span className="font-bold">
                {" "}
                {selectedSupervisor.find((s) => s.lead)?.name}
              </span>{" "}
              is currently set as the lead.
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-border mt-2">
        <OutlineButton
          type="button"
          title="Cancel"
          onClick={() => {
            setIsDropdownOpen(false);
            onClose();
          }}
          className="py-2.5 min-w-[100px] text-xs font-bold"
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
          Icon={loading ? <Loader2 className="animate-spin w-4 h-4 ml-2" /> : null}
          disabled={!canSubmit || fetchingSups}
          onClick={() => {
            setIsDropdownOpen(false);
            mutate();
          }}
          className="py-2.5 min-w-[160px] text-sm font-bold shadow-lg active:scale-95 transition-all"
        />
      </div>
    </div>
  );
};

export default AssignSupervisorModal;
