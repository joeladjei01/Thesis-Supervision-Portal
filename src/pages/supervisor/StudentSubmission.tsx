import React, { useState, useEffect } from "react";
import Header from "../../components/shared/text/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userStore from "../../store";
import OutlineButton from "../../components/shared/buttons/OutlineButton";
import toast from "react-hot-toast";
import usePageTile from "../../hooks/usePageTitle";
import StudentSubmissionsTable from "../../components/supervisor/SubmissionsTable";
import { Search, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import { useNavigate } from "react-router";

interface ISubmissionFilter {
  status?: "all" | "pending" | "reviewed";
  level?: string;
  chapter?: string;
}

interface ITabConfig {
  key: string;
  label: string;
  count: number;
  filter: ISubmissionFilter;
}

// Tab Component
interface ITabProps {
  tabs: ITabConfig[];
  activeTab: string;
  onTabChange: (tabKey: string) => void;
}

const TabNavigation: React.FC<ITabProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav
        className={
          "overflow-auto flex w-full justify-between bg-blue-100 p-[3px] rounded-sm"
        }
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-2 px-4 font-medium text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-white shadow-sm "
                : "hover:text-blue-700"
            } cursor-pointer font-semibold text-blue-900 rounded-sm`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </nav>
    </div>
  );
};

//--------------------------------------------------------------------------

// Main Dashboard Component (Composition)
const ReviewSubmissions: React.FC = () => {
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { person } = userStore();
  const { assignedStudents } = useSupervisorDataStore();
  const navigate = useNavigate();
  usePageTile("ThesisFlow - Student Submissions");

  const axios = useAxiosPrivate();

  const { data: feedbacks } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      try {
        const { data }: any = await axios.get(
          `/students/chapter/supervisor/${person.id}/feedbacks/`,
        );
        return data.data;
      } catch (error) {
        toast.error("Failed to load feedbacks");
        console.log(error);
        return [];
      }
    },
  });

  const fetchSubmissions = async () => {
    try {
      const { data }: any = await axios.get(
        `/students/chapter/supervisor/${person.id}/`,
      );
      // setSubmissions(data.data);
      return data.data;
    } catch (error) {
      toast.error("Failed to load submissions");
      console.log(error);
      return [];
    }
  };

  const { data: submissions, isLoading: loading } = useQuery({
    queryKey: ["studentSubmissions"],
    queryFn: fetchSubmissions,
    refetchOnWindowFocus: false,
  });

  const tabs: ITabConfig[] = [
    {
      key: "pending",
      label: "Pending Review",
      count: submissions?.filter((s) => s.approved !== true).length,
      filter: { status: "pending" },
    },
    {
      key: "reviewed",
      label: "Reviewed",
      count: submissions?.filter((s) => s.approved === true).length,
      filter: { status: "reviewed" },
    },
    {
      key: "all",
      label: "All Submission",
      count: submissions?.length,
      filter: { status: "all" },
    },
  ];

  useEffect(() => {
    filterSubmissions();
  }, [activeTab, submissions]);

  const filterSubmissions = () => {
    const currentTab = tabs.find((tab) => tab.key === activeTab);
    if (!currentTab) return;

    if (currentTab.filter.status === "all") {
      setFilteredSubmissions(submissions);
    } else {
      if (currentTab.filter.status === "pending") {
        setFilteredSubmissions(submissions?.filter((s) => s.approved !== true));
        return;
      } else if (currentTab.filter.status === "reviewed") {
        setFilteredSubmissions(submissions?.filter((s) => s.approved === true));
        return;
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter submissions based on search query
    const filtered = filteredSubmissions.filter(
      (submission) =>
        submission.student.name.toLowerCase().includes(query) ||
        submission.chapter_assignment.topic.title.toLowerCase().includes(query),
    );
    setFilteredSubmissions(query ? filtered : filteredSubmissions);
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <Header
          title="Student Submissions"
          subtitle="View student submission and give a comment"
        />
      </div>

      {/* {submissions?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64">
          {!loading && (
            <>
              <svg
                className="h-32 w-32 text-gray-400 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <p className="text-gray-500 mb-4">No submissions available.</p>
            </>
          )}
        </div>
      )} */}

      {/* {loading && (
        <OutlineButton
          title="Refreshing..."
          onClick={() => fetchSubmissions()}
          className="py-2 mx-auto"
          disabled={loading}
          Icon={
            <svg
              className={`h-5 w-5 text-gray-500 ${loading ? "animate-spin" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        />
      )} */}

      {/* Tab Navigation */}
      {/* {!loading && submissions?.length > 0 && (
        <div className="overflow-x-auto mb-4">
          <div className="mb-1 min-w-md">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
        </div>
      )} */}

      {/* Search Bar */}
      {/* {!loading && submissions?.length > 0 && (
        <div className="mb-6 flex items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search by student name, or topic..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      )} */}

      {/* {!loading && submissions?.length > 0 && (
        <StudentSubmissionsTable
          submissions={filteredSubmissions}
          feedbacks={feedbacks}
        />
      )} */}

      {/* Assigned Students Section */}
      {assignedStudents && assignedStudents.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">My Students</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedStudents.map((student) => (
              <div
                key={student.id}
                onClick={() =>
                  navigate(
                    `/supervisor/student/${student.student.id}/submissions`,
                  )
                }
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-900 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1 text-gray-800 group-hover:text-blue-900">
                      {student.student.name}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      ID: {student.student.student_id}
                    </p>
                    {student.student.programme && (
                      <p className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 inline-block">
                        {student.student.programme}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-900 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;
