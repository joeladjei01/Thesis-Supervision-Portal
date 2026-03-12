import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  MdLogout as ArrowLeftEndOnRectangleIcon,
  MdMenu as Bars3Icon,
  MdOutlineNotifications as BellIcon,
  MdOutlineCalendarToday as CalendarIcon,
  MdOutlinePieChart as ChartPieIcon,
  MdOutlineContentCopy as DocumentDuplicateIcon,
  MdOutlineFolder as FolderIcon,
  MdOutlineHome as HomeIcon,
  MdOutlinePeople as UsersIcon,
  MdClose as XMarkIcon,
  MdKeyboardArrowDown as ChevronDownIcon,
} from "react-icons/md";
import { NavLink, Outlet } from "react-router";
import logo from "../../../assets/UG_LOGO_FULL.png";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import userStore from "../../../store/index";

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { reset, userInfo } = userStore();

  const navigation =
    userInfo.role === "53403"
      ? [
          { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
          {
            name: "Add User",
            href: "/add-user",
            icon: UsersIcon,
            current: false,
          },
          {
            name: "Progress Monitor",
            href: "/progress-monitor",
            icon: ChartPieIcon,
            current: false,
          },
        ]
      : userInfo.role === "07358"
      ? [
          { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
          {
            name: "My Submissions",
            href: "/submissions",
            icon: FolderIcon,
            current: false,
          },
          {
            name: "Supervisor Feedback",
            href: "/feedback",
            icon: DocumentDuplicateIcon,
            current: false,
          },
          {
            name: "Meetings",
            href: "/meetings",
            icon: CalendarIcon,
            current: false,
          },
        ]
      : userInfo.role === "13278"
      ? [
          { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
          {
            name: "Topic Approval",
            href: "/topic-approval",
            icon: UsersIcon,
            current: false,
          },
          {
            name: "Chapter Assignment",
            href: "/chapter-assignment",
            icon: FolderIcon,
            current: false,
          },
          {
            name: "Review Submissions",
            href: "/review-submissions",
            icon: DocumentDuplicateIcon,
            current: false,
          },
          {
            name: "Schedule Meetings",
            href: "/schedule-meetings",
            icon: CalendarIcon,
            current: false,
          },
        ]
      : userInfo.role === "57385"
      ? [
          { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
          {
            name: "Supervisor Assignments",
            href: "/supervisor-assignments",
            icon: UsersIcon,
            current: false,
          },
          {
            name: "Add User",
            href: "/add-user",
            icon: UsersIcon,
            current: false,
          },
          {
            name: "Progress Monitoring",
            href: "/progress-monitoring",
            icon: ChartPieIcon,
            current: false,
          },
        ]
      : [];
  const axiosPrivate = useAxiosPrivate();
  function handleLogout() {
    axiosPrivate
      .post("accounts/auth/sign-out/")
      .then(() => {
        toast.success("Logout successful!");
        reset(); // Reset user state in the store
        // Handle successful logout, e.g., redirect to login page
      })
      .catch(() => {
        toast.success("Logout succefull");
        reset();
      });
  }

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
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
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto ug-blue-background py-4">
                <div className="flex h-16 shrink-0 justify-center mb-4">
                  <img
                    alt="UG logo"
                    src={logo}
                    className="h-16 w-4/5 bg-white"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <NavLink
                              to={item.href}
                              className={({ isActive }) =>
                                classNames(
                                  isActive
                                    ? "bg-gradient-to-r from-blue-50/60 to-90% to-blue-50/2 text-white border-l-3 border-blue-50"
                                    : "text-indigo-200 hover:bg-blue-400/20 hover:text-white",
                                  "group flex gap-x-3 p-2 pl-4 text-sm/6 font-semibold"
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
                                      "size-6 shrink-0"
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
                    <li>
                      <div className="text-xs/6 font-semibold text-indigo-200">
                        Your teams
                      </div>
                    </li>
                    <li className="mt-auto px-2">
                      <button
                        className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 active:bg-blue-700 hover:text-white"
                        onClick={handleLogout}
                      >
                        <ArrowLeftEndOnRectangleIcon
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

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto ug-blue-background pb-4">
            <div className="flex h-16 shrink-0 justify-center mt-2 mb-4 px-6">
              <img alt="UG logo" src={logo} className="h-16 w-11/12 bg-white" />
            </div>
            <nav className="flex flex-1 flex-col">
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
                              "group flex gap-x-3 py-2 pl-6 text-sm/6 font-semibold"
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
                                  "size-6 shrink-0"
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
                {/* <li>
                  <div className="text-xs/6 font-semibold text-indigo-200">
                    Your teams
                  </div>
                </li> */}
                <li className="mt-auto px-4">
                  <button
                    className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer text-indigo-200 hover:bg-blue-700 hover:text-white"
                    onClick={handleLogout}
                  >
                    <ArrowLeftEndOnRectangleIcon
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

        <div className="lg:pl-60">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-blue-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

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
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="relative flex items-center">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {/* <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-8 rounded-full bg-gray-50"
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        Tom Cook
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span> */}
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10 max-w-7xl mx-auto">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
