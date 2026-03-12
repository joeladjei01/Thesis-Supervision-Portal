import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import userStore from "../../../store";
import useRequestStore from "../../../store/useRequestStore";
import { useDepartmentDataStore } from "../../../store/useDepartmentDataStore";
import { useStudentDataStore } from "../../../store/useStudentDataStore";
import { useSupervisorDataStore } from "../../../store/useSupervisorDataStore";
import {
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaChartBar,
  FaChartLine,
  FaClipboardCheck,
  FaClipboardList,
  FaCog,
  FaCommentDots,
  FaComments,
  FaFileAlt,
  FaFileUpload,
  FaHandshake,
  FaHome,
  FaInbox,
  FaKey,
  FaLightbulb,
  FaSignInAlt,
  FaTasks,
  FaUnlockAlt,
  FaUpload,
  FaUserEdit,
  FaUserLock,
  FaUserPlus,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";
import { useLocation } from "react-router";
import { BellRing, MenuIcon } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

type navbarProp = {
  setSidebarOpen: (value: boolean) => void;
  notifiOpen: (value: boolean) => void;
};

const Navbar = ({ setSidebarOpen, notifiOpen }: navbarProp) => {
  const setAllRequests = useRequestStore((state) => state.setAllRequests);
  const { reset: resetDepartment } = useDepartmentDataStore();
  const { reset: resetStudent } = useStudentDataStore();
  const { reset: resetSupervisor } = useSupervisorDataStore();
  const { reset, userInfo } = userStore();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const ADMIN = import.meta.env.VITE_ADMIN_ROLE;
  const SUPERVISOR = import.meta.env.VITE_SUPERVISOR_ROLE;
  const STUDENT = import.meta.env.VITE_STUDENT_ROLE;

  const pages = [
    { path: "/", icon: FaHome, title: "Home" },
    { path: "/add-user", icon: FaUserPlus, title: "Add User" },
    { path: "/user-management", icon: FaUsers, title: "User Management" },
    {
      path: "/user-management/edit-user/:id",
      icon: FaUserEdit,
      title: "Edit User",
    },
    {
      path: "/progress-monitoring",
      icon: FaChartLine,
      title: "Progress Monitoring",
    },
    {
      path: "/supervisor-students",
      icon: FaUsers,
      title: "Supervisor Students",
    },
    {
      path: "/progress-monitoring/:id",
      icon: FaChartLine,
      title: "Progress Monitor Details",
    },
    {
      path: "/department-progress-monitor",
      icon: FaChartBar,
      title: "Department Progress Monitor",
    },
    { path: "/activity-logs", icon: FaClipboardList, title: "Activity Logs" },
    {
      path: "/activity-logs/:id",
      icon: FaClipboardList,
      title: "Activity Logs By User",
    },
    {
      path: "/supervisor-assignments",
      icon: FaUserTie,
      title: "Supervisor Assignments",
    },
    {
      path: "/topic-submissions",
      icon: FaLightbulb,
      title: "Topic Submissions",
    },
    {
      path: "/chapter-submissions",
      icon: FaBook,
      title: "Chapter Assignments",
    },
    {
      path: "/review-submissions",
      icon: FaClipboardCheck,
      title: "Review Submissions",
    },
    {
      path: "/supervisor/student/:studentId/submissions",
      icon: FaFileAlt,
      title: "Student Submissions Detail",
    },
    {
      path: "/schedule-meetings",
      icon: FaCalendarAlt,
      title: "Schedule Meetings",
    },
    { path: "/submissions", icon: FaFileUpload, title: "My Submissions" },
    {
      path: "/submissions/chapter/:id",
      icon: FaUpload,
      title: "Submit Chapter",
    },
    { path: "/feedback", icon: FaComments, title: "Supervisor Feedback" },
    {
      path: "/chapter-management",
      icon: FaTasks,
      title: "Chapter Management",
    },
    { path: "/meetings", icon: FaHandshake, title: "Meetings" },
    { path: "/requests", icon: FaInbox, title: "Requests" },
    { path: "/requests/:id", icon: FaCommentDots, title: "Request Chat" },
    { path: "/supervisors", icon: FaChalkboardTeacher, title: "Supervisors" },
    { path: "/settings", icon: FaCog, title: "Settings" },
    { path: "/auth/login", icon: FaSignInAlt, title: "Login" },
    {
      path: "/auth/reset-password-request",
      icon: FaKey,
      title: "Reset Password Request",
    },
    {
      path: "/auth/reset-password",
      icon: FaUnlockAlt,
      title: "Reset Password",
    },
    {
      path: "/auth/change-password",
      icon: FaUserLock,
      title: "Change Password",
    },
  ];

  const pathToRegex = (path: string) =>
    new RegExp(`^${path.replace(/:[^/]+/g, "[^/]+")}$`);

  const handleLogout = async () => {
    axiosPrivate
      .post("accounts/auth/sign-out/")
      .then(() => {
        reset(); // Reset user state in the store
      })
      .catch(() => {
        userInfo.role === STUDENT && resetStudent();
        userInfo.role === SUPERVISOR && resetSupervisor();
        userInfo.role === ADMIN && resetDepartment();
        setAllRequests([]);
        reset();
      });
  };

  const { isPending: loading, mutate } = useMutation({
    mutationFn: handleLogout,
    onError: (error) => {
      toast.error("An Error Occuied");
    },
    onSuccess: () => {
      toast.success("Logout successful!");
    },
  });

  const activePage =
    pages.find((page) => pathToRegex(page.path).test(location.pathname)) ||
    pages[0];

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-blue-50 dark:bg-primary px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <MenuIcon aria-hidden="true" className="size-6" />
      </button>

      {/* Active Page title */}
      <div className="hidden md:flex items-center justify-center gap-2.5">
        {
          <>
            <div className="size-10 rounded-full border border-primary bg-white flex items-center justify-center">
              <activePage.icon size={20} className=" text-primary" />
            </div>
            <h3 className="text-lg font-semibold font-jost  text-sky-950 dark:text-indigo-200">
              {activePage.title}
            </h3>
          </>
        }
      </div>

      {/* Separator */}
      <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                />
              </form> */}
        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Separator */}
          <AnimatedThemeToggler />
          <div
            aria-hidden="true"
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
          />
          <button
            onClick={() => {
              notifiOpen(true);
            }}
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellRing aria-hidden="true" className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
