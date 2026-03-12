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
      ? "bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
      : "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs";
  };

  const getTypeBadge = (type: string) => {
    return type === "virtual"
      ? "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
      : "bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs";
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
        <div className="mb-8">
          <Header title="Meetings" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Your Meetings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">

            <div className="p-6">
              <Header title="Your Meetings" subtitle="Scheduled and past meetings with your supervisor" />

              {/* Tabs */}
              <div className="mb-6">
                <NavTab selectors={Tabs} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              {/* Meetings List */}
              <div className="space-y-4">
                {(activeTab === "upcoming"
                  ? upcomingMeetings
                  : pastMeetings
                ).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium text-sm">
                        {meeting.day}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {meeting.title}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {meeting.supervisor}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {meeting.date}
                          </span>
                          <Clock className="w-3 h-3 text-gray-400 ml-2" />
                          <span className="text-xs text-gray-600">
                            {meeting.time}
                          </span>
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

          {/* Request a Meeting */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Request a Meeting
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Schedule time with your supervisor
              </p>

              <div>
                <RequestMeeting />
              </div>
            </div>
          </div>
        </div>

        {/* Active Teams/Zoom Sessions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Video className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Active Teams/Zoom Sessions
              </h2>
            </div>

            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {session.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {session.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {session.status === "started"
                          ? "Session started"
                          : "Session started 10 mins ago"}
                      </span>
                      <span className="text-xs text-green-600">
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
    </div>
  );
};

export default StudentMeetings;
