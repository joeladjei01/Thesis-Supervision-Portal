import {
  Send,
  ArrowLeft,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react";
import useRequestStore from "../../store/useRequestStore";
import { useNavigate } from "react-router";
import userStore from "../../store";
import CustomSelect from "../shared/custom-select";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { MdFeedback } from "react-icons/md";
import { inputStyles } from "../../utils/helpers";
import { useState, useEffect } from "react";
import "./ChatBox.css";

const ChartBox = ({ fetchReq }: { fetchReq: () => void }) => {
  const { selectedReq, updateSelectedReq, activeTab, resetSelected } =
    useRequestStore();
  const userInfo = userStore((state) => state.userInfo);
  const [responseMessage, setResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState("");
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const isStudent = import.meta.env.VITE_STUDENT_ROLE;
  const ADMIN = import.meta.env.VITE_ADMIN_ROLE;
  const DEPARTMENT = import.meta.env.VITE_DEPARTMENT_ROLE;
  const SUPERVISOR_ROLE = import.meta.env.VITE_SUPERVISOR_ROLE;

  const url =
    userInfo.role == ADMIN
      ? `/admin/update/${selectedReq.id}/`
      : userInfo.role === DEPARTMENT
        ? `/department/update/${selectedReq.id}/`
        : `/update/${selectedReq.id}/`;

  const fetchRequestDetails = async () => {
    const detailsUrl =
      userInfo.role == ADMIN || activeTab === "admin"
        ? `/admin/retrieve/${selectedReq.id}/`
        : userInfo.role === DEPARTMENT || activeTab === "cor"
          ? `/department/retrieve/${selectedReq.id}/`
          : `/retrieve/${selectedReq.id}/`;
    try {
      const { data }: any = await axios.get(
        `/students/supervisor-requests${detailsUrl}`,
      );
      updateSelectedReq(data.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch request details");
    }
  };

  const { mutate: fetchDetails, isPending: onDetails } = useMutation({
    mutationFn: fetchRequestDetails,
  });

  const superUpdateReqStatus = async () => {
    if (!responseStatus) {
      toast.error("Please select an action before submitting feedback");
      return;
    }
    try {
      await axios.put(`/students/supervisor-requests${url}`, {
        status: responseStatus,
        feedback: responseMessage,
      });
      toast.success("Request status updated successfully");
      fetchDetails();
      setResponse("");
      fetchReq();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update request status");
    }
  };

  const { mutate: handleUpdate, isPending: updating } = useMutation({
    mutationFn: superUpdateReqStatus,
  });

  useEffect(() => {
    fetchDetails();
  }, [selectedReq.id]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { label: StatusText } = ((): {
    label: string;
    color: string;
  } => {
    switch (selectedReq.status) {
      case "pending":
        return {
          label: "pending",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "feedback_given":
        return {
          label: "feedback_given",
          color: "bg-blue-100 text-blue-800",
        };
      case "approved":
        return {
          label: "approved",
          color: "bg-green-100 text-green-800",
        };
      case "rejected":
        return {
          label: "rejected",
          color: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: selectedReq.status,
          color: "bg-gray-100 text-gray-800",
        };
    }
  })();

  return (
    <div className="flex flex-col h-[80vh] bg-white dark:bg-card">
      {/* Chat Header */}
      <div className="flex items-center p-5 py-3 bg-ug-blue dark:bg-blue-900 text-white shadow-md z-10 transition-colors duration-300">
        <div className="mr-4">
          <button
            onClick={() => {
              resetSelected();
              updateSelectedReq({
                id: "",
                email: "",
                name: "",
                request: null,
              });
              navigate("/requests", { replace: true });
            }}
            className="h-9 w-9 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200"
          >
            <ArrowLeft className="text-white" size={20} />
          </button>
        </div>
        {selectedReq?.supervisor && (
          <>
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center mr-3 border border-white/20">
              <span className="text-sm text-white font-bold">
                {userInfo.role == isStudent
                  ? selectedReq?.supervisor?.name?.charAt(0).toUpperCase()
                  : selectedReq?.student?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base tracking-tight truncate">
                {userInfo.role == isStudent
                  ? selectedReq?.supervisor && selectedReq?.supervisor.name
                  : selectedReq?.student.name}
              </h3>
            </div>
          </>
        )}

        {onDetails && (
          <div>
            <RefreshCw className="animate-spin" />
          </div>
        )}
      </div>

      {/* Request Container */}
      <div className="flex-1 overflow-y-auto space-y-4 bg-gray-50 dark:bg-background/50 message-scroll p-4 transition-colors duration-300">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white dark:bg-card p-6 text-center rounded-2xl shadow-sm border border-gray-100 dark:border-border transition-colors duration-300">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-nunito-sans tracking-tight">
              {selectedReq.proposed_topic}
            </p>

            <div className="h-[1px] mx-auto max-w-xs bg-gray-100 dark:bg-border/50 my-4" />

            <p className="flex gap-2 items-center justify-center text-xs text-gray-400 ">
              <Clock size={15} />
              {formatDate(selectedReq?.created_at)}
            </p>

            <div className="flex items-center justify-center gap-4 mt-5">
              <span className="font-bold text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Status:
              </span>
              <span
                className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  StatusText === "pending"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : StatusText === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {selectedReq?.status === "pending"
                  ? "Pending"
                  : selectedReq?.status === "rejected"
                    ? "Rejected"
                    : selectedReq?.status === "approved"
                      ? "Approved"
                      : selectedReq?.status === "feedback_given"
                        ? "Feedback Provided"
                        : selectedReq?.status}
              </span>
            </div>
          </div>

          <div className="p-2 sm:p-4">
            <div className="min-h-60 border dark:border-border/60 bg-white dark:bg-card p-6 rounded-2xl shadow-sm transition-colors duration-300">
              <div
                className="text-gray-800 dark:text-gray-200 leading-relaxed text-sm prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedReq?.details }}
              />
            </div>

            {selectedReq?.feedback && (
              <>
                <div className="relative mt-8 mb-4">
                  <div className={"h-[1px] w-full bg-gray-200 dark:bg-border/50"} />
                  <div className="absolute top-[-8px] left-1/2 transform -translate-x-1/2 px-4 bg-gray-50 dark:bg-background rounded-full border dark:border-border">
                    <p className="text-center text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">
                      <MdFeedback className="inline-block mr-1.5" size={14} />
                      Feedback
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:pl-12">
                  <div className="flex flex-col border dark:border-border/60 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-900 dark:bg-blue-500" />
                    <div className="p-5">
                      <div
                        className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: selectedReq.feedback,
                        }}
                      />
                    </div>
                    <p className="font-bold text-[10px] text-gray-400 dark:text-gray-500 ml-auto p-2 bg-white/50 dark:bg-card/50 rounded-tl-lg">
                      {formatDate(selectedReq.updated_at)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Request Status Update */}
      {userInfo.role == isStudent ? null : (
        <div className="bg-white dark:bg-card border-t dark:border-border p-5 shadow-2xl z-10 transition-colors duration-300">
          <div className="flex items-end space-x-2">
            <div className="w-full">
              {userInfo.role === SUPERVISOR_ROLE && (
                <div className="mb-4">
                  <CustomSelect
                    options={[
                      { label: "Approve", value: "approved" },
                      { label: "Reject", value: "rejected" },
                    ]}
                    onChange={(value) => setResponseStatus(value.value)}
                    placeholder="Select Action"
                    value={responseStatus}
                  />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  placeholder="Your feedback"
                  className={`${inputStyles} bg-gray-50 dark:bg-secondary/5 dark:text-gray-200 h-24 resize-none border-none ring-1 ring-gray-200 dark:ring-border focus:ring-2 focus:ring-blue-600 transition-all`}
                  value={responseMessage}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </div>
            </div>
            <button
              disabled={updating || !responseMessage}
              onClick={() => handleUpdate()}
              className={`p-3 rounded-xl transition-all duration-300 cursor-pointer shadow-sm ${
                responseMessage
                  ? "bg-blue-900 text-white hover:bg-blue-800 hover:shadow-md hover:-translate-y-0.5"
                  : "bg-gray-100 dark:bg-secondary/10 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              {updating ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Send size={24} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartBox;
