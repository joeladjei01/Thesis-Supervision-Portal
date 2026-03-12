import { Outlet } from "react-router";
import AppPanel from "../components/shared/navber-panel/AppPanel";
import Navbar from "../components/shared/navber-panel/Navbar";
import { useEffect, useState } from "react";
// import NotifiPanel from "../components/notification/NotifiPanel";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Student, Supervisor } from "../utils/types";
import { useDepartmentDataStore } from "../store/useDepartmentDataStore";
import userStore from "../store";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useSupervisorDataStore } from "../store/useSupervisorDataStore";
import { useStudentDataStore } from "../store/useStudentDataStore";
import useActiveSessionStore from "../store/useActiveSessionStore";
import Modal from "./Modal";
import useAlert from "../hooks/useAlert";
import InactiveAlert from "../components/shared/InactiveAlert";

const RootLayout = () => {
  const DEPARTMENT = import.meta.env.VITE_DEPARTMENT_ROLE;
  const SUPERVISOR = import.meta.env.VITE_SUPERVISOR_ROLE;
  const STUDENT = import.meta.env.VITE_STUDENT_ROLE;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifiOpen, setnotifiOpen] = useState(false);
  const { person, userInfo, isLogin, updateIsLogin, reset } = userStore();
  const axios = useAxiosPrivate();
  const {
    setSupervisors,
    setStudents,
    setProgrammeLevels,
    setQuotas,
    setProgramTitles,
    setResearchAreas,
    setRequests: setDepartmentRequests,
  } = useDepartmentDataStore();
  const {
    setAssignedStudents,
    setTopicProposals,
    setMeetingSchedules,
    setProgrammeLevels: setSupervisorProgrammeLevels,
  } = useSupervisorDataStore();
  const {
    setChapters,
    setFeedbacks,
    setTopics,
    setSubmissions,
    setSupervisors: setStudSupervisors,
  } = useStudentDataStore();

  //---------------------------------------------------------------------------------
  //------------------------------- Department Data ------------------------------------
  //fetch supervisors
  const fetchSupervisors = async (): Promise<Supervisor[]> => {
    try {
      const response = await axios.get<{ data: Supervisor[] }>(
        `/supervisors/supervisor/search/?search=${person.department.name}`,
      );
      setSupervisors(response.data.data);
      return response.data.data;
    } catch (error) {
      toast.error("Error fetching supervisors");
      console.error("Error fetching supervisors:", error);
    }
  };

  useQuery({
    queryFn: fetchSupervisors,
    queryKey: ["supervisors"],
    enabled: userInfo?.role === DEPARTMENT,
  });

  //fetch students
  const fetchStudents = async (): Promise<Student[]> => {
    try {
      const response = await axios.get<{ data: Student[] }>(
        `/students/search/?search=${person.department.name}`,
      );
      setStudents(response.data.data);
      return response.data.data;
    } catch (error) {
      toast.error("Error fetching students");
      console.error("Error fetching students:", error);
    }
  };

  useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    enabled: userInfo?.role === DEPARTMENT,
  });

  const { data: dapart } = useQuery({
    queryKey: ["department-requests"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/supervisor-requests/department/${person?.department.id}/student/`,
        );
        setDepartmentRequests(data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching department requests:", error);
      }
    },
    enabled: userInfo.role === DEPARTMENT,
  });

  //fetch quotas
  const fetchQuota = async () => {
    try {
      const { data }: any = await axios.get(
        `/departments/quotas/${person.department.id}/retrieve/`,
      );
      setQuotas(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching quota:", error);
      toast.error("Error fetching quota");
    }
  };

  useQuery({
    queryFn: fetchQuota,
    queryKey: ["fetch-quotas"],
    enabled: userInfo?.role === DEPARTMENT,
  });

  //fetch program titles
  const fetchProgramTitles = async () => {
    try {
      const { data }: any = await axios.get(
        `/departments/${person.department.id}/programs/`,
      );
      setProgramTitles(data.data === null ? [] : data.data);
      return data.data;
    } catch (error) {
      toast.error("Error fetching program titles");
      console.error("Error fetching program titles", error);
    }
  };

  useQuery({
    queryFn: fetchProgramTitles,
    queryKey: ["fetch-program-titles"],
    enabled: userInfo?.role === DEPARTMENT,
  });

  //Research Areas
  const fetchResearchAreas = async () => {
    try {
      const { data }: any = await axios.get(
        `/departments/department-research-areas/${person.department.id}/`,
      );
      setResearchAreas(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching research areas:", error);
      // toast.error("Failed to fetch research areas.");
    }
  };

  useQuery({
    queryFn: fetchResearchAreas,
    queryKey: ["fetch-research-areas"],
    enabled: userInfo?.role === DEPARTMENT,
  });

  //---------------------------------------------------------------------------------
  //---------------------------------- Supervsior Data ----------------------------------------

  useQuery({
    queryKey: ["supervisor-students"],
    queryFn: async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data }: any = await axios.get(
          `/supervisors/supervisor/students/${person.id}/`,
        );
        setAssignedStudents(data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching supervisor's students:", error);
        throw new Error("Error fetching supervisor's students");
      }
    },
    enabled: userInfo?.role === SUPERVISOR,
  });

  useQuery({
    queryKey: ["supervisor-meeting-schedules"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(`/supervisors/meetings/`);
        setMeetingSchedules(data.data);
        console.log("Fetched meeting schedules:", data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching meeting schedules:", error);
        toast.error("Failed to fetch meeting schedules.");
        return [];
      }
    },
    enabled: userInfo?.role === SUPERVISOR,
  });

  //fetch Student topic proposals of supervisor
  useQuery({
    queryKey: ["fetchProposals"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(`/students/topics/`);
        setTopicProposals(data.data);
        return data.data;
      } catch (error) {
        toast.error("Error fetching topic proposals");
        console.log(error);
        return [];
      }
    },
    enabled: userInfo?.role === SUPERVISOR,
  });

  //---------------------------------------------------------------------------------
  //-----------------------------------Student Data----------------------------------------------

  useQuery({
    queryFn: async () => {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data }: any = await axios.get(
        `/students/chapter/student/${person.id}/`,
      );
      console.log(data);
      setSubmissions(data.data);
      return data.data;
    },
    queryKey: ["student-submissions"],
    enabled: userInfo?.role === STUDENT,
  });

  const fetchChapters = async (id) => {
    try {
      const { data }: any = await axios.get(
        `/students/chapter/topic/${id}/assignments/`,
      );
      setChapters(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data }: any = await axios.get(
        `/students/chapter/student/${person.id}/feedbacks/`,
      );
      setFeedbacks(data.data);
      return data.data;
    } catch (error) {
      toast.error("Failed to fetch feedbacks");
      console.error("Error fetching feedbacks:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const { data }: any = await axios.get(
        `/students/topics/students/${person.id}/`,
      );
      setTopics(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { data: topics } = useQuery({
    queryKey: ["student-topics"],
    queryFn: fetchTopics,
    enabled: userInfo?.role === STUDENT,
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ["student-chapters"],
    queryFn: () => {
      const approvedTopic = topics?.find((t: any) => t.status === "approved");
      if (approvedTopic) {
        return fetchChapters(approvedTopic.id);
      }
      return [];
    },
    enabled: !!topics && userInfo?.role === STUDENT,
  });

  useQuery({
    queryKey: ["student-feedbacks"],
    queryFn: fetchFeedbacks,
    enabled: userInfo?.role === STUDENT,
  });

  //Student Supervisors
  useQuery({
    queryKey: ["student-supervisors", person?.id],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/supervisors/${person?.id}/`,
        );
        setStudSupervisors(data.data);
        return data.data;
      } catch (error) {
        console.error("Error fetching student supervisors:", error);
        throw error;
      }
    },
    enabled: userInfo?.role === STUDENT,
    refetchOnWindowFocus: false,
  });

  ///---------------------------------------------------------------------------------
  //----------------------------------- Depart & Super ----------------------------------------------
  useQuery({
    queryKey: ["programme-levels"],
    queryFn: async () => {
      const { data }: any = await axios.get("/superadmin/programme-levels/");
      setProgrammeLevels(data.data);
      setSupervisorProgrammeLevels(data.data);
      return data.data || [];
    },
    enabled: userInfo?.role === DEPARTMENT || userInfo?.role === SUPERVISOR,
  });
  const alert = useAlert();

  return (
    <>
      <InactiveAlert />
      <div>
        {/* <NotifiPanel isOpen={notifiOpen} onOpenPanel={setnotifiOpen} /> */}
        <AppPanel sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className={"lg:pl-60"}>
          <Navbar setSidebarOpen={setSidebarOpen} notifiOpen={setnotifiOpen} />

          <main className="py-6 min-h-[calc(100vh-64px)]  bg-background dark:bg-slate-950 max-w-7xl mx-auto">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      { }
    </>
  );
};

export default RootLayout;
