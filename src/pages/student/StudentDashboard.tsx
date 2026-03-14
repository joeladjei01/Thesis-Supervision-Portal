import React, { useState, useEffect } from "react";
import {
  Clock,
  Upload,
  Calendar,
  FileText,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import UpcomingMeetings from "../../components/student/UpcomingMeetings";
import SolidButton from "../../components/shared/buttons/SolidButton";
import ProjectOverview from "../../components/student/ProjectOverview";
import usePageTile from "../../hooks/usePageTitle";
import userStore from "../../store";
import { useStudentDataStore } from "../../store/useStudentDataStore";
import DashboardCard from "../../components/dashboards/dashb/DashboardCard";
import Header from "../../components/shared/text/Header";
import {
  formatDate,
  getChaperById,
  getDaysLeft,
  greeting,
} from "../../utils/helpers";
import useChapterStore from "../../store/useChapterStore";
import { useNavigate } from "react-router";

// Types and Interfaces (Interface Segregation Principle)
interface IProjectPhase {
  id: string;
  name: string;
  status:
    | "approved"
    | "in-progress"
    | "not-started"
    | "reject"
    | "revise"
    | "due";
  startDate?: string;
  endDate?: string;
}

interface IProject {
  id: string;
  title: string;
  supervisor: string;
  phases: IProjectPhase[];
}

interface IMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "progress-review" | "methodology" | "presentation" | "general";
  attendees: string[];
}

interface IMeetingService {
  getMeetings(studentId: string): Promise<IMeeting[]>;
  scheduleMeeting(meeting: Omit<IMeeting, "id">): Promise<IMeeting>;
}

class MeetingService implements IMeetingService {
  async getMeetings(_studentId: string): Promise<IMeeting[]> {
    return [
      {
        id: "1",
        title: "Project Progress Review",
        date: "03.05.2025",
        time: "10:00 AM",
        type: "progress-review",
        attendees: ["Dr. Sarah Williams", "Student"],
      },
      {
        id: "2",
        title: "Research Methodology Discussion",
        date: "03.05.2025",
        time: "1:00 PM",
        type: "methodology",
        attendees: ["Dr. Sarah Williams", "Dr. John Smith", "Student"],
      },
    ];
  }

  async scheduleMeeting(meeting: Omit<IMeeting, "id">): Promise<IMeeting> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { ...meeting, id: Date.now().toString() };
  }
}

// UI Components (Single Responsibility Principle)

// Next Deadline Component
interface NextDeadlineProps {
  deadline: any;
  onUploadClick: (chapter: any) => void;
}

const NextDeadline: React.FC<NextDeadlineProps> = ({
  deadline,
  onUploadClick,
}) => {
  return (
    <div className="w-full h-fit bg-card rounded-xl shadow-sm border border-border p-4">
      <h2 className="text-xl font-bold text-foreground mb-3">Next Deadline</h2>

      <div className="bg-muted rounded-lg p-4 mb-4 border border-border/50">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              {deadline.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Due: {formatDate(deadline.dueDate)}
            </p>
          </div>
        </div>
      </div>

      <SolidButton
        title={
          <>
            <Upload className="w-5 h-5" />
            Upload Submission
          </>
        }
        onClick={() => onUploadClick(deadline)}
        className="w-full gap-3 py-3"
      />
    </div>
  );
};

// Main Dashboard Component (Composition)
const StudentDashboard: React.FC = () => {
  const [meetings, setMeetings] = useState<IMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { person } = userStore();
  usePageTile("Student - Dashboard");
  const navigate = useNavigate();
  const setSelectedChapter = useChapterStore(
    (state) => state.setSelectedChapter
  );
  const { chapters, feedbacks, submissions, topics } = useStudentDataStore();

  const stats = [
    {
      title: "Submissions",
      metric: submissions?.length || 0,
      footer: "",
      Icon: Upload,
    },
    {
      title: "Feedbacks",
      metric: feedbacks?.length || 0,
      footer: "Feedbacks from superviors ",
      Icon: MessageSquare,
    },
    // {
    //   title: "Chapters",
    //   metric : chapters?.length || 0,
    //   footer: "Assigned Chapters",
    //   Icon: FileText
    // },
    {
      title: "Upcoming meetings",
      metric: 2,
      footer: "",
      Icon: Calendar,
    },
  ];

  const meetingService = new MeetingService();

  const studentId = "1"; // This would come from authentication conte

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [meetingsData] = await Promise.all([
        meetingService.getMeetings(studentId),
      ]);

      setMeetings(meetingsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const submittedSubmission = (chapter) => {
    return submissions?.filter(
      (sub) => sub.chapter_assignment.id === chapter?.id
    );
  };

  const getStatusText = (feedbackChapter, chapter) => {
    if (feedbackChapter?.decision == "approved") {
      return "approved";
    } else if (feedbackChapter?.decision === "reject") {
      return "reject";
    } else if (feedbackChapter?.decision === "revise") {
      return "revise";
    } else {
      const isSubmitted = submittedSubmission(chapter);
      if (isSubmitted.length > 0) {
        return "in-progress";
      } else {
        const dayleft = getDaysLeft(chapter.due_date) <= 0;
        if (dayleft) {
          return "due";
        }
        return "not-started";
      }
    }
  };

  const completedSubmission = (chapter) => {
    const comp = feedbacks?.find(
      (f) => f.chapter.chapter_assignment.id == chapter?.id
    );
    return comp;
  };

  const ProjectProgress: IProject = {
    id: person?.id,
    title:
      topics?.find((t) => t.status == "approved")?.title || "No Approved Topic",
    supervisor:
      topics?.find((t) => t.status == "approved")?.supervisor.name || "N/A",
    phases: chapters.map((chapter) => ({
      id: chapter?.id,
      name: `${chapter.chapter?.custom_title} - ${chapter.chapter?.custom_description}`,
      status: getStatusText(completedSubmission(chapter), chapter),
    })),
  };

  const getNextDeadline = () => {
    const chaptersDealines = chapters.map((chapter) => ({
      ...chapter,
      title: chapter.chapter?.custom_title,
      dueDate: chapter.created_at,
      days: getDaysLeft(chapter.created_at),
    }));

    const notSubmittedChapters = submissions.map(
      (sub) => sub.chapter_assignment.id
    );
    const filteredChapters = chaptersDealines.filter(
      (chapter) => !notSubmittedChapters.includes(chapter.id)
    );

    const sortedDeadlines = filteredChapters.sort((a, b) => a.days - b.days);
    console.log("Sorted Deadlines: ", sortedDeadlines[0]);

    const negDays = sortedDeadlines.find((d) => d.days >= 0);

    return negDays || null;
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleViewAllMeetings = () => {
    // This would typically navigate to meetings page
    console.log("Navigating to meetings page...");
    alert("View all meetings functionality would be implemented here");
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    navigate(`/submissions/chapter/${chapter.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8 border-b border-border">
        <Header
          Icon={GraduationCap}
          title={`${greeting()}, ${person.name}`}
          iconSize={43}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {stats.map((stat) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            number={stat.metric}
            Icon={stat.Icon}
            subTitle={stat.footer}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="">
        {topics && (
          <div className="mb-7">
            <ProjectOverview project={ProjectProgress} />
          </div>
        )}

        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
          {getNextDeadline() && (
            <NextDeadline
              deadline={getNextDeadline()}
              onUploadClick={handleChapterSelect}
            />
          )}
          <UpcomingMeetings
            meetings={meetings}
            onViewAllClick={handleViewAllMeetings}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
