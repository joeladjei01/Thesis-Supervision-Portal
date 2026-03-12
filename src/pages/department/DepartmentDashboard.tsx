// import DepartmentOnboardingStatus from "../../components/stats/admin-stats/DepartmentOnboardingStatus";
// import SGSAdminAccounts from "../../components/stats/admin-stats/SGSAdminAccounts";
import usePageTile from "../../hooks/usePageTitle";
import DashboardCard from "../../components/dashboards/dashb/DashboardCard";
import Header from "../../components/shared/text/Header";
// import React from "react";
import DashBoardChart from "../../components/dashboards/dashb/DashBoardChart";
import userStore from "../../store";
import {
  icons,
  MessageCircleMoreIcon,
  PenLine,
  School,
  User,
  Users2Icon,
} from "lucide-react";
import { accountType, isInstitute } from "../../utils/helpers";
import { useDepartmentDataStore } from "../../store/useDepartmentDataStore";
import { MdSupervisorAccount } from "react-icons/md";
import { FaCertificate } from "react-icons/fa";

interface dataType {
  supervisor: string;
  students: number;
}

const DepartmentDashboard = () => {
  const { students, supervisors, requests, researchAreas, programTitles } =
    useDepartmentDataStore();
  usePageTile("Department - Dashboard");
  const { person, userInfo } = userStore();

  const chartData: dataType[] = supervisors?.map((supervisor) => ({
    supervisor: supervisor.name,
    students: supervisor.current_load,
  }));

  const data = [
    {
      headTitle: "Total # of Supervisors",
      metric: supervisors?.length || 0,
      footer: "Supervisors in the department",
      Icon: MdSupervisorAccount,
    },
    {
      headTitle: "Total # of Students",
      metric: students?.length || 0,
      footer: "Students in the department",
      Icon: User,
    },
    {
      headTitle: "Total # of Completed Students",
      metric: 0,
      footer: "Students completed program",
      Icon: Users2Icon,
    },
    {
      headTitle: "Total # of Programs",
      metric: programTitles?.length || 0,
      footer: "Programs offered",
      Icon: FaCertificate,
    },
    {
      headTitle: "Total # of Research Topics",
      metric: researchAreas?.length || 0,
      footer: "Active research topics",
      Icon: PenLine,
    },
    {
      headTitle: "Total # of Requests",
      metric: requests?.length || 0,
      footer: `Requests from Students`,
      Icon: MessageCircleMoreIcon,
    },
  ];

  return (
    <>
      <div className={"mb-4"}>
        <div className="border-b border-gray-200 mb-4">
          <Header
            title={`${isInstitute(person.department.name)
              ? ""
              : person.department.name.includes("Department of")
                ? ""
                : "Department of "
              } ${person.department.name}`}
            subtitle={"Dashboard Overview"}
            Icon={School}
            iconSize={37}
          />
        </div>

        <div className={"flex flex-wrap justify-center gap-4 mt-12"}>
          {data.map((d) => (
            <DashboardCard
              title={d.headTitle}
              number={d.metric}
              subTitle={d.footer}
              Icon={d.Icon}
            />
          ))}
        </div>
      </div>

      <div className={"-full mt-15"}>
        <div
          className={
            "border-2 bg-card grow rounded-xl border-gray-300 dark:border-secondary px-6 py-2"
          }
        >
          <Header
            title={"Supervision Load"}
            subtitle={"Current student distribution per supervisor"}
          />
          <DashBoardChart data={chartData} />
        </div>
      </div>
    </>
  );
};

export default DepartmentDashboard;
