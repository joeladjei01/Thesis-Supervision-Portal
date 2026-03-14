import React, { useEffect, useState } from "react";
import {
  Clock,
  Video,
  Users,
  Users2,
  Trash2,
  Calendar,
  MapPin,
  User,
  Loader,
} from "lucide-react";
import ScheduleMeetingForm from "../../components/supervisor/meetings/ScheduleMeetingForm";
import Header from "../../components/shared/text/Header";
import NavTab from "../../components/shared/Tab/NavTab";
import usePageTile from "../../hooks/usePageTitle";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import type { MeetingSchedule } from "../../utils/types";
import SolidButton from "../../components/shared/buttons/SolidButton";
import Modal from "../../layouts/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import useAlert from "../../hooks/useAlert";
import { shortenText } from "../../utils/helpers";

// Types and Interfaces
type MeetingStatus =
  | "Pending"
  | "Cancelled"
  | "On-going"
  | "Completed"
  | "Rejected";

// We'll use the `MeetingSchedule` shape from the API / types.ts

interface StatusBadgeProps {
  status: MeetingStatus;
}

interface MeetingItemProps {
  meeting: MeetingSchedule;
  setEditMeetingData: (meeting: MeetingSchedule) => void;
  onOpenMeetingScheduler: (state: boolean) => void;
}

// Utility Functions
const getStatusConfig = (status: MeetingStatus) => {
  const configs = {
    Completed: {
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    },
    Pending: {
      className:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
    },
    Cancelled: {
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    },
    "On-going": {
      className:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    },
  };
  return configs[status];
};

const formatISODate = (iso?: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString();
};

