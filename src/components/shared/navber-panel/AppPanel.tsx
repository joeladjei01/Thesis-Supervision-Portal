/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Loader2,
  X,
} from "lucide-react";
import logo from "../../../assets/UG_LOGO_FULL.png";
import { NavLink, useNavigate } from "react-router";
// import { useState } from "react";
import userStore from "../../../store/index";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import useRequestStore from "../../../store/useRequestStore";
import { AiFillFolder, AiFillIeCircle, AiOutlineUsergroupAdd } from "react-icons/ai";
import { useDepartmentDataStore } from "../../../store/useDepartmentDataStore";
import { useStudentDataStore } from "../../../store/useStudentDataStore";
import { useSupervisorDataStore } from "../../../store/useSupervisorDataStore";
import { handleLogout } from "../../../utils/utils";
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaClipboardList, 
  FaComments, 
  FaHome, 
  FaInbox, 
  FaUserPlus, 
  FaChartPie, 
  FaUsers, 
  FaFolderOpen, 
  FaCommentDots, 
  FaEnvelopeOpenText, 
  FaCalendarCheck,
  FaUserGraduate,
  FaLightbulb,
  FaBook,
  FaFileSignature,
  FaChartBar,
} from "react-icons/fa";
import { FaGear, FaMessage, FaSliders, FaUserCheck } from "react-icons/fa6";
import { MdOutlineDocumentScanner, MdRateReview } from "react-icons/md";
import { HiCollection } from "react-icons/hi";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// type appPanelProps = {
//   sidebarOpen: boolean;
//   setSidebarOpen: () => void;
// };

