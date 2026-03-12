import usePageTile from "../../hooks/usePageTitle";
import Header from "../../components/shared/text/Header";
// import React from "react";
import DashboardCard from "../../components/dashboards/dashb/DashboardCard";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Book,
  GraduationCap,
  MessageCircleMore,
  School,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { FaUserShield } from "react-icons/fa";
import { greeting } from "../../utils/helpers";
import useRequestStore from "../../store/useRequestStore";

function AdminDashboard() {
  usePageTile("Admin dashboard");
  const { adminRequests } = useRequestStore();
  const axios = useAxiosPrivate();

  const { data: allUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get("/accounts/");
        console.log("All users data:", data);
        return data.data;
      } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
      }
    },
  });

  const DEPARTMENT = import.meta.env.VITE_DEPARTMENT_ROLE;
  const ADMIN = import.meta.env.VITE_ADMIN_ROLE;
  const STUDENT = import.meta.env.VITE_STUDENT_ROLE;
  const SUPERVISOR = import.meta.env.VITE_SUPERVISOR_ROLE;

  const statData = [
    {
      headTitle: "Total # of Admins",
      metric: allUsers?.filter((user) => user.role === ADMIN).length || 0,
      footer: "Admins in the system",
      Icon: User2Icon,
    },
    {
      headTitle: "Total # of Departments",
      metric: allUsers?.filter((user) => user.role === DEPARTMENT).length || 0,
      footer: "Departments onboarded",
      Icon: School,
    },
    {
      headTitle: "Total # of Supervisors",
      metric: allUsers?.filter((user) => user.role === SUPERVISOR).length || 0,
      footer: "Supervisors in the system",
      Icon: Book,
    },
    {
      headTitle: "Total # of Students",
      metric: allUsers?.filter((user) => user.role === STUDENT).length || 0,
      footer: "Students in the system",
      Icon: GraduationCap,
    },
    {
      headTitle: "Total # of Requests",
      metric: adminRequests?.length || 0,
      footer: "Requests awaiting your action",
      Icon: MessageCircleMore,
    },
    {
      headTitle: "Total # of Completed Students",
      metric: 0,
      footer: "Students completed program",
      Icon: Users2Icon,
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2  items-center p-2 pb-4 border-b border-gray-200 mb-6">
        <div className="self- bg-sky-900 dark:bg-card size-24 p-3 rounded-md flex items-center justify-center mr-4">
          <FaUserShield size={45} className="text-white " />
        </div>
        <div>
          <Header
            title={`${greeting()} Administrator,`}
            subtitle="Welcome to the admin dashboard. Here you can find an overview of the system's statistics and manage various aspects of the platform."
          />
        </div>
      </div>
      <div className={"mb-4"}>
        <div className="flex flex-wrap justify-center gap-4">
          {statData.map((data) => (
            <DashboardCard
              key={data.headTitle}
              title={data.headTitle}
              number={parseInt(data.metric)}
              subTitle={data.footer}
              Icon={data.Icon}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
