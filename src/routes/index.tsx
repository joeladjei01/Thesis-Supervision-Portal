import { createBrowserRouter } from "react-router";
import Login from "../components/auth/login/Login";
import Protected from "../components/auth/protected";
import ResetPassword from "../components/auth/reset-password/ResetPassword";
import ResetPasswordRequest from "../components/auth/reset-password/ResetPasswordRequest";
import PageNotFound from "../components/shared/errors/PageNotFound";
import RouteErrorElement from "../components/shared/errors/RouteErrorElement";
import RootLayout from "../layouts/RootLayout";
import Auth from "../pages/auth/Auth";
import AddUser from "../pages/dashboard/AddUser";
import MainDashboard from "../pages/dashboard/MainDashboard";
import SupervisorAssignments from "../pages/department/supervisor-assignment/SupervisorAssignments";
import TopicProposalsPage from "../pages/supervisor/TopicApproval";
import ChapterAssignment from "../pages/supervisor/ChapterAssignment";
import ReviewSubmissions from "../pages/supervisor/StudentSubmission";
import StudentSubmissionsDetail from "../pages/supervisor/StudentSubmissionsDetail";
import MeetingScheduler from "../pages/supervisor/MeetingScheduler";
import ChapterReviewPage from "../pages/supervisor/ChapterReviewPage";
import MySubmissions from "../pages/student/StudentSubmissions";
import SupervisorFeedbacks from "../pages/student/SupervisorFeedbacks";
import StudentMeetings from "../pages/student/StudentMeetings";
import ChangePassword from "../components/auth/change-password";
import Settings from "../pages/dashboard/Settings";
import Request from "../pages/dashboard/Request";
import RequestLayout from "../layouts/RequestLayout";
import ChatArea from "../components/request/ChatArea";
import ProgressMonitor from "../pages/dashboard/ProgressMonitor";
import UserMangement from "../pages/admin/UserMangement";
import EditDepartment from "../components/admin/EditDepartment";
import ActivityLogs from "../pages/admin/ActivityLogs";
import StudentSubmitChapter from "../pages/student/StudentSubmitChapter";
import StudentSupervisors from "../pages/student/StudentSupervisors";
import SupervisorChapterManagement from "../pages/supervisor/SupervisorChapterManagement";
import DepartmentProgressMonitor from "../pages/department/DepartmentProgressMonitor";
import ActivityLogsByUser from "../pages/admin/ActivityLogsByUser";
import AdminProgressMonitorDetails from "../pages/admin/AdminProgressMonitorDetails";
import SupervisorStudents from "../pages/supervisor/SupervisorStudents";
import DocumentViewer from "../pages/document/DocumentViewer";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected
        allowRoles={["53403", "13278", "53403"]}
        children={<RootLayout />}
      />
    ),
    errorElement: <RouteErrorElement />,
    children: [
      {
        // path: "dashboard",
        index: true,
        element: <MainDashboard />,
      },
      {
        path: "add-user",
        element: <AddUser />,
      },
      {
        path: "user-management",
        element: <UserMangement />,
      },
      {
        path: "user-management/edit-user/:id",
        element: <EditDepartment />,
      },
      {
        path: "progress-monitoring",
        element: <ProgressMonitor />,
      },
      {
        path: "progress-monitoring/:id",
        element: <AdminProgressMonitorDetails />,
      },
      {
        path: "department-progress-monitor",
        element: <DepartmentProgressMonitor />,
      },
      {
        path: "activity-logs",
        element: <ActivityLogs />,
      },
      {
        path: "activity-logs/:id",
        element: <ActivityLogsByUser />,
      },
      {
        path: "supervisor-assignments",
        element: <SupervisorAssignments />,
      },
      {
        path: "supervisor-students",
        element: <SupervisorStudents />,
      },
      {
        path: "topic-submissions",
        element: <TopicProposalsPage />,
      },
      {
        path: "chapter-submissions",
        element: <ChapterAssignment />,
      },
      {
        path: "review-submissions",
        element: <ReviewSubmissions />,
      },
      {
        path: "supervisor/student/:studentId/submissions",
        element: <StudentSubmissionsDetail />,
      },
      {
        path: "supervisor/chapter-review/:chapterId",
        element: <ChapterReviewPage />,
      },
      {
        path: "schedule-meetings",
        element: <MeetingScheduler />,
      },
      {
        path: "submissions",
        element: <MySubmissions />,
      },
      {
        path: "submissions/chapter/:id",
        element: <StudentSubmitChapter />,
      },
      {
        path: "feedback",
        element: <SupervisorFeedbacks />,
      },
      {
        path: "chapter-management",
        element: <SupervisorChapterManagement />,
      },
      {
        path: "meetings",
        element: <StudentMeetings />,
      },
      {
        path: "requests",
        element: <RequestLayout />,
        children: [
          {
            index: true,
            element: <Request />,
          },
          {
            path: ":id",
            element: <ChatArea />,
          },
        ],
      },
      {
        path: "supervisors",
        element: <StudentSupervisors />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  {
    errorElement: <RouteErrorElement />,
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Auth children={<Login />} />,
        index: true,
      },
      {
        path: "reset-password-request",
        element: <Auth children={<ResetPasswordRequest />} />,
      },
      {
        path: "reset-password",
        element: <Auth children={<ResetPassword />} />,
      },
      {
        path: "change-password",
        element: <Auth children={<ChangePassword />} />,
      },
    ],
  },
  {
    path: "/document-viewer",
    element: <DocumentViewer />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
