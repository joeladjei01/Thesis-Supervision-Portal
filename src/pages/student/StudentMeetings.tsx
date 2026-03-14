import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import usePageTile from "../../hooks/usePageTitle";
import Header from "../../components/shared/text/Header";
import NavTab from "../../components/shared/Tab/NavTab";
import SolidButton from "../../components/shared/buttons/SolidButton";
import RequestMeeting from "../../components/student/RequestMeeting";
import Modal from "@/layouts/Modal";

interface Meeting {
  id: string;
  title: string;
  supervisor: string;
  date: string;
  time: string;
  status: "confirmed" | "pending";
  type: "virtual" | "in-person";
  month: string;
  day: string;
}

interface ActiveSession {
  id: string;
  title: string;
  description: string;
  status: "started" | "available";
  timeStarted?: string;
}

const Tabs = [
  {title: "Upcoming" , id: "upcoming"},
  {title: "Past" , id: "past"},
]

const StudentMeetings: React.FC = () => {
  const [selectedMeetingType, setSelectedMeetingType] = useState<
    "virtual" | "in-person"
  >("virtual");
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [meetingPurpose, setMeetingPurpose] = useState<string>("");
  const [currentMonth, _setCurrentMonth] = useState("May");
  const [displayModal, setDisplayModal] = useState(false)
  usePageTile("Student - Meetings")

  // Sample meetings data
  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Project Progress Review",
      supervisor: "with supervisor",
      date: "2025-06-07",
      time: "10:00 AM",
      status: "confirmed",
      type: "virtual",
      month: "Jun",
      day: "07",
    },
    {
      id: "2",
      title: "Project Progress Review",
      supervisor: "with supervisor",
      date: "2025-05-07",
      time: "10:00 AM",
      status: "confirmed",
      type: "virtual",
      month: "May",
      day: "07",
    },
    {
      id: "3",
      title: "Research Methodology Discussion",
      supervisor: "with supervisor",
      date: "2025-05-10",
      time: "2:30 PM",
      status: "pending",
      type: "in-person",
      month: "May",
      day: "10",
    },
    {
      id: "4",
      title: "Research Methodology Discussion",
      supervisor: "with supervisor",
      date: "2025-05-10",
      time: "2:30 PM",
      status: "pending",
      type: "in-person",
      month: "May",
      day: "10",
    },
    {
      id: "5",
      title: "Project Progress Review",
      supervisor: "with supervisor",
      date: "2025-05-07",
      time: "10:00 AM",
      status: "confirmed",
      type: "virtual",
      month: "May",
      day: "07",
    },
  ];

  const activeSessions: ActiveSession[] = [
    {
      id: "1",
      title: "Progress Review Meeting",
      description: "Dr. Mark has started the zoom session for progress review",
      status: "started",
      timeStarted: "Available now",
    },
    {
      id: "2",
      title: "Weekly Check-in",
      description: "Quick progress update and Q&A session",
      status: "available",
      timeStarted: "Session started 10 mins ago",
    },
  ];

  const upcomingMeetings = meetings.filter(
    (meeting) => new Date(meeting.date) >= new Date()
  );
  const pastMeetings = meetings.filter(
    (meeting) => new Date(meeting.date) < new Date()
  );

  const [activeTab, setActiveTab] = useState("upcoming");

  const getStatusBadge = (status: string) => {
    return status === "confirmed"
      ? "bg-success/10 text-success px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-success/20"
      : "bg-warning/10 text-warning px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-warning/20";
  };

  const getTypeBadge = (type: string) => {
    return type === "virtual"
      ? "bg-primary/10 text-primary px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-primary/20"
      : "bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-purple-500/20";
  };

  // Calendar days for May 2025
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleRequestMeeting = () => {
    // Handle meeting request logic
    console.log("Meeting requested:", {
      type: selectedMeetingType,
      date: selectedDate,
      time: selectedTime,
      purpose: meetingPurpose,
    });
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between">
          <Header title="Meetings" />

          <SolidButton
          title={"Request a meeting"}
          onClick={()=> setDisplayModal(true)}
          />
        </div>

        {/* Main Content Grid */}
        <div className=" mb-8">
          {/* Your Meetings */}
          <div className="rounded-2xl bg-card shadow-sm border border-border overflow-hidden">

            <div className="p-8">
                <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-1">
                    Your Meetings
                </h2>
                <p className="text-muted-foreground text-sm font-medium">
                    Scheduled and past meetings with your supervisor
                </p>
                </div>
              {/* Tabs */}
              <div className="mb-6">
                <NavTab selectors={Tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              {/* Meetings List */}
              <div className="min-h-120 max-h-167 space-y-4 overflow-y-auto">
                {(activeTab === "upcoming"
                  ? upcomingMeetings
                  : pastMeetings
                ).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary font-bold shrink-0 border border-primary/10 group-hover:scale-105 transition-transform">
                        <span className="text-xs uppercase leading-none opacity-70 mb-0.5">{meeting.month}</span>
                        <span className="text-lg leading-none">{meeting.day}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-[15px] mb-0.5">
                          {meeting.title}
                        </h3>
                        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-tight mb-2 opacity-80">
                          {meeting.supervisor}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary/60" />
                            <span className="text-xs text-muted-foreground font-medium">
                                {meeting.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary/60" />
                            <span className="text-xs text-muted-foreground font-medium">
                                {meeting.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className={getStatusBadge(meeting.status)}>
                        {meeting.status.charAt(0).toUpperCase() +
                          meeting.status.slice(1)}
                      </span>
                      <span className={getTypeBadge(meeting.type)}>
                        {meeting.type.charAt(0).toUpperCase() +
                          meeting.type.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          
        </div>

        {/* Active Teams/Zoom Sessions */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                    Active Teams/Zoom Sessions
                </h2>
                <p className="text-muted-foreground text-sm font-medium">Connect with your supervisor instantly</p>
              </div>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-5 border border-border bg-muted/10 rounded-2xl hover:bg-muted/20 transition-all duration-300"
                >
                  <div className="flex-1 mr-6">
                    <h3 className="font-bold text-foreground text-base mb-1.5">
                      {session.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 font-medium leading-relaxed">
                      {session.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                        {session.status === "started"
                          ? "Session started"
                          : "Session started 10 mins ago"}
                      </span>
                      <span className="text-xs font-semibold text-success flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        {session.timeStarted}
                      </span>
                    </div>
                  </div>

                  <SolidButton
                      title={"Join Session"}
                      onClick={()=> console.log(session.title)}
                      className={"py-2"}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {
        displayModal && 
        <Modal
        headTitle="Request a Meeting"
        subHeadTitle="Schedule time with your supervisor"
        buttonDisabled
        handleConfirm={()=>{}}
        handleCancel={()=>{setDisplayModal(false)}}
        w="max-w-5xl"
        >
<RequestMeeting />
        </Modal>
      }
    </div>
  );
};

export default StudentMeetings;
