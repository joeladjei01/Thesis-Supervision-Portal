// import React from 'react';
// import Header from "../../shared/text/Header";

interface Activity {
  date: string;
  activity: string;
  user: string;
  status: "Approved" | "Completed" | "Pending" | "Successful";
}

type recentActivitiesProps = {
  data: Activity[];
};

const RecentActivitiesTable = ({ data }: recentActivitiesProps) => {
  // const activities: Activity[] = [
  //   {
  //     date: '22-05-2025',
  //     activity: 'Topic submission approved',
  //     user: 'Dora (Student)',
  //     status: 'Approved'
  //   },
  //   {
  //     date: '16-04-2025',
  //     activity: 'Supervisor reassignment',
  //     user: 'Martin Freeman (Student)',
  //     status: 'Completed'
  //   },
  //   {
  //     date: '2-05-2025',
  //     activity: 'Progress report review',
  //     user: 'Prof. Mensah (Supervisor)',
  //     status: 'Pending'
  //   },
  //   {
  //     date: '10-05-2025',
  //     activity: 'Bulk student upload',
  //     user: 'Admin',
  //     status: 'Successful'
  //   }
  // ];

  const getStatusBadge = (status: Activity["status"]) => {
    const statusStyles = {
      Approved: "bg-green-100 text-green-800 border-green-200",
      Completed: "bg-blue-100 text-blue-800 border-blue-200",
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Successful: "bg-cyan-100 text-cyan-800 border-cyan-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl">
      <div className="overflow-hidden">
        <div className="grid grid-cols-4 gap-4 pb-4 mb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-blue-700">Date</h3>
          <h3 className="text-lg font-semibold text-blue-700">Activity</h3>
          <h3 className="text-lg font-semibold text-blue-700">User</h3>
          <h3 className="text-lg font-semibold text-blue-700">Status</h3>
        </div>

        <div className="space-y-4">
          {data.map((activity, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 rounded-lg px-2 items-center"
            >
              <span className="text-blue-700 font-medium">{activity.date}</span>
              <span className="text-blue-700 font-medium">
                {activity.activity}
              </span>
              <span className="text-blue-700 font-medium">{activity.user}</span>
              <div className="flex justify-start">
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivitiesTable;
