import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Header from "../shared/text/Header";

interface SupervisorData {
  name: string;
  studentsUnderSupervision: number;
  studentsCompleted: number;
}

const DepartmentProgressAnalytics: React.FC = () => {
  const supervisorData: SupervisorData[] = [
    {
      name: "Prof. Solomon Mensah",
      studentsUnderSupervision: 90,
      studentsCompleted: 75,
    },
    {
      name: "Dr. Sarah Williams",
      studentsUnderSupervision: 82,
      studentsCompleted: 55,
    },
    {
      name: "Prof. Kofi Manu",
      studentsUnderSupervision: 95,
      studentsCompleted: 72,
    },
  ];

  // Sample data for the line chart (Progress Analytics)
  // const progressAnalyticsData = [
  //   { month: 'Jan', progress: 65 },
  //   { month: 'Feb', progress: 70 },
  //   { month: 'Mar', progress: 68 },
  //   { month: 'Apr', progress: 72 },
  //   { month: 'May', progress: 78 },
  //   { month: 'Jun', progress: 85 },
  //   { month: 'Jul', progress: 88 },
  //   { month: 'Aug', progress: 92 },
  //   { month: 'Sep', progress: 89 },
  //   { month: 'Oct', progress: 94 },
  //   { month: 'Nov', progress: 96 },
  //   { month: 'Dec', progress: 98 }
  // ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        <div className=" mb-8">
          {/* Student Progress Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Student progress
            </h2>
            <div className="h-160">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={supervisorData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis
                    dataKey="name"
                    angle={-35}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    fontSize={12}
                  />
                  <YAxis />
                  <Bar
                    dataKey="studentsUnderSupervision"
                    fill="#a78bfa"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="studentsCompleted"
                    fill="#fca5a5"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className=" space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">
                  No. of students under supervision
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-300 rounded-sm mr-2"></div>
                <span className="text-sm text-gray-600">
                  No. of students completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
        {/*  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">*/}
        {/*    <div className="text-3xl font-bold text-blue-600 mb-2">267</div>*/}
        {/*    <div className="text-gray-600">Total Students</div>*/}
        {/*  </div>*/}
        {/*  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">*/}
        {/*    <div className="text-3xl font-bold text-green-600 mb-2">202</div>*/}
        {/*    <div className="text-gray-600">Students Completed</div>*/}
        {/*  </div>*/}
        {/*  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">*/}
        {/*    <div className="text-3xl font-bold text-purple-600 mb-2">75.7%</div>*/}
        {/*    <div className="text-gray-600">Completion Rate</div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default DepartmentProgressAnalytics;
