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
    <div className="relative h-[80vh] bg-card border-r border-border transition-colors duration-300">
      <div className="w-full flex items-center justify-center px-4 py-4 bg-muted/30 relative border-b border-border">
        <button
          onClick={() => fetchReq()}
          className=" mr-2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCcw
            size={16}
            className={` ${refreshRequest ? "animate-spin" : " "}  mr-4`}
          />
        </button>

        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground py-1">
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
        <div className="overflow-x-auto custom-scrollbar border-b border-border">
          <div className="flex items-center gap-4 px-4 bg-muted/20">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 py-4 cursor-pointer transition-all duration-200 relative group shrink-0 ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.Icon size={16} />
                <span className="text-sm font-bold uppercase tracking-tight">
                  {tab.title}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedRequests.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center gap-4 bg-muted/10">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center shadow-inner">
            <MessageCircleQuestionIcon size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
            No Requests Found
          </h3>
        </div>
      ) : (
        <div className="h-full bg-card overflow-y-auto custom-scrollbar">
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
            className="flex size-14 items-center cursor-pointer justify-center gap-2 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <PlusCircle size={28} />
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
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/20";
      case "approved":
        return "bg-green-500/20 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-destructive/20 text-destructive border-destructive/20";
      default:
        return "bg-primary/20 text-primary border-primary/20";
    }
  };

  return (
    <div
      className={`flex items-center gap-4 text-foreground cursor-pointer p-5 transition-all duration-300 border-b border-border/40 hover:bg-muted/30 ${
        selectedReq.id == id
          ? "bg-primary/5 border-l-4 border-l-primary shadow-sm"
          : "bg-transparent"
      }`}
      onClick={onClick}
    >
      <div className="relative h-14 w-14 flex items-center justify-center bg-muted rounded-2xl shadow-inner border border-border group-hover:border-primary/30 transition-colors shrink-0">
        <div className="absolute -top-1 -right-1 z-10">
          <div
            className={`size-3.5 rounded-full border-2 border-card ${getStatusStyles()}`}
          />
        </div>
        <UserCircle2Icon size={34} className="text-muted-foreground/50" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-foreground truncate group-hover:text-primary transition-colors">
          <span className="font-bold text-muted-foreground text-[9px] uppercase tracking-tighter mr-2 opacity-70">
            {userInfo.role === isStudent
              ? activeTab === "sup"
                ? "Recipient: "
                : ""
              : "Sender:"}
          </span>
          <span className="font-bold text-[13px]">{name}</span>
        </h3>
        <p className="text-[10px] flex items-center text-muted-foreground mt-1 font-semibold uppercase tracking-wide opacity-80">
          <Clock size={11} className="mr-1.5 text-primary/60" />
          {formatDate(date.toString())}
        </p>
      </div>
    </div>
  );
};

export default RequestTab;
