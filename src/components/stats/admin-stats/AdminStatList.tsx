import AdminStat from "../../../presentational/stats/admin/AdminStat";
import type { AdminStatProps } from "../../../utils/types";
import AdminStatCard from "./AdminStatCard";
function AdminStatList({ data }: { data: AdminStatProps[] }) {
  return (
    <AdminStat>
      {data.map((stat, index) => {
        return (
          <AdminStatCard
            key={index}
            headTitle={stat.headTitle}
            metric={stat.metric}
            footer={stat.footer}
          />
        );
      })}
    </AdminStat>
  );
}

export default AdminStatList;
