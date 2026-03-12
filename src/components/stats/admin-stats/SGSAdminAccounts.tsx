function SGSAdminAccounts() {
  const activities = [
    {
      title: "Dept. of Computer Science department onboarded",
      time: "2 hours ago",
    },
    {
      title: "Dept. of Statistics and Actuarial Science department onboarded",
      time: "Yesterday",
    },
    {
      title: "New SGS admin account onboarded",
      time: "2 days ago",
    },
    {
      title: "New SGS admin account onboarded",
      time: "A week ago",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        SGS Admin Accounts
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Onboarding Progress
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full w-3/4" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Recent Activities
        </h3>

        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex justify-between items-start">
              <p className="text-sm text-gray-900 flex-1 pr-4">
                {activity.title}
              </p>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SGSAdminAccounts;