const formatISOTime = (iso?: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Components
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = getStatusConfig(status);
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded border ${config.className}`}
    >
      {status}
    </span>
  );
};

const MeetingItem: React.FC<MeetingItemProps> = ({
  meeting,
  setEditMeetingData,
  onOpenMeetingScheduler,
}) => {
  const isVirtual = meeting.meeting_type?.toLowerCase() === "virtual";
  const [meetingDetails, setMeetingDetails] = useState<MeetingSchedule | null>(
    null,
  );
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const axios = useAxiosPrivate();
  const alert = useAlert();

  const statusLabel = (() => {
    const s = meeting.status?.toString().toLowerCase();
    if (!s) return "Pending";
    if (s === "completed" || s === "approved") return "Completed";
    if (s === "rejected" || s === "canceled") return "Cancelled";
    if (s === "ongoing") return "On-going";
    return s[0]?.toUpperCase() + s.slice(1);
  })();

  const { mutateAsync: deleteMeeting, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const confirm = await alert.confirm(
        "Are you sure you want to delete this meeting?",
      );
      if (!confirm) return;
      try {
        const response = await axios.delete(`/supervisors/meetings/${id}/`);
        toast.success("Meeting deleted successfully");
        return response;
      } catch (error) {
        toast.error("Failed to delete meeting");
        console.error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supervisor-meeting-schedules"],
      });
    },
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow">
        <div>
          <Users2 size={32} className="text-muted-foreground" />
        </div>

        <div
          className="cursor-pointer flex-1 min-w-0 group"
          onClick={() => {
            setMeetingDetails(meeting);
            setIsModalOpen(true);
          }}
        >
          <h4 className="font-medium group-hover:text-primary text-foreground truncate">
            {meeting.session_title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {shortenText(
              meeting.invitees.map((invitee) => invitee.name).join(", "),
              40,
            )}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {formatISODate(meeting.start_time)}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={12} />
              {formatISOTime(meeting.start_time)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={statusLabel as MeetingStatus} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            {isVirtual ? <Video size={12} /> : <Users size={12} />}
            {isVirtual ? "Virtual" : "In-Person"}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {meeting.status !== "completed" && (
            <SolidButton
              title={"Update"}
              onClick={() => {
                setEditMeetingData(meeting);
                onOpenMeetingScheduler(true);
              }}
            />
          )}

          <button
            className="py-1 px-2 text-gray-50 text-lg bg-red-500 cursor-pointer rounded-md hover:bg-red-500/60 transition-colors"
            onClick={() => {
              deleteMeeting(meeting.id);
            }}
          >
            {isDeleting ? (
              <Loader size={15} className="text-white animate-spin" />
            ) : (
              <Trash2 size={15} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && meetingDetails && (
        <Modal
          headTitle="Meeting Details"
          subHeadTitle=""
          buttonDisabled={false}
          handleCancel={() => setIsModalOpen(false)}
          w="max-w-5xl"
          handleConfirm={() => setIsModalOpen(false)}
        >
          <div className="space-y-6">
            {/* Header Section */}
            <div className="border-b border-border pb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {meetingDetails.session_title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={statusLabel as MeetingStatus} />
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      {isVirtual ? (
                        <Video size={14} className="text-blue-500 dark:text-blue-400" />
                      ) : (
                        <Users size={14} className="text-purple-500 dark:text-purple-400" />
                      )}
                      {isVirtual ? "Virtual Meeting" : "In-Person Meeting"}
                    </span>
                  </div>
                </div>
              </div>
              {meetingDetails.description && (
                <p className="text-muted-foreground mt-4 leading-relaxed">
                  {meetingDetails.description}
                </p>
              )}
            </div>

            {/* Meta Info Card */}
            <div className="p-2">
              <div className="flex items-start gap-3 text-xs text-muted-foreground">
                <div className="flex justify-between py-1.5">
                  <span className="font-medium">Created:</span>
                  <span>
                    {formatISODate(meetingDetails.created_at)} at{" "}
                    {formatISOTime(meetingDetails.created_at)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="font-medium">Last Updated:</span>
                  <span>
                    {formatISODate(meetingDetails.updated_at)} at{" "}
                    {formatISOTime(meetingDetails.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4 border border-border rounded-lg bg-card/50">
                {/* Date & Time Card */}
                <div className="rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-lg p-2.5">
                      <Calendar size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Date & Time
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-foreground font-medium">
                          {formatISODate(meetingDetails.start_time)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-primary" />
                          <p className="text-sm text-muted-foreground">
                            {formatISOTime(meetingDetails.start_time)}
                            {meetingDetails.end_time
                              ? ` — ${formatISOTime(meetingDetails.end_time)}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="rounded-xl p-5 border-t border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-muted rounded-lg p-2.5">
                      <MapPin size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2">
                        Location
                      </h4>
                      <p className="text-sm text-foreground">
                        {meetingDetails.location ||
                          (isVirtual ? "Online" : "TBD")}
                      </p>
                      {meetingDetails.zoom_link && (
                        <a
                          href={meetingDetails.zoom_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-primary hover:text-primary/80 bg-background px-4 py-2 rounded-lg border border-border transition-all"
                        >
                          <Video size={14} />
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-muted/30 border border-border rounded-lg">
                {/* Invitees Card */}
                <div className="rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary rounded-lg p-2.5">
                      <Users2 size={20} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Invitees ({meetingDetails.invitees?.length || 0})
                      </h4>
                      <ul className="space-y-3">
                        {meetingDetails.invitees &&
                        meetingDetails.invitees.length > 0 ? (
                          meetingDetails.invitees.map((inv) => (
                            <li
                              key={inv.id}
                              className="flex items-start gap-3 bg-card rounded-lg p-3 border border-border"
                            >
                              <div className="bg-primary/10 rounded-full p-2">
                                <User size={14} className="text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {inv.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {inv.email}
                                </p>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground italic">
                            No invitees
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

// Main Component
const MeetingScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [editMeetingData, setEditMeetingData] =
    useState<MeetingSchedule | null>(null);
  const { meetingSchedules } = useSupervisorDataStore();
  const [openModal, setOpenModal] = useState(false);

  usePageTile("ThesisFlow - Meeting Scheduler");
  useEffect(() => {
    console.log("Meeting Schedules:", meetingSchedules);
  }, []);

  const scheduleTab = [
    {
      title: `Upcoming (${meetingSchedules?.filter((m) => m.status === "pending").length || 0})`,
      id: "upcoming",
    },
    {
      title: `On-going (${meetingSchedules?.filter((m) => m.status === "ongoing").length || 0})`,
      id: "ongoing",
    },
    {
      title: `Past (${
        meetingSchedules?.filter(
          (m) =>
            m.status === "completed" ||
            m.status === "rejected" ||
            m.status === "cancelled",
        ).length || 0
      })`,
      id: "past",
    },
  ];

  const filteredMeetings = meetingSchedules?.filter((meeting) => {
    return activeTab === "upcoming"
      ? meeting.status === "pending"
      : activeTab === "ongoing"
        ? meeting.status === "ongoing"
        : meeting.status === "completed" ||
          meeting.status === "rejected" ||
          meeting.status === "cancelled";
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Header
            title="Meeting Scheduler"
            subtitle="Manage your meetings with students"
          />

          <SolidButton
            title={"Schedule New Meeting"}
            onClick={() => setOpenModal(true)}
            className="mb-5"
          />
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
        <div className="space-y-4">
          <div className="lg:row-1 lg:col-span-1">
            <div className="bg-card min-h-170 border border-border rounded-lg p-4">
              {/* <Header
                title="Your Schedule"
                subtitle="Manage your upcoming meetings with students"
              /> */}
              <h3 className="text-lg font-cal-sans tracking-wide text-muted-foreground mb-4">
                Your Schedule
              </h3>

              <div className="mb-4">
                <NavTab
                  activeTab={activeTab}
                  selectors={scheduleTab}
                  onTabChange={setActiveTab}
                />
              </div>

              <div className="space-y-3">
                {filteredMeetings.map((meeting) => {
                  return (
                    <MeetingItem
                      key={meeting.id}
                      meeting={meeting}
                      onOpenMeetingScheduler={setOpenModal}
                      setEditMeetingData={setEditMeetingData}
                    />
                  );
                })}

                {filteredMeetings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    {/* <Calendar
                      size={48}
                      className="mx-auto mb-4 text-muted-foreground/30"
                    /> */}
                    <p>No {activeTab} meetings found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {openModal && (
            <Modal
              headTitle={
                editMeetingData
                  ? "Update a meeting schedule"
                  : "Create a meeting schedule"
              }
              subHeadTitle=""
              buttonDisabled={false}
              handleCancel={() => {
                setEditMeetingData(null);
                setOpenModal(false);
              }}
              w="max-w-5xl"
              handleConfirm={() => {
                setEditMeetingData(null);
                setOpenModal(false);
              }}
            >
              <div className="bg-card">
                <ScheduleMeetingForm
                  editMeetingData={editMeetingData}
                  setEditMeetingData={setEditMeetingData}
                  onClose={() => setOpenModal(false)}
                />
              </div>
            </Modal>
          )}

          {/* <div className={"lg:col-span-2"}>
            <CreateZoomMeeting />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduler;