const AppPanel = ({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: any;
  setSidebarOpen: any;
}) => {
  const { reset, userInfo, refreshToken } = userStore();
  const setAllRequests = useRequestStore((state) => state.setAllRequests);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { reset: resetDepartment } = useDepartmentDataStore();
  const { reset: resetStudent } = useStudentDataStore();
  const { reset: resetSupervisor } = useSupervisorDataStore();

  const ADMIN = import.meta.env.VITE_ADMIN_ROLE;
  const SUPERVISOR = import.meta.env.VITE_SUPERVISOR_ROLE;
  const STUDENT = import.meta.env.VITE_STUDENT_ROLE;

  const navigation =
    //Admin
    userInfo.role === "53403"
      ? [
        { name: "Dashboard", href: "/", icon: FaHome, current: true },
        {
          name: "Add User",
          href: "/add-user",
          icon: FaUserPlus,
          current: false,
        },
        {
          name: "User Management",
          href: "/user-management",
          icon: MdOutlineDocumentScanner,
          current: false,
        },
        {
          name: "Activity Logs",
          href: "/activity-logs",
          icon: FaClipboardList,
          current: false,
        },
        {
          name: "Progress Monitor",
          href: "/progress-monitoring",
          icon: FaChartPie,
          current: false,
        },
        {
          name: "Requests",
          href: "/requests",
          icon: FaInbox,
          current: false,
        },
        {
          name: "Settings",
          href: "/settings",
          icon: FaGear,
          current: false,
        },
        {
          name: "User Manual",
          href: "/user-manual",
          icon: AiFillFolder,
          current: false,
        },
      ]
      : // student
      userInfo.role === "07358"
        ? [
          { name: "Dashboard", href: "/", icon: FaHome, current: true },

          {
            name: "My Supervisor(s)",
            href: "/supervisors",
            icon: FaUsers,
            current: false,
          },
          {
            name: "My Submissions",
            href: "/submissions",
            icon: FaFolderOpen,
            current: false,
          },
          {
            name: "Supervisor Feedback",
            href: "/feedback",
            icon: FaCommentDots,
            current: false,
          },

          {
            name: "Requests",
            href: "/requests",
            icon: FaEnvelopeOpenText,
            current: false,
          },
          {
            name: "Meetings",
            href: "/meetings",
            icon: FaCalendarCheck,
            current: false,
          },
          // {
          //   name: "Settings",
          //   href: "/settings",
          //   icon: SettingsIcon,
          //   current: false,
          // },
          {
            name: "User Manual",
            href: "/user-manual",
            icon: AiFillFolder,
            current: false,
          },
        ]
        : // Supervisor
        userInfo.role === "13278"
          ? [
            { name: "Dashboard", href: "/", icon: FaHome, current: true },

            {
              name: "Assigned Students",
              href: "/supervisor-students",
              icon: FaUserGraduate,
              current: false,
            },
            {
              name: "Topic Proposals",
              href: "/topic-submissions",
              icon: FaLightbulb,
              current: false,
            },
            {
              name: "Chapter Assignments",
              href: "/chapter-submissions",
              icon: FaBook,
              current: false,
            },
            {
              name: "Review Submissions",
              href: "/review-submissions",
              icon: FaFileSignature,
              current: false,
            },
            {
              name: "Chapter Settings",
              href: "/chapter-management",
              icon: HiCollection,
              current: false,
            },
            {
              name: "Meetings",
              href: "/schedule-meetings",
              icon: FaCalendarCheck,
              current: false,
            },
            {
              name: "Requests",
              href: "/requests",
              icon: FaEnvelopeOpenText,
              current: false,
            },
            // {
            //   name: "Settings",
            //   href: "/settings",
            //   icon: SettingsIcon,
            //   current: false,
            // },
            {
              name: "User Manual",
              href: "/user-manual",
              icon: AiFillFolder,
              current: false,
            },
          ]
          : userInfo.role === "57385"
            ? [
              { name: "Dashboard", href: "/", icon: FaHome, current: true },
              {
                name: "Add User",
                href: "/add-user",
                icon: AiOutlineUsergroupAdd,
                current: false,
              },
              {
                name: "Supervisor Allocation",
                href: "supervisor-assignments",
                icon: FaUserCheck,
                current: false,
              },
              {
                name: "Progress Monitor",
                href: "/department-progress-monitor",
                icon: FaChartBar,
                current: false,
              },
              {
                name: "Requests",
                href: "/requests",
                icon: FaMessage,
                current: false,
              },
              {
                name: "Settings",
                href: "/settings",
                icon: FaGear,
                current: false,
              },
              {
                name: "User Manual",
                href: "/user-manual",
                icon: AiFillFolder,
                current: false,
              },
            ]
            : [];

  const axiosPrivate = useAxiosPrivate();

  // const handleLogout = async () => {
  //   setLoading(true);
  //   try {
  //     await axiosPrivate.post("/accounts/auth/sign-out/", {
  //       refresh: refreshToken,
  //       email: userInfo.email,
  //     });

  //     navigate("/auth/login", { replace: true });
  //     userInfo.role === STUDENT && resetStudent();
  //     userInfo.role === SUPERVISOR && resetSupervisor();
  //     userInfo.role === ADMIN && resetDepartment();
  //     setAllRequests([]);
  //     reset(); // Reset user state in the store
  //   } catch (error) {
  //     console.log(error);
  //     navigate("/auth/login", { replace: true });
  //     reset();
  //   } finally {
  //     setLoading(false);
  //   }
  //   // axiosPrivate
  //   //     .post("/accounts/auth/sign-out/")
  //   //     .then(() => {
  //   //       navigate("/auth/login" , {replace : true})
  //   //       reset(); // Reset user state in the store
  //   //     })
  //   //     .catch(() => {
  //   //       navigate("/auth/login" , {replace : true})
  //   //       reset();
  //   //     });
  //   // setLoading(false)
  // };

  const { mutate } = useMutation({
    mutationFn: async () => {
      try {
        setLoading(true);
        await handleLogout(
          navigate,
          userInfo,
          refreshToken,
          reset,
          resetDepartment,
          resetStudent,
          resetSupervisor,
          setAllRequests,
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("An Error Occuied");
    },
    onSuccess: () => {
      navigate("/auth/login", { replace: true });
      toast.success("Logout successful!");
    },
  });

  return (
    <>
      {loading && (
        <div
          className={
            "fixed z-60 top-0 right-0 h-[100vh] w-full bg-gray-50/30 flex items-center flex-col gap-3 justify-center"
          }
        >
          <Loader2 className={"w-20 h-20 text-blue-900  animate-spin"} />
          <p className="text-white md:text-blue-950">Signing out..</p>
        </div>
      )}

      <MobileAppPanel
        navigation={navigation}
        logout={mutate}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      <DesktopPanel
        navigation={navigation}
        logout={mutate}
        sidebarOpen={false}
        setSidebarOpen={function (_prev: boolean): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};

export default AppPanel;

type panelProps = {
  navigation: any[];
  logout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (prev: boolean) => void;
};

const MobileAppPanel = ({
  navigation,
  logout,
  sidebarOpen,
  setSidebarOpen,
}: panelProps) => {
  const { userInfo } = userStore();

  const toggleNav = () => {
    setSidebarOpen(!setSidebarOpen);
  };

  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className="relative z-50 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex font-[Jost]">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="-m-2.5 p-2.5"
              >
                <span className="sr-only">Close sidebar</span>
                <X aria-hidden="true" className="size-6 text-white" />
              </button>
            </div>
          </TransitionChild>

          <div className="flex grow flex-col gap-y- overflow-y-auto bg-primary pt-">
            <div className="flex h-16 shrink-0 justify-center bg-white">
              <img
                alt="UG logo"
                src={logo}
                className="h-16 w-full object-contain "
              />
            </div>

            <h3
              className={
                "text-white bg-indigo-200/30 py-3 mb-3 w-full text-center text-lg font-semibold"
              }
            >
              {userInfo.role === "53403" && "Admin Portal"}
              {userInfo.role === "13278" && "Supervisor Portal"}
              {userInfo.role === "57385" && "Department Portal"}
              {userInfo.role === "07358" && "Student Portal"}
            </h3>

            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          onClick={toggleNav}
                          className={({ isActive }) =>
                            classNames(
                              isActive
                                ? "bg-gradient-to-r from-blue-50/60 to-90% to-blue-50/2 text-white border-l-3 border-blue-50"
                                : "text-indigo-200 hover:bg-blue-400/20 hover:text-white",
                              "group flex gap-x-3 p-2 pl-4 text-sm/6 font-semibold",
                            )
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive
                                    ? "text-white"
                                    : "text-indigo-200 group-hover:text-white",
                                  "size-6 shrink-0",
                                )}
                              />
                              {item.name}
                            </>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto px-2">
                  <button
                    className="group cursor-pointer flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 active:bg-blue-300/20 hover:text-white"
                    onClick={logout}
                  >
                    <FaArrowLeft
                      aria-hidden="true"
                      className="size-6 shrink-0 text-indigo-200 group-hover:text-white"
                    />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const DesktopPanel = ({ navigation, logout }: panelProps) => {
  const { userInfo } = userStore();
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col overflow-y-auto bg-primary pb-4 font-[Jost]">
          <div className="flex h-16 shrink-0 justify-center px-2 bg-white">
            <img
              alt="UG logo"
              src={logo}
              className="h-14 w-full mt-1 object-contain"
            />
          </div>

          <h3
            className={
              "text-white bg-indigo-200/30 py-3 mb-3 w-full text-center text-lg font-semibold"
            }
          >
            {userInfo.role === "53403" && "Admin Portal"}
            {userInfo.role === "13278" && "Supervisor Portal"}
            {userInfo.role === "57385" && "Department Portal"}
            {userInfo.role === "07358" && "Student Portal"}
          </h3>

          <nav className="flex flex-1 flex-col mt-">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className=" space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-gradient-to-r from-blue-50/60 to-90% to-blue-50/2 text-white border-l-3 border-blue-50"
                              : "text-indigo-200 hover:bg-blue-400/20 hover:text-white",
                            "group flex gap-x-3 py-2 pl-6 text-sm/6 font-semibold",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {" "}
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                isActive
                                  ? "text-white"
                                  : "text-indigo-200 group-hover:text-white",
                                "size-5 shrink-0",
                              )}
                            />
                            {item.name}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="mt-auto px-4">
                <button
                  className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer text-indigo-200 hover:bg-blue-300/20 hover:text-white"
                  onClick={logout}
                >
                  <FaArrowLeft
                    aria-hidden="true"
                    className="size-6 shrink-0 text-indigo-200 group-hover:text-white"
                  />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
