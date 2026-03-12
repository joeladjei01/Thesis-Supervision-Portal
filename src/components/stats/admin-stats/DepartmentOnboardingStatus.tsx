function DepartmentOnboardingStatus() {
  const departments = [
    {
      name: "Dept. of Computer Science",
      code: "SPMS",
      status: "Active",
      progress: 100,
    },
    {
      name: "Dept. of Mathematics",
      code: "SPMS",
      status: "Active",
      progress: 100,
    },
    {
      name: "Dept. of Statistics and Actuarial Science",
      code: "SPMS",
      status: "Active",
      progress: 100,
    },
    {
      name: "Dept. of Physics",
      code: "SPMS",
      status: "Not Started",
      progress: 0,
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-blue-600";
    return "bg-gray-300";
  };

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Department Onboarding Status
      </h2>

      <div className="space-y-6">
        {departments.map((dept, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{dept.name}</h3>
                <p className="text-sm text-gray-500">{dept.code}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                  dept.status
                )}`}
              >
                {dept.status}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                  dept.progress
                )}`}
                style={{ width: `${dept.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentOnboardingStatus;
