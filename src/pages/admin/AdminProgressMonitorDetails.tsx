import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import type { Student, Supervisor } from "../../utils/types";
import {
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DonutChart } from "../../components/shared/chart/DonutChart";
import { ArrowLeft } from "lucide-react";

const AdminProgressMonitorDetails = () => {
  const { id } = useParams<{ id: string }>();
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const { data: programmeLevels } = useQuery({
    queryKey: ["ll-programme-levels"],
    queryFn: async () => {
      const { data }: any = await axios.get("/superadmin/programme-levels/");
      return data.data || [];
    },
    enabled: true,
  });

  const { data: departmentData } = useQuery({
    queryKey: ["progress-depart"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(`/departments/retrieve/${id}/`);
        return data;
      } catch (error) {
        console.error("Error fetching department data:", error);
        toast.error("Failed to fetch department data.");
      }
    },
  });

  const fetchResearchAreas = async () => {
    try {
      const { data }: any = await axios.get(
        `/departments/department-research-areas/${departmentData.department.id}/`,
      );
      return data.data;
    } catch (error) {
      console.error("Error fetching research areas:", error);
      toast.error("Failed to fetch research areas.");
    }
  };

  const { data: departResearchAreas } = useQuery({
    queryFn: fetchResearchAreas,
    queryKey: ["fetch-research-areas"],
    enabled: departmentData?.department.id ? true : false,
  });

  //fetch students
  const fetchStudents = async (): Promise<Student[]> => {
    try {
      const response = await axios.get<{ data: Student[] }>(
        `/students/search/?search=${departmentData.department.name}`,
      );
      return response.data.data;
    } catch (error) {
      toast.error("Error fetching students");
      console.error("Error fetching students:", error);
    }
  };

  const { data: departStudent } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    enabled: !!departmentData?.department.name,
  });

  const fetchSupervisors = async (): Promise<Supervisor[]> => {
    try {
      const response = await axios.get<{ data: Supervisor[] }>(
        `/supervisors/supervisor/search/?search=${departmentData.department.name}`,
      );
      return response.data.data;
    } catch (error) {
      toast.error("Error fetching supervisors");
      console.error("Error fetching supervisors:", error);
    }
  };

  const { data: departSupervisors } = useQuery({
    queryFn: fetchSupervisors,
    queryKey: ["supervisors"],
    enabled: !!departmentData?.department.name,
  });

  const usersdata = [
    {
      name: "Supervisors",
      total: departSupervisors?.length,
    },
    {
      name: "students",
      total: departStudent?.length,
    },
  ];

  const researchAreas = departResearchAreas?.map((area: any) => ({
    name: area.name,
    numberOfSupersvisors: departSupervisors?.filter((supervisor: any) =>
      supervisor.research_area.find((ra: any) => ra.id === area.id),
    ).length,
  }));

  const programmeLevelColors = [
    "#F5C344",
    "#4D96FF",
    "#6BCB77",
    "#FF6B6B",
    "#845EC2",
    "#FFC75F",
    "#00C9A7",
    "#C34A36",
  ];

  const StudentProgrammeLevels = programmeLevels?.map(
    (level: any, index: number) => {
      const count = departStudent?.filter(
        (student: any) => student.programme_level.id === level.id,
      ).length;
      return {
        name: level.name,
        value: count || 0,
        color: programmeLevelColors[index % programmeLevelColors.length],
      };
    },
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-white dark:bg-background transition-colors duration-300">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="group bg-gray-100 dark:bg-card flex items-center justify-center rounded-lg gap-2 cursor-pointer text-gray-700 dark:text-gray-200 py-2.5 px-4 border dark:border-border/50 hover:bg-gray-200 dark:hover:bg-secondary/20 transition-all duration-200 font-medium shadow-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>
      <div className="mb-10">
        <h2 className="text-center sm:text-left text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-ug-blue to-blue-600 dark:from-white dark:via-blue-400 dark:to-blue-200 tracking-tight">
          {departmentData?.department.name.includes("Department of")
            ? ""
            : departmentData?.department.school === "institute"
              ? ""
              : "Department of"}{" "}
          {departmentData?.department.name}
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
          Comprehensive progress monitoring and analytics overview
        </p>
      </div>
      <div className="bg-white dark:bg-card p-6 rounded-2xl border dark:border-border shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-ug-blue dark:bg-blue-500 rounded-full" />
          Users Distribution
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart
              data={usersdata}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Bar dataKey="total" fill="#4D96FF" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-card p-6 rounded-2xl border dark:border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <div className="w-1.5 h-6 bg-green-500 rounded-full" />
            Research Areas Distribution
          </h3>
          <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-full border border-green-100 dark:border-green-800/30">
            Total Areas: {researchAreas?.length}
          </span>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <BarChart
              data={researchAreas}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '12px', 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                }}
              />
              <Bar dataKey="numberOfSupersvisors" fill="#6BCB77" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-card p-6 rounded-2xl border dark:border-border shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
          Student Programme Levels
        </h3>
        <div className="h-[500px] w-full">
          <DonutChart
            data={StudentProgrammeLevels || []}
            title="Distribution Overview"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProgressMonitorDetails;
