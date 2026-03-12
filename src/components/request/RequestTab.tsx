import { useNavigate } from "react-router";
import useRequestStore from "../../store/useRequestStore";
import { useState } from "react";
import {
  Clock,
  MessageCircleQuestionIcon,
  PlusCircle,
  RefreshCcw,
  UserCircle2Icon,
} from "lucide-react";
import Modal from "../../layouts/Modal";
import CreateRequest from "./CreateRequest";
import userStore from "../../store";
import { formatDate } from "../../utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaBookOpen, FaUser } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

type Props = {
  requests: any[];
};

const tabs = [
  { id: "admin", title: "Admin", Icon: FaUser },
  { id: "sup", title: "Supervisor", Icon: FaBookOpen },
  { id: "cor", title: "Coordinator", Icon: MdSchool },
];

const RequestTab = ({ requests }: Props) => {
  const queryClient = useQueryClient();
  const {
    updateSelectedReq,
    refreshRequest,
    activeTab,
    setActiveTab,
    setAdminRequests,
    setDepartmentRequests,
    adminRequests,
    departmentRequests,
  } = useRequestStore();
  const { userInfo, person } = userStore();
  const [displayCreateModal, setDisplayCreateModal] = useState(false);
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const isStudent = import.meta.env.VITE_STUDENT_ROLE;

  const isAdmin = userInfo.role === import.meta.env.VITE_ADMIN_ROLE;
  const fetchUrl = isAdmin
    ? `/admin/${person?.id}/student/`
    : `/department/${person?.id}/student/`;

  useQuery({
    queryKey: ["department-requests"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/supervisor-requests${fetchUrl}`,
        );
        setDepartmentRequests?.(data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching department requests:", error);
      }
    },
    enabled: userInfo.role === isStudent,
  });

  useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/supervisor-requests/admin/`,
        );
        setAdminRequests?.(data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching admin requests:", error);
      }
    },
    enabled: userInfo.role === isStudent,
  });

  const getSelectedRequest = () => {
    switch (activeTab) {
      case "admin":
        return adminRequests || [];
      case "sup":
        return requests || [];
      case "cor":
        return departmentRequests || [];
      default:
        return requests || [];
    }
  };

  const fetchReq = () => {
    queryClient.invalidateQueries({
      queryKey: ["fetch-requests"],
    });
    queryClient.invalidateQueries({
      queryKey: ["admin-requests"],
    });
    queryClient.invalidateQueries({
      queryKey: ["department-requests"],
    });
  };

  const selectedRequests = getSelectedRequest();

  return (
    <div className="relative h-[80vh] bg-white dark:bg-card border-r dark:border-border transition-colors duration-300">
      <div className="w-full flex items-center justify-center px-4 py-3 bg-slate-50 dark:bg-secondary/5 relative border-b dark:border-border">
        <button
          onClick={() => fetchReq()}
          className=" mr-2 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <RefreshCcw
            size={17}
            className={` ${refreshRequest ? "animate-spin" : " "}  mr-4'`}
          />
        </button>

        <h2 className="text-sm font-bold uppercase tracking-wider font-nunito-sans text-gray-500 dark:text-gray-400 py-1">
          {activeTab === "sup"
            ? "Supervisors"
            : activeTab === "cor"
            ? "Coordinators"
            : activeTab === "admin"
            ? "Admins"
            : ""}
          {userInfo.role !== isStudent ? " Students" : ""}
        </h2>
      </div>

      {userInfo.role === isStudent && (
        <div className="overflow-x-auto custom-scrollbar border-b dark:border-border">
          <div className="flex items-center gap-4 px-4 bg-slate-50 dark:bg-card">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 py-3 cursor-pointer transition-all duration-200 relative group ${
                  activeTab === tab.id
                    ? "text-blue-900 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.Icon size={16} />
                <span className="text-sm font-bold uppercase tracking-tight">
                  {tab.title}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 dark:bg-blue-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRequests.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center gap-4 bg-gray-50/50 dark:bg-card/50">
          <div className="h-24 w-24 bg-gray-100 dark:bg-secondary/10 rounded-full flex items-center justify-center">
            <span className="text-4xl text-gray-400 dark:text-gray-500">
              <MessageCircleQuestionIcon size={48} />
            </span>
          </div>
          <h3 className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">
            No Requests Found
          </h3>
        </div>
      ) : (
        <div className="h-full bg-white dark:bg-card overflow-y-auto custom-scrollbar">
          {selectedRequests.map((request: any) => (
            <Card
              key={request.id}
              date={request.created_at}
              status={request.status}
              name={
                userInfo.role === isStudent
                  ? activeTab === "sup"
                    ? request?.supervisor?.name
                    : request.proposed_topic
                  : request?.student?.name
              }
              id={request.id}
              onClick={() => {
                updateSelectedReq(request);
                navigate(`/requests/${request.id}`);
              }}
              activeTab={activeTab}
            />
          ))}
        </div>
      )}

      {userInfo.role === import.meta.env.VITE_STUDENT_ROLE && (
        <div className="absolute bottom-8 right-6">
          <button
            onClick={() => setDisplayCreateModal(true)}
            className="flex size-12 items-center cursor-pointer justify-center gap-2 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={24} />
          </button>
        </div>
      )}

      {displayCreateModal && (
        <Modal
          headTitle="Create New Request"
          subHeadTitle="Fill in the details to create a new request"
          buttonDisabled={false}
          handleCancel={() => setDisplayCreateModal(false)}
          handleConfirm={() => {}}
          w="max-w-4xl"
        >
          <CreateRequest
            onClose={() => {
              setDisplayCreateModal(false);
              fetchReq();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

interface CardProps {
  id: string | number;
  name: string;
  status: string;
  date: string | Date;
  onClick: () => void;
  activeTab: string;
}

const Card = ({ id, name, status, date, onClick, activeTab }: CardProps) => {
  const { selectedReq } = useRequestStore();
  const isStudent = import.meta.env.VITE_STUDENT_ROLE;
  const { userInfo } = userStore();

  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-400 dark:bg-yellow-500 text-white";
      case "approved":
        return "bg-green-400 dark:bg-green-500 text-white";
      case "rejected":
        return "bg-red-400 dark:bg-red-500 text-white";
      default:
        return "bg-blue-400 dark:bg-blue-500 text-white";
    }
  };

  return (
    <div
      className={`flex items-center gap-3 text-gray-700 dark:text-gray-300 cursor-pointer p-4 transition-all duration-200 border-b dark:border-border/40 ${
        selectedReq.id == id
          ? "bg-blue-50/50 dark:bg-blue-900/10 text-blue-900 dark:text-blue-400 border-r-4 border-r-blue-900 dark:border-r-blue-500 shadow-inner"
          : "bg-transparent hover:bg-gray-50 dark:hover:bg-secondary/5"
      }`}
      onClick={onClick}
    >
      <div className="relative h-12 w-12 flex items-center justify-center bg-blue-900 dark:bg-blue-800 rounded-full shadow-md shrink-0">
        <div className="absolute top-0.5 right-0.5 z-10">
          <div
            className={`size-3 rounded-full border-2 border-white dark:border-card ${getStatusStyles()}`}
          />
        </div>
        <UserCircle2Icon size={32} className="text-blue-100/80" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-gray-800 dark:text-gray-200 truncate">
          <span className="font-bold text-gray-500 dark:text-gray-400 text-[10px] uppercase tracking-tighter mr-1">
            {userInfo.role === isStudent
              ? activeTab === "sup"
                ? "To: "
                : ""
              : "from:"}
          </span>
          <span className="font-bold text-sm">{name}</span>
        </h3>
        <p className="text-[10px] sm:text-xs flex items-center text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
          <Clock size={12} className="mr-1" />
          {formatDate(date.toString())}
        </p>
      </div>
    </div>
  );
};

export default RequestTab;
